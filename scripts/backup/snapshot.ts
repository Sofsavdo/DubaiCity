// Usage: tsx scripts/backup/snapshot.ts [--src <db>] [--out <dir>] [--keep-days 35]
// Defaults: src=$DB_PATH, out=$BACKUP_DIR or <dir of src>/backups. Never writes to the source database.
import { dirname, join } from 'node:path';
import { snapshot, checkSnapshot, prune } from './lib.ts';

const arg = (n: string, d?: string): string | undefined => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const src = arg('src', process.env.DB_PATH);
if (!src) { console.error('no source: set DB_PATH or pass --src'); process.exit(2); }
const out = arg('out', process.env.BACKUP_DIR ?? join(dirname(src), 'backups'))!;
const keep = Number(arg('keep-days', '35'));
const r = snapshot(src, out);
const c = checkSnapshot(r.file);
console.log(JSON.stringify({ file: r.file, bytes: r.bytes, sha256: r.sha256, ok: c.ok, counts: c.counts }));
if (!c.ok) { console.error('snapshot FAILED verification:', c.problems.join('; ')); process.exit(1); }
const removed = prune(out, keep);
if (removed.length) console.log(`pruned ${removed.length} old snapshot(s)`);
