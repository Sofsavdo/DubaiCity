# BANDLY — Technical Architecture

Part 1 describes the system as it is at commit `b51f705`. Part 2 proposes the target. Decisions marked **(needs approval)** are recommendations, not commitments.

## Part 1 — Current architecture

```
Browser (React SPA, hash routes)                Railway service "bandly" (1 replica, sfo)
┌───────────────────────────────────┐           ┌────────────────────────────────────────┐
│ 21 routes, 41 components          │  HTTPS    │ Node 22, plain `http` server (tsx)     │
│ All content compiled into bundle  │──────────▶│  /api/*  JSON endpoints                │
│ State: localStorage (11 keys)     │           │  static files from dist/ (+ Range)     │
│ Speech: Web Speech API            │           │  SQLite file on volume /data (5 GB)    │
└───────────────────────────────────┘           └───────────────┬────────────────────────┘
                                                                │ optional, not configured
                                              AI (Anthropic/OpenAI/Gemini) · Azure TTS · Hamyon
```

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18.3, TypeScript 5.6, Vite 5.4, lucide-react, self-hosted fonts | No router, state or UI library; ~8 000 lines |
| Styling | One `styles.css` with CSS custom properties, dark mode | A token set exists; no component library |
| Backend | Node 22 `http`, `node:sqlite`, run through `tsx` | ~950 lines, no framework, no ORM |
| Database | SQLite: `players, xp_log, ai_usage, payments, subscriptions, duels, duel_players` | No migrations |
| Auth | Nickname + random token in `localStorage` | No sessions, no recovery |
| Tests | 25 script-style suites (`tsx file.test.ts`) | No runner, no CI |
| Deploy | Dockerfile, Railway auto-deploy from `main`, volume at `/data` | Healthy; 0 5xx in 24 h |

**API surface (all under `/api`)**: `join`, `sync`, `leaderboard`, `duel/create`, `duel/:code` (GET, POST), `ai/status`, `ai/followup`, `ai/speaking`, `ai/writing`, `tts/status`, `tts`, `pay/config`, `pay/create`, `pay/status/:id`, `pay/cancel/:id`, `pay/hamyon/prepare`, `pay/hamyon/complete`, `me`, `admin/payments`, `admin/grant`, `health`.

**Strengths worth keeping**

- Pure, well-tested domain logic separated from UI: `lib/game.ts`, `srs.ts`, `grade.ts`, `band.ts`, `placement.ts`, `practice.ts`, `grammarCheck.ts`, `writingCheck.ts`, `shadow.ts`, `progress.ts`, `examiner.ts`.
- Idempotent payment state machine with reconciliation (`server/payments.ts`).
- Content integrity enforced by tests (unique ids, answers present in passages, model answers pass their own checkers).
- Zero-runtime-cost English audio pipeline.

**Structural weaknesses** (details in `PRODUCT_AUDIT.md`): browser-only learner data (C1), client-side entitlements with public content (C2), no accounts (C3), single-vendor-shaped AI code (H5), no migrations (H7).

## Part 2 — Target architecture

### Principles

1. **Evolve, do not rebuild.** Keep React, TypeScript, Vite, the domain libraries, the mascot and the design tokens.
2. **The server becomes the source of truth** for identity, entitlements, learner state and anything paid.
3. **Deterministic first.** Objective scoring, scheduling and plan rules stay as plain code. AI is used only for subjective evaluation and conversation.
4. **Every external vendor sits behind an interface** and can be absent; absence produces an explicit "unavailable" state.
5. **Small, reversible steps** that keep Railway deployment working throughout.

### Component view

```
Web client (React SPA, path routes, lazy-loaded by product)
        │  REST + (later) WebSocket for realtime voice
API service (Node 22, TypeScript)
 ├─ auth            sessions, identities, age band
 ├─ catalog         products, plans, prices by region (config, not code)
 ├─ entitlements    what a user may access, usage limits, AI credits
 ├─ curriculum      levels → modules → lessons → exercises (read-only content API)
 ├─ learning        attempts, mastery, error history, SRS, plan generation
 ├─ assessment      diagnostic, mock exams, deterministic scoring
 ├─ ai-gateway      LLM / STT / TTS / Realtime / WritingEvaluation providers, metering
 ├─ billing         payment-provider abstraction, webhooks, billing history
 ├─ gamification    XP ledger, missions, achievements, league, duels
 └─ admin           content import, grants, cost reports
PostgreSQL (Railway)      Object storage for audio (Railway bucket or S3-compatible)
```

### Key decisions

| # | Decision | Recommendation | Why | Alternative |
|---|---|---|---|---|
| A1 | Database **(needs approval)** | Move to **PostgreSQL** on Railway | Concurrent writes, backups, multiple replicas, real migrations; SQLite on one volume cannot scale and `node:sqlite` is experimental | Stay on SQLite with a migration runner and nightly file backups — cheaper now, re-migration later |
| A2 | Data access | Typed query layer with a migration tool (Drizzle or Kysely + SQL migrations) | Typed code, reviewable SQL, rollback files | Prisma — heavier runtime, slower cold start |
| A3 | Server framework | Introduce a small router with schema validation (Fastify + zod) incrementally, route by route | Current hand-written `if` chain will not scale to ~80 endpoints; validation and rate limits become declarative | Keep plain `http` with a home-made router |
| A4 | Accounts **(needs approval)** | Email one-time code as the base method; add Google and Telegram login; keep existing tokens valid and let users attach an email | No passwords to store; Telegram is dominant in Central Asia | Phone/SMS codes — costs per message and needs an SMS vendor |
| A5 | Content delivery | Move content out of the bundle into the database; serve lessons and tests through an entitlement-checked API; never send answer keys before submission for graded tests | Fixes C2, shrinks the bundle, enables content updates without deploys | Keep content in code but split bundles — does not fix C2 |
| A6 | Routing | Path-based routes with code splitting per product; server returns `index.html` for app paths | SEO, shareable links, smaller first load | Keep hash routes |
| A7 | Localization | Message catalogs per locale for UI; content explanations stored per locale in the database (`*_translations` tables); English as the fallback | Adding a language becomes data entry, not refactoring | Single JSON per locale including content — unmanageable at curriculum size |
| A8 | Learner state sync | Server-authoritative with an optimistic local cache; one-time import of existing `localStorage` data after sign-in | Preserves current users' progress | Start everyone from zero — breaks rule 14 |
| A9 | AI access | One `ai-gateway` module exposing five interfaces (see `AI_COST_ARCHITECTURE.md`); the rest of the code never imports a vendor SDK | Provider replacement without touching business logic | Call vendors directly from features |
| A10 | Audio assets | Move generated audio to object storage with a CDN; keep generation scripts in `tools/` | Removes 13 MB (and growing) from git and the image | Keep in repo |
| A11 | Region **(needs approval)** | Move the service and database to a European region | Lower latency for Central Asia than US West | Stay in `sfo` |
| A12 | Quality gates | GitHub Actions: typecheck, unit tests, build, Playwright smoke on every PR | Currently nothing runs automatically | Manual testing |

### Module boundaries on the client

```
src/
  app/            routing, layout, providers (auth, i18n, entitlements)
  design/         tokens, primitives (Button, Card, Field, Dialog, Chart), mascot
  features/
    general-english/   exam-prep/   mock-arena/   speaking/   writing/   games/   account/   billing/
  domain/         pure logic (existing lib/*.ts, unchanged where possible)
  api/            typed client for the API service
  i18n/           catalogs and helpers
```

Business logic stays in `domain/` and on the server; components only render and dispatch.

### Design system

Keep the existing tokens (`--brand`, radii, shadows, Unbounded + Inter) and the Bandi mascot. Extract the repeated patterns that already exist in `styles.css` into primitives: `Button`, `Card`, `Pill`, `Field`, `Tabs`, `Dialog`, `Progress`, `Stat`, `EmptyState`, `ErrorState`, `Skeleton`. Add focus management, a 44 px minimum tap target and a documented spacing scale. No visual redesign is proposed.

### Security architecture

- Session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`) instead of tokens in `localStorage`; token-based API access kept only for migration.
- Authorization on every content and AI endpoint through one `requireEntitlement(product, feature)` guard.
- Rate limits per user and per route, stored in the database or Redis.
- Webhook endpoints: signature verification, idempotency keys, replay window (the Hamyon implementation already follows this pattern).
- CSP, HSTS, `frame-ancestors 'none'`.
- Nightly database backups with a tested restore.
- Structured logs and an error tracker.

### Deployment

Railway remains the platform. Target layout: `api` service (2 replicas once Postgres is in place), `postgres`, object storage for audio. Migrations run as a release step before the new version receives traffic. Each phase ships behind feature flags so `main` stays deployable.
