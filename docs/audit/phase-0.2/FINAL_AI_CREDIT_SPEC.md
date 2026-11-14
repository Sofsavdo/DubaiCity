# FINAL AI CREDIT SPEC (Phase 0.2)

Supersedes `docs/audit/phase-0.1/AI_CREDIT_CONTROL_SPEC.md` §3–§5. The Phase 0.1 file is preserved unchanged.
Legend: **[F]** verified fact · **[R]** recommendation · **[U]** unresolved / needs verification.

## 0. What was wrong in Phase 0.1 (all corrected below)

| # | Defect | Fix in this document |
|---|---|---|
| 1 | Invariant `available + reserved = SUM(delta)` was inconsistent: a reserve lowered `available` yet wrote a negative ledger delta, so SUM fell while `reserved` rose | §1 double-entry model; invariant is `available + reserved + spent + expired = issued` |
| 2 | `spend_counters` primary key contained nullable `provider` (NULLs are distinct in a PG unique index → duplicate "global" rows) | §4 `scope_key TEXT NOT NULL` primary key |
| 3 | `credit_prices` referenced, never defined | §3 schema |
| 4 | No provider-level / global ceiling enforcement path | §4 |
| 5 | Crash between provider call and settlement unhandled | §5 state machine + recovery sweep |
| 6 | Duplicate provider call for same idempotency key possible | §5.2 conditional claim |
| 7 | Retry rules assumed provider idempotency | §6 `retrySafety` capability, default "unsafe" |

## 1. Credit accounting model (double entry)  [R]

Credits are an internal unit. One credit = a fixed internal value; its USD cost is modelled separately (§3). Credits never move outside the five buckets below.

```sql
CREATE TABLE app.credit_accounts (
  user_id    uuid PRIMARY KEY REFERENCES app.users(id),
  available  bigint NOT NULL DEFAULT 0 CHECK (available >= 0),
  reserved   bigint NOT NULL DEFAULT 0 CHECK (reserved  >= 0),
  spent      bigint NOT NULL DEFAULT 0 CHECK (spent     >= 0),
  expired    bigint NOT NULL DEFAULT 0 CHECK (expired   >= 0),
  issued     bigint NOT NULL DEFAULT 0 CHECK (issued    >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT balance_closed CHECK (available + reserved + spent + expired = issued)
);

CREATE TYPE app.credit_bucket AS ENUM ('available','reserved','spent','expired','issued');

-- one row per bucket movement; a "transaction" = rows sharing txn_id
CREATE TABLE app.credit_ledger (
  id        bigserial PRIMARY KEY,
  txn_id    uuid NOT NULL,
  user_id   uuid NOT NULL REFERENCES app.users(id),
  bucket    app.credit_bucket NOT NULL,
  delta     bigint NOT NULL CHECK (delta <> 0),
  reason    text NOT NULL,                 -- grant|reserve|settle|release|expire|refund|admin_adjust
  ref_id    uuid,                          -- reservation or order id
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON app.credit_ledger (user_id, created_at);
CREATE INDEX ON app.credit_ledger (txn_id);
```

### Movement table

| Event | available | reserved | spent | expired | issued |
|---|---|---|---|---|---|
| Grant N (daily free, purchase, bonus) | +N | | | | +N |
| Reserve N | −N | +N | | | |
| Settle actual A ≤ N | | −N | +A | | |
| …release of remainder (N−A) in same txn | +(N−A) | (included in −N above) | | | |
| Release N (call failed, provider never charged) | +N | −N | | | |
| Expire N (from available) | −N | | | +N | |
| Refund A after settle (admin) | +A | | −A | | |

**Invariants**
- I1 (per account, enforced by CHECK): `available + reserved + spent + expired = issued`.
- I2 (per transaction, enforced by deferred trigger or by the single SQL function that writes it): every txn **except grants** sums to zero across non-`issued` buckets; a grant's non-`issued` buckets sum equals its `issued` delta.
- I3 (global audit job, nightly): for each user, `SUM(delta) FILTER (WHERE bucket=b) = credit_accounts.<b>` for all five buckets.

Because the movement is a pair of equal and opposite deltas, the original contradiction (negative ledger delta but positive `reserved`) cannot occur.

### Reserve, SQL example [R]

```sql
-- Single statement; the CHECK constraints are the final safety net.
WITH moved AS (
  UPDATE app.credit_accounts
     SET available = available - $2, reserved = reserved + $2, updated_at = now()
   WHERE user_id = $1 AND available >= $2
  RETURNING user_id
), r AS (
  INSERT INTO app.ai_reservations
    (id, user_id, idempotency_key, credits_reserved, state, expires_at, request_hash)
  SELECT $3, user_id, $4, $2, 'reserved', now() + interval '2 minutes', $5 FROM moved
  RETURNING id
)
INSERT INTO app.credit_ledger (txn_id, user_id, bucket, delta, reason, ref_id)
SELECT $6, $1, b.bucket, b.delta, 'reserve', r.id
FROM r, (VALUES ('available'::app.credit_bucket, -$2::bigint), ('reserved', $2::bigint)) AS b(bucket, delta);
-- 0 rows returned => insufficient credits => HTTP 402, provider NOT called.
```

## 2. Reservation state machine [R]

```sql
CREATE TYPE app.reservation_state AS ENUM
  ('reserved','dispatching','settled','released','expired','unknown');

CREATE TABLE app.ai_reservations (
  id                uuid PRIMARY KEY,
  user_id           uuid NOT NULL REFERENCES app.users(id),
  idempotency_key   text NOT NULL,
  request_hash      bytea NOT NULL,
  provider          text,
  credits_reserved  bigint NOT NULL CHECK (credits_reserved > 0),
  credits_settled   bigint CHECK (credits_settled >= 0),
  est_cost_micro_usd bigint NOT NULL DEFAULT 0,
  state             app.reservation_state NOT NULL,
  provider_request_id text,
  response_ref      text,                -- pointer to stored response (or hash)
  attempt           int NOT NULL DEFAULT 0,
  expires_at        timestamptz NOT NULL,
  dispatched_at     timestamptz,
  settled_at        timestamptz,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX ON app.ai_reservations (state, expires_at);
```

```
 reserved --claim--> dispatching --provider ok--> settled
    |                    |  \--provider definite failure--> released
    |                    \----no result before deadline / crash--> unknown --reconcile--> settled | released
    \--expires_at passed, never dispatched--> expired(=released) 
```

Only conditional `UPDATE … WHERE state = <expected>` moves a row; zero rows updated = lost race → caller must stop and re-read.

## 3. Prices [R]

All money in **micro-USD (1e-6 USD)** integers; no floats. Prices are versioned and never edited in place.

```sql
CREATE TABLE app.provider_prices (            -- what the provider charges us
  id            bigserial PRIMARY KEY,
  provider      text NOT NULL,
  model         text NOT NULL,
  unit          text NOT NULL CHECK (unit IN ('input_token','output_token','audio_second','character','request')),
  micro_usd_per_million_units bigint NOT NULL CHECK (micro_usd_per_million_units >= 0),
  valid_from    timestamptz NOT NULL,
  valid_to      timestamptz,
  source_note   text NOT NULL,                -- where the owner got the number
  CHECK (valid_to IS NULL OR valid_to > valid_from)
);

CREATE TABLE app.credit_prices (              -- what a feature costs the learner in credits
  id           bigserial PRIMARY KEY,
  feature      text NOT NULL,                 -- 'speaking_turn','writing_eval','explain','tts_clip'
  tier         text NOT NULL DEFAULT 'any',   -- 'free'|'plus'|'pro'|'any'
  credits      bigint NOT NULL CHECK (credits > 0),
  max_output_units bigint,                    -- hard cap passed to provider (tokens/seconds)
  valid_from   timestamptz NOT NULL,
  valid_to     timestamptz,
  CHECK (valid_to IS NULL OR valid_to > valid_from)
);
```

- Resolution: pick the row with `valid_from <= now() AND (valid_to IS NULL OR valid_to > now())`, newest `valid_from` first. Overlap prevention: an `EXCLUDE USING gist` constraint on `(provider, model, unit, tstzrange(valid_from, valid_to))` needs the `btree_gist` extension. **[U] availability of `btree_gist` on the chosen managed PostgreSQL is unverified**; fallback is a unique partial index `WHERE valid_to IS NULL` plus an application-level close-then-insert in one transaction.
- The reservation row stores the *resolved* `credits_reserved` and `est_cost_micro_usd` so later price edits never change an in-flight call.
- **Actual numbers are not defined here.** No price, model name or cost is invented; every row requires `source_note` from the owner. **[U] OD-09.**

## 4. Spend ceilings (provider-level and global) [R]

```sql
CREATE TABLE app.spend_ceilings (
  scope_key      text PRIMARY KEY,            -- 'global' | 'provider:openai' | 'provider:azure-tts'
  period         text NOT NULL CHECK (period IN ('day','month')),
  limit_micro_usd bigint NOT NULL CHECK (limit_micro_usd >= 0),
  enabled        boolean NOT NULL DEFAULT true
);

CREATE TABLE app.spend_counters (
  scope_key      text NOT NULL,               -- NOT NULL: no nullable column in the key
  period_start   date NOT NULL,               -- UTC day, or first of month
  committed_micro_usd bigint NOT NULL DEFAULT 0 CHECK (committed_micro_usd >= 0),
  reserved_micro_usd  bigint NOT NULL DEFAULT 0 CHECK (reserved_micro_usd  >= 0),
  PRIMARY KEY (scope_key, period_start)
);
```

A request touches **two** scopes: `global` and `provider:<name>`. Reserving locks both rows in a fixed order (alphabetical on `scope_key`) to avoid deadlocks:

```sql
-- inside the reserve transaction, before touching credits
INSERT INTO app.spend_counters (scope_key, period_start) VALUES ('global',$1),('provider:'||$2,$1)
  ON CONFLICT DO NOTHING;

UPDATE app.spend_counters c
   SET reserved_micro_usd = reserved_micro_usd + $3
  FROM app.spend_ceilings s
 WHERE c.scope_key = s.scope_key AND c.period_start = $1
   AND c.scope_key IN ('global','provider:'||$2)
   AND (NOT s.enabled OR c.committed_micro_usd + c.reserved_micro_usd + $3 <= s.limit_micro_usd);
-- must update exactly 2 rows, else ROLLBACK (ceiling hit => HTTP 503 "AI paused", no provider call)
```

- **Fail closed:** missing ceiling row for an active provider ⇒ provider is treated as disabled. A deploy must not enable a provider without a ceiling row. **[R]**
- Settle: `reserved -= est`, `committed += actual_cost` (actual from provider usage data; if unavailable use `est` — **[U]** whether each provider returns usage is unverified).
- Monthly + daily ceilings: two `period` rows per scope are represented by distinct `scope_key` suffixes (`global:day`, `global:month`) — decision kept simple: one `scope_key` per (scope, period).
- Overshoot bound: committed spend can exceed a ceiling only by (actual − estimate) of calls in flight; `max_output_units` per call bounds this. **[R]**
- Owner kill switch: `UPDATE spend_ceilings SET limit_micro_usd = 0` blocks new reservations at once.

## 5. Crash recovery and duplicate-call prevention [R]

### 5.1 Claiming a call (prevents duplicate provider calls)

```sql
-- Only one worker can move reserved -> dispatching for a given reservation.
UPDATE app.ai_reservations
   SET state='dispatching', dispatched_at=now(), attempt=attempt+1
 WHERE id=$1 AND state='reserved' AND expires_at > now()
RETURNING id;           -- 0 rows => someone else owns it, or it expired: DO NOT call provider
```

Same-key replay: `INSERT … ON CONFLICT (user_id, idempotency_key) DO NOTHING`; then read the row:
- same `request_hash` and `state='settled'` → return stored response, **no provider call, no charge**;
- same hash and `state IN ('reserved','dispatching')` → HTTP 409 `in_progress`;
- different `request_hash` → HTTP 422 `idempotency_key_reuse`.

### 5.2 Crash windows

| Crash point | DB state afterwards | Recovery |
|---|---|---|
| after reserve, before claim | `reserved`, `expires_at` passes | sweep: release → credits back, spend reserved back. Provider never called |
| after claim, before provider request sent | `dispatching` | indistinguishable from next row → handled as `unknown` |
| after provider request sent, before response stored | `dispatching` | `unknown` |
| after response, before settle commit | `dispatching` (response not durable) | `unknown` |
| settle committed | `settled` | none |

**Sweep (every minute, `FOR UPDATE SKIP LOCKED`):**
1. `reserved AND expires_at < now()` → release (credits + counters back).
2. `dispatching AND dispatched_at < now() - provider_timeout - grace` → `unknown`.
3. `unknown` is **never auto-released or auto-retried when `retrySafety='unsafe'`**. Policy **[R]**: the learner is *not* charged; credits are released; the provider cost is booked to `committed_micro_usd` at the **estimate** (conservative: assume we were billed); an `ai_incidents` row is written. The learner may retry with a *new* idempotency key. This favours the learner and the spend ceiling over exactness. **[U] OD-09** confirms this policy.
4. If the provider offers a lookup by request id and the owner verifies it, `unknown → settled|released` by lookup. **[U]** no provider lookup is verified today.

### 5.3 Expiry / settlement races

- Settle: `UPDATE … SET state='settled' WHERE id=$1 AND state='dispatching'`. If 0 rows (sweeper already moved it to `unknown`), settlement is **re-attempted as a late settle**: allowed from `unknown` only when response is in hand; it re-charges the user `A` (if available balance permits, else records debt = none, charge min(A, available)) and reverses the estimate booking. Either path runs inside one transaction and exactly one `UPDATE` can win.
- Sweeper and settle both use conditional updates; no row can reach two terminal states.
- Expiry never touches `dispatching` rows, so an in-progress call is not cancelled under it.

### 5.4 Settlement SQL example

```sql
UPDATE app.ai_reservations
   SET state='settled', credits_settled=$2, settled_at=now(), response_ref=$3
 WHERE id=$1 AND state='dispatching'
RETURNING user_id, credits_reserved;
-- then, same transaction:
UPDATE app.credit_accounts
   SET reserved = reserved - $4,            -- credits_reserved
       spent    = spent + $2,
       available= available + ($4 - $2),
       updated_at = now()
 WHERE user_id=$5;
-- ledger rows: reserved −$4, spent +$2, available +($4−$2)  (sum 0)
```
`$2 <= $4` is enforced: actual credit charge is capped at the reserved amount (price is fixed per feature, so normally equal).

## 6. Provider retry behaviour [R]

No provider idempotency is assumed.

```ts
interface ProviderCapabilities {
  retrySafety: 'unsafe' | 'safe_if_no_response' | 'idempotent_key';  // default 'unsafe'
  reportsUsage: boolean;     // default false
  lookupByRequestId: boolean;// default false
}
```

- Network error **before any byte was sent** (DNS/connect failure): one retry allowed, same reservation; the state stays `dispatching` and `attempt` increments.
- Any error **after the request body was sent**: for `retrySafety='unsafe'` no automatic retry; reservation → `unknown`.
- HTTP 429/5xx with a body proving rejection: treated as definite failure → `released`. Without proof, `unknown`.
- Maximum 2 attempts per reservation; a new learner attempt needs a new idempotency key (and a new reservation).
- Capabilities are set per provider only after the owner verifies them. **[U]**

## 7. Daily free credits and time zone [R]

- Stored per user: `users.timezone` (IANA, e.g. `Asia/Tashkent`), default taken from the browser (`Intl.DateTimeFormat().resolvedOptions().timeZone`), validated against a server allow-list. **[F]** Node 22 / ICU 78.3 supports `Asia/Tashkent`.
- Local date: `(now() AT TIME ZONE users.timezone)::date`.

```sql
CREATE TABLE app.ai_daily_usage (
  user_id uuid NOT NULL REFERENCES app.users(id),
  local_date date NOT NULL,
  credits_granted bigint NOT NULL DEFAULT 0,
  credits_used bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, local_date)
);
-- daily grant is idempotent
INSERT INTO app.ai_daily_usage (user_id, local_date, credits_granted) VALUES ($1,$2,$3)
ON CONFLICT (user_id, local_date) DO NOTHING RETURNING 1;
-- only if a row was inserted: credit grant ledger txn in the same transaction.
```
- Changing time zone cannot yield two grants in the same UTC instant: the grant is keyed by local date; a user flipping zones can at most obtain one extra grant across a date boundary. **Accepted risk, bounded by daily cap and spend ceiling.** Time-zone changes limited to 1 per 7 days. **[R]**
- Unspent free credits expire at local end of day (move `available → expired`) by the sweeper. **[R]** Paid credits do not expire unless the owner decides otherwise **[U] OD-09**.
- DST: `Asia/Tashkent` has no DST **[F] (as per IANA data in ICU, to be asserted by a test)**; other zones are handled by the `AT TIME ZONE` conversion.

## 8. Test cases (to be implemented in M5, none run yet)

| ID | Case | Expected |
|---|---|---|
| C-01 | Reserve with sufficient balance | available−N, reserved+N, ledger sums 0 |
| C-02 | Reserve with insufficient balance | 0 rows, no provider call, no ledger rows |
| C-03 | 50 concurrent reserves, balance for 10 | exactly 10 succeed; `available >= 0` always |
| C-04 | Same idempotency key twice sequentially | one reservation, one provider call |
| C-05 | Same key concurrently | one wins claim; other gets 409; provider mock called once |
| C-06 | Same key, different body | 422 |
| C-07 | Settle actual < reserved | remainder back to available; I1 holds |
| C-08 | Crash after reserve (kill worker) | sweeper releases after expiry; balance restored |
| C-09 | Crash after provider response, before settle | state → `unknown`; user not charged; estimate booked; incident row |
| C-10 | Late settle after sweeper marked `unknown` | exactly one terminal state; invariants hold |
| C-11 | Sweeper vs settle race, 1000 iterations | no row in two states; I1/I3 hold |
| C-12 | Global ceiling reached | reserve fails closed, 503 AI paused, no provider call |
| C-13 | Provider ceiling reached, global not | only that provider blocked |
| C-14 | Missing ceiling row | provider treated as disabled |
| C-15 | `spend_counters` bootstrap concurrent | single row per (scope, period) |
| C-16 | Price changes mid-flight | reservation uses resolved price |
| C-17 | Overlapping price rows | rejected (exclusion constraint or app check) |
| C-18 | Provider timeout, `unsafe` | no auto retry; `unknown` |
| C-19 | Connect failure pre-send | one retry |
| C-20 | Daily grant twice same local date | one grant |
| C-21 | Timezone flip across midnight | at most one extra grant; limited by 7-day rule |
| C-22 | Nightly audit I3 | zero drift on random workload |
| C-23 | Ledger append-only | UPDATE/DELETE on `credit_ledger` rejected by trigger/privileges |

## 9. Open items

- **[U] OD-09**: exact prices, provider/model choice, ceilings, daily free amount, credit expiry rule, `unknown` policy confirmation.
- **[U]** provider usage reporting and request-id lookup.
- **[U]** `btree_gist` availability.
