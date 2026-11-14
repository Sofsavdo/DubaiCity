import assert from 'node:assert/strict';
import { placement } from '../content/placement';
import { CEFR, fits, levelIndex, suggestedTarget } from './levels';
import { evaluate, nextQuestion } from './placement';

// Kontent yaxlitligi
assert.equal(placement.length, 20);
placement.forEach((q, i) => {
  assert.equal(q.id, i + 1);
  assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
  assert.ok(q.answer >= 0 && q.answer < 4);
  assert.ok(q.q.length > 10);
});
for (const lv of CEFR) assert.equal(placement.filter((q) => q.level === lv).length, 4, lv);
// Javoblar bir joyga yig'ilmagan
const dist = [0, 1, 2, 3].map((k) => placement.filter((q) => q.answer === k).length);
assert.ok(Math.max(...dist) <= 8, `javob taqsimoti: ${dist}`);

// Foydalanuvchi simulyatsiyasi: berilgan darajagacha hammasini to'g'ri, undan keyingisida hammasi xato
function simulate(upTo: number, wrongAfter = true): Record<number, number> {
  const a: Record<number, number> = {};
  let q = nextQuestion(a), guard = 0;
  while (q && guard++ < 30) {
    const ok = levelIndex(q.level) <= upTo;
    a[q.id] = ok ? q.answer : (q.answer + 1) % 4;
    q = nextQuestion(a);
  }
  void wrongAfter;
  return a;
}
for (const [i, lv] of CEFR.entries()) {
  const a = simulate(i);
  assert.equal(evaluate(a).level, lv, `simulyatsiya ${lv}`);
}
// Boshlang'ich: hamma xato -> A1 (belowA1), faqat 4 savol so'raladi
const zero = simulate(-1);
assert.equal(Object.keys(zero).length, 4, 'A1 blokdan yiqilgan foydalanuvchiga ortiqcha savol berilmaydi');
assert.equal(evaluate(zero).level, 'A1'); assert.equal(evaluate(zero).belowA1, true);
// C1 foydalanuvchi hamma 20 savolga javob beradi, A1 foydalanuvchi esa 4 ta
assert.equal(Object.keys(simulate(4)).length, 20);
// Tasodifiy topish (guessing): 3/4 chegarasi pastroq bloklarda yiqitadi
const lucky: Record<number, number> = {};
for (const q of placement.filter((x) => x.level === 'A1')) lucky[q.id] = q.answer;
for (const q of placement.filter((x) => x.level === 'A2').slice(0, 2)) lucky[q.id] = q.answer;
for (const q of placement.filter((x) => x.level === 'A2').slice(2)) lucky[q.id] = (q.answer + 1) % 4;
assert.equal(evaluate(lucky).level, 'A1', '2/4 A2 blokdan o‘tmaydi');
assert.equal(nextQuestion(lucky), null);

// Yordamchilar
assert.ok(fits('B1', 'B2')); assert.ok(fits('B2', 'B2')); assert.ok(fits('C1', 'B2')); assert.ok(!fits('A2', 'B2')); assert.ok(!fits('C1', 'B1'));
assert.equal(suggestedTarget('B1'), 6.0);
console.log('placement.test: OK');
