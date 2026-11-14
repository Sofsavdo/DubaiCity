# MASTER SPEC RECONCILIATION — 29 deliverables

Supersedes `PHASE_0_RECONCILIATION.md` (removed; it was a first draft of this table, created one step earlier, never approved). Paths are repository-relative. Legend: **COVERED** · **UPDATE** (exists, needs changes) · **MISSING** · **BLOCKED-OWNER** (needs OD/DR decision) · **BLOCKED-EXT** (needs external verification). A row can have two flags.

Sources not reviewed: ChatGPT conversations 1–3 (host unreachable) and `Loyiha tahlili.txt` (file not present). Every "approved" claim below traces to an owner chat message only. The "newly attached AI and Cost Architecture" document is taken to be `docs/AI_COST_ARCHITECTURE.md` (the only such file in the repo); no other copy was found. **[U]** If a different file was meant, please re-attach.

| # | Master deliverable | Status | Authoritative document (path) | Notes |
|---|---|---|---|---|
| 1 | MASTER_PRODUCT_SPEC.md | MISSING | — (source is the owner's prompt; `PRODUCT_VISION.md` holds the consolidated vision) | create after owner approves vision; avoid duplication |
| 2 | PRODUCT_VISION.md | COVERED (draft) | `docs/audit/master-spec-v2/PRODUCT_VISION.md` | awaiting owner review |
| 3 | PRODUCT_REQUIREMENTS.md | MISSING | planned Phase 1 | |
| 4 | CURRENT_STATE_AUDIT.md | COVERED | `docs/PRODUCT_AUDIT.md` (+ `docs/audit/phase-0.1/ARCHITECTURE_REVIEW.md`) | not renamed, to avoid a duplicate |
| 5 | FEATURE_INVENTORY.md | COVERED | `docs/audit/master-spec-v2/FEATURE_INVENTORY.md` | refresh at each milestone |
| 6 | PRODUCT_GAP_ANALYSIS.md | COVERED | `docs/audit/master-spec-v2/PRODUCT_GAP_ANALYSIS.md` | |
| 7 | DECISION_REGISTER.md | COVERED / BLOCKED-OWNER | `docs/audit/master-spec-v2/DECISION_REGISTER.md` | many entries pending |
| 8 | INFORMATION_ARCHITECTURE.md | MISSING | planned Phase 1 | |
| 9 | USER_FLOWS.md | MISSING | planned Phase 1 | |
| 10 | UI_UX_DESIGN_SYSTEM.md | MISSING / BLOCKED-OWNER | planned Phase 1 | brand audit first (DR-14) |
| 11 | SCREEN_SPECIFICATIONS.md | MISSING | planned Phase 1 | also COMPONENT_CATALOG.md (extra deliverable of master §4.8) |
| 12 | GENERAL_ENGLISH_CURRICULUM.md | MISSING / BLOCKED-OWNER | schema in `ADAPTIVE_LEARNING_SPEC.md`; content plan pending OD-10 | specialist review required |
| 13 | ADAPTIVE_LEARNING_SPEC.md | COVERED at spec level, UPDATE later | `ADAPTIVE_LEARNING_SPEC.md` | constants are hypotheses; split into its own file at Phase 4 |
| 14 | AI_PERSONALITY_SPEC.md | COVERED at spec level / BLOCKED-OWNER | `AI_PERSONALITY_ENGINE_SPEC.md` | age rules need OD-06 |
| 15 | VOICE_ENGINE_SPEC.md | PARTIAL / BLOCKED-EXT | `VOICE_ENGINE_SPEC.md` (evaluation plan); `docs/AI_COST_ARCHITECTURE.md` | no provider verified |
| 16 | EXAM_ENGINE_SPEC.md | MISSING / BLOCKED-EXT | `EXAM_PREPARATION_SPEC.md` (verification list) | official specs must be fetched |
| 17 | MOCK_ARENA_SPEC.md | MISSING / BLOCKED-OWNER | gap row 3 in `PRODUCT_GAP_ANALYSIS.md` | OD-08 |
| 18 | MONETIZATION_SPEC.md | MISSING / BLOCKED-OWNER | prices hypothesis in `DECISION_REGISTER.md` DR-05; entitlement design in `docs/DATABASE_DESIGN.md` | OD-08, OD-11 |
| 19 | AI_CREDIT_CONTROL_SPEC.md | COVERED (corrected) | `docs/audit/phase-0.2/FINAL_AI_CREDIT_SPEC.md` (supersedes `phase-0.1/AI_CREDIT_CONTROL_SPEC.md` §3–5) | numbers pending OD-09 |
| 20 | LOCALIZATION_SPEC.md | PARTIAL / UPDATE | `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` §5 + `MULTILINGUAL_ARCHITECTURE.md` | kk/ky/tg unverified |
| 21 | CREATOR_PROGRAM_SPEC.md | COVERED at spec level / BLOCKED-OWNER | `CREATOR_PROGRAM_SPEC.md` | payouts unapproved |
| 22 | TECHNICAL_ARCHITECTURE.md | COVERED + UPDATE | `docs/TECHNICAL_ARCHITECTURE.md` + `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` (wins on listed topics) | |
| 23 | DATABASE_DESIGN.md | COVERED + UPDATE | `docs/DATABASE_DESIGN.md` + `phase-0.2/FINAL_AI_CREDIT_SPEC.md` §1–4 + `PRODUCT_ARCHITECTURE.md` | merge into one at M2a |
| 24 | AUTH_SECURITY_SPEC.md | COVERED | `docs/audit/phase-0.1/AUTH_SECURITY_SPEC.md` (+ token handling in `phase-0.2/FINAL_MIGRATION_SPEC.md` §2) | |
| 25 | MIGRATION_PLAN.md | COVERED (corrected) | `docs/audit/phase-0.2/FINAL_MIGRATION_SPEC.md` (supersedes `phase-0.1/MIGRATION_SAFETY_PLAN.md` §3–4, §8.2–8.4) | OD-01..03 |
| 26 | TEST_STRATEGY.md | MISSING | tests specified inside specs (C-01…C-23, C-M01…C-M12, M1 §4, `ADAPTIVE_LEARNING_SPEC.md`) | consolidate in M1 |
| 27 | IMPLEMENTATION_ROADMAP.md | COVERED + UPDATE | `docs/IMPLEMENTATION_ROADMAP.md` + `docs/audit/phase-0.1/PHASE_1_EXECUTION_PLAN.md` + `docs/audit/master-spec-v2/ROADMAP_RECONCILIATION.md` | labels D1–D8 retired → `phase-0.2/OWNER_DECISION_REGISTER.md` §2 |
| 28 | PRODUCTION_LAUNCH_CHECKLIST.md | MISSING | M8 criteria only in `PHASE_1_EXECUTION_PLAN.md` | late phase |
| 29 | CHANGELOG.md | PARTIAL | `docs/audit/phase-0.2/PHASE_0.2_CHANGELOG.md` | start a root changelog at M1 |

Extra documents from earlier phases that stay authoritative: `docs/audit/phase-0.2/OWNER_DECISION_REGISTER.md` (OD-01…OD-11), `docs/audit/phase-0.2/M1_READY_CHECKLIST.md`.

## Addendum — owner's v3 list of 27 deliverables (Uzbek "Master Product Specification")
Names differ slightly from the 29-item list above. Resolution: **one document per topic, no duplicates**. Authoritative paths (all in `docs/audit/master-spec-v2/` unless stated):

| v3 # | Document | Status | Path |
|---|---|---|---|
| 1 | MASTER_PRODUCT_SPEC | COVERED (index) | `MASTER_PRODUCT_SPEC.md` |
| 2 | PRODUCT_VISION | COVERED | `PRODUCT_VISION.md` |
| 3 | PRODUCT_REQUIREMENTS | COVERED (draft) | `PRODUCT_REQUIREMENTS.md` |
| 4 | PRODUCT_ARCHITECTURE | COVERED (draft) | `PRODUCT_ARCHITECTURE.md` |
| 5 | FEATURE_INVENTORY | COVERED | `FEATURE_INVENTORY.md` |
| 6 | PRODUCT_GAP_ANALYSIS | COVERED | `PRODUCT_GAP_ANALYSIS.md` |
| 7 | USER_FLOWS | COVERED (step level; diagrams pending) | `USER_FLOWS.md` |
| 8 | INFORMATION_ARCHITECTURE | COVERED (draft) | `INFORMATION_ARCHITECTURE.md` |
| 9 | UI_UX_SPECIFICATION | COVERED (spec level; brand decision DR-14 pending) | `UI_UX_SPECIFICATION.md` |
| 10 | SCREEN_SPECIFICATIONS | COVERED (index level; wireframes pending) | `SCREEN_SPECIFICATIONS.md` |
| 11 | GENERAL_ENGLISH_CURRICULUM | COVERED as framework / BLOCKED-OWNER (OD-10), needs specialist | `GENERAL_ENGLISH_CURRICULUM.md` |
| 12 | EXAM_PREPARATION_SPEC | PARTIAL / BLOCKED-EXT (official specs) | `EXAM_PREPARATION_SPEC.md` |
| 13 | MOCK_ARENA_SPEC | COVERED (draft) | `MOCK_ARENA_SPEC.md` |
| 14 | ADAPTIVE_LEARNING_SPEC | COVERED (constants are hypotheses) | `ADAPTIVE_LEARNING_SPEC.md` |
| 15 | AI_PERSONALITY_ENGINE_SPEC | COVERED / BLOCKED-OWNER (OD-06, 06b) | `AI_PERSONALITY_ENGINE_SPEC.md` |
| 16 | VOICE_ENGINE_SPEC | PARTIAL / BLOCKED-EXT | `VOICE_ENGINE_SPEC.md` |
| 17 | MULTILINGUAL_ARCHITECTURE | COVERED / kk-ky-tg BLOCKED-EXT | `MULTILINGUAL_ARCHITECTURE.md` (+ `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` §5) |
| 18 | MONETIZATION_SPEC | COVERED (draft) / BLOCKED-OWNER | `MONETIZATION_SPEC.md` |
| 19 | AI_COST_CONTROL_SPEC | COVERED (corrected; renamed there) | `docs/audit/phase-0.2/FINAL_AI_CREDIT_SPEC.md` (§10 usage record added) |
| 20 | CREATOR_PROGRAM_SPEC | COVERED / BLOCKED-OWNER | `CREATOR_PROGRAM_SPEC.md` |
| 21 | ADMIN_CMS_SPEC | COVERED (draft) | `ADMIN_CMS_SPEC.md` |
| 22 | ANALYTICS_SPEC | COVERED (draft) | `ANALYTICS_SPEC.md` |
| 23 | SECURITY_AND_PRIVACY_SPEC | COVERED (consolidation) / LEGAL REVIEW | `SECURITY_AND_PRIVACY_SPEC.md` |
| 24 | TEST_STRATEGY | COVERED (plan) | `TEST_STRATEGY.md` |
| 25 | IMPLEMENTATION_ROADMAP | COVERED + UPDATE | `ROADMAP_RECONCILIATION.md`, `docs/IMPLEMENTATION_ROADMAP.md` |
| 26 | OWNER_DECISION_REGISTER | COVERED (extended, not duplicated) | `docs/audit/phase-0.2/OWNER_DECISION_REGISTER.md` |
| 27 | PRODUCTION_LAUNCH_CHECKLIST | COVERED (template) | `PRODUCTION_LAUNCH_CHECKLIST.md` |

Note: the earlier file `STRATEGIC_GAPS_SPEC.md` was split into the topic documents above (§1→17, §2→15, §3→16, §4→12, §5→14, §6→`PRODUCT_ARCHITECTURE.md`, §7→20, §8→21) and removed; no content was lost.
