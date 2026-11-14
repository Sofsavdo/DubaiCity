// Error taxonomy — stable ids (docs/audit/master-spec-v2/ADAPTIVE_LEARNING_SPEC.md). Never rename an id once data exists.
export const TAXONOMY = {
  'G.tense': 'Grammar: tense', 'G.article': 'Grammar: articles', 'G.preposition': 'Grammar: prepositions', 'G.sva': 'Grammar: subject-verb agreement',
  'G.word_order': 'Grammar: word order', 'G.modal': 'Grammar: modals', 'G.conditional': 'Grammar: conditionals', 'G.plural': 'Grammar: plurals', 'G.pronoun': 'Grammar: pronouns and possessives', 'G.quantifier': 'Grammar: numbers and quantity', 'G.passive': 'Grammar: passive voice',
  'G.relative_clause': 'Grammar: relative clauses', 'G.comparison': 'Grammar: comparison', 'G.gerund_infinitive': 'Grammar: gerund and infinitive', 'G.complex_structure': 'Grammar: complex structures',
  'V.word_choice': 'Vocabulary: word choice', 'V.collocation': 'Vocabulary: collocation', 'V.spelling': 'Vocabulary: spelling', 'V.form': 'Vocabulary: word form',
  'P.stress': 'Pronunciation: stress', 'P.phoneme': 'Pronunciation: phoneme', 'P.intonation': 'Pronunciation: intonation',
  'S.hesitation': 'Speaking: hesitation', 'S.fluency': 'Speaking: fluency', 'S.coherence': 'Speaking: coherence',
  'W.coherence': 'Writing: coherence', 'W.task_response': 'Writing: task response', 'W.organisation': 'Writing: organisation', 'W.sentence_variety': 'Writing: sentence variety',
  'R.inference': 'Reading: inference', 'R.detail': 'Reading: detail', 'R.main_idea': 'Reading: main idea',
  'L.detail': 'Listening: detail', 'L.gist': 'Listening: gist', 'L.distractor': 'Listening: distractors',
} as const;
export type TaxonomyId = keyof typeof TAXONOMY;
export const TAXONOMY_IDS = Object.keys(TAXONOMY) as TaxonomyId[];
export const isTaxonomyId = (s: string): s is TaxonomyId => Object.prototype.hasOwnProperty.call(TAXONOMY, s);
/** Skill prefix: G grammar, V vocabulary, P pronunciation, S speaking, W writing, R reading, L listening. */
export const skillOf = (id: TaxonomyId): string => id.split('.')[0]!;
