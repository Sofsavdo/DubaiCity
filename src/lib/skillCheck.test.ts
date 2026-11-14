import assert from 'node:assert/strict';
import { setFor, estimate, SKILL_PASS } from './skillCheck';
import { SKILL_SETS } from '../content/skillCheck';
import { validateLesson } from './lessons';

assert.equal(setFor('A1').level, 'A2'); assert.equal(setFor('A2').level, 'A2'); assert.equal(setFor('B1').level, 'B1');
assert.equal(setFor('B2').level, 'B2'); assert.equal(setFor('C1').level, 'B2'); assert.equal(setFor(null).level, 'A2');
assert.equal(estimate('B1', 3, 4), 'B1'); assert.equal(estimate('B1', 2, 4), 'A2'); assert.equal(estimate('A2', 0, 4), 'A1'); assert.equal(estimate('B2', 4, 4), 'B2');
assert.equal(SKILL_PASS, 0.75);
for (const s of SKILL_SETS) {
  for (const part of [s.reading, s.listening]) {
    assert.equal(part.questions.length, 4, `${s.level} ${part.title}: 4 questions`);
    for (const q of part.questions) { assert.equal(q.kind, 'choice'); if (q.kind === 'choice') { assert.ok(q.answer >= 0 && q.answer < q.options.length); assert.equal(new Set(q.options).size, q.options.length); } }
  }
  const text = s.reading.text.split(/\s+/).length, script = s.listening.script.split(/\s+/).length;
  assert.ok(text >= 80 && script >= 60, `${s.level}: texts long enough (${text}/${script} words)`);
}
void validateLesson;
console.log('skillCheck.test: OK');
