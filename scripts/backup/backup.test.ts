import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDb, join as joinPlayer, sync } from '../../server/db.ts';
import { snapshot, checkSnapshot, prune } from './lib.ts';

const dir = mkdtempSync(join(tmpdir(), 'bandly-bk-'));
const src = join(dir, 'live.sqlite');
const db = createDb(src);
for (let i = 0; i < 20; i++) { const p = joinPlayer(db, `user${i}`); sync(db, p.token, 100 + i, 1); }
const live = Number((db.prepare('SELECT COUNT(*) AS n FROM players').get() as { n: number }).n);

// 1) snapshot is consistent and verifiable; source untouched
const before = readFileSync(src).length;
const s = snapshot(src, join(dir, 'bk'), new Date(Date.UTC(2026, 0, 1)));
const c = checkSnapshot(s.file);
assert.equal(c.ok, true, c.problems.join());
assert.equal(c.counts.players, live);
assert.equal(readFileSync(src).length, before, 'source file must not change');

// 2) snapshot while the server keeps writing
for (let i = 0; i < 20; i++) { joinPlayer(db, `late${i}`); const s2 = snapshot(src, join(dir, 'bk2'), new Date(Date.UTC(2026, 0, 2, 0, 0, i))); assert.equal(checkSnapshot(s2.file).ok, true); }

// 3) corruption detected (checksum)
const bad = readFileSync(s.file); bad[bad.length - 10] ^= 0xff; writeFileSync(s.file, bad);
assert.equal(checkSnapshot(s.file).ok, false);

// 4) missing sidecar detected
const s3 = snapshot(src, join(dir, 'bk3'), new Date(Date.UTC(2026, 1, 1)));
import('node:fs').then(({ unlinkSync }) => {
  unlinkSync(`${s3.file}.sha256`);
  assert.equal(checkSnapshot(s3.file).ok, false);

  // 5) prune: keeps recent, never deletes newest valid, removes old
  const pd = join(dir, 'bk4');
  const a = snapshot(src, pd, new Date(Date.UTC(2026, 0, 1)));
  const b = snapshot(src, pd, new Date(Date.UTC(2026, 0, 20)));
  const removed = prune(pd, 35, new Date(Date.UTC(2026, 2, 1))); // both older than 35 d at Mar 1
  assert.deepEqual(removed.length, 1, 'old one removed');
  assert.equal(existsSync(b.file), true, 'newest valid kept even if old');
  assert.equal(existsSync(a.file), false);
  console.log('backup.test: OK');
});
