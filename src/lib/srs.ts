import type { CardState } from './types';

const DAY = 86_400_000;
/** Har bir quti uchun keyingi takrorlashgacha interval (ms). 0-quti: darrov qayta so'raladi. */
export const INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY] as const;
export const MASTERED_BOX = 4;

export const newCard = (now: number): CardState => ({ box: 0, due: now, seen: 0, correct: 0, wrong: 0 });

/** Leitner tizimi: to'g'ri javob qutini oshiradi, xato 0-qutiga qaytaradi. */
export function review(card: CardState | undefined, correct: boolean, now: number): CardState {
  const c = card ?? newCard(now);
  const box = correct ? Math.min(INTERVALS.length - 1, c.box + 1) : 0;
  return {
    box,
    due: now + INTERVALS[box],
    seen: c.seen + 1,
    correct: c.correct + (correct ? 1 : 0),
    wrong: c.wrong + (correct ? 0 : 1),
  };
}

export const isDue = (card: CardState | undefined, now: number): boolean => !card || card.due <= now;
export const isMastered = (card: CardState | undefined): boolean => !!card && card.box >= MASTERED_BOX;

/** Sessiya uchun so'zlar: avval muddati kelganlar (eng past quti), keyin yangilari. */
export function pickSession(ids: string[], srs: Record<string, CardState>, now: number, size: number, rnd: () => number = Math.random): string[] {
  const seen = ids.filter((id) => srs[id]);
  const fresh = ids.filter((id) => !srs[id]);
  const due = seen.filter((id) => isDue(srs[id], now)).sort((a, b) => srs[a].box - srs[b].box || srs[a].due - srs[b].due);
  const shuffledFresh = [...fresh].sort(() => rnd() - 0.5);
  const out: string[] = [];
  // Har sessiyada kamida 30% yangi so'z (agar bor bo'lsa), qolgani takrorlash
  const minNew = Math.min(shuffledFresh.length, Math.ceil(size * 0.3));
  out.push(...due.slice(0, size - minNew));
  out.push(...shuffledFresh.slice(0, size - out.length));
  if (out.length < size) {
    const rest = seen.filter((id) => !out.includes(id)).sort((a, b) => srs[a].due - srs[b].due);
    out.push(...rest.slice(0, size - out.length));
  }
  return out;
}
