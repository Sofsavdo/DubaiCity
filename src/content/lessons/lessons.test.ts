import assert from 'node:assert/strict';
import { UNITS, ALL_LESSONS, LESSON_NODES, lessonById } from './index';
import { validateLesson, checkItem, scoreCheck, normalize, isUnlocked, PASS_RATE, correctAnswerText, checkWriting, wordCount } from '../../lib/lessons';
import { validateGraph } from '../../lib/adaptive/graph';
import { ALL_NODES } from '../curriculum/inventory';

// content is structurally valid
for (const { lesson } of ALL_LESSONS) assert.deepEqual(validateLesson(lesson), [], lesson.id);
assert.equal(new Set(ALL_LESSONS.map((x) => x.lesson.id)).size, ALL_LESSONS.length, 'unique lesson ids');
assert.ok(UNITS.every((u) => u.status === 'pilot'), 'new lessons are pilot (visible with review-pending label), never claimed as reviewed');
// every item's stated correct answer passes its own checker (no broken keys)
for (const { lesson } of ALL_LESSONS) for (const it of [...lesson.practice, ...lesson.check]) {
  const ans = it.kind === 'choice' ? it.answer : it.kind === 'gap' ? it.accept[0]! : it.answer.split(' ');
  assert.ok(checkItem(it, ans), `${lesson.id}: key fails "${correctAnswerText(it)}"`);
}
// graph: lessons form one A1-rooted path and the whole curriculum stays valid
assert.deepEqual(validateGraph(LESSON_NODES), []);
assert.deepEqual(validateGraph(ALL_NODES), []);
assert.equal(LESSON_NODES[0]!.prerequisites.length, 0); assert.equal(LESSON_NODES[0]!.level, 'A1');
// checker behaviour
assert.equal(normalize("  I’M   Ali. "), "i'm ali");
assert.ok(checkItem({ kind: 'gap', prompt: 'x ___', accept: ['aren’t', 'are not'], explainUz: '.' }, "aren't"), 'straight vs curly apostrophe');
assert.ok(!checkItem({ kind: 'gap', prompt: 'x ___', accept: ['is'], explainUz: '.' }, 'are'));
assert.ok(checkItem({ kind: 'order', words: ['b', 'a'], answer: 'a b', explainUz: '.' }, ['a', 'b']));
assert.ok(!checkItem({ kind: 'choice', prompt: 'p', options: ['x', 'y'], answer: 1, explainUz: '.' }, undefined), 'unanswered is wrong');
// scoring and pass mark
const items = lessonById('a1-u1-l1')!.lesson.check;
const keys = items.map((it) => (it.kind === 'choice' ? it.answer : it.kind === 'gap' ? it.accept[0]! : it.answer.split(' ')));
assert.equal(scoreCheck(items, keys).passed, true);
const oneWrong = [...keys]; oneWrong[0] = 99; assert.equal(scoreCheck(items, oneWrong).correct, items.length - 1);
assert.equal(scoreCheck(items, oneWrong).passed, (items.length - 1) / items.length >= PASS_RATE);
assert.equal(scoreCheck(items, []).passed, false);
// unlocking
const u = UNITS[0]!;
assert.ok(isUnlocked(u, 0, {})); assert.ok(!isUnlocked(u, 1, {}));
assert.ok(isUnlocked(u, 1, { [u.lessons[0]!.id]: { attempts: 1, best: 1, passedAt: 1 } }));
assert.ok(!isUnlocked(u, 1, { [u.lessons[0]!.id]: { attempts: 2, best: 0.5, passedAt: null } }));
// writing: every lesson has a task; checker catches typical errors and missing structures
assert.ok(ALL_LESSONS.every((x) => !!x.lesson.writing), 'every pilot lesson has a writing task');
const wt = lessonById('b1-u2-l2')!.lesson.writing!;
const bad = checkWriting(wt, 'If it will rain tomorrow, we will stay at home. If I will pass, I will be happy and I will celebrate a lot.');
assert.equal(bad.passed, false); assert.ok(bad.forbidden.length > 0, 'if + will is flagged');
const short = checkWriting(lessonById('a1-u1-l1')!.lesson.writing!, 'I am Ali.');
assert.equal(short.enoughWords, false); assert.ok(short.reqs.some((r) => !r.ok));
const err = checkWriting(lessonById('a1-u2-l2')!.lesson.writing!, 'My brother work in a bank. He go to work by bus. She likes tea and reads books every day.');
assert.ok(err.issues.length > 0 && !err.passed, 'known learner error (3rd person -s) is caught');
const inv = checkWriting(lessonById('c1-u1-l1')!.lesson.writing!, 'Never I have seen such a beautiful place in my life. Rarely we travel so far. It was an amazing trip with my family and friends.');
assert.ok(!inv.passed && inv.forbidden.length > 0, 'non-inverted "Never I have" is flagged');
const acad = checkWriting(lessonById('c1-u1-l3')!.lesson.writing!, 'Lots of young people can\'t find jobs and there was a considerable increase in prices, so the situation became difficult.');
assert.ok(!acad.passed && acad.forbidden.length > 0, 'informal words are flagged in the academic rewrite');
assert.equal(wordCount("I'm from Tashkent, it’s big."), 5);
const { nextLesson } = await import('../../lib/lessons');
assert.equal(nextLesson(UNITS, {}, null)!.lessonId, 'a1-u1-l1');
assert.equal(nextLesson(UNITS, {}, 'B1')!.lessonId, 'b1-u1-l1', 'starts at the learner level');
assert.equal(nextLesson(UNITS, { 'b1-u1-l1': { attempts: 1, best: 1, passedAt: 1 } }, 'B1')!.lessonId, 'b1-u1-l2');
console.log(`lessons.test: OK (${UNITS.length} units, ${ALL_LESSONS.length} lessons, ${ALL_LESSONS.reduce((s, x) => s + x.lesson.practice.length + x.lesson.check.length, 0)} items)`);
