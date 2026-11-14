# Mock Arena Spec

**Goal (owner text):** free product for organic traffic, SEO, trust and conversion. Objective tests are graded **without an LLM**; AI only where it adds real value.

## 1. Free vs premium
| Free | Premium (credits/plan) |
|---|---|
| IELTS Reading & Listening mocks, CEFR tests, SAT Reading&Writing and Math, timed exams, skill tests, auto objective scoring, test history, basic analytics, previous mistakes | AI Writing and Speaking evaluation, weakness analysis, individual study plan, AI Examiner, advanced analytics |
Free results must stay genuinely useful (no crippled scores).

## 2. Attempt lifecycle [R]
```sql
CREATE TABLE app.test_attempts (
  id uuid PRIMARY KEY, user_id uuid, anon_id uuid, test_id uuid NOT NULL, test_version int NOT NULL,
  state text NOT NULL CHECK (state IN ('in_progress','submitted','expired','abandoned')),
  started_at timestamptz NOT NULL, deadline_at timestamptz NOT NULL,   -- server-set
  submitted_at timestamptz, score_raw int, score_json jsonb,
  idempotency_key text, UNIQUE (user_id, idempotency_key));
CREATE TABLE app.attempt_answers (attempt_id uuid, question_id uuid, answer jsonb, saved_at timestamptz, PRIMARY KEY (attempt_id, question_id));
```
- Start returns questions **without answer keys**; keys stay server-side until submission. (Today keys are in the public JS bundle — gap C2.)
- Answers autosave; reload resumes; timer is `deadline_at` on the server; late submit within a grace window is scored, later is `expired` **[U grace value]**.
- Submit is idempotent (same key → same result). Scoring is a pure function of (test_version, answers) → deterministic; tests assert it.
- Anonymous users may take a test (`anon_id`) and attach results at sign-up (conversion path) **[U]** privacy review of anonymous storage.

## 3. Result page
Score, correct/incorrect, time used, skill and topic breakdown, answers with explanations, previous-attempt comparison, next steps. Band/score conversions are labelled "estimate" and use verified tables only (`EXAM_PREPARATION_SPEC.md`). Mistakes feed the learner profile (error taxonomy).

## 4. Abuse and cost controls
Rate limits per IP/user, bot protection on start, question-exposure controls (rotate forms, no answer in responses, no per-question reveal before submit), duplicate-submission guard, secure result storage. **Infrastructure cost** (storage, bandwidth, audio files) measured per attempt; content served from CDN/object storage **[U]** (paid infra needs owner approval).

## 5. Content and licensing
Each test and question has `provenance`, `license_status` (original / licensed / unknown→blocked), `version`, `status` (draft→published). Only original or licensed content is published; no copying of official papers. Listening needs real audio assets (today: browser TTS) — production of audio is a content task with its own license record.

## 6. SEO/acquisition [R]
Public landing pages per test type (server-rendered or pre-rendered; today's hash routes are not indexable **[F] Phase 0 finding**) — requires route migration decision (M5/M6 scope).

## 7. Acceptance criteria
Free objective test works with no AI call; refresh mid-test resumes; double submit → one result; keys absent from any pre-submit response; scores equal a reference implementation on a fixed answer set; results update the learner profile.
