# DECISION REGISTER

Stable IDs: **OD-01…OD-11** are owner questions (authoritative detail in `docs/audit/phase-0.2/OWNER_DECISION_REGISTER.md`, not renumbered). **DR-xx** track spec-vs-code conflicts. "Owner approval" values: **approved** (stated by the owner in this chat) · **pending** · **hypothesis** (owner proposed as test value) · **rejected** (none). Recommendations are never recorded as approvals.

**Sources not reviewed:** ChatGPT conversations `t_6af8539b…`, `t_6af85483…`, `t_6af854e0…` (inaccessible: host not reachable) and `Loyiha tahlili.txt` (not present). Any decision from them is absent from this table until imported.

| ID | Topic | Original decision | Current implementation | New Master Spec v2 requirement | Conflict / gap | Recommended resolution | Owner approval | Dependencies | Implementation impact |
|---|---|---|---|---|---|---|---|---|---|
| DR-01 | Product structure | (earlier chat) 3 tracks exam / grammar / mocks, priced | `server/pricing.ts`, `src/config.ts`: 3 tracks; `Gate` client-side | 3 products: General English (grammar inside), Exam Prep, free Mock Arena | grammar separate; mocks paid | map per OD-08 option A | **approved (structure)** by Master Spec; mapping pending (OD-08) | M5, OD-08 | entitlement tables, content split; no paying customers expected — confirm in M1 inventory |
| DR-02 | Languages | uz only (earlier); i18n skeleton requested | 34 keys, ~360 hard-coded lines | 6 locales; 4 independent settings | kk/ky/tg not planned before | M6 for uz/en/ru, catalogue designed for 6; kk/ky/tg later | **approved (scope)**; rollout order pending | M6, OD-10 | catalogue + settings model |
| DR-03 | Exam scope | IELTS Academic | Academic only | + IELTS GT, CEFR (country-specific), SAT | formats unverified | verify official specs before design | approved (scope); details pending | external verification | new exam modules |
| DR-04 | AI personalities | roast/examiner modes, 18+ checkbox | `roast.ts`, `PersonaPicker.tsx`; client-only age | 5 distinct personalities; Savage opt-in; no minors | behaviours + server safety missing | `STRATEGIC_GAPS_SPEC` §2 | approved (list); safety rules per spec | OD-06, M7 | personality configs, filter |
| DR-05 | Prices | owner earlier: Hamyon, UZS | 3 UZS tracks | Free $0 / GE $5.99 / EP $7.99 / All $9.99 as **hypotheses**, local pricing, no hardcoding | not final | plans/prices as data (country_prices) | **hypothesis** | OD-08, OD-11 | pricing tables |
| DR-06 | Rollout | Uzbekistan first | UZ-specific code | UZ→KZ→KG→TJ→TM; country config | hard-coded assumptions | country model `STRATEGIC_GAPS_SPEC` §6 | **approved (sequence)** | OD-01 per country | config tables |
| DR-07 | Hosting/residency | Phase 0 said "Europe" (my recommendation, not approved) | Railway sfo | legal review required | unanswered legal question | OD-01 first | pending | lawyer | blocks PG + off-site backup |
| DR-08 | Database | SQLite (inherited) | `node:sqlite`, no backups | PG only after backup/restore/rollback | no safety net | M1 then M2 | pending (OD-02) | OD-01 | M2 |
| DR-09 | Legacy tokens | plaintext token (inherited) | `players.token` plaintext | never migrate raw credentials | — | token_hash pre-step | pending (approval at M2a) | M2a | `FINAL_MIGRATION_SPEC` §2 |
| DR-10 | AI credit ledger | none | `ai_usage` counters | robust ledger, ceilings, crash safety | — | `FINAL_AI_CREDIT_SPEC` | structure recommended; numbers pending OD-09 | M7 | |
| DR-11 | Creator rewards | none | none | $1/$5/$10/$50/$100 at 10k/50k/100k/500k/1M views | not approved financial commitment | track only; payouts disabled | **hypothesis only** | owner approval of budget, fraud, eligibility, minimum payout, provider, campaign limits; legal/tax | creator tables later |
| DR-12 | Timed speaking challenge | none | none | own-design challenge, thresholds 12/10/5/2.5 s | hypotheses; accessibility; no competitor assets | configurable thresholds, pressure-off option | **hypothesis** | voice engine | Phase 5/8 |
| DR-13 | Voice provider | browser STT/TTS; optional TTS vendor | browser + untested adapter | provider-agnostic, verify uz/ru/kk/ky/tg | nothing verified | evaluation plan `STRATEGIC_GAPS_SPEC` §3 | pending | external docs, OD-09 | interfaces |
| DR-14 | Design identity | existing mascot/theme | `src/brand.ts`, `styles.css`, `Mascot.tsx` | inspect first; navy/violet suggestion not final | undecided | brand audit in Phase 1 | pending | — | design tokens |
| DR-15 | Launch scope & order | (Phase 0 recommendation, unapproved) GE A1–B1 + IELTS Academic + free Mock Arena in en/uz/ru | partial | broader ambitions | scope inflation | keep foundation M1–M8; sequence new products after; Mock Arena right after M5 | pending (OD-10) | | ROADMAP_RECONCILIATION |
| DR-16 | Age / adult mode | 18+ checkbox | client-side | server-enforced; no minors | bypassable | OD-06 | pending | legal | M3 |
| DR-17 | Retention / deletion | none | none | deletion, export | periods unknown | `FINAL_ARCHITECTURE_SPEC` §6 | pending (OD-07) | legal | M3/M8 |
| DR-18 | Admin | `ADMIN_TOKEN` endpoints | token | RBAC, CMS lifecycle, audit | — | `STRATEGIC_GAPS_SPEC` §8 | pending | M3 | |
| DR-19 | Mock Arena free | mocks priced (code) | `mocks` track | free objective tests | conflict | free; AI feedback premium | **approved (principle)**; limits pending OD-08 | M5 | |
| DR-20 | Analytics | none | none | event-based metrics, no fakes | — | events in M3+ | pending (OD-01 processors) | | |
| OD-01…OD-11 | Owner questions | see `phase-0.2/OWNER_DECISION_REGISTER.md` | | | | | all **pending** | | unchanged IDs |

## Remaining conflicts
1. Scope vs. foundation order (DR-15). 2. Free Mock Arena vs. existing paid `mocks` (DR-01/19). 3. Savage mode vs. unverified age policy (DR-04/16). 4. International ambition vs. unanswered residency law (DR-06/07). 5. Hypothesis prices/rewards must not reach code as constants (DR-05/11).
