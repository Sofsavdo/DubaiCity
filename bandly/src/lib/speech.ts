// Brauzerning nutqni tanish (SpeechRecognition) va ovoz sintezi (speechSynthesis) imkoniyatlari.
// Ovoz yozib olinmaydi va serverga yuborilmaydi. Nutqni matnga o'girishni brauzer ishlab chiqaruvchisining xizmati bajaradi.

interface RecResult { isFinal: boolean; 0: { transcript: string } }
interface RecEvent { resultIndex: number; results: ArrayLike<RecResult> }
interface Rec {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: RecEvent) => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
  start(): void; stop(): void; abort(): void;
}
type RecCtor = new () => Rec;
const ctor = (): RecCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export const sttSupported = (): boolean => !!ctor();
export const ttsSupported = (): boolean => 'speechSynthesis' in window;

export interface Signal { cancelled: boolean }

/** Ustoz gapirishi. onend ishlamaydigan qurilmalar uchun taxminiy vaqtdan keyin ham tugaydi. */
export interface Prosody { pitch: number; rate: number; volume: number }
export function say(text: string, signal: Signal, lang = 'en-GB', prosody: Prosody = { pitch: 1, rate: 0.95, volume: 1 }): Promise<void> {
  return new Promise((resolve) => {
    const guard = setTimeout(done, Math.max(1500, text.length * 90 + 1500));
    let finished = false;
    function done() { if (finished) return; finished = true; clearTimeout(guard); resolve(); }
    if (!ttsSupported() || signal.cancelled) { setTimeout(done, Math.min(1500, text.length * 30)); return; }
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const want = lang.toLowerCase();
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(want)) ?? synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(want.slice(0, 2)));
    if (voice) u.voice = voice;
    u.lang = lang; u.rate = prosody.rate; u.pitch = prosody.pitch; u.volume = prosody.volume;
    u.onend = done; u.onerror = done;
    synth.speak(u);
  });
}

export const stopSpeaking = (): void => { if (ttsSupported()) window.speechSynthesis.cancel(); };

export interface TurnOptions {
  silenceMs: number;       // nutqdan keyin shuncha sukut = javob tugadi
  maxMs: number;           // eng ko'p davomiylik
  noSpeechMs?: number;     // umuman gapirilmasa
  onInterim: (text: string) => void;
  signal: Signal;
  endRef: { current: (() => void) | null }; // "Tugatdim" tugmasi
}
export interface TurnResult { text: string; seconds: number; latencyMs: number }

/** Bitta javobni tinglaydi. Ovoz xotirada saqlanmaydi, faqat tanilgan matn qaytadi. */
export function listenTurn(o: TurnOptions): Promise<TurnResult> {
  return new Promise((resolve, reject) => {
    const C = ctor();
    if (!C) { reject(new Error('Brauzer nutqni tanishni qo‘llamaydi')); return; }
    const rec = new C();
    rec.lang = 'en-GB'; rec.continuous = true; rec.interimResults = true;
    const start = Date.now();
    let firstAt = 0, lastAt = 0, finals = '', interim = '', done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      o.endRef.current = null;
      try { rec.onend = null; rec.stop(); } catch { /* */ }
      const text = `${finals} ${interim}`.replace(/\s+/g, ' ').trim();
      resolve({ text, seconds: firstAt ? (lastAt - firstAt) / 1000 : 0, latencyMs: firstAt ? firstAt - start : Date.now() - start });
    };
    o.endRef.current = finish;

    rec.onresult = (e) => {
      const now = Date.now();
      if (!firstAt) firstAt = now;
      lastAt = now;
      let f = '', i = '';
      for (let k = 0; k < e.results.length; k++) { const r = e.results[k]; if (r.isFinal) f += ` ${r[0].transcript}`; else i += ` ${r[0].transcript}`; }
      finals = f.trim(); interim = i.trim();
      o.onInterim(`${finals} ${interim}`.trim());
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { done = true; clearInterval(timer); reject(new Error('Mikrofonga ruxsat berilmadi')); }
    };
    rec.onend = () => { if (!done) { try { rec.start(); } catch { /* allaqachon ishlayapti */ } } };
    try { rec.start(); } catch { /* */ }

    const timer = setInterval(() => {
      if (o.signal.cancelled) { finish(); return; }
      const now = Date.now();
      if (firstAt && now - lastAt > o.silenceMs) finish();
      else if (!firstAt && now - start > (o.noSpeechMs ?? 12_000)) finish();
      else if (now - start > o.maxMs) finish();
    }, 200);
  });
}

// ---------------- Hissiyotli ovoz ----------------
import type { Emotion, Reaction } from '../content/roasts';

/** Brauzer ovozida hissiyot faqat ohang (pitch), tezlik va balandlik orqali beriladi. */
export const PROSODY: Record<Emotion, Prosody> = {
  happy: { pitch: 1.1, rate: 1, volume: 1 },
  angry: { pitch: 0.7, rate: 1.2, volume: 1 },
  laugh: { pitch: 1.35, rate: 1.1, volume: 1 },
  disappointed: { pitch: 0.65, rate: 0.8, volume: 0.9 },
  impressed: { pitch: 1.25, rate: 1, volume: 1 },
};

export const hasVoice = (prefix: string): boolean => ttsSupported() && window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith(prefix));

/** Reaksiyani aytadi: o'zbekcha ovoz bo'lsa o'zbekcha, bo'lmasa inglizcha variant. Kulgi uchun avval "ha-ha". */
export async function sayReaction(r: Reaction, signal: Signal): Promise<'uz' | 'en'> {
  if (r.emotion === 'laugh') await say('Ha, ha, ha, ha!', signal, 'en-GB', { pitch: 1.7, rate: 1.3, volume: 1 });
  const uz = hasVoice('uz');
  await say(uz ? r.uz : r.en, signal, uz ? 'uz-UZ' : 'en-GB', PROSODY[r.emotion]);
  return uz ? 'uz' : 'en';
}
