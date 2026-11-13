import assert from 'node:assert/strict';
import { vocab } from '../content/vocab';
import { blankExample, buildOptions } from './vocabGame';

// Lug'at yaxlitligi
assert.ok(vocab.length >= 50);
assert.equal(new Set(vocab.map((w) => w.id)).size, vocab.length, 'id lar takrorlanmasin');
assert.equal(new Set(vocab.map((w) => w.uz)).size, vocab.length, 'o‘zbekcha ma’nolar takrorlanmasin (variantlar adashmasin)');
for (const w of vocab) {
  assert.ok(w.word && w.uz && w.def && w.example, `to'liq emas: ${w.id}`);
  // Har bir misol gapda so'z (yoki o'zagi) bo'lishi shart, aks holda imlo sinovi ishlamaydi
  assert.ok(blankExample(w).includes('_____'), `misol gapda so'z topilmadi: ${w.id}`);
  assert.ok(!blankExample(w).toLowerCase().includes(w.word.toLowerCase()), `javob ochilib qolgan: ${w.id}`);
}

// Variantlar
for (const dir of ['en', 'uz'] as const) {
  for (const w of vocab) {
    const o = buildOptions(w, dir);
    assert.equal(o.length, 4);
    assert.equal(new Set(o.map((x) => x.id)).size, 4);
    assert.equal(o.filter((x) => x.id === w.id).length, 1);
  }
}
console.log('vocabGame.test: OK');
