# FEATURE INVENTORY (baseline commit `b51f705`, branch `main`)

Evidence sources: repository static inspection (this phase: `src/App.tsx` route table, `server/index.ts` endpoints, `src/content/*`, `package.json` test chain) and Phase 0 results (`docs/PRODUCT_AUDIT.md`: unit tests green, local production build driven by Playwright at 360/1280 px, Railway API read-only). **Not verified anywhere:** physical phones, real AI/TTS/payment providers, the public URL (unreachable from the sandbox), production DB contents.

**Status rules.** WORKING = logic covered by a passing unit suite **and** page loaded without error in the Phase 0 local run; it does *not* mean device-verified or content-complete. A route that exists but whose entitlement is client-side is still WORKING for function, with the limitation noted. Exactly one status per row.

Target products: **GE** General English · **EP** Exam Preparation · **MA** Mock Arena · **CORE** shared intelligence layer · **PLAT** platform. Actions: KEEP / REFACTOR / MOVE / REPLACE / BUILD.

## 1. Existing features

| # | Feature | Route / module | Frontend evidence | Backend evidence | DB evidence | Provider dep. | Test evidence | Status | Limitations | Target | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Home dashboard | `#/` `Home.tsx`, `DailyCards.tsx`, `ProgressCard.tsx` | renders in local run | none (localStorage) | none | none | `daily.test.ts`, `progress.test.ts` | WORKING | data only in localStorage; no server profile; Uzbek only | CORE | REFACTOR |
| 2 | Placement test | `#/placement` `Placement.tsx`, `lib/placement.ts`, `content/placement.ts` (41 lines) | local run | none | none | none | `placement.test.ts` | WORKING | short bank; result in localStorage; General English vs exam readiness not separated | CORE/GE | REFACTOR |
| 3 | Practice trainer | `#/practice` `Practice.tsx`, `lib/practice.ts` | local run | none | none | none | `practice.test.ts` | WORKING | small bank (95 content lines); CEFR-tagged but no curriculum graph | GE | REFACTOR |
| 4 | Homework | `#/homework` `Homework.tsx`, `lib/homework.ts` | local run | none | none | none | `homework.test.ts` | WORKING | client-computed days (timezone rule unverified) | CORE | REFACTOR |
| 5 | Results dashboard | `#/results` `Results.tsx`, `LineChart.tsx`, `lib/history.ts` | local run | none | none | none | `progress.test.ts` | WORKING | history in localStorage only (loss on clear/device change) | CORE | REFACTOR |
| 6 | Exam hub | `#/exam` `Exam.tsx` | local run | none | none | none | none direct | WORKING | IELTS Academic only | EP | KEEP |
| 7 | IELTS Reading tests | `#/exam/reading[/id]` `TestList`, `Reading.tsx`, `content/reading1-6.ts`, `readingTests.ts` | local run | none (graded in browser) | none | none | `grade.test.ts`, `band.test.ts` | WORKING | 6 passages; answer keys in public bundle; client grading | EP/MA | REFACTOR |
| 8 | IELTS Listening tests | `#/exam/listening[/id]` `Listening.tsx`, `content/listening1-5.ts` | local run | `/api/tts` optional | none | browser TTS (no real audio files) | `grade.test.ts`, `tts.test.ts` | PARTIALLY WORKING | synthetic speech, no recorded audio; transcripts in bundle | EP/MA | REFACTOR |
| 9 | IELTS Writing | `#/exam/writing` `Writing.tsx`, `lib/writingCheck.ts`, `writingGuide.ts` | local run | `/api/ai/writing` (unused without key) | none | optional LLM | `writingCheck.test.ts`, `writingGuide.test.ts` | PARTIALLY WORKING | rule-based checks; AI path never run against real provider; Task 1+2 coverage thin | EP | REFACTOR |
| 10 | IELTS Speaking | `#/exam/speaking` `Speaking.tsx`, `lib/examiner.ts`, `speech.ts`, `speakingReview.ts` | local run | `/api/ai/speaking`, `/api/ai/followup` (unused without key) | none | browser STT/TTS; optional LLM | `examiner.test.ts`, `speakingReview.test.ts`, `speakingModels.test.ts` | PARTIALLY WORKING | depends on browser recognition (unverified on real devices, weak for accented speech); no realtime voice | EP | REFACTOR |
| 11 | Listen-and-repeat studio | `#/shadow[/id]` `Shadow.tsx`, `lib/shadow.ts`, `content/scenes.ts` (395 lines) | local run | none | none | browser speech | `shadow.test.ts` | PARTIALLY WORKING | original scene scripts (no film clips); recognition quality unverified | GE/EP | KEEP |
| 12 | Grammar | `#/grammar` `Grammar.tsx`, `content/grammar.ts` (118 lines), `grammarCheck.ts` | local run | none | none | none | `grammar.test.ts`, `grammarCheck.test.ts` | WORKING | **sold as separate track `grammar`** (strategic mismatch); no mastery model | GE | MOVE |
| 13 | Mock hub | `#/mocks` `Mocks.tsx` | local run | none | none | none | none direct | WORKING | priced track `mocks`; target is free | MA | MOVE |
| 14 | Full exam simulation | `#/mocks/full` `FullExam.tsx`, `MockTest.tsx` | local run | none | none | none | `grade.test.ts`, `band.test.ts` | PARTIALLY WORKING | timer client-side; not server-authoritative | MA | REFACTOR |
| 15 | Vocabulary & SRS | `lib/srs.ts`, `content/vocab*.ts` | used by games/practice | none | none | none | `vocabGame.test.ts` | PARTIALLY WORKING | SRS exists; no mastery states `new…mastered`, no collocation/synonym data | GE | REFACTOR |
| 16 | Games hub (Rush, Pairs, Spell) | `#/games/*` | local run | XP via `/api/sync` | `xp_log` | none | `game.test.ts`, `vocabGame.test.ts` | WORKING | XP client-reported (farmable) | PLAT | REFACTOR |
| 17 | Tools | `#/tools` `Tools.tsx` | local run | none | none | none | none | NEEDS VERIFICATION | purpose-by-purpose behaviour not tested | PLAT | KEEP |
| 18 | Leaderboard | `#/league` `League.tsx`, `/api/leaderboard` | local run | yes | `players` | none | `db.test.ts` | WORKING | trusts client XP | PLAT | REFACTOR |
| 19 | Duels | `#/duel[/code]` `Duel.tsx`, `/api/duel/*` | local run | yes | `duels`, `duel_players` | none | `db.test.ts` | PARTIALLY WORKING | no anti-cheat, no matchmaking, scoring trust level NEEDS VERIFICATION | PLAT | REFACTOR |
| 20 | Profile / account | `#/profile` `Profile.tsx`, `lib/account.ts`, `JoinForm.tsx` | local run | `/api/join`, `/api/sync`, `/api/me` | `players` (plaintext token) | none | `db.test.ts` | PARTIALLY WORKING | token-only identity, no recovery; `syncNow` swallows failures | PLAT | REPLACE (auth) |
| 21 | Pricing & entitlements | `#/pricing` `Pricing.tsx`, `Gate.tsx`, `config.ts`, `server/pricing.ts` | local run | `/api/pay/config`, `/api/me` | `subscriptions` | none | `payments.test.ts` | MOCK / DEMO | `Gate` trusts client `plan`; "Demo: sinab ko'rish" button grants locally; 3 old tracks | PLAT | REPLACE |
| 22 | Payments (Hamyon) | `server/hamyon.ts`, `payments.ts`, `PaySheet.tsx`, `/api/pay/*` | demo UI | webhook endpoints | `payments`, `subscriptions` | Hamyon (no live shop) | `payments.test.ts` (fake server only) | BACKEND ONLY | never run against provider; 500 on delivery error; no inbox/reconciliation | PLAT | REFACTOR |
| 23 | Admin endpoints | `/api/admin/payments`, `/api/admin/grant` | none | token-protected | `payments`, `subscriptions` | none | partial in `payments.test.ts` | BACKEND ONLY | `ADMIN_TOKEN` status in prod unknown; no UI, no roles | PLAT | REPLACE |
| 24 | AI gateway (LLM) | `server/ai.ts`, `src/lib/ai.ts` | `EvalCard.tsx` | `/api/ai/*`, rate/usage buckets | `ai_usage` | single-vendor shape, no key | `ai.test.ts` (fake server) | BACKEND ONLY | no provider interface, no credits ledger, never run for real | CORE | REPLACE |
| 25 | TTS | `server/tts.ts`, `lib/tts.ts` | audio buttons | `/api/tts`, `/api/tts/status` | none | optional vendor, no key | `tts.test.ts` | BACKEND ONLY | not run for real; voice names unverified | CORE | REFACTOR |
| 26 | Personas / roast | `PersonaPicker.tsx`, `lib/roast.ts`, `content/roasts.ts` | local run | none | none | none | `roast.test.ts` | PARTIALLY WORKING | static content; 18+ opt-in is client-side checkbox only; not 5 behaviour-distinct personalities | CORE | REFACTOR |
| 27 | Localization | `src/i18n/index.ts`, `uz.ts` (34 keys) | partial | none | none | none | `i18n.test.ts` | PARTIALLY WORKING | one locale, ~360 hard-coded Uzbek lines | PLAT | REFACTOR |
| 28 | Share card | `lib/shareCard.ts` | used in results | none | none | none | none | NEEDS VERIFICATION | not tested | PLAT | KEEP |
| 29 | Static server & health | `server/static.ts`, `/api/health` | n/a | yes | none | none | `static.test.ts` | WORKING | no compression verified; hand-written 120/min rate limiter | PLAT | KEEP |
| 30 | CI / backups / migrations | — | — | — | — | — | 24-command local chain only | MISSING | no CI, no backups, no migration runner | PLAT | BUILD (M1) |

## 2. Target features with no implementation

| Feature | Status | Target | Action |
|---|---|---|---|
| General English A1–C2 curriculum (units, lessons, mastery) | MISSING | GE | BUILD |
| Server-side accounts, sessions, recovery | MISSING | PLAT | BUILD |
| Adaptive engine (profile, error taxonomy, mastery, plan) | MISSING | CORE | BUILD |
| Four independent language settings; kk/ky/tg locales | MISSING | PLAT | BUILD |
| Five personalities + safety enforcement | MISSING (only static examiner/roast) | CORE | BUILD |
| Provider-agnostic voice engine (STT/TTS/realtime) | MISSING | CORE | BUILD |
| IELTS General Training, CEFR, SAT modules | MISSING | EP | BUILD |
| Free server-graded Mock Arena with attempts | MISSING | MA | BUILD |
| AI credit ledger / spend ceilings | MISSING (designed in `phase-0.2/FINAL_AI_CREDIT_SPEC.md`) | PLAT | BUILD |
| Country configuration, local pricing | MISSING | PLAT | BUILD |
| Creator/referral program | MISSING | PLAT | BUILD |
| Admin/CMS with roles and content lifecycle | MISSING | PLAT | BUILD |
| Product analytics events | MISSING | PLAT | BUILD |
| Account deletion / data export | MISSING | PLAT | BUILD |
| Speak-or-Die-style speaking challenge | MISSING | GE/PLAT | BUILD (own design) |

## 3. Counts
30 existing rows: WORKING 12, PARTIALLY WORKING 10, MOCK / DEMO 1, BACKEND ONLY 4, NEEDS VERIFICATION 2, MISSING 1 (CI/backups), BROKEN 0 (none observed; absence of evidence is not proof).

## 4. Added after the baseline (branch `ccr-f38ad651-jv2w3f`, not deployed)
| Feature | Route / module | Status | Evidence | Limitations |
|---|---|---|---|---|
| General English path | `#/learn` `Learn.tsx`, `src/content/lessons/*` | WORKING (pilot content) | `lessons.test.ts` (content validation, answer keys, graph), Playwright walkthrough | 33 lessons A1–C2 (11 units) with explanation, practice, speaking (browser recognition, not scored), rule-based writing and mastery check; status `pilot`: methodologist review pending; C2 has one unit only; progress in localStorage only |
| Lesson player | `#/learn/<id>` `Lesson.tsx`, `src/lib/lessons.ts` | WORKING | tests + Playwright (6/6 pass → next lesson unlocked) | no audio for examples yet; no speaking/writing activities inside lessons |
| Adaptive engine | `src/lib/adaptive/*` | WORKING (logic) | `adaptive.test.ts` (10⁴ random histories), `record.test.ts` | constants are hypotheses; device-local |
| "Bugungi reja" (today's plan) | `PlanCard.tsx` on `#/` | WORKING | Playwright (A1/A2/B1/B2 cases) | reading/listening links go to the exam track, which is paywalled in demo mode |
| Answer recording | Grammar, Practice, word games, Duel, Reading/Listening tests, lessons | WORKING | `record.test.ts`, Playwright | self-reports ("Bilaman") deliberately excluded |
| Knowledge map | `MasteryCard.tsx` on `#/results` | WORKING | Playwright | — |
| Language settings + Intl helpers | `src/i18n/settings.ts`, `format.ts` | BACKEND ONLY (not used by screens yet) | `format.test.ts` | no en/ru/kk/ky/tg catalogues |
| Backups | `scripts/backup/*` | WORKING (tool) | `backup.test.ts` | not scheduled; no off-site copy (OD-01/OD-04) |
| CI | `.github/workflows/ci.yml` | BROKEN (external) | runs never start: GitHub account billing lock | owner must resolve billing |
| Skill check (Reading + Listening) | `#/skills` `SkillCheck.tsx`, `src/lib/skillCheck.ts`, `src/content/skillCheck.ts` | WORKING (pilot) | `skillCheck.test.ts`, Playwright walkthrough | 3 original sets (A2, B1, B2), 4 questions each per skill; estimate rule: ≥ 3/4 → set level, else one below; listening via browser speech synthesis (2 plays); separate from the grammar/vocabulary placement level; not an official result |
| Lesson words in SRS | `src/content/vocabLessons.ts`, `addToReview` in `store.ts` | WORKING | `lessons.test.ts`, Playwright | 21 new words + 7 existing; added on lesson pass or by button |
