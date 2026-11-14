# BANDLY — SQLite → PostgreSQL Migration Safety Plan

Goal: move production data to PostgreSQL such that **no step can silently lose or corrupt user data**, every step is verifiable, and every step has a defined way back. Nothing in this document has been executed; no schema was changed.

Legend: **[F]** verified fact, **[R]** recommendation, **[U]** unresolved.

---

## 1. Source system facts

| Fact | Status |
|---|---|
| Source engine: `node:sqlite` (experimental), one file, path from `DB_PATH` (`/data/bandly.sqlite` per Dockerfile) | **[F]** `server/db.ts`, `Dockerfile` |
| Tables: `players, xp_log, ai_usage, payments, subscriptions, duels, duel_players` (7) | **[F]** |
| Integer autoincrement keys; `players.token` is a **plaintext** 192-bit hex bearer token, `UNIQUE` | **[F]** `join()` uses `randomBytes(24)`; stored unhashed |
| `players.nickname` unique case-insensitively (`players_nick` index on `lower(nickname)`) | **[F]** |
| Foreign keys are declared and **enforced** by default in `node:sqlite` | **[F]** verified in a scratch DB (`PRAGMA foreign_keys` = 1; orphan insert rejected) |
| Journal mode is the default `delete` (not WAL) | **[F]** verified in a scratch DB; `server/db.ts` sets no pragma |
| `VACUUM INTO 'file'` produces a consistent, integrity-checked snapshot while the DB is open | **[F]** verified in a scratch DB (3 rows copied, `integrity_check = ok`) |
| `ai_usage` stores both AI and TTS counters, distinguished by a `tts:` prefix inside the `day` text column | **[F]** `useAi(..., bucket)` |
| Production row counts (players, payments, subscriptions, duels) | **[U] V1** — never inspected. Hamyon is not configured in production, so `payments` rows cannot have been created through the app; `subscriptions` rows could exist only through `/api/admin/grant` if `ADMIN_TOKEN` was set (unknown) |
| Whether the file really lives on the persistent volume | **[U] V2** |

## 2. Principles

1. **Snapshot, never the live file.** Copying the live SQLite file during writes can produce a torn copy. All reads for migration use a `VACUUM INTO` snapshot.
2. **Two-stage import.** Raw copy first (verbatim, no interpretation), transformation second. A transformation bug never destroys the raw data.
3. **Deterministic identifiers.** Re-running any step produces the same keys, so every step is idempotent.
4. **Reconcile, don't trust.** Row counts, sums and per-user checks are computed independently on both sides and compared by a script that fails closed.
5. **No point of no return without a rehearsal.** Each irreversible step is rehearsed on a restored backup first and has stated postconditions.
6. **External ground truth for money.** Payment state is reconcilable against the provider, not only against our own tables.

## 3. Name collisions: `payments`, `subscriptions` (and `players`/`duels`)

**Problem.** The target design reuses the names `payments` and `subscriptions` for tables with different columns and semantics (`DATABASE_DESIGN.md` §2). A naive copy would either fail or, worse, coerce old rows into the new shape.

**[R] Resolution — separate PostgreSQL schemas.**

```
schema legacy   -- verbatim copy of the 7 SQLite tables, original column names and integer keys
schema app      -- target model (users, products, plans, subscriptions, payments, …)
schema meta     -- migration_runs, legacy_id_map, reconciliation_results
```

- `legacy.payments` / `legacy.subscriptions` are exact copies (same columns, same integer ids, plus `_snapshot_id` and `_copied_at`).
- `app.payments` / `app.subscriptions` are the new tables. They have **no column named like the legacy ones** where meaning differs; where a legacy row maps to a new row, the mapping is recorded in `meta.legacy_id_map(entity, legacy_id, new_id)`.
- Application code never queries `legacy.*` after cut-over except the read-only compatibility view described in §4.3.
- The `legacy` schema is retained (read-only) until the end of M8, then archived (not dropped) — see §9.

**Semantic mapping of legacy rows**

| Legacy | New | Rule |
|---|---|---|
| `players` | `app.users` + `app.user_credentials` (legacy token hash) + `app.legacy_players` link | one user per player; deterministic UUID (§5) |
| `xp_log(player_id, ts, delta)` | `app.xp_transactions` | `source_type='legacy_sync'`, `source_id = 'xp_log:'||rowid`; unique key makes re-runs no-ops |
| `players.xp, streak` | recomputed `streaks` row and an opening-balance `xp_transactions` row where `players.xp` ≠ Σ`xp_log` | difference is recorded, never discarded |
| `payments` | `app.payments` | `provider='hamyon'`, `provider_payment_id = hamyon_payment_id`; statuses mapped 1:1 (`pending, prepared, success, cancelled, failed`); `track` → `product_code` + `plan_code` via mapping table below; money converted to minor units (UZS has no minor unit in practice: store whole so'm with `currency='UZS'`) |
| `subscriptions(player_id, track, until)` | `app.subscriptions` | `status='active'` if `until > migration time` else `expired`; period end = `until`; track → plan per owner decision D5 |
| `ai_usage` | `app.usage_records` (aggregated rows with `kind='legacy_counter'`) or discarded | counters, not costs; **[R]** discard after archiving in `legacy` (decision is low-risk, recorded in the run log) |
| `duels`, `duel_players` | same names in `app`, new UUID keys, link by mapped user ids | codes are preserved verbatim (they are shared in links) |

Track → plan mapping is a **business decision** (OWNER_DECISIONS D5). Until it is made, `track` is stored verbatim in `app.subscriptions.legacy_track` and no entitlement is derived from it.

## 4. Legacy player tokens

### 4.1 What must be preserved
Existing users hold a token in their browser. After migration they must still be recognized, without the new database ever holding a raw token.

### 4.2 [R] Mechanism
- During import, compute `credential_hash = SHA-256(token)` (hex) for every `legacy.players.token`. The token is high-entropy random (192 bits), so a fast hash is sufficient; a slow password hash would only add login latency.
- Store only the hash in `app.user_credentials(kind='legacy_token', hash UNIQUE, user_id, created_at, last_used_at, expires_at)`.
- On a request carrying a legacy token: hash it, look up, treat as an authenticated session of that user (`AUTH_SECURITY_SPEC.md` §6), and prompt the user to attach an email.
- Raw tokens exist only in (a) the SQLite snapshot/backups and (b) the user's browser. Snapshot and backup files are therefore **secrets**: encrypted at rest, access-logged, with a stated expiry (§9).
- Rate-limit lookups by IP; brute force over 192 bits is infeasible, the limit only bounds log noise.

### 4.3 Compatibility during the transition
Until the client is updated (M3), the existing API keeps accepting `x-token` / `token` body fields. The server hashes and looks up. A read-only view `legacy_compat.players_v` may exist for diagnostics only; it never contains token material.

### 4.4 Verification
For **every** legacy player: `SHA-256(legacy token)` computed on the SQLite side equals `app.user_credentials.hash` on the PostgreSQL side (comparison done by the reconciliation script with both sides computed independently; neither side prints tokens).

## 5. UUID generation

| Row type | Strategy | Reason |
|---|---|---|
| Migrated rows | **UUIDv5** (name-based) with a fixed BANDLY namespace UUID and the name `"<entity>:<legacy_integer_id>"` | Deterministic ⇒ idempotent re-runs; no mapping table needed to re-derive keys |
| New rows created by the application | **UUIDv7** (time-ordered) generated in application code | Index-friendly insert order; works on any PostgreSQL version |
| Fallback / simple tables | `gen_random_uuid()` (built in from PostgreSQL 13) | — |

The namespace UUID is a constant committed to the repository. Collision between v5 and v7 spaces is not a practical concern.

## 6. Foreign keys, indexes, constraints

### 6.1 Foreign-key enforcement
- **Source:** enforced (§1). The import script asserts `PRAGMA foreign_key_check` returns **zero rows** on the snapshot before copying; a non-empty result aborts the run.
- **Target:** every FK is declared `NOT DEFERRABLE` except within the import transaction, where `SET CONSTRAINTS ALL DEFERRED` is used so table order cannot cause false failures; all constraints are validated at `COMMIT`. A migration test asserts that an orphan insert is rejected.

### 6.2 Index strategy (target)
Created **after** bulk load for speed, then `ANALYZE`.

| Table | Indexes |
|---|---|
| `users` | PK; `unique(lower(handle))`; `legacy_players(legacy_id) unique` |
| `user_credentials` | `unique(kind, hash)`; `(user_id)` |
| `user_identities` | `unique(provider, subject)`; `(user_id)` |
| `sessions` | `unique(token_hash)`; `(user_id)`; `(expires_at)` for sweeping |
| `xp_transactions` | `unique(user_id, source_type, source_id)`; `(user_id, created_at)`; `(created_at)` for weekly league |
| `payments` | `unique(provider, provider_payment_id)`; `unique(idempotency_key)`; `(user_id, created_at)`; partial `(created_at) WHERE status IN ('pending','prepared')` |
| `subscriptions` | `(user_id, status)`; `(current_period_end) WHERE status='active'` |
| `usage_records` | `(user_id, created_at)`; `(product_code, created_at)`; `(provider, model, created_at)`; partition by month when volume warrants |
| `vocabulary_mastery` | PK `(user_id, vocabulary_item_id)`; `(user_id, due_at)` for the due queue |
| `attempts` | `(user_id, started_at)`; `(assessment_id)` |
| `ai_credit_ledger`, `ai_reservations` | see `AI_CREDIT_CONTROL_SPEC.md` |

Every FK column is indexed. No index is added without a query that needs it (reviewed in M2).

## 7. Transaction boundaries and idempotency

### 7.1 Boundaries
| Operation | Boundary |
|---|---|
| Raw import into `legacy.*` | **One transaction** (data volume is small; all-or-nothing). If the volume later exceeds ~1 M rows, switch to per-table transactions with a run-level `status` flag; the run is "complete" only when every table is committed and reconciled |
| Transformation `legacy.* → app.*` | **One transaction**, deferred constraints, `COMMIT` only after in-transaction sanity checks (counts, sums) pass |
| Reconciliation | Read-only, repeatable-read snapshot |
| Cut-over flip | Not a database transaction: a controlled configuration change under a write freeze (§8.2) |

### 7.2 Idempotency
- Each run has a `meta.migration_runs` row: `run_id`, `snapshot_sha256`, `started_at`, `status`, per-table counts.
- Raw import: `INSERT … ON CONFLICT (id) DO NOTHING` keyed by legacy primary key **plus** `snapshot_id`; a second run with the **same** snapshot hash is a no-op, a run with a **different** snapshot creates a new `snapshot_id` (so successive rehearsals do not overwrite each other).
- Transformation: every insert uses deterministic UUIDs and `ON CONFLICT DO UPDATE SET … WHERE existing.source_hash <> excluded.source_hash` so that changed legacy rows update and unchanged rows are untouched.
- A run that fails mid-way leaves no partial `app.*` data (single transaction) and a `failed` run row with the error.
- **Test:** run the full import twice on the same snapshot; assert zero differences in `app.*` checksums (`CI` job in M2).

## 8. Cut-over and rollback

### 8.1 Why "read-only SQLite as fallback" is not enough
After cut-over PostgreSQL accepts new writes: XP from learners, payment callbacks, new sign-ups. Switching back to a read-only SQLite would silently discard those writes. Rollback must therefore either **bring the writes back** or be **forbidden** after a stated point.

### 8.2 Sequence with preconditions and postconditions

| Step | Action | Preconditions | Postconditions (must be checked before proceeding) |
|---|---|---|---|
| S0 | **Decide data residency** (U-1) and database location | Owner decision D4 recorded | Region/provider fixed in writing |
| S1 | Inventory production SQLite (V1, V2): snapshot, row counts, integrity check | Backup job exists (M1) | Counts recorded; `integrity_check = ok`; marker-row test proves the file is on the volume |
| S2 | Provision PostgreSQL; enable automated backups and point-in-time recovery | S0 | A restore into a scratch instance succeeds and its row counts match |
| S3 | Create schemas, run **migration framework** (up and down scripts), empty | S2 | `meta.schema_migrations` lists applied versions; down-migration of the last version succeeds on a scratch copy |
| S4 | **Rehearsal 1–N** on restored snapshot copies: raw import → transform → reconcile → run the application test suite pointed at PostgreSQL | S3 | Reconciliation passes with zero discrepancies; second run is a no-op; application smoke tests pass |
| S5 | Add **PostgreSQL data-access layer** behind a feature flag `DB_BACKEND=sqlite|postgres` while still serving from SQLite | S4 | Same test suite passes on both backends (backend-parametrized tests) |
| S6 | **Shadow-read**: production keeps writing to SQLite; a periodic job imports fresh snapshots into a *separate* PostgreSQL database and runs reconciliation + a read-comparison of leaderboard and `/api/me` for all users | S5 | ≥ 7 consecutive daily runs with zero discrepancies |
| S7 | **Announce and freeze**: enable maintenance mode — all write endpoints return `503 Retry-After`, reads keep working; Hamyon callbacks receive 503 (the provider retries; the reconcile loop covers the rest) | S6; owner informed | No successful write in the last N seconds (verified by `PRAGMA data_version` or max `updated_at` stable) |
| S8 | **Final snapshot** (`VACUUM INTO`), compute `snapshot_sha256`, raw import, transform, reconcile | S7 | Reconciliation = zero discrepancies; run row `status=verified` |
| S9 | **Flip** `DB_BACKEND=postgres` and redeploy; lift the freeze | S8 | `/api/health` ok; synthetic user journey passes; leaderboard top-10 identical to pre-flip; a legacy token still authenticates |
| S10 | **Rollback window** (default 7 days): SQLite file kept intact as a *read-write-capable* copy, **not** deleted; PostgreSQL write-ahead of changes is captured by the reverse-export tooling (§8.3) | S9 | Daily reverse-export dry-run succeeds |
| S11 | **Close window**: take final PostgreSQL backup, archive SQLite snapshot encrypted, set `legacy` schema read-only | Window passed with no incident | Archive checksum recorded; owner informed |

### 8.3 Rollback after PostgreSQL has received writes

Two cases:

**A. Rollback within the window (S10) — supported.**
1. Enable maintenance mode (writes 503).
2. Run `reverse-export`: reads from PostgreSQL every row of the migrated entities that was **created or changed since S9** (selected by `updated_at`/`created_at ≥ cutover_ts`, plus every `xp_transactions` and `payments` row regardless of age, which are insert-only/append-mostly) and applies them to the SQLite file using the original column shapes:
   - new/updated users → `players` (new users receive new integer ids above the previous maximum; their tokens are **not** reconstructible from hashes, so they are issued a recovery path: such users — created after cut-over via new auth — would have no SQLite token; see note);
   - `xp_transactions` → `xp_log` and `players.xp` adjustments;
   - `payments`/`subscriptions` → legacy tables.
3. Run reconciliation in the **reverse direction** (PostgreSQL → SQLite) and require zero discrepancies, except the declared list of "post-cutover users without token", which is shown to the operator.
4. Flip `DB_BACKEND=sqlite`, lift maintenance, announce.

*Note.* The window only holds as long as **no feature that cannot be expressed in the legacy schema is live**. Therefore **M3 (new authentication) is not deployed during the window** (see `PHASE_1_EXECUTION_PLAN.md`): until the window closes, PostgreSQL receives only writes that the legacy schema can represent, and reverse-export is lossless. New-style users cannot exist yet.

**B. Rollback after the window closes — not supported; forward-fix only.**
After S11, rollback means restoring PostgreSQL from point-in-time recovery to a chosen timestamp and accepting loss of writes after it, or fixing forward. This is stated to the owner as an explicit risk acceptance before S11.

**Payments during rollback.** Because the provider is external ground truth, after any rollback run the Hamyon reconcile for every payment younger than the window; a payment that succeeded at the provider but is missing locally is re-delivered by the existing idempotent `applyResult` (verified by tests).

### 8.4 Silent-loss guards
- Every write endpoint during S7 returns `503`, never silently drops.
- The freeze check in S7 fails the run if any write is observed after the freeze began.
- No script ever executes `DELETE`/`DROP` against SQLite or `legacy.*`.
- The archived SQLite snapshot is verified by re-hashing before the live copy is ever removed.

## 9. Backup consistency

| Item | Design |
|---|---|
| SQLite backups (until retirement) | Scheduled `VACUUM INTO '<dir>/bandly-<utc>.sqlite'` from inside the application process (a consistent snapshot even with writers active), then `PRAGMA integrity_check` on the copy, then SHA-256 recorded in a manifest. **Do not copy the live file.** |
| Storage | Off-volume (object storage in the approved region), encrypted, at least 2 generations in different locations. A backup on the same volume as the database does not count |
| Frequency | Before each migration step, plus daily |
| Restore drill | Mandatory in S2/S4: restore the newest backup to a scratch location, run integrity check and reconciliation against the manifest. A backup that has never been restored is treated as non-existent |
| PostgreSQL | Provider automated backups + PITR; plus a weekly logical dump to the same off-site store; restore drill before M8 sign-off |
| Secrets in backups | Backups contain plaintext legacy tokens until retirement → encrypted, access-restricted, deleted at the end of the retention period in §9.1 |

### 9.1 Retention of migration artifacts
Raw snapshot and `legacy` schema: retained until M8 sign-off + 90 days, then the encrypted archive is kept for the shorter of the owner-approved retention period and legal requirement (U-6), after which it is destroyed and the destruction logged. **[U]** retention duration requires owner/legal input.

## 10. Data reconciliation checks (run after S8 and in every rehearsal)

All checks execute on both sides independently; the script prints only counts and booleans, never tokens.

| # | Check |
|---|---|
| 1 | `COUNT(*)` per table equals (legacy ↔ legacy copy ↔ app mapped rows) |
| 2 | `SUM(players.xp)` = Σ opening balance + Σ `xp_transactions` for migrated users |
| 3 | For **every** player: `xp`, `streak`, `lower(nickname)` equal |
| 4 | For every legacy token: hash equality (§4.4) |
| 5 | `SUM(amount)` and `COUNT(*)` of `payments` by status equal; every `hamyon_payment_id` unique and present |
| 6 | Every subscription: `until` equal to `current_period_end` (ms → timestamptz without drift: compare in epoch ms) |
| 7 | Entitlement equivalence: for each user and track, "has access at time T" computed from legacy and from new tables for T ∈ {cutover − 1 d, cutover, cutover + 1 d} agrees |
| 8 | Duels: set of codes, players per code, scores equal |
| 9 | Referential check: zero orphans in `app.*`; zero rows in `PRAGMA foreign_key_check` on source |
| 10 | Weekly leaderboard produced by the old query on SQLite equals the new query on PostgreSQL for the same instant |
| 11 | Timestamps: SQLite stores epoch milliseconds in `INTEGER`; PostgreSQL columns are `timestamptz`; check max absolute difference = 0 ms |
| 12 | Text encoding: nicknames compared byte-wise after NFC normalization; any normalization difference is listed, not silently fixed |

A discrepancy in any check fails the run and blocks the next step. Discrepancies are written to `meta.reconciliation_results`.

## 11. Residual risks

| Risk | Handling |
|---|---|
| Production contents unknown (V1/V2) | S1 is a hard gate before design is frozen |
| Data-residency law may forbid the chosen region (U-1) | S0 is a hard gate; nothing is provisioned before it |
| Reverse-export is custom code and only as good as its tests | It is rehearsed in S4 and run as a dry-run daily in S10 |
| `legacy` schema retains plaintext-derived material only as hashes in `app`, but raw tokens in snapshot | Covered in §9 (encryption, expiry) |
| Provider changes Node/SQLite behaviour | Backups use SQL `VACUUM INTO`, not a library API |
