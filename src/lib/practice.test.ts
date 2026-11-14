import assert from 'node:assert/strict';
import { exercises } from '../content/practice';
import { CEFR } from './levels';
import { check, diffTokens, normalize, xpFor } from './practice';

// Yaxlitlik
assert.ok(exercises.length >= 50);
assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
for (const k of ['translate', 'build', 'fix', 'use', 'upgrade'] as const) assert.ok(exercises.filter((e) => e.kind === k).length >= 4, `${k}: yetarli mashq`);
for (const l of CEFR) assert.ok(exercises.filter((e) => e.level === l).length >= 6, `${l}: yetarli mashq`);
for (const e of exercises) {
  assert.ok(e.promptUz.length > 5 && e.explainUz.length > 10 && e.model.length > 3, e.id);
  if (e.kind === 'fix' || e.kind === 'upgrade') assert.ok(e.shown, `${e.id}: shown`);
  if (e.kind === 'use' || e.kind === 'upgrade') assert.ok((e.must ?? []).length >= 1, `${e.id}: must`);
  if (e.kind === 'fix') assert.notEqual(normalize(e.shown!), normalize(e.model), `${e.id}: xatoli gap tuzatilganidan farq qilishi kerak`);
}

// Modellar va qabul qilingan javoblar o'z-o'zidan "to'g'ri" bo'lishi shart
for (const e of exercises) {
  assert.equal(check(e, e.model).verdict, 'correct', `${e.id}: model to‘g‘ri deb topilmadi → ${JSON.stringify(check(e, e.model))}`);
  for (const a of e.accept ?? []) assert.equal(check(e, a).verdict, 'correct', `${e.id}: qabul javobi: ${a}`);
  if (e.better) assert.equal(check(e, e.better).verdict, 'correct', `${e.id}: better variant: ${check(e, e.better).notes.join('|')}`);
}
// Xatoli gapni o'zi (fix) javob sifatida kiritilsa — noto'g'ri
for (const e of exercises.filter((x) => x.kind === 'fix')) assert.notEqual(check(e, e.shown!).verdict, 'correct', `${e.id}: xatoni tuzatmagan javob o‘tib ketdi`);
// Upgrade: asl gapni o'zgartirmasdan topshirish — o'tmaydi
for (const e of exercises.filter((x) => x.kind === 'upgrade')) assert.equal(check(e, e.shown!).verdict, 'wrong', e.id);

// So'z tartibi: tinish belgisi/bosh harf talab qilinmaydi
const b3 = exercises.find((e) => e.id === 'b3')!;
assert.equal(check(b3, 'What time does the film start').verdict, 'correct');
const t2 = exercises.find((e) => e.id === 't2')!;
assert.equal(check(t2, "I'm a student.").verdict, 'correct');
assert.equal(check(t2, 'i am a student').verdict, 'close', 'bosh harf va nuqta kamchiligi: deyarli');
const r = check(t2, 'I am student.');
assert.equal(r.verdict, 'close'); assert.ok(r.diff!.some((o) => o.t === 'missing' && o.want === 'a'), 'yetishmayotgan "a" ko‘rsatiladi');
assert.equal(check(t2, 'I am a teacher.').verdict, 'close', 'bitta so‘z farqi: deyarli');
assert.equal(check(t2, 'My name is Ali.').verdict, 'wrong');
const typo = check(t2, 'I am a studnt.'); assert.ok(typo.typos.length === 1 && typo.verdict === 'close', 'imlo xatosi aniqlanadi');
assert.equal(check(t2, '').verdict, 'wrong');

// Diff
const d = diffTokens(['she', 'go', 'to', 'school'], ['she', 'goes', 'to', 'school']);
assert.deepEqual(d.map((o) => o.t), ['same', 'sub', 'same', 'same']);

// use: talabga javob bermasa nima yetishmayotgani aytiladi, grammatik xato 'close'
const u4 = exercises.find((e) => e.id === 'u4')!;
assert.equal(check(u4, 'I like tea very much every day.').verdict, 'wrong');
assert.ok(check(u4, 'I like tea very much every day.').notes.some((n) => n.includes('although')));
assert.equal(check(u4, 'Although it was raining, but we went out for a long walk.').verdict, 'wrong', "'although ... but' rad etiladi");
assert.equal(check(u4, 'although it was cold, we went out for a walk.').verdict, 'close', 'bosh harf va nuqta kamchiligi');
const u6 = exercises.find((e) => e.id === 'u6')!;
assert.equal(check(u6, 'If she had known, she would have come.').verdict, 'wrong', 'minWords');
assert.equal(check(u6, 'If I had more money, I would buy a car yesterday.').verdict, 'wrong');
// Grammatik xato bor, lekin talab bajarilgan: close + izoh
const u1 = exercises.find((e) => e.id === 'u1')!;
const c1 = check(u1, 'I am agree with this because it is good.');
assert.equal(c1.verdict, 'close'); assert.equal(c1.issues[0].id, 'am-agree');
// g4: aniq so'z talabi + yo'q so'zlar
const g4 = exercises.find((e) => e.id === 'g4')!;
assert.equal(check(g4, 'Technology is good because it helps people a lot more.').verdict, 'wrong');
assert.equal(xpFor('correct'), 5); assert.equal(xpFor('close'), 2); assert.equal(xpFor('wrong'), 0);
console.log('practice.test: OK');
