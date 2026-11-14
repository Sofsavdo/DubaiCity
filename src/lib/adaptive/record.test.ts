import assert from 'node:assert/strict';
// minimal localStorage shim for Node
const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k), clear: () => mem.clear(), key: () => null, length: 0 } as Storage;
const { recordGrammarItem, recordPracticeItem, recordWordItem } = await import('./record');
const { loadAdaptive } = await import('./store');
const { grammar } = await import('../../content/grammar');
const { exercises } = await import('../../content/practice');
const { vocab } = await import('../../content/vocab');
const { nodeForGrammarTopic, nodeForPracticeTopic, vocabNodeForLevel } = await import('../../content/curriculum/inventory');

const g = grammar[0]!; recordGrammarItem(g.id, false);
let s = loadAdaptive(); const gn = nodeForGrammarTopic(g.topic)!;
assert.equal(s.mastery[gn]!.attempts, 1); assert.ok(s.errors.length > 0, 'wrong answer logs taxonomy');
const ex = exercises.find((e) => nodeForPracticeTopic(e.topic))!; recordPracticeItem(ex.id, true);
s = loadAdaptive(); assert.equal(s.mastery[nodeForPracticeTopic(ex.topic)!]!.attempts >= 1, true);
const unmapped = exercises.find((e) => !nodeForPracticeTopic(e.topic))!; const before = JSON.stringify(loadAdaptive());
recordPracticeItem(unmapped.id, false); assert.equal(JSON.stringify(loadAdaptive()), before, 'unmapped practice topic is ignored, not guessed');
const w = vocab[0]!; recordWordItem(w.id, false, 'spelling');
s = loadAdaptive(); assert.equal(s.mastery[vocabNodeForLevel(w.level)!]!.attempts, 1); assert.equal(s.errors.at(-1), 'V.spelling');
recordWordItem('no-such-word', true); recordGrammarItem(-1, true); // unknown ids are ignored
// corrupted storage falls back safely
mem.set('bandly.mastery.v1', '{bad json'); assert.deepEqual(loadAdaptive(), { v: 1, mastery: {}, errors: [] });
console.log('record.test: OK');
