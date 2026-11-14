# BANDLY — AI Credit and Cost Control Specification

Design only; no AI provider has ever been called in production (**[F]** startup log: `AI: none, TTS: none`). This replaces the credit, limit and metering parts of `AI_COST_ARCHITECTURE.md` §5–6. **[F]** verified fact, **[R]** recommendation, **[U]** unresolved.

## 1. Requirements

1. A user can **never** spend more credits than they hold, including under any number of parallel requests.
2. Credits are charged for **actual** usage, bounded by what was reserved.
3. A provider failure must not cost the user credits.
4. A retried request (same idempotency key) is charged **once**.
5. Spend per user, per session, per day and **globally** is bounded.
6. Cost accounting stays reproducible when provider prices change.
7. Nothing the client sends (balance, plan, usage, price) is trusted.

## 2. Concepts

| Term | Meaning |
|---|---|
| **Credit** | An internal unit mapped to expected cost; features have a credit price configured in data (`credit_prices(feature, unit, credits)`) |
| **Reservation** | A hold that moves credits from `available` to `reserved` before a provider is called |
| **Settlement** | After the call, converts the reservation into a final charge and returns the unused part |
| **Usage record** | The factual cost: tokens/audio, provider, model, `price_id`, estimated micro-USD |
| **Cost ceiling** | A hard cap on estimated provider spend per period |

Credits and cost are **separate ledgers**: credits govern *what the user may do*; cost governs *what the platform may spend*. Both are updated in the same transaction at reservation and settlement time.

## 3. Data model (additions to `DATABASE_DESIGN.md`)

```
ai_credit_accounts (user_id PK, available BIGINT CHECK (available >= 0),
                    reserved  BIGINT CHECK (reserved  >= 0), updated_at)

ai_credit_ledger   (id, user_id, delta BIGINT, kind ENUM('grant','reserve','release','settle_adjust','expire','admin'),
                    reservation_id NULL, grant_ref NULL, created_at,
                    UNIQUE (user_id, grant_ref) WHERE grant_ref IS NOT NULL)   -- idempotent grants

ai_reservations    (id uuid PK, user_id, idempotency_key TEXT, feature, session_id NULL,
                    reserved_credits BIGINT, reserved_cost_micro BIGINT, status ENUM('reserved','settled','released','expired'),
                    created_at, expires_at, settled_credits, usage_record_id NULL, result_ref NULL,
                    UNIQUE (user_id, idempotency_key))

spend_counters     (period DATE, scope ENUM('global','provider'), provider NULL,
                    estimated_cost_micro BIGINT, PRIMARY KEY (period, scope, provider))

provider_prices    (id, provider, model, unit, price_micro_usd, valid_from, valid_to NULL, created_by, source_note,
                    EXCLUDE overlapping validity per (provider, model, unit))
```

**Invariants** (asserted by tests and a nightly job):
- `available + reserved = Σ ledger.delta` for each user (the balance row is a materialised sum of the ledger).
- `reserved = Σ reserved_credits of reservations in status 'reserved'`.
- Every reservation is in a terminal state (`settled`, `released`, `expired`) within `expires_at + grace`.
- No negative balance anywhere (`CHECK` constraints back the application logic).

## 4. Atomic reservation

All steps of one reservation run in **one PostgreSQL transaction**.

```
BEGIN;
-- 1. Idempotency: a repeated key returns the existing reservation (and its stored result if settled)
INSERT INTO ai_reservations (id, user_id, idempotency_key, feature, reserved_credits, reserved_cost_micro, status, expires_at)
VALUES (…, 'reserved', now() + ttl)
ON CONFLICT (user_id, idempotency_key) DO NOTHING RETURNING id;
-- if no row returned: SELECT the existing one and return it (no second charge)

-- 2. Entitlement and per-request limits (plan allows feature; input size within cap; session audio cap not exceeded)

-- 3. Take the user's row lock FIRST (serialises everything below for this user)
SELECT 1 FROM ai_credit_accounts WHERE user_id=$1 FOR UPDATE;
--    Concurrency guard: at most N in-flight reservations per user (N = 2), counted while holding the lock
SELECT count(*) FROM ai_reservations WHERE user_id=$1 AND status='reserved';

-- 4. Credit hold under a row lock: serialises parallel requests of the same user
UPDATE ai_credit_accounts
   SET available = available - $credits, reserved = reserved + $credits, updated_at = now()
 WHERE user_id = $1 AND available >= $credits
 RETURNING available;
-- 0 rows ⇒ insufficient credits ⇒ ROLLBACK and return "out of credits" (the reservation insert is rolled back too)

-- 5. Global and provider spend ceiling, atomically
UPDATE spend_counters SET estimated_cost_micro = estimated_cost_micro + $cost
 WHERE period = current_date AND scope='global' AND estimated_cost_micro + $cost <= $ceiling
 RETURNING 1;
-- 0 rows ⇒ ceiling reached ⇒ ROLLBACK and return "feature temporarily unavailable"

-- 6. Ledger entry (kind='reserve', delta = -credits … recorded as available→reserved move)
COMMIT;
```

Why parallel requests cannot overspend: step 4 is a single conditional `UPDATE` on the user's balance row. PostgreSQL takes a row lock; concurrent transactions queue behind it and each sees the **updated** `available`. Exactly as many succeed as the balance allows. The in-flight limit in step 3 is counted while the lock is held (so the lock also serialises the count), so two simultaneous requests cannot both observe "0 in flight".

The reserved amount is a **provable upper bound** of the call's cost (§7), so the later settlement can only return credits, never demand more.

## 5. Calling the provider and settlement

```
reserve (txn) → call provider with hard timeout (outside any DB transaction) → settle (txn)
```

**Never hold a database transaction open during the provider call.**

**Settlement (one transaction):**
1. `SELECT … FROM ai_reservations WHERE id=$1 AND status='reserved' FOR UPDATE` — a second settle attempt finds a terminal status and does nothing.
2. Compute `actual_credits` from measured usage (`credit_prices`), `actual_credits ≤ reserved_credits` by construction (§7); clamp defensively and log an alert if the clamp ever triggers.
3. Insert the `usage_records` row with `price_id` (the price row valid at call time).
4. `UPDATE ai_credit_accounts SET reserved = reserved - reserved_credits, available = available + (reserved_credits - actual_credits)`.
5. Ledger rows: `settle_adjust`; reservation → `settled`, store `result_ref` so an idempotent replay can return the same result without calling the provider again.
6. Adjust `spend_counters` by `(actual_cost − reserved_cost)` (usually negative).

## 6. Failures, refunds and expiry

| Outcome | Credits | Cost ledger |
|---|---|---|
| Provider rejected before processing (auth/4xx/validation) | Full release | `usage_records` row with `status='rejected'`, zero cost |
| Network error / timeout **before the provider acknowledged** | Full release | No cost |
| Timeout or disconnect **after** the provider may have processed | **Full release to the user** (the platform bears the risk) | `usage_records` row `status='unknown_billed'` with the **reserved** cost as the conservative estimate; reconciled against the provider invoice |
| Provider returned partial output | Settle on measured usage | Normal |
| Our own server crashes between reserve and settle | Sweeper (every minute): reservations past `expires_at` → `expired`, credits returned, cost estimate retained as `unknown_billed` | Same as above |
| Late settlement after expiry | Rejected (status not `reserved`); the late usage is recorded as platform cost only | Recorded |

`release` and `expire` are idempotent state transitions (`WHERE status='reserved'`), so a retry or a racing sweeper cannot double-refund.

## 7. Bounding the reservation

The reservation must be ≥ the worst case, so settlement never exceeds it.

| Call type | Reserved amount |
|---|---|
| Text (LLM) | `input_tokens_upper_bound × input_price + max_output_tokens × output_price`, where the input bound is computed from the **actual request size** (characters ÷ a conservative ratio) and `max_output_tokens` is passed to the provider and enforced |
| Writing/Speaking evaluation | Same, with fixed rubric overhead added |
| STT | `audio_seconds_upload × price`; upload length is measured server-side from the file, not from a client field |
| TTS | `characters × price`, text length capped |
| Realtime voice | Reserve **in blocks** (default 2 minutes). A heartbeat every 30 s checks the session is alive; before each block ends, an **atomic top-up reservation** is attempted using the same §4 statement. If it fails (no credits, ceiling reached, session cap reached), the session is told to wrap up and is closed by the server at the block's end. Duration is measured by the **server clock**, not the client. On disconnect, settle on measured seconds and release the remainder |

## 8. Limits

| Limit | Value (initial, configurable in data) | Enforcement |
|---|---|---|
| In-flight AI requests per user | 2 | §4 step 3 |
| Requests per minute per user per feature | e.g. 6 for text, 2 for voice session start | Token bucket keyed by user, stored in PostgreSQL (or Redis later) |
| Daily credits (free tier) | Plan entitlement `ai_daily_credits`, granted by an **idempotent** ledger entry `grant_ref = 'daily:YYYY-MM-DD'` | Unique index on `(user_id, grant_ref)` |
| Period credits (paid tiers) | `plan_entitlements`; granted at period start; unused credits expire per policy (**[U]** owner) | Ledger `expire` entries |
| Per-request input size | Writing ≤ N characters, speaking transcript ≤ N turns | Validation before reservation |
| Per-session audio | Hard cap in seconds (default 15 minutes per session, 30 minutes per day per user) | `speaking_sessions.audio_*_ms`, checked at each top-up |
| Global daily spend ceiling | `spend_ceiling_micro_usd` (global and per provider) | §4 step 5 |
| Alerting | 50 %, 80 %, 100 % of the ceiling → notification to the owner; at 100 % AI features show "temporarily unavailable" | Scheduled check |

When a limit is hit, the user sees a specific, honest message (out of credits / daily limit / temporarily unavailable). **Never a fake result.**

## 9. Idempotency keys

- Generated by the **client** per user action (UUID) and sent as `Idempotency-Key`; the server scopes it to the user (`UNIQUE(user_id, idempotency_key)`), so one user cannot collide with or replay another's key.
- Retention: 24 hours (reservations are kept; the key space is pruned after).
- Same key + same request hash → returns the stored outcome. Same key + **different** request hash → `409`.
- A request without a key is accepted for non-AI endpoints; **AI endpoints require one**.

## 10. Provider price versioning and admin reports

- `provider_prices` rows are **immutable**; a price change adds a row with a new `valid_from` and closes the previous `valid_to`. `usage_records.price_id` points to the row used, so any historical cost can be recomputed exactly. A correction creates a new row plus a `recompute` job that writes adjustment records; old rows are never edited.
- Prices are entered by an admin from the vendor's published list with a mandatory `source_note` (URL and date). **This repository contains no vendor prices**; none has been verified.
- Admin cost reports (read-only, role `finance`/`admin`, every query audit-logged), as parametrised views/endpoints:
  1. Cost by user (top N, with plan and credits used).
  2. Cost by product and by feature.
  3. Cost by plan tier and **cost per active subscriber**.
  4. Cost by provider/model per day, with error and timeout rate and p50/p95 latency.
  5. Unreconciled `unknown_billed` records.
  6. Credits granted vs consumed vs expired; reservations stuck or expired.
  7. Projected month-end spend from the trailing 7 days vs the ceiling.
- CSV export for accounting. Reports never expose message content.

## 11. Security of the credit system

- Balance, plan, price, and usage come only from the database; request fields named like them are ignored.
- Admin credit adjustments (`kind='admin'`) require a reason, an actor and appear in `audit_log`.
- Referral/bonus grants use `grant_ref` uniqueness so they cannot be claimed twice.
- Webhooks that add credits (purchased packs, if ever introduced) go through the same payment idempotency as subscriptions.

## 12. Test plan (required before any provider is enabled)

| Test | Pass condition |
|---|---|
| **Concurrency:** balance = 10, each request costs 1, fire 50 parallel requests | Exactly 10 reservations succeed, 40 receive "out of credits"; final `available = 0`, `reserved` returns to 0 after settle; invariants hold |
| Mixed prices under concurrency (costs 1, 3, 5) | Never negative; Σ charged ≤ initial balance |
| **Idempotency:** same key sent 20× in parallel | One reservation, one provider call (fake provider counts calls), one charge; all responses identical |
| Same key, different body | `409`, no charge |
| Provider failure (fake: 500, timeout before ack, timeout after ack, partial) | Credits as per the table in §6; `usage_records` statuses correct |
| Crash between reserve and settle (kill the process in the fake) | Sweeper returns credits within `ttl + grace`; no double refund when the sweeper races a late settle |
| Settle twice concurrently | One effect |
| Global ceiling | With ceiling = 10 units and 20 parallel requests of 1 unit: exactly 10 admitted |
| Realtime top-up | Session closed by the server when credits run out; server-measured duration used |
| Client tampering: fake `balance`, `plan`, `cost` fields in bodies and headers | Ignored |
| Invariant job on a randomised soak test (100 users × 1000 mixed operations) | Zero violations |
| Price change mid-day | Old usage keeps the old `price_id`; new usage the new one; reports reproduce both |

These tests use fake providers. **Results of any real provider (latency, token counts, failure modes, language support) are unmeasured** until keys exist (U-8).

## 13. What this does not solve

- Actual provider cost per unit (unknown until measured).
- Provider-side retention of audio/text (must be confirmed per provider in writing).
- Chargebacks or abuse by fraudulent subscribers: bounded by credits and ceilings, not eliminated.
