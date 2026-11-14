# BANDLY — Phase 0.1 Architecture Review

Scope: cross-review of the five Phase 0 documents in `docs/` (written at commit `b51f705`). The Phase 0 documents are **not modified**; this file records what was corrected, what was found inconsistent, and what is still unknown.

Convention used in every Phase 0.1 document: **[F] verified fact** (with how it was verified), **[R] recommendation**, **[U] unresolved question**.

---

## 1. Corrections to Phase 0 statements

| # | Phase 0 statement | Finding | Evidence |
|---|---|---|---|
| 1 | `DATABASE_DESIGN.md`: foreign keys "not asserted by any test" / enforcement unclear | **[F]** `node:sqlite` enables foreign keys by default. In a scratch database `PRAGMA foreign_keys` returned `1` and inserting an orphan row failed with `FOREIGN KEY constraint failed`. The declared `REFERENCES` in `server/db.ts` are enforced. Still, no committed test asserts it. | Executed on Node v22.23.4, scratch in-memory DB |
| 2 | "25 test suites" (`PRODUCT_AUDIT.md`, `TECHNICAL_ARCHITECTURE.md`) | **[F]** There are **24** test files and 24 chained commands in `npm test`. The 25th line of "OK" output comes from `examiner.test.ts`, which prints two lines. | `package.json` script split on `&&` = 24; `ls *.test.ts` = 24 |
| 3 | "21 routes" (architecture) vs "26 routes" (audit sweep) | **[F]** Both numbers are correct and measure different things. `src/App.tsx` registers **21 static routes**. Three more route *patterns* exist (`#/exam|mocks/reading|listening[/id]`, `#/shadow/:id`, `#/duel/:code`). The 26 URLs swept = 21 static + 4 pattern instances (`exam/reading`, `exam/reading/reading-1`, `exam/listening/listening-1`, `shadow/witness`) + 1 deliberately invalid URL (`#/nope`). **Not swept:** `#/mocks/reading`, `#/mocks/listening`, `#/mocks/*/id`, `#/exam/listening`, `#/duel/:code`. Coverage of the sweep is therefore 21/21 static routes and 4 of ~9 pattern variants. | Count of keys in `routes` object in `App.tsx`; the URL list in the sweep script |
| 4 | `DATABASE_DESIGN.md` target tables `payments` and `subscriptions` | **[F]** Both names already exist in production SQLite with **different shapes** (`payments.track/days/hamyon_*`, `subscriptions(player_id, track, until)`). The Phase 0 document did not address the collision. Resolved in `MIGRATION_SAFETY_PLAN.md` §3 (separate `legacy` schema + explicit mapping). | `server/db.ts` |
| 5 | `DATABASE_DESIGN.md`: `user_identities(provider='legacy_token', subject = …)` | This invites storing the raw bearer token as the identity subject. **Rejected.** Replaced by a hashed credential table (`AUTH_SECURITY_SPEC.md` §6). | Security review |
| 6 | Migration step 5: "SQLite kept read-only for one release" presented as the rollback path | **Insufficient.** Once PostgreSQL receives writes (XP, payments, new users), reverting reads to a read-only SQLite loses those writes. Replaced by a bounded rollback window with a tested reverse export (`MIGRATION_SAFETY_PLAN.md` §8). | Reasoning; no assumption about reverse tooling existing |
| 7 | `AI_COST_ARCHITECTURE.md` §6: admission checks "credits are available" then a ledger entry | Check-then-write is **not atomic**: parallel requests can all pass the check. Replaced by reservation under a row lock (`AI_CREDIT_CONTROL_SPEC.md`). | Race analysis |
| 8 | `TECHNICAL_ARCHITECTURE.md` A5: answer keys never sent before submission | Consistent for graded tests, but today's `MockTest.tsx` grades **in the browser** and shows evidence after submit. The server therefore needs an attempt/submit endpoint; this was implicit and is now an explicit M5 deliverable. | `src/components/MockTest.tsx`, `src/lib/grade.ts` |
| 9 | `IMPLEMENTATION_ROADMAP.md` Phase 1 "XL" single release | Too broad: eleven workstreams with hidden ordering constraints (auth needs PostgreSQL; entitlements need accounts). Split into M1–M8 in `PHASE_1_EXECUTION_PLAN.md`. | — |
| 10 | Roadmap decision D4 "move to a European region" | **Cannot be decided on latency alone.** Personal-data localization rules in the target markets may require storing citizens' data in-country. This was omitted. See U-1 below and `OWNER_DECISIONS.md`. | — |
| 11 | Phase 0 listed "Telegram login" among sign-in methods without a validation design | Added in `AUTH_SECURITY_SPEC.md` §4. | — |

## 2. Remaining inconsistencies between documents, now resolved

| Topic | Inconsistency | Resolution |
|---|---|---|
| Credit ledger vs balance | `AI_COST_ARCHITECTURE.md` said the ledger is append-only and the balance is "never trusted from the client", but `DATABASE_DESIGN.md` had `balance_after` in the ledger as the only balance | A balance row **and** an append-only ledger updated in one transaction; invariant `balance = Σ ledger` is tested (`AI_CREDIT_CONTROL_SPEC.md` §3) |
| Content API vs free mock tests | Roadmap says "answer keys stay on the server"; Mock Arena is "free" | Free tests are public to read but **graded on the server**; the free/paid distinction is an entitlement, not a different code path |
| Fastify migration | Architecture A3 says introduce Fastify "incrementally"; roadmap puts framework work in the Phase 1 "web platform" item with no owner | Framework change is **not** a Phase 1 requirement. New endpoints are added behind a thin validation helper; a framework swap is deferred and listed as U-5 |
| Session cookies | Architecture says cookies; the current client sends a token in a header and JSON bodies | M3 supports both for a transition window; CSRF controls are specified for the cookie path (`AUTH_SECURITY_SPEC.md` §7) |
| Content in database | Architecture moves content into the DB; roadmap Phase 1 also keeps today's `*.test.ts` integrity tests that import TypeScript content | Content stays authored in TypeScript/JSON in the repository and is **imported** into the DB by a deterministic seed step; integrity tests keep running on the source. The DB is a deployment target, not the authoring tool |

## 3. Production validation matrix (Task 4)

This section separates what was actually executed from what was only reasoned about.

### 3.1 Tests executed locally (sandbox, commit `b51f705`)

| What | Result | Notes |
|---|---|---|
| `npm test` — 24 suites | **[F]** All passed | Unit and logic tests; server tests use fake providers and in-memory SQLite |
| `npm run build` (`tsc --noEmit` + `vite build`) | **[F]** Passed; JS 620 kB (204 kB gzip), CSS 54 kB | — |
| Playwright sweep, 26 URLs × 2 viewports against a **local** production build (`npm start`, port 3102, empty DB) | **[F]** 0 page errors; overflow at 360 px on 4 routes; no `<h1>` on 22/26; unlabeled inputs; asset headers; unknown-API 404; `/api/me` without token 401; admin without token 403; 130 rapid requests to `/api/health` returned 92×200 and 38×429 | The Playwright scripts used during development live in a temporary scratchpad and are **not committed**; the sweep cannot be re-run from the repository |
| Earlier development E2E (placement, all 11 tests solved, practice, speaking in text mode with mocked speech APIs, homework, results, daily cards, studio steps, payment flow against a **fake** Hamyon server) | **[F]** Passed at the time they were run | Run against local dev servers; same caveat on repository location |

### 3.2 Production deployment observations (Railway API, read-only)

| Observation | Value | How obtained |
|---|---|---|
| Service `bandly`, branch `main`, 1 replica, region `sfo` | **[F]** | `describe-environment` |
| Volume `bandly-data` (5 000 MB) mounted at `/data` | **[F]** | `describe-environment` |
| Latest deployment SUCCESS; startup log: `Bandly: http://0.0.0.0:8080 (AI: none, TTS: none, To'lov: yo'q (demo))` | **[F]** | deploy logs |
| 24 h traffic: 71 requests, 62×2xx, 9×4xx, 0×5xx; the 4xx are `/favicon.ico` and `/robots.txt` (a crawler) | **[F]** | `http-requests`, HTTP log filter |
| Memory ≈ 0.09 GB current, 0.19 GB max; CPU negligible; disk metric 0.084 GB | **[F]** | `get-service-metrics` |

**Not an observation:** the public URL was not opened. A direct request from the sandbox received `CONNECT tunnel failed, response 403`. No claim in any document that a particular page works *in production* rests on opening it.

### 3.3 Real provider integrations

| Provider | Status |
|---|---|
| LLM (Anthropic / OpenAI / Gemini) | **[F] Never run against a real key.** Production reports `AI: none`. Tested with fake HTTP servers only |
| Azure TTS | **[F] Never run against a real key.** `TTS: none`. Voice names in `.env.example` (`uz-UZ-MadinaNeural`, `uz-UZ-SardorNeural`) are **unverified** |
| Hamyon payments | **[F] Never run against the real service.** Production is in demo mode. Request/response formats were derived from the owner's other project's code, not from provider documentation |
| Email, Google, Telegram login | Not implemented |

### 3.4 Physical-device tests

**[F] None performed.** The owner reported, on a real phone, Speaking that froze and misrecognized speech, and the English-only examiner voice. Mitigations were shipped afterwards (non-continuous recognition on mobile, confirmation step, text fallback) and **never re-tested on a device**. Audio playback on iOS (autoplay and Range requests), microphone permission flows, keyboard overlap, safe areas and share-image download on mobile are all unverified.

### 3.5 Remains unverified (consolidated)

| # | Item | Why it matters | How to verify |
|---|---|---|---|
| V1 | Production database content: number of players, whether any `subscriptions`/`payments` rows exist, whether `ADMIN_TOKEN` is set | Decides whether any customer-migration work exists (D5 in the roadmap assumed none) | M1: snapshot via `VACUUM INTO` and inspect read-only |
| V2 | The SQLite file is actually on the mounted volume (`/data/bandly.sqlite`) and survives redeploy | If not, user data was already being lost on each deploy | M1: write a marker row, redeploy, confirm presence; the 0.084 GB disk figure does not distinguish volume from container disk |
| V3 | Whether Railway's edge compresses responses | Affects the 623 kB bundle cost | `curl -H 'accept-encoding: gzip'` from an unrestricted network |
| V4 | Real-device behaviour (§3.4) | Speaking is a core product claim | Device matrix in M8 |
| V5 | `node:sqlite` `backup()` exists on the Node version used by the Railway image (`node:22-slim` is a floating tag) | Backup tooling choice | Use `VACUUM INTO` (SQL, version independent) — verified locally |
| V6 | Behaviour of the production service under load | Only 71 requests/day observed | Load test in M8 |
| V7 | Lighthouse/Core Web Vitals on a mid-range phone and Central-Asian network | Performance budget | M8 |

## 4. Open questions that block design choices

| ID | Question | Blocks |
|---|---|---|
| **U-1** | **Data residency / localization law** for personal data of users in Uzbekistan, Kazakhstan, Kyrgyzstan and Tajikistan. Some of these jurisdictions are reported to require in-country storage and/or registration of databases. This author is not a lawyer and has **not verified** the current text of any of these laws. | Hosting region (D4), database provider, backups location, whether a single global database is allowed |
| **U-2** | Is any payment/subscription row present in production (V1)? | Migration scope |
| **U-3** | Which email-delivery provider and sender domain will be used | M3 |
| **U-4** | Which payment provider handles international cards | Phase 7, not Phase 1 |
| **U-5** | Keep the hand-written Node `http` router or adopt a framework | Effort of every new endpoint; not required for M1–M8 |
| **U-6** | Statutory retention periods for payment records in the operating jurisdiction | Deletion design (`AUTH_SECURITY_SPEC.md` §9) |
| **U-7** | Minimum age: 13 / 14 / 16 differs by market and law | Sign-up flow (`AUTH_SECURITY_SPEC.md` §8) |
| **U-8** | Real-provider language support for Uzbek/Kazakh/Kyrgyz/Tajik speech | Phase 3; not Phase 1 |

## 5. Review verdict

The Phase 0 direction (server-authoritative data, entitlements enforced on the server, provider interfaces, deterministic-first learning) is **kept**. The changes are about *how to get there safely*: a migration that cannot lose data silently, credential handling that does not retain raw tokens, an atomic credit model, honest verification boundaries, and a delivery sequence in eight independently releasable milestones.
