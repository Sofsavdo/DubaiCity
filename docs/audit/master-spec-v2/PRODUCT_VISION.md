# PRODUCT VISION

Status: **proposed for owner review**. Sections marked *[approved]* restate what the owner stated in chat; everything else is a recommendation. The three ChatGPT conversations and `Loyiha tahlili.txt` were **not accessible**, so nothing here claims to reflect them.

## 1. Statement *[approved by owner message]*
Bandly is an AI-powered English learning ecosystem that takes people from A1 to C2, prepares them for IELTS, CEFR and SAT, lets them practise speaking with distinctive AI personalities, and follows a plan that adapts to measured performance.

Promise: *Learn English. Speak with confidence. Prepare intelligently. See measurable progress.*

## 2. Three products, one intelligence layer *[approved]*

| Product | Purpose | Who pays | Notes |
|---|---|---|---|
| **A. General English** | Structured A1→C2 path: grammar (inside it), vocabulary, reading, listening, speaking, pronunciation, writing, everyday situations | subscription | Grammar is **not** a separate product |
| **B. Exam Preparation** | IELTS Academic/General, CEFR, SAT; each exam its own rules, content, scoring, analytics | subscription | IELTS exists today (Academic only) |
| **C. Mock Arena** | Free, objectively graded mocks and skill tests; acquisition and habit | free; premium AI feedback upsell | Objective grading needs no AI |

**Shared Adaptive Learning Intelligence**: one learner profile (General English level and exam readiness stored **separately**), error taxonomy, mastery model and recommendation rules. Example loop: an IELTS Writing Task 2 reveals repeated subject–verb agreement errors → a General English lesson + targeted drills + short revision + a new Writing task to verify.

## 3. Audiences
Beginner · everyday learner · university applicant (IELTS/SAT) · CEFR candidate · IELTS band 6.5–8.0 target · advanced learner wanting fluency and pronunciation.

## 4. Market strategy
- Order *[approved sequence]*: Uzbekistan → Kazakhstan → Kyrgyzstan → Tajikistan → Turkmenistan; architecture international from day one, **launch per country only after validation**.
- Per-country configuration (language defaults, currency, pricing, payment methods, legal text, content variants, support, availability) — never hard-coded to Uzbekistan. Model in `PRODUCT_ARCHITECTURE.md`.
- Data-residency and age rules per country are **unresolved legal questions** (OD-01, OD-06); no compliance claim is made.

## 5. Four independent language settings *[approved]*
| Setting | Meaning | Example |
|---|---|---|
| Interface language | UI text | Russian |
| Explanation language | feedback and grammar explanations | Uzbek |
| Learning language | language being learned | English |
| Voice language | spoken conversation | English |
Locales planned: en, uz, ru, kk, ky, tg; tk later. Speech recognition/synthesis for each language is advertised **only after provider tests pass**.

## 6. Principles *[approved by owner message, applied here]*
1. Preserve what works; refactor before replace.
2. No fake AI, scores, analytics, progress or payment state; show honest "unavailable" states.
3. Server decides entitlements, XP, scores and credits.
4. AI scores are labelled estimates; no implied official certification.
5. Deterministic rules drive learning decisions; the LLM explains, it does not decide.
6. Original content only; copyrighted material is never copied.
7. Owner approval for prices, quotas, payouts, legal policy, age policy, retention, migrations, infrastructure spend.

## 7. Differentiators
Mock Arena as free funnel · personality + voice engine · adaptive engine with explainable recommendations · Central Asian language support · creator-driven distribution.

## 8. What Bandly is not
Only an IELTS site, only grammar, only a chatbot, only a vocabulary game, only a mock-test site.

## 9. Success measures (to be instrumented in M-phase analytics, not yet measurable)
Activation (placement done, first lesson, first mock) · learning outcomes (mastery, repeated-error reduction) · retention D1/D7/D30 · free→paid conversion · AI cost per user and margin. No target values are set here; they are owner decisions.
