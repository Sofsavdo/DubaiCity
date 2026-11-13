import assert from 'node:assert/strict';
import { isCorrect, gradeAll } from './grade';
import { reading1 } from '../content/reading1';
import { listening1 } from '../content/listening1';

const q = (id: number) => [...reading1.questions, ...listening1.questions].find((x) => x.id === id)!;
const r = (id: number) => reading1.questions.find((x) => x.id === id)!;
const l = (id: number) => listening1.questions.find((x) => x.id === id)!;

assert.ok(isCorrect(r(1), 'True'));
assert.ok(!isCorrect(r(1), 'False'));
assert.ok(isCorrect(r(2), 'Not Given'));
assert.ok(isCorrect(r(6), 'Heat Island'));
assert.ok(isCorrect(r(6), ' heat-island '));
assert.ok(!isCorrect(r(6), 'heat'));
assert.ok(isCorrect(r(10), 0 as never));
assert.ok(!isCorrect(r(10), 1 as never));
assert.ok(isCorrect(l(2), '07749 381 265'));
assert.ok(isCorrect(l(4), '£45'));
assert.ok(isCorrect(l(6), '14th'));
assert.ok(!isCorrect(l(5), '25'));
assert.equal(gradeAll(reading1.questions, {}), 0);
void q;

// Har bir savol uchun kalit mavjudligi va id ketma-ketligi
for (const t of [reading1, listening1]) {
  t.questions.forEach((x, i) => assert.equal(x.id, i + 1));
  const ids = t.groups.flatMap((g) => g.questionIds).sort((a, b) => a - b);
  assert.deepEqual(ids, t.questions.map((x) => x.id));
}
console.log('grade.test: OK');
