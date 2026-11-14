import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { easyPart2Cards } from '../content/speakingEasy';
import { part2Cards } from '../content/speaking';
import { writingTopics } from '../content/writingGuide';
import { levelIndex, type Cefr } from './levels';
import type { ResultRecord } from './storage';

export type HwId = 'listening' | 'reading' | 'writing' | 'speaking';
export interface HwTask { id: HwId; title: string; sub: string; href: string; done: boolean; result?: ResultRecord; deadline: number }

const DAY = 86_400_000;
export const dayIndex = (now: number): number => Math.floor(now / DAY);
/** Bugungi vazifalarning tugash vaqti: mahalliy 23:59 */
export const endOfDay = (now: number): number => { const d = new Date(now); d.setHours(23, 59, 0, 0); return d.getTime(); };
const isToday = (iso: string, now: number): boolean => new Date(iso).toDateString() === new Date(now).toDateString();

function pick<T extends { level: Cefr }>(list: T[], level: Cefr | null, di: number): T {
  const near = list.filter((t) => Math.abs(levelIndex(t.level) - levelIndex(level)) <= 1);
  const pool = (near.length ? near : list).slice().sort((a, b) => levelIndex(a.level) - levelIndex(b.level));
  return pool[di % pool.length];
}

/** Har kuni bir xil (deterministik) 4 ta vazifa: Listening, Reading, Writing, Speaking — darajaga mos. */
export function dailyTasks(level: Cefr | null, results: ResultRecord[], now = Date.now()): HwTask[] {
  const di = dayIndex(now);
  const L = pick(listeningTests, level, di), R = pick(readingTests, level, di);
  const W = writingTopics[di % writingTopics.length];
  const easy = level === 'A1' || level === 'A2';
  const S = easy ? easyPart2Cards[di % easyPart2Cards.length] : part2Cards[di % part2Cards.length];
  const today = results.filter((r) => isToday(r.date, now));
  const find = (kind: ResultRecord['kind'], title?: string) => today.find((r) => r.kind === kind && (!title || r.title === title));
  const deadline = endOfDay(now);
  const mk = (id: HwId, title: string, sub: string, href: string, result?: ResultRecord): HwTask => ({ id, title, sub, href, done: !!result, result, deadline });
  return [
    mk('listening', 'Listening', L.title.replace(/^Listening mini-test \d+: /, ''), `#/exam/listening/${L.id}`, find('listening', L.title)),
    mk('reading', 'Reading', R.title.replace(/^Reading mini-test \d+: /, ''), `#/exam/reading/${R.id}`, find('reading', R.title)),
    mk('writing', 'Writing', `Task 2 · ${W.title}`, '#/exam/writing', find('writing', `Task 2: ${W.title}`)),
    mk('speaking', 'Speaking', `Part 2 · ${S.title.replace(/^Describe /, 'Describe ')}`, '#/exam/speaking', find('speaking')),
  ];
}

/** Ketma-ket vazifa bajarilgan kunlar (kamida 1 ta vazifa) — bugundan orqaga. */
export function homeworkStreak(results: ResultRecord[], now = Date.now()): number {
  const days = new Set(results.map((r) => new Date(r.date).toDateString()));
  let n = 0;
  for (let i = 0; i < 365; i++) { const d = new Date(now - i * DAY).toDateString(); if (days.has(d)) n++; else if (i > 0) break; else continue; }
  return n;
}

export function timeLeft(deadline: number, now = Date.now()): string {
  const ms = Math.max(0, deadline - now);
  const h = Math.floor(ms / 3_600_000), m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h} soat ${m} daqiqa qoldi` : `${m} daqiqa qoldi`;
}
