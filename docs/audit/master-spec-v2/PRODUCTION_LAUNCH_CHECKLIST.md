# Production Launch Checklist (template; every item unchecked, none verified)

A frontend build passing is **not** a launch criterion.

**Foundation:** [ ] CI green on `main` [ ] automated daily backup + successful restore drill (RTO/RPO recorded) [ ] migration rehearsed and reconciled, rollback tested (`FINAL_MIGRATION_SPEC.md`) [ ] secrets only in platform variables, none in repo (secret scan) [ ] health checks, structured logs, error tracking, alerts.
**Security/privacy:** [ ] hashed sessions, no plaintext tokens [ ] authz matrix tests [ ] webhook signature + replay tests [ ] rate limits [ ] consent records [ ] deletion/export tested, backup behaviour documented [ ] privacy notice and terms **legally reviewed** [ ] data-residency answer (OD-01) implemented.
**Product:** [ ] server-side entitlements; frontend cannot grant [ ] answer keys not in bundle or pre-submit responses [ ] Mock Arena attempts idempotent [ ] localization parity for launch locales, native-reviewed [ ] a11y and mobile checks on real devices [ ] honest unavailable states for unconfigured providers.
**AI:** [ ] ledger invariants pass; nightly audit [ ] ceilings configured, fail-closed, kill switch tested [ ] provider evaluation recorded with dates [ ] persona safety suite [ ] age policy decided (OD-06/06b) [ ] real-provider cost test within owner budget.
**Money:** [ ] reconciliation test against provider [ ] failed/expired/refund flows [ ] country prices & tax set by owner [ ] support contacts.
**Operations:** [ ] incident runbook [ ] rollback plan per release [ ] load test results [ ] owner sign-off recorded.
