import type { Cefr } from '../lib/levels';

export interface PlacementQ { id: number; level: Cefr; kind: 'Grammar' | 'Vocabulary'; q: string; options: string[]; answer: number }

// Har bir daraja uchun 4 ta savol (jami 20). Test moslashuvchan: blokdan 3 ta to'g'ri bo'lsa keyingi blokka o'tiladi.
const raw: PlacementQ[] = [
  // A1
  { id: 1, level: 'A1', kind: 'Grammar', q: 'My name ____ Anna.', options: ['am', 'is', 'are', 'be'], answer: 1 },
  { id: 2, level: 'A1', kind: 'Grammar', q: 'There ____ two books on the table.', options: ['is', 'am', 'are', 'be'], answer: 2 },
  { id: 3, level: 'A1', kind: 'Vocabulary', q: 'What is the opposite of “big”?', options: ['tall', 'small', 'long', 'old'], answer: 1 },
  { id: 4, level: 'A1', kind: 'Grammar', q: 'He ____ to school by bus every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
  // A2
  { id: 5, level: 'A2', kind: 'Grammar', q: 'Yesterday I ____ to the market.', options: ['go', 'went', 'gone', 'going'], answer: 1 },
  { id: 6, level: 'A2', kind: 'Grammar', q: 'This book is ____ than that one.', options: ['interesting', 'more interesting', 'most interesting', 'the interesting'], answer: 1 },
  { id: 7, level: 'A2', kind: 'Grammar', q: 'You ____ smoke here. It is not allowed.', options: ['must', 'mustn’t', 'needn’t', 'might'], answer: 1 },
  { id: 8, level: 'A2', kind: 'Vocabulary', q: 'A person who cooks food in a restaurant is a ____.', options: ['chef', 'doctor', 'driver', 'teacher'], answer: 0 },
  // B1
  { id: 9, level: 'B1', kind: 'Grammar', q: 'If I ____ more money, I would buy a car.', options: ['have', 'had', 'would have', 'will have'], answer: 1 },
  { id: 10, level: 'B1', kind: 'Grammar', q: 'She asked me where ____.', options: ['do I live', 'did I live', 'I lived', 'I live'], answer: 2 },
  { id: 11, level: 'B1', kind: 'Grammar', q: 'I have lived here ____ 2015.', options: ['for', 'since', 'from', 'during'], answer: 1 },
  { id: 12, level: 'B1', kind: 'Vocabulary', q: 'Only a few people ____ up to the meeting.', options: ['put', 'made', 'turned', 'took'], answer: 2 },
  // B2
  { id: 13, level: 'B2', kind: 'Grammar', q: 'By next year, she ____ her degree.', options: ['will finish', 'will have finished', 'finishes', 'is finishing'], answer: 1 },
  { id: 14, level: 'B2', kind: 'Grammar', q: 'I wish I ____ harder for the exam.', options: ['studied', 'study', 'would study', 'had studied'], answer: 3 },
  { id: 15, level: 'B2', kind: 'Grammar', q: 'Not only ____ late, but he also forgot the documents.', options: ['he arrived', 'did he arrive', 'arrived he', 'he did arrive'], answer: 1 },
  { id: 16, level: 'B2', kind: 'Vocabulary', q: 'The government introduced new ____ to reduce air pollution.', options: ['regulate', 'regulator', 'regulations', 'regulating'], answer: 2 },
  // C1
  { id: 17, level: 'C1', kind: 'Grammar', q: 'Had I known about the delay, I ____ earlier.', options: ['would leave', 'left', 'would have left', 'had left'], answer: 2 },
  { id: 18, level: 'C1', kind: 'Grammar', q: 'The report, ____ findings were controversial, was withdrawn.', options: ['which', 'that', 'of which', 'whose'], answer: 3 },
  { id: 19, level: 'C1', kind: 'Grammar', q: 'He is believed ____ the country last year.', options: ['to leave', 'leaving', 'to have left', 'having leave'], answer: 2 },
  { id: 20, level: 'C1', kind: 'Vocabulary', q: 'His argument was so ____ that nobody could refute it.', options: ['vague', 'tentative', 'trivial', 'cogent'], answer: 3 },
];

// To'g'ri javob doim bir xil joyda bo'lib qolmasligi uchun variantlarni id bo'yicha aylantiramiz.
export const placement: PlacementQ[] = raw.map((q) => {
  const target = q.id % 4;
  const correct = q.options[q.answer];
  const rest = q.options.filter((_, i) => i !== q.answer);
  const options = [...rest.slice(0, target), correct, ...rest.slice(target)];
  return { ...q, options, answer: target };
});
