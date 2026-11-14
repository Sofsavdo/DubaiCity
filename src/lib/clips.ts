import { clipKey } from './clipHash';

// Oldindan yaratilgan neyron ovoz fayllari (public/audio). Fayl bo'lmasa chaqiruvchi brauzer ovoziga o'tadi.
interface Manifest { clips: Set<string>; listening: Record<string, { file: string; seconds: number }> }
let manifest: Promise<Manifest> | null = null;

export const loadManifest = (): Promise<Manifest> =>
  (manifest ??= fetch('/audio/manifest.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('manifest yo‘q'))))
    .then((j: { clips: string[]; listening: Manifest['listening'] }) => ({ clips: new Set(j.clips), listening: j.listening }))
    .catch(() => ({ clips: new Set<string>(), listening: {} })));

let current: HTMLAudioElement | null = null;
export const stopClip = (): void => { if (current) { current.pause(); current = null; } };

/** Matn uchun tayyor audio bor bo'lsa chaladi (tugaguncha kutadi) va true qaytaradi; yo'q bo'lsa false. */
export async function playClip(text: string, signal: { cancelled: boolean }): Promise<boolean> {
  const m = await loadManifest();
  const key = clipKey(text);
  if (!m.clips.has(key) || signal.cancelled) return false;
  (window as unknown as { __clipLog?: string[] }).__clipLog?.push(text);
  return new Promise<boolean>((resolve) => {
    const a = new Audio(`/audio/clips/${key}.mp3`);
    current = a;
    let done = false;
    const finish = (ok: boolean) => { if (done) return; done = true; clearInterval(poll); if (current === a) current = null; resolve(ok); };
    const poll = setInterval(() => { if (signal.cancelled) { a.pause(); finish(true); } }, 120);
    a.onended = () => finish(true);
    a.onerror = () => finish(false);
    a.play().catch(() => finish(false));
  });
}

export const listeningTrack = async (id: string): Promise<{ file: string; seconds: number } | null> => (await loadManifest()).listening[id] ?? null;
