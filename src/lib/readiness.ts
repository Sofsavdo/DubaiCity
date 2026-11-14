// IELTS readiness — kept SEPARATE from the General English level. Built only from the learner's own estimated test bands.
// Rules (documented, deterministic):
//  - per skill: average of the last up to 3 estimated bands, rounded to 0.5; evidence = number of results used;
//  - overall: average of available skills (needs ≥ 2 skills), rounded to 0.5;
//  - confidence: 'none' (no skill), 'low' (1 skill, or any used skill has a single result), 'medium' (≥ 2 skills, each ≥ 2 results), 'good' (all 3 skills, each ≥ 3 results);
//  - Writing has no band: it is checked by rules only until an AI evaluator is approved (OD-09);
//  - all values are estimates, never official IELTS scores.
import type { ResultRecord } from './storage';
import { roundHalf } from './progress';

export type ExamSkill = 'reading' | 'listening' | 'speaking';
export interface SkillReadiness { band: number | null; evidence: number }
export interface Readiness {
  skills: Record<ExamSkill, SkillReadiness>;
  overall: number | null;
  confidence: 'none' | 'low' | 'medium' | 'good';
  target: number;
  gap: number | null;               // target − overall (≥ 0)
  weakest: ExamSkill | null;        // lowest band; a skill with no evidence counts as weakest
  daysToExam: number | null;
}

export function readiness(results: ResultRecord[], target: number, examDate: string | null | undefined, now = Date.now()): Readiness {
  const skills = {} as Record<ExamSkill, SkillReadiness>;
  for (const k of ['reading', 'listening', 'speaking'] as const) {
    const bands = results.filter((r) => r.kind === k && typeof r.band === 'number').slice(0, 3).map((r) => r.band as number);
    skills[k] = { band: bands.length ? roundHalf(bands.reduce((a, b) => a + b, 0) / bands.length) : null, evidence: bands.length };
  }
  const have = (Object.keys(skills) as ExamSkill[]).filter((k) => skills[k].band !== null);
  const overall = have.length >= 2 ? roundHalf(have.reduce((s, k) => s + (skills[k].band as number), 0) / have.length) : null;
  const minEv = have.length ? Math.min(...have.map((k) => skills[k].evidence)) : 0;
  const confidence = have.length === 0 ? 'none' : have.length === 1 || minEv < 2 ? 'low' : have.length === 3 && minEv >= 3 ? 'good' : 'medium';
  const missing = (['reading', 'listening', 'speaking'] as const).find((k) => skills[k].band === null);
  const weakest = missing ?? (have.length ? have.reduce((a, b) => ((skills[b].band as number) < (skills[a].band as number) ? b : a)) : null);
  const days = examDate ? Math.ceil((Date.parse(examDate) - now) / 86_400_000) : null;
  return { skills, overall, confidence, target, gap: overall !== null ? Math.max(0, roundHalf(target - overall)) : null, weakest, daysToExam: days !== null && Number.isFinite(days) ? days : null };
}
