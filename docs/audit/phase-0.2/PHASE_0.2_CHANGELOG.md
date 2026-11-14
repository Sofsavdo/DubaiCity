# PHASE 0.2 CHANGELOG

Scope: documentation only. No source, schema, deploy, Railway, dependency or production-data change. All earlier documents (`docs/*.md`, `docs/audit/phase-0.1/*`) are preserved byte-for-byte; corrections live in `docs/audit/phase-0.2/`.

## Documents created
`FINAL_ARCHITECTURE_SPEC.md`, `FINAL_AI_CREDIT_SPEC.md`, `FINAL_MIGRATION_SPEC.md`, `OWNER_DECISION_REGISTER.md`, `M1_READY_CHECKLIST.md`, `PHASE_0.2_CHANGELOG.md`.

## Corrections

| # | Phase 0.1 defect | Where fixed | Change |
|---|---|---|---|
| 1 | Ledger invariant `available + reserved = SUM(delta)` contradictory | FINAL_AI_CREDIT_SPEC §1 | Double-entry buckets; `available+reserved+spent+expired = issued` CHECK; per-txn zero-sum; nightly audit |
| 2 | `spend_counters` PK with nullable `provider` | §4 | `scope_key TEXT NOT NULL` PK, `(scope_key, period_start)` |
| 3 | `credit_prices` undefined | §3 | `credit_prices` and `provider_prices` schemas, versioned, micro-USD integers |
| 4 | Provider/global ceilings not enforced | §4 | `spend_ceilings`, two-scope atomic check, fail-closed, kill switch |
| 5 | Crash between provider call and settlement | §2, §5 | State machine, `dispatching`/`unknown`, sweeper, late-settle rule |
| 6 | Duplicate provider calls | §5.1 | Conditional claim + `UNIQUE(user_id, idempotency_key)` + request hash |
| 7 | Provider idempotency assumed | §6 | `retrySafety` capability, default `unsafe`, no auto-retry after send |
| 8 | Raw tokens copied into PostgreSQL | FINAL_MIGRATION §2 | SQLite `token_hash` pre-step (M2a); only hashes cross; CI check for raw tokens |
| 9 | Rollback could not authenticate window-created users | §5 | Hash auth in rollback build; emailed re-entry link or sign-ups disabled in window (OD-03); explicit loss list |
| 10 | Reverse export idempotency | §5.3 | New file, deterministic order, `reverse_map`, `_reverse_import` completion marker |
| 11 | Assumed 503 is retried by Hamyon | §6 | Durable inbox, 200 only after commit, reconciliation, no retry assumption |
| 12 | Maintenance mode vague | §7 | 503 + Retry-After, webhook route open, writes rejected |
| 13 | D1/D2/D3 numbering ambiguity | OWNER_DECISION_REGISTER §1–2 | OD-01…OD-11 with milestone and IMPL/PROD blocking; translation table |
| 14 | Archive retention (M8+90 days) vs 35-day backup statement | FINAL_ARCHITECTURE §6, REGISTER OD-07 | Archive kept 35 days after window; deletion log re-applied after restore |
| 15 | Off-site backup depended on OD-01 unnoticed | M1_READY_CHECKLIST §0, REGISTER | M1 split into core (ready) and off-site (blocked) |
| 16 | Daily credit time zone undecided | FINAL_AI_CREDIT §7 | User IANA time zone, local-date keyed grant, 7-day change limit |
| 17 | Localization criteria vague | FINAL_ARCHITECTURE §5 | 10 acceptance criteria with verified ICU plural/format facts |
| 18 | Data-residency dependencies unlisted | FINAL_ARCHITECTURE §4 | Component table, no legal conclusions |

## Facts verified this phase [F]
Node 22 ICU 78.3 plural categories and formats for en/uz/ru; `Asia/Tashkent` supported; client `syncNow` swallows failures; Hamyon retry schedule appears only as a comment in the owner's other repo (provider docs not read).

## Not verified (still open) [U]
Production DB contents and variables; DB file location on volume; provider retry/usage/idempotency behaviour; `btree_gist` on managed PG; Railway scheduled-job feasibility for backups; all legal questions (residency, minimum age, retention periods, refund rules).

## Not done (by design)
No test executed for the SQL in these documents (they are designs; test cases C-01…C-23 and C-M01…C-M12 are specified for M5/M2). No M1 work started.
