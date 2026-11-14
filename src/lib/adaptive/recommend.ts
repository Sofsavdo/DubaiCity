// Deterministic daily-plan selection (docs/audit/master-spec-v2/ADAPTIVE_LEARNING_SPEC.md). The LLM may rephrase explanations; it never changes the selection.
import type { CurriculumNode, ReviewStatus } from '../../content/curriculum/types';
import { effectiveMastery, type MasteryRecord, newRecord } from './mastery';
import type { TaxonomyId } from './taxonomy';

const DAY = 86_400_000;
const clamp = (x: number, lo = 0, hi = 1): number => Math.min(hi, Math.max(lo, x));
export const W = { weakness: 0.4, revision: 0.25, goal: 0.2, exam: 0.15 } as const;
export const PREREQ_MIN = 0.6;

export type ReasonCode = 'revision_due' | 'repeated_error' | 'weak_skill' | 'goal_match' | 'exam_soon' | 'next_step';

export interface LearnerState {
  mastery: Record<string, MasteryRecord>;
  recentErrors: TaxonomyId[];         // most recent last; only the last 10 are used
  goalTags: string[];                 // e.g. ['ielts-writing-2'] or ['general']
  examDate?: number;                  // ms
  assumed?: string[];                 // node ids treated as known prerequisites (e.g. levels below the placement result)
  now: number;
}
export interface PlanOptions { minutes: number; allowStatuses?: ReviewStatus[] }
export interface PlanTask { nodeId: string; minutes: number; score: number; reason: ReasonCode; params: Record<string, string | number>; isNew: boolean }

const mOf = (s: LearnerState, id: string): MasteryRecord => s.mastery[id] ?? newRecord();

export function scoreNode(n: CurriculumNode, s: LearnerState): { score: number; reason: ReasonCode; params: Record<string, string | number> } {
  const r = mOf(s, n.id);
  const eff = effectiveMastery(r, s.now);
  const last10 = s.recentErrors.slice(-10);
  const errHits = n.taxonomyIds.filter((t) => last10.includes(t));
  const weakness = clamp(0.8 * (1 - eff) + (errHits.length ? 0.2 : 0)); // 0.8/0.2 split keeps the repeated-error signal visible even for brand-new nodes (eff = 0)
  const overdueDays = r.attempts > 0 && r.dueAt <= s.now ? (s.now - r.dueAt) / DAY : -1;
  const revision = overdueDays >= 0 ? clamp(overdueDays / 7) : 0;
  const goal = n.examTags?.some((t) => s.goalTags.includes(t)) ? 1 : s.goalTags.includes('general') && !n.examTags?.length ? 0.5 : 0;
  const daysToExam = s.examDate !== undefined ? (s.examDate - s.now) / DAY : undefined;
  const exam = n.examTags?.length && daysToExam !== undefined ? clamp(1 - daysToExam / 90) : 0;
  const score = W.weakness * weakness + W.revision * revision + W.goal * goal + W.exam * exam;
  let reason: ReasonCode = 'next_step';
  let params: Record<string, string | number> = {};
  if (overdueDays >= 0) { reason = 'revision_due'; params = { days: Math.floor(overdueDays) }; }
  else if (errHits.length) { reason = 'repeated_error'; params = { taxonomy: errHits[0]!, count: last10.filter((t) => t === errHits[0]).length }; }
  else if (exam > 0.5) { reason = 'exam_soon'; params = { days: Math.max(0, Math.round(daysToExam ?? 0)) }; }
  else if (goal === 1) reason = 'goal_match';
  else if (r.attempts > 0 && eff < PREREQ_MIN) { reason = 'weak_skill'; params = { mastery: Math.round(eff * 100) }; }
  return { score, reason, params };
}

/** Build today's plan: due revisions first, then by score; at most 1 new node per 3 slots; prerequisites must be ≥ PREREQ_MIN; fills the minute budget. */
export function planDay(nodes: CurriculumNode[], s: LearnerState, opt: PlanOptions): PlanTask[] {
  const allowed = new Set<ReviewStatus>(opt.allowStatuses ?? ['approved', 'published', 'legacy', 'pilot']);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const assumed = new Set(s.assumed ?? []);
  const ready = (n: CurriculumNode): boolean => n.prerequisites.every((p) => assumed.has(p) || effectiveMastery(mOf(s, p), s.now) >= PREREQ_MIN); // prerequisites may lie outside the candidate window
  const cands = nodes
    .filter((n) => allowed.has(n.reviewStatus) && ready(n))
    .map((n) => ({ n, ...scoreNode(n, s), isNew: mOf(s, n.id).attempts === 0, due: mOf(s, n.id).attempts > 0 && mOf(s, n.id).dueAt <= s.now }))
    // a practised node takes a slot only when it is due for revision or still weak — freshly learned material is not re-served the same day
    .filter((c) => c.isNew || c.due || effectiveMastery(mOf(s, c.n.id), s.now) < PREREQ_MIN)
    .sort((a, b) => Number(b.due) - Number(a.due) || b.score - a.score || (a.n.id < b.n.id ? -1 : 1));
  const plan: PlanTask[] = [];
  const hasPracticed = cands.some((c) => !c.isNew); // cold start (nothing practised yet): the new-node cap is lifted so the day is not left nearly empty
  let used = 0, newCount = 0;
  for (const c of cands) {
    if (used + c.n.estMinutes > opt.minutes) continue;
    if (c.isNew && hasPracticed && newCount + 1 > Math.floor((plan.length + 1 + 2) / 3)) continue; // ≤ 1 new per 3 slots
    plan.push({ nodeId: c.n.id, minutes: c.n.estMinutes, score: Math.round(c.score * 1000) / 1000, reason: c.reason, params: c.params, isNew: c.isNew });
    used += c.n.estMinutes; if (c.isNew) newCount++;
  }
  return plan;
}

/** Default English explanation (i18n keys `plan.reason.<code>` replace this once the catalogue lands). */
export function explain(t: PlanTask): string {
  switch (t.reason) {
    case 'revision_due': return `This is due for revision (${t.params.days} day(s) overdue).`;
    case 'repeated_error': return `You repeated "${t.params.taxonomy}" mistakes ${t.params.count} time(s) recently, so this targets them.`;
    case 'exam_soon': return `Your exam is in ${t.params.days} day(s); this supports it.`;
    case 'goal_match': return 'This matches your goal.';
    case 'weak_skill': return `Your current mastery here is ${t.params.mastery}%.`;
    default: return 'This is the next step on your path.';
  }
}

export interface LoadAdjustment { slots: number; difficultyStep: number }
/** Weekly review: completion < 60 % lowers load by one slot; weekly-target mastery ≥ 85 % raises difficulty one step. Never below 1 slot. */
export function adjustLoad(prev: LoadAdjustment, completionRate: number, targetMasteryRate: number): LoadAdjustment {
  return {
    slots: completionRate < 0.6 ? Math.max(1, prev.slots - 1) : prev.slots,
    difficultyStep: targetMasteryRate >= 0.85 ? prev.difficultyStep + 1 : prev.difficultyStep,
  };
}
