import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

export const sha256File = (p: string): string => createHash('sha256').update(readFileSync(p)).digest('hex');

const TS = /^bandly-(\d{8}T\d{6}Z)\.sqlite$/;
export const stamp = (d = new Date()): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

/** Consistent snapshot of a live SQLite file using VACUUM INTO (never writes to the source). */
export function snapshot(srcPath: string, outDir: string, now = new Date()): { file: string; sha256: string; bytes: number } {
  if (!existsSync(srcPath)) throw new Error(`source database not found: ${srcPath}`);
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `bandly-${stamp(now)}.sqlite`);
  if (existsSync(file)) throw new Error(`snapshot already exists: ${file}`);
  const src = new DatabaseSync(srcPath, { readOnly: true });
  try { src.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`); } finally { src.close(); }
  const sha256 = sha256File(file);
  writeFileSync(`${file}.sha256`, `${sha256}  ${basename(file)}\n`);
  return { file, sha256, bytes: statSync(file).size };
}

export interface CheckResult { ok: boolean; problems: string[]; counts: Record<string, number> }

/** Verifies a snapshot: checksum sidecar, integrity_check, foreign_key_check, per-table row counts. */
export function checkSnapshot(file: string): CheckResult {
  const problems: string[] = [];
  const counts: Record<string, number> = {};
  const side = `${file}.sha256`;
  if (existsSync(side)) {
    const want = readFileSync(side, 'utf8').split(/\s+/)[0];
    if (want !== sha256File(file)) problems.push('checksum mismatch');
  } else problems.push('missing .sha256 sidecar');
  let db: DatabaseSync | null = null;
  try {
    db = new DatabaseSync(file, { readOnly: true });
    const ic = db.prepare('PRAGMA integrity_check').all() as { integrity_check: string }[];
    if (!(ic.length === 1 && ic[0]!.integrity_check === 'ok')) problems.push(`integrity_check: ${ic.map((r) => r.integrity_check).join('; ')}`);
    const fk = db.prepare('PRAGMA foreign_key_check').all();
    if (fk.length) problems.push(`foreign_key_check: ${fk.length} violation(s)`);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all() as { name: string }[];
    for (const t of tables) counts[t.name] = Number((db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}"`).get() as { n: number }).n);
  } catch (e) {
    problems.push(`cannot open/read: ${(e as Error).message}`);
  } finally { db?.close(); }
  return { ok: problems.length === 0, problems, counts };
}

/** Deletes snapshots older than keepDays, but never the newest snapshot that passes checkSnapshot. */
export function prune(dir: string, keepDays: number, now = new Date()): string[] {
  const snaps = readdirSync(dir).filter((f) => TS.test(f)).sort(); // names sort chronologically
  if (!snaps.length) return [];
  let newestValid: string | null = null;
  for (let i = snaps.length - 1; i >= 0; i--) { if (checkSnapshot(join(dir, snaps[i]!)).ok) { newestValid = snaps[i]!; break; } }
  const cutoff = now.getTime() - keepDays * 86400_000;
  const removed: string[] = [];
  for (const f of snaps) {
    const m = TS.exec(f)!; const s = m[1]!;
    const t = Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(9, 11), +s.slice(11, 13), +s.slice(13, 15));
    if (t < cutoff && f !== newestValid) {
      unlinkSync(join(dir, f)); if (existsSync(join(dir, `${f}.sha256`))) unlinkSync(join(dir, `${f}.sha256`));
      removed.push(f);
    }
  }
  return removed;
}
