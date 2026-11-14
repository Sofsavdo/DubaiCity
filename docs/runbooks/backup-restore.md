# Runbook — backup and restore (SQLite, current production design)

Scope: M1. Backups live **on the same Railway volume** unless `BACKUP_DIR` points elsewhere; a same-volume copy does **not** protect against volume loss. An off-volume copy waits for owner decisions OD-01 and OD-04 (`docs/audit/phase-0.2/OWNER_DECISION_REGISTER.md`). Do not copy personal data off the volume before then.

## Take a snapshot (never modifies the live DB)
```
DB_PATH=/data/bandly.sqlite npm run backup          # writes /data/backups/bandly-<UTC>.sqlite + .sha256, verifies it, prunes >35 days (never the newest valid one)
npm run backup -- --src <db> --out <dir> --keep-days 35
```
Exit code 1 means the snapshot failed verification — treat the backup as not taken.

## Verify
```
npm run restore:check -- /data/backups/bandly-<UTC>.sqlite [--source /data/bandly.sqlite]
```
Checks checksum, `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, prints per-table counts.

## Restore (drill on staging first; production restore needs owner approval)
1. Announce write freeze; stop the service (writes must stop).
2. `restore:check` the chosen snapshot.
3. Keep the damaged file: `mv /data/bandly.sqlite /data/bandly.sqlite.damaged-<UTC>`.
4. `cp <snapshot> /data/bandly.sqlite` (remove stale `-wal`/`-shm` files if present; journal mode is `delete`).
5. Start the service; `GET /api/health`; compare counts with `restore:check` output.
6. Record RTO (minutes from step 1 to 5) and RPO (snapshot age) in `docs/audit/m1/baseline.md`.

## Scheduling [U]
Whether a Railway cron/second service can run `npm run backup` against the same volume is **unverified** (a volume attaches to one service). Until verified, run manually and record the date. Do not change Railway settings without owner approval.
