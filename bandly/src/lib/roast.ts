import { roastLines, type Emotion, type Reaction } from '../content/roasts';

export type Level = 0 | 1 | 2 | 3;
/** 2–3 daraja faqat 18+ tasdiqlangan foydalanuvchiga: aks holda 1-darajaga tushiriladi. */
export const effectiveLevel = (level: number, adult: boolean): Level => {
  const lv = Math.max(0, Math.min(3, Math.floor(level || 0)));
  return (!adult && lv > 1 ? 1 : lv) as Level;
};

export interface GrammarSlip { wrong: string; right: string }
const THIRD: Record<string, string> = { go: 'goes', have: 'has', do: 'does' };
const BASE: Record<string, string> = { went: 'go', saw: 'see', ate: 'eat', took: 'take', did: 'do', came: 'come', got: 'get', made: 'make' };

const detectors: ((t: string) => GrammarSlip | null)[] = [
  (t) => t.match(/\bI am agree\b/i) && { wrong: 'I am agree', right: 'I agree' },
  (t) => { const m = t.match(/\b(he|she) (go|like|want|live|work|study|have|do|play|need|think)\b/i); return m && { wrong: m[0], right: `${m[1].toLowerCase()} ${THIRD[m[2].toLowerCase()] ?? m[2].toLowerCase() + 's'}` }; },
  (t) => { const m = t.match(/\b(he|she|it) don't\b/i); return m && { wrong: m[0], right: `${m[1].toLowerCase()} doesn't` }; },
  (t) => { const m = t.match(/\bmore (better|easier|bigger|cheaper|faster|worse|harder|cleaner|smaller)\b/i); return m && { wrong: m[0], right: m[1].toLowerCase() }; },
  (t) => t.match(/\bdiscuss about\b/i) && { wrong: 'discuss about', right: 'discuss' },
  (t) => { const m = t.match(/\bI have (\w+) years old\b/i); return m && { wrong: m[0], right: `I am ${m[1]} years old` }; },
  (t) => t.match(/\bpeoples\b/i) && { wrong: 'peoples', right: 'people' },
  (t) => t.match(/\binformations\b/i) && { wrong: 'informations', right: 'information' },
  (t) => t.match(/\badvices\b/i) && { wrong: 'advices', right: 'advice' },
  (t) => t.match(/\bI am boring\b/i) && { wrong: 'I am boring', right: 'I am bored' },
  (t) => t.match(/\bI very like\b/i) && { wrong: 'I very like', right: 'I really like' },
  (t) => { const m = t.match(/\bI am (study|work|live)\b/i); return m && { wrong: m[0], right: `I ${m[1].toLowerCase()}` }; },
  (t) => { const m = t.match(/\bdidn't (went|saw|ate|took|did|came|got|made)\b/i); return m && { wrong: m[0], right: `didn't ${BASE[m[1].toLowerCase()]}` }; },
];

/** Matndagi birinchi odatiy grammatik xato (o'zbek tilida so'zlashuvchilar uchun xos). */
export function detectSlip(text: string): GrammarSlip | null {
  for (const d of detectors) { const r = d(text); if (r) return r; }
  return null;
}

export const countSlips = (text: string): number => detectors.reduce((n, d) => n + (d(text) ? 1 : 0), 0);

const pick = <T,>(a: readonly T[], rnd: () => number): T => a[Math.floor(rnd() * a.length)];
const fill = (r: Reaction, v: Record<string, string | number>): Reaction => {
  const sub = (s: string) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ''));
  return { emotion: r.emotion, uz: sub(r.uz), en: sub(r.en) };
};

export interface TurnFacts { text: string; words: number; fillers: number; latencyMs: number; level: Level; rnd?: () => number }

/** Javobga qoidaviy reaksiya (AI'siz). null = jim o'tish. */
export function reactTo(f: TurnFacts): Reaction | null {
  const rnd = f.rnd ?? Math.random;
  const lv = f.level;
  if (f.words === 0) return fill(pick(roastLines.silence[lv], rnd), {});
  const slip = detectSlip(f.text);
  if (slip) return fill(pick(roastLines.error[lv], rnd), slip as unknown as Record<string, string>);
  if (f.fillers >= 3) return fill(pick(roastLines.fillers[lv], rnd), { n: f.fillers });
  if (f.words < 6) return fill(pick(roastLines.short[lv], rnd), {});
  if (f.latencyMs > 6000 && rnd() < 0.6) return fill(pick(roastLines.slow[lv], rnd), {});
  if (f.words >= 25 && rnd() < 0.5) return fill(pick(roastLines.praise[lv], rnd), {});
  return null;
}

export const EMOTIONS: Emotion[] = ['happy', 'angry', 'laugh', 'disappointed', 'impressed'];
