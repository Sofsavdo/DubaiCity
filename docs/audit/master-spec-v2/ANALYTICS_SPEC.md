# Analytics Spec

Rule: metrics derive only from stored events and ledgers; no invented numbers. Processors/regions follow OD-01. Event payloads contain ids, never raw text/audio.

## 1. Event model [R]
`events(id, at, user_id|anon_id, session_id, name, product, props jsonb, country, app_version)`; names are a closed list (`signup`, `onboarding_done`, `placement_done`, `lesson_done`, `mock_started`, `mock_submitted`, `speaking_session_started/ended`, `ai_call`, `subscription_started/renewed/cancelled`, `referral_signup`, …). Consent flag stored per user (OD-07).

## 2. Definitions
Active = at least one **learning event** (lesson_done, practice answered, mock submitted, speaking session ≥ 1 min) on the local day (user time zone).

| Area | Metric | Definition / formula |
|---|---|---|
| Acquisition | Visitors | distinct `anon_id` with a page view |
| | Signup rate | signups / visitors (same cohort week) |
| | Activation | signups with `placement_done` and first `lesson_done` within 7 days / signups [definition pending owner] |
| | Referral conversion | referral signups that activate / referral signups |
| | SEO / creator traffic | visitors by `utm_source`/referral code |
| Engagement | DAU / WAU / MAU | distinct active users per day / 7 days / 30 days |
| | Stickiness | DAU / MAU |
| | Sessions, lessons, speaking minutes, mock attempts | counts/sums from events |
| | Retention D1/D7/D30 | users active on day N after signup / signups (cohort) |
| Learning | Mastery gain | mean change in `m_eff` of targeted nodes after 14 days |
| | Error reduction | rate of taxonomy id X in last 20 items vs previous 20 |
| | Level progression | share of users advancing one CEFR-aligned level per quarter |
| | Mock improvement | score of attempt n+1 − attempt n, same exam type |
| Monetization | Free→paid | users starting a paid plan within 30 days of signup / signups |
| | MRR | Σ monthly-normalized active subscription price (country currency converted by a stored rate, stated) |
| | ARPU | MRR / active users (and ARPPU = MRR / paying users) |
| | Churn | subscriptions ended in month / subscriptions active at month start |
| | Renewal rate | renewed / due for renewal |
| | AI cost per user | Σ `credit_ledger`/usage `est_cost_micro_usd` / active users |
| | Gross margin | (revenue − AI cost − payment fees − infra) / revenue; infra allocation method **[U]** |
| Creator | Verified views, submitted videos | from `view_claims` (verified only) |
| | Creator ROI | (revenue from attributed paid users) / reward cost |

## 3. Quality rules
Backfill-safe (events idempotent by id); metrics recomputable from raw events; each dashboard tile shows definition and data freshness; no sampling without label; PII-free exports; admin-only access (ADMIN_CMS_SPEC). A tile with no data shows "no data", not 0 or demo values.

## Acquisition efficiency (source C2 §10.1)
Registration CAC = marketing spend / registrations; paid CAC = spend / new paying users; LTV = average monthly contribution × expected lifetime in months (from observed churn); payback = paid CAC / monthly contribution. Campaign success is judged by CAC, LTV and payback, not by views or registrations.
