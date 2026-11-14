# Monetization Spec

Legend: **[H]** owner hypothesis (not approved) · **[R]** recommendation · **[U]** unresolved. **No price below is final; none may be hard-coded.**

## 1. Plan hypotheses [H]
| Plan | Hypothesis | Contents (owner text) |
|---|---|---|
| FREE | $0 | General English starter exercises, free Reading/Listening mocks, test bank, limited AI, basic progress |
| GENERAL ENGLISH | $5.99/mo | A1–C2, grammar, vocabulary, reading, listening, speaking, writing, pronunciation, AI conversation, personal plan, games/revision |
| EXAM PREPARATION | $7.99/mo | IELTS, CEFR, SAT, AI Speaking, Writing evaluation, exam plan, advanced analytics |
| ALL ACCESS | $9.99/mo | everything above + AI Voice Coach, higher AI credits |

**Rules:** no unlimited-AI plan (owner text); AI allowance is credits, set per plan and country (OD-09). Grammar is not sold separately (DR-01).

## 2. Data model [R]
```sql
CREATE TABLE app.plans (id text PRIMARY KEY, name_key text NOT NULL, active boolean NOT NULL DEFAULT true);
CREATE TABLE app.plan_entitlements (plan_id text REFERENCES app.plans, feature text, limit_value bigint, PRIMARY KEY (plan_id, feature));
CREATE TABLE app.country_prices (...)            -- see PRODUCT_ARCHITECTURE.md; amount_minor + currency per country/period, versioned
CREATE TABLE app.subscriptions (id uuid PRIMARY KEY, user_id uuid, plan_id text, country text, state text,
  current_period_end timestamptz, provider text, provider_ref text, UNIQUE (provider, provider_ref));
CREATE TABLE app.plan_credit_allowances (plan_id text, country text, monthly_credits bigint, daily_free_credits bigint, PRIMARY KEY (plan_id, country));
CREATE TABLE app.tax_settings (country text PRIMARY KEY, mode text, rate_bp int, note text);  -- values: owner/legal [U]
```
USD is a reference price only; the charged amount is the country row. Annual billing, promo codes, trials and discounts are rows too (**[U]** approval per country).

## 3. Entitlement flow
Server derives entitlements from `subscriptions` state (`active|grace|expired|cancelled|refunded`) → `requireEntitlement(feature)` on every protected API; the frontend only displays. Mapping of the three legacy tracks: OD-08.

## 4. Payments
Provider abstraction `PaymentProvider {createCheckout, verifyWebhook, parseEvent, refund}`; Hamyon (UZ) existing adapter is `BACKEND ONLY` / unproven. Webhooks: durable inbox, signature check, idempotent apply, reconciliation (`FINAL_MIGRATION_SPEC.md` §6). Failed payment → `grace` period length **[U]**; expiry and cancellation jobs; refunds recorded in an append-only table; admin refunds require reason (ADMIN_CMS_SPEC). The frontend success screen never grants access.

## 5. Economics guardrails
- Per user per month: AI cost (ledger) must stay under a **gross-margin target the owner sets [U]**; dashboards show cost per plan/country (`ANALYTICS_SPEC.md`).
- Mock Arena free tier has **infrastructure** cost (server, storage, bandwidth) even with zero AI cost (owner text); measured, not assumed.
- Provider prices live in `provider_prices` with source notes; every number `UNVERIFIED` until sourced.

## 6. Open owner decisions
OD-08 (plan ↔ feature mapping), OD-09 (credits, ceilings), OD-11 (international provider/entity), OD-04 (Hamyon shop for Bandly), new OD-12 (tax settings per country), OD-13 (trial/promo policy).
