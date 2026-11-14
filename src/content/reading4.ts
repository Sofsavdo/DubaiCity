import type { ReadingTest } from './types';

const letters = ['A', 'B', 'C', 'D', 'E'];

export const reading4: ReadingTest = {
  id: 'reading-4',
  level: 'B2',
  title: 'Reading mini-test 4: Learning a Language as an Adult',
  minutes: 18,
  passageTitle: 'Learning a Language as an Adult',
  paragraphs: [
    "A. Many adults believe that it is too late to learn a foreign language. Research suggests otherwise. In the first months of study, adults often learn grammar rules faster than children, because they can use logic and their knowledge of their own language. Children, on the other hand, usually develop a more natural accent. The two groups simply have different strengths.",
    "B. Motivation matters a great deal. Adults who have a clear goal, such as a new job or a plan to move abroad, tend to keep studying even when progress slows. Those who learn only because they feel they should often give up within weeks. Many teachers therefore begin by asking students what exactly they want to do with the language.",
    "C. Method matters too. One study followed two hundred adult learners for a year. Those who began speaking in the first week, even with simple sentences, progressed faster than those who waited until they felt ready. Spaced repetition, in which words are reviewed at increasing intervals, also helped learners remember vocabulary for longer.",
    "D. Adults face barriers that children do not. Most are short of time, and many are afraid of making mistakes in front of others. Classes where a teacher gives regular, friendly feedback can reduce this fear, and learners in such classes are more likely to continue.",
    "E. Finally, there may be wider benefits. Some researchers believe that people who speak two languages show signs of memory decline later in life, but the evidence is not yet conclusive. What is clear is that learners often report greater confidence and new friendships.",
  ],
  groups: [
    { instruction: 'Questions 1–4: Which paragraph contains the following information? Choose the correct letter, A–E.', questionIds: [1, 2, 3, 4] },
    { instruction: 'Questions 5–9: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [5, 6, 7, 8, 9] },
    { instruction: 'Questions 10–13: Complete the sentences. Write ONE WORD ONLY from the passage for each answer.', questionIds: [10, 11, 12, 13] },
  ],
  questions: [
    { id: 1, type: 'match', text: 'a comparison between adults and children', options: letters, answer: 0, evidence: 'A compares adults and children.' },
    { id: 2, type: 'match', text: 'the importance of having a practical reason to study', options: letters, answer: 1, evidence: 'B: a clear goal such as a new job.' },
    { id: 3, type: 'match', text: 'a study that lasted a year', options: letters, answer: 2, evidence: 'C: "followed two hundred adult learners for a year".' },
    { id: 4, type: 'match', text: 'fear of making errors in public', options: letters, answer: 3, evidence: 'D: "afraid of making mistakes in front of others".' },
    { id: 5, type: 'tfng', text: 'Adults can learn grammar rules faster than children at the beginning.', answer: 'True', evidence: 'A: adults "often learn grammar rules faster than children".' },
    { id: 6, type: 'tfng', text: 'Children usually develop a more natural accent than adults.', answer: 'True', evidence: 'A: children "usually develop a more natural accent".' },
    { id: 7, type: 'tfng', text: 'Learners who spoke from the first week progressed faster.', answer: 'True', evidence: 'C: they "progressed faster than those who waited".' },
    { id: 8, type: 'tfng', text: 'Group classes are more effective than private lessons.', answer: 'Not Given', evidence: 'Private lessons are not mentioned.' },
    { id: 9, type: 'tfng', text: 'Researchers agree that learning a language prevents memory decline.', answer: 'False', evidence: 'E: "the evidence is not yet conclusive".' },
    { id: 10, type: 'fill', text: 'Adults with a clear ______ tend to keep studying.', answers: ['goal'], evidence: 'B: "a clear goal".' },
    { id: 11, type: 'fill', text: 'Spaced ______ helps learners remember vocabulary for longer.', answers: ['repetition'], evidence: 'C: "Spaced repetition".' },
    { id: 12, type: 'fill', text: 'Most adult learners are short of ______.', answers: ['time'], evidence: 'D: "Most are short of time".' },
    { id: 13, type: 'fill', text: 'Regular ______ from a teacher can reduce the fear of mistakes.', answers: ['feedback'], evidence: 'D: "regular, friendly feedback".' },
  ],
};
