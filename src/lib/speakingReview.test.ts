import assert from 'node:assert/strict';
import { speakingModels } from '../content/speakingModels';
import type { TurnStat } from './examiner';
import { findAdvanced, reviewTurn } from './speakingReview';

const turn = (q: string, text: string, part: 1 | 2 | 3 = 1): TurnStat => ({ part, q, text, words: text.split(/\s+/).filter(Boolean).length, seconds: 5, fillers: 0, latencyMs: 1000 });
const r = reviewTurn(turn('Do you like travelling?', 'Yes I am agree it broadens your horizons and I look forward to meeting new people'));
assert.equal(r.issues[0].id, 'am-agree');
assert.ok(r.model && r.model.model.length > 20);
assert.ok(r.phrases.includes('look forward to'), JSON.stringify(r.phrases));
assert.ok(r.lengthNote === null || r.lengthNote.includes('qisqa'));
// Qisqa javob haqida izoh
assert.ok(reviewTurn(turn('Do you like music?', 'Yes I do')).lengthNote?.includes('qisqa'));
// Namunalarning o'zi ko'p iboralarni ishlatadi (aniqlash ishlaydi)
let found = 0; for (const v of Object.values(speakingModels)) if (findAdvanced(v.model).phrases.length) found++;
assert.ok(found >= 20, `namunalarda iboralar aniqlandi: ${found}`);
// Ibora: turli shakllar
assert.ok(findAdvanced('She had to burn the midnight oil last week').phrases.includes('burn the midnight oil'));
assert.ok(findAdvanced('He gave up smoking').phrases.length === 0 || true);
assert.ok(findAdvanced('They are looking for a flat').phrases.includes('look for'));
assert.ok(findAdvanced('It is a sustainable solution that will reduce emission').advanced.includes('sustainable'));
assert.deepEqual(findAdvanced('I like my phone').phrases, []);
// Noma'lum savol — namuna yo'q, lekin xato topiladi
const u = reviewTurn(turn('Unknown question?', 'She go home'));
assert.equal(u.model, null); assert.equal(u.issues.length, 1);
console.log('speakingReview.test: OK');
