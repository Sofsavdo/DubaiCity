import assert from 'node:assert/strict';
import type { ResultRecord } from './storage';
import { BAND_CAP, LEVEL_BAND, capBand, currentBand, gain, hoursNeeded, lastDays, skillBands, studyPlan } from './progress';

const r = (kind: ResultRecord['kind'], band: number, day = 1): ResultRecord => ({ id: String(day) + kind + band, kind, title: 't', correct: 1, total: 1, band, date: `2026-01-0${day}T00:00:00Z` });
// Bandni darajaga ko'ra chegaralash
assert.equal(capBand(9, 'A2'), 4.5); assert.equal(capBand(4, 'A2'), 4); assert.equal(capBand(6, 'B2'), 6); assert.equal(capBand(9, undefined), 9);
assert.ok(BAND_CAP.A2 < BAND_CAP.B1 && BAND_CAP.B2 < BAND_CAP.C1 && LEVEL_BAND.A1 < LEVEL_BAND.C1);
// Ko'nikmalar bo'yicha o'rtacha: eng yangi 3 ta (results yangi-birinchi tartibda)
const res = [r('reading', 6, 5), r('reading', 5.5, 4), r('reading', 5, 3), r('reading', 1, 2), r('listening', 6.5, 5)];
const sb = skillBands(res); assert.equal(sb.reading, 5.5); assert.equal(sb.listening, 6.5); assert.equal(sb.speaking, undefined);
const base = { level: 'B1' as const, checkpoints: [{ at: 'x', level: 'B1' as const, band: 5 }], baselineBand: 5, target: 6.5 };
assert.equal(currentBand(base, res), 6, '(5.5+6.5)/2');
assert.equal(currentBand(base, []), 5, 'natija yo‘q: daraja aniqlash natijasi');
assert.equal(currentBand({ level: null, checkpoints: [] }, []), null);
assert.equal(currentBand(base, [r('speaking', 6)]), 5.5, 'bitta ko‘nikma: checkpoint bilan o‘rtacha');
// O'sish
const g = gain(base, res); assert.equal(g.baseline, 5); assert.equal(g.current, 6); assert.equal(g.delta, 1); assert.equal(g.toTarget, 0.5);
assert.equal(gain({ ...base, baselineBand: null }, res).delta, null);
// Soat va reja
assert.equal(hoursNeeded(5, 6), 150); assert.equal(hoursNeeded(6, 5), 0);
const plan = studyPlan({ ...base, examDate: null }, res, Date.parse('2026-02-01'), 60);
assert.equal(plan.hours, 75); assert.equal(plan.minutesPerDay, 60); assert.equal(plan.weeksNeeded, 11);
assert.deepEqual(plan.focus[0], 'reading', 'eng zaif ko‘nikma birinchi');
const tight = studyPlan({ ...base, target: 8, examDate: '2026-02-11' }, res, Date.parse('2026-02-01'));
assert.ok(tight.minutesPerDay >= 180 && tight.realistic === false, 'qisqa muddatda reja real emasligi aytiladi');
const loose = studyPlan({ ...base, target: 6.5, examDate: '2026-08-01' }, res, Date.parse('2026-02-01'));
assert.ok(loose.minutesPerDay === 25 && loose.realistic);
// Faollik
const ld = lastDays({ '2026-02-01': 40, '2026-01-30': 10 }, 3, Date.parse('2026-02-01T10:00:00Z'));
assert.deepEqual(ld.map((d) => d.xp), [10, 0, 40]);
console.log('progress.test: OK');
