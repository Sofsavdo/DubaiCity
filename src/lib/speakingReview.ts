import { modelFor, type Model } from '../content/speakingModels';
import { vocab } from '../content/vocab';
import type { TurnStat } from './examiner';
import { findIssues, type Issue } from './grammarCheck';

export interface TurnReview {
  part: 1 | 2 | 3;
  q: string;
  text: string;
  words: number;
  issues: Issue[];
  model: Model | null;
  /** Foydalanuvchi ishlatgan B2/C1 so'zlari */
  advanced: string[];
  /** Foydalanuvchi ishlatgan idioma/ibora/bog'lovchi iboralar */
  phrases: string[];
  /** Javobning uzunligiga oid izoh (o'zbekcha) */
  lengthNote: string | null;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SINGLE = vocab.filter((w) => (w.level === 'B2' || w.level === 'C1') && !w.word.includes(' ') && w.topic !== 'Fe‘l + predlog');
const PHRASES = vocab.filter((w) => w.word.includes(' ')).map((w) => {
  const [first, ...rest] = w.word.replace(/[’']/g, "['’]").split(' ');
  const verbish = w.pos === 'phrasal verb' || w.pos === 'collocation' || w.pos === 'idiom';
  return { w, re: new RegExp(`\\b${first}${verbish ? '(?:s|es|ed|d|ing)?' : ''}\\b(?:\\s+\\w+)?\\s+${rest.map(esc).join('\\s+')}\\b|\\b${esc(w.word)}\\b`, 'i') };
});

/** Matndan B2/C1 so'zlari va iboralarni topadi (oddiy, so'z shakli bo'yicha). */
export function findAdvanced(text: string): { advanced: string[]; phrases: string[] } {
  const lower = text.toLowerCase();
  const advanced = SINGLE.filter((w) => new RegExp(`\\b${esc(w.word.slice(0, Math.max(4, w.word.length - 2)))}[a-z]*\\b`, 'i').test(lower)).map((w) => w.word);
  const phrases = PHRASES.filter(({ re }) => re.test(text)).map(({ w }) => w.word);
  return { advanced: [...new Set(advanced)].slice(0, 6), phrases: [...new Set(phrases)].slice(0, 6) };
}

export function reviewTurn(t: TurnStat): TurnReview {
  const { advanced, phrases } = findAdvanced(t.text);
  const min = t.part === 2 ? 90 : t.part === 3 ? 25 : 15;
  const lengthNote = !t.text.trim() ? null : t.words < min
    ? `Javob qisqa (${t.words} ta so‘z). ${t.part === 2 ? 'Part 2 da 150 ga yaqin so‘z kerak' : `Bu qism uchun kamida ${min}–${min + 15} ta so‘z yaxshi`}.`
    : null;
  return { part: t.part, q: t.q, text: t.text, words: t.words, issues: t.text.trim() ? findIssues(t.text) : [], model: modelFor(t.q), advanced, phrases, lengthNote };
}

export const reviewAll = (turns: TurnStat[]): TurnReview[] => turns.filter((t) => t.words > 0 || t.q).map(reviewTurn);
