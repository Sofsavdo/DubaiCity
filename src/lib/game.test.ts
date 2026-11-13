import assert from 'node:assert/strict';
import { applyXp, daysBetween, levelFromXp, levelProgress, nextStreak, xpForLevel } from './game';
import { INTERVALS, isMastered, pickSession, review } from './srs';
import { defaultProfile, type CardState } from './types';

// Kunlar va seriya
assert.equal(daysBetween('2026-02-28', '2026-03-01'), 1);
assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1);
assert.equal(nextStreak(null, '2026-11-13', 0), 1);
assert.equal(nextStreak('2026-11-13', '2026-11-13', 4), 4);
assert.equal(nextStreak('2026-11-12', '2026-11-13', 4), 5);
assert.equal(nextStreak('2026-11-10', '2026-11-13', 4), 1);

// Daraja
assert.equal(levelFromXp(0), 1);
assert.equal(levelFromXp(49), 1);
assert.equal(levelFromXp(50), 2);
assert.equal(levelFromXp(200), 3);
assert.equal(xpForLevel(3), 200);
const lp = levelProgress(125);
assert.equal(lp.level, 2);
assert.equal(lp.into, 75);
assert.equal(lp.span, 150);

// XP, kunlik hisob, yutuqlar
const t1 = '2026-11-13';
let p = defaultProfile(t1);
let r = applyXp(p, 30, t1);
assert.equal(r.profile.xp, 30);
assert.equal(r.profile.streak, 1);
assert.ok(r.unlocked.some((a) => a.id === 'first-xp'));
assert.equal(r.levelUp, null);
r = applyXp(r.profile, 30, t1);
assert.equal(r.profile.dailyXp, 60);
assert.ok(r.profile.achievements.includes('daily-goal'));
assert.equal(r.levelUp, 2);
// Ertasi kuni: kunlik hisob nolga tushadi, seriya oshadi
r = applyXp(r.profile, 10, '2026-11-14');
assert.equal(r.profile.dailyXp, 10);
assert.equal(r.profile.streak, 2);
assert.equal(r.profile.longestStreak, 2);
// Yutuq ikki marta berilmaydi
const again = applyXp(r.profile, 5, '2026-11-14');
assert.equal(again.unlocked.filter((a) => a.id === 'first-xp').length, 0);
// Manfiy XP qo'shilmaydi
assert.equal(applyXp(p, -50, t1).profile.xp, 0);

// SRS
const now = 1_000_000;
let c = review(undefined, true, now);
assert.equal(c.box, 1);
assert.equal(c.due, now + INTERVALS[1]);
c = review(c, true, now);
assert.equal(c.box, 2);
c = review(c, false, now);
assert.equal(c.box, 0);
assert.equal(c.wrong, 1);
assert.equal(c.due, now);
let m: CardState | undefined;
for (let i = 0; i < 10; i++) m = review(m, true, now);
assert.equal(m!.box, 5);
assert.ok(isMastered(m));
assert.ok(!isMastered(c));

// Sessiya tanlash
const ids = Array.from({ length: 20 }, (_, i) => `w${i}`);
const srs: Record<string, CardState> = {
  w0: { box: 1, due: now - 10, seen: 1, correct: 1, wrong: 0 }, // muddati kelgan
  w1: { box: 3, due: now + 10 * 86_400_000, seen: 3, correct: 3, wrong: 0 }, // kelmagan
  w2: { box: 0, due: now - 5, seen: 2, correct: 0, wrong: 2 }, // muddati kelgan, eng past quti
};
const s = pickSession(ids, srs, now, 10, () => 0.5);
assert.equal(s.length, 10);
assert.ok(s.includes('w0') && s.includes('w2'));
assert.ok(!s.includes('w1'));
assert.ok(s.indexOf('w2') < s.indexOf('w0')); // past quti oldinroq
assert.equal(new Set(s).size, s.length);
console.log('game.test: OK');
