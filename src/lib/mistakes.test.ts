import assert from 'node:assert/strict';
const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k), clear: () => mem.clear(), key: () => null, length: 0 } as Storage;
const M = await import('./mistakes');
const T0 = Date.UTC(2026, 10, 14, 9);

const a = M.addMistake('coach', { kind: 'fix', wrong: 'he go', right: 'he goes', whyUz: '-s' }, ['G.sva'], T0);
assert.equal(M.dueMistakes(T0).length, 1);
M.addMistake('writing', { kind: 'fix', wrong: 'He go', right: 'he goes.', whyUz: '-s' }, ['G.sva'], T0 + 1);
assert.equal(M.load().length, 1, 'same mistake is not duplicated (normalised)');
assert.throws(() => M.addMistake('coach', { kind: 'fix', wrong: 'ok', right: 'OK', whyUz: '' }, [], T0));
// scheduling: 1, 3 days, then resolved after 3 correct; a wrong answer resets
let m = M.reviewed(a, true, T0); assert.equal(m.due, T0 + 86_400_000); assert.equal(m.streak, 1);
m = M.reviewed(m, true, m.due); assert.equal(m.streak, 2);
const wrong = M.reviewed(m, false, m.due); assert.equal(wrong.streak, 0); assert.equal(wrong.due, m.due + M.RETRY_MS);
m = M.reviewed(m, true, m.due); assert.ok(m.resolvedAt, 'resolved after 3 correct in a row');
// persistence and re-open
M.recordReview(a.id, true, T0); M.recordReview(a.id, true, T0 + 2 * 86_400_000); M.recordReview(a.id, true, T0 + 9 * 86_400_000);
assert.equal(M.openMistakes().length, 0);
M.addMistake('coach', { kind: 'fix', wrong: 'he go', right: 'he goes', whyUz: '-s' }, ['G.sva'], T0 + 10 * 86_400_000);
assert.equal(M.openMistakes().length, 1, 'repeating a resolved mistake re-opens it');
// fix checking
const f = { kind: 'fix' as const, wrong: 'he go', right: 'he goes', whyUz: '' };
assert.ok(M.checkFix(f, 'My brother, he goes to work.')); assert.ok(!M.checkFix(f, 'he go to work')); assert.ok(!M.checkFix(f, 'she works'));
assert.ok(M.checkFix({ kind: 'fix', wrong: 'I very like', right: 'I really like', whyUz: '' }, 'I really like it'));
assert.ok(M.checkFix({ kind: 'fix', wrong: 'discuss about', right: 'discuss', whyUz: '' }, 'We discuss the plan'), 'right phrase contained in wrong one');
assert.ok(!M.checkFix({ kind: 'fix', wrong: 'discuss about', right: 'discuss', whyUz: '' }, 'We discuss about the plan'));
// other kinds dedupe by reference
M.addMistake('lesson', { kind: 'lesson', lessonId: 'a1-u1-l1', part: 'check', index: 2 }, [], T0); M.addMistake('lesson', { kind: 'lesson', lessonId: 'a1-u1-l1', part: 'check', index: 2 }, [], T0);
M.addMistake('grammar', { kind: 'grammar', grammarId: 5 }, [], T0);
assert.equal(M.openMistakes().length, 3);
console.log('mistakes.test: OK');
