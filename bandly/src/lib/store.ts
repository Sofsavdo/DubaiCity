import { useSyncExternalStore } from 'react';
import { applyXp, dayKey } from './game';
import { review } from './srs';
import { defaultProfile, type Profile, type TrackId } from './types';
import { FREE_GAMES_PER_DAY } from '../config';

const KEY = 'bandly.profile.v1';

function load(): Profile {
  const base = defaultProfile(dayKey());
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<Profile>) };
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
  commit(r.profile);
  pushToast(`+${Math.round(amount)} XP`, 'xp');
  if (r.levelUp) pushToast(`Yangi daraja: ${r.levelUp}!`, 'level');
  r.unlocked.forEach((a) => pushToast(`Yutuq: ${a.title}`, 'ach'));
}

export function recordReview(wordId: string, correct: boolean): void {
  commit({ ...state, srs: { ...state.srs, [wordId]: review(state.srs[wordId], correct, Date.now()) } });
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
export function setHardMode(on: boolean): void {
  commit({ ...state, hardMode: on });
}
export function setDailyGoal(goal: number): void {
  commit({ ...state, dailyGoal: goal });
}
export function resetAll(): void {
  commit(defaultProfile(dayKey()));
}
