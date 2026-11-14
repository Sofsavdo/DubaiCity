import type { TaxonomyId } from '../../lib/adaptive/taxonomy';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
/** 'legacy' = content that shipped before the review process existed: already live, NOT yet specialist-reviewed (flagged for review). */
export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'legacy';
export type CurriculumSkill = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'pronunciation' | 'writing' | 'everyday';

/** One lesson/skill node in the curriculum graph. Only `approved`/`published` nodes may be shown to learners. */
export interface CurriculumNode {
  id: string;
  level: Level;
  skill: CurriculumSkill;
  objective: string;          // one measurable sentence
  taxonomyIds: TaxonomyId[];  // errors this node remediates
  prerequisites: string[];
  estMinutes: number;
  examTags?: string[];        // e.g. 'ielts-writing-2'
  hasPractice: boolean;       // practice activity exists
  hasCheck: boolean;          // mastery check exists
  reviewStatus: ReviewStatus;
}
