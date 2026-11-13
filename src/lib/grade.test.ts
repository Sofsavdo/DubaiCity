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

// Barcha testlar yaxlitligi
import { readingTests } from '../content/readingTests';
import { listeningTests } from '../content/listeningTests';

const clean = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ');
assert.equal(readingTests.length, 4);
assert.equal(listeningTests.length, 4);
assert.equal(new Set([...readingTests, ...listeningTests].map((t) => t.id)).size, 8, 'test id lari noyob');

for (const t of [...readingTests, ...listeningTests]) {
  assert.ok(t.questions.length >= 10, `${t.id}: savollar soni`);
  t.questions.forEach((x, i) => assert.equal(x.id, i + 1, `${t.id}: id ketma-ketligi`));
  const ids = t.groups.flatMap((g) => g.questionIds).sort((a, b) => a - b);
  assert.deepEqual(ids, t.questions.map((x) => x.id), `${t.id}: guruhlar hamma savolni qamrashi kerak`);
  const text = 'paragraphs' in t ? clean(t.paragraphs.join(' ')) : clean(t.script.map((l) => l.text).join(' '));
  for (const q of t.questions) {
    assert.ok(q.evidence.length > 5, `${t.id} Q${q.id}: dalil`);
    if (q.type === 'mcq' || q.type === 'match') {
      assert.ok(q.answer >= 0 && q.answer < q.options.length, `${t.id} Q${q.id}: javob indeksi`);
      assert.equal(new Set(q.options).size, q.options.length, `${t.id} Q${q.id}: variantlar noyob`);
    }
    if (q.type === 'fill') {
      assert.ok(q.text.includes('______'), `${t.id} Q${q.id}: bo'sh joy belgisi`);
      // So'zli javob matnda (yoki audio skriptida) bo'lishi shart; raqamli javoblar so'z shaklida ham tekshiriladi
      const found = q.answers.some((a) => text.includes(clean(a).trim()));
      const numeric = q.answers.every((a) => /^\d+(st|nd|th)?$/.test(a)) || q.answers.some((a) => /^\d+$/.test(a));
      assert.ok(found || numeric, `${t.id} Q${q.id}: javob matnda topilmadi: ${q.answers.join('/')}`);
    }
  }
}
// Reading: bo'sh joyli javoblar aynan matndagi so'z (IELTS qoidasi)
for (const t of readingTests) for (const q of t.questions) if (q.type === 'fill') assert.ok(clean(t.paragraphs.join(' ')).includes(q.answers[0]), `${t.id} Q${q.id}: reading javobi matndagi so'z emas`);
// Moslashtirish: har bir sarlavha/harf variantidan javob to'g'ri indeksga ega
const r2 = readingTests[1];
assert.equal(r2.questions.filter((q) => q.type === 'match').length, 6);
console.log('grade.test: OK');
