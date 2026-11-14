# Admin and CMS Spec

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

**Roles:** `owner`, `admin`, `content_editor`, `content_reviewer`, `translator`, `support`, `finance`, `analyst` (read-only). Permissions are explicit per role on resource+action (RBAC table); no public admin endpoint; admin on a separate path with session + role check, MFA recommended **[R]**; today's `/api/admin/*` with a shared `ADMIN_TOKEN` is replaced.
**Content lifecycle:** `draft → in_review → approved → published → archived`; publish requires a role different from the author; AI-generated content enters as `draft` with `origin='ai'`; each version immutable with diff; rollback = republish an earlier version.
**Audit:** append-only `admin_audit(actor, role, action, resource, before, after, ip, at)`; payment/credit adjustments require reason text; audit rows cannot be updated or deleted by application roles.
**Managed resources:** users, subscriptions, payments, credits, curriculum, lessons, vocabulary, question bank, mock tests, translations, personalities, provider config (secrets referenced, never displayed), creator campaigns, rewards, reports, support cases.
