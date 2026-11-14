# Test Strategy

**Baseline [F]:** 24 `tsx` suites in `npm test` (pure logic, server with fake providers, i18n); no CI, no E2E, no DB-migration tests, no real-provider tests, no device tests. Everything below is planned; none is run.

## 1. Layers and tools
| Layer | Scope | Tool (existing unless noted) | Gate |
|---|---|---|---|
| Unit | scoring, mastery, SRS, recommendation, formatting | `tsx` suites (keep style) | CI, every PR |
| Integration/API | endpoints, auth, entitlements, idempotency | `tsx` + test DB | CI |
| Database | constraints, ledger invariants (C-01…C-23), migration reconcile (C-M01…C-M12) | PG test container **[U — new dependency needs approval]** | CI from M2a |
| Provider contract | AI/STT/TTS/payment adapters against recorded fakes; live check only on owner approval | fakes | CI; live = manual |
| E2E | signup, placement, lesson, mock test, subscribe (sandbox), settings | Playwright (pre-installed browser) | CI smoke from M1, full nightly |
| Responsive | 360/768/1280 screenshots, overflow, tap targets | Playwright | CI |
| Accessibility | axe checks, keyboard path, contrast | axe via Playwright **[U dependency]** | CI |
| Security | authz matrix, token never logged, CSRF/origin, rate limits, webhook replay/signature, prompt-injection strings, answer-key leakage | custom + review | CI + pre-launch |
| Load | Mock Arena start/submit, AI gateway under ceiling | k6 or equivalent **[U]** | pre-launch |
| Content | curriculum graph acyclic, taxonomy coverage, question schema, duplicate/licence fields, translation parity | `tsx` | CI |

## 2. Required scenario list (owner text mapped)
registration · login · session expiry · language switching (4 settings) · placement · lesson completion · progress persistence · vocabulary review · AI session start/stop · AI provider failure · credit reservation/settlement · duplicate request · mock completion · objective scoring · IELTS Writing submission · subscription activation · webhook duplication · subscription expiry · user deletion · mobile navigation · data restoration.

## 3. Definitions of done
A feature is complete only when: unit+integration tests pass in CI; an E2E path covers it; responsive and accessibility checks pass; security tests relevant to it pass; docs updated; no hard-coded text; rollback noted. "Screen renders" is never sufficient.

## 4. Adaptive/AI-specific
Mastery property tests (`ADAPTIVE_LEARNING_SPEC.md`), deterministic plan snapshots, personality safety suite (protected-attribute prompts, minor profile, exam-mode no-roast), injection suite, cost tests with fake providers (no real spend).
