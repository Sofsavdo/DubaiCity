// "Xatolar ustida ishlash" — the learner's own mistakes come back until they are fixed (Ibrat-style repetition).
// Sources: lesson checks, Grammar answers, rule-based writing feedback and AI Coach corrections.
// Scheduling (documented): a correct answer moves the item to the next interval [1, 3, 7] days; after 3 correct answers in a row it is "resolved";
// a wrong answer resets the streak and makes it due again in 10 minutes. Device-local until accounts exist.
import type { TaxonomyId } from './adaptive/taxonomy';

export type MistakeSource = 'lesson' | 'grammar' | 'writing' | 'coach';
export type MistakeRef =
  | { kind: 'fix'; wrong: string; right: string; whyUz: string }          // rewrite a wrong phrase
  | { kind: 'lesson'; lessonId: string; part: 'check' | 'practice'; index: number }
  | { kind: 'grammar'; grammarId: number };

export interface Mistake {
  id: string;
  source: MistakeSource;
  ref: MistakeRef;
  taxonomy: TaxonomyId[];
  createdAt: number;
  due: number;
  streak: number;
  attempts: number;
  resolvedAt: number | null;
}

const KEY = 'bandly.mistakes.v1';
const MAX = 300;
const DAY = 86_400_000;
export const INTERVALS_DAYS = [1, 3, 7];
export const RESOLVE_AFTER = 3;
export const RETRY_MS = 10 * 60_000;

export const normPhrase = (s: string): string => s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.!?,;:"«»“”]/g, '').replace(/\s+/g, ' ').trim();
export function keyOf(r: MistakeRef): string {
  return r.kind === 'fix' ? `fix:${normPhrase(r.wrong)}=>${normPhrase(r.right)}` : r.kind === 'lesson' ? `lesson:${r.lessonId}:${r.part}:${r.index}` : `grammar:${r.grammarId}`;
}

export function load(): Mistake[] {
  try { const raw = localStorage.getItem(KEY); const d = raw ? (JSON.parse(raw) as Mistake[]) : []; return Array.isArray(d) ? d : []; } catch { return []; }
}
function save(all: Mistake[]): void { try { localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX))); } catch { /* storage unavailable */ } }

/** Adds a mistake (or re-opens the same one if it was resolved). Due immediately. Returns the stored item. */
export function addMistake(source: MistakeSource, ref: MistakeRef, taxonomy: TaxonomyId[] = [], now = Date.now()): Mistake {
  if (ref.kind === 'fix' && (!ref.wrong.trim() || !ref.right.trim() || normPhrase(ref.wrong) === normPhrase(ref.right))) throw new Error('invalid fix');
  const all = load();
  const id = keyOf(ref);
  const i = all.findIndex((m) => m.id === id);
  if (i >= 0) {
    const m = { ...all[i]!, due: Math.min(all[i]!.due, now), streak: 0, resolvedAt: null };
    all[i] = m; save(all); return m;
  }
  const m: Mistake = { id, source, ref, taxonomy, createdAt: now, due: now, streak: 0, attempts: 0, resolvedAt: null };
  all.push(m); save(all); return m;
}

/** Pure scheduling step. */
export function reviewed(m: Mistake, correct: boolean, now = Date.now()): Mistake {
  if (!correct) return { ...m, attempts: m.attempts + 1, streak: 0, due: now + RETRY_MS, resolvedAt: null };
  const streak = m.streak + 1;
  if (streak >= RESOLVE_AFTER) return { ...m, attempts: m.attempts + 1, streak, resolvedAt: now, due: Number.MAX_SAFE_INTEGER };
  return { ...m, attempts: m.attempts + 1, streak, due: now + INTERVALS_DAYS[Math.min(streak - 1, INTERVALS_DAYS.length - 1)]! * DAY };
}

export function recordReview(id: string, correct: boolean, now = Date.now()): Mistake | null {
  const all = load(); const i = all.findIndex((m) => m.id === id);
  if (i < 0) return null;
  all[i] = reviewed(all[i]!, correct, now); save(all); return all[i]!;
}

export const dueMistakes = (now = Date.now(), all = load()): Mistake[] => all.filter((m) => !m.resolvedAt && m.due <= now).sort((a, b) => a.due - b.due);
export const openMistakes = (all = load()): Mistake[] => all.filter((m) => !m.resolvedAt);

/** For a 'fix' item: accepted when the learner's text contains the corrected phrase and no longer contains the wrong one. */
export function checkFix(ref: Extract<MistakeRef, { kind: 'fix' }>, answer: string): boolean {
  const a = ` ${normPhrase(answer)} `, right = ` ${normPhrase(ref.right)} `, wrong = ` ${normPhrase(ref.wrong)} `;
  return a.includes(right) && (right.includes(wrong) || !a.includes(wrong));
}
