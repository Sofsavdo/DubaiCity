# AI Personality Engine Spec

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

Common contract: each has a config object `{id, targetAudience, minAge, allowedModes, tone, vocabulary, sentenceLength, speakingRate, pauseBehavior, correctionStyle, humorIntensity, followUpStrategy, difficultyAdaptation, voice?}`; server applies safety filters regardless of prompt; every reply carries the active personality id; the user can switch or stop at any time; AI identity is always disclosed.

| Personality | Audience | Behaviour | Correction rule | Age / mode restriction | UI requirements |
|---|---|---|---|---|---|
| Friendly Coach | beginners, low confidence | patient, short sentences, encouragement | recast gently, one correction per turn, explain in `explanation_lang` | all ages | warm accent, text label "Friendly Coach" |
| Strict Examiner | IELTS/exam candidates | formal, no jokes, examiner script, cue-card timing | no mid-answer correction; feedback after the session by rubric | all ages; **the only persona in official exam-simulation mode** | neutral accent, timer, no avatar emotion |
| Savage Coach | users who opt in to challenge | sharp playful roasting of **language performance only** | corrections as jokes but always followed by a plain correction | **opt-in; blocked for minors and unknown age; blocked in exam mode**; never targets nationality, ethnicity, religion, gender, disability or personal traits; no threats/harassment | explicit opt-in screen, persistent "Savage mode" badge, one-tap exit |
| Comedy Friend | casual practice | relaxed, light jokes, keeps user talking | recast inside conversation, summarise mistakes at end | all ages (jokes filtered) | playful accent |
| Debate Opponent | B2–C2 | challenges opinions, asks for evidence, flags weak reasoning | feedback on argument structure and complex language | recommended B2+ (soft gate) | debate scoreboard / turn indicator |

State indicators (all personas) with text + icon, not colour only: idle · listening · thinking · speaking · interrupted · paused · error; mic state and session progress visible; "End session" always reachable.

**Validation:** a fixed prompt set per personality with automated checks (forbidden-content classifier, length/tone assertions) and human review before enabling; Savage-mode safety tests (protected-attribute prompts must be refused/redirected). **[U]** classifier choice and legal age thresholds (OD-06).

## Update from Master Spec v3 (owner text, Uzbek)
- **Configuration-driven:** one engine, five config records; no per-persona backend. Parameters to expose: tone, speaking rate, response style, humor, emotional intensity, correction style, vocabulary ceiling, difficulty, adult-only flag, profanity policy, voice configuration.
- **Savage Coach unlock is stricter than the table above:** the owner text requires the user to be an adult who has **confirmed their age** *and* switched the mode on themselves. "Confirmed" is undefined: self-declared date of birth cannot be verified; identity-based verification needs a vendor and heavy privacy duties. **OWNER DECISION (OD-06, now with sub-question OD-06b):** which standard applies. Until decided Savage stays disabled for everyone; minors always get the soft mode.
- Official Exam Mode never uses Savage style; user can change persona at any time (kept).
- **Prompt-injection protection** (new requirement): user text and transcripts are treated as data, never as instructions; persona system prompts are server-side only; output passes the safety filter; tests include injection strings ("ignore previous instructions", persona override attempts) — see `TEST_STRATEGY.md`.

## Implemented (phase A, no provider key) — 2026-11-14
- Personas: `src/content/personas.ts` (display, voice base, adultOnly, examSafe) and `server/coach.ts` (behaviour instructions per persona, shared hard rules, JSON output format).
- Gating: `resolvePersona` — Savage only with the learner's 18+ self-declaration; exam mode forces Strict Examiner; unknown ids fall back to Friendly. The server reports any downgrade (`notice`).
- Safety: learner text fenced in `<learner>` tags and treated as data; history bounded to 6 turns × 300 chars; output must be valid JSON; replies with links, Uzbek (`FORBIDDEN`) or English (`EN_FORBIDDEN`) protected-attribute/family/threat/sexual terms are replaced by a neutral fallback; examiner never jokes or corrects mid-session.
- Cost control: `AI_GLOBAL_DAILY_CALLS` platform ceiling (FAIL-CLOSED: unset/0 = coach off even with a key), `AI_COACH_DAILY_LIMIT` per learner (default 30), duplicate-call protection per (learner, turnId) for 10 minutes. Real money ceilings in USD need OD-09 and verified provider prices (FINAL_AI_CREDIT_SPEC).
- Voice: turn-based (browser recognition → AI → browser speech synthesis with persona/emotion pitch and rate). Streaming realtime voice (interruptible, low latency) and natural emotional voices are phase B after a provider is chosen and tested.
- Owner inputs to go live: AI provider + key in Railway variables (`AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`), `AI_GLOBAL_DAILY_CALLS`, optionally `AI_COACH_DAILY_LIMIT`; decision OD-06b on the 18+ standard.
