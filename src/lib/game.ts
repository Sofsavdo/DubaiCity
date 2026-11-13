import type { Profile } from './types';
import { MASTERED_BOX } from './srs';

export const dayKey = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const utcDays = (key: string): number => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
};
export const daysBetween = (a: string, b: string): number => utcDays(b) - utcDays(a);

export function nextStreak(last: string | null, today: string, streak: number): number {
  if (!last) return 1;
  const diff = daysBetween(last, today);
  if (diff <= 0) return Math.max(streak, 1);
  return diff === 1 ? streak + 1 : 1;
}

export const xpForLevel = (level: number): number => 50 * (level - 1) * (level - 1);
export const levelFromXp = (xp: number): number => Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;

export function levelProgress(xp: number): { level: number; into: number; span: number; pct: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const span = xpForLevel(level + 1) - base;
  return { level, into: xp - base, span, pct: Math.min(1, (xp - base) / span) };
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  check: (p: Profile) => boolean;
}

const masteredCount = (p: Profile): number => Object.values(p.srs).filter((c) => c.box >= MASTERED_BOX).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-xp', title: 'Birinchi qadam', desc: 'Birinchi XP ni yig‘ing', check: (p) => p.xp > 0 },
  { id: 'streak-3', title: '3 kunlik seriya', desc: 'Ketma-ket 3 kun mashq qiling', check: (p) => p.streak >= 3 },
  { id: 'streak-7', title: 'Haftalik seriya', desc: 'Ketma-ket 7 kun mashq qiling', check: (p) => p.streak >= 7 },
  { id: 'level-5', title: '5-daraja', desc: '5-darajaga yeting', check: (p) => levelFromXp(p.xp) >= 5 },
  { id: 'words-10', title: '10 ta so‘z', desc: '10 ta so‘zni o‘zlashtiring', check: (p) => masteredCount(p) >= 10 },
  { id: 'words-30', title: 'So‘z ustasi', desc: '30 ta so‘zni o‘zlashtiring', check: (p) => masteredCount(p) >= 30 },
  { id: 'games-10', title: 'O‘yinchi', desc: '10 ta o‘yin o‘ynang', check: (p) => p.gamesPlayed >= 10 },
  { id: 'daily-goal', title: 'Kunlik maqsad', desc: 'Kunlik XP maqsadini bajaring', check: (p) => p.dailyXp >= p.dailyGoal },
];

export interface XpResult {
  profile: Profile;
  levelUp: number | null;
  unlocked: Achievement[];
}

/** Sof funksiya: XP qo'shadi, seriya va kunlik hisobni yangilaydi, yutuqlarni tekshiradi. */
export function applyXp(p: Profile, amount: number, today: string): XpResult {
  const amt = Math.max(0, Math.round(amount));
  const rolled: Profile = p.dailyDay === today ? p : { ...p, dailyDay: today, dailyXp: 0 };
  const streak = nextStreak(rolled.lastActiveDay, today, rolled.streak);
  const next: Profile = {
    ...rolled,
    xp: rolled.xp + amt,
    dailyXp: rolled.dailyXp + amt,
    streak,
    longestStreak: Math.max(rolled.longestStreak, streak),
    lastActiveDay: today,
  };
  const before = new Set(next.achievements);
  const unlocked = ACHIEVEMENTS.filter((a) => !before.has(a.id) && a.check(next));
  next.achievements = [...next.achievements, ...unlocked.map((a) => a.id)];
  const lv0 = levelFromXp(p.xp);
  const lv1 = levelFromXp(next.xp);
  return { profile: next, levelUp: lv1 > lv0 ? lv1 : null, unlocked };
}
