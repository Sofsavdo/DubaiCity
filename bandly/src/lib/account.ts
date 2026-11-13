import { getProfile } from './store';

const KEY = 'bandly.account.v1';
export interface Account { token: string; nickname: string }

export const getAccount = (): Account | null => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') as Account | null; } catch { return null; }
};
const setAccount = (a: Account | null) => {
  try { if (a) localStorage.setItem(KEY, JSON.stringify(a)); else localStorage.removeItem(KEY); } catch { /* */ }
};
export const leaveLeague = (): void => setAccount(null);

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try { res = await fetch(path, init); } catch { throw new Error('Server bilan aloqa yo‘q'); }
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Xato ${res.status}`);
  return body;
}

export async function joinLeague(nickname: string): Promise<Account> {
  const a = await call<Account>('/api/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nickname }) });
  setAccount(a);
  void syncNow();
  return a;
}

export interface Row { rank: number; nickname: string; xp: number; streak: number; me: boolean }
export interface Board { top: Row[]; me: Row | null; since: number | null }

export const fetchBoard = (period: 'week' | 'all'): Promise<Board> =>
  call<Board>(`/api/leaderboard?period=${period}`, { headers: { 'x-token': getAccount()?.token ?? '' } });

let lastSent = -1;
export async function syncNow(): Promise<void> {
  const a = getAccount();
  if (!a) return;
  const p = getProfile();
  if (p.xp === lastSent) return;
  try {
    await call('/api/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: a.token, xp: p.xp, streak: p.streak }) });
    lastSent = p.xp;
  } catch (e) {
    if (e instanceof Error && e.message === 'Noma’lum token') leaveLeague(); // server bazasi tiklangan bo'lishi mumkin
  }
}

/** Har 15 soniyada va sahifa yopilayotganda sinxronlaydi. */
export function startSync(): void {
  setInterval(() => void syncNow(), 15_000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') void syncNow(); });
}
