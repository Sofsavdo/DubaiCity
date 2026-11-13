import assert from 'node:assert/strict';
import { ApiError, MAX_DELTA_PER_HOUR, MAX_DELTA_PER_SYNC, createDb, join, leaderboard, sync, weekStart } from './db';

const db = createDb();
const T0 = Date.UTC(2026, 10, 13, 12, 0, 0); // juma

const a = join(db, '  Aziz  ', T0);
assert.equal(a.nickname, 'Aziz');
assert.throws(() => join(db, 'aziz', T0), (e) => e instanceof ApiError && e.status === 409); // katta-kichik harf farqsiz
assert.throws(() => join(db, 'x', T0), (e) => e instanceof ApiError && e.status === 400);
assert.throws(() => join(db, '<script>', T0), (e) => e instanceof ApiError && e.status === 400);
const b = join(db, 'Dilnoza', T0);

// Oddiy sinxron
let r = sync(db, a.token, 120, 2, T0);
assert.deepEqual(r, { xp: 120, accepted: 120 });
// Qayta yuborish: o'sish yo'q
r = sync(db, a.token, 120, 2, T0 + 1000);
assert.equal(r.accepted, 0);
// Aldov: bir so'rovda katta sakrash cheklanadi
r = sync(db, a.token, 999_999, 2, T0 + 2000);
assert.equal(r.accepted, MAX_DELTA_PER_SYNC);
// Soatlik chegara
let total = 120 + MAX_DELTA_PER_SYNC;
for (let i = 0; i < 6; i++) { r = sync(db, a.token, 999_999, 2, T0 + 3000 + i); total += r.accepted; }
assert.ok(total <= MAX_DELTA_PER_HOUR, `soatlik chegara buzildi: ${total}`);
// Soat o'tgach yana qabul qilinadi
r = sync(db, a.token, 999_999, 2, T0 + 3_700_000);
assert.ok(r.accepted > 0);
// Noto'g'ri token
assert.throws(() => sync(db, 'yo‘q', 10, 0, T0), (e) => e instanceof ApiError && e.status === 401);
// Manfiy / NaN qiymatlar
assert.equal(sync(db, b.token, -5, -3, T0).xp, 0);
assert.equal(sync(db, b.token, NaN, NaN, T0).xp, 0);

// Reyting
sync(db, b.token, 50, 1, T0 + 10_000);
const lb = leaderboard(db, 'week', b.token, T0 + 20_000);
assert.equal(lb.top[0].nickname, 'Aziz');
assert.equal(lb.top[1].nickname, 'Dilnoza');
assert.equal(lb.me?.rank, 2);
assert.ok(!JSON.stringify(lb).includes(a.token), 'token oshkor bo‘lmasin');
// Hafta chegarasi: o'tgan haftadagi XP haftalik jadvalga kirmaydi
const nextWeek = weekStart(T0) + 8 * 86_400_000;
assert.equal(leaderboard(db, 'week', undefined, nextWeek).top.length, 0);
assert.equal(leaderboard(db, 'all', undefined, nextWeek).top.length, 2);
assert.equal(new Date(weekStart(T0)).getUTCDay(), 1);
console.log('db.test: OK');
