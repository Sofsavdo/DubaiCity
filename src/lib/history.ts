// To'liq imtihon (mock) natijalari tarixi: o'sish grafigi uchun (qurilmada saqlanadi).
const KEY = 'bandly.fullhist.v1';
export interface MockEntry { at: number; overall: number; listening?: number; reading?: number; speaking?: number }

export function loadMocks(): MockEntry[] {
  try { const j = JSON.parse(localStorage.getItem(KEY) ?? '[]') as MockEntry[]; return Array.isArray(j) ? j : []; } catch { return []; }
}
/** Bir imtihon (startedAt bo'yicha) bir marta yoziladi; qayta chaqirilsa yangilanadi. */
export function recordMock(e: MockEntry): void {
  try {
    const all = loadMocks().filter((x) => x.at !== e.at);
    all.push(e);
    all.sort((a, b) => a.at - b.at);
    localStorage.setItem(KEY, JSON.stringify(all.slice(-30)));
  } catch { /* saqlash yo'q */ }
}
