import { createHash, timingSafeEqual } from 'node:crypto';

// Hamyon (hamyon-api.uz): kartaga o'tkazma orqali to'lov. Ishlash tartibi:
// 1) biz summa uchun to'lov ochamiz, Hamyon karta raqamini beradi;
// 2) foydalanuvchi AYNAN shu summani kartaga o'tkazadi;
// 3) Hamyon pul kelganini ko'rib, complete_url ga natijani yuboradi (paid / cancel — 5 daqiqadan keyin).
// To'lov SUMMA bo'yicha taniladi: bir do'konda bir xil summali ikkita ochiq to'lov bo'lmaydi,
// shuning uchun band summa uchun 1 so'm qo'shib qayta urinamiz (79 001 so'm).
// Railway sozlamalari: HAMYON_SHOP_ID, HAMYON_SHOP_KEY (maxfiy), ixtiyoriy HAMYON_BASE_URL.
// Hamyon botida: prepare_url = https://<domen>/api/pay/hamyon/prepare, complete_url = https://<domen>/api/pay/hamyon/complete

export class HamyonError extends Error {}

export interface HamyonConfig { shopId: string; shopKey: string; baseUrl: string; fetchImpl?: typeof fetch }

export function hamyonConfigFromEnv(env: NodeJS.ProcessEnv = process.env): HamyonConfig | null {
  const shopId = (env.HAMYON_SHOP_ID ?? '').trim();
  const shopKey = (env.HAMYON_SHOP_KEY ?? '').trim();
  if (!shopId || !shopKey) return null;
  return { shopId, shopKey, baseUrl: (env.HAMYON_BASE_URL ?? 'https://hamyon-api.uz').trim().replace(/\/+$/, '') };
}

export const md5 = (s: string): string => createHash('md5').update(s).digest('hex');
export const hamyonSign = (c: Pick<HamyonConfig, 'shopId' | 'shopKey'>, paymentId: string, amount: string | number): string => md5(`${c.shopId}${paymentId}${amount}${c.shopKey}`);

/** sign = md5(shop_id + payment_id + amount + shop_key); qiymatlar Hamyon yuborganidek (matn). */
export function verifySign(c: HamyonConfig, form: Record<string, string>): boolean {
  if ((form.shop_id ?? '').trim() !== c.shopId) return false;
  const calc = Buffer.from(hamyonSign(c, form.payment_id ?? '', form.amount ?? ''));
  const got = Buffer.from((form.sign ?? '').trim().toLowerCase());
  return calc.length === got.length && timingSafeEqual(calc, got);
}

export interface Created { payment_id: string; card: string; amount: number; expire_at: number }
export interface HamyonStatus { status: string; amount: number; shop_id?: string }

/** Tashqi xizmat interfeysi: sinovda soxta bilan almashtiriladi. */
export interface HamyonApi {
  /** busy: biz biladigan band summalar (ular o'tkazib yuboriladi) */
  create(orderId: string, amount: number, busy?: ReadonlySet<number>): Promise<Created>;
  status(paymentId: string): Promise<HamyonStatus>;
  cancel(paymentId: string): Promise<void>;
}

const busyError = (e: string): boolean => /ochiq/i.test(e) && /summa/i.test(e);
export const MAX_BUMPS = 30;

export function hamyonApi(c: HamyonConfig): HamyonApi {
  const f = c.fetchImpl ?? fetch;
  const form = (d: Record<string, string | number>) => new URLSearchParams(Object.entries(d).map(([k, v]) => [k, String(v)]));
  async function post(path: string, data: Record<string, string | number>): Promise<Record<string, unknown>> {
    let r: Response;
    try { r = await f(`${c.baseUrl}${path}`, { method: 'POST', body: form(data), signal: AbortSignal.timeout(15_000) }); } catch { throw new HamyonError('connection'); }
    const body = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    if (!r.ok || body.error) throw new HamyonError(String(body.error ?? `HTTP ${r.status}`));
    return body;
  }
  return {
    /** To'lov ochadi; summa band bo'lsa 1 so'mdan oshirib qayta urinadi. */
    async create(orderId, amount, busy = new Set<number>()) {
      let cand = amount, last = '';
      for (let i = 0; i < MAX_BUMPS; i++) {
        while (busy.has(cand)) cand += 1;
        try {
          const r = await post('/payment/create', { shop_id: c.shopId, shop_key: c.shopKey, amount: cand, order_id: orderId });
          if (!r.payment_id || !r.card) throw new HamyonError('incomplete answer');
          return { payment_id: String(r.payment_id), card: String(r.card), amount: Number(r.amount) || cand, expire_at: Number(r.expire_at) || Math.floor(Date.now() / 1000) + (Number(r.expires_in) || 300) };
        } catch (e) {
          last = e instanceof Error ? e.message : String(e);
          if (e instanceof HamyonError && busyError(last)) { cand += 1; continue; }
          throw e;
        }
      }
      throw new HamyonError(last || 'no free amount');
    },
    async status(paymentId) {
      let r: Response;
      try { r = await f(`${c.baseUrl}/payment/status?payment_id=${encodeURIComponent(paymentId)}`, { signal: AbortSignal.timeout(10_000) }); } catch { throw new HamyonError('connection'); }
      const body = (await r.json().catch(() => null)) as Record<string, unknown> | null;
      if (!r.ok || !body || body.error) throw new HamyonError(String(body?.error ?? `HTTP ${r.status}`));
      return { status: String(body.status ?? ''), amount: Number(body.amount) || 0, shop_id: body.shop_id === undefined ? undefined : String(body.shop_id) };
    },
    async cancel(paymentId) { await post('/payment/cancel', { payment_id: paymentId, shop_key: c.shopKey }); },
  };
}
