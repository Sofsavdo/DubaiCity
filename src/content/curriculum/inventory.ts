import type { CurriculumNode, Level } from './types';
import type { TaxonomyId } from '../../lib/adaptive/taxonomy';
import { grammar, topicLevel } from '../grammar';

// INVENTORY of content that is ALREADY LIVE in the app, expressed as curriculum nodes (status 'legacy': shipped, not yet specialist-reviewed).
// Source of truth for the items stays src/content/grammar.ts; counts are derived, never hand-typed.
interface Spec { slug: string; topic: string; objective: string; tax: TaxonomyId[]; pre: string[]; minutes: number }

const SPECS: Spec[] = [
  { slug: 'be-there-is', topic: 'To be va there is', objective: 'Use am/is/are and there is/are correctly in simple statements and questions.', tax: ['G.sva'], pre: [], minutes: 8 },
  { slug: 'present-simple', topic: 'Present Simple', objective: 'Use the present simple for habits and facts, including he/she/it -s forms.', tax: ['G.tense', 'G.sva'], pre: [], minutes: 8 },
  { slug: 'pronouns-possessives', topic: 'Olmoshlar va egalik', objective: 'Choose subject, object and possessive pronouns correctly.', tax: ['G.pronoun'], pre: [], minutes: 8 },
  { slug: 'past-simple', topic: 'Past Simple', objective: 'Describe finished past events with regular and irregular verbs.', tax: ['G.tense'], pre: ['be-there-is', 'present-simple'], minutes: 10 },
  { slug: 'articles', topic: 'Artikllar', objective: 'Choose a/an/the/zero article correctly in common noun phrases.', tax: ['G.article'], pre: ['be-there-is'], minutes: 10 },
  { slug: 'prepositions', topic: 'Predloglar', objective: 'Use common prepositions of place, time and movement correctly.', tax: ['G.preposition'], pre: ['be-there-is'], minutes: 10 },
  { slug: 'quantity', topic: 'Sonlar va miqdor', objective: 'Use numbers and quantifiers (some/any/much/many/a few) correctly.', tax: ['G.quantifier', 'G.plural'], pre: ['pronouns-possessives'], minutes: 8 },
  { slug: 'comparison', topic: 'Taqqoslash', objective: 'Form and use comparative and superlative adjectives.', tax: ['G.comparison'], pre: ['present-simple'], minutes: 8 },
  { slug: 'tenses', topic: 'Zamonlar', objective: 'Choose between present perfect, past simple and future forms.', tax: ['G.tense'], pre: ['past-simple'], minutes: 12 },
  { slug: 'conditionals', topic: 'Shart gaplar', objective: 'Form and use zero, first and second conditional sentences.', tax: ['G.conditional'], pre: ['past-simple'], minutes: 12 },
  { slug: 'agreement', topic: 'Ega va kesim moslashuvi', objective: 'Make the verb agree with its subject in complex sentences.', tax: ['G.sva'], pre: ['present-simple', 'quantity'], minutes: 10 },
  { slug: 'modals', topic: 'Modal fe‘llar', objective: 'Use modal verbs for ability, obligation, advice and possibility.', tax: ['G.modal'], pre: ['present-simple'], minutes: 10 },
  { slug: 'passive', topic: 'Majhul nisbat', objective: 'Form and use the passive voice in common tenses.', tax: ['G.passive'], pre: ['tenses'], minutes: 12 },
  { slug: 'relative-clauses', topic: 'Nisbiy gaplar', objective: 'Join sentences with who/which/that relative clauses.', tax: ['G.relative_clause'], pre: ['tenses'], minutes: 12 },
  { slug: 'gerund-infinitive', topic: 'Gerund va infinitiv', objective: 'Choose gerund or infinitive after common verbs and prepositions.', tax: ['G.gerund_infinitive'], pre: ['tenses'], minutes: 12 },
  { slug: 'complex-structures', topic: 'Murakkab tuzilmalar', objective: 'Use inversion, cleft and other advanced structures accurately.', tax: ['G.complex_structure', 'G.word_order'], pre: ['passive', 'relative-clauses'], minutes: 15 },
];

const id = (slug: string): string => `ge.grammar.${slug}`;
const count = (topic: string): number => grammar.filter((g) => g.topic === topic).length;

export const GRAMMAR_NODES: CurriculumNode[] = SPECS.map((s) => ({
  id: id(s.slug),
  level: topicLevel[s.topic] as Level,
  skill: 'grammar' as const,
  objective: s.objective,
  taxonomyIds: s.tax,
  prerequisites: s.pre.map(id),
  estMinutes: s.minutes,
  hasPractice: count(s.topic) > 0,
  hasCheck: count(s.topic) >= 5, // a check needs at least 5 items (today every topic has exactly 5 — thin)
  reviewStatus: 'legacy' as const,
}));

/** Practice-exercise topic names (src/content/practice.ts) → grammar node, where a clear match exists. Unmapped topics are listed by the test, not guessed. */
const PRACTICE_TOPIC: Record<string, string> = {
  'To be': 'be-there-is', 'There is/are': 'be-there-is', 'Present Simple': 'present-simple', Olmoshlar: 'pronouns-possessives', 'Past Simple': 'past-simple',
  Artikllar: 'articles', Predloglar: 'prepositions', Miqdor: 'quantity', Taqqoslash: 'comparison', 'Present Perfect': 'tenses', 'Kelasi zamon': 'tenses',
  'Shart gaplar': 'conditionals', 'Third Conditional': 'conditionals', 'Majhul nisbat': 'passive', 'Nisbiy gap': 'relative-clauses', 'Which-gap': 'relative-clauses',
  Gerund: 'gerund-infinitive', Inversiya: 'complex-structures',
};
export const nodeForGrammarTopic = (topic: string): string | undefined => { const s = SPECS.find((x) => x.topic === topic); return s ? id(s.slug) : undefined; };
export const nodeForPracticeTopic = (topic: string): string | undefined => { const s = PRACTICE_TOPIC[topic]; return s ? id(s) : undefined; };
export const topicOfNode = (nodeId: string): string | undefined => SPECS.find((s) => id(s.slug) === nodeId)?.topic;

// Vocabulary: one node per CEFR level over the app's word list (src/content/vocab.ts). Word-level spacing stays in the existing SRS; these nodes give the planner a level-wide signal.
import { vocab } from '../vocab';
const VOCAB_LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const VOCAB_NODES: CurriculumNode[] = VOCAB_LEVELS.map((lv, i) => {
  const n = vocab.filter((w) => w.level === lv).length;
  return {
    id: `ge.vocab.${lv.toLowerCase()}`, level: lv, skill: 'vocabulary' as const,
    objective: `Recognise, spell and use the ${n} ${lv} words in the Bandly word list in context.`,
    taxonomyIds: ['V.word_choice', 'V.spelling'] as TaxonomyId[],
    prerequisites: i === 0 ? [] : [`ge.vocab.${VOCAB_LEVELS[i - 1]!.toLowerCase()}`],
    estMinutes: 8, hasPractice: n > 0, hasCheck: n >= 5, reviewStatus: 'legacy' as const,
  };
});
export const vocabNodeForLevel = (lv: string): string | undefined => VOCAB_NODES.find((x) => x.level === lv)?.id;

// Reading / Listening skill nodes, one per IELTS question type in the app. They are level-agnostic in practice (the planner shows them to every level);
// `level: 'A2'` only anchors them in the graph (the easiest test in the app is A2). Question-type → error-type mapping is a HYPOTHESIS to be reviewed by an exam specialist.
export type QType = 'tfng' | 'mcq' | 'fill' | 'match';
const QTYPE_NAME: Record<QType, string> = { tfng: 'True / False / Not Given', mcq: 'Ko‘p tanlovli savollar', fill: 'Bo‘sh joyni to‘ldirish', match: 'Moslashtirish' };
const SKILL_TAX: Record<'reading' | 'listening', Record<QType, TaxonomyId[]>> = {
  reading: { tfng: ['R.inference'], mcq: ['R.detail'], fill: ['R.detail'], match: ['R.main_idea'] },
  listening: { tfng: ['L.detail'], mcq: ['L.distractor'], fill: ['L.detail', 'V.spelling'], match: ['L.gist'] },
};
export const SKILL_NODES: CurriculumNode[] = (['reading', 'listening'] as const).flatMap((skill) =>
  (Object.keys(QTYPE_NAME) as QType[]).map((qt) => ({
    id: `ge.${skill}.${qt}`, level: 'A2' as Level, skill,
    objective: `Answer ${skill} ${QTYPE_NAME[qt]} questions accurately within the time limit.`,
    taxonomyIds: SKILL_TAX[skill][qt], prerequisites: ['ge.vocab.a1'], estMinutes: 15,
    hasPractice: true, hasCheck: true, reviewStatus: 'legacy' as const,
  })));
export const skillNodeFor = (skill: 'reading' | 'listening', qt: QType): string => `ge.${skill}.${qt}`;
export const skillNodeTitle = (nodeId: string): string | undefined => {
  const m = /^ge\.(reading|listening)\.(\w+)$/.exec(nodeId);
  return m ? `${m[1] === 'reading' ? 'Reading' : 'Listening'} · ${QTYPE_NAME[m[2] as QType]}` : undefined;
};

import { LESSON_NODES } from '../lessons';
export const ALL_NODES: CurriculumNode[] = [...LESSON_NODES, ...GRAMMAR_NODES, ...VOCAB_NODES, ...SKILL_NODES];
export const nodeById = (nodeId: string): CurriculumNode | undefined => ALL_NODES.find((x) => x.id === nodeId);
export const taxonomyOfNode = (nodeId: string): TaxonomyId[] => nodeById(nodeId)?.taxonomyIds ?? [];
