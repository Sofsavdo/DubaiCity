import type { ResultRecord } from './storage';
import type { Cefr } from './levels';
import type { Profile } from './types';

/** CEFR → taxminiy IELTS (o'rtacha). Rasmiy moslik emas: faqat boshlang'ich nuqta. */
export const LEVEL_BAND: Record<Cefr, number> = { A1: 3.0, A2: 4.0, B1: 5.0, B2: 6.0, C1: 7.0 };
/** Qiyinligi past testda yuqori ball ko'rsatilmasligi uchun chegara (A2 testdan 10/10 band 9 degani emas). */
export const BAND_CAP: Record<Cefr, number> = { A1: 3.5, A2: 4.5, B1: 5.5, B2: 7.0, C1: 9.0 };

export const capBand = (band: number, level: Cefr | undefined): number => (level ? Math.min(band, BAND_CAP[level]) : band);
export const roundHalf = (n: number): number => Math.round(n * 2) / 2;

export type Skill = 'reading' | 'listening' | 'speaking';
export type SkillBands = Partial<Record<Skill, number>>;

/** Har bir ko'nikma bo'yicha oxirgi 3 natijaning o'rtacha bandi. */
export function skillBands(results: ResultRecord[]): SkillBands {
  const out: SkillBands = {};
  for (const k of ['reading', 'listening', 'speaking'] as const) {
    const bands = results.filter((r) => r.kind === k && typeof r.band === 'number').slice(0, 3).map((r) => r.band as number);
    if (bands.length) out[k] = roundHalf(bands.reduce((a, b) => a + b, 0) / bands.length);
  }
  return out;
}

/** Hozirgi taxminiy daraja: bor ko'nikmalar o'rtachasi; yo'q bo'lsa — oxirgi daraja aniqlash natijasi. */
export function currentBand(p: Pick<Profile, 'level' | 'checkpoints'>, results: ResultRecord[]): number | null {
  const sb = skillBands(results);
  const vals = Object.values(sb);
  if (vals.length >= 2) return roundHalf(vals.reduce((a, b) => a + b, 0) / vals.length);
  const last = p.checkpoints[p.checkpoints.length - 1];
  if (vals.length === 1) return roundHalf(((vals[0] as number) + (last?.band ?? vals[0] as number)) / 2);
  return last ? last.band : p.level ? LEVEL_BAND[p.level] : null;
}

export interface Gain { baseline: number | null; current: number | null; delta: number | null; toTarget: number | null }
export function gain(p: Pick<Profile, 'level' | 'checkpoints' | 'baselineBand' | 'target'>, results: ResultRecord[]): Gain {
  const current = currentBand(p, results);
  const baseline = p.baselineBand;
  return { baseline, current, delta: baseline !== null && current !== null ? roundHalf(current - baseline) : null, toTarget: current !== null ? Math.max(0, roundHalf(p.target - current)) : null };
}

/** Cambridge/IELTS tavsiyasiga ko'ra bitta band uchun ~100–200 soat tayyorgarlik kerak: o'rtacha 150. */
export const HOURS_PER_BAND = 150;
export const hoursNeeded = (current: number, target: number): number => Math.round(Math.max(0, target - current) * HOURS_PER_BAND);

export interface StudyPlan { hours: number; daysLeft: number | null; minutesPerDay: number; weeksNeeded: number; focus: Skill[]; realistic: boolean }
/** Maqsadga erishish uchun kunlik vaqt va eng zaif ko'nikmalar. */
export function studyPlan(p: Pick<Profile, 'target' | 'examDate' | 'level' | 'checkpoints'>, results: ResultRecord[], now = Date.now(), perDayMinutes = 60): StudyPlan {
  const cur = currentBand(p, results) ?? 4;
  const hours = hoursNeeded(cur, p.target);
  const daysLeft = p.examDate ? Math.max(0, Math.ceil((new Date(p.examDate).getTime() - now) / 86_400_000)) : null;
  const minutesPerDay = daysLeft && daysLeft > 0 ? Math.min(240, Math.max(20, Math.round((hours * 60) / daysLeft))) : perDayMinutes;
  const weeksNeeded = hours === 0 ? 0 : Math.ceil((hours * 60) / (minutesPerDay * 7));
  const sb = skillBands(results);
  const order = (['reading', 'listening', 'speaking'] as const).slice().sort((a, b) => (sb[a] ?? cur) - (sb[b] ?? cur));
  return { hours, daysLeft, minutesPerDay, weeksNeeded, focus: order, realistic: daysLeft === null || daysLeft === 0 ? true : (hours * 60) / daysLeft <= 180 };
}

/** Oxirgi n kunning XP si (eskisi birinchi). */
export function lastDays(activity: Record<string, number>, n: number, now = Date.now()): { day: string; xp: number }[] {
  return Array.from({ length: n }, (_, i) => { const d = new Date(now - (n - 1 - i) * 86_400_000).toISOString().slice(0, 10); return { day: d, xp: activity[d] ?? 0 }; });
}

export const TASKS = ['words', 'grammar', 'practice', 'reading', 'listening', 'speaking'] as const;
export type TaskId = (typeof TASKS)[number];
