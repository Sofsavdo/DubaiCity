# DECISION REGISTER (Master Spec v2 intake)

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. No owner approval is invented. "Approved" below means the owner stated it in this chat; the three ChatGPT conversations and `Loyiha tahlili.txt` were **not readable** (see §1), so decisions from them are listed only as "to import".

## 1. Source availability [F]

| Source | Status |
|---|---|
| chatgpt.com/s/t_6af8539b… | **Inaccessible**: host does not resolve from this session (outside allowed network domains) |
| chatgpt.com/s/t_6af85483… | **Inaccessible**: same |
| chatgpt.com/s/t_6af854e0… | **Inaccessible**: same |
| `Loyiha tahlili.txt` | **Not found** in the session filesystem (no file attached/uploaded here) |
| Repository `Sofsavdo/Bandly` (local clone, branch `main`) | Read in Phases 0–0.2 |

**Owner action:** paste/export the three conversations and the text file into chat (or allow `chatgpt.com` in the session network settings), then I import their decisions here.

## 2. Register

| ID | Topic | Previously agreed | Current implementation | Conflict / gap | Proposed resolution | Status | Consequences |
|---|---|---|---|---|---|---|---|
| DR-01 | Product structure | 3 products: General English (grammar inside), Exam Prep, free Mock Arena | 3 tracks `exam`, `grammar`, `mocks` (grammar sold separately, mocks priced) [F] | Grammar is a separate product; mocks not free | Map per OD-08 (option A) | pending owner (OD-08) | No paying users expected; confirm via M1 inventory |
| DR-02 | Language model | 4 separate settings: interface, explanation, learning, voice; locales en, uz, ru, kk, ky, tg (tk later) | 34-key skeleton, ~360 hard-coded Uzbek lines, one language [F] | kk/ky/tg not planned in Phase 0–0.2 (only uz/en/ru) | Add kk/ky/tg to localization phase; keep M6 on uz/en/ru first; `Intl` plural rules for kk/ky/tg to be verified before commitment | **[U]** needs owner confirmation of rollout order | Native-speaker review needed per locale (OD-10) |
| DR-03 | Exam scope | IELTS Academic+General, CEFR (country-specific), SAT (digital) | IELTS-centric only [F] | CEFR formats and current SAT spec unverified | Verify official specs before design (Phase 6) | pending | Content licensing: original questions only |
| DR-04 | AI personalities | 5 (Friendly, Strict Examiner, Savage opt-in, Comedy, Debate) | Examiner persona only, browser STT/TTS [F] | 4 personalities + safety rules missing | Phase 5 per spec; Savage default off, never in exam mode, not for minors | approved as scope by owner message; details pending | Needs OD-06 (age) |
| DR-05 | Pricing | Free $0 / General $5.99 / Exam $7.99 / All Access $9.99 (hypotheses) | prices in code/config for old 3 tracks [F] | not approved; must be data | Store as configurable data; no hardcoding | pending owner | Country prices per OD-11/OD-04 |
| DR-06 | Roll-out | UZ → KZ → KG → TJ → TM; architecture international | Uzbekistan-specific (Hamyon, UZS) [F] | country config absent | Country table in DB design | approved as sequence | Residency law per country (OD-01) |
| DR-07 | Data residency/hosting | (unknown — conversation unread) | Railway sfo [F] | Phase 0 "move to Europe" ignored legal question | OD-01 | pending owner + lawyer | blocks PG, off-site backup |
| DR-08 | Database | PostgreSQL desirable, only after backup/restore/rollback | SQLite on volume [F] | no backup, no migrations | M1 then M2 per Phase 0.1/0.2 | pending (OD-02) | |
| DR-09 | Auth/tokens | secure auth; no raw legacy credentials migrated | plaintext token column [F] | — | token_hash pre-step; FINAL_MIGRATION_SPEC §2 | recommended | |
| DR-10 | AI credits | ledger with reserve/settle, idempotency, provider and global caps | none; `ai_usage` counters only [F] | — | FINAL_AI_CREDIT_SPEC | recommended; numbers pending OD-09 | |
| DR-11 | Creator program rewards | $1/$5/$10/$50/$100 at 10k/50k/100k/500k/1M views — **test values only** | none | no budget, fraud rules, payout provider | Build tracking only; **no payouts** until owner approves budget, fraud, eligibility, minimum payout, provider | pending owner | Legal/tax per country **[U]** |
| DR-12 | Speak-or-Die-style challenge | thresholds 12/10/5/2.5 s hypotheses | none | accessibility, IP | Own design; configurable; pressure-off option | pending | no competitor assets |
| DR-13 | Voice provider | provider-agnostic; verify Uzbek/Kazakh/Kyrgyz/Tajik support | browser Web Speech only [F] | no provider verified | Provider comparison doc with sources/dates before choice | pending | No unsupported language advertised |
| DR-14 | Design identity | inspect existing brand first; navy/violet suggestion not final | existing mascot/theme [F] | not yet reviewed as design system | Phase 1 audit of assets then tokens | pending | |
| DR-15 | Launch scope | (earlier: GE A1–B1 + IELTS Academic + free Mock Arena in en/uz/ru) | partial content [F] | conflicts with 5-country/6-locale ambition | Keep narrow first scope unless owner changes | pending (OD-10) | |
| DR-16 | Age / adult mode | Savage opt-in, no minors | client-side 18+ checkbox [F] | bypassable | server-enforced age band | pending (OD-06) | legal input |
| DR-17 | Retention / deletion | account deletion, export | none | — | FINAL_ARCHITECTURE §6; periods pending | pending (OD-07) | not legal advice |
| DR-18 | Previous decision IDs | OD-01…OD-11 | — | overlaps with this register | OD-xx remain the owner-question IDs; DR-xx track spec-vs-code conflicts | informational | |

## 3. Newly raised conflict to decide now

**Scope inflation vs. Phase 0.2 plan:** this spec adds 3 more locales, SAT, CEFR, Creator Program, admin CMS, Speak-or-Die and 5 personalities on top of M1–M8. Recommendation **[R]**: keep M1–M8 (foundation) unchanged, treat the rest as Phase 2+ products sequenced after M5/M7, and let the owner confirm order (DR-15).
