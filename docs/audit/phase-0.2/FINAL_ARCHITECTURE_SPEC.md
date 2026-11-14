# FINAL ARCHITECTURE SPEC (Phase 0.2)

Consolidates the Phase 0 / 0.1 architecture with the Phase 0.2 corrections. Where this file and an older file disagree, **this file wins** for the topics it lists in §1. Older files are preserved unchanged.
Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved.

## 1. Status of Phase 0.1 items

| Topic | Phase 0.1 location | Status |
|---|---|---|
| Credit ledger & ceilings | AI_CREDIT_CONTROL_SPEC §3–5 | Replaced by `FINAL_AI_CREDIT_SPEC.md` |
| Legacy copy & rollback | MIGRATION_SAFETY_PLAN §3–4, §8.2–8.4 | Replaced by `FINAL_MIGRATION_SPEC.md` |
| Owner decision IDs | OWNER_DECISIONS, PHASE_1 plan | Normalised in `OWNER_DECISION_REGISTER.md` |
| Archive retention | MIGRATION_SAFETY_PLAN (M8 + 90 days) | Corrected §6 |
| Everything else (target stack, schemas `legacy/app/meta`, auth design, M1–M8 order) | Phase 0.1 | Unchanged |

## 2. Verified baseline [F]

Vite 5 + React 18 + TS SPA, hash routes (21 static routes + patterns); Node 22 plain `http` server via `tsx`; `node:sqlite` (FK on, journal `delete`, `VACUUM INTO` works); Railway service `bandly`, 1 replica, volume `bandly-data` mounted at `/data`; 24-command test chain; no CI; production in demo mode per startup log (`AI: none, TTS: none, To'lov: yo'q (demo)`). **[U]** production DB contents.

## 3. Architecture decisions affected by Phase 0.2 [R]

1. **Credits** are double-entry with five buckets and a closed-balance CHECK; reservations are a conditional-update state machine; ceilings are a fail-closed two-scope check.
2. **Tokens**: raw token never leaves SQLite; PostgreSQL stores SHA-256 hashes only (`legacy.players.token_hash`).
3. **Payments**: webhook inbox is a durable store separate from the migrated database; provider retry is never assumed.
4. **Rollback**: SQLite file is frozen at cut-over; rollback builds a **new** file; window-created users get an emailed re-entry link (or sign-up is disabled during the window — OD-03).
5. **Time**: all instants are `timestamptz` UTC; user-facing "day" logic uses the user's IANA time zone.

## 4. Data-residency dependency map (no legal conclusions)

| Component | Holds personal data? | Depends on OD-01 answer | Interim rule |
|---|---|---|---|
| Production PostgreSQL | yes | location | not provisioned until OD-01 |
| Off-site backups | yes | location | none created until OD-01 (M1 core uses volume) |
| Volume snapshot (M1) | yes (today already) | n/a (status quo) | unchanged |
| Error tracker | may (IPs, user ids) | vendor region + scrubbing | scrub ids/IPs; choose after OD-01 |
| Email provider | email, name | processor location | choose after OD-01 |
| AI / TTS / STT providers | text, audio (voice = personal) | processor location | no real key until OD-01 and OD-09 |
| Google / Telegram sign-in | identifiers | n/a (user-initiated) | review after OD-01 |
| Analytics (if any) | pseudonymous ids | vendor region | none in Phase 1 |
| Logs (Railway) | IPs | platform region | status quo |

**[U]** Whether any target country mandates in-country storage is unverified; a lawyer must answer (OD-01).

## 5. Localization acceptance criteria (Uzbek / English / Russian)

**Verified in Node 22 / ICU 78.3 [F]:**
- `en`, `uz`: plural categories `one`, `other`. `ru`: `one`, `few`, `many`, `other` (1→one, 2→few, 5→many, 21→one, 22→few).
- Number formats: en `1,234,567.5`; uz `1 234 567,5`; ru `1 234 567,5`.
- Dates: en "June 3, 2026"; uz "3-iyun, 2026"; ru "3 июня 2026 г.".
- Currency UZS: uz renders "soʻm", en/ru render "UZS" (ICU data; **[U]** native-speaker preference not verified).
- `Asia/Tashkent` is a supported time zone.

**Acceptance criteria (M6) [R]:**
1. All user-visible strings come from a message catalogue keyed by id; zero hard-coded UI strings (lint rule + test counting Cyrillic/Uzbek literals outside the catalogue; baseline today ≈360 hard-coded Uzbek lines, 34 catalogue keys **[F]**).
2. Every key exists in `uz`, `en`, `ru`; build fails if a key is missing in any locale or a placeholder set differs between locales.
3. Pluralised messages define every category required by that locale (`ru`: one/few/many/other) — test enumerates `Intl.PluralRules` categories.
4. Dates, numbers, currency formatted only via `Intl` with the active locale and the user's time zone; no manual string formatting.
5. Locale chosen by: stored preference → browser language → default; changeable without reload; persisted server-side after M3.
6. Layout: no clipping at the longest locale string on 320 px width (visual test on `ru`).
7. Exam content: instructions localised; **English exam text never translated**; answer keys unaffected by locale.
8. Fallback: a missing key renders English plus a logged warning; never a raw key in production.
9. Human review: each locale marked `reviewed` only after a native speaker sign-off (OD-10); machine drafts flagged `draft` and hidden from production unless the owner opts in.
10. Existing suites stay green; new suites assert 2, 3, 4 above.

## 6. Account deletion vs backup / archive retention  [R]

- Deletion flow: request → 14-day recovery (account disabled) → hard delete of personal data → payment records anonymised and kept for statutory period **[U]**.
- **Backups**: rolling 35-day window **[R]**; privacy notice must say a deleted user may remain in backups up to 35 days. A **deletion log** (user id hash + date) is retained and re-applied automatically after any restore, so restores never resurrect deleted users. Test: restore a backup older than a deletion → deletion job re-runs → user absent.
- **Pre-migration SQLite archive**: kept for 35 days after the rollback window closes, then destroyed (Phase 0.1's "M8 + 90 days" is withdrawn). If the owner wants a longer archive, per-request scrubbing of the archive is required (OD-07).
- **Exports/off-site copies** follow the same 35-day rule and OD-01 location.

## 7. Payment webhook failure handling (summary)

Durable inbox, 200 only after commit, idempotent apply, reconciliation job, alert on unapplied events > 5 minutes. Details: `FINAL_MIGRATION_SPEC.md` §6. **[U]** Hamyon's actual retry behaviour and any transaction-list API.

## 8. What remains unverified (do not treat as fact)

Production data volume and ADMIN_TOKEN status; edge compression; real-device performance; every provider behaviour (Hamyon formats/retries, AI/TTS usage reporting and idempotency, Azure Uzbek voices); `btree_gist` on managed PG; all legal questions (residency, minimum age, retention periods).
