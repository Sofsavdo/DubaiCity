# BANDLY — Phase 1 Execution Plan (M1–M8)

Phase 1 of `IMPLEMENTATION_ROADMAP.md` is replaced by eight independently releasable and testable milestones. **Nothing here is approved or started.** File lists are *likely* touch points from inspecting the repository at commit `b51f705`, not commitments.

**[F]** = verified, **[R]** = recommendation, **[U]** = unresolved.

## 0. Ground rules for every milestone

- One milestone = one or more small PRs; `main` is deployable after each. Railway deploys from `main`.
- Existing behaviour stays unless the milestone says otherwise; **regression baseline** for every milestone: `npm test` (24 suites) + `npm run build` + the committed E2E suite (created in M1).
- Feature flags (environment variables) guard anything that changes behaviour for real users; flags default **off**.
- No milestone changes pricing, content, or visual design beyond what is listed.
- Every milestone ends with the report required by the specification: implemented items, files changed, database changes, tests executed, results, remaining issues, deployment risks, AI cost impact.

## 1. Dependency graph

```
M1 ──▶ M2a ──▶ M2b(cut-over) ──[rollback window 7 d]──▶ M3 ──▶ M4 ──▶ M5 ──▶ M7 ──▶ M8
 │                                                                              ▲
 └──▶ M6 (localization; parallel, needs only M1) ──────────────────────────────┘
```

| Milestone | Hard dependencies | Why |
|---|---|---|
| M1 | none | Creates the safety net used by every other milestone |
| M2a | M1 (backups, CI) | Needs a restorable source and automated tests |
| M2b | M2a, owner decisions D1, D3-region | Production switch |
| M3 | M2b **and the closed rollback window** | Introduces data the legacy schema cannot represent, which would break lossless rollback (`MIGRATION_SAFETY_PLAN.md` §8.3) |
| M4 | M3 | Learner data needs a real user id |
| M5 | M3, M4 | Entitlements attach to users; protected content needs server-side attempt grading and mastery |
| M6 | M1 only | UI strings, independent of persistence; can run at any time after M1 |
| M7 | M2b, M3, M5 | Credits are granted by plan entitlements and attach to users |
| M8 | M1–M7 | Final hardening and acceptance |

Sequence of owner-gated steps: **U-1/D4 → M2a**; **D2/D3/U-3 → M3**; **D5 → M5**.

---

## M1 — Safety, CI, backups and recovery

| | |
|---|---|
| **Exact scope** | (1) GitHub Actions workflow: install, typecheck, `npm test`, build, on every PR and on `main`. (2) Move the development Playwright scenarios into the repository as a runnable `e2e/` suite: route sweep (all 21 static routes plus pattern URLs, 360 px and 1280 px), the payment flow against a fake Hamyon server, speaking in text mode, placement, mock test solving. (3) Production **inventory** (V1, V2): scheduled in-process `VACUUM INTO` snapshot + integrity check + SHA-256 manifest, written to the persistent volume **and** uploaded off-volume; admin-only endpoint/CLI to list backups and counts. (4) Restore runbook and a restore drill into a scratch path. (5) Structured error logging with secret redaction; error-tracker integration (if the owner chooses a vendor). (6) `/api/health` extended with DB check and version. (7) Write the marker-row test for V2. |
| **Dependencies** | None. Owner input: off-site backup destination (object storage account) |
| **Files / modules likely to change** | new `.github/workflows/ci.yml`, new `e2e/*`, `package.json` (scripts only; Playwright is a **dev** dependency — installing it is a Phase 1 action requiring approval at that time), `server/index.ts` (health, log redaction), new `server/backup.ts`, `server/db.ts` (snapshot helper only), `docs/RUNBOOK_BACKUP.md` |
| **Database changes** | None to the schema. Backup files are new artifacts |
| **Acceptance criteria** | A1 CI runs on a PR and fails when a test is deliberately broken. A2 `e2e/` passes headless in CI. A3 A snapshot is produced on schedule, `integrity_check = ok`, SHA-256 recorded, copy present off-volume. A4 Restore drill: newest backup restored to a scratch path; row counts equal the manifest. A5 Production inventory report (counts of `players`, `payments`, `subscriptions`, `duels`, `ai_usage`; whether `ADMIN_TOKEN` is set) delivered to the owner. A6 Marker row survives a redeploy (proves the DB is on the volume) — or the finding is reported immediately as **Critical**. A7 Logs of a test request containing a fake token and OTP show `[redacted]` |
| **Regression tests** | Existing 24 suites; build; new E2E suite is itself the regression baseline for later milestones |
| **Rollback strategy** | Remove the workflow / disable the schedule via environment flag; no data or schema change. Backup job is read-only with respect to the database (`VACUUM INTO` writes a separate file) |
| **Deployment risk** | **Low.** Risks: snapshot I/O briefly locks writers (database is small; measured in A3); backup writes consuming volume space (retention cap and size check included) |

## M2 — PostgreSQL infrastructure and migration framework

Two releases so the risky switch is isolated.

### M2a — Infrastructure, framework, rehearsal (no production traffic)

| | |
|---|---|
| **Exact scope** | Provision PostgreSQL in the **approved region** (U-1). Migration framework with versioned `up`/`down` SQL files, `schema_migrations` table, advisory-lock to prevent concurrent runs, CI job that runs all migrations up, down, up on a scratch database. Create schemas `legacy`, `app`, `meta`. Implement `legacy` raw import, transform to `app` (users, credentials-hash, xp_transactions, payments, subscriptions with `legacy_track`, duels), reconciliation script (all 12 checks), reverse-export tool, deterministic UUID helpers. Rehearsals on restored production snapshots. Data-access layer behind `DB_BACKEND`, with the **existing server tests parametrised over both backends**. Shadow-read job (S6). |
| **Dependencies** | M1; owner decisions D1 and region (D4) with the legal answer (U-1) |
| **Files / modules** | new `server/db/` (driver abstraction, `sqlite.ts`, `postgres.ts`), `server/migrations/*.sql`, `server/migrate.ts`, `tools/migrate/*` (import, transform, reconcile, reverse-export), changes to `server/db.ts`, `server/payments.ts`, `server/index.ts` to call the abstraction, `package.json` (a PostgreSQL client dependency — **needs approval at that time**), tests `server/*.test.ts` parametrised |
| **Database changes** | New PostgreSQL database only. **SQLite unchanged** |
| **Acceptance criteria** | A1 Reconciliation passes with zero discrepancies on ≥ 3 independent rehearsals. A2 Import run twice ⇒ identical `app` checksums. A3 Orphan insert rejected on PostgreSQL. A4 Every legacy token hash matches (§4.4). A5 Whole server test suite green on `sqlite` **and** `postgres` backends. A6 Down-migration of the newest version works on a scratch copy. A7 Reverse-export of a rehearsal cut-over followed by reverse reconciliation = zero discrepancies. A8 Shadow-read daily runs: 7 consecutive with zero discrepancies. A9 Production still runs on SQLite, untouched |
| **Regression tests** | M1 baseline; backend-parametrised suites; leaderboard and duel API snapshot comparison on both backends |
| **Rollback** | Nothing to roll back in production (not used). Drop the PostgreSQL database |
| **Deployment risk** | **Low–Medium.** Code paths added behind a flag; the abstraction layer touches every DB call, so bugs there are possible — mitigated by running both backends in tests |

### M2b — Production cut-over

| | |
|---|---|
| **Exact scope** | Execute `MIGRATION_SAFETY_PLAN.md` S7–S11: maintenance freeze, final snapshot import, reconcile, flip `DB_BACKEND=postgres`, 7-day rollback window with daily reverse-export dry-runs, close window. |
| **Dependencies** | M2a complete; owner informed and present for the freeze; backup verified within the last 24 h |
| **Files** | configuration (environment) and runbook only; `docs/RUNBOOK_CUTOVER.md` |
| **Database changes** | Production switches engine. **No schema change** relative to the rehearsed one |
| **Acceptance criteria** | B1 Zero reconciliation discrepancies at S8. B2 Post-flip synthetic journey passes (join with legacy token → sync → leaderboard → duel create/join/submit → `/api/me`). B3 Top-10 leaderboard identical before and after. B4 No 5xx in the first hour above baseline. B5 Daily reverse-export dry-run succeeds for 7 days. B6 Window closed with owner sign-off |
| **Regression tests** | E2E suite against production-like staging first; payments suite against the fake Hamyon server on PostgreSQL |
| **Rollback** | Within the window: `reverse-export` + flip back (see §8.3). After the window: forward-fix / point-in-time recovery only (risk accepted in writing) |
| **Deployment risk** | **High** (the only irreversible-after-window step in M1–M8). Mitigations: freeze, rehearsals, reconciliation gate, window |

## M3 — Authentication and account recovery

| | |
|---|---|
| **Exact scope** | Implement `AUTH_SECURITY_SPEC.md` §3–§8: email OTP, Google OIDC, Telegram validation, session cookies with hashing/expiry/revocation, legacy-token login and the attach-identity prompt, removal of the copy-token button, `handle`s, age capture and bands (server-enforced restrictions), CSRF controls, rate limits in the database, security headers, audit log, the account page (sessions list, sign-out everywhere, attached identities). |
| **Dependencies** | M2b **with the rollback window closed**; owner decisions D2, D3, U-3 (email provider and domain), Google/Telegram credentials |
| **Files / modules** | new `server/auth/*` (otp, google, telegram, sessions, csrf), `server/index.ts` (routing/middleware), `src/lib/account.ts`, `src/components/JoinForm.tsx`, `src/pages/Profile.tsx`, new `src/pages/Account.tsx`/sign-in screens, `src/components/PaySheet.tsx` (uses session instead of token), `src/pages/League.tsx`, `src/pages/Duel.tsx` |
| **Database changes** | Migrations adding `auth_challenges`, `sessions`, `user_identities`, `roles`, `audit_log`, age columns, `deletion_requests`; backfill `birth_*` = unknown for legacy users |
| **Acceptance criteria** | C1 All preview tests in `AUTH_SECURITY_SPEC.md` §12 pass. C2 A legacy user keeps the nickname, XP, streak, duel history and (if any) subscription after logging in with the old token. C3 A database dump grep for a known test token and a test OTP finds nothing. C4 Session revocation takes effect on the next request. C5 Cross-user access test passes on every id-bearing route. C6 Unknown-email and known-email OTP starts are indistinguishable. C7 Minor-band user cannot enable adult personalities by editing client state. C8 Existing league, duel and payment flows still pass their E2E tests using session auth |
| **Regression tests** | M1/M2 baselines; payments, duel, league E2E; new auth E2E (OTP via a test mail sink; Google/Telegram with recorded fixtures — **not** against the live providers until credentials exist) |
| **Rollback** | Feature flag `AUTH_V2` off returns to legacy-token-only behaviour (the legacy path is retained throughout M3). New tables stay; no data loss. The user-visible token-copy feature is restored only if the flag is off |
| **Deployment risk** | **High.** Locks users out if misconfigured; email deliverability is external. Mitigations: legacy path stays working, staged rollout by percentage, support-grant tooling for stuck users |

## M4 — Server-authoritative learner data and localStorage import

| | |
|---|---|
| **Exact scope** | Server tables and APIs for profile, results, SRS/vocabulary state, XP ledger with one payout per activity (anti-farming rule), streaks in the **user's timezone** (fixes the UTC homework boundary), homework completion, studio progress, full-exam history. Client becomes a cache over the API with offline tolerance. **One-time import** of `localStorage` after sign-in with merge rules (`DATABASE_DESIGN.md` §3 step 6): cap and flag imported XP, union of SRS cards/results, **never** import plan, credits or age band. Keep `localStorage` data until the server confirms receipt. |
| **Dependencies** | M3 |
| **Files / modules** | `src/lib/store.ts`, `storage.ts`, `history.ts`, `shadowStore.ts`, `account.ts`, new `src/api/*`, `src/lib/homework.ts` (timezone), server: new `server/learning/*`, `server/index.ts`; pure logic in `src/lib/game.ts`, `srs.ts`, `grade.ts` **moves unchanged** to shared code so client and server run identical rules (tests reused) |
| **Database changes** | Migrations adding `learner_profiles`, `skill_mastery`, `error_history`, `vocabulary_mastery`, `attempts`, `attempt_answers`, `xp_transactions` (activated), `streaks`, `lesson_progress`, `imports` (idempotency record per user) |
| **Acceptance criteria** | D1 A browser with existing local data signs in; after import the server state equals the local state within the documented merge rules; a second import is a no-op. D2 Same account on a second browser shows the same progress. D3 Replaying the same activity N times pays XP once (unique `source_id`). D4 Local XP edited to 10⁶ is capped and flagged; leaderboard unaffected. D5 Homework day boundary follows the user's timezone (tests at 00:00 Tashkent). D6 Offline: actions queue and sync; no duplicate payouts after reconnect. D7 All pure-logic suites unchanged and green |
| **Regression tests** | All logic suites (`game`, `srs`, `grade`, `practice`, `progress`, `homework`, …); E2E games, practice, homework, results |
| **Rollback** | Flag `SERVER_STATE` off ⇒ client reads/writes `localStorage` only (kept intact until M8). Server tables retained; re-enabling re-syncs through the idempotent import |
| **Deployment risk** | **Medium–High** (data merge correctness). Mitigation: import is additive, local data not deleted, dry-run mode reports differences without writing |

## M5 — Server-side entitlements and content protection

| | |
|---|---|
| **Exact scope** | Products/plans/`plan_entitlements`/prices as **data**; free tier defined on the server; `requireEntitlement(feature)` guard; mapping of the three legacy tracks (decision D5); content delivery API: lesson/test text served only to entitled users; **graded tests submitted to the server** (`attempts`, server timer, server grading, answer keys never sent before submission); content seeded from the TypeScript sources into the database by a deterministic, idempotent seed step (integrity tests keep running on the sources); bundle no longer contains paid answer keys or essays; code-splitting by product; remove client `plan` trust (`Gate.tsx` reads server entitlements); free-tier counters (`freeGames`, practice per day) server-side. |
| **Dependencies** | M3, M4; owner decisions D5 (track mapping) and the free-tier definition |
| **Files / modules** | `src/components/Gate.tsx`, `src/lib/store.ts` (remove `plan` authority), `src/pages/Pricing.tsx`, `Reading.tsx`, `Listening.tsx`, `MockTest.tsx`, `Mocks.tsx`, `Exam.tsx`, `Grammar.tsx`, `Writing.tsx`, `Speaking.tsx`, `FullExam.tsx`; `src/content/*` → build-time seed; server: new `server/entitlements/*`, `server/content/*`, `server/assessment/*`, `server/payments.ts`/`pricing.ts` (read plans from the database) |
| **Database changes** | Migrations adding `products`, `plans`, `plan_entitlements`, `prices`, content tables (`curricula, levels, modules, lessons, exercises, passages, vocabulary_items, assessments, assessment_items`) populated by seed; `subscriptions`/`payments` evolve from the migrated rows |
| **Acceptance criteria** | E1 A request for paid content without entitlement returns `403` with no content in the body. E2 Searching the shipped JS bundle for a protected essay sentence and a protected answer key finds nothing. E3 Editing `localStorage` or devtools state does not unlock anything. E4 Free mock tests work for anonymous-with-account users, graded server-side; keys are not in the response before submission. E5 Grading results equal the previous client-side grading for **all 11 existing tests** (golden comparison using each test's answer key). E6 An expired subscription loses access at the second of expiry (clock-injected test). E7 Initial JS bundle size reduced by a measured, reported amount |
| **Regression tests** | `grade`, `band`, payments, M3 auth isolation tests; E2E: solve all 11 tests; payment demo flow replaced by plan-driven E2E on a fake provider |
| **Rollback** | Flag `ENTITLEMENTS_V2` off ⇒ previous client gating and bundled content path remain deployable only if the old build is kept as a release artifact; therefore this milestone ships as a **new release alongside** the old one for one cycle (blue/green on Railway via redeploy of the previous commit). Data tables are additive |
| **Deployment risk** | **Medium–High.** Risk of locking out paying users or breaking free tests. Mitigations: golden grading comparison, canary by user percentage, support grant tool |

## M6 — Localization foundation

| | |
|---|---|
| **Exact scope** | Locale infrastructure for UI strings (ICU-style plurals, interpolation), English as the base and Uzbek complete; Russian catalog skeleton; `<html lang>` and `dir` set per locale; locale selector; persistence in the user profile (when logged in) or browser; extraction of the ~360 hard-coded UI lines into catalogs; content-translation schema design (`*_translations`) but **no content translation work yet**; CI check that every key exists in every enabled locale and that variables match (extends `i18n.test.ts`). Language list in data (`languages.is_ui_enabled`). |
| **Dependencies** | M1 only (can run in parallel with M2–M5; conflicts managed by touching only string literals) |
| **Files / modules** | `src/i18n/*`, every file in `src/pages/*` and `src/components/*` containing Uzbek literals (≈ 38 of 41), `index.html` (`lang`), `src/content/*` untouched except moving UI-only strings |
| **Database changes** | None in M6 itself (a `languages` seed arrives with M5; the locale preference column ships with M3/M4) |
| **Acceptance criteria** | F1 A lint/test fails the build if a Uzbek-looking literal remains in JSX of migrated files. F2 Switching to English shows English on every migrated screen with no Uzbek leakage (E2E text scan per route). F3 Missing-key fallback shows English and logs once. F4 Pluralisation and number/date formatting use the active locale. F5 `i18n.test.ts` extended and green. F6 No layout break at 360 px in English (longer strings) — E2E overflow check |
| **Regression tests** | Full E2E sweep in `uz` and `en`; text-snapshot of Home in both |
| **Rollback** | Revert the PRs; each screen migration is an independent commit. Default locale remains `uz` until the owner flips it |
| **Deployment risk** | **Low–Medium.** Many files touched (merge conflicts, missed strings), little logic risk |

## M7 — AI Gateway and usage metering

| | |
|---|---|
| **Exact scope** | Implement the five provider interfaces and the gateway per `AI_COST_ARCHITECTURE.md` §2; env validation; health; retries/timeouts; `usage_records`; credit accounts, reservations, ledger and sweeper per `AI_CREDIT_CONTROL_SPEC.md`; `provider_prices` admin entry; spend ceilings and alerts; admin cost reports; port the existing Anthropic/OpenAI/Gemini code as the first `LLMProvider` implementations and the Azure code as the first `TextToSpeechProvider`; **fake providers** for tests and a clearly labelled demo mode; keep AI buttons hidden/disabled with an explicit "unavailable" state when no provider is configured. **No real provider is enabled by this milestone.** |
| **Dependencies** | M2b, M3, M5 (plan entitlements); owner decision on credit allowances (D8) can follow |
| **Files / modules** | new `server/ai-gateway/*`, migrate `server/ai.ts`, `server/tts.ts`, `server/index.ts` AI routes, `src/lib/ai.ts`, `src/lib/tts.ts`, `src/pages/Speaking.tsx`/`Writing.tsx` (states), new admin report endpoints |
| **Database changes** | Migrations adding `ai_credit_accounts`, `ai_credit_ledger`, `ai_reservations`, `spend_counters`, `provider_prices`, `usage_records` (with partitioning decision), `credit_prices` |
| **Acceptance criteria** | G1 The concurrency test (50 parallel, balance 10 ⇒ exactly 10 succeed) passes against PostgreSQL. G2 Idempotency, failure/refund, crash-sweeper, double-settle, ceiling, tampering tests (§12 of the credit spec) pass. G3 Invariant job over a randomised soak run reports zero violations. G4 With no provider configured, every AI feature shows an explicit unavailable state and **no AI-looking output**. G5 Provider replacement test: swapping the fake LLM for another fake requires changing configuration only. G6 Cost report queries return correct totals on seeded data. G7 No secret appears in logs, responses or the bundle |
| **Regression tests** | Existing `ai.test.ts`, `tts.test.ts` rewritten against the gateway; E2E speaking/writing in demo mode |
| **Rollback** | Flag `AI_GATEWAY` off routes the old endpoints (still present for one release). Tables additive; credits already granted remain valid |
| **Deployment risk** | **Medium** (no real spend possible while no key exists). Becomes **High** when the first real key is added — that step is **outside M7** and requires its own approval and a controlled canary |

## M8 — Production hardening and acceptance testing

| | |
|---|---|
| **Exact scope** | Security review and external penetration test; load test of the main journeys and the credit path; accessibility audit (WCAG 2.1 AA targets) and fixes (headings, labels, tap targets, focus trap in dialogs, contrast); 360 px layout fixes; performance budget (JS size, LCP on a mid-range phone and a Central-Asian network profile); compression and caching headers; SEO groundwork (path routes, per-route titles, `robots.txt`, favicon, sitemap); alerting and on-call runbook; backup **restore drill** into production-like infrastructure; physical-device matrix (Android Chrome, iOS Safari, a low-end device) for microphone, audio playback, share, payment dialogs; privacy notice and deletion/export flows verified end to end; retire SQLite artifacts per the migration plan; final acceptance report. |
| **Dependencies** | M1–M7 |
| **Files / modules** | `src/styles.css` and components for layout/a11y fixes, `server/static.ts` (headers, compression), `index.html`, routing, docs/runbooks; test assets |
| **Database changes** | Index tuning from measured slow queries; archive `legacy` schema |
| **Acceptance criteria** | H1 Zero Critical/High findings open from the security review. H2 Load test meets targets agreed with the owner (**[U]** targets, e.g. N concurrent users at p95 < X ms) with zero data-integrity violations. H3 Lighthouse/axe thresholds met on the agreed routes. H4 Device matrix recorded with pass/fail per item; failures are listed as known issues, **not hidden**. H5 Restore drill meets the stated recovery time. H6 Deletion and export verified with a test account. H7 Rollback rehearsal for the latest release succeeds |
| **Regression tests** | Entire suite plus soak and chaos tests (kill a replica during writes; provider timeouts; duplicate payment webhooks) |
| **Rollback** | Per-change revert; infrastructure changes documented with reversal steps |
| **Deployment risk** | **Medium.** Large surface but mostly additive |

## 2. Release ordering and flags

| Flag | Introduced | Default | Removed |
|---|---|---|---|
| `DB_BACKEND` | M2a | `sqlite` | M8 |
| `AUTH_V2` | M3 | off | M8 |
| `SERVER_STATE` | M4 | off | M8 |
| `ENTITLEMENTS_V2` | M5 | off | M8 |
| `AI_GATEWAY` | M7 | off | M8 |

## 3. Parallel work and conflict map

- M6 touches the same files as M3–M5 (screens). Rule: M6 PRs change only string literals; M3–M5 PRs avoid renaming UI text.
- Content authoring for Phase 2 can start any time after M5's content schema is fixed; it does not block M1–M8.

## 4. What this plan does **not** include
Curriculum authoring, SAT/CEFR content, realtime voice, real payment integrations, regional pricing, gamification redesign: Phases 2–8.
