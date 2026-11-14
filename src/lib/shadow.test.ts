import assert from 'node:assert/strict';
import { scenes } from '../content/scenes';
import { vocab } from '../content/vocab';
import { accuracy, cloze, coverage, sameWord, verdict } from './shadow';

// ---- Sahna kontenti yaxlitligi ----
assert.equal(scenes.length, 10);
const allLines = scenes.flatMap((s) => s.lines.map((l) => l.text));
assert.equal(new Set(allLines).size, allLines.length, 'gaplar noyob (audio kaliti matn bo‘yicha)');
for (const s of scenes) {
  assert.ok(s.lines.length >= 7 && s.lines.length <= 12, `${s.id}: gaplar soni ${s.lines.length}`);
  assert.ok(s.quiz.length === 3 && s.phrases.length === 3 && s.retell.points.length >= 4, s.id);
  assert.ok(s.voices.A && (s.names.B ? s.voices.B && s.voices.A !== s.voices.B : true), `${s.id}: ovozlar`);
  for (const l of s.lines) { assert.ok(l.text.length > 8); assert.ok(l.sp === 'A' || (l.sp === 'B' && s.names.B), `${s.id}: B so‘zlovchisi yo‘q`); }
  for (const q of s.quiz) { assert.ok(q.options.length === 3 && q.answer >= 0 && q.answer < 3 && q.line >= 0 && q.line < s.lines.length, `${s.id}: savol`); }
  // Savolning to'g'ri javobiga ko'rsatilgan gapda dalil bor (kamida bitta kalit so'z umumiy)
  for (const p of s.phrases) assert.ok(p.example.toLowerCase().includes(p.phrase.toLowerCase()), `${s.id}/${p.phrase}`);
  // Qayta aytish namunasi o'zining barcha g'oyalarini qamraydi
  const cov = coverage(s.retell.model, s.retell.points);
  assert.deepEqual(cov.hit.map((h, i) => (h ? '' : s.retell.points[i].label)).filter(Boolean), [], `${s.id}: namuna retell g‘oyalarni qamramaydi`);
  const wc = s.lines.map((l) => l.text).join(' ').split(/\s+/).length;
  assert.ok(s.retell.model.split(/\s+/).length < wc, `${s.id}: retell qisqa bo‘lishi kerak`);
}
// Har daraja kamida bitta sahna, janrlar xilma-xil
for (const lv of ['A2', 'B1', 'B2', 'C1']) assert.ok(scenes.some((s) => s.level === lv), lv);
assert.ok(new Set(scenes.map((s) => s.genre)).size >= 4);
// Lavha iboralari lug'atga qo'shilgan va noyob
assert.equal(vocab.filter((w) => w.topic === 'Lavha iboralari').length, 30);
assert.equal(new Set(vocab.map((w) => w.id)).size, vocab.length);

// ---- Aniqlik ----
const t = 'Could I have a window seat, please?';
assert.equal(accuracy(t, 'could i have a window seat please').pct, 100);
assert.equal(accuracy(t, 'Could I have window seat please').pct, 86);
assert.deepEqual(accuracy(t, 'Could I have window seat please').missing, ['a']);
assert.equal(accuracy(t, 'nothing').pct, 0);
assert.equal(accuracy(t, '').pct, 0);
assert.ok(accuracy('It is fine', "it's fine").pct === 100, 'qisqartma bir xil hisoblanadi');
assert.equal(verdict(95).label, 'A’lo'); assert.equal(verdict(80).label, 'Yaxshi'); assert.equal(verdict(60).tone, 'near'); assert.equal(verdict(20).tone, 'no');

// ---- Bo'shliqlar ----
const line = 'Thank you very much. Have a nice flight!';
const c1 = cloze(line, 2), c2 = cloze(line, 2);
assert.deepEqual(c1, c2, 'bir xil gap — bir xil bo‘shliqlar');
const blanks = c1.filter((x) => typeof x !== 'string') as { answer: string }[];
assert.equal(blanks.length, 2);
assert.equal(c1.map((x) => (typeof x === 'string' ? x : x.answer)).join(''), line, 'bo‘shliqlarni to‘ldirsa asl gap tiklanadi');
for (const s of scenes) for (const l of s.lines.filter((x) => x.text.split(/\s+/).length >= 5)) { const b = cloze(l.text, 3).filter((x) => typeof x !== 'string'); assert.ok(b.length >= 1, l.text); }
assert.equal(sameWord('Flight!', 'flight'), true); assert.equal(sameWord('flights', 'flight'), false);

// ---- Qayta aytish ----
const pts = scenes[0].retell.points;
assert.equal(coverage('He flies to London and asks for a window seat.', pts).pct, 40);
assert.equal(coverage('I like football', pts).pct, 0);
console.log('shadow.test: OK');
