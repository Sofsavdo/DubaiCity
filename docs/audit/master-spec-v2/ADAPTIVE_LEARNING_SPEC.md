# Adaptive Learning Spec

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. **Implemented (pure logic, not yet wired to any screen):** `src/lib/adaptive/*`, `src/content/curriculum/*`, tests in `src/lib/adaptive/adaptive.test.ts`. Implementation notes: the first review interval is `base·2^(streak−1)·(0.5+m_eff)` days; on a cold start (nothing practised) the one-new-per-three-slots cap is lifted so the first day is not left almost empty; a practised node takes a slot only if it is due for revision or its m_eff < 0.6 (freshly learned material is not re-served the same day); on the Home plan, structured General English lessons replace the legacy grammar topics at levels where lessons exist.

### Error taxonomy (hierarchical, stable ids)
`G.tense, G.article, G.preposition, G.sva, G.word_order, G.modal, G.conditional, G.plural` · `V.word_choice, V.collocation, V.spelling, V.form` · `P.stress, P.phoneme, P.intonation` · `S.hesitation, S.fluency, S.coherence` · `W.coherence, W.task_response, W.organisation, W.sentence_variety` · `R.inference, R.detail, R.main_idea` · `L.detail, L.gist, L.distractor`.
Each content item and each detected error maps to ≥1 taxonomy id; every taxonomy id maps to ≥1 remedial lesson/exercise set (validated by a build-time coverage test).

### Curriculum graph
Nodes = lessons/skills `{id, level (A1–C2), skill, taxonomy_ids, prerequisites[], est_minutes, objective}`; edges = prerequisite. Exams add `exam_tag` nodes (e.g., IELTS W2 essay structure) that link to GE nodes. Tests: graph is acyclic; every node reachable from an A1 start; each node has objective, practice, check.

### Mastery score (initial parameters, to be calibrated with real data)
Per (user, node) store `m ∈ [0,1]`, `attempts`, `distinct_days`, `last_seen`.
- Update on an attempt with correctness `c ∈ {0,1}` and item difficulty `d ∈ [0,1]` (relative to node level):
  `m' = m + k·(c − m)·(0.6 + 0.4·d)` with `k = 0.25` (first 3 attempts `k = 0.35`).
- Time weighting: attempts answered in `< 20 %` of typical time and wrong count `×1.0`; right-but-very-fast guesses (below a per-item floor) count `×0.5`.
- Recency decay on read: `m_eff = m · exp(−Δdays / τ)`, `τ = 14` days for `learning`, `45` for `known`, `120` for `mastered`.
- States: `new` (no attempts) · `learning` (m_eff < 0.6) · `known` (0.6 ≤ m_eff < 0.85) · `needs_revision` (previously known/mastered and m_eff fell below 0.6) · `mastered` (m_eff ≥ 0.85 **and** attempts ≥ 5 **and** distinct_days ≥ 3 **and** last 3 correct). A single correct answer can never reach `mastered`.
- Next review (spaced repetition): interval `I = base · 2^(streak_correct) · f(m_eff)` capped at 180 days; wrong answer resets to 1 day. `base = 1 day`.
**These constants are starting hypotheses [U], not validated pedagogy; they are tuned only through logged outcomes and reviewed by an English-education specialist.**

### Deterministic recommendation rules
For each candidate node whose prerequisites have `m_eff ≥ 0.6`:
`score = 0.40·weakness + 0.25·revision_due + 0.20·goal_relevance + 0.15·exam_proximity`
- `weakness = 0.8·(1 − m_eff) + 0.2·[taxonomy id appears in the last 10 errors]` (changed from `1 − m_eff + 0.2` capped at 1: the cap made the repeated-error signal invisible for new nodes — found by a unit test)
- `revision_due = clamp((today − due_date)/7, 0, 1)` (0 if not due)
- `goal_relevance ∈ {0, 0.5, 1}` by match to the learner's goal/exam tag
- `exam_proximity = clamp(1 − days_to_exam/90, 0, 1)` for exam-tagged nodes, else 0
Fill the day's study-time budget in score order, at most 1 new node per 3 slots, always include due revisions first. Every task stores `reason_code` and a rendered explanation (template in `explanation_lang`); an LLM may rephrase the explanation but cannot change the selection.

### Plan adjustment
Recompute daily plan after each completed session; weekly review: if completion < 60 % lower load by one slot; if mastery of weekly targets ≥ 85 % raise difficulty one step; missed days redistribute revision only (never silently drop). Users may change study time and exam date; they **cannot** edit assessment history (append-only).

### Validation tests
Monotonicity (correct answers never decrease m); bounds [0,1]; a single answer cannot mark `mastered`; decay reduces m_eff; interval reset on error; graph acyclic; every taxonomy id has remedial content; determinism (same inputs → same plan); explanation present for every task; plan never schedules a node with unmet prerequisites; property test over 10⁴ random histories. Offline simulation compares plans for synthetic learners before any real user sees them.
