import type { DatabaseSync } from 'node:sqlite';
import { randomBytes } from 'node:crypto';
import type { TrackId } from '../src/lib/types';
import { ApiError, byToken } from './db';
import { HamyonError, type HamyonApi } from './hamyon';
import { PERIODS, TRACKS, priceFor } from './pricing';

export const OPEN = ['pending', 'prepared'] as const;
const OPEN_SQL = OPEN.map((s) => `'${s}'`).join(',');
export const MAX_OPEN_PER_PLAYER = 3;
export const MAX_PER_HOUR = 10;
const DAY = 86_400_000;

export interface PaymentRow {
  id: string; player_id: number; track: TrackId; days: number; amount: number;
  hamyon_payment_id: string | null; hamyon_amount: number | null; card: string | null; status: string;
  expire_at: number | null; error: string | null; note: string | null; created_at: number; paid_at: number | null; checked_at: number | null;
}

/** Mijozga ko'rsatiladigan ko'rinish (karta, aniq summa, qolgan vaqt). */
export function view(p: PaymentRow, now = Date.now()) {
  const exp = p.expire_at ?? 0;
  return { id: p.id, status: p.status, track: p.track, days: p.days, amount: p.amount, pay_amount: p.hamyon_amount, card: p.card, expire_at: exp, expires_in: exp ? Math.max(0, exp - Math.floor(now / 1000)) : 0 };
}

const get = (db: DatabaseSync, id: string): PaymentRow | undefined => db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as PaymentRow | undefined;

/** Obunani `days` kunga uzaytiradi (amaldagi muddat tugagandan keyin boshlanadi). */
export function extend(db: DatabaseSync, playerId: number, track: TrackId, days: number, now = Date.now()): number {
  const cur = db.prepare('SELECT until FROM subscriptions WHERE player_id = ? AND track = ?').get(playerId, track) as { until: number } | undefined;
  const until = Math.max(now, cur?.until ?? 0) + days * DAY;
  db.prepare('INSERT INTO subscriptions (player_id, track, until) VALUES (?, ?, ?) ON CONFLICT(player_id, track) DO UPDATE SET until = excluded.until').run(playerId, track, until);
  return until;
}

export function entitlements(db: DatabaseSync, token: string, now = Date.now()): { subs: Record<TrackId, number | null>; now: number; nickname: string } {
  const p = byToken(db, token);
  const rows = db.prepare('SELECT track, until FROM subscriptions WHERE player_id = ?').all(p.id) as { track: TrackId; until: number }[];
  const subs = { exam: null, grammar: null, mocks: null } as Record<TrackId, number | null>;
  for (const r of rows) if (r.until > now) subs[r.track] = r.until;
  return { subs, now, nickname: p.nickname };
}

export async function createPayment(db: DatabaseSync, api: HamyonApi, token: string, track: string, days: number, now = Date.now(), env: NodeJS.ProcessEnv = process.env) {
  const p = byToken(db, token);
  if (!TRACKS.includes(track as TrackId)) throw new ApiError(400, 'Noma’lum yo‘nalish');
  if (!PERIODS.some((x) => x.days === days)) throw new ApiError(400, 'Noma’lum muddat');
  const open = (db.prepare(`SELECT COUNT(*) AS n FROM payments WHERE player_id = ? AND status IN (${OPEN_SQL}) AND created_at > ?`).get(p.id, now - 7 * 60_000) as { n: number }).n;
  if (open >= MAX_OPEN_PER_PLAYER) throw new ApiError(429, 'Ochiq to‘lovlaringiz ko‘p. Avval bittasini yakunlang yoki bekor qiling.');
  const hour = (db.prepare('SELECT COUNT(*) AS n FROM payments WHERE player_id = ? AND created_at > ?').get(p.id, now - 3_600_000) as { n: number }).n;
  if (hour >= MAX_PER_HOUR) throw new ApiError(429, 'Juda ko‘p urinish. Bir ozdan keyin qayta urinib ko‘ring.');
  const amount = priceFor(track as TrackId, days, env);
  const id = randomBytes(12).toString('hex');
  // Avval yozib olamiz: Hamyonning prepare chaqiruvi create javobidan oldin kelib qolishi mumkin
  db.prepare('INSERT INTO payments (id, player_id, track, days, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, p.id, track, days, amount, 'pending', now);
  try {
    const busy = new Set((db.prepare(`SELECT hamyon_amount FROM payments WHERE status IN (${OPEN_SQL}) AND created_at > ? AND hamyon_amount IS NOT NULL`).all(now - 7 * 60_000) as { hamyon_amount: number }[]).map((r) => r.hamyon_amount));
    const r = await api.create(id, amount, busy);
    // Band summalar ham Hamyonning o'zida hal qilinadi (create ichida 1 so'mdan oshiriladi)
    db.prepare('UPDATE payments SET hamyon_payment_id = ?, hamyon_amount = ?, card = ?, expire_at = ? WHERE id = ?').run(r.payment_id, r.amount, r.card, r.expire_at, id);
  } catch (e) {
    db.prepare("UPDATE payments SET status = 'failed', error = ? WHERE id = ?").run(String(e instanceof Error ? e.message : e).slice(0, 200), id);
    throw new ApiError(502, 'To‘lov xizmati hozir javob bermayapti. Birozdan keyin qayta urinib ko‘ring.');
  }
  return view(get(db, id)!, now);
}

/** To'lov natijasini bir joyda qayd qiladi (callback, status tekshiruv, bekor qilish). Qayta chaqirilsa xavfsiz: obuna bir marta beriladi. */
export function applyResult(db: DatabaseSync, id: string, status: 'paid' | 'cancel', opts: { paidAmount?: number; reason?: string } = {}, now = Date.now()): 'delivered' | 'already' | 'mismatch' | 'cancelled' | 'missing' {
  const p = get(db, id);
  if (!p) return 'missing';
  if (status === 'paid') {
    const expected = p.hamyon_amount ?? p.amount;
    if (opts.paidAmount !== undefined && opts.paidAmount !== expected) {
      db.prepare("UPDATE payments SET note = ? WHERE id = ?").run(`amount_mismatch: ${opts.paidAmount} != ${expected}`, id);
      return 'mismatch';
    }
    // Faqat ochiq (yoki kech kelgan: bekor/muddati o'tgan) to'lov yetkaziladi
    const r = db.prepare(`UPDATE payments SET status = 'success', paid_at = ? WHERE id = ? AND status IN (${OPEN_SQL}, 'cancelled', 'expired')`).run(now, id);
    if (Number(r.changes) === 0) return 'already';
    extend(db, p.player_id, p.track, p.days, now);
    return 'delivered';
  }
  const r = db.prepare(`UPDATE payments SET status = 'cancelled', note = ? WHERE id = ? AND status IN (${OPEN_SQL})`).run(opts.reason ?? '', id);
  return Number(r.changes) ? 'cancelled' : 'already';
}

/** Hamyondan holatni so'rab, tugagan bo'lsa shu yerda ham yakunlaydi. */
export async function syncOne(db: DatabaseSync, api: HamyonApi, shopId: string, p: PaymentRow, now = Date.now()): Promise<string | null> {
  if (!p.hamyon_payment_id || !(OPEN as readonly string[]).includes(p.status)) return null;
  db.prepare('UPDATE payments SET checked_at = ? WHERE id = ?').run(now, p.id);
  try {
    const st = await api.status(p.hamyon_payment_id);
    if (st.shop_id !== undefined && st.shop_id !== shopId) return null;
    if (st.status === 'paid') applyResult(db, p.id, 'paid', { paidAmount: st.amount }, now);
    else if (st.status === 'cancel') applyResult(db, p.id, 'cancel', { reason: 'timeout' }, now);
    return st.status;
  } catch (e) {
    if (!(e instanceof HamyonError)) throw e;
    return null;
  }
}

/** Foydalanuvchi to'lov holatini so'raydi (8 soniyadan tez-tez Hamyonga murojaat qilinmaydi). */
export async function statusFor(db: DatabaseSync, api: HamyonApi | null, shopId: string, token: string, id: string, now = Date.now()) {
  const pl = byToken(db, token);
  let p = get(db, id);
  if (!p || p.player_id !== pl.id) throw new ApiError(404, 'To‘lov topilmadi');
  if (api && p.hamyon_payment_id && (OPEN as readonly string[]).includes(p.status) && now - (p.checked_at ?? 0) > 8000) {
    await syncOne(db, api, shopId, p, now);
    p = get(db, id)!;
  }
  return view(p, now);
}

export async function cancelPayment(db: DatabaseSync, api: HamyonApi | null, token: string, id: string, now = Date.now()) {
  const pl = byToken(db, token);
  const p = get(db, id);
  if (!p || p.player_id !== pl.id) throw new ApiError(404, 'To‘lov topilmadi');
  if ((OPEN as readonly string[]).includes(p.status)) {
    if (api && p.hamyon_payment_id) { try { await api.cancel(p.hamyon_payment_id); } catch { /* Hamyon o'zi 5 daqiqada yopadi */ } }
    applyResult(db, id, 'cancel', { reason: 'user' }, now);
  }
  return view(get(db, id)!, now);
}

/** Yo'qolgan callback uchun xavfsizlik to'ri: 2 daqiqadan 2 soatgacha ochiq to'lovlar tekshiriladi. */
export async function reconcile(db: DatabaseSync, api: HamyonApi, shopId: string, now = Date.now()): Promise<number> {
  const rows = db.prepare(`SELECT * FROM payments WHERE status IN (${OPEN_SQL}) AND hamyon_payment_id IS NOT NULL AND created_at <= ? AND created_at >= ?`).all(now - 120_000, now - 7_200_000) as unknown as PaymentRow[];
  let n = 0;
  for (const p of rows) { const s = await syncOne(db, api, shopId, p, now); if (s === 'paid' || s === 'cancel') n++; }
  return n;
}

/** Hamyon callback: to'lovni order_id (bizning id) yoki Hamyon payment_id bo'yicha topadi. */
export function findByCallback(db: DatabaseSync, form: Record<string, string>): PaymentRow | undefined {
  let p: PaymentRow | undefined;
  if (form.order_id) p = get(db, form.order_id);
  if (!p && form.payment_id) p = db.prepare('SELECT * FROM payments WHERE hamyon_payment_id = ?').get(form.payment_id) as PaymentRow | undefined;
  if (p?.hamyon_payment_id && form.payment_id && p.hamyon_payment_id !== form.payment_id) return undefined;
  return p;
}

export function markPrepared(db: DatabaseSync, id: string, hamyonId: string | undefined): void {
  db.prepare(`UPDATE payments SET hamyon_payment_id = COALESCE(?, hamyon_payment_id), status = CASE WHEN status = 'pending' THEN 'prepared' ELSE status END WHERE id = ?`).run(hamyonId ?? null, id);
}

/** Qo'llab-quvvatlash: qo'lda obuna berish (to'lov kelmay qolgan hollar uchun). */
export function grant(db: DatabaseSync, nickname: string, track: string, days: number, now = Date.now()): number {
  if (!TRACKS.includes(track as TrackId)) throw new ApiError(400, 'Noma’lum yo‘nalish');
  if (!Number.isFinite(days) || days < 1 || days > 400) throw new ApiError(400, 'Muddat 1–400 kun');
  const pl = db.prepare('SELECT id FROM players WHERE lower(nickname) = lower(?)').get(nickname) as { id: number } | undefined;
  if (!pl) throw new ApiError(404, 'Foydalanuvchi topilmadi');
  return extend(db, pl.id, track as TrackId, Math.floor(days), now);
}

export const recent = (db: DatabaseSync, limit = 100) => db.prepare('SELECT p.id, pl.nickname, p.track, p.days, p.amount, p.hamyon_amount, p.status, p.note, p.error, p.created_at, p.paid_at FROM payments p JOIN players pl ON pl.id = p.player_id ORDER BY p.created_at DESC LIMIT ?').all(limit);
