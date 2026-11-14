# Product Requirements

IDs are stable; each links to its spec. Priority P1–P10 follows the owner's v3 list (see `ROADMAP_RECONCILIATION.md` for sequencing against M1–M8). Status uses `FEATURE_INVENTORY.md` vocabulary.

| ID | Requirement | Owner priority | Spec | Today |
|---|---|---|---|---|
| REQ-001 | One account and one learner profile across the three products | 1 | PRODUCT_ARCHITECTURE | MISSING |
| REQ-002 | Navigation exposes General English / Exam Preparation / Mock Arena + dashboard, plan, AI coach, progress, mistakes, history, profile, settings, subscription | 1 | INFORMATION_ARCHITECTURE | PARTIAL (3 old tracks) |
| REQ-003 | A1–C2 curriculum as structured data; grammar inside General English | 2 | GENERAL_ENGLISH_CURRICULUM | MISSING |
| REQ-004 | Diagnostic assessment; GE level and exam readiness stored separately | 2/3 | ADAPTIVE_LEARNING_SPEC | PARTIAL |
| REQ-005 | Vocabulary with SRS and states new→mastered (no mastery after one answer) | 2 | ADAPTIVE_LEARNING_SPEC | PARTIAL |
| REQ-006 | Error taxonomy, curriculum graph, mastery formula, deterministic recommendations with reasons | 3 | ADAPTIVE_LEARNING_SPEC | MISSING |
| REQ-007 | Five configuration-driven personalities; Savage adult-confirmed + opt-in; never in exam mode | 4 | AI_PERSONALITY_ENGINE_SPEC | PARTIAL (static) |
| REQ-008 | Provider-agnostic STT/TTS/LLM/Realtime/Pronunciation/Writing interfaces; English first, local languages only after tests | 4 | VOICE_ENGINE_SPEC | MISSING |
| REQ-009 | AI credit ledger, ceilings, idempotency, crash safety, usage records | 4 | `docs/audit/phase-0.2/FINAL_AI_CREDIT_SPEC.md` | MISSING |
| REQ-010 | IELTS Academic/General, CEFR (per-country), SAT; separate rules, banks, analytics; AI scores labelled estimates | 5 | EXAM_PREPARATION_SPEC | PARTIAL (Academic) |
| REQ-011 | Free Mock Arena with deterministic server scoring, history, mistakes; premium AI upsell | 6 | MOCK_ARENA_SPEC | PARTIAL (client-graded, priced) |
| REQ-012 | Plans, entitlements, country pricing, payment abstraction, no unlimited AI | 7 | MONETIZATION_SPEC | MOCK/DEMO |
| REQ-013 | XP/streak/leaderboard/duels with server validation | 8 | FEATURE_INVENTORY | PARTIAL |
| REQ-014 | Six locales and four independent language settings | 9 | MULTILINGUAL_ARCHITECTURE | PARTIAL (uz) |
| REQ-015 | Creator program with admin-approved rewards only | 10 | CREATOR_PROGRAM_SPEC | MISSING |
| REQ-016 | Admin/CMS with roles, content lifecycle, versions, audit | — | ADMIN_CMS_SPEC | BACKEND ONLY |
| REQ-017 | Analytics with documented definitions | — | ANALYTICS_SPEC | MISSING |
| REQ-018 | Security, privacy, consent, retention, age safety | — | SECURITY_AND_PRIVACY_SPEC | MISSING |
| REQ-019 | Preserve working features; no destructive change without approval | all | `docs/audit/phase-0.2/M1_READY_CHECKLIST.md` | n/a |
| REQ-020 | B2B "Bandly for Schools": teacher/centre dashboard, group analytics, per-student tracking, bulk packages | after M3 | SOURCE_CONSOLIDATION N1, DECISION_REGISTER DR-25 | MISSING |
| REQ-021 | Reading tools (highlight, notes, flag-for-review, navigator), Writing autosave/revision history, per-skill Learn/Practice/Exam modes | 5 | EXAM_PREPARATION_SPEC | MISSING/PARTIAL |
