// Sahna bo'yicha progress (qurilmada): bajarilgan bosqichlar va eng yaxshi natijalar.
const KEY = 'bandly.shadow.v1';
export type StepId = 'watch' | 'quiz' | 'cloze' | 'shadow' | 'dictate' | 'retell';
export interface SceneProgress { steps: StepId[]; best: Partial<Record<'quiz' | 'cloze' | 'shadow' | 'dictate' | 'retell', number>> }
type All = Record<string, SceneProgress>;

export function loadAll(): All { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as All; } catch { return {}; } }
export const progressOf = (id: string): SceneProgress => loadAll()[id] ?? { steps: [], best: {} };
/** Bosqichni belgilaydi va eng yaxshi natijani yangilaydi. Birinchi marta bajarilsa true qaytaradi (XP uchun). */
export function markStep(id: string, step: StepId, score?: number): boolean {
  const all = loadAll();
  const p = all[id] ?? { steps: [], best: {} };
  const first = !p.steps.includes(step);
  if (first) p.steps.push(step);
  if (score !== undefined && step !== 'watch') p.best[step] = Math.max(p.best[step] ?? 0, Math.round(score));
  all[id] = p;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* saqlash yo'q */ }
  return first;
}
