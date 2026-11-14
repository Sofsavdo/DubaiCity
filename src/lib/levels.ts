// CEFR darajalari va ularning taxminiy IELTS mosligi.
export const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export type Cefr = (typeof CEFR)[number];

export const levelIndex = (l: Cefr | null | undefined): number => (l ? CEFR.indexOf(l) : 2);

export const LEVEL_INFO: Record<Cefr, { name: string; band: string; desc: string }> = {
  A1: { name: 'Boshlang‘ich', band: 'IELTS 3.0 dan past', desc: 'Oddiy so‘z va iboralarni tushunasiz. Asosiy gaplarni tuzishni o‘rganasiz.' },
  A2: { name: 'Elementar', band: 'IELTS ~3.5–4.0', desc: 'Kundalik mavzularda oddiy gaplashasiz. Grammatika asoslarini mustahkamlaysiz.' },
  B1: { name: 'O‘rta', band: 'IELTS ~4.0–5.0', desc: 'Tanish mavzularda fikr bildirasiz. IELTS formatiga tayyorgarlikni boshlash vaqti.' },
  B2: { name: 'O‘rtadan yuqori', band: 'IELTS ~5.5–6.5', desc: 'Murakkab matnlarni tushunasiz. Maqsad: ball va aniqlik.' },
  C1: { name: 'Ilg‘or', band: 'IELTS ~7.0+', desc: 'Erkin va aniq ifodalanasiz. Maqsad: nozik xatolar va yuqori ball.' },
};

/** Element foydalanuvchi darajasiga mosmi: [daraja-down, daraja+up] oralig'ida. */
export function fits(item: Cefr, user: Cefr | null | undefined, down = 1, up = 1): boolean {
  const u = levelIndex(user), i = levelIndex(item);
  return i >= u - down && i <= u + up;
}

/** Foydalanuvchi uchun mos IELTS maqsadi (taxminiy tavsiya). */
export const suggestedTarget = (l: Cefr): number => ({ A1: 4.5, A2: 5.0, B1: 6.0, B2: 7.0, C1: 7.5 })[l];
