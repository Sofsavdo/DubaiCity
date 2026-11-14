import assert from 'node:assert/strict';
import { Examiner, countFillers, countWords, summarize } from './examiner';

assert.equal(countWords('  I live in   Tashkent. '), 4);
assert.equal(countFillers('Um, I think, uh, you know, it is good'), 3);
assert.equal(countFillers('I like summer'), 0); // "like" to'ldiruvchi emas

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const ex = new Examiner(rnd, 0);

let s = ex.start();
assert.equal(s.wait, 'answer');
assert.match(s.say, /full name/);
s = ex.answer('My name is Aziz Karimov', 3, 1200);
assert.equal(ex.phase, 'p1');
assert.equal(s.part, 1);
assert.equal(ex.turns.length, 0, 'tanishuv javobi baholanmaydi');

// Qisqa javob: bir marta aniqlashtiruvchi savol, keyin davom
const q1 = ex.p1Qs[0];
s = ex.answer('Yes', 1, 500);
assert.match(s.say, /a little more/);
s = ex.answer('Yes, I really like my city because it is warm and friendly', 6, 0);
assert.equal(ex.turns.length, 1);
assert.equal(ex.turns[0].q, q1);
assert.ok(ex.turns[0].text.startsWith('Yes Yes, I really'));
assert.equal(s.say, ex.p1Qs[1]);

// Qolgan Part 1 savollari
for (let i = 1; i < ex.p1Qs.length - 1; i++) {
  s = ex.answer('I think it is quite interesting because I have done it for many years now', 6, 900);
  assert.equal(s.say, ex.p1Qs[i + 1]);
}
s = ex.answer('Well, it depends, but mostly I enjoy it a lot every single day', 5, 900);
assert.equal(s.wait, 'prep', 'Part 2 tayyorgarligi');
assert.equal(s.part, 2);
assert.ok(s.say.includes(ex.card.title));
assert.equal(ex.turns.length, ex.p1Qs.length);

s = ex.beginMonologue();
assert.equal(s.wait, 'monologue');
// 60 soniyadan qisqa monolog: bir marta davom ettirish so'raladi
s = ex.answer('I want to talk about my teacher', 20, 2000);
assert.match(s.say, /continue/);
s = ex.answer('She helped me a lot when I was young and I will never forget her kindness', 50, 0);
assert.equal(s.wait, 'answer');
assert.equal(ex.phase, 'p2after');
assert.equal(ex.turns.at(-1)?.part, 2);
assert.ok(ex.turns.at(-1)!.seconds >= 60);

s = ex.answer('Yes, I think many people would find it quite easy to do that', 5, 800);
assert.equal(ex.phase, 'p3');
assert.equal(s.part, 3);
for (let i = 0; i < ex.p3Qs.length; i++) {
  s = ex.answer('I believe this is a complicated question, and there are several reasons for it', 6, 900);
}
assert.equal(s.wait, 'end');
assert.equal(ex.phase, 'done');

// Xulosa
const sum = summarize(ex.turns, true);
assert.ok(sum.answers >= 8);
assert.ok(sum.fluencyBand >= 4 && sum.fluencyBand <= 7.5);
assert.ok(sum.wpm !== null && sum.wpm > 0);
assert.equal(summarize(ex.turns, false).wpm, null, 'yozma rejimda tezlik hisoblanmaydi');
const weak = summarize([{ part: 1, q: 'q', text: 'um yes um uh', words: 4, seconds: 5, fillers: 3, latencyMs: 6000 }], true);
assert.ok(weak.fluencyBand <= 4.5 && weak.notes.length > 0);
// Shaxsiyat: 2-darajada to'ldiruvchilar va xatolar uchun reaksiya, 0-darajada yumshoq maslahat
const h = new Examiner(rnd, 2); h.start(); h.answer('Ali', 1, 1);
const hs = h.answer('Um, uh, um, er, well it is um fine because I am agree with it', 3, 1000);
assert.ok(hs.reaction && hs.reaction.emotion !== undefined, 'xato uchun reaksiya');
assert.ok(hs.reaction!.uz.includes('I am agree'), 'reaksiya xatoni ko‘rsatadi');
const soft = new Examiner(rnd, 0); soft.start(); soft.answer('Ali', 1, 1);
const ss = soft.answer('I am agree with this idea because it is good for everyone in the city', 5, 900);
assert.ok(ss.reaction && /Kichik tuzatish/.test(ss.reaction.uz), 'yumshoq maslahat');
const calm = new Examiner(rnd, 1); calm.start(); calm.answer('Ali', 1, 1);
assert.equal(calm.answer('I like my city because it is warm and friendly and full of life', 5, 900).reaction, undefined, 'toza oddiy javobga reaksiya yo‘q');
// AI savoli skriptdagi savolni almashtiradi
const ai = new Examiner(rnd, 0); ai.start(); ai.answer('Ali', 1, 1);
ai.answer('I live in a big city and I love it because it is full of life and people', 5, 500);
ai.overrideQuestion('What do you enjoy most about it?');
ai.answer('I enjoy the food and the markets, they are colourful and cheap and always busy', 5, 500);
assert.equal(ai.turns.at(-1)?.q, 'What do you enjoy most about it?');
console.log('examiner.test: OK');

// A1–A2: sodda savollar, o'zbekcha yordam, qisqaroq monolog
{
  const easy = new Examiner(rnd, 0, 'A1');
  assert.equal(easy.easy, true);
  let st = easy.start(); st = easy.answer('Ali', 1, 1);
  assert.ok(easy.hintFor(st.say), 'birinchi savolga o‘zbekcha yordam bor');
  assert.ok(easy.p1Qs.length >= 6);
  for (let i = 0; i < 12 && st.wait !== 'prep'; i++) st = easy.answer('I like it very much because it is nice', 3, 1500);
  assert.equal(st.wait, 'prep');
  assert.ok(st.say.includes('about one minute'));
  assert.ok(easy.hintFor(st.say), 'kartochka sarlavhasiga yordam');
  const mono = easy.beginMonologue();
  assert.ok(mono.say.includes('about one minute'));
  // 30 soniyadan keyin qo'shimcha so'ralmaydi
  const after = easy.answer('I have a friend. He is kind and funny and we play football every weekend together.', 35, 1000);
  assert.ok(!after.say.startsWith('Please continue'), 'A1 monologi 30s dan keyin yetarli');
  const hard = new Examiner(rnd, 0, 'B2');
  assert.equal(hard.easy, false); assert.equal(hard.hintFor('Where is your hometown?'), undefined);
  const c1 = new Examiner(rnd, 0, 'C1');
  assert.equal(c1.p3Qs.length, 4);
}
console.log('examiner.test (levels): OK');
