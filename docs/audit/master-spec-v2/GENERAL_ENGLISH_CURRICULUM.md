# General English Curriculum — structure (draft framework)

Status: **framework only**. Level descriptions are paraphrased CEFR-aligned goals and **must be reviewed by a qualified English-language education specialist** and checked against the official CEFR descriptors before use [U]. No lesson content is claimed complete; no AI-generated lesson is published without review (draft state).

## 1. Hierarchy
`Level (A1–C2) → Unit → Module → Lesson → Activity`. Module types: Grammar, Vocabulary, Reading, Listening, Speaking, Pronunciation, Writing, Everyday English, Real-life Conversations, Games, Adaptive Revision. Grammar is a module type **inside** every level, never a separate product.

## 2. Lesson template (all fields required to publish)
`objective` (one measurable sentence) · `introduction` · `explanation` · `examples` (≥3, original) · `guided_practice` · `independent_practice` · `assessment` (mastery check) · `error_analysis` (taxonomy ids) · `revision_recommendation` · `prerequisites[]` · `est_minutes` · `taxonomy_ids[]` · `review_status` · `version`.

## 3. Level outline (goals to be validated)
| Level | Label | Target outcomes (summary) | Typical units |
|---|---|---|---|
| A1 | Beginner | introduce self, simple needs, present simple/be/have, numbers, daily objects | greetings, family, food, time, directions-basic |
| A2 | Elementary | short routine/past events, shopping, simple messages; past simple, comparatives | shopping, travel, work basics, plans |
| B1 | Intermediate | main points on familiar topics, connected text, experiences, opinions; present perfect, conditionals 1–2 | work & study, health, media, problems |
| B2 | Upper-intermediate | fluent interaction, detailed text, argument; passive, reported speech, wider conditionals | academic discussion, meetings, interviews |
| C1 | Advanced | flexible, implicit meaning, structured long text; inversion, nuance | professional/academic writing, debate |
| C2 | Proficiency | precise, effortless, summarise from sources | complex argument, style, idiom |

**Real-life situation set (owner list):** introducing yourself, ordering food, shopping, directions, travel, talking about work, job interviews, appointments, opinions, explaining problems, meetings, academic discussions — each mapped to levels where plausible.

## 4. Existing assets to reuse
`src/content/grammar.ts` (118 lines), `vocab*.ts`, `practice.ts`, `placement.ts`, `scenes.ts`, `writingGuide.ts`, `lib/srs.ts`. Mapping them to nodes is the first curriculum task (inventory each item: level, taxonomy id, status).

## 5. Quality gates
Learning objective present · CEFR alignment note · difficulty progression check · answer/explanation validation (two-reviewer for keys) · duplicate detection · licensing/provenance recorded · specialist sign-off · version history. Coverage tests: every taxonomy id has remedial content; graph acyclic; every node has objective+practice+check (`ADAPTIVE_LEARNING_SPEC.md`).

## 6. Production plan [R]
Pilot slice first (A1–A2 grammar+vocabulary+speaking for 2 units) to prove the schema and review workflow, then scale by level. Effort is content labour, not engineering; estimates require owner input on reviewers (OD-10).

## Implemented pilot (2026-11-14)
`src/content/lessons/` — 11 units, 33 lessons, 363 deterministic items (+ a rule-checked writing task and a speaking step per lesson), all `pilot`: C2 *Precision and register* (conditional inversion, mixed conditionals, strong collocations), C1 *Formal and emphatic English* (inversion, cleft sentences, nominalisation), C1 *Building an argument* (hedging, cause and effect, participle clauses), B2 *News and reports* (passive, reported speech, relative clauses), B2 *Choices and opinions* (second and third conditional + wish, although/however/despite), A1 *Meeting people* (to be, questions/negatives, a/an + possessives), A1 *Daily life* (present simple, 3rd-person -s, do/does), A2 *Last weekend* (regular/irregular past, did), A2 *In the city* (there is/are + some/any, prepositions of place, how much/many), B1 *Experiences* (present perfect, vs past simple, for/since/already/yet/just), B1 *Plans and possibilities* (going to vs will, first conditional, comparisons). Each lesson: objective, Uzbek explanation, form table, ≥3 examples, ≥4 practice items with instant feedback, ≥5-item mastery check (pass 80 %), error-taxonomy ids. Lessons are curriculum nodes in one A1-rooted chain and feed the adaptive planner. **Needs specialist review before the `pilot` label is removed.**
