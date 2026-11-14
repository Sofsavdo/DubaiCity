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
| 12 | GENERAL_ENGLISH_CURRICULUM.md | MISSING / BLOCKED-OWNER | schema in `STRATEGIC_GAPS_SPEC.md` §5.2; content plan pending OD-10 | specialist review required |
| 13 | ADAPTIVE_LEARNING_SPEC.md | COVERED at spec level, UPDATE later | `STRATEGIC_GAPS_SPEC.md` §5 | constants are hypotheses; split into its own file at Phase 4 |
| 14 | AI_PERSONALITY_SPEC.md | COVERED at spec level / BLOCKED-OWNER | `STRATEGIC_GAPS_SPEC.md` §2 | age rules need OD-06 |
| 15 | VOICE_ENGINE_SPEC.md | PARTIAL / BLOCKED-EXT | `STRATEGIC_GAPS_SPEC.md` §3 (evaluation plan); `docs/AI_COST_ARCHITECTURE.md` | no provider verified |
| 16 | EXAM_ENGINE_SPEC.md | MISSING / BLOCKED-EXT | `STRATEGIC_GAPS_SPEC.md` §4 (verification list) | official specs must be fetched |
| 17 | MOCK_ARENA_SPEC.md | MISSING / BLOCKED-OWNER | gap row 3 in `PRODUCT_GAP_ANALYSIS.md` | OD-08 |
| 18 | MONETIZATION_SPEC.md | MISSING / BLOCKED-OWNER | prices hypothesis in `DECISION_REGISTER.md` DR-05; entitlement design in `docs/DATABASE_DESIGN.md` | OD-08, OD-11 |
| 19 | AI_CREDIT_CONTROL_SPEC.md | COVERED (corrected) | `docs/audit/phase-0.2/FINAL_AI_CREDIT_SPEC.md` (supersedes `phase-0.1/AI_CREDIT_CONTROL_SPEC.md` §3–5) | numbers pending OD-09 |
| 20 | LOCALIZATION_SPEC.md | PARTIAL / UPDATE | `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` §5 + `STRATEGIC_GAPS_SPEC.md` §1 | kk/ky/tg unverified |
| 21 | CREATOR_PROGRAM_SPEC.md | COVERED at spec level / BLOCKED-OWNER | `STRATEGIC_GAPS_SPEC.md` §7 | payouts unapproved |
| 22 | TECHNICAL_ARCHITECTURE.md | COVERED + UPDATE | `docs/TECHNICAL_ARCHITECTURE.md` + `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` (wins on listed topics) | |
| 23 | DATABASE_DESIGN.md | COVERED + UPDATE | `docs/DATABASE_DESIGN.md` + `phase-0.2/FINAL_AI_CREDIT_SPEC.md` §1–4 + `STRATEGIC_GAPS_SPEC.md` §6 | merge into one at M2a |
| 24 | AUTH_SECURITY_SPEC.md | COVERED | `docs/audit/phase-0.1/AUTH_SECURITY_SPEC.md` (+ token handling in `phase-0.2/FINAL_MIGRATION_SPEC.md` §2) | |
| 25 | MIGRATION_PLAN.md | COVERED (corrected) | `docs/audit/phase-0.2/FINAL_MIGRATION_SPEC.md` (supersedes `phase-0.1/MIGRATION_SAFETY_PLAN.md` §3–4, §8.2–8.4) | OD-01..03 |
| 26 | TEST_STRATEGY.md | MISSING | tests specified inside specs (C-01…C-23, C-M01…C-M12, M1 §4, `STRATEGIC_GAPS_SPEC` §5.6) | consolidate in M1 |
| 27 | IMPLEMENTATION_ROADMAP.md | COVERED + UPDATE | `docs/IMPLEMENTATION_ROADMAP.md` + `docs/audit/phase-0.1/PHASE_1_EXECUTION_PLAN.md` + `docs/audit/master-spec-v2/ROADMAP_RECONCILIATION.md` | labels D1–D8 retired → `phase-0.2/OWNER_DECISION_REGISTER.md` §2 |
| 28 | PRODUCTION_LAUNCH_CHECKLIST.md | MISSING | M8 criteria only in `PHASE_1_EXECUTION_PLAN.md` | late phase |
| 29 | CHANGELOG.md | PARTIAL | `docs/audit/phase-0.2/PHASE_0.2_CHANGELOG.md` | start a root changelog at M1 |

Extra documents from earlier phases that stay authoritative: `docs/audit/phase-0.2/OWNER_DECISION_REGISTER.md` (OD-01…OD-11), `docs/audit/phase-0.2/M1_READY_CHECKLIST.md`.
