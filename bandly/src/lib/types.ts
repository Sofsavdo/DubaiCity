export type TrackId = 'exam' | 'grammar' | 'mocks';

export interface CardState {
  box: number; // 0 = o'rganilmoqda, 5 = o'zlashtirilgan
  due: number; // keyingi takrorlash vaqti (ms)
  seen: number;
  correct: number;
  wrong: number;
}

export interface Profile {
  v: 1;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDay: string | null;
  dailyXp: number;
  dailyDay: string;
  dailyGoal: number;
  achievements: string[];
  /** DEMO: to'lov ulangunga qadar obuna holati qurilmada saqlanadi */
  plan: Record<TrackId, boolean>;
  srs: Record<string, CardState>;
  gamesPlayed: number;
  freeGames: { day: string; n: number };
  hardMode: boolean;
  /** Ustoz xarakteri 0–3 (2–3 faqat adult=true bo'lsa amal qiladi) */
  roastLevel: number;
  /** Foydalanuvchi 18 yoshdan oshganini o'zi tasdiqlagan */
  adult: boolean;
}

export const defaultProfile = (today: string): Profile => ({
  v: 1,
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDay: null,
  dailyXp: 0,
  dailyDay: today,
  dailyGoal: 50,
  achievements: [],
  plan: { exam: false, grammar: false, mocks: false },
  srs: {},
  gamesPlayed: 0,
  freeGames: { day: today, n: 0 },
  hardMode: false,
  roastLevel: 0,
  adult: false,
});
