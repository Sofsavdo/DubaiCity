// Browser persistence for the adaptive engine (localStorage, key bandly.mastery.v1). Server-side persistence arrives with accounts (M3/M4); until then this is local to the device.
import { newRecord, update, type MasteryRecord } from './mastery';
import type { TaxonomyId } from './taxonomy';

const KEY = 'bandly.mastery.v1';
const MAX_ERRORS = 30;
export interface Saved { v: 1; mastery: Record<string, MasteryRecord>; errors: TaxonomyId[] }
const empty = (): Saved => ({ v: 1, mastery: {}, errors: [] });

export function loadAdaptive(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const d = JSON.parse(raw) as Saved;
    return d && d.v === 1 && d.mastery && Array.isArray(d.errors) ? d : empty();
  } catch { return empty(); }
}
function save(s: Saved): void { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: the plan simply stays empty */ } }

export const localDayKey = (now: number): string => { const d = new Date(now); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/** Record one answered item for a curriculum node. Wrong answers also log the node's error-taxonomy ids. */
export function recordAnswer(nodeId: string, correct: boolean, taxonomy: TaxonomyId[], now = Date.now(), difficulty = 0.5): void {
  const s = loadAdaptive();
  s.mastery[nodeId] = update(s.mastery[nodeId] ?? newRecord(), { correct, difficulty, now, dayKey: localDayKey(now) });
  if (!correct) s.errors = [...s.errors, ...taxonomy].slice(-MAX_ERRORS);
  save(s);
}
