export interface ResultRecord {
  id: string;
  kind: 'reading' | 'listening' | 'grammar' | 'speaking' | 'practice' | 'writing';
  title: string;
  correct: number;
  total: number;
  band?: number;
  level?: string;
  date: string;
}

import { markDone } from './store';

const KEY = 'bandly.results.v1';

export function loadResults(): ResultRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ResultRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveResult(r: Omit<ResultRecord, 'id' | 'date'>): void {
  markDone(r.kind);
  try {
    const all = loadResults();
    all.unshift({ ...r, id: String(Date.now()), date: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200)));
  } catch {
    /* localStorage mavjud bo'lmasa, natija saqlanmaydi */
  }
}
