# Security and Privacy Spec (consolidation)

Authoritative detail stays in existing documents; this file lists the owner-text requirements, where each is specified, and what is new. **Nothing here is a legal conclusion; legal items are LEGAL REVIEW / OWNER DECISION.**

| Requirement (owner text) | Where specified | Status |
|---|---|---|
| Secure authentication, sessions, RBAC | `docs/audit/phase-0.1/AUTH_SECURITY_SPEC.md`; roles in `ADMIN_CMS_SPEC.md` | designed, unbuilt |
| Legacy plaintext tokens | `docs/audit/phase-0.2/FINAL_MIGRATION_SPEC.md` §2 | designed |
| Input validation, API rate limits | AUTH_SECURITY_SPEC; today a hand-written 120/min limiter **[F]** | partial |
| **Prompt-injection protection** | `AI_PERSONALITY_ENGINE_SPEC.md` (update) + tests in `TEST_STRATEGY.md` | **new** |
| Secrets management | keys only in Railway variables, never client/chat; ProviderConfig stores references | designed |
| Payment security, webhook verification | `MONETIZATION_SPEC.md`, FINAL_MIGRATION §6 | designed |
| Audio/transcript retention | default no raw audio; transcripts per OD-07 (`VOICE_ENGINE_SPEC.md`) | **OWNER DECISION** |
| Account deletion, backups | `docs/audit/phase-0.2/FINAL_ARCHITECTURE_SPEC.md` §6 | designed; periods **LEGAL REVIEW** |
| Consent management | consent records per purpose (terms, privacy, analytics, audio storage), versioned, timestamped | **new**, wording **LEGAL REVIEW** |
| Age verification / minor-safe personalities | AI_PERSONALITY_ENGINE_SPEC; OD-06 (+06b) | **OWNER DECISION + LEGAL REVIEW** |
| Data residency | OD-01, FINAL_ARCHITECTURE §4 | **LEGAL REVIEW** |

## New items
1. **Consent table** `app.consents(user_id, purpose, version, granted bool, at, source)`; append-only; analytics and audio storage default off until granted.
2. **AI safety layer:** server-side persona prompts, input treated as data, output filter, per-session length limits, logging of safety-filter hits (no raw audio), human-review queue for reported replies.
3. **Admin security:** MFA recommended, separate path, audit log (ADMIN_CMS_SPEC).
4. **Data classification:** public content · learner data · sensitive (audio, age, payments) · secrets; each class has storage, retention and access rules.
5. **Security tests:** authz matrix tests, token never in logs, CSRF/origin tests, injection strings, webhook replay, rate-limit tests (`TEST_STRATEGY.md`).
