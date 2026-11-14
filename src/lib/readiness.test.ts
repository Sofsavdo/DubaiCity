import assert from 'node:assert/strict';
import { readiness } from './readiness';
import type { ResultRecord } from './storage';

const r = (kind: ResultRecord['kind'], band?: number): ResultRecord => ({ id: Math.random().toString(), kind, title: 't', correct: 1, total: 1, band, date: '2026-11-14' });
const now = Date.UTC(2026, 10, 14);

let x = readiness([], 7, null, now);
assert.equal(x.confidence, 'none'); assert.equal(x.overall, null); assert.equal(x.weakest, 'reading'); assert.equal(x.gap, null);

x = readiness([r('reading', 6), r('grammar'), r('writing')], 7, null, now);
assert.equal(x.skills.reading.band, 6); assert.equal(x.overall, null, 'one skill is not enough for an overall estimate'); assert.equal(x.confidence, 'low');
assert.equal(x.weakest, 'listening', 'a skill without evidence is the weakest');

x = readiness([r('reading', 6), r('reading', 6.5), r('listening', 5), r('listening', 5.5)], 7, '2026-12-14', now);
assert.equal(x.skills.reading.band, 6.5); assert.equal(x.skills.listening.band, 5.5); // 6.25 → 6.5, 5.25 → 5.5 (round half)
assert.equal(x.overall, 6); assert.equal(x.confidence, 'medium'); assert.equal(x.gap, 1); assert.equal(x.daysToExam, 30);
assert.equal(x.weakest, 'speaking');

const many = [...Array(3)].flatMap(() => [r('reading', 7), r('listening', 6), r('speaking', 6.5)]);
x = readiness(many, 6, null, now);
assert.equal(x.confidence, 'good'); assert.equal(x.gap, 0, 'no negative gap'); assert.equal(x.weakest, 'listening');
// only the last 3 results count (results are stored newest first)
x = readiness([r('reading', 8), r('reading', 8), r('reading', 8), r('reading', 3), r('listening', 5)], 7, null, now);
assert.equal(x.skills.reading.band, 8); assert.equal(x.skills.reading.evidence, 3);
console.log('readiness.test: OK');
