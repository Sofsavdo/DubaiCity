// Maps real answer events to curriculum nodes. Only genuine answers are recorded — never self-reports ("I know this" buttons) or clicks that merely add a word to revision.
import { grammar } from '../../content/grammar';
import { exercises } from '../../content/practice';
import { vocabById } from '../../content/vocab';
import { nodeForGrammarTopic, nodeForPracticeTopic, vocabNodeForLevel, taxonomyOfNode, skillNodeFor, type QType } from '../../content/curriculum/inventory';
import type { TaxonomyId } from './taxonomy';
import { recordAnswer } from './store';

export function recordGrammarItem(itemId: number, correct: boolean): void {
  const g = grammar.find((x) => x.id === itemId); const node = g && nodeForGrammarTopic(g.topic);
  if (node) recordAnswer(node, correct, taxonomyOfNode(node));
}
/** Practice exercises: id without the store's `p` prefix. Unmapped topics are ignored (no guessing). */
export function recordPracticeItem(exerciseId: string, correct: boolean): void {
  const e = exercises.find((x) => x.id === exerciseId); const node = e && nodeForPracticeTopic(e.topic);
  if (node) recordAnswer(node, correct, taxonomyOfNode(node));
}
/** Word games and duels. `kind` narrows the error type logged on a wrong answer. */
export function recordWordItem(wordId: string, correct: boolean, kind: 'meaning' | 'spelling' = 'meaning'): void {
  const w = vocabById[wordId]; const node = w && vocabNodeForLevel(w.level);
  if (!node) return;
  const tax: TaxonomyId[] = kind === 'spelling' ? ['V.spelling'] : ['V.word_choice'];
  recordAnswer(node, correct, tax);
}

const LV = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
/** Item difficulty relative to the learner: same level 0.5, one level harder 0.75, one easier 0.25 (clamped). Unknown learner level → 0.5. */
export function relativeDifficulty(itemLevel: string | undefined, learnerLevel: string | null | undefined): number {
  const i = itemLevel ? LV.indexOf(itemLevel) : -1, u = learnerLevel ? LV.indexOf(learnerLevel) : -1;
  if (i < 0 || u < 0) return 0.5;
  return Math.min(1, Math.max(0, 0.5 + 0.25 * (i - u)));
}
/** Reading / Listening test submission: one record per question (unanswered counts as wrong). */
export function recordTestAnswers(skill: 'reading' | 'listening', items: { type: QType; correct: boolean }[], testLevel?: string, learnerLevel?: string | null, now = Date.now()): void {
  const d = relativeDifficulty(testLevel, learnerLevel);
  for (const it of items) { const node = skillNodeFor(skill, it.type); recordAnswer(node, it.correct, taxonomyOfNode(node), now, d); }
}
