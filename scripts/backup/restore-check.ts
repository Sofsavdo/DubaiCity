// Usage: tsx scripts/backup/restore-check.ts <snapshot.sqlite> [--source <db>]
// Verifies a snapshot (checksum, integrity, foreign keys, row counts). With --source also compares row counts to the live file (read-only).
import { DatabaseSync } from 'node:sqlite';
import { checkSnapshot } from './lib.ts';

const file = process.argv[2];
if (!file) { console.error('usage: restore-check.ts <snapshot.sqlite> [--source <db>]'); process.exit(2); }
const r = checkSnapshot(file);
console.log(JSON.stringify(r, null, 2));
const si = process.argv.indexOf('--source');
if (si > 0) {
  const db = new DatabaseSync(process.argv[si + 1]!, { readOnly: true });
  for (const [t, n] of Object.entries(r.counts)) {
    const live = Number((db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get() as { n: number }).n);
    console.log(`${t}: snapshot=${n} live=${live}${live === n ? '' : '  (differs; live may have changed since)'}`);
  }
  db.close();
}
process.exit(r.ok ? 0 : 1);
