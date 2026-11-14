import { getAccount } from './account';
import type { CoachEmotion, PersonaId } from '../content/personas';

export interface CoachReply { reply: string; question: string | null; emotion: CoachEmotion; correction: { wrong: string; right: string; whyUz: string } | null; persona: PersonaId; notice: string | null }
export interface CoachStatus { ai: boolean; coach: boolean }

let st: Promise<CoachStatus> | null = null;
export function coachStatus(): Promise<CoachStatus> {
  st ??= fetch('/api/ai/status').then((r) => r.json()).then((j: { enabled?: boolean; coach?: boolean }) => ({ ai: !!j.enabled, coach: !!j.coach })).catch(() => ({ ai: false, coach: false }));
  return st;
}

export const newTurnId = (): string => `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** One coach turn. The same turnId may be retried safely: the server never calls the AI provider twice for it. */
export async function coachSay(body: { persona: PersonaId; mode: 'practice' | 'exam'; adult: boolean; level: string | null; history: { role: 'learner' | 'coach'; text: string }[]; text: string; turnId: string }, timeoutMs = 20_000): Promise<CoachReply> {
  const a = getAccount();
  if (!a) throw new Error('Avval laqab tanlang');
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch('/api/ai/coach', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: a.token, ...body }), signal: ctl.signal });
    const j = (await res.json().catch(() => ({}))) as CoachReply & { error?: string };
    if (!res.ok) throw new Error(j.error ?? `Xato ${res.status}`);
    return j;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('AI javob bermadi (vaqt tugadi). Qayta urinib ko‘ring.');
    throw e;
  } finally { clearTimeout(t); }
}

/** Voice prosody per emotion on top of the persona's base voice (browser speech synthesis; real emotional voices need a provider — R&D). */
export function prosodyFor(base: { pitch: number; rate: number }, e: CoachEmotion): { pitch: number; rate: number; volume: number } {
  const d: Record<CoachEmotion, [number, number]> = { neutral: [0, 0], happy: [0.1, 0.03], laugh: [0.15, 0.06], angry: [-0.1, 0.12], disappointed: [-0.12, -0.08], impressed: [0.08, 0], serious: [-0.05, -0.03], sarcastic: [0.05, -0.05] };
  const [dp, dr] = d[e];
  return { pitch: Math.min(2, Math.max(0.5, base.pitch + dp)), rate: Math.min(1.4, Math.max(0.6, base.rate + dr)), volume: 1 };
}
