# STRATEGIC GAPS — SPECIFICATION-LEVEL RECOMMENDATIONS

All content is **[R] recommendation** unless marked otherwise. Nothing is implemented. Provider facts are **[U] unverified** — no prices, model names or language capabilities are asserted. This file is the single place for these topics until each gets its own spec at Phase 1+ (see `MASTER_SPEC_RECONCILIATION.md`).

## 1. Languages

**Locales:** `en`, `uz`, `ru`, `kk`, `ky`, `tg` (later `tk`). Verified in Node 22/ICU 78.3 for en/uz/ru only (`FINAL_ARCHITECTURE_SPEC` §5). **[U]** kk/ky/tg plural rules, number/date formats and font coverage must be checked with the same script before commitment.

**Four settings** per user (stored server-side after M3, localStorage before):

```
interface_lang   ∈ locales            default: browser → country default → en
explanation_lang ∈ locales            default: interface_lang
learning_lang    = 'en' (extensible)  default: en
voice_lang       ∈ {en} initially     extended only after provider tests (§3)
```

Rules: settings are independent; AI explanations are generated in `explanation_lang` while examples stay English; English exam text is never translated; missing key falls back to English and logs; translation content has states `draft → reviewed (native speaker) → published`; machine drafts stay `draft` and are not shown unless the owner opts in. Catalogue is the ICU-message-format-style key store with placeholder-parity and plural-category checks (build fails on mismatch). Cyrillic and Uzbek Latin apostrophes (ʻ ʼ ’) require the chosen font to be tested (**[U]**).

**Speech support matrix** (starts empty; a cell turns "supported" only after the §3 test passes):

| Language | STT | TTS | Realtime |
|---|---|---|---|
| en | browser only (unverified on devices) | optional vendor, untested | none |
| uz, ru, kk, ky, tg | not verified | not verified | not verified |

## 2. AI personalities

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

## 3. Voice provider evaluation plan

**Candidates to evaluate [U — listed only as candidates, no capability or price asserted]:** browser Web Speech (baseline), major cloud speech vendors (e.g., Microsoft Azure Speech, Google Cloud Speech/TTS), real-time voice APIs of LLM vendors, ElevenLabs, Deepgram, and any Uzbek-focused local vendors the owner knows of.

**Method:**
1. For each candidate, read **current official documentation** (supported languages/locales, streaming, barge-in/interruption, SSML/prosody, data retention, regional endpoints, commercial licence, rate limits, published price). Record URL + retrieval date. *Sandbox note:* outbound access to vendor sites may be blocked here; if so, the owner must supply exports or allow the hosts.
2. Build a **test corpus**: 30 short utterances per language (en with Uzbek/Russian/Kazakh/Kyrgyz/Tajik accents, plus native languages), recorded by volunteers with consent; 10 noisy-phone samples. Corpus is original, stored only in the owner's controlled location.
3. Metrics: word error rate (STT), intelligibility rating by native reviewers (TTS, 1–5, ≥3 reviewers), first-audio latency, barge-in success rate, failure/timeouts, cost per minute **from the vendor's current price sheet**.
4. Decision rule: a language/feature is listed as supported only if WER and reviewer scores meet thresholds the owner sets (OD-09/OD-10); otherwise the UI states "not available".
5. Output: `VOICE_PROVIDER_EVALUATION.md` (to be created in Phase 5 planning) with sources, dates, raw results. No key is requested until the owner approves the test (keys go in Railway variables, never chat).

Architecture seam: `SttProvider`, `TtsProvider`, `RealtimeProvider` interfaces with `capabilities` flags (`languages`, `streaming`, `bargeIn`, `usageReporting`, `retrySafety`) consumed by the credit engine (`FINAL_AI_CREDIT_SPEC` §6).

## 4. SAT and CEFR — what must be verified before design

**SAT (digital):** official College Board current specification for: number of sections/modules, timing, question counts, adaptive module routing rules, score scale and what scores are reported, allowed calculator/tools, question types (student-produced response), accessibility accommodations. Date-stamp every fact; we do not simulate adaptivity unless the routing rule is published.
**IELTS:** current official format for Academic and General Training (section timing, task rules, band-score conversion publication). IELTS conversion tables used today in `lib/band.ts` must be re-verified.
**CEFR — two separate layers:**
- *Global proficiency:* CEFR descriptors (Council of Europe CEFR + Companion Volume) used for General English levels A1–C2. Internal level labels are "CEFR-aligned", never "certified".
- *Country-specific CEFR exams:* e.g., national multilevel/CEFR exam formats used in Uzbekistan, Kazakhstan, etc. **[U]** exact formats, issuers and rules per country are unknown and must be obtained from the official issuer before any module is designed; each country gets its own `exam_format` record.
Question banks: original items only; provenance and licence recorded per item.

## 5. Adaptive Learning

### 5.1 Error taxonomy (hierarchical, stable ids)
`G.tense, G.article, G.preposition, G.sva, G.word_order, G.modal, G.conditional, G.plural` · `V.word_choice, V.collocation, V.spelling, V.form` · `P.stress, P.phoneme, P.intonation` · `S.hesitation, S.fluency, S.coherence` · `W.coherence, W.task_response, W.organisation, W.sentence_variety` · `R.inference, R.detail, R.main_idea` · `L.detail, L.gist, L.distractor`.
Each content item and each detected error maps to ≥1 taxonomy id; every taxonomy id maps to ≥1 remedial lesson/exercise set (validated by a build-time coverage test).

### 5.2 Curriculum graph
Nodes = lessons/skills `{id, level (A1–C2), skill, taxonomy_ids, prerequisites[], est_minutes, objective}`; edges = prerequisite. Exams add `exam_tag` nodes (e.g., IELTS W2 essay structure) that link to GE nodes. Tests: graph is acyclic; every node reachable from an A1 start; each node has objective, practice, check.

### 5.3 Mastery score (initial parameters, to be calibrated with real data)
Per (user, node) store `m ∈ [0,1]`, `attempts`, `distinct_days`, `last_seen`.
- Update on an attempt with correctness `c ∈ {0,1}` and item difficulty `d ∈ [0,1]` (relative to node level):
  `m' = m + k·(c − m)·(0.6 + 0.4·d)` with `k = 0.25` (first 3 attempts `k = 0.35`).
- Time weighting: attempts answered in `< 20 %` of typical time and wrong count `×1.0`; right-but-very-fast guesses (below a per-item floor) count `×0.5`.
- Recency decay on read: `m_eff = m · exp(−Δdays / τ)`, `τ = 14` days for `learning`, `45` for `known`, `120` for `mastered`.
- States: `new` (no attempts) · `learning` (m_eff < 0.6) · `known` (0.6 ≤ m_eff < 0.85) · `needs_revision` (previously known/mastered and m_eff fell below 0.6) · `mastered` (m_eff ≥ 0.85 **and** attempts ≥ 5 **and** distinct_days ≥ 3 **and** last 3 correct). A single correct answer can never reach `mastered`.
- Next review (spaced repetition): interval `I = base · 2^(streak_correct) · f(m_eff)` capped at 180 days; wrong answer resets to 1 day. `base = 1 day`.
**These constants are starting hypotheses [U], not validated pedagogy; they are tuned only through logged outcomes and reviewed by an English-education specialist.**

### 5.4 Deterministic recommendation rules
For each candidate node whose prerequisites have `m_eff ≥ 0.6`:
`score = 0.40·weakness + 0.25·revision_due + 0.20·goal_relevance + 0.15·exam_proximity`
- `weakness = 1 − m_eff` (+0.2 if its taxonomy id appears in the last 10 errors, capped at 1)
- `revision_due = clamp((today − due_date)/7, 0, 1)` (0 if not due)
- `goal_relevance ∈ {0, 0.5, 1}` by match to the learner's goal/exam tag
- `exam_proximity = clamp(1 − days_to_exam/90, 0, 1)` for exam-tagged nodes, else 0
Fill the day's study-time budget in score order, at most 1 new node per 3 slots, always include due revisions first. Every task stores `reason_code` and a rendered explanation (template in `explanation_lang`); an LLM may rephrase the explanation but cannot change the selection.

### 5.5 Plan adjustment
Recompute daily plan after each completed session; weekly review: if completion < 60 % lower load by one slot; if mastery of weekly targets ≥ 85 % raise difficulty one step; missed days redistribute revision only (never silently drop). Users may change study time and exam date; they **cannot** edit assessment history (append-only).

### 5.6 Validation tests
Monotonicity (correct answers never decrease m); bounds [0,1]; a single answer cannot mark `mastered`; decay reduces m_eff; interval reset on error; graph acyclic; every taxonomy id has remedial content; determinism (same inputs → same plan); explanation present for every task; plan never schedules a node with unmet prerequisites; property test over 10⁴ random histories. Offline simulation compares plans for synthetic learners before any real user sees them.

## 6. Country configuration model

```sql
CREATE TABLE app.countries (
  code text PRIMARY KEY,                 -- ISO 3166-1 alpha-2: UZ, KZ, KG, TJ, TM
  enabled boolean NOT NULL DEFAULT false,
  default_interface_lang text NOT NULL,
  default_explanation_lang text NOT NULL,
  currency text NOT NULL,                -- ISO 4217
  timezone_default text NOT NULL,        -- IANA
  min_age int,                           -- NULL until legal input (OD-06)
  data_region text,                      -- NULL until OD-01
  terms_version text, privacy_version text,
  support_contact jsonb
);
CREATE TABLE app.country_prices (country text REFERENCES app.countries, plan_id text, period text,
  amount_minor bigint NOT NULL, valid_from timestamptz NOT NULL, valid_to timestamptz,
  PRIMARY KEY (country, plan_id, period, valid_from));
CREATE TABLE app.country_payment_methods (country text, provider text, enabled boolean, config_ref text,
  PRIMARY KEY (country, provider));
CREATE TABLE app.country_features (country text, feature text, enabled boolean, PRIMARY KEY (country, feature));
CREATE TABLE app.country_exam_formats (country text, exam text, format_id text, source_note text, verified_at date,
  PRIMARY KEY (country, exam, format_id));
```
Country is determined by user choice confirmed at sign-up (not IP alone). All values are data; **no price or legal value is supplied here**. Missing config ⇒ feature disabled (fail closed).

## 7. Creator Program and referrals

Tracking model: `creators(id, user_id, level, status)`, `campaigns`, `referral_links(code, creator_id, campaign_id)`, `attributions(user_id, referral_code, first_touch_at, source)`, `conversion_events(user_id, type ∈ registered|activated|paid)`, `view_claims(creator_id, platform, url, claimed_views, verified_views, verified_by, method ∈ api|manual, verified_at)`, `reward_ledger(creator_id, rule_id, amount_minor, currency, state ∈ pending|approved|rejected|paid)`.
Attribution: first-touch cookie/query code stored on first visit, bound to the account at registration, 30-day window **[U — owner decision]**; self-referral and same-device/payment-instrument matches flagged; activation = placement + first lesson (definition owner-approved).
Views are **manually verified or API-verified; never auto-trusted**. Reward rules table holds the hypothesis values ($1/10k … $100/1M views) as **unapproved test data, state `draft`**; no payout code path is enabled until the owner approves budget, fraud rules, verification process, country eligibility, minimum payout, payment provider and campaign limits (DR-11). Legal/tax treatment **[U]**.

## 8. Admin and CMS

**Roles:** `owner`, `admin`, `content_editor`, `content_reviewer`, `translator`, `support`, `finance`, `analyst` (read-only). Permissions are explicit per role on resource+action (RBAC table); no public admin endpoint; admin on a separate path with session + role check, MFA recommended **[R]**; today's `/api/admin/*` with a shared `ADMIN_TOKEN` is replaced.
**Content lifecycle:** `draft → in_review → approved → published → archived`; publish requires a role different from the author; AI-generated content enters as `draft` with `origin='ai'`; each version immutable with diff; rollback = republish an earlier version.
**Audit:** append-only `admin_audit(actor, role, action, resource, before, after, ip, at)`; payment/credit adjustments require reason text; audit rows cannot be updated or deleted by application roles.
**Managed resources:** users, subscriptions, payments, credits, curriculum, lessons, vocabulary, question bank, mock tests, translations, personalities, provider config (secrets referenced, never displayed), creator campaigns, rewards, reports, support cases.
