# M1 READY CHECKLIST (Phase 0.2)

M1 = "Safety, CI, backups and recovery". **M1 must not change any existing product behaviour** (no route, API, UI, DB schema, payment or auth change). It adds files and automation around the product only.
Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved.

## 0. Verdict

- **M1-core is ready to start** once the owner gives the approvals in §1.1.
- **M1-offsite (off-volume backup copy)** is **not** ready: it needs OD-01 (location) and OD-04 (storage account).
- Nothing in M1 needs an AI/TTS/payment key.

## 1. Exact owner inputs

### 1.1 Required to start M1-core
| # | Input | Form |
|---|---|---|
| A1 | Written approval "start M1-core" | chat message |
| A2 | Approval to add GitHub Actions workflow files to the repo | chat message |
| A3 | Confirmation the repo to use is `Sofsavdo/Bandly` (local remote still `Sofsavdo/DubaiCity`) | chat message |
| A4 | Approval for **read-only** production inventory via Railway (status, variables *names* only, logs, volume size) | chat message |
| A5 | Approval for one extra Railway volume snapshot/backup action **or** an explicit "no production changes in M1" (then the restore drill uses a copy exported by owner) | chat message |

### 1.2 Required only for M1-offsite
OD-01 answer (legal), OD-04 storage account and credentials entered **by the owner into Railway variables** (never in chat).

## 2. Files and modules (all new; none edit existing behaviour) [R]

| Path | Purpose |
|---|---|
| `.github/workflows/ci.yml` | `npm ci`, typecheck, build, the 24-command test chain; fails on any red |
| `.github/workflows/e2e.yml` | Playwright smoke (pre-installed Chromium locally; CI installs per workflow) |
| `scripts/backup/snapshot.ts` | `VACUUM INTO` → timestamped file → sha256 sidecar → retention prune (35 days) |
| `scripts/backup/restore-check.ts` | restores snapshot to temp path, runs `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, row-count comparison |
| `scripts/inventory/prod-inventory.md` | checklist template filled by hand/read-only tools (§6) |
| `e2e/smoke.spec.ts` | loads app, placement flow start, practice start, saves/loads localStorage key set, `/api/health` |
| `docs/runbooks/backup-restore.md`, `docs/runbooks/m1-rollback.md` | operator steps |
| `package.json` (scripts only: `test:ci`, `backup`, `restore:check`, `e2e`) | **dev-dependency additions need separate explicit approval** (see §5) |

Backup trigger must **not** add a code path in the request handlers. Scheduling is an external Railway cron service/command run against the same volume **[U]** (feasibility to verify during M1; alternative: owner-run manual command).

## 3. Commands (acceptance runs)

```
npm ci
npx tsc --noEmit
npm run build
npm test                         # existing 24-command chain, unchanged result
npm run backup                   # snapshot of a local/test DB
npm run restore:check -- <file>
npx playwright test e2e/smoke.spec.ts --trace off
```
Expected baseline: all commands green on `main` **before** any M1 file is added (re-verified as first M1 step).

## 4. Acceptance criteria

### 4.1 Backup / restore
1. Snapshot of a seeded test DB completes; sha256 sidecar matches.
2. `restore-check` on the snapshot: `integrity_check = ok`, `foreign_key_check` empty, per-table counts equal source.
3. Corrupt a snapshot byte → `restore-check` fails (negative test).
4. Retention prune keeps 35 days, never deletes the newest valid snapshot.
5. Backup runs while the server writes (load script): no server error, snapshot consistent.
6. Full drill on a staging copy: stop → restore → start → `/api/health` OK → data identical; measured **RTO** and **RPO** recorded in the runbook.
7. Deletion-log re-apply test is **not** in M1 (no deletion feature yet) — recorded as M3 criterion.

### 4.2 CI / E2E
1. Workflow runs on pull requests and on `main`; red on a deliberately failing test (proved once on a throw-away branch, then removed).
2. Workflow uses no secrets; no network calls to providers.
3. E2E smoke passes headless; stable on 3 consecutive runs (no flake).
4. Total CI time reported; target ≤ 10 min **[R]**.
5. Branch protection requiring CI is an **owner** action (recommended; owner approves).

### 4.3 No behaviour change
`git diff --stat` between pre-M1 `main` and M1 branch shows **no changes** under `src/` and `server/`; the built bundle hash may differ only if the build embeds nothing from new files (check: identical `dist/assets/*.js` content hash). Existing suites' output identical.

## 5. Explicit list: actions that MUST NOT happen in M1

- No edit to `src/**` or `server/**`.
- No schema change, no migration, no PostgreSQL provisioning.
- No add of `token_hash` column (that is M2a).
- No deploy, no Railway variable/volume/service/domain change, no restart of production.
- No write to the production database or volume (only owner-approved read-only inventory; any snapshot action only per A5).
- No dependency install **unless separately approved** (Playwright test runner, if not already in `package.json`, is a dev dependency requiring approval; Chromium is pre-installed locally).
- No off-volume copy of personal data before OD-01.
- No real AI/TTS/payment keys, no secrets in repo, logs or chat.
- No auth, entitlement, credit, i18n or content changes.
- No copying of third-party copyrighted material.

## 6. Production inventory checklist (read-only) [F]/[U]

| Item | How | Result goes to |
|---|---|---|
| Service status, replicas, region, deploy commit | Railway status | inventory.md |
| Volume present, size, mount path `/data` | Railway describe | inventory.md |
| `DB_PATH` effective value and file actually on volume | variables list (name/value of non-secret only) + boot log | inventory.md **[U] until checked** |
| Variable **names** present (`ADMIN_TOKEN`, `HAMYON_*`, `AI_*`, `TTS_*`) — never values | list variables, names only | inventory.md |
| Row counts: players, payments, subscriptions, xp_log, ai_usage, duels | owner-run read-only query on a copy, or counts via admin stats if enabled | inventory.md **[U]** |
| Any paid subscription / completed payment? (decides OD-08 grandfathering) | counts above | OD-08 |
| Last 7-day error logs, 5xx count | Railway logs | inventory.md |
| Current backup situation | none known [F] | inventory.md |

## 7. M1 rollback

M1 adds only files and workflows. Rollback = `git revert` of the M1 merge commit (or closing the PR). No production state to undo. If a snapshot was created under A5, deleting it is optional and loses nothing. Expected time: minutes. Verified by dry-run: revert on a branch, rerun the existing 24-command chain → identical to baseline.

## 8. Dependency on later work

M1-core output (restorable snapshots, green CI) is a hard prerequisite for M2a. M1 does **not** unblock OD-01/OD-02; those gate M2a.

## 9. Exact first implementation action (when approved)

On branch `ccr-f38ad651-jv2w3f` (or a new branch the owner names), run the baseline: `npm ci && npx tsc --noEmit && npm run build && npm test` on current `main`, record pass/fail and timings in `docs/audit/m1/baseline.md`. No other change before this baseline is recorded.
