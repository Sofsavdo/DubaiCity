// Lesson engine: deterministic checking, mastery-check scoring and local progress. Pure functions + a small localStorage store.
import type { Item, Lesson, Unit } from '../content/lessons/types';

export const PASS_RATE = 0.8; // mastery check pass mark (hypothesis; reviewed with the curriculum)

/** Lower-case, unify apostrophes, collapse spaces, drop final punctuation. "I'm  Ali." == "i’m ali" */
export const normalize = (s: string): string =>
  s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();

export type ItemAnswer = number | string | string[] | undefined;

export function checkItem(item: Item, a: ItemAnswer): boolean {
  if (a === undefined) return false;
  switch (item.kind) {
    case 'choice': return a === item.answer;
    case 'gap': return typeof a === 'string' && item.accept.some((x) => normalize(x) === normalize(a));
    case 'order': return normalize(Array.isArray(a) ? a.join(' ') : String(a)) === normalize(item.answer);
  }
}

export function correctAnswerText(item: Item): string {
  return item.kind === 'choice' ? item.options[item.answer]! : item.kind === 'gap' ? item.accept[0]! : item.answer;
}

export interface CheckResult { correct: number; total: number; rate: number; passed: boolean }
export function scoreCheck(items: Item[], answers: ItemAnswer[]): CheckResult {
  const correct = items.filter((it, i) => checkItem(it, answers[i])).length;
  const total = items.length;
  const rate = total ? correct / total : 0;
  return { correct, total, rate, passed: total > 0 && rate >= PASS_RATE };
}

/** Problems in lesson content (empty = valid). Used by tests so broken content never ships. */
export function validateLesson(l: Lesson): string[] {
  const p: string[] = [];
  const need = (c: boolean, m: string) => { if (!c) p.push(`${l.id}: ${m}`); };
  need(!!l.objectiveUz.trim() && !!l.objective.trim(), 'objective missing');
  need(l.explanationUz.length > 0, 'explanation missing');
  need(l.examples.length >= 3, 'needs ≥ 3 examples');
  need(l.practice.length >= 4, 'needs ≥ 4 practice items');
  need(l.check.length >= 5, 'mastery check needs ≥ 5 items');
  need(l.taxonomyIds.length > 0, 'no taxonomy ids');
  need(l.minutes > 0, 'minutes must be > 0');
  for (const [i, it] of [...l.practice, ...l.check].entries()) {
    if (!it.explainUz.trim()) p.push(`${l.id} item ${i}: no explanation`);
    if (it.kind === 'choice') { if (it.answer < 0 || it.answer >= it.options.length) p.push(`${l.id} item ${i}: answer index out of range`); if (new Set(it.options).size !== it.options.length) p.push(`${l.id} item ${i}: duplicate options`); }
    if (it.kind === 'gap') { if (!it.prompt.includes('___')) p.push(`${l.id} item ${i}: gap prompt lacks ___`); if (!it.accept.length) p.push(`${l.id} item ${i}: no accepted answer`); }
    if (it.kind === 'order') { const w = normalize(it.words.join(' ')).split(' ').sort().join(' '); const a = normalize(it.answer).split(' ').sort().join(' '); if (w !== a) p.push(`${l.id} item ${i}: words do not form the answer`); }
  }
  return p;
}

// ---------- local progress (moves server-side with accounts) ----------
const KEY = 'bandly.lessons.v1';
export interface LessonProgress { attempts: number; best: number; passedAt: number | null }
export type ProgressMap = Record<string, LessonProgress>;
export function loadProgress(): ProgressMap {
  try { const raw = localStorage.getItem(KEY); const d = raw ? JSON.parse(raw) as ProgressMap : {}; return d && typeof d === 'object' ? d : {}; } catch { return {}; }
}
export function saveAttempt(lessonId: string, r: CheckResult, now = Date.now()): LessonProgress {
  const all = loadProgress(); const prev = all[lessonId] ?? { attempts: 0, best: 0, passedAt: null };
  const next: LessonProgress = { attempts: prev.attempts + 1, best: Math.max(prev.best, r.rate), passedAt: prev.passedAt ?? (r.passed ? now : null) };
  all[lessonId] = next;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage unavailable */ }
  return next;
}

/** A lesson is open when it is the first of its unit, or the previous lesson in the unit is passed. Units themselves are all browsable. */
export function isUnlocked(unit: Unit, index: number, progress: ProgressMap): boolean {
  return index === 0 || !!progress[unit.lessons[index - 1]!.id]?.passedAt;
}
