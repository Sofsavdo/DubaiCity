import assert from 'node:assert/strict';
import { dailyTasks, dayIndex, endOfDay, homeworkStreak, timeLeft } from './homework';
import type { ResultRecord } from './storage';
import { listeningTests } from '../content/listeningTests';

const noon = new Date(2026, 5, 10, 12, 0).getTime();
const r = (kind: ResultRecord['kind'], title: string, at: number): ResultRecord => ({ id: title + at, kind, title, correct: 1, total: 1, date: new Date(at).toISOString() });
const t = dailyTasks('B1', [], noon);
assert.deepEqual(t.map((x) => x.id), ['listening', 'reading', 'writing', 'speaking']);
assert.ok(t.every((x) => !x.done && x.deadline === endOfDay(noon)));
// Bir kunda bir xil, ertasi kuni boshqa
assert.deepEqual(dailyTasks('B1', [], noon + 3_600_000).map((x) => x.href), t.map((x) => x.href));
assert.notDeepEqual(dailyTasks('B1', [], noon + 86_400_000).map((x) => x.sub), t.map((x) => x.sub));
// Daraja bo'yicha: A2 foydalanuvchiga A2 yoki B1 listening beriladi (C1 emas)
for (let d = 0; d < 10; d++) { const href = dailyTasks('A2', [], noon + d * 86_400_000)[0].href; const test = listeningTests.find((x) => href.endsWith(x.id))!; assert.ok(['A1', 'A2', 'B1'].includes(test.level), `A2 → ${test.level}`); }
// Bajarilganlik: aynan tayinlangan test nomi bilan, bugun
const L = listeningTests.find((x) => t[0].href.endsWith(x.id))!;
const done = dailyTasks('B1', [r('listening', L.title, noon + 1000), r('speaking', 'Speaking: jonli suhbat', noon + 2000)], noon + 5000);
assert.equal(done[0].done, true); assert.equal(done[3].done, true); assert.equal(done[1].done, false);
// Boshqa test yoki kechagi natija hisoblanmaydi
assert.equal(dailyTasks('B1', [r('listening', 'Boshqa test', noon)], noon)[0].done, false);
assert.equal(dailyTasks('B1', [r('listening', L.title, noon - 86_400_000)], noon)[0].done, false);
// Easy daraja: sodda Speaking kartasi
assert.ok(dailyTasks('A1', [], noon)[3].sub.includes('Describe'));
// Seriya va qolgan vaqt
assert.equal(homeworkStreak([r('reading', 'a', noon), r('reading', 'b', noon - 86_400_000), r('reading', 'c', noon - 3 * 86_400_000)], noon), 2);
assert.equal(homeworkStreak([], noon), 0);
assert.equal(homeworkStreak([r('reading', 'a', noon - 86_400_000)], noon), 1, 'bugun hali bajarilmagan bo‘lsa, kechagi seriya yo‘qolmaydi');
assert.ok(timeLeft(noon + 90 * 60_000, noon).startsWith('1 soat 30'));
assert.ok(dayIndex(noon) > 0);
console.log('homework.test: OK');
