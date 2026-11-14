# Screen Specifications (index level)

For each screen: purpose · data (source) · primary actions · states (loading/empty/error/locked/unavailable) · today's route. Detailed wireframes follow after owner approval of IA. **Every data field is server-sourced after M3/M4; before that, localStorage via an adapter.**

| # | Screen | Purpose | Key data | States of note | Today |
|---|---|---|---|---|---|
| 1 | Landing | explain 3 products, free Mock Arena CTA | country/lang content | per-country variants | `#/` (app home) |
| 2 | Sign-in | email code / Google / Telegram | — | code expired, rate-limited | JoinForm (nickname) |
| 3 | Onboarding | goal, exam date, time, language settings, age | profile | skip-able fields | partial placement |
| 4 | Language settings | 4 independent settings | locale matrix, voice matrix | unsupported voice → disabled + reason | none |
| 5 | Placement | diagnostic per skill | bank, result | resume, offline | `#/placement` |
| 6 | Dashboard | greeting, level, goal, today's tasks + reasons, streak, weekly progress, weakest skill, exam countdown, recent results, next action | profile, plan | no placement → onboarding card; no fake numbers | `#/` |
| 7 | GE course page | level → units | curriculum | locked, completed | missing |
| 8 | Lesson | objective → practice → check | lesson | error explanations | missing |
| 9 | Grammar / Vocabulary | topic practice, SRS review | mastery | due count | `#/grammar`, practice |
| 10 | Reading / Listening / Writing exercise | skill practice | content | timed/untimed, transcript rules | existing pages |
| 11 | Speaking session | AI personality conversation | session, transcript | mic denied, provider down | `#/exam/speaking` |
| 12 | Personality selection | choose persona | configs, age/mode rules | Savage locked/opt-in | PersonaPicker |
| 13 | IELTS dashboard + task screens | exam readiness per section | exam analytics | | `#/exam` |
| 14 | CEFR / SAT preparation | per-country formats | exam_formats | format unverified → "coming soon" | missing |
| 15 | Mock Arena catalogue / test / results / history | free tests | attempts | resume, expired, duplicate | `#/mocks` |
| 16 | Adaptive plan | weekly goal, tasks, revision, reasons, study-time edit | plan | | missing |
| 17 | Games, Duels, Leaderboard | play, compete | XP (validated) | | existing |
| 18 | Profile, Settings, Privacy | account, export/delete | | | `#/profile` |
| 19 | Subscription, AI credits | plan, usage, history | entitlements, ledger | pending payment | `#/pricing` |
| 20 | Creator program | link, claims, rewards | creator tables | payouts disabled | missing |
| 21 | Admin dashboard (users, content, translations, providers, campaigns, reports) | operations | RBAC data | role-gated | endpoints only |
| 22 | Help / support | contact, FAQ | country support | | missing |
