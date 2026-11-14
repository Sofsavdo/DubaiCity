# FINAL MIGRATION SPEC (Phase 0.2)

Supersedes `docs/audit/phase-0.1/MIGRATION_SAFETY_PLAN.md` §3–§4 and §8.2–§8.4. Phase 0.1 file preserved unchanged.
Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved.

## 0. Corrections to Phase 0.1

| # | Defect | Resolution |
|---|---|---|
| 1 | Plan copied `players.token` verbatim into `legacy` schema → raw bearer tokens in PostgreSQL | §2: SQLite gains `token_hash` first; only hashes cross to PG; raw token never copied |
| 2 | Rollback could not authenticate users created in the 7-day window (legacy API issues raw tokens; PG stores hashes; reverse export cannot reconstruct raw) | §5: SQLite keeps `token_hash`, rollback build authenticates by hash; reverse export writes hashes |
| 3 | Assumed 503 from webhook is retried by Hamyon | §6: durable inbox; no reliance on provider retry |
| 4 | Reverse-export idempotency undefined | §5.3 |
| 5 | New-user creation during window undefined | §5.2 |
| 6 | Maintenance-mode behaviour vague | §7 |

## 1. Verified facts about the legacy system

- **[F]** `server/db.ts` `join()` creates `randomBytes(24)` token, stores it **plaintext** in `players.token`, returns it to the client; clients send it as `x-token` header or JSON body. (24 random bytes = 192 bits, so a fast unsalted hash such as SHA-256 is adequate for storage; no password-style KDF needed.)
- **[F]** `node:sqlite` has foreign keys on by default and supports `VACUUM INTO` for a consistent snapshot.
- **[F]** Hamyon completion endpoint returns 403 on bad signature and 500 "retry" on delivery error (current code).
- **[F]** The Hamyon retry schedule appears only as a code comment in the owner's separate Fidem repo; the provider's own documentation has **not** been read. → **[U] retry behaviour unverified.**
- **[U]** Production DB contents (row counts, payments, subscriptions, whether `ADMIN_TOKEN` is set, whether the file is on the volume).

## 2. Token handling (resolves defects 1–2)  [R]

### 2.1 Step M2a — SQLite-side pre-step (small legacy change, requires approval, separate from M1)

1. Add column `players.token_hash TEXT` (nullable, indexed unique).
2. Backfill: `token_hash = hex(sha256(token))` for all rows (script, idempotent, run inside transaction on a copy first).
3. Legacy `byToken()` lookup becomes: try `token_hash = sha256(presented)` first; fall back to `token = presented` only while the plaintext column still exists.
4. `join()` for new players writes `token_hash` and **also** keeps writing plaintext `token` until the cut-over window ends (needed because rollback build and old clients rely on the raw column; see 2.3).
5. This is the only legacy-code change in the migration track. It does not change API shapes.

### 2.2 What crosses to PostgreSQL

`legacy.players` copy contains **`token_hash` only**. Column list is explicit; `token` is excluded by an allow-list in the export script, and a CI test greps the PG dump for any 48-hex token pattern from the source file (C-M01).

### 2.3 Why plaintext remains in SQLite during the window

SQLite is the pre-cutover store of record; its file already contains plaintext tokens (existing risk, **[F]** finding C3). It is not made worse. After the window closes and rollback is no longer possible (§8), the SQLite file is archived encrypted and plaintext column is dropped in the archive copy. **[R]**

### 2.4 Client continuity

After cut-over, the new auth layer accepts a legacy token **once** to bind a device to a new session (token → `sha256` → `legacy.players.token_hash` match → issue `__Host-` session cookie, mark legacy hash `bound_at`). Legacy hash lookup stays enabled until the owner-set sunset (**OD-03**). **[R]**

## 3. Migration stages (summary)  [R]

| Stage | Action | Writes legacy DB? |
|---|---|---|
| M2a | Add/backfill `token_hash` (above) | yes, additive only |
| M2b | Rehearsal: `VACUUM INTO` snapshot → export → load PG staging → reconcile counts/checksums | no |
| M2c | Dry run on production snapshot, read-only | no |
| M2d | Cut-over (§4) | brief freeze |
| M2e | Observation window 7 days, rollback armed | no (legacy frozen) |
| M2f | Decommission after owner sign-off | archive |

## 4. Cut-over sequence  [R]

1. Owner approval recorded (OD-03, OD-05).
2. Backup A: `VACUUM INTO` snapshot + sha256 + off-volume copy; restore-test it.
3. Enter maintenance mode (§7).
4. Final delta export (snapshot → PG), reconcile: row counts per table, SUM(xp), SUM(payments.amount), distinct token_hash count, FK orphan count = 0.
5. If reconcile fails → abort, exit maintenance, legacy untouched (legacy never stopped being the store).
6. Switch traffic to new service; legacy service stopped but **kept deployable**, volume untouched.
7. Smoke tests; exit maintenance.

## 5. Rollback during the 7-day window (resolves defects 2, 4, 5)  [R]

### 5.1 Principle
The legacy volume is never written after cut-over. Rollback = restore legacy as store of record **plus** replay only the data created or changed in PG after cut-over, into a **new SQLite file** (never in-place over the frozen one).

### 5.2 New users created in the window
- New PG users have a `created_source = 'new'` flag and a `token_hash` in `app.sessions`/`legacy_compat` only if they used the legacy-compatible API; otherwise they have cookie sessions only.
- Rollback build (legacy code + M2a) authenticates by **`token_hash`**. For users who existed at cut-over, their hash is already in SQLite. For users created after cut-over, reverse export writes a row with `token_hash = <value stored in PG>` and `token = NULL`.
- Consequence: **their old session cookie is not valid in the legacy app**, because legacy needs a raw token the server never kept. Therefore each such user is served a one-time **"reconnect"** (re-login by email OTP in the legacy build is not available) → **[R] decision**: at cut-over, new-window users are created in the new system with email-verified accounts only; on rollback they receive an email "We restored the previous version; sign in with the same email" and the rollback build offers an *email-link claim*: a signed one-time URL generated at rollback time (token = random 192-bit, stored hashed in `players.token_hash`, raw sent only in the email). **No raw token is ever stored in PostgreSQL.**
- **[U] OD-03** requires owner to accept: users created in the window may need to re-enter via the emailed link after a rollback. If the owner refuses this, the only alternative is to **disable self-service signup during the window** (existing users + invited users only) — also recorded in OD-03.
- Legacy raw-token clients (existing users): `token_hash` present → authenticate unchanged. No action.

### 5.3 Reverse export (idempotent)
1. Build a new file `rollback-<ts>.sqlite` with the legacy schema (from repo DDL at the M2a commit).
2. Copy the frozen legacy snapshot's rows, then apply PG deltas by **deterministic keys**: migrated rows keep their UUIDv5-derived mapping to original integer ids via `meta.reverse_map(table, pg_id, sqlite_id)`; new rows get new sqlite ids allocated from `max(id)+1` in a single pass, and the allocation is stored in `reverse_map` first.
3. Mark the file with a table `_reverse_import(run_id, started_at, finished_at, pg_snapshot_lsn, row_counts_json)`; the final row is inserted last, in the same transaction. A file without `finished_at` is rejected by the rollback runner.
4. Rerun = delete the incomplete file and rebuild from the same inputs; output is deterministic (sorted inserts) so its checksum matches on identical input (C-M05).
5. Swap: legacy service pointed to `rollback-<ts>.sqlite` by changing `DB_PATH` to the new file name. The original frozen file is retained.
6. Data classes **not reversed** (explicit loss list, owner informed, **[U] OD-03**): new-system-only features (AI usage history, new credits ledger, Mock Arena attempts). They are kept in PG for later re-import; payments are reversed (§6).

### 5.4 Rollback decision rule
Triggers: data-integrity failure, auth failure rate over a threshold set by the owner, payment mismatch not reconcilable, or owner request. Rollback runs a rehearsed runbook with a time budget agreed in OD-03. Rehearsal on a staging copy is an acceptance criterion for M2d (C-M06).

## 6. Payments and Hamyon webhooks  [R]

### 6.1 No reliance on provider retry
**[U]** Whether Hamyon retries on 5xx/503 is unverified. Design: acknowledge only after the event is durably stored.

```sql
CREATE TABLE app.payment_webhook_inbox (
  id            bigserial PRIMARY KEY,
  provider      text NOT NULL,
  event_key     text NOT NULL,               -- provider tx id, or hash of canonical body
  received_at   timestamptz NOT NULL DEFAULT now(),
  signature_ok  boolean NOT NULL,
  raw_body      bytea NOT NULL,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','applied','rejected','error')),
  attempts      int NOT NULL DEFAULT 0,
  last_error    text,
  UNIQUE (provider, event_key)
);
```
- Handler: verify signature → insert into inbox (`ON CONFLICT DO NOTHING`) → return 200 only if the insert committed → worker applies idempotently.
- The inbox is **its own durable store**, separate from the database being migrated (own file/table that survives rollback), so events received during the window are never lost.
- If the inbox cannot be written (disk/DB down) respond with 5xx **and** log; recovery uses the reconciliation job below, not an assumption of retry.

### 6.2 Reconciliation (required in either direction)
- Daily job (and mandatory during the window, hourly): compare provider-side transaction list (if provider exposes one — **[U]**) with local `payments`. If provider has no list API, fall back to owner-run export from the provider dashboard compared by a CSV import tool. **[U] OD-04 (provider export access).**
- Unapplied inbox rows older than 5 minutes alert the owner.
- Payments created in PG during the window are included in reverse export (§5.3) with their `event_key`, so replayed webhooks are recognised.

### 6.3 Idempotency of payment application
`UNIQUE (provider, provider_tx_id)` on applied payments; applying twice yields one entitlement grant.

## 7. Maintenance mode  [R]

- Static page + `503 Retry-After: 300` for HTML routes and API.
- **Webhook route remains open** in maintenance mode so events are captured by the inbox (inbox lives outside the frozen DB).
- Health endpoint stays up. Admin routes disabled.
- Maximum planned duration agreed with owner (OD-03, OD-05). Writes from clients are rejected, not queued (client `syncNow` swallows failures **[F]**, so client-visible data remains in localStorage and re-syncs after).
- **[U]** whether Railway shows custom maintenance pages without a deploy; implementation chosen at M2d (app-level flag file on volume).

## 8. Window end and archive  [R]

After 7 days and owner sign-off: stop legacy service, archive SQLite encrypted, keep per OD-07 retention; plaintext token column dropped from archive copy. Retention vs deletion consistency in `FINAL_ARCHITECTURE_SPEC.md` §6.

## 9. Test cases (implemented in M2, none run)

| ID | Case |
|---|---|
| C-M01 | PG dump contains no raw token from source file |
| C-M02 | Export is deterministic: two runs same checksum |
| C-M03 | Counts/sums reconcile; orphan FK = 0 |
| C-M04 | Legacy token authenticates via hash after M2a |
| C-M05 | Reverse export twice from same input → identical checksum |
| C-M06 | Rollback rehearsal on staging copy meets time budget |
| C-M07 | User created in window: reconnect link works; raw token absent from PG logs |
| C-M08 | Webhook during maintenance → inbox row → applied after exit |
| C-M09 | Duplicate webhook → one entitlement |
| C-M10 | Inbox write failure → 5xx + alert; reconciliation catches missing payment |
| C-M11 | Interrupted reverse export → rejected by runner (no `finished_at`) |
| C-M12 | Rolled-back payments appear in legacy `payments` with original event keys |
