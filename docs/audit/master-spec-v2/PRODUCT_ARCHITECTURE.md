# Product Architecture

Product boundaries, shared intelligence layer, module map and navigation. Detailed topics live in their own specs (see `MASTER_PRODUCT_SPEC.md`). Section **Country configuration** below is the data model for multi-country rollout.

## Three products and one intelligence layer

```
General English ─┐
Exam Preparation ┼─▶ Shared learner profile + Adaptive Learning Intelligence ─▶ AI Gateway / Voice Gateway / Credit ledger
Mock Arena ──────┘
```

| Module (modular monolith, no microservices) | Responsibility | Today (verified) | Spec |
|---|---|---|---|
| Identity & User | accounts, sessions, roles, age band | token-only `players` | `docs/audit/phase-0.1/AUTH_SECURITY_SPEC.md` |
| Curriculum | levels, units, lessons, graph | flat content files | `GENERAL_ENGLISH_CURRICULUM.md` |
| Assessment | placement, skill tests, attempts, scoring | client-side grading | `MOCK_ARENA_SPEC.md`, `EXAM_PREPARATION_SPEC.md` |
| Adaptive | profile, taxonomy, mastery, plan | none | `ADAPTIVE_LEARNING_SPEC.md` |
| AI / Voice Gateway | providers, personalities, metering | optional single-vendor adapters | `AI_PERSONALITY_ENGINE_SPEC.md`, `VOICE_ENGINE_SPEC.md` |
| Credits | ledger, ceilings | none | `docs/audit/phase-0.2/FINAL_AI_CREDIT_SPEC.md` |
| Billing & Entitlements | plans, country prices, webhooks | demo mode | `MONETIZATION_SPEC.md` |
| Gamification & Social | XP, streaks, duels | exists, client-trusting | `FEATURE_INVENTORY.md` |
| Localization | catalogue, settings | skeleton | `MULTILINGUAL_ARCHITECTURE.md` |
| Creator | referrals, rewards | none | `CREATOR_PROGRAM_SPEC.md` |
| Admin/CMS | roles, content lifecycle | token endpoints | `ADMIN_CMS_SPEC.md` |
| Analytics | events, metrics | none | `ANALYTICS_SPEC.md` |

Principles: keep the existing React/TypeScript + Node stack until `docs/audit/phase-0.2` gates (M1, OD-01/02) say otherwise; provider-agnostic interfaces for every external service; server is authoritative for entitlements, XP, scores and credits; General English level and exam readiness are separate stored measures.

## Country configuration

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

```sql
CREATE TABLE app.countries (
  code text PRIMARY KEY,                 -- ISO 3166-1 alpha-2: UZ, KZ, KG, TJ, TM
  enabled boolean NOT NULL DEFAULT false,
  default_interface_lang text NOT NULL,
  default_explanation_lang text NOT NULL,
  currency text NOT NULL,                -- ISO 4217
  timezone_default text NOT NULL,        -- IANA
  min_age int,                           -- NULL until legal input (OD-06)
  data_region text,                      -- NULL until OD-01
  terms_version text, privacy_version text,
  support_contact jsonb
);
CREATE TABLE app.country_prices (country text REFERENCES app.countries, plan_id text, period text,
  amount_minor bigint NOT NULL, valid_from timestamptz NOT NULL, valid_to timestamptz,
  PRIMARY KEY (country, plan_id, period, valid_from));
CREATE TABLE app.country_payment_methods (country text, provider text, enabled boolean, config_ref text,
  PRIMARY KEY (country, provider));
CREATE TABLE app.country_features (country text, feature text, enabled boolean, PRIMARY KEY (country, feature));
CREATE TABLE app.country_exam_formats (country text, exam text, format_id text, source_note text, verified_at date,
  PRIMARY KEY (country, exam, format_id));
```
Country is determined by user choice confirmed at sign-up (not IP alone). All values are data; **no price or legal value is supplied here**. Missing config ⇒ feature disabled (fail closed).
