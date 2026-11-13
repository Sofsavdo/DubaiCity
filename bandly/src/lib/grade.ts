import type { Question } from '../content/types';

export const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export type Answer = string | number | undefined;

export function isCorrect(q: Question, a: Answer): boolean {
  if (a === undefined || a === '') return false;
  if (q.type === 'tfng') return typeof a === 'string' && norm(a) === norm(q.answer);
  if (q.type === 'mcq' || q.type === 'match') return typeof a === 'number' && a === q.answer;
  return typeof a === 'string' && q.answers.some((x) => norm(x) === norm(a));
}

export function correctText(q: Question): string {
  if (q.type === 'tfng') return q.answer;
  if (q.type === 'mcq') return `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
  if (q.type === 'match') return q.options[q.answer];
  return q.answers[0];
}

export function gradeAll(questions: Question[], answers: Record<number, Answer>): number {
  return questions.reduce((n, q) => n + (isCorrect(q, answers[q.id]) ? 1 : 0), 0);
}
