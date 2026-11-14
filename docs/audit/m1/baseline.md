# M1-core baseline and acceptance record

Date: 2026-11-14 · Base commit `b51f705` (+ docs commits on branch `ccr-f38ad651-jv2w3f`) · Node v22.23.4 · sandbox, not CI.

## Baseline (before any M1 file)
| Command | Result | Time |
|---|---|---|
| `npx tsc --noEmit` | pass | 7 s |
| `npm run build` | pass (chunk-size warning only) | 10 s |
| `npm test` (24 suites) | all `OK` | 7 s |

## After M1-core
| Check | Result |
|---|---|
| `npm run test:ci` (typecheck + build + 24 suites + backup suite) | pass, 25 `OK` lines, 15 s |
| `dist/` content hash before vs after M1 files | **identical** |
| Files changed under `src/` and `server/` | **0** |

## Acceptance criteria (from `docs/audit/phase-0.2/M1_READY_CHECKLIST.md` §4)
| # | Criterion | Status |
|---|---|---|
| 4.1.1 | Snapshot of seeded DB completes, sha256 sidecar matches | **met** (`backup.test.ts`) |
| 4.1.2 | `restore-check`: integrity ok, FK check empty, counts equal source | **met** (test asserts `players` count) |
| 4.1.3 | Corrupted snapshot detected | **met** (byte flip → checksum mismatch; missing sidecar also detected) |
| 4.1.4 | Prune keeps 35 days, never deletes newest valid | **met** (test) |
| 4.1.5 | Backup while the server writes: no error, consistent | **met in-process** (20 interleaved write+snapshot cycles); under real concurrent server load **not tested** |
| 4.1.6 | Full restore drill on staging: RTO/RPO | **NOT DONE** — needs a staging copy; runbook written (`docs/runbooks/backup-restore.md`) |
| 4.2.1 | CI workflow on PR and `main`, red on failure | **written, NOT yet observed running** (first run happens when the PR is pushed; a deliberate-failure proof is still to do) |
| 4.2.2 | CI uses no secrets/provider network | met by design (read-only permissions, no secrets) |
| 4.2.3 | E2E smoke ×3 stable | **NOT DONE** — Playwright is not in `package.json`; adding it is a dependency change awaiting separate approval |
| 4.2.5 | Branch protection | owner action, not done |
| 4.3 | No behaviour change | **met** (0 src/server files, identical bundle hash) |

## Production inventory (read-only) — what is and is not known
Known from Phase 0 (Railway API, read-only): service `bandly`, 1 replica, region sfo, volume `bandly-data` 5000 MB at `/data`, `DB_PATH=/data/bandly.sqlite` per Dockerfile, startup `AI: none, TTS: none, To'lov: yo'q (demo)`, 71 requests/24 h, 0 5xx. **Not known:** row counts (players/payments/subscriptions), `ADMIN_TOKEN` set or not, whether the DB file is really on the volume, existing backups (none known). No new Railway call was made in this step.

## Production inventory addendum (2026-11-14, Railway API, read-only, variable NAMES only; values redacted by the API)
- Project `bandly`, environment `production`, service `bandly`, latest deployment `eb3e9d61` SUCCESS, volume `bandly-data` 5000 MB at `/data` (sfo).
- Variables present: `DB_PATH`, `HOST`, `NODE_ENV`, `TRUST_PROXY` + Railway system variables.
- **Absent:** `ADMIN_TOKEN`, `HAMYON_*`, `AI_*`, `TTS_*`, `PRICE_*` → admin endpoints have no token configured (behaviour when unset: see `server/index.ts`), no payment/AI/TTS keys, default prices in use. This supports "demo mode, no real payments".
- Still unknown: the **value** of `DB_PATH` (redacted; Dockerfile default is `/data/bandly.sqlite`), row counts, existing backups.

## CI first run
**Cause confirmed by the owner's screenshot (run #8):** "The job was not started because your account is locked due to a billing issue." The workflow never ran; this is a GitHub account billing lock, not a code or workflow error. Fix: owner resolves billing in GitHub Settings → Billing and plans, then re-runs the jobs. Original note: run 43598572525 on PR #22 **failed in ~2 s with no downloadable logs (HTTP 404)**. A failure that fast with no steps usually means the job never started its steps (e.g., Actions restrictions/billing on the account or repository), but the cause is **unverified**. Owner can open https://github.com/Sofsavdo/Bandly/actions/runs/43598572525 to read the reason. The same command (`npm run test:ci`) passes locally.

## Not done on purpose
No production snapshot (approval A5 not given), no Railway change, no dependency install, no cron/scheduling.

## Rollback
`docs/runbooks/m1-rollback.md`.
