import type { CurriculumNode } from './types';
// PILOT SLICE — structure test only. Status is 'draft': must NOT be shown to learners until reviewed by an English-language education specialist.
const n = (id: string, level: CurriculumNode['level'], skill: CurriculumNode['skill'], objective: string, taxonomyIds: CurriculumNode['taxonomyIds'], prerequisites: string[], estMinutes: number, examTags?: string[]): CurriculumNode =>
  ({ id, level, skill, objective, taxonomyIds, prerequisites, estMinutes, examTags, hasPractice: true, hasCheck: true, reviewStatus: 'draft' });

export const PILOT: CurriculumNode[] = [
  n('a1.be.present', 'A1', 'grammar', 'Use am/is/are to introduce yourself and others in 5 correct sentences.', ['G.sva'], [], 10),
  n('a1.articles.basic', 'A1', 'grammar', 'Choose a/an/the correctly in 8 of 10 simple noun phrases.', ['G.article'], [], 10),
  n('a1.plurals', 'A1', 'grammar', 'Form regular and common irregular plurals in 8 of 10 items.', ['G.plural'], ['a1.articles.basic'], 8),
  n('a1.vocab.daily', 'A1', 'vocabulary', 'Recognise and spell 40 high-frequency daily-life words.', ['V.spelling'], [], 12),
  n('a2.past.simple', 'A2', 'grammar', 'Describe yesterday using regular and irregular past-simple verbs.', ['G.tense'], ['a1.be.present'], 12),
  n('a2.prepositions.place', 'A2', 'grammar', 'Use in/on/at for place and time in 8 of 10 items.', ['G.preposition'], ['a1.articles.basic'], 10),
  n('a2.speaking.routine', 'A2', 'speaking', 'Talk about your daily routine for 45 seconds with few long pauses.', ['S.hesitation', 'S.fluency'], ['a2.past.simple'], 15),
  n('b1.conditionals.first', 'B1', 'grammar', 'Form and use first conditional sentences about real future situations.', ['G.conditional'], ['a2.past.simple'], 12),
  n('b1.writing.opinion', 'B1', 'writing', 'Write a 120-word opinion paragraph with a clear position and two reasons.', ['W.task_response', 'W.organisation'], ['b1.conditionals.first'], 20, ['ielts-writing-2']),
];
