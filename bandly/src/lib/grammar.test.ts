import assert from 'node:assert/strict';
import { grammar, grammarTopics } from '../content/grammar';

assert.equal(grammar.length, 50);
grammar.forEach((g, i) => {
  assert.equal(g.id, i + 1, `id ketma-ketligi: ${g.id}`);
  assert.equal(g.options.length, 4, `4 ta variant: ${g.id}`);
  assert.equal(new Set(g.options).size, 4, `variantlar takrorlanmasin: ${g.id}`);
  assert.ok(g.answer >= 0 && g.answer < 4, `javob indeksi: ${g.id}`);
  assert.ok(g.q.includes('____'), `savolda bo'sh joy: ${g.id}`);
  assert.ok(g.explanationUz.length > 10, `izoh: ${g.id}`);
  assert.ok((grammarTopics as readonly string[]).includes(g.topic), `noma'lum mavzu: ${g.topic}`);
});
for (const t of grammarTopics) assert.equal(grammar.filter((g) => g.topic === t).length, 5, `${t}: 5 ta savol`);
// Javoblar bitta indeksga yig'ilib qolmasin
const dist = [0, 1, 2, 3].map((k) => grammar.filter((g) => g.answer === k).length);
assert.ok(Math.max(...dist) <= 25, `javob taqsimoti: ${dist}`);
console.log('grammar.test: OK', dist.join('/'));
