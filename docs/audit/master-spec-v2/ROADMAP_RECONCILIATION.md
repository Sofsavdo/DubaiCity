# ROADMAP RECONCILIATION — Master Spec Phases 0–12 vs Technical Milestones M1–M8

Neither roadmap replaces the other. **Milestones M1–M8** (`docs/audit/phase-0.1/PHASE_1_EXECUTION_PLAN.md`, corrected by `phase-0.2`) are the *engineering foundation*. **Master phases** are *product capability*. Rule: **no product phase may bypass a foundation gate.** Product-design documents (no code) can proceed in parallel at any time.

## 1. Mapping

| Master phase | Content | Maps to / depends on | Gate preserved |
|---|---|---|---|
| 0 Audit | done | Phase 0, 0.1, 0.2, master-spec-v2 reconciliation | — |
| 1 Blueprint & design system | docs only (IA, flows, tokens, components, screens) | none technically; informs M6 (strings), M5 (entitlements UX) | no code; can run now |
| 2 Foundation & reliability | auth, DB, backups, migrations, validation, localization framework, observability, tests | **= M1 → M2a → M2b → (7-day window) → M3**; localization framework = **M6**; tests/CI = **M1** | M1 safety, M2b cut-over gate, OD-01/02/03 |
| 3 General English foundation | curriculum, lessons, vocab/grammar integration, server progress | M4 (server learner data) + M5 (entitlements, content delivery) + **new curriculum build track** (content, not engineering) | needs M3 accounts; OD-08, OD-10 |
| 4 Diagnostic & adaptive | placement, profile, taxonomy, mastery, plan | M4 + new adaptive module after M4 | server data first; no LLM decisions |
| 5 AI personality & voice | gateway, personalities, voice, metering, safety | **M7** (AI gateway & metering) extended; needs M3, M5, `FINAL_AI_CREDIT_SPEC`; voice evaluation precedes any real key | **OD-09, OD-06, OD-01**; no real key before ceilings |
| 6 Exam preparation | IELTS GT, CEFR, SAT, rubric AI | after M5 (server grading, entitlements); AI parts after M7; exam specs verified first | external spec verification |
| 7 Mock Arena | free server-graded mocks | **M5** (attempts, server timers) — can precede Phase 3 | OD-08 |
| 8 Gamification & social | XP validation, achievements, duels | M4 (XP server-side) | anti-cheat after M4 |
| 9 Subscriptions, payments, AI economics | plans, local pricing, webhooks, ledger | entitlement tables **M5**; ledger **M7**; webhook inbox/reconciliation **M2** (FINAL_MIGRATION §6) | OD-04, OD-07, OD-11; reconciliation test before any live money |
| 10 Creator & referral | tracking, rewards | after M3 and Phase 9 pricing; payouts blocked on owner approval | DR-11 |
| 11 Central Asia localization | uz/ru done in M6; kk/ky/tg, country config, local prices | M6 + country config (`PRODUCT_ARCHITECTURE.md`) | OD-10, OD-01, per-country legal |
| 12 Hardening & launch | security, load, a11y, restore, reconciliation | **= M8** | all prior gates |

## 2. Recommended sequencing

```
now (no code):  Phase 1 blueprint docs  ∥  owner inputs (OD-01…OD-04, A1–A5)
M1-core → [OD-01,02] → M2a → [OD-03] → M2b → 7-day window → M3
   → M4 (server learner data) → M5 (entitlements + Mock Arena + content delivery)
   → ∥ M6 (uz/en/ru) …… curriculum content track (ongoing, human-reviewed)
   → adaptive engine → M7 (+voice evaluation) → exam expansion → gamification/creator → kk/ky/tg → M8
```

## 3. Sequencing conflicts and resolutions

| Conflict | Resolution |
|---|---|
| Master spec puts Mock Arena (Phase 7) late; funnel value argues early | Mock Arena needs only M5, so it ships **before** Phase 3 content is complete. Recommend owner confirm (DR-15). |
| Master Phase 5 (voice/personalities) before Phase 6 (exams) vs. cost risk | Personalities/voice depend on M7 ledger + OD-09; ordering stays but real-provider activation stays gated. |
| Phase 2 "foundation" vs. M3 waiting for 7-day rollback window | Window is retained (FINAL_MIGRATION §5); M6 and content/design work run in parallel, so the window costs no product time. |
| Phase 1 design wants server-driven dashboard, but accounts arrive at M3 | Design for server data; prototype/build UI against the existing localStorage adapter behind an interface, then swap. No UI work starts before owner approves blueprint. |
| Kazakh/Kyrgyz/Tajik in Phase 11 vs. "international from start" | Architecture (catalogue, country config) is built in M6/M5; the extra locales are content/review work later. |
| Creator payouts (Phase 10) | Tracking only until the owner approves rules; payouts are never automatic. |
| Adaptive plan needs curriculum graph that does not exist | Curriculum model is a prerequisite of Phase 4; schema defined in blueprint, content authored in parallel track. |

## 4. Preserved gates (unchanged)
M1 baseline + backups + CI before anything; no PG before OD-01/OD-02; M2b needs rehearsed rollback (OD-03); M3 only after the window closes; no real AI key before OD-09 and ledger; no live payments before reconciliation test; no deploy or migration without explicit owner approval.

## 5. Proposed Phase 1 (blueprint) scope for owner review
Documents only: `PRODUCT_REQUIREMENTS.md`, `INFORMATION_ARCHITECTURE.md`, `USER_FLOWS.md`, `UI_UX_DESIGN_SYSTEM.md` (starting from the **existing** brand in `src/brand.ts`/`styles.css`/`Mascot.tsx`, audited first), `COMPONENT_CATALOG.md`, `SCREEN_SPECIFICATIONS.md` (31 screens listed in Master Spec §4.8). Exit criterion: owner approves navigation (7 primary items), dashboard content and the design tokens. No UI code.

## 6. Owner v3 priority list vs this reconciliation
Owner order: 1 Foundation → 2 General English → 3 Adaptive → 4 AI Personality & Voice → 5 Exam Prep → 6 Mock Arena → 7 Monetization → 8 Gamification → 9 Localization → 10 Growth. This sequence is kept as the **product** priority. Conflicts with technical dependencies (owner decision OD-15):

| Owner order | Dependency problem | Proposed handling |
|---|---|---|
| Mock Arena at 6 | it needs only M5 and is the free acquisition product | build when M5 completes, in parallel with General English content authoring; does not displace priorities 2–4 for engineering effort that is content-bound |
| Monetization at 7 | entitlements (M5) are needed earlier; AI cost control is already inside priority 4 | server entitlements + ledger ship earlier; **paid checkout** still waits for 7 |
| Gamification at 8 | XP validation is part of M4 (server data) | integrity part early, new mechanics late |
| Localization at 9 | string catalogue (M6) is a foundation; adding uz/en/ru to new UI later is costlier | catalogue + uz/en/ru early, kk/ky/tg at 9 |
| Voice before exams | voice provider tests need network access and owner approval; English first | English realtime test only after OD-09 and ledger |

All M1 gates, OD-01 and OD-02 stay ahead of everything.
