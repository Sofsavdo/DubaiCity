import assert from 'node:assert/strict';
import { FORBIDDEN, LEVELS, roastLines } from '../content/roasts';
import { countSlips, detectSlip, effectiveLevel, reactTo } from './roast';

// Darajalar va 18+ cheklovi
assert.equal(effectiveLevel(3, false), 1);
assert.equal(effectiveLevel(2, false), 1);
assert.equal(effectiveLevel(3, true), 3);
assert.equal(effectiveLevel(0, false), 0);
assert.equal(effectiveLevel(NaN, true), 0);
assert.equal(LEVELS.length, 4);

// Xatolarni topish va to'g'ri variant
const cases: [string, string, string][] = [
  ['I am agree with you', 'I am agree', 'I agree'],
  ['she go to school every day', 'she go', 'she goes'],
  ['he have a big family', 'he have', 'he has'],
  ['he like football', 'he like', 'he likes'],
  ['it don\'t work well', 'it don\'t', 'it doesn\'t'],
  ['this is more better than that', 'more better', 'better'],
  ['we discuss about the plan', 'discuss about', 'discuss'],
  ['I have twenty years old', 'I have twenty years old', 'I am twenty years old'],
  ['many peoples live here', 'peoples', 'people'],
  ['I need some advices', 'advices', 'advice'],
  ['I am boring at home', 'I am boring', 'I am bored'],
  ['I very like music', 'I very like', 'I really like'],
  ['I am study economics', 'I am study', 'I study'],
  ['I didn\'t went there', 'didn\'t went', 'didn\'t go'],
];
for (const [text, wrong, right] of cases) {
  const s = detectSlip(text);
  assert.ok(s, `topilmadi: ${text}`);
  assert.equal(s!.wrong.toLowerCase(), wrong.toLowerCase(), text);
  assert.equal(s!.right, right, text);
}
// To'g'ri gaplar xato deb belgilanmasin
for (const ok of ['I agree with you', 'She goes to school', 'He has a family', 'It doesn\'t work', 'I am bored', 'I study economics', 'There are many people here']) {
  assert.equal(detectSlip(ok), null, `yolg'on signal: ${ok}`);
}
assert.equal(countSlips('I am agree and many peoples came'), 2);

// Reaksiya tanlash
const rnd = () => 0;
const base = { text: 'I live in Tashkent and I like it', words: 25, fillers: 0, latencyMs: 1000, rnd };
const r2 = reactTo({ ...base, text: 'I am agree with this', level: 2 });
assert.equal(r2?.emotion, 'angry');
assert.ok(r2!.uz.includes('I am agree') && r2!.uz.includes('I agree'), 'xato va to\'g\'ri variant matnda');
assert.ok(r2!.en.includes('I agree'));
assert.equal(reactTo({ ...base, words: 0, text: '', level: 3 })?.emotion, 'angry');
assert.match(reactTo({ ...base, fillers: 5, level: 1 })!.uz, /5 ta/);
assert.ok(reactTo({ ...base, words: 3, level: 0 })!.uz.includes('batafsil'));
assert.equal(reactTo({ ...base, rnd: () => 0.99, words: 10, level: 2 }), null, 'oddiy javobga reaksiya shart emas');
assert.equal(reactTo({ ...base, level: 3 })?.emotion, 'impressed', 'uzun toza javob maqtovga loyiq');
// Yumshoq darajada haqorat yo'q
const INSULTS = /tentak|eshak|ahmoq|miyasiz|chumo|muppet|donkey|fool|brainless|stupid|idiot/i;
for (const lv of [0, 1] as const) for (const group of Object.values(roastLines)) for (const line of group[lv]) assert.ok(!INSULTS.test(line.uz + line.en), `0-1 darajada haqorat: ${line.uz}`);
// 2-3 darajada kamida bitta yengil haqorat bor, lekin taqiqlangan mavzular hech qachon yo'q
for (const group of Object.values(roastLines)) for (const lv of [0, 1, 2, 3] as const) for (const line of group[lv]) {
  assert.ok(!FORBIDDEN.test(line.uz), `taqiqlangan mavzu: ${line.uz}`);
  assert.ok(!FORBIDDEN.test(line.en.replace(/donkey/g, '')), `taqiqlangan mavzu: ${line.en}`);
  assert.ok(line.uz.length < 200 && line.en.length < 200);
}
assert.ok(roastLines.error[2].some((x) => INSULTS.test(x.uz)));
// Har bir daraja har bir guruhda mavjud
for (const group of Object.values(roastLines)) for (const lv of [0, 1, 2, 3] as const) assert.ok(group[lv].length >= 1);
// Filtrning o'zi: taqiqlanganni ushlaydi, oddiy so'zlarni (qiziq, ota-onalar emas) ushlamaydi
for (const bad of ['onangni', 'otang kim?', 'dining nima', 'sen semiz', 'xotin kishi', 'millating', 'qiz bola']) assert.match(bad, FORBIDDEN, bad);
for (const ok of ['Qiziq narsa', 'Nima qilyapsan', 'ingliz tili', 'tentak', 'ahmoq', 'dinamik']) assert.doesNotMatch(ok, FORBIDDEN, ok);
console.log('roast.test: OK');
