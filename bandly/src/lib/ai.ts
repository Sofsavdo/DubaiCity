import { getAccount } from './account';

export interface Evaluation {
  bands: Record<string, number | null>;
  overall: number;
  strengths: string[];
  improve: string[];
  corrections: { said: string; better: string }[];
}

let statusP: Promise<boolean> | null = null;
/** Server AI yoqilganmi (kalit sozlanganmi). Natija keshlanadi. */
export function aiEnabled(): Promise<boolean> {
  statusP ??= fetch('/api/ai/status').then((r) => r.json()).then((j: { enabled?: boolean }) => !!j.enabled).catch(() => false);
  return statusP;
}

async function post<T>(path: string, body: Record<string, unknown>, timeoutMs: number): Promise<T> {
  const a = getAccount();
  if (!a) throw new Error('AI uchun avval laqab tanlang');
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: a.token, ...body }), signal: ctl.signal });
    const j = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) throw new Error(j.error ?? `Xato ${res.status}`);
    return j;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('AI javob bermadi');
    throw e;
  } finally { clearTimeout(t); }
}

/** Suhbat paytida: xato bo'lsa null qaytaradi, shunda skriptdagi savol ishlatiladi. */
export async function aiFollowup(question: string, answer: string): Promise<string | null> {
  try { return (await post<{ question: string | null }>('/api/ai/followup', { question, answer }, 6000)).question; } catch { return null; }
}
export const aiEvaluateSpeaking = (turns: { q: string; text: string }[]): Promise<Evaluation> => post('/api/ai/speaking', { turns }, 30_000);
export const aiEvaluateWriting = (task: 1 | 2, prompt: string, text: string): Promise<Evaluation> => post('/api/ai/writing', { task, prompt, text }, 30_000);
