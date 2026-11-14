# Runbook — M1 rollback
M1 adds only: `.github/workflows/ci.yml`, `scripts/backup/*`, `docs/runbooks/*`, `docs/audit/m1/*`, and four `package.json` scripts (`backup`, `restore:check`, `test:backup`, `test:ci`). No file under `src/` or `server/` is modified, no schema, no Railway change.
Rollback = `git revert <M1 commit(s)>` (or close the PR). Production is unaffected either way. Verify afterwards: `npm run build && npm test` equals the baseline in `docs/audit/m1/baseline.md`.
