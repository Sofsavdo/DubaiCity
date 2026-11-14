import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseRange, resolveStatic } from './static';

const root = mkdtempSync(join(tmpdir(), 'bandly-'));
mkdirSync(join(root, 'assets'));
writeFileSync(join(root, 'index.html'), '<html></html>');
writeFileSync(join(root, 'assets', 'app-abc12345.js'), '1');
writeFileSync(join(tmpdir(), 'secret-outside.txt'), 'x');

assert.ok(resolveStatic(root, '/')!.file.endsWith('index.html'));
assert.ok(resolveStatic(root, '/assets/app-abc12345.js')!.file.endsWith('app-abc12345.js'));
assert.equal(resolveStatic(root, '/assets/app-abc12345.js')!.fallback, false);
assert.equal(resolveStatic(root, '/yoq/sahifa')!.fallback, true, 'noma’lum yo‘l SPA index.html ga');
assert.equal(resolveStatic(root, '/assets/yoq.js'), null, 'mavjud bo‘lmagan fayl: 404');
// Papkadan chiqib ketish urinishlari
for (const evil of ['/../secret-outside.txt', '/..%2fsecret-outside.txt', '/%2e%2e/secret-outside.txt', '/assets/../../secret-outside.txt', '/a%00b']) {
  const r = resolveStatic(root, evil);
  assert.ok(r === null || r.file.endsWith('index.html'), `traversal: ${evil} -> ${r?.file}`);
}
assert.equal(resolveStatic(root, '/%E0%A4%A'), null, 'noto‘g‘ri kodlash');
// Range (Safari audio)
assert.deepEqual(parseRange('bytes=0-99', 1000), { start: 0, end: 99 });
assert.deepEqual(parseRange('bytes=500-', 1000), { start: 500, end: 999 });
assert.deepEqual(parseRange('bytes=-100', 1000), { start: 900, end: 999 });
assert.deepEqual(parseRange('bytes=0-99999', 1000), { start: 0, end: 999 });
assert.equal(parseRange('bytes=2000-3000', 1000), null);
assert.equal(parseRange('bytes=5-2', 1000), null);
assert.equal(parseRange('items=0-1', 1000), null);
assert.equal(parseRange(undefined, 1000), null);
assert.equal(parseRange('bytes=-', 1000), null);
console.log('static.test: OK');
