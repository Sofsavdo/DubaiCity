import { useSyncExternalStore } from 'react';
import { applyXp, dayKey } from './game';
import { review } from './srs';
import { effectiveLevel } from './roast';
import { defaultProfile, type Profile, type TrackId } from './types';
import { FREE_GAMES_PER_DAY } from '../config';
import type { Cefr } from './levels';
import { LEVEL_BAND } from './progress';
import { confetti, sfx } from './fx';

const KEY = 'bandly.profile.v1';

function load(): Profile {
  const base = defaultProfile(dayKey());
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const m = { ...base, ...(JSON.parse(raw) as Partial<Profile>) }; return { ...m, hardMode: effectiveLevel(m.roastLevel, m.adult) >= 2 }; }
  } catch {
    /* buzilgan yoki mavjud bo'lmagan saqlash: boshlang'ich holat */
  }
  return base;
}

let state: Profile = load();
const listeners = new Set<() => void>();

function commit(next: Profile): void {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* saqlash mumkin bo'lmasa, sessiya davomida xotirada qoladi */
  }
  listeners.forEach((l) => l());
}

export const useProfile = (): Profile =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );

export const getProfile = (): Profile => state;

// ---- Toast xabarlari (saqlanmaydi) ----
export interface Toast { id: number; text: string; kind: 'xp' | 'level' | 'ach' }
let toasts: Toast[] = [];
const tListeners = new Set<() => void>();
let tid = 0;
export function pushToast(text: string, kind: Toast['kind'] = 'xp'): void {
  const t: Toast = { id: ++tid, text, kind };
  toasts = [...toasts, t].slice(-4);
  tListeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    tListeners.forEach((l) => l());
  }, 3500);
}
export const useToasts = (): Toast[] =>
  useSyncExternalStore(
    (cb) => {
      tListeners.add(cb);
      return () => tListeners.delete(cb);
    },
    () => toasts,
  );

// ---- Amallar ----
export function addXp(amount: number): void {
  if (amount <= 0) return;
  const r = applyXp(state, amount, dayKey());
  const day = dayKey();
  const act = { ...r.profile.activity, [day]: (r.profile.activity[day] ?? 0) + Math.round(amount) };
  const keep = Object.keys(act).sort().slice(-90);
  commit({ ...r.profile, activity: Object.fromEntries(keep.map((k) => [k, act[k]])) });
  pushToast(`+${Math.round(amount)} XP`, 'xp');
  if (r.levelUp) { pushToast(`Yangi daraja: ${r.levelUp}!`, 'level'); sfx('level'); confetti(90); }
  r.unlocked.forEach((a) => { pushToast(`Yutuq: ${a.title}`, 'ach'); if (!r.levelUp) { sfx('ach'); confetti(50); } });
}

export function recordReview(wordId: string, correct: boolean): void {
  sfx(correct ? 'ok' : 'bad');
  const task = /^g\d+$/.test(wordId) ? 'grammar' : /^p[tfugb]\d+$/.test(wordId) ? 'practice' : 'words';
  commit({ ...state, srs: { ...state.srs, [wordId]: review(state.srs[wordId], correct, Date.now()) } });
  markDone(task);
}

export function hasAnyPlan(p: Profile = state): boolean {
  return p.plan.exam || p.plan.grammar || p.plan.mocks;
}

export function freeGamesLeft(p: Profile = state): number {
  if (hasAnyPlan(p)) return Infinity;
  const today = dayKey();
  return p.freeGames.day === today ? Math.max(0, FREE_GAMES_PER_DAY - p.freeGames.n) : FREE_GAMES_PER_DAY;
}

/** O'yin boshlashda chaqiriladi. Bepul limit tugagan bo'lsa false qaytaradi. */
export function consumeGame(): boolean {
  if (freeGamesLeft() <= 0) return false;
  const today = dayKey();
  const n = state.freeGames.day === today ? state.freeGames.n + 1 : 1;
  commit({ ...state, gamesPlayed: state.gamesPlayed + 1, freeGames: { day: today, n } });
  return true;
}

export function setPlan(track: TrackId, on: boolean): void {
  commit({ ...state, plan: { ...state.plan, [track]: on } });
}
/** Ustoz xarakteri. 18+ tasdiqlanmasa 2–3 daraja tanlab bo'lmaydi. */
export function setPersona(level: number, adult: boolean): void {
  const lv = effectiveLevel(level, adult);
  commit({ ...state, roastLevel: lv, adult, hardMode: lv >= 2 });
}
export const personaLevel = (p: Profile = state) => effectiveLevel(p.roastLevel, p.adult);
export function setLevel(level: Cefr, target: number, examDate: string | null): void {
  const band = LEVEL_BAND[level];
  const at = new Date().toISOString();
  commit({ ...state, level, target, examDate, placementAt: at, dailyGoal: level === 'A1' || level === 'A2' ? 40 : 60, baselineBand: state.baselineBand ?? band, checkpoints: [...state.checkpoints, { at, level, band }].slice(-20) });
}
/** Bugungi rejadagi vazifa bajarildi (bir martalik belgi). */
export function markDone(task: string): void {
  const key = TASK_BY_KIND[task] ?? task;
  const today = dayKey();
  const done = state.today.day === today ? state.today.done : [];
  if (done.includes(key)) { if (state.today.day !== today) commit({ ...state, today: { day: today, done } }); return; }
  commit({ ...state, today: { day: today, done: [...done, key] } });
}
const TASK_BY_KIND: Record<string, string> = { reading: 'reading', listening: 'listening', speaking: 'speaking', grammar: 'grammar', practice: 'practice' };
export function setTarget(target: number, examDate: string | null): void {
  commit({ ...state, target, examDate });
}
export function setDailyGoal(goal: number): void {
  commit({ ...state, dailyGoal: goal });
}
export function resetAll(): void {
  commit(defaultProfile(dayKey()));
}
