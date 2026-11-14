# BANDLY — Decisions Requiring Business-Owner Approval

Only decisions that cannot be made on technical grounds are listed. Technical choices (UUID scheme, index design, test strategy, framework, hashing algorithms) are made by engineering and documented in the specifications.

**Cost statements are qualitative.** No vendor price has been verified in this project; before committing, obtain current prices from the vendors. Where a legal question is involved, this document is **not legal advice**; the owner should obtain advice from a qualified lawyer in each target jurisdiction.

| # | Decision | Needed before |
|---|---|---|
| 1 | Data residency and hosting region | M2a |
| 2 | Database platform | M2a |
| 3 | Maintenance window and rollback-risk acceptance | M2b |
| 4 | Vendor accounts and recurring budget for the foundation | M1 (backup/error tracker), M3 (email, Google, Telegram) |
| 5 | Sign-in methods and legacy-account sunset | M3 |
| 6 | Age policy and adult-mode policy | M3 |
| 7 | Retention, deletion and refund policy | M3 (deletion), M8 (final) |
| 8 | Mapping of today's three tracks and the free-tier definition | M5 |
| 9 | AI budget: credit allowances and global spend ceiling | Before the first **real** AI key (not before M7 itself) |
| 10 | Launch scope and content ownership | Phase 2 (not Phase 1) |
| 11 | International payment provider and legal entity | Phase 7 (not Phase 1) |

---

## 1. Data residency and hosting region

**Why it is the owner's decision.** It is a legal and business-risk question with direct technical consequences. The Phase 0 recommendation to "move to Europe" ignored it.

| | |
|---|---|
| **Options** | **A.** Obtain legal advice for Uzbekistan, Kazakhstan, Kyrgyzstan and Tajikistan (and the EU if EU residents are served), then choose the region accordingly. **B.** Keep a single global region (currently US West) and accept the legal risk. **C.** Move to a Europe region on latency grounds without legal advice. **D.** Split by market (in-country storage for markets that require it, global for others) |
| **Recommended** | **A first.** Some of these jurisdictions are *reported* to require storing citizens' personal data in-country and/or registering databases; this has **not been verified here**. Do not provision the production PostgreSQL until the answer is known. D is the likely outcome if the reports are correct, and it affects the architecture (per-market databases or a regional split) |
| **Cost implications** | Legal consultation (one-off). In-country hosting, if required, may cost more than global hosting and may limit provider choice. A split-by-market design increases operating and engineering cost |
| **Technical consequences** | Fixes the database location, backup location and which AI/email/analytics processors may receive personal data. A late discovery that data must be in-country would force a second migration |
| **If postponed** | M1 can proceed (backups, CI). M2a cannot start. Everything after M2 is blocked. The risk of postponing is only delay; the risk of guessing is a forced re-migration or a compliance problem |

## 2. Database platform

| | |
|---|---|
| **Options** | **A.** Managed PostgreSQL (same platform or another provider, in the region decided in #1). **B.** Stay on SQLite with a migration runner and nightly backups. **C.** Self-managed PostgreSQL on a VM |
| **Recommended** | **A.** B is adequate only for a single-instance app with no growth ambitions; it blocks horizontal scaling, makes concurrent credit/payment logic harder and relies on an experimental Node module. C adds operational burden without benefit at this scale |
| **Cost implications** | A new recurring database cost (usage-based on most managed platforms; small at current volume, grows with data). B: no new cost, but later migration cost remains. C: lowest licence cost, highest labour cost |
| **Technical consequences** | A enables the designs in `DATABASE_DESIGN.md`, point-in-time recovery, multiple application replicas and row-level security. B keeps today's constraints (one writer, one replica) and forces simplifications in credits and auth |
| **If postponed** | M1 proceeds; M2 and all dependants wait. Product work that does not need server state (M6 localization, content authoring) can continue |

## 3. Maintenance window and rollback-risk acceptance (M2b)

| | |
|---|---|
| **Options** | **A.** Short planned write-freeze (target ≤ 30 minutes, announced), 7-day rollback window, then irreversible forward-only. **B.** Longer rollback window (e.g. 30 days) delaying M3. **C.** Attempt zero-downtime dual-write migration |
| **Recommended** | **A.** The data set is small, so a short freeze is cheap; C adds substantial engineering risk for no business benefit at this scale |
| **Cost implications** | A: a brief planned interruption of writes (reads keep working). B: delays authentication and every later milestone by the longer window. C: more engineering time and higher defect risk |
| **Technical consequences** | After the window closes, rollback is only "restore PostgreSQL to a point in time" (writes after that point are lost). The owner must accept that explicitly (`MIGRATION_SAFETY_PLAN.md` §8.3-B) |
| **If postponed** | Production stays on SQLite; nothing after M2 can be released |

## 4. Vendor accounts and recurring budget for the foundation

Engineering cannot create accounts that need the owner's identity, payment method or domain.

| Item | Needed for | Options | Recommended | Cost implication |
|---|---|---|---|---|
| Off-site backup storage | M1 | Object storage on the chosen platform or another provider; must satisfy #1 | Same region class as the database, separate account/credentials from the application | Small recurring cost proportional to data |
| Error-tracking service | M1 | Hosted vendor vs self-hosted vs logs only | Hosted vendor with PII scrubbing | Free tier likely sufficient early; paid at scale (verify) |
| Transactional email provider and **sending domain** | M3 | Any provider with SPF/DKIM support | Choose after #1 (processor location) | Per-message cost, small at launch; requires the owner to control DNS for the domain |
| Google OAuth project (consent screen, verified domain) | M3 | — | Create under the owner's organisation | No direct cost; verification can take time |
| Telegram bot | M3 | — | Dedicated bot for Bandly | No direct cost |
| **If postponed** | | M1's backup copy stays on the same volume only (**not acceptable for paid launch**); M3 cannot start. The Google verification lead-time is outside engineering control, so ordering early avoids a schedule slip |

## 5. Sign-in methods and legacy-account sunset

| | |
|---|---|
| **Options** | **A.** Email one-time code + Google + Telegram. **B.** Email only. **C.** Phone/SMS code. **D.** Telegram only |
| **Recommended** | **A.** Telegram is widely used in the target region; Google covers many Android users; email gives a recovery channel independent of any platform. C adds per-message cost and SIM-swap risk |
| **Cost implications** | Email per-message cost (small). A needs the three vendor setups in #4. C adds SMS cost per login |
| **Technical consequences** | A is specified in `AUTH_SECURITY_SPEC.md`. D leaves users without recovery if they lose Telegram access |
| **Legacy sunset (sub-decision)** | Existing users keep working with their old token for **90 days** after M3 or until they attach an identity. **Option:** shorter/longer period. Users who never return after the period lose the ability to claim the account (progress remains in the database but cannot be accessed) — the owner decides whether and how long to keep such accounts claimable through support |
| **If postponed** | M3 and everything after it is blocked; the current token-only identity (and its risk of permanent loss of paid access) stays |

## 6. Age policy and adult-mode policy

| | |
|---|---|
| **Options (minimum age)** | 13, 14 or 16, possibly varying by country (law differs) |
| **Options (adult personality / mild profanity)** | **A.** Allow only for users who declare adulthood (self-declared, cannot be verified). **B.** Allow only after an identity-based age check (needs a verification vendor and processing of identity documents). **C.** Remove the mode |
| **Recommended** | Collect date of birth at sign-up; minimum age per country from configuration after legal input; **A** with an explicit adult opt-in, server-enforced restrictions for minors, and a clear statement that age is self-declared. Treat legacy users as minors for adult-only features until they provide a date of birth |
| **Cost implications** | A: none. B: per-check vendor cost and heavy privacy obligations. C: removes a marketing differentiator the owner asked for |
| **Technical consequences** | Server stores age band and enforces it in the personality engine and output filter. Any option except C carries reputational/legal exposure if a minor accesses adult content; A cannot eliminate it |
| **If postponed** | M3 cannot collect age; adult-mode features must stay disabled for everyone (including today's 18+ checkbox, which is client-side only and trivially bypassed) |

## 7. Retention, deletion and refund policy

| | |
|---|---|
| **Options** | Retention of speaking transcripts and writing submissions: 12, 24 months or until user deletion. Deletion with an active subscription: **A.** no refund, **B.** pro-rata refund, **C.** require cancellation first. Payment-record retention: statutory period (to be confirmed) |
| **Recommended** | Defaults in `AUTH_SECURITY_SPEC.md` §10; deletion with a 14-day recovery period; **C** (require cancellation, state the refund policy) to avoid disputes; payment records anonymised and kept for the legal period |
| **Cost implications** | Longer retention increases storage and compliance exposure. Refunds have direct revenue cost |
| **Technical consequences** | Determines the deletion job, anonymisation rules and the backup expiry statement in the privacy notice |
| **If postponed** | Deletion/export (a legal requirement in many jurisdictions) cannot be completed; M3 can ship the mechanics with provisional defaults, but the privacy notice cannot be published, so paid launch is blocked |

## 8. Mapping of today's three tracks and the free-tier definition

| | |
|---|---|
| **Options** | **A.** Map `exam` → Exam Preparation, `grammar` → General English, `mocks` → free Mock Arena (objective tests free), and define All Access as the union. **B.** Keep the three tracks as separate products and add the new ones later. **C.** Re-define entirely |
| **Recommended** | **A**, as it follows the master specification (Grammar belongs to General English; objective mock tests are free). Because **no payments exist** (production runs in demo mode — to be confirmed by the M1 inventory), no paying customer is affected. If the inventory finds paid subscriptions, a grandfathering rule is required first |
| **Cost implications** | Free mock tests remove a revenue line the current code assumed (mocks at a monthly price) and become an acquisition channel; cost to serve is low because grading is deterministic |
| **Technical consequences** | Defines `plan_entitlements` and what the server blocks. Pricing values stay configurable; this decision is about **which features belong to which plan**, not about prices |
| **If postponed** | M5 cannot start; M3–M4 are unaffected |

## 9. AI budget: credit allowances and global spend ceiling

| | |
|---|---|
| **Options** | Set per-plan credit allowances and daily/monthly platform spend ceilings **after** measuring real provider costs, or set conservative provisional values now |
| **Recommended** | Build M7 with configurable values and provisional **low** defaults; fix real numbers only after a controlled measurement with a real key (Phase 3), using the unit-economics formula in `AI_COST_ARCHITECTURE.md` §7 |
| **Cost implications** | The ceiling is the owner's maximum AI spend per period; too low frustrates users, too high exposes the business. Unknown until measured |
| **Technical consequences** | Allowances and ceilings are data, changeable without a deploy |
| **If postponed** | M7 is unaffected (no real provider). **The first real AI key must not be enabled until this is decided** |

## 10. Launch scope and content ownership

| | |
|---|---|
| **Options** | Roadmap D7/D8: launch with General English A1–B1 + IELTS Academic + free Mock Arena in English, Uzbek and Russian; or a different first scope. Content authoring and native-speaker review: in-house, contractors, or AI-drafted then human-reviewed |
| **Recommended** | Narrow first scope as stated; every non-English locale reviewed by a native speaker before release; never present machine-drafted translations as reviewed |
| **Cost implications** | Content and review labour is the largest cost in the project (more than engineering); a full A1–C2 curriculum plus SAT and CEFR is a multi-month content programme |
| **Technical consequences** | Fixes the curriculum schema scope and the translation workflow |
| **If postponed** | Phase 1 is unaffected. Phase 2 cannot be planned reliably |

## 11. International payment provider and legal entity

| | |
|---|---|
| **Options** | Which provider(s) for international cards in addition to Hamyon for Uzbekistan; which legal entity and country contract with them |
| **Recommended** | Decide with legal and tax advice; engineering builds the payment abstraction in Phase 7 regardless of the choice |
| **Cost implications** | Provider fees and possibly entity-setup cost; not estimated here |
| **Technical consequences** | Determines webhook formats, currencies and refund flows |
| **If postponed** | No effect on Phase 1; paid launch outside Uzbekistan cannot happen |

---

## Decisions engineering will **not** ask the owner to make
Hash algorithms, UUID versions, index design, test frameworks, framework choice for the HTTP layer (open question U-5, internal), directory layout, flag names, and the order of M6 relative to M2–M5 within the dependency graph.
