import { placement, type PlacementQ } from '../content/placement';
import { CEFR, type Cefr } from './levels';

export const PASS_MARK = 3; // blokdan o'tish uchun 4 tadan kamida 3 ta to'g'ri

export const blockOf = (level: Cefr): PlacementQ[] => placement.filter((q) => q.level === level);

export interface PlacementResult {
  level: Cefr;
  /** Har bir daraja bo'yicha to'g'ri javoblar (javob berilgan bloklar uchun) */
  byLevel: Partial<Record<Cefr, number>>;
  answered: number;
  /** Eng past blokdan o'tolmagan: daraja A1 deb olinadi */
  belowA1: boolean;
}

/** Moslashuvchan baholash: bloklar ketma-ket; 4 tadan <3 to'g'ri bo'lsa to'xtaydi va oxirgi o'tilgan blok darajasi beriladi. */
export function evaluate(answers: Record<number, number>): PlacementResult {
  const byLevel: Partial<Record<Cefr, number>> = {};
  let passed: Cefr | null = null;
  let answered = 0;
  for (const lv of CEFR) {
    const qs = blockOf(lv);
    const given = qs.filter((q) => answers[q.id] !== undefined);
    if (given.length < qs.length) break;
    answered += qs.length;
    const ok = qs.filter((q) => answers[q.id] === q.answer).length;
    byLevel[lv] = ok;
    if (ok >= PASS_MARK) passed = lv; else break;
  }
  return { level: passed ?? 'A1', byLevel, answered, belowA1: passed === null };
}

/** Keyingi savol: hozirgi blokning javobsiz savoli, blok tugagan bo'lsa o'tilgan bo'lsa keyingi blok; aks holda null (tugadi). */
export function nextQuestion(answers: Record<number, number>): PlacementQ | null {
  for (const lv of CEFR) {
    const qs = blockOf(lv);
    const open = qs.find((q) => answers[q.id] === undefined);
    if (open) return open;
    const ok = qs.filter((q) => answers[q.id] === q.answer).length;
    if (ok < PASS_MARK) return null; // yiqildi
  }
  return null;
}
