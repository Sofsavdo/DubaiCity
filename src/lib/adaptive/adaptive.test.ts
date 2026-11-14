import assert from 'node:assert/strict';
import { PARAMS, newRecord, update, effectiveMastery, stateOf, reviewIntervalDays, type MasteryRecord } from './mastery';
import { validateGraph, uncoveredTaxonomy } from './graph';
import { planDay, explain, adjustLoad, scoreNode, type LearnerState } from './recommend';
import { PILOT } from '../../content/curriculum/pilot';
import { TAXONOMY_IDS, isTaxonomyId } from './taxonomy';
import type { CurriculumNode } from '../../content/curriculum/types';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 0, 1, 9);
const dk = (t: number): string => new Date(t).toISOString().slice(0, 10);
const att = (r: MasteryRecord, correct: boolean, t: number, d = 0.5) => update(r, { correct, difficulty: d, now: t, dayKey: dk(t) });

// seeded PRNG for reproducible property tests
let seed = 12345; const rnd = (): number => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };

// --- taxonomy
assert.equal(TAXONOMY_IDS.length, 28); assert.ok(isTaxonomyId('G.article')); assert.ok(!isTaxonomyId('G.nope'));

// --- mastery: bounds, monotonicity, no instant mastery
let r = newRecord(); assert.equal(stateOf(r, T0), 'new');
const r1 = att(r, true, T0);
assert.ok(r1.m > 0 && r1.m <= 1); assert.notEqual(stateOf(r1, T0), 'mastered');
const w = att(r1, false, T0 + 1000); assert.ok(w.m <= r1.m, 'wrong never raises'); assert.equal(w.streak, 0);
let t = T0; let rr = newRecord();
for (let i = 0; i < 40; i++) { const next = att(rr, true, t); assert.ok(next.m >= effectiveMastery(rr, t) - 1e-12, 'correct never lowers'); rr = next; t += 1000; }
assert.notEqual(stateOf(rr, t), 'mastered', 'all on one day => distinctDays 1 < 3');
rr = newRecord(); t = T0; for (let i = 0; i < 12; i++) { rr = att(rr, true, t); t += DAY; }
assert.equal(stateOf(rr, t - DAY), 'mastered', 'spaced correct answers over days reach mastered');
// fast-guess weighting
const slow = update(newRecord(), { correct: true, difficulty: 0.5, now: T0, dayKey: dk(T0), responseMs: 5000, typicalMs: 5000 });
const fast = update(newRecord(), { correct: true, difficulty: 0.5, now: T0, dayKey: dk(T0), responseMs: 500, typicalMs: 5000 });
assert.ok(fast.m < slow.m && Math.abs(fast.m - slow.m / 2) < 1e-9);
// decay
assert.ok(effectiveMastery(rr, t + 60 * DAY) < effectiveMastery(rr, t));
assert.equal(effectiveMastery(newRecord(), T0), 0);
// needs_revision after long gap
assert.equal(stateOf(rr, t + 400 * DAY), 'needs_revision');
// interval: resets on error, caps at 180 d, grows with streak
assert.equal(reviewIntervalDays(5, 1, false), 1);
assert.ok(reviewIntervalDays(3, 0.8, true) > reviewIntervalDays(1, 0.8, true));
assert.equal(reviewIntervalDays(20, 1, true), PARAMS.maxIntervalDays);
assert.equal(att(att(newRecord(), true, T0), false, T0 + 1).dueAt, T0 + 1 + DAY);
// property: 10^4 random histories keep invariants
for (let h = 0; h < 10_000; h++) {
  let x = newRecord(); let tt = T0; let prevEff = 0;
  const len = 1 + Math.floor(rnd() * 25);
  for (let i = 0; i < len; i++) {
    tt += Math.floor(rnd() * 3 * DAY); const ok = rnd() < 0.6;
    const base = effectiveMastery(x, tt);
    x = att(x, ok, tt, rnd());
    assert.ok(x.m >= 0 && x.m <= 1 && Number.isFinite(x.m));
    if (ok) assert.ok(x.m >= base - 1e-12); else assert.ok(x.m <= base + 1e-12);
    if (stateOf(x, tt) === 'mastered') assert.ok(x.attempts >= 5 && x.distinctDays >= 3);
    prevEff = effectiveMastery(x, tt); assert.ok(prevEff <= x.m + 1e-12);
  }
}

// --- graph
assert.deepEqual(validateGraph(PILOT), []);
const bad: CurriculumNode[] = [
  { ...PILOT[0]!, id: 'x', prerequisites: ['y'] }, { ...PILOT[0]!, id: 'y', prerequisites: ['x'] },
  { ...PILOT[0]!, id: 'z', objective: ' ', hasCheck: false, prerequisites: ['nope'] },
];
const probs = validateGraph(bad).join('|');
assert.match(probs, /cycle/); assert.match(probs, /missing objective/); assert.match(probs, /no mastery check/); assert.match(probs, /unknown prerequisite nope/);
assert.match(validateGraph([{ ...PILOT[0]!, id: 'hi', level: 'B2', prerequisites: [] }]).join(), /not reachable from an A1 root/);
const gap = uncoveredTaxonomy(PILOT); assert.ok(gap.length > 0 && gap.includes('P.stress'), 'coverage gap is reported'); assert.ok(!gap.includes('G.article'));

// --- recommendations
const baseState = (over: Partial<LearnerState> = {}): LearnerState => ({ mastery: {}, recentErrors: [], goalTags: ['general'], now: T0, ...over });
const opt = { minutes: 60, allowStatuses: ['draft' as const] };
assert.deepEqual(planDay(PILOT, baseState(), { minutes: 60 }), [], 'draft content is never planned by default');
const p1 = planDay(PILOT, baseState(), opt);
assert.ok(p1.length > 0 && p1.every((x) => x.minutes > 0));
assert.deepEqual(p1, planDay(PILOT, baseState(), opt), 'deterministic');
assert.ok(p1.every((x) => !PILOT.find((n) => n.id === x.nodeId)!.prerequisites.length), 'fresh learner only gets roots');
assert.ok(p1.reduce((s, x) => s + x.minutes, 0) <= 60);
assert.ok(p1.every((x) => explain(x).length > 0));
// prerequisites unlock after mastery
let m: Record<string, MasteryRecord> = {};
for (const id of ['a1.be.present', 'a1.articles.basic']) { let q = newRecord(); for (let i = 0; i < 8; i++) q = att(q, true, T0 - 3 * DAY + i * 1000, 0.5); m[id] = q; }
const p2 = planDay(PILOT, baseState({ mastery: m }), opt).map((x) => x.nodeId);
assert.ok(p2.some((id) => id === 'a2.past.simple' || id === 'a1.plurals'), 'newly unlocked nodes can be planned');
for (const id of p2) for (const pre of PILOT.find((x) => x.id === id)!.prerequisites) assert.ok(effectiveMastery(m[pre] ?? newRecord(), T0) >= 0.6, 'every planned node has mastered prerequisites');
assert.ok(!p2.includes('a2.speaking.routine'), 'unmet prerequisite never scheduled');
// repeated errors raise priority and explain why
const withErr = baseState({ mastery: m, recentErrors: ['G.preposition', 'G.preposition', 'G.preposition'] });
const sc = scoreNode(PILOT.find((x) => x.id === 'a2.prepositions.place')!, withErr);
assert.equal(sc.reason, 'repeated_error'); assert.match(explain({ nodeId: 'a2.prepositions.place', minutes: 10, score: sc.score, reason: sc.reason, params: sc.params, isNew: true }), /G\.preposition/);
const first = planDay(PILOT, withErr, opt)[0]!;
assert.equal(first.nodeId, 'a2.prepositions.place', 'repeated-error node ranks first among new nodes');
// due revision goes first
const due: Record<string, MasteryRecord> = { ...m, 'a1.be.present': { ...m['a1.be.present']!, dueAt: T0 - 2 * DAY } };
assert.equal(planDay(PILOT, baseState({ mastery: due }), opt)[0]!.nodeId, 'a1.be.present');
assert.equal(planDay(PILOT, baseState({ mastery: due }), opt)[0]!.reason, 'revision_due');
// ≤ 1 new node per 3 slots
const many: CurriculumNode[] = Array.from({ length: 6 }, (_, i) => ({ ...PILOT[0]!, id: `n${i}`, prerequisites: [] }));
assert.equal(planDay(many, baseState(), { minutes: 600, allowStatuses: ['draft'] }).length, 6, 'cold start: cap lifted');
// with practised nodes present, new nodes are capped at 1 per 3 slots
const practised: Record<string, MasteryRecord> = {}; for (let i = 0; i < 3; i++) { let q = newRecord(); for (let j = 0; j < 3; j++) q = att(q, true, T0 - DAY + j * 1000); practised[`p${i}`] = { ...q, dueAt: T0 - DAY }; }
const mixed: CurriculumNode[] = [...Array.from({ length: 3 }, (_, i) => ({ ...PILOT[0]!, id: `p${i}`, prerequisites: [] })), ...many];
const mp = planDay(mixed, baseState({ mastery: practised }), { minutes: 600, allowStatuses: ['draft'] });
assert.equal(mp.filter((x) => x.isNew).length, Math.floor((mp.length + 2) / 3), 'new-node cap holds'); assert.ok(mp.filter((x) => !x.isNew).length === 3);
// exam proximity
const examState = baseState({ mastery: { ...m }, goalTags: ['ielts-writing-2'], examDate: T0 + 10 * DAY });
const w2 = scoreNode(PILOT.find((x) => x.id === 'b1.writing.opinion')!, examState);
assert.ok(w2.score > scoreNode(PILOT.find((x) => x.id === 'b1.writing.opinion')!, baseState()).score);
// load adjustment
assert.deepEqual(adjustLoad({ slots: 4, difficultyStep: 0 }, 0.5, 0.9), { slots: 3, difficultyStep: 1 });
assert.deepEqual(adjustLoad({ slots: 1, difficultyStep: 0 }, 0.1, 0.1), { slots: 1, difficultyStep: 0 });
console.log('adaptive.test: OK');
