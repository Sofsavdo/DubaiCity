import assert from 'node:assert/strict';
import { writingTopics } from '../content/writingGuide';
import { analyzeTask2 } from './writingCheck';

const strip = (s: string) => s.replace(/\*\*/g, '');
// Har bir namuna insho o'z tekshiruvidan to'liq o'tishi kerak (checker va kontent bir-biriga mos)
for (const t of writingTopics) {
  const r = analyzeTask2(strip(t.essay), t.type, t.id);
  const failed = r.checks.filter((c) => !c.ok);
  assert.deepEqual(failed.map((c) => `${c.id}: ${c.detail ?? c.label}`), [], `${t.id}: namuna insho tekshiruvdan o‘tmadi`);
  assert.ok(r.topicWords.length >= 7, `${t.id}: mavzu so‘zlari ${r.topicWords.length}`);
}
// Typografik apostrof ham qisqartma sifatida topiladi
const bad = "I don’t think it's good. My friend said that kids hate it, and there is a lot of stuff.\n\nIt is terrible.";
const r = analyzeTask2(bad, 'agree');
const by = Object.fromEntries(r.checks.map((c) => [c.id, c]));
assert.equal(by.words.ok, false); assert.equal(by.structure.ok, false); assert.equal(by.conclusion.ok, false);
assert.equal(by.contractions.ok, false); assert.ok(by.contractions.detail!.includes("don't"));
assert.equal(by.informal.ok, false); assert.ok(by.informal.detail!.includes('kids'));
assert.equal(by.anecdote.ok, false); assert.equal(by.emotion.ok, false);
assert.ok(r.passed < r.checks.length);
// Tur bo'yicha tekshiruv: muammo-yechim insho yechimsiz
const noSol = analyzeTask2('There is a big problem with traffic in many cities and it affects people.\n\nMany issues exist.\n\nAnother problem is pollution.\n\nIn conclusion, problems are serious.', 'problem');
assert.equal(noSol.checks.find((c) => c.id === 'type')?.ok, false);
// Discuss: faqat bitta tomon
const one = analyzeTask2('Some people argue that cars are useful. They are fast.\n\nCars save time.\n\nCars are comfortable.\n\nIn conclusion, I believe cars are good.', 'discuss');
assert.equal(one.checks.find((c) => c.id === 'type')?.ok, false);
// Agree: pozitsiya birinchi abzatsda emas
const late = analyzeTask2('Technology is everywhere today.\n\nIt helps people.\n\nIt can harm people.\n\nIn conclusion, I agree.', 'agree');
assert.equal(late.checks.find((c) => c.id === 'opinion')?.ok, false);
console.log('writingCheck.test: OK');
