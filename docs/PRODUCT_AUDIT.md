# BANDLY — Product Audit (Phase 0)

- **Audited commit:** `b51f705` on `main` (deployed to Railway on 2026-11-14, deployment `eb3e9d61`, status SUCCESS)
- **Audit date:** 2026-11-14
- **Scope:** repository, frontend, backend, database, authentication, routes, features, AI integrations, deployment, responsiveness, security, performance, known bugs.
- **No production code was changed during this audit.** Only the files in `docs/` were added.

## 1. How the evidence was collected

| Source | What it covered |
|---|---|
| Static inspection of the repository | Structure, dependencies, routes, endpoints, schema, storage keys, content volume |
| `npm test` (25 suites) and `npm run build` | Business logic and build health — all pass |
| Local production build of the same commit (`npm start`) driven by Playwright | 26 routes at 360 px and 1280 px: page errors, horizontal overflow, headings, labels, tap targets, response headers, rate limiting |
| Railway API | Service config, volume, deploy logs, HTTP logs (last 24 h), resource metrics |

**Limits of this audit — read before relying on it**

1. The public URL `https://bandly-production.up.railway.app/` could **not be opened from the audit environment** (outbound proxy returns 403). The deployed app was verified indirectly: Railway reports the deployment healthy, HTTP logs show real traffic (71 requests in 24 h, no 5xx), and the same commit was exercised locally in production mode.
2. Nothing was tested on a **physical phone**. Microphone, speech recognition and audio playback behaviour on real Android/iOS devices is unverified.
3. No AI, TTS or payment credentials exist. Those integrations were only ever exercised against **fake servers in tests**; none has been run against a real provider.

## 2. Executive summary

BANDLY today is a working **single-language (Uzbek) IELTS-practice web app** with real gamification, a levelled content bank and a well-tested rule-based core. It is **not yet a platform**: it has no server-side learner data, no enforceable subscriptions, no real accounts, no curriculum model and no live AI.

| Area of the target vision | Status | Short reason |
|---|---|---|
| General English A1–C2 curriculum | **Missing** | No lesson/module/mastery model; content is flat lists; no C2 |
| IELTS preparation | **Partial** | All four skills exist as practice; volume is small; Academic only |
| SAT, CEFR, IELTS General Training | **Missing** | No content, no scoring |
| Mock Arena | **Partial** | Timed mini-tests with auto-grading; no 40-question papers |
| Adaptive learning engine | **Partial / simulated** | Level-based filtering and SRS exist, but run in the browser on local data |
| AI speaking and writing evaluation | **Not live** | Adapter exists, no key; rule-based feedback is clearly labelled as non-AI |
| AI personalities | **Partial** | One examiner with 4 intensity levels, not 5 personalities |
| Subscriptions and entitlements | **Simulated** | Production runs in demo mode; gating is client-side only |
| Payments | **Not live** | Hamyon (Uzbekistan card transfer) implemented, tested only against a fake |
| Localization (6 languages) | **Skeleton** | 34 keys translated through i18n; ~360 UI lines are hard-coded Uzbek |
| Gamification | **Works** | XP, streaks, levels, achievements, SRS, 3 games, league, duels |
| Security and data durability | **Weak** | See Critical findings |

## 3. What already works (verified)

Evidence: 25 passing test suites plus Playwright runs against the production build.

- **Placement test** — adaptive A1–C1 blocks, stores level, target band and exam date.
- **Content, levelled by CEFR** — 466 vocabulary items (A1 30, A2 50, B1 131, B2 175, C1 80), 80 grammar questions in 16 topics, 6 Reading and 5 Listening mini-tests (8–13 questions each), 54 sentence exercises, 10 listening scenes, 10 Writing Task 2 modules with original model essays, 74 Speaking model answers.
- **Reading/Listening tests** — timer, auto-grading for T/F/NG, multiple choice, gap fill, matching; evidence shown per question.
- **Speaking** — full Part 1–3 flow with browser speech recognition or text mode; per-answer review with detected errors and model answers.
- **Writing** — Task 2 checklist tuned to essay type; every model essay is guaranteed by a test to pass its own checker.
- **Listen-and-repeat studio** — subtitles, quiz, gap fill, shadowing, dictation, retelling.
- **Neural English audio** — 823 pre-generated clips and 5 listening tracks (13 MB), no runtime cost.
- **Gamification** — XP, levels, streaks, achievements, Leitner SRS, word games, weekly league, shareable duels.
- **Homework, results chart, daily word and tip, shareable image cards.**
- **Server** — leaderboard/duel API with anti-cheat caps, Hamyon payment flow (idempotent delivery, signature check, reconciliation), AI and TTS adapters, static serving with Range support.
- **Deployment** — Railway service from `main`, persistent 5 GB volume mounted at `/data`, 0 server errors in the last 24 h, ~90 MB RAM.

## 4. What is simulated or not what it appears to be

| Item | Reality |
|---|---|
| "Subscription active" badges | Production log line: `To'lov: yo'q (demo)`. Any visitor unlocks any track with one click. |
| The "examiner" in Speaking | A scripted state machine plus ~30 regular-expression rules. No language model is involved. |
| Band scores | Estimates: mini-test scores scaled to 40 and capped by test level; Speaking band derived from answer length, fillers and word variety, capped at 6.5. Labelled as approximate in the UI. |
| Shadowing "accuracy" | Word match against the browser's speech-to-text output. It is not a pronunciation score (the UI says so). |
| "Personalised programme" | Deterministic selection by CEFR level and local history. Reasonable, but computed in the browser from data that exists only on that device. |
| AI evaluation buttons | Hidden unless a key is configured. No fake AI output is shown anywhere. |

## 5. Findings

Severity: **Critical** = blocks the product from being commercially or technically viable; **High** = must be fixed before paid launch; **Medium** = quality or correctness issue; **Low** = polish.

### Critical

**C1 — Learner data exists only in the browser.**
Profile, XP, SRS state, results, level, mock history and studio progress are stored in 11 `localStorage` keys (`bandly.profile.v1`, `bandly.results.v1`, …). The server's `players` table holds only `token, nickname, xp, streak`. Clearing the browser or switching device erases a learner's history; the adaptive engine, analytics, cost attribution and anti-abuse described in the specification cannot be built on this.

**C2 — Entitlements are enforced only in the client, and all paid content is public.**
`components/Gate.tsx` checks `profile.plan` from `localStorage`. All tests with answer keys, model essays and exercises are compiled into one public file (`dist/assets/index-*.js`, 623 kB; the string "Not Given" answer data and the essay text are readable in it). Even with payments enabled, editing `localStorage` or reading the bundle bypasses every paywall. The server verifies subscriptions (`/api/me`) but nothing of value is served by the server.

**C3 — There are no real accounts.**
Identity is a nickname plus a random bearer token kept in `localStorage`. There is no email, phone, password or OAuth, no session expiry, and the only recovery path is a manually copied "account code" (the raw token). A paid subscription is tied to that token: lose it and the purchase is unrecoverable. There is no age information, so the rule that minors receive age-appropriate language cannot be enforced — the "18+" switch is a self-declared checkbox stored client-side.

### High

**H1 — Product structure does not match the target.** Three paid tracks exist (`exam`, `grammar`, `mocks`) priced in UZS (149 000 / 79 000 / 99 000). Grammar is a separate paid product and mocks are paid, both contrary to the specification; there is no General English product, no All Access tier and no server-side definition of the free tier.

**H2 — Localization is a skeleton.** 3 of 41 component/page files use the `t()` helper; roughly 360 source lines contain hard-coded Uzbek UI text. Explanations in the data model are single-language fields (`explanationUz`, `uz`, `promptUz`, `tipUz`). `<html lang="uz">` is fixed.

**H3 — Content volume and structure are far below a curriculum.** No C2 content, no SAT, CEFR or IELTS General Training. Writing Task 1 has 2 prompts (tables only). The "full exam" chains mini-tests of 8–13 questions; there is no 40-question paper. There is no lesson, objective or mastery entity — General English as a structured course does not exist.

**H4 — Speaking depends on the browser's speech recognition.** Works in Chrome, Edge and Safari; not in Firefox; quality on Android varies. No pronunciation assessment, no audio captured for analysis. The owner reported freezing and misrecognition on a real phone; mitigations were shipped but never verified on a device.

**H5 — AI layer is a single text-completion adapter.** `server/ai.ts` switches between three vendors inside one function. There are no speech-to-text, realtime-voice or writing-evaluation interfaces, no health checks or retries, and usage is a per-user daily request counter (`ai_usage`) with no tokens, cost, product or session. It has never run against a real key.

**H6 — Payments are single-country and unproven.** Hamyon card transfer only; never run against the real service; not configured in production. No billing history, upgrade/downgrade, expiry notices, currencies or regional prices. Failure screens show the placeholder contact `hello@example.com`.

**H7 — Data durability and schema management.** One SQLite file on one volume, no backup job, no migration framework (`CREATE TABLE IF NOT EXISTS` only, no schema version), built on Node's experimental `node:sqlite`. A single instance cannot scale horizontally.

**H8 — XP can be farmed.** XP is granted client-side on every repeat: `MockTest.tsx:38` (retake a solved test), `Writing.tsx:53` (re-check the same pasted essay), `Grammar.tsx:36`. The server caps league sync (400 per sync, 1 500 per hour) but that still allows ~36 000 XP per day, and local levels and achievements are unbounded.

**H9 — Front-end performance.** One 623 kB script (204 kB gzipped) with all content, no code splitting. The Node server sends it **uncompressed** (`content-encoding: none` observed locally; whether Railway's edge compresses was not verifiable). The service runs in region `sfo` (US West), far from Central Asian users.

**H10 — Not discoverable.** Hash routing (`#/…`), one `<title>` for every route, no Open Graph tags, no sitemap. Production HTTP logs show 404s for `/robots.txt` (requested by a search crawler) and `/favicon.ico`.

**H11 — No CI and no committed end-to-end tests.** Tests are 25 plain scripts chained in `package.json` and run by hand. The Playwright scenarios used during development live outside the repository and would be lost.

### Medium

| ID | Finding | Evidence |
|---|---|---|
| M1 | Horizontal overflow of 40–46 px at 360 px width on Home, Results, Profile (skills grid) and Writing (prompt `<select>`) | Playwright sweep |
| M2 | Homework rolls over at 00:00 UTC (05:00 in Tashkent) while "done today" and the 23:59 deadline use local time | `lib/homework.ts` `dayIndex` vs `isToday` |
| M3 | Unknown routes silently render Home; there is no 404 page | `#/nope` |
| M4 | Accessibility gaps: 22 of 26 routes have no `<h1>`; unlabeled inputs on Writing, League, Duel, Profile; tap targets under 36 px on Homework and Studio; payment dialog has no focus trap | Playwright sweep |
| M5 | Rate limiter is in-memory, global (120 req/min/IP), never pruned, reset on restart; AI endpoints share the same bucket | `server/index.ts` |
| M6 | Security headers incomplete: no CSP, HSTS or frame-ancestors; admin API uses one static shared token compared with `!==`, no audit log | `server/static.ts`, `server/index.ts` |
| M7 | Personas: 4 intensity levels of one character; forbidden-topic filter covers Uzbek only | `content/roasts.ts` |
| M8 | Production runs TypeScript through `tsx`, which is a dev dependency; an install with `--omit=dev` would break startup | `package.json`, `Dockerfile` |
| M9 | Free-tier limits (games per day, exercises per day) are counted in `localStorage` | `lib/store.ts`, `pages/Practice.tsx` |
| M10 | Placement test is 20 grammar/vocabulary multiple-choice items; no listening, reading or speaking component | `content/placement.ts` |
| M11 | 13 MB of generated audio is committed to git; the generator's model files are not in the repo | `public/audio`, `tools/` |
| M12 | Single replica, no health-based alerting, no error tracking service | Railway config |

### Low

| ID | Finding |
|---|---|
| L1 | `recordMock()` is called during render in `FullExam.tsx`; the "return to full exam" link persists after the exam because its flag is only cleared on reset |
| L2 | `.env not found` and the SQLite experimental warning are logged at error level on every start |
| L3 | README and deploy guide exist only in Uzbek; legal disclaimer exists only in Uzbek |
| L4 | Git remote still uses the old repository name (works through GitHub's redirect) |

## 6. Mobile responsiveness

- No JavaScript errors on any of 26 routes at 360 px or 1280 px.
- Layout holds at 390 px; at 360 px four routes overflow horizontally (M1).
- Bottom tab bar, drawer menu and sticky header work.
- Not verified: real-device keyboard behaviour, safe areas, microphone permission flows, audio autoplay rules on iOS.

## 7. Security summary

| Control | State |
|---|---|
| Secrets | None in the repository; `.env` ignored; provider keys are server-side only |
| Transport | HTTPS by Railway |
| Authentication | Bearer token without expiry (C3) |
| Authorization | Server checks token ownership for payments and duels; content is not protected (C2) |
| Input validation | Present on all API bodies (size limits, type coercion, regex for nicknames) |
| Payment callbacks | Signature verified, idempotent, amount checked, duplicate callbacks safe (tested) |
| Rate limiting | Basic, in-memory (M5) |
| Backups | None (H7) |
| Logging | Console only |

## 8. Risks if development continued without addressing the Critical findings

1. Every new learning feature would deepen dependence on browser-only data, making the later migration larger.
2. Paid launch would sell access that anyone can obtain for free and that buyers can lose permanently.
3. AI features would have no trustworthy user identity to meter or bill against.

The recommended order of work is in `IMPLEMENTATION_ROADMAP.md`.
