// IELTS ballarini hisoblash. Jadvallar ommaviy e'lon qilingan taxminiy o'tkazish
// jadvallariga asoslangan; rasmiy natija emas.
type Table = ReadonlyArray<readonly [number, number]>; // [minRaw, band], kamayish tartibida

export const LISTENING_TABLE: Table = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5],
  [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0],
];

export const READING_ACADEMIC_TABLE: Table = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5],
  [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0],
];

export const READING_GENERAL_TABLE: Table = [
  [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5],
  [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [3, 2], [1, 1], [0, 0],
];

export function rawToBand(raw: number, table: Table): number {
  const r = Math.max(0, Math.min(40, Math.floor(raw)));
  for (const [min, band] of table) if (r >= min) return band;
  return 0;
}

/** Mini-test natijasini 40 ballik shkalaga keltirib band beradi (taxminiy). */
export function scaledBand(correct: number, total: number, table: Table): number {
  if (total <= 0) return 0;
  return rawToBand(Math.round((correct / total) * 40), table);
}

/** Umumiy ball: 4 ball o'rtachasi, IELTS qoidasi bo'yicha 0.5 ga yaxlitlanadi
 *  (.25 → .5 ga, .75 → keyingi butunga ko'tariladi). */
export function overallBand(l: number, r: number, w: number, s: number): number {
  const avg = (l + r + w + s) / 4;
  return Math.floor(avg * 2 + 0.5) / 2;
}
