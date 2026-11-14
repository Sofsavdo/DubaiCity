import { vocab, type Word } from '../content/vocab';
import { say } from './speech';

export const shuffle = <T,>(a: readonly T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

export interface Option { id: string; text: string }

/** To'g'ri javob + 3 ta chalg'ituvchi (boshqa so'zlar). dir='en': inglizcha so'z → o'zbekcha ma'no. */
export function buildOptions(target: Word, dir: 'en' | 'uz', pool: readonly Word[] = vocab): Option[] {
  const others = shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3);
  return shuffle([target, ...others]).map((w) => ({ id: w.id, text: dir === 'en' ? w.uz : w.word }));
}

/** Misol gapda so'zni yashiradi (yechim ochilib qolmasligi uchun o'zak bo'yicha). */
export function blankExample(w: Word): string {
  // Ibora (ko'p so'zli): butun iborani yashiramiz
  if (w.word.includes(' ')) return w.example.replace(new RegExp(w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '_____');
  const stem = w.word.slice(0, Math.max(4, w.word.length - 2)).replace(/[^a-z-]/gi, '');
  const re = new RegExp(`${stem}[a-z-]*`, 'i');
  return w.example.replace(re, '_____');
}

/** So'zni eshittirish: avval tayyor neyron ovoz, bo'lmasa brauzer ovozi. */
export const speak = (text: string): void => { void say(text, { cancelled: false }, 'en-GB'); };
