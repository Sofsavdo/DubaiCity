import assert from 'node:assert/strict';
import { easyPart1Topics, easyPart2Cards } from '../content/speakingEasy';
import { part1Topics, part2Cards } from '../content/speaking';
import { easyModels, modelFor, speakingModels } from '../content/speakingModels';
import { findIssues } from './grammarCheck';

// Har bir savolga namuna bor
const std = [...part1Topics.flatMap((t) => t.questions), ...part2Cards.map((c) => c.title), ...part2Cards.flatMap((c) => c.part3)];
const easy = [...easyPart1Topics.flatMap((t) => t.questions.map((q) => q.en)), ...easyPart2Cards.map((c) => c.title), ...easyPart2Cards.flatMap((c) => c.part3.map((q) => q.en))];
for (const q of std) assert.ok(speakingModels[q], `namuna yo‘q: ${q}`);
for (const q of easy) assert.ok(easyModels[q], `oddiy namuna yo‘q: ${q}`);
for (const q of Object.keys(speakingModels)) assert.ok(std.includes(q), `ortiqcha kalit: ${q}`);
for (const q of Object.keys(easyModels)) assert.ok(easy.includes(q), `ortiqcha oddiy kalit: ${q}`);
// Namunalarning o'zi xatosiz bo'lishi va uzunlik
for (const [q, v] of Object.entries({ ...speakingModels, ...easyModels })) {
  assert.deepEqual(findIssues(v.model), [], `namunada xato: ${q}`);
  assert.ok(v.tipUz.length > 10 && v.phrases.length >= 1, q);
  const n = v.model.split(/\s+/).length;
  if (part2Cards.some((c) => c.title === q)) assert.ok(n >= 130, `Part 2 namuna qisqa: ${q} (${n})`);
  else if (q in easyModels) assert.ok(n >= 7 && n <= 60, `${q} (${n})`);
  else assert.ok(n >= 20 && n <= 60, `${q} (${n})`);
}
assert.equal(modelFor('Do you like music?')?.model.startsWith('Yes'), true);
assert.equal(modelFor('Nomalum savol?'), null);
console.log('speakingModels.test: OK', Object.keys(speakingModels).length + Object.keys(easyModels).length, 'ta namuna');
