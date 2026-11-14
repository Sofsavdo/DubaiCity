// Maps real answer events to curriculum nodes. Only genuine answers are recorded — never self-reports ("I know this" buttons) or clicks that merely add a word to revision.
import { grammar } from '../../content/grammar';
import { exercises } from '../../content/practice';
import { vocabById } from '../../content/vocab';
import { nodeForGrammarTopic, nodeForPracticeTopic, vocabNodeForLevel, taxonomyOfNode } from '../../content/curriculum/inventory';
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
