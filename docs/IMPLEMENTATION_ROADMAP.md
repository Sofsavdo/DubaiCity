# BANDLY — Implementation Roadmap

Based on the findings in `PRODUCT_AUDIT.md`. Sizes are relative (S, M, L, XL), not dates. Nothing here starts until Phase 0 is approved.

## Guiding order

The specification lists phases 1–8. The audit changes **what Phase 1 must contain**: three Critical findings (browser-only data, client-side entitlements, no accounts) sit underneath everything else. Building curriculum, AI or payments on top of them would have to be redone.

## Decisions needed from the owner before Phase 1

| # | Decision | Recommendation |
|---|---|---|
| D1 | Move from SQLite to PostgreSQL on Railway (adds a monthly database cost) | Yes |
| D2 | Sign-in methods | Email code first, then Google and Telegram |
| D3 | Collect year of birth at sign-up (needed for the minors rule) | Yes |
| D4 | Hosting region | Move to Europe |
| D5 | What happens to the three current tracks (`exam`, `grammar`, `mocks`) | Map to the new products; no one has paid yet, so no customer migration is needed |
| D6 | Payment providers for launch | Keep Hamyon for Uzbekistan; choose one international provider (cards) — needs a legal entity able to accept payments |
| D7 | Who authors and reviews curriculum content and translations | Native-speaker review is required for every non-English locale; AI drafts alone are not sufficient |
| D8 | First launch scope | General English A1–B1 + IELTS Academic + free Mock Arena, in English, Uzbek and Russian |

## Phase 1 — Foundation (XL)

| Workstream | Tasks | Fixes |
|---|---|---|
| Safety net | CI (typecheck, tests, build, Playwright smoke); commit the e2e scenarios; error tracking; database backup | H11, H7 |
| Data | Migration runner; PostgreSQL schema for identity, commerce, usage; copy script from SQLite; dual-read release | H7 |
| Accounts | Sessions, email-code sign-in, legacy-token link, age band, account page | C3 |
| Server-authoritative state | Profile, results, SRS and XP ledger on the server; one-time import of `localStorage`; offline-tolerant client cache | C1, H8, M9 |
| Entitlements | Products, plans, `plan_entitlements`, prices as data; `requireEntitlement` guard; free-tier limits on the server | C2, H1 |
| Content API | Move tests, exercises and essays out of the bundle; answer keys stay on the server until submission | C2, H9 |
| AI gateway | Five interfaces, env validation, health, timeouts, retries, `usage_records`, credit ledger; current adapter ported as the first `LLMProvider` | H5 |
| Localization | Message catalogs, locale switcher, extraction of the ~360 hard-coded strings, English as base; `*_translations` tables | H2 |
| Web platform | Path routing, code splitting, compression, 404 page, per-route titles, `robots.txt`, favicon, security headers | H9, H10, M3, M6 |
| Design system | Primitives extracted from existing styles; fix 360 px overflow, labels, headings, tap targets | M1, M4 |
| Small fixes | Homework day boundary, placeholder contact, render side effect | M2, H6, L1 |

**Exit criteria:** a new user can sign up, lose their device, sign in elsewhere and find their progress; a non-subscriber cannot obtain paid content from the network or the bundle; every AI call (still zero) would be metered; the UI switches between English and Uzbek with no hard-coded strings left in the migrated screens; all existing features still work.

## Phase 2 — General English (XL, content-heavy)

- Curriculum tables and an authoring format with validation (reuse today's integrity-test approach).
- Diagnostic assessment covering grammar, vocabulary, reading and listening (speaking optional), replacing the 20-item placement.
- Lesson player: objectives → presentation → exercises → quiz → mastery update.
- Mastery tracking per skill tag; error history fed by the existing rule checker.
- Plan generator (rules): level, target, deadline, daily minutes, weak skills, due reviews.
- Migrate existing vocabulary (466), grammar (80), sentence exercises (54) and scenes (10) into lessons.
- **Content gap to plan for:** a full A1–C2 course is thousands of exercises. Launch with A1–B1 complete and state coverage honestly in the product.

**Exit criteria:** two learners at different levels receive different plans that change after each session; mastery and plans persist on the server; lesson content is entitlement-checked.

## Phase 3 — AI voice (L, needs keys)

- Provider evaluation with recorded tests per locale (English first).
- STT and TTS adapters; server-brokered realtime session if a suitable provider is chosen.
- Personality configurations and the output safety filter in every supported language.
- Speaking feedback: grammar, vocabulary, fluency; pronunciation only if the chosen provider supplies phoneme-level scores.
- Credits enforced from the first call; demo mode when no key is present.

**Owner input required:** provider accounts and keys, placed in Railway variables.

## Phase 4 — Exam preparation (XL, content-heavy)

- IELTS Academic first: lessons per question type, Writing Task 1 (charts need authored visuals) and Task 2, Speaking Parts 1–3 with rubric-based AI evaluation.
- IELTS General Training, CEFR and SAT as separate curricula with their own scoring schemes.
- SAT requires mathematics rendering and a different test engine (adaptive modules) — scope separately.

## Phase 5 — Mock Arena (L)

- Full-length papers (40-question Reading and Listening) from authored banks; section tests.
- Server-timed attempts, answer keys never sent to the client, result history and analytics.
- Free for objective tests; AI evaluation of Writing and Speaking sections consumes credits.

## Phase 6 — Gamification (M)

- XP ledger with one payout per activity and diminishing returns for repeats (H8).
- Daily missions, weekly goals, achievements tied to mastery rather than raw XP.
- League and duels moved onto the new identity; multiplayer challenges.

## Phase 7 — Payments and monetization (L, needs credentials)

- Payment-provider abstraction with Hamyon as the first implementation and one international provider.
- Subscription lifecycle: purchase, renewal or expiry, upgrade, downgrade, billing history, receipts.
- Regional prices as data; experiments on the $5.99 / $7.99 / $9.99 hypotheses.

## Phase 8 — Internationalization and launch (L)

- Russian, Kazakh, Kyrgyz and Tajik catalogs and content translations, each reviewed by a native speaker.
- SEO landing pages per locale, performance budget, security review, analytics, restore drill, load test.

## Dependencies

```
Phase 1 ──┬─▶ Phase 2 ──▶ Phase 4 ──▶ Phase 5
          ├─▶ Phase 3 (needs keys) ──▶ Phase 4 (AI evaluation)
          ├─▶ Phase 6
          └─▶ Phase 7 (needs payment credentials) ──▶ Phase 8
```

## Main risks

| Risk | Mitigation |
|---|---|
| Content authoring is the largest cost and is not an engineering task | Decide D7 early; ship levels incrementally; never present machine-drafted content as reviewed |
| Voice providers may not support Kazakh, Kyrgyz or Tajik | Test before promising; English voice with local-language text as the fallback |
| AI cost exceeds low subscription prices | Credits and caps from the first call; measure before setting allowances |
| Migration loses a current user's progress | Import path with local data kept until the server confirms; legacy tokens stay valid |
| Scope: IELTS + SAT + CEFR + A1–C2 at once | Launch scope in D8; other products follow on the same engine |
| Real-device behaviour (microphone, audio) remains unverified | Device test matrix in Phase 1's safety net |

## What the owner will receive at the end of each phase

Implemented items, files changed, database changes, tests run and their results, remaining issues, deployment risks and the AI operating-cost effect — as required by the specification.
