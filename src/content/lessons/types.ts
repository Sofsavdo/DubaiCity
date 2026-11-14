import type { Level, ReviewStatus } from '../curriculum/types';
import type { TaxonomyId } from '../../lib/adaptive/taxonomy';

/** Exercise items. All answers are checked deterministically (no AI). */
export type Item =
  | { kind: 'choice'; prompt: string; options: string[]; answer: number; explainUz: string }
  | { kind: 'gap'; prompt: string; accept: string[]; explainUz: string }    // prompt contains "___"
  | { kind: 'order'; words: string[]; answer: string; explainUz: string };   // arrange words into the answer sentence

/** Short guided writing task, checked by rules (no AI): length, required structures, forbidden patterns, known learner errors. */
export interface WritingTask {
  promptUz: string;
  minWords: number;
  require: { re: string; labelUz: string }[];   // case-insensitive regex sources; ALL must match
  forbid?: { re: string; labelUz: string }[];   // must NOT match
  model: string;                                 // model answer shown after checking
}

export interface Lesson {
  id: string;                  // stable, e.g. 'a1-u1-l1'
  title: string;               // English title
  titleUz: string;
  objectiveUz: string;         // one measurable sentence (learner-facing)
  objective: string;           // English, for the curriculum graph
  taxonomyIds: TaxonomyId[];
  minutes: number;
  explanationUz: string[];     // short paragraphs
  table?: { form: string; example: string }[];
  examples: { en: string; uz: string }[];
  vocab?: { en: string; uz: string }[];
  practice: Item[];            // guided practice, instant feedback
  check: Item[];               // mastery check, scored at the end
  writing?: WritingTask;
}

export interface Unit {
  id: string;
  level: Level;
  title: string;
  titleUz: string;
  situationUz: string;         // real-life situation the unit is built around
  status: ReviewStatus;
  lessons: Lesson[];
}
