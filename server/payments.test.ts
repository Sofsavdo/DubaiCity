import assert from 'node:assert/strict';
import { ApiError, createDb, join } from './db';
import { HamyonError, hamyonApi, hamyonConfigFromEnv, hamyonSign, verifySign, type Created, type HamyonApi, type HamyonStatus } from './hamyon';
import { MAX_OPEN_PER_PLAYER, applyResult, cancelPayment, createPayment, entitlements, extend, findByCallback, grant, markPrepared, reconcile, statusFor } from './payments';
import { monthlyPrice, priceFor } from './pricing';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 0, 1);
const cfg = { shopId: '77', shopKey: 'secret', baseUrl: 'https://h.test' };

// ---- Narx ----
assert.equal(priceFor('exam', 30, {}), 149_000);
assert.equal(priceFor('grammar', 90, {}), 198_000, '3 oy = 2.5 oylik, 1000 ga yaxlitlangan');
assert.equal(priceFor('mocks', 30, { PRICE_MOCKS: '120000' }), 120_000);
assert.equal(monthlyPrice('exam', { PRICE_EXAM: 'abc' }), 149_000, 'noto‘g‘ri env e’tiborsiz');
assert.throws(() => priceFor('exam', 7, {}));

// ---- Imzo ----
assert.equal(hamyonSign(cfg, 'p1', '79000'), hamyonSign(cfg, 'p1', 79000));
const form = { shop_id: '77', payment_id: 'p1', amount: '79000', sign: hamyonSign(cfg, 'p1', '79000') };
assert.equal(verifySign({ ...cfg }, form), true);
assert.equal(verifySign({ ...cfg }, { ...form, amount: '1000' }), false, 'summa o‘zgartirilsa imzo yaroqsiz');
assert.equal(verifySign({ ...cfg }, { ...form, shop_id: '78' }), false);
assert.equal(verifySign({ ...cfg }, { ...form, sign: '' }), false);
assert.equal(hamyonConfigFromEnv({}), null);
assert.equal(hamyonConfigFromEnv({ HAMYON_SHOP_ID: '1', HAMYON_SHOP_KEY: 'k' })?.baseUrl, 'https://hamyon-api.uz');

// ---- Hamyon mijozi (soxta fetch): band summa 1 so'mdan oshiriladi ----
{
  const sent: string[] = [];
  const fakeFetch = (async (url: string, init?: { body?: URLSearchParams }) => {
    if (String(url).endsWith('/payment/create')) {
      const amt = Number(init!.body!.get('amount')); sent.push(String(amt));
      if (amt < 79_002) return new Response(JSON.stringify({ error: 'Bu summa uchun ochiq to‘lov mavjud' }), { status: 400 });
      return new Response(JSON.stringify({ payment_id: 'H1', card: '8600123412341234', amount: amt, expires_in: 300 }), { status: 200 });
    }
    if (String(url).includes('/payment/status')) return new Response(JSON.stringify({ status: 'paid', amount: 79002, shop_id: '77' }), { status: 200 });
    return new Response('{}', { status: 200 });
  }) as unknown as typeof fetch;
  const api = hamyonApi({ ...cfg, fetchImpl: fakeFetch });
  const c = await api.create('o1', 79_000);
  assert.deepEqual(sent, ['79000', '79001', '79002']); assert.equal(c.amount, 79_002); assert.equal(c.card, '8600123412341234');
  const c2 = await api.create('o2', 79_000, new Set([79_000, 79_001])); assert.equal(c2.amount, 79_002, 'ma’lum band summalar so‘ralmaydi');
  assert.equal((await api.status('H1')).status, 'paid');
  const bad = hamyonApi({ ...cfg, fetchImpl: (async () => new Response(JSON.stringify({ error: 'xato' }), { status: 400 })) as unknown as typeof fetch });
  await assert.rejects(bad.create('o', 1000), (e) => e instanceof HamyonError && e.message === 'xato');
  const down = hamyonApi({ ...cfg, fetchImpl: (async () => { throw new Error('net'); }) as unknown as typeof fetch });
  await assert.rejects(down.create('o', 1000), HamyonError);
}

// ---- To'lov oqimi (soxta Hamyon) ----
function fake(over: Partial<{ failCreate: boolean; status: HamyonStatus }> = {}) {
  const calls = { create: 0, cancel: 0 }; let n = 0;
  const api: HamyonApi = {
    async create(_o, amount, busy) { calls.create++; if (over.failCreate) throw new HamyonError('down'); let a = amount; while (busy?.has(a)) a++; return { payment_id: `H${++n}`, card: '8600111122223333', amount: a, expire_at: Math.floor(T0 / 1000) + 300 } satisfies Created; },
    async status() { return over.status ?? { status: 'pending', amount: 0, shop_id: '77' }; },
    async cancel() { calls.cancel++; },
  };
  return { api, calls };
}
const db = createDb(':memory:');
const a = join(db, 'Ali', T0), b = join(db, 'Vali', T0);
const f = fake();

const pay1 = await createPayment(db, f.api, a.token, 'grammar', 30, T0, {});
assert.equal(pay1.status, 'pending'); assert.equal(pay1.pay_amount, 79_000); assert.equal(pay1.card, '8600111122223333'); assert.equal(pay1.expires_in, 300);
assert.equal(entitlements(db, a.token, T0).subs.grammar, null, 'to‘lovdan oldin obuna yo‘q');
// Boshqa foydalanuvchi bir xil summa so'rasa, 1 so'm qo'shiladi
const pay2 = await createPayment(db, f.api, b.token, 'grammar', 30, T0, {});
assert.equal(pay2.pay_amount, 79_001);
// Boshqa odamning to'lovini ko'ra olmaydi
await assert.rejects(statusFor(db, f.api, '77', b.token, pay1.id, T0), (e: ApiError) => e.status === 404);
await assert.rejects(cancelPayment(db, f.api, b.token, pay1.id, T0), (e: ApiError) => e.status === 404);

// prepare -> complete(paid), noto'g'ri summa bilan yetkazilmaydi
markPrepared(db, pay1.id, 'H1');
assert.equal((await statusFor(db, null, '77', a.token, pay1.id, T0)).status, 'prepared');
assert.equal(applyResult(db, pay1.id, 'paid', { paidAmount: 1000 }, T0 + 1000), 'mismatch');
assert.equal(entitlements(db, a.token, T0).subs.grammar, null);
assert.equal(applyResult(db, pay1.id, 'paid', { paidAmount: 79_000 }, T0 + 2000), 'delivered');
assert.equal(entitlements(db, a.token, T0 + 3000).subs.grammar, T0 + 2000 + 30 * DAY);
// Hamyon callbackni takrorlasa, obuna ikki marta berilmaydi
assert.equal(applyResult(db, pay1.id, 'paid', { paidAmount: 79_000 }, T0 + 5000), 'already');
assert.equal(entitlements(db, a.token, T0 + 3000).subs.grammar, T0 + 2000 + 30 * DAY);
assert.equal(applyResult(db, 'nope', 'paid', {}), 'missing');
// Obuna tugamay turib yana sotib olinsa, muddat ustiga qo'shiladi
const pay3 = await createPayment(db, f.api, a.token, 'grammar', 90, T0 + 10_000, {});
applyResult(db, pay3.id, 'paid', { paidAmount: pay3.pay_amount! }, T0 + 20_000);
assert.equal(entitlements(db, a.token, T0 + 30_000).subs.grammar, T0 + 2000 + 30 * DAY + 90 * DAY);
// Tugagan obuna ko'rinmaydi
assert.equal(entitlements(db, a.token, T0 + 200 * DAY).subs.grammar, null);
// Boshqa yo'nalishlar mustaqil
assert.equal(entitlements(db, a.token, T0 + 30_000).subs.exam, null);

// Bekor qilish: Hamyon ham yopiladi, keyin kech kelgan to'lov baribir yetkaziladi (pul kelgan)
const pay4 = await createPayment(db, f.api, b.token, 'exam', 30, T0, {});
const c4 = await cancelPayment(db, f.api, b.token, pay4.id, T0 + 1000);
assert.equal(c4.status, 'cancelled'); assert.equal(f.calls.cancel, 1);
assert.equal(applyResult(db, pay4.id, 'paid', { paidAmount: pay4.pay_amount! }, T0 + 2000), 'delivered', 'kech kelgan to‘lov yo‘qolmaydi');
assert.ok(entitlements(db, b.token, T0 + 3000).subs.exam! > T0);
// Cancel callback allaqachon to'langan to'lovni bekor qilmaydi
assert.equal(applyResult(db, pay4.id, 'cancel', {}), 'already');

// Cheklov: bir vaqtda ko'p ochiq to'lov ochib bo'lmaydi
const c = join(db, 'Gulnora', T0);
for (let i = 0; i < MAX_OPEN_PER_PLAYER; i++) await createPayment(db, f.api, c.token, 'mocks', 30, T0, {});
await assert.rejects(createPayment(db, f.api, c.token, 'mocks', 30, T0, {}), (e: ApiError) => e.status === 429);
// Noto'g'ri kirishlar
await assert.rejects(createPayment(db, f.api, c.token, 'hack', 30, T0, {}), (e: ApiError) => e.status === 400);
await assert.rejects(createPayment(db, f.api, c.token, 'mocks', 1, T0, {}), (e: ApiError) => e.status === 400);
await assert.rejects(createPayment(db, f.api, 'yolgon', 'mocks', 30, T0, {}), (e: ApiError) => e.status === 401);

// Hamyon create yiqilsa: to'lov 'failed', foydalanuvchiga tushunarli xato
const d = join(db, 'Dilnoza', T0);
await assert.rejects(createPayment(db, fake({ failCreate: true }).api, d.token, 'exam', 30, T0, {}), (e: ApiError) => e.status === 502);
assert.equal((db.prepare("SELECT status FROM payments WHERE player_id = (SELECT id FROM players WHERE nickname='Dilnoza')").get() as { status: string }).status, 'failed');

// Status so'rovida Hamyondan o'qib yetkazish (callback yo'qolgan holat) va reconcile
const e1 = join(db, 'Eldor', T0);
const pe = await createPayment(db, f.api, e1.token, 'exam', 30, T0, {});
const paidApi = fake({ status: { status: 'paid', amount: pe.pay_amount!, shop_id: '77' } }).api;
const sv = await statusFor(db, paidApi, '77', e1.token, pe.id, T0 + 60_000);
assert.equal(sv.status, 'success', 'callback yo‘qolsa ham status tekshiruvi yetkazadi');
assert.ok(entitlements(db, e1.token, T0 + 61_000).subs.exam);
// reconcile: har bir holat alohida bazada (bir nechta ochiq to'lov bir-biriga aralashmasin)
async function one(status: HamyonStatus, nick: string) {
  const d2 = createDb(':memory:'); const u = join(d2, nick, T0);
  const pp = await createPayment(d2, f.api, u.token, 'exam', 30, T0, {});
  const settled = await reconcile(d2, fake({ status }).api, '77', T0 + 10 * 60_000);
  return { settled, sub: entitlements(d2, u.token, T0 + 11 * 60_000).subs.exam, id: pp.id, d2 };
}
const paid = await one({ status: 'paid', amount: 149_000, shop_id: '77' }, 'Farid');
assert.equal(paid.settled, 1); assert.ok(paid.sub, 'yo‘qolgan callback reconcile orqali yetkazildi');
const otherShop = await one({ status: 'paid', amount: 149_000, shop_id: '999' }, 'Hasan');
assert.equal(otherShop.settled, 0); assert.equal(otherShop.sub, null, 'boshqa do‘kon javobi e‘tiborsiz');
const wrongAmt = await one({ status: 'paid', amount: 1000, shop_id: '77' }, 'Jamol');
assert.equal(wrongAmt.sub, null, 'summa mos kelmasa yetkazilmaydi');
const expired = await one({ status: 'cancel', amount: 0, shop_id: '77' }, 'Karim');
assert.equal(expired.settled, 1); assert.equal(expired.sub, null);
assert.equal((expired.d2.prepare('SELECT status FROM payments WHERE id = ?').get(expired.id) as { status: string }).status, 'cancelled');
// Juda yangi to'lov (2 daqiqadan kam) reconcile da tekshirilmaydi
{ const d3 = createDb(':memory:'); const u = join(d3, 'Lola', T0); await createPayment(d3, f.api, u.token, 'exam', 30, T0, {}); assert.equal(await reconcile(d3, fake({ status: { status: 'paid', amount: 149_000, shop_id: '77' } }).api, '77', T0 + 30_000), 0); }
const h1 = join(db, 'Hasan', T0);
const ph = await createPayment(db, f.api, h1.token, 'exam', 30, T0, {});

// Callbackni topish
const ph2 = findByCallback(db, { order_id: ph.id, payment_id: 'boshqa' });
assert.ok(ph2 === undefined || ph2.id === ph.id);
assert.equal(findByCallback(db, { order_id: 'yoq' }), undefined);

// Qo'lda berish (qo'llab-quvvatlash)
const until = grant(db, 'hasan', 'mocks', 30, T0);
assert.equal(until, T0 + 30 * DAY);
assert.throws(() => grant(db, 'yoq', 'mocks', 30), (e: ApiError) => e.status === 404);
assert.throws(() => grant(db, 'hasan', 'mocks', 9999), (e: ApiError) => e.status === 400);
assert.equal(extend(db, 1, 'exam', 1, T0) > T0, true);
console.log('payments.test: OK');
