import { getAccount } from './account';
import type { Emotion } from '../content/roasts';

// Server orqali o'zbekcha neyron ovoz (agar serverda TTS_KEY sozlangan bo'lsa). Ovoz yozib olinmaydi: faqat matn yuboriladi.
let status: Promise<boolean> | null = null;
export const uzTtsEnabled = (): Promise<boolean> =>
  (status ??= fetch('/api/tts/status').then((r) => (r.ok ? r.json() : { enabled: false })).then((j: { enabled?: boolean }) => !!j.enabled).catch(() => false));

const STYLE: Record<Emotion, { rate: number; pitch: number }> = {
  happy: { rate: 1.0, pitch: 6 },
  angry: { rate: 1.15, pitch: -10 },
  laugh: { rate: 1.1, pitch: 12 },
  disappointed: { rate: 0.85, pitch: -12 },
  impressed: { rate: 1.0, pitch: 10 },
};

let current: HTMLAudioElement | null = null;
export const stopUz = (): void => { if (current) { current.pause(); current = null; } };

/** O'zbekcha matnni chaladi. Muvaffaqiyatli bo'lsa true; xizmat o'chiq/limit/xato bo'lsa false (chaqiruvchi zaxira ovozga o'tadi). */
export async function playUz(text: string, emotion: Emotion, signal: { cancelled: boolean }): Promise<boolean> {
  const acc = getAccount();
  if (!acc || signal.cancelled || !(await uzTtsEnabled())) return false;
  try {
    const r = await fetch('/api/tts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: acc.token, text, ...STYLE[emotion] }), signal: AbortSignal.timeout(12_000) });
    if (!r.ok || signal.cancelled) return false;
    const url = URL.createObjectURL(await r.blob());
    return await new Promise<boolean>((resolve) => {
      const a = new Audio(url);
      current = a;
      let done = false;
      const finish = (ok: boolean) => { if (done) return; done = true; clearInterval(poll); URL.revokeObjectURL(url); if (current === a) current = null; resolve(ok); };
      const poll = setInterval(() => { if (signal.cancelled) { a.pause(); finish(true); } }, 120);
      a.onended = () => finish(true);
      a.onerror = () => finish(false);
      a.play().catch(() => finish(false));
    });
  } catch { return false; }
}
