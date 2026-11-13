import assert from 'node:assert/strict';
import { ApiError, DUEL_MAX_PLAYERS, DUEL_TTL, DUEL_WORDS, MAX_DELTA_PER_HOUR, MAX_DELTA_PER_SYNC, createDb, createDuel, getDuel, join, leaderboard, submitDuel, sync, weekStart } from './db';

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

// ---- Duel ----
const D = Date.UTC(2026, 10, 14, 10, 0, 0);
const duel = createDuel(db, a.token, D);
assert.equal(duel.words.length, DUEL_WORDS);
assert.equal(new Set(duel.words).size, DUEL_WORDS);
assert.match(duel.code, /^[A-HJ-NP-Z2-9]{6}$/);
let info = getDuel(db, duel.code.toLowerCase(), a.token, D); // kichik harf ham ishlaydi
assert.equal(info.players.length, 1);
assert.equal(info.players[0].score, null);
assert.throws(() => getDuel(db, 'NOPE22', undefined, D), (e) => e instanceof ApiError && e.status === 404);
// Yaroqsiz natijalar
const bad = (score: number, c: number, ms: number) => assert.throws(() => submitDuel(db, b.token, duel.code, score, c, ms, D + 1000), (e) => e instanceof ApiError && e.status === 400);
bad(9999, 10, 30_000); // juda katta ball
bad(500, 10, 30_000);  // juda kichik ball (10 to'g'ri bo'lsa kamida 1000)
bad(100, 1, 1000);     // juda tez
bad(100, 11, 30_000);  // 10 dan ko'p to'g'ri
// To'g'ri topshirish
info = submitDuel(db, b.token, duel.code, 1200, 10, 40_000, D + 2000);
assert.equal(info.players.find((p) => p.me)?.rank, 1);
assert.throws(() => submitDuel(db, b.token, duel.code, 1200, 10, 40_000, D + 3000), (e) => e instanceof ApiError && e.status === 409); // ikkinchi marta
info = submitDuel(db, a.token, duel.code, 1300, 10, 50_000, D + 4000);
assert.deepEqual(info.players.map((p) => p.nickname), ['Aziz', 'Dilnoza']); // yuqori ball birinchi
assert.equal(info.players[0].rank, 1);
assert.ok(!JSON.stringify(info).includes(a.token), 'token oshkor bo‘lmasin');
// Teng ball: tezroq yutadi
const d2 = createDuel(db, a.token, D);
submitDuel(db, a.token, d2.code, 1000, 10, 60_000, D);
submitDuel(db, b.token, d2.code, 1000, 10, 45_000, D);
assert.equal(getDuel(db, d2.code, undefined, D).players[0].nickname, 'Dilnoza');
// Muddat tugashi
assert.throws(() => submitDuel(db, b.token, createDuel(db, a.token, D).code, 100, 1, 5000, D + DUEL_TTL + 1), (e) => e instanceof ApiError && e.status === 410);
// Soatlik limit va to'lib qolish
for (let i = 0; i < 7; i++) createDuel(db, a.token, D); // oldin 3 ta ochilgan, jami 10 ta
assert.throws(() => createDuel(db, a.token, D), (e) => e instanceof ApiError && e.status === 429);
const d3 = createDuel(db, b.token, D + 7_200_000);
for (let i = 0; i < DUEL_MAX_PLAYERS - 1; i++) { const x = join(db, `Bot${i}`, D); submitDuel(db, x.token, d3.code, 100, 1, 5000, D + 7_200_000); }
assert.throws(() => submitDuel(db, a.token, d3.code, 100, 1, 5000, D + 7_200_000), (e) => e instanceof ApiError && e.status === 409);
console.log('db.test: OK');
