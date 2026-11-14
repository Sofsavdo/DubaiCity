// Mastery model — documented in docs/audit/master-spec-v2/ADAPTIVE_LEARNING_SPEC.md. Constants are STARTING HYPOTHESES (to be calibrated with real data).
// Pure and deterministic: all clocks and day keys are passed in by the caller (day key = user's local YYYY-MM-DD).
const DAY = 86_400_000;

export const PARAMS = {
  k: 0.25, kEarly: 0.35, earlyAttempts: 3,
  fastGuessRatio: 0.2, fastGuessWeight: 0.5,
  tau: { learning: 14, known: 45, mastered: 120 } as const, // days
  knownAt: 0.6, masteredAt: 0.85, masteredMinAttempts: 5, masteredMinDays: 3, masteredLastCorrect: 3,
  baseIntervalDays: 1, maxIntervalDays: 180,
} as const;

export type MasteryState = 'new' | 'learning' | 'known' | 'needs_revision' | 'mastered';

export interface MasteryRecord {
  m: number;               // raw mastery 0..1 at lastSeen
  attempts: number;
  distinctDays: number;
  lastDay: string | null;  // last local day key counted
  lastSeen: number;        // ms
  recent: boolean[];       // last up to 3 results (oldest first)
  streak: number;          // consecutive correct
  everKnown: boolean;      // reached 'known' or better at any time
  dueAt: number;           // ms, next review
}
export const newRecord = (): MasteryRecord => ({ m: 0, attempts: 0, distinctDays: 0, lastDay: null, lastSeen: 0, recent: [], streak: 0, everKnown: false, dueAt: 0 });

export interface Attempt { correct: boolean; difficulty: number; now: number; dayKey: string; responseMs?: number; typicalMs?: number }

const clamp = (x: number, lo = 0, hi = 1): number => Math.min(hi, Math.max(lo, x));

function tauDays(m: number): number {
  return m >= PARAMS.masteredAt ? PARAMS.tau.mastered : m >= PARAMS.knownAt ? PARAMS.tau.known : PARAMS.tau.learning;
}

/** Mastery after recency decay, evaluated at `now`. Never below 0, never above stored m. */
export function effectiveMastery(r: MasteryRecord, now: number): number {
  if (r.attempts === 0) return 0;
  const days = Math.max(0, (now - r.lastSeen) / DAY);
  return clamp(r.m * Math.exp(-days / tauDays(r.m)));
}

export function stateOf(r: MasteryRecord, now: number): MasteryState {
  if (r.attempts === 0) return 'new';
  const e = effectiveMastery(r, now);
  const lastOk = r.recent.length >= PARAMS.masteredLastCorrect && r.recent.slice(-PARAMS.masteredLastCorrect).every(Boolean);
  if (e >= PARAMS.masteredAt && r.attempts >= PARAMS.masteredMinAttempts && r.distinctDays >= PARAMS.masteredMinDays && lastOk) return 'mastered';
  if (e >= PARAMS.knownAt) return 'known';
  return r.everKnown ? 'needs_revision' : 'learning';
}

/** Interval until next review: base * 2^streak * (0.5 + m_eff), capped; a wrong answer resets to base (1 day). */
export function reviewIntervalDays(streak: number, mEff: number, correct: boolean): number {
  if (!correct) return PARAMS.baseIntervalDays;
  return Math.min(PARAMS.maxIntervalDays, PARAMS.baseIntervalDays * 2 ** streak * (0.5 + clamp(mEff)));
}

/** Append-only update: returns a NEW record. Raw m moves from the decayed value toward the result. */
export function update(r: MasteryRecord, a: Attempt): MasteryRecord {
  const d = clamp(a.difficulty);
  const base = effectiveMastery(r, a.now); // learner starts from what they still retain
  const k = r.attempts < PARAMS.earlyAttempts ? PARAMS.kEarly : PARAMS.k;
  let step = k * ((a.correct ? 1 : 0) - base) * (0.6 + 0.4 * d);
  if (a.correct && a.responseMs !== undefined && a.typicalMs && a.responseMs < PARAMS.fastGuessRatio * a.typicalMs) step *= PARAMS.fastGuessWeight; // suspiciously fast right answer
  // a correct answer never lowers mastery, a wrong one never raises it
  const m = clamp(a.correct ? Math.max(base, base + step) : Math.min(base, base + step));
  const streak = a.correct ? r.streak + 1 : 0;
  const next: MasteryRecord = {
    m,
    attempts: r.attempts + 1,
    distinctDays: r.distinctDays + (r.lastDay === a.dayKey ? 0 : 1),
    lastDay: a.dayKey,
    lastSeen: a.now,
    recent: [...r.recent, a.correct].slice(-PARAMS.masteredLastCorrect),
    streak,
    everKnown: r.everKnown,
    dueAt: a.now + reviewIntervalDays(streak > 0 ? streak - 1 : 0, m, a.correct) * DAY,
  };
  if (m >= PARAMS.knownAt) next.everKnown = true;
  return next;
}
