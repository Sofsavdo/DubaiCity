import assert from 'node:assert/strict';
import { commonMistakes, essayTypes, writingTopics } from '../content/writingGuide';
import { writingWords } from '../content/vocabWriting';
import { vocab } from '../content/vocab';

const wc = (s: string) => s.replace(/\*\*/g, '').trim().split(/\s+/).length;
assert.equal(writingTopics.length, 10);
assert.equal(essayTypes.length, 5);
assert.ok(commonMistakes.length >= 8);
assert.equal(new Set(writingTopics.map((t) => t.id)).size, 10);
const types = new Set(writingTopics.map((t) => t.type));
for (const t of essayTypes) assert.ok(types.has(t.id), `${t.id}: kamida bitta mavzu bu turda`);

for (const t of writingTopics) {
  const n = wc(t.essay);
  assert.ok(n >= 250 && n <= 330, `${t.id}: insho ${n} so‘z (250–330 bo‘lishi kerak)`);
  assert.ok(!/\b\w+n't\b|\b(it|that|there|he|she|what)'s\b|\b(I|you|we|they)'(m|re|ve|ll|d)\b/i.test(t.essay.replace(/’/g, "'")) || /(children|child|world|century)'s|'s (energy|attention)/.test(t.essay), `${t.id}: qisqartma bor`);
  const paras = t.essay.split(/\n\s*\n/);
  assert.ok(paras.length >= 4 && paras.length <= 5, `${t.id}: 4-5 abzats`);
  assert.ok(/\b(in conclusion|to conclude|to summarise)\b/i.test(paras[paras.length - 1]), `${t.id}: xulosa iborasi`);
  assert.equal(t.vocab.length, 8, t.id);
  // Mavzu so'zlarining ko'pi insho ichida qalin belgilangan
  const bold = [...t.essay.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].toLowerCase());
  const used = t.vocab.filter((x) => bold.some((b) => b.includes(x.phrase.toLowerCase()) || x.phrase.toLowerCase().includes(b))).length;
  assert.ok(used >= 7, `${t.id}: mavzu so‘zlarining ${used}/8 tasi insholarda ishlatilgan`);
  assert.ok(t.prompt.length > 60 && t.outline.length === 4 && t.about.length > 20, t.id);
  // Har bir so'zning misol gapida shu so'z bor
  for (const x of t.vocab) assert.ok(x.example.toLowerCase().includes(x.phrase.toLowerCase()), `${t.id}/${x.phrase}: misol gapda so‘z yo‘q`);
}
// Lug'atga qo'shilgan so'zlar yaxlit
assert.equal(writingWords.length, 80);
assert.equal(new Set(vocab.map((w) => w.id)).size, vocab.length, 'lug‘at id lari noyob');
console.log('writingGuide.test: OK');
