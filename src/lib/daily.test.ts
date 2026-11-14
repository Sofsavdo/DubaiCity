import assert from 'node:assert/strict';
import { tipOfDay, tips } from '../content/tips';
import { wrapLines } from './shareCard';

assert.ok(tips.length >= 24);
for (const t of tips) { assert.ok(t.en.length > 20 && t.uz.length > 20 && t.en.length <= 110, t.en); }
assert.equal(new Set(tips.map((t) => t.en)).size, tips.length);
// Bir kunda bir xil maslahat, ertasi kuni boshqa
const d = Date.UTC(2026, 5, 10, 8);
assert.deepEqual(tipOfDay(d), tipOfDay(d + 3_600_000));
assert.notDeepEqual(tipOfDay(d), tipOfDay(d + 86_400_000));
// Matnni qatorlarga bo'lish
const lines = wrapLines('Not Given means the text is silent. Silence is not a reason to write True.', 24);
assert.ok(lines.every((l) => l.length <= 24) && lines.join(' ') === 'Not Given means the text is silent. Silence is not a reason to write True.');
assert.deepEqual(wrapLines('', 10), []);
assert.deepEqual(wrapLines('supercalifragilistic', 5), ['supercalifragilistic']);
console.log('daily.test: OK');
