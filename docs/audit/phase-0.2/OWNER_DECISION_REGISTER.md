# OWNER DECISION REGISTER (Phase 0.2)

Single source of truth for owner decisions. IDs **OD-01…OD-11** are the numbers 1–11 used in `docs/audit/phase-0.1/OWNER_DECISIONS.md` (kept unchanged; its option text remains valid). The ambiguous `D1…D8` labels in `docs/IMPLEMENTATION_ROADMAP.md` and `PHASE_1_EXECUTION_PLAN.md` are retired; use the translation table in §2. No document may use bare "D1/D2/D3" from now on.

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is legal advice; legal questions are listed as questions for a qualified lawyer, not answered.

Blocking classes: **IMPL** = blocks starting implementation of the named milestone · **PROD** = implementation may proceed on staging/flags, but production release (or real users / real money) is blocked.

## 1. Master table

| ID | Name | Required before milestone | Blocks | Status |
|---|---|---|---|---|
| OD-01 | Data residency & hosting region | M1-offsite (backup location), M2a (PG provisioning) | **IMPL** of M1 off-site backup and M2a; **PROD** for everything storing personal data | Open — needs legal answer |
| OD-02 | Database platform | M2a | **IMPL** M2a | Open |
| OD-03 | Maintenance window, rollback-risk acceptance, window-user handling | M2b | **IMPL** M2b (cut-over); **PROD** | Open |
| OD-04 | Vendor accounts & recurring foundation budget (backup storage, error tracker, email + domain, Google OAuth, Telegram bot, payment-provider export access) | M1 (storage, error tracker), M3 (rest) | **IMPL** M1 off-site/error tracker, M3 | Open |
| OD-05 | Sign-in methods & legacy-account sunset | M3 | **IMPL** M3 | Open |
| OD-06 | Age policy & adult-mode policy | M3 | **IMPL** of age collection in M3; **PROD** for adult mode | Open — needs legal input on minimum age |
| OD-07 | Retention, deletion, refund policy (incl. archive/backup retention) | M3 (deletion mechanics provisional), M8 (final) | **PROD** (privacy notice, paid launch); M3 may use provisional defaults | Open |
| OD-08 | Mapping of three tracks & free-tier definition | M5 | **IMPL** M5 | Open (recommended A) |
| OD-09 | AI budget, price tables, ceilings, `unknown`-call policy | before first **real** AI key | **PROD** only (M7 builds with configurable values) | Open |
| OD-10 | Launch scope & content ownership/translation review | Phase 2 | Neither M1–M8 IMPL nor PROD of foundation; **PROD** of localized content | Open |
| OD-11 | International payment provider & legal entity | Phase 7 | **PROD** of non-UZ paid launch only | Open |

**Net effect:** for **M1 core** (CI, in-volume backup, restore test, inventory, error tracker optional) **no owner decision blocks implementation**; only owner inputs in `M1_READY_CHECKLIST.md` §1 are needed.

## 2. Translation of old labels

| Old label (roadmap / Phase 1 plan) | Meaning there | Now |
|---|---|---|
| D1 (roadmap) "Move SQLite → PostgreSQL" | database platform | OD-02 |
| D2 "Sign-in methods" | auth | OD-05 |
| D3 "Collect year of birth" | age | OD-06 |
| D4 "Hosting region" / "U-1" | residency | OD-01 |
| D5 "three current tracks" | tracks | OD-08 |
| D6 "Payment providers" | payments | OD-11 (UZ Hamyon operation: OD-04 for provider export access) |
| D7 "Who authors content" | content | OD-10 |
| D8 "First launch scope" / "credit allowances" (plan used D8 for credits) | launch scope vs AI budget | launch scope → OD-10; credit allowances → OD-09 |
| U-3 "email provider and domain" | vendor | OD-04 |
| "D1, D3-region" in M2b dependency | DB + region | OD-01, OD-02, OD-03 |
| "D1, D2, D3, U-3" in M3 dependency | | OD-05, OD-06, OD-04 (OD-01 already required) |
| "D5" in M5 | tracks | OD-08 |
| "D8" in M7 | credits | OD-09 |

(Phase 0.1 files are not edited; this table is the authoritative reading.)

## 3. Per-decision detail

### OD-01 Data residency and hosting region
- **Question to put to a lawyer [U]:** which of Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan (and EU/UK if served) impose in-country storage or database-registration duties for personal data of their residents, and do they apply to a learning app of this type. **No conclusion is recorded here.**
- **Technical dependencies (verified from architecture, not legal):** DB location; backup location; processors receiving personal data (AI, TTS/STT, email, error tracker, analytics, Telegram/Google sign-in); log retention location.
- **Interim rule [R]:** until answered, **no new off-volume copy of personal data** is created. M1 backups stay on the existing volume (not sufficient for paid launch) and an *empty/anonymised* restore drill is acceptable.
- Blocks: M1-offsite, M2a.

### OD-02 Database platform — see Phase 0.1 §2. Recommended managed PostgreSQL in region from OD-01. **[U]** `btree_gist` availability must be checked on the chosen platform (FINAL_AI_CREDIT_SPEC §3).

### OD-03 Maintenance window and rollback-risk acceptance
Owner must now answer four concrete items (FINAL_MIGRATION_SPEC §5, §7):
1. Maximum write-freeze duration (recommended ≤ 30 min).
2. Accept that users **created during the 7-day window** may need an emailed re-entry link after a rollback — **or** disable new sign-ups during the window.
3. Accept the explicit loss list on rollback (new-system-only data kept in PG, not in SQLite).
4. Rollback time budget and triggers.

### OD-04 Vendor accounts and budget
Items: off-site backup storage (after OD-01), error tracker, email provider + sending domain DNS control, Google OAuth project, Telegram bot, and **read access to the Hamyon dashboard/transaction export** for reconciliation **[U]** (whether a transaction-list API exists is unverified).

### OD-05 Sign-in methods and legacy sunset — Phase 0.1 recommended A + 90-day legacy sunset. Legacy token binding mechanism: FINAL_MIGRATION_SPEC §2.4.

### OD-06 Age and adult mode
- Minimum age per country **[U]** needs legal input; code makes it configuration.
- Adult mode default **off** until decided.

### OD-07 Retention, deletion, refund
Reconciled statement (also in FINAL_ARCHITECTURE_SPEC §6):

| Data | Rule [R] | Status |
|---|---|---|
| Account & learning data | Deleted after 14-day recovery; anonymised aggregates may remain | owner confirm |
| Payment records | Anonymised and kept for the statutory period | **[U]** period — lawyer |
| Live database backups | Rolling **35-day** window (set by backup job). A deleted user remains in backups until they age out; **no restore may re-activate a deleted user** — a deletion log is re-applied after any restore | owner confirm 35 days |
| Pre-migration SQLite archive | **Must not outlive the live backup window for deleted users.** Archive retained **35 days after the 7-day window closes** (not M8+90 days as in Phase 0.1), then destroyed; if the owner wants longer, deleted-user rows are scrubbed from the archive on each deletion request | owner confirm |
| Speaking/writing submissions | 12 or 24 months — owner choose | **[U]** |
| Refund on deletion with active subscription | require cancellation first (Phase 0.1 rec. C) | owner confirm |

The Phase 0.1 inconsistency (archive kept M8+90 days vs "35-day backups") is resolved by the rows above.

### OD-08 Tracks mapping — recommended A. Precondition: M1 inventory confirms no paid subscriptions; otherwise a grandfathering rule is needed first.

### OD-09 AI budget
Owner inputs needed before the first real key: provider and model(s) with source for every price (FINAL_AI_CREDIT_SPEC §3), global and per-provider ceilings (daily and monthly), daily free credit amount, whether paid credits expire, confirmation of the `unknown`-call policy (FINAL_AI_CREDIT_SPEC §5.2).
Daily-credit time zone rule is decided (user's IANA time zone, FINAL_AI_CREDIT_SPEC §7); owner only confirms the 7-day change limit.

### OD-10 Launch scope and content ownership
Includes **localization acceptance criteria** (FINAL_ARCHITECTURE_SPEC §5) and who reviews each locale. No machine-drafted translation is shown as reviewed.

### OD-11 International payment provider and legal entity — no work before Phase 7.

## 4. Dependency order of approvals

```
M1 core ........ none (inputs only, M1_READY_CHECKLIST §1)
M1 off-site .... OD-01, OD-04
M2a ............ OD-01, OD-02
M2b ............ OD-03 (+ M2a done)
M3 ............. OD-04, OD-05, OD-06 (+ closed rollback window)
M5 ............. OD-08
M7 ............. none to build; OD-09 before real key
M8 / paid launch OD-07, OD-01 answered, OD-11 for non-UZ
```
