import { getAccount } from './account';
import { applyServerPlans, getProfile } from './store';
import type { TrackId } from './types';

export interface PayConfig { enabled: boolean; demo: boolean; periods: { days: number; label: string; prices: Record<TrackId, number> }[] }
export interface PayView { id: string; status: 'pending' | 'prepared' | 'success' | 'cancelled' | 'failed' | 'expired'; track: TrackId; days: number; amount: number; pay_amount: number | null; card: string | null; expire_at: number; expires_in: number }

export const PAY_EVENT = 'bandly:pay';
const OPEN_KEY = 'bandly.pay.open';

let cfg: Promise<PayConfig> | null = null;
export const payConfig = (): Promise<PayConfig> =>
  (cfg ??= fetch('/api/pay/config').then((r) => (r.ok ? (r.json() as Promise<PayConfig>) : Promise.reject(new Error('cfg'))))
    .catch(() => ({ enabled: false, demo: true, periods: [] } as PayConfig)));

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try { res = await fetch(path, init); } catch { throw new Error('Server bilan aloqa yo‘q'); }
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Xato ${res.status}`);
  return body;
}
const hdr = () => ({ 'x-token': getAccount()?.token ?? '' });

/** Serverdagi obunalarni profilga yozadi (faqat to'lov ulangan bo'lsa yoki serverda obuna bo'lsa). */
export async function refreshEntitlements(): Promise<void> {
  const a = getAccount();
  if (!a) return;
  const c = await payConfig();
  try {
    const me = await api<{ subs: Record<TrackId, number | null> }>('/api/me', { headers: hdr() });
    const any = Object.values(me.subs).some(Boolean);
    if (c.enabled || any) applyServerPlans(me.subs);
  } catch (e) {
    if (e instanceof Error && e.message === 'Noma’lum token') return;
  }
}

export const createPayment = (track: TrackId, days: number): Promise<PayView> =>
  api<PayView>('/api/pay/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: getAccount()?.token ?? '', track, days }) });
export const payStatus = (id: string): Promise<PayView> => api<PayView>(`/api/pay/status/${id}`, { headers: hdr() });
export const payCancel = (id: string): Promise<PayView> => api<PayView>(`/api/pay/cancel/${id}`, { method: 'POST', headers: hdr() });

export const rememberOpen = (id: string | null): void => { try { if (id) localStorage.setItem(OPEN_KEY, id); else localStorage.removeItem(OPEN_KEY); } catch { /* */ } };
export const openPaymentId = (): string | null => { try { return localStorage.getItem(OPEN_KEY); } catch { return null; } };

/** Sotib olish oynasini ochadi (hisob bo'lmasa, avval laqab so'raydi). */
export function startPurchase(track: TrackId, days = 30): void {
  window.dispatchEvent(new CustomEvent(PAY_EVENT, { detail: { track, days } }));
}

export const hasPaidPlan = (): boolean => Object.values(getProfile().planUntil).some((u) => !!u && u > Date.now());
export const fmtSum = (n: number): string => n.toLocaleString('ru-RU').replace(/,/g, ' ');
export const fmtDate = (ms: number): string => new Date(ms).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Ilova ochilganda: to'lov ulangan bo'lsa, obuna holati faqat serverdan olinadi (qurilmadagi eski demo belgilari tozalanadi). */
export async function initPay(): Promise<void> {
  const c = await payConfig();
  if (c.enabled && !c.demo) {
    if (!getAccount()) applyServerPlans({ exam: null, grammar: null, mocks: null });
    else await refreshEntitlements();
  } else if (getAccount()) await refreshEntitlements();
  setInterval(() => void refreshEntitlements(), 5 * 60_000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void refreshEntitlements(); });
}
