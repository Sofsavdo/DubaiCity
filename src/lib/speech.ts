// Brauzerning nutqni tanish (SpeechRecognition) va ovoz sintezi (speechSynthesis) imkoniyatlari.
// Ovoz yozib olinmaydi va serverga yuborilmaydi. Nutqni matnga o'girishni brauzer ishlab chiqaruvchisining xizmati bajaradi.

interface RecResult { isFinal: boolean; 0: { transcript: string } }
interface RecEvent { resultIndex: number; results: ArrayLike<RecResult> }
interface Rec {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: RecEvent) => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
  onaudiostart: (() => void) | null; onspeechstart: (() => void) | null;
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

/** Eng silliq ingliz ovozini tanlaydi: tabiiy/onlayn ovozlar va Britaniya/AQSh talaffuzi afzal, hind lahjasi eng oxirda. */
const GOOD = /(natural|neural|online|premium|enhanced|google uk english|google us english|samantha|serena|daniel|karen|moira|libby|sonia|jenny|aria|ryan|guy)/i;
export function bestVoice(prefix: string): SpeechSynthesisVoice | undefined {
  if (!ttsSupported()) return undefined;
  const all = window.speechSynthesis.getVoices();
  const pool = all.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix.toLowerCase()));
  if (!pool.length) return undefined;
  const score = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return (GOOD.test(v.name) ? 10 : 0) + (l === 'en-gb' ? 3 : l === 'en-us' ? 2.5 : /^en-(au|ca|ie|za|nz)/.test(l) ? 1 : l === 'en-in' ? -6 : 0) + (v.localService ? 0 : 1.5);
  };
  return [...pool].sort((a, b) => score(b) - score(a))[0];
}

/** Ustoz gapirishi. onend ishlamaydigan qurilmalar uchun taxminiy vaqtdan keyin ham tugaydi. */
export interface Prosody { pitch: number; rate: number; volume: number }
export async function say(text: string, signal: Signal, lang = 'en-GB', prosody: Prosody = { pitch: 1, rate: 0.95, volume: 1 }): Promise<void> {
  if (lang.toLowerCase().startsWith('en') && (await playClip(text, signal))) return;
  return sayBrowser(text, signal, lang, prosody);
}

function sayBrowser(text: string, signal: Signal, lang: string, prosody: Prosody): Promise<void> {
  return new Promise((resolve) => {
    const guard = setTimeout(done, Math.max(1500, text.length * 90 + 1500));
    let finished = false;
    function done() { if (finished) return; finished = true; clearTimeout(guard); resolve(); }
    if (!ttsSupported() || signal.cancelled) { setTimeout(done, Math.min(1500, text.length * 30)); return; }
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const want = lang.toLowerCase();
    const voice = want.startsWith('en') ? bestVoice('en') : bestVoice(want) ?? bestVoice(want.slice(0, 2));
    if (voice) u.voice = voice;
    u.lang = lang; u.rate = prosody.rate; u.pitch = prosody.pitch; u.volume = prosody.volume;
    u.onend = done; u.onerror = done;
    synth.speak(u);
  });
}

export const stopSpeaking = (): void => { stopClip(); stopUz(); if (ttsSupported()) window.speechSynthesis.cancel(); };

export type MicStatus = 'starting' | 'mic' | 'speech';
export interface TurnOptions {
  silenceMs: number;       // nutqdan keyin shuncha sukut = javob tugadi
  maxMs: number;           // eng ko'p davomiylik
  noSpeechMs?: number;     // umuman gapirilmasa
  lang?: string;           // tanish tili: en-US, en-GB, en-IN
  onInterim: (text: string) => void;
  onStatus?: (s: MicStatus) => void;
  signal: Signal;
  endRef: { current: (() => void) | null }; // "Tugatdim" tugmasi
}
export interface TurnResult { text: string; seconds: number; latencyMs: number }

export class SpeechError extends Error {
  constructor(public code: 'denied' | 'network' | 'nomic' | 'unstable' | 'unsupported', message: string) { super(message); }
}

const isMobile = (): boolean => /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

/** Bitta javobni tinglaydi. Ovoz xotirada saqlanmaydi, faqat tanilgan matn qaytadi.
 *  Telefonlarda (Android Chrome) `continuous` ishonchsiz: natijalar takrorlanadi va oraliq natijalar "yakuniy" deb
 *  belgilanadi. Shuning uchun u yerda har bir iborani alohida seans qilib, o'zimiz yig'amiz. */
export function listenTurn(o: TurnOptions): Promise<TurnResult> {
  return new Promise((resolve, reject) => {
    const C = ctor();
    if (!C) { reject(new SpeechError('unsupported', 'Brauzer nutqni tanishni qo‘llamaydi')); return; }
    const mobile = isMobile();
    const rec = new C();
    rec.lang = o.lang ?? 'en-US';
    rec.continuous = !mobile;
    rec.interimResults = true;
    (rec as unknown as { maxAlternatives: number }).maxAlternatives = 1;
    const start = Date.now();
    let firstAt = 0, lastAt = 0, done = false;
    const chunks: string[] = [];
    let interim = '';
    const restarts: number[] = [];
    o.onStatus?.('starting');

    const compose = () => `${chunks.join(' ')} ${interim}`.replace(/\s+/g, ' ').trim();
    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      o.endRef.current = null;
      try { rec.onend = null; rec.stop(); } catch { /* */ }
      resolve({ text: compose(), seconds: firstAt ? (lastAt - firstAt) / 1000 : 0, latencyMs: firstAt ? firstAt - start : Date.now() - start });
    };
    const fail = (e: SpeechError) => { if (done) return; done = true; clearInterval(timer); o.endRef.current = null; try { rec.onend = null; rec.abort(); } catch { /* */ } reject(e); };
    o.endRef.current = finish;

    const addFinal = (t: string) => {
      const last = chunks[chunks.length - 1];
      if (last && (t === last || last.endsWith(t))) return;            // takrorlangan natija
      if (last && t.startsWith(last)) { chunks[chunks.length - 1] = t; return; } // kengaygan variant
      chunks.push(t);
    };

    rec.onresult = (e) => {
      const now = Date.now();
      if (!firstAt) firstAt = now;
      lastAt = now;
      let liveInterim = '';
      for (let k = e.resultIndex; k < e.results.length; k++) {
        const r = e.results[k];
        const text = r[0].transcript.trim();
        const conf = (r[0] as unknown as { confidence?: number }).confidence;
        // Android: ba'zan oraliq natija isFinal=true va ishonch 0 bilan keladi: uni oraliq deb olamiz
        if (r.isFinal && conf !== 0) { if (text) addFinal(text); interim = ''; } else liveInterim = text;
      }
      interim = liveInterim;
      o.onInterim(compose());
    };
    rec.onaudiostart = () => o.onStatus?.('mic');
    rec.onspeechstart = () => { lastAt = Date.now(); o.onStatus?.('speech'); };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') fail(new SpeechError('denied', 'Mikrofonga ruxsat berilmadi'));
      else if (e.error === 'audio-capture') fail(new SpeechError('nomic', 'Mikrofon topilmadi'));
      else if (e.error === 'network') fail(new SpeechError('network', 'Nutqni tanish internet talab qiladi, aloqa yo‘q'));
      else if (e.error === 'language-not-supported') fail(new SpeechError('unsupported', 'Bu til qo‘llanmaydi'));
      // 'no-speech' va 'aborted' oddiy hollar: onend da qayta ishga tushiriladi
    };
    const begin = () => { try { rec.start(); } catch { /* allaqachon ishlayapti */ } };
    rec.onend = () => {
      if (done) return;
      const now = Date.now();
      restarts.push(now);
      while (restarts.length && now - restarts[0] > 4000) restarts.shift();
      if (restarts.length > 10) { fail(new SpeechError('unstable', 'Nutqni tanish barqaror ishlamayapti')); return; }
      setTimeout(begin, restarts.length > 3 ? 500 : 120); // tez-tez uzilsa kutish oshiriladi (qotib qolmaslik uchun)
    };
    begin();

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
import { playClip, stopClip } from './clips';
import { playUz, stopUz } from './tts';

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
  // 1) Serverdagi o'zbekcha neyron ovoz (sozlangan bo'lsa), 2) brauzerdagi o'zbek ovozi, 3) inglizcha variant
  if (await playUz(r.uz, r.emotion, signal)) return 'uz';
  const uz = hasVoice('uz');
  await say(uz ? r.uz : r.en, signal, uz ? 'uz-UZ' : 'en-GB', PROSODY[r.emotion]);
  return uz ? 'uz' : 'en';
}
