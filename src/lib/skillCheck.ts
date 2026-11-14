// Skill check engine: Reading and Listening estimates, kept SEPARATE from the grammar/vocabulary placement level
// (General English level vs skill levels — Master Spec requirement). Deterministic and documented:
//   - the set nearest to the learner's placement level is used (A1→A2 set, C1→B2 set);
//   - score ≥ 3/4 (75 %) → estimate = the set's level; otherwise → one level below the set's level.
// The estimate is labelled "taxminiy" (estimate) everywhere; it is not an official CEFR or IELTS result.
import { SKILL_SETS, type SkillSet } from '../content/skillCheck';
import type { Cefr } from './levels';

const ORDER: Cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const SKILL_PASS = 0.75;

export function setFor(level: Cefr | null | undefined): SkillSet {
  const want = level ? ORDER.indexOf(level) : 1;
  return [...SKILL_SETS].sort((a, b) => Math.abs(ORDER.indexOf(a.level) - want) - Math.abs(ORDER.indexOf(b.level) - want) || ORDER.indexOf(a.level) - ORDER.indexOf(b.level))[0]!;
}

export function estimate(setLevel: Cefr, correct: number, total: number): Cefr {
  if (total > 0 && correct / total >= SKILL_PASS) return setLevel;
  return ORDER[Math.max(0, ORDER.indexOf(setLevel) - 1)]!;
}

export interface SkillLevels { reading?: { level: Cefr; correct: number; total: number; at: number }; listening?: { level: Cefr; correct: number; total: number; at: number } }
const KEY = 'bandly.skills.v1';
export function loadSkills(): SkillLevels {
  try { const raw = localStorage.getItem(KEY); const d = raw ? (JSON.parse(raw) as SkillLevels) : {}; return d && typeof d === 'object' ? d : {}; } catch { return {}; }
}
export function saveSkill(skill: 'reading' | 'listening', level: Cefr, correct: number, total: number, now = Date.now()): SkillLevels {
  const all = loadSkills(); all[skill] = { level, correct, total, at: now };
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage unavailable */ }
  return all;
}
