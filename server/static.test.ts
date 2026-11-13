import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveStatic } from './static';

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
console.log('static.test: OK');
