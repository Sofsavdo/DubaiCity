import type { CurriculumNode } from '../curriculum/types';
import type { Lesson, Unit } from './types';
import { A1_U1, A1_U2 } from './a1';
import { A2_U1, A2_U2 } from './a2';
import { B1_U1, B1_U2 } from './b1';
import { B2_U1, B2_U2 } from './b2';
import { C1_U1, C1_U2 } from './c1';
import { C2_U1 } from './c2';
import { WRITING } from './writing';

/** General English path (pilot slice A1–C2). Order matters: units and lessons follow the learning sequence. */
const withWriting = (u: Unit): Unit => ({ ...u, lessons: u.lessons.map((l) => (WRITING[l.id] ? { ...l, writing: WRITING[l.id] } : l)) });
export const UNITS: Unit[] = [A1_U1, A1_U2, A2_U1, A2_U2, B1_U1, B1_U2, B2_U1, B2_U2, C1_U1, C1_U2, C2_U1].map(withWriting);

export const ALL_LESSONS: { unit: Unit; lesson: Lesson; index: number }[] = UNITS.flatMap((unit) => unit.lessons.map((lesson, index) => ({ unit, lesson, index })));
export const lessonById = (id: string) => ALL_LESSONS.find((x) => x.lesson.id === id);
export const lessonNodeId = (lessonId: string): string => `ge.lesson.${lessonId}`;

/** Each lesson is a curriculum node; its prerequisite is the previous lesson in the global sequence, so the graph is a single A1-rooted path. */
export const LESSON_NODES: CurriculumNode[] = ALL_LESSONS.map(({ unit, lesson }, i) => ({
  id: lessonNodeId(lesson.id),
  level: unit.level,
  skill: 'grammar' as const,
  objective: lesson.objective,
  taxonomyIds: lesson.taxonomyIds,
  prerequisites: i === 0 ? [] : [lessonNodeId(ALL_LESSONS[i - 1]!.lesson.id)],
  estMinutes: lesson.minutes,
  hasPractice: lesson.practice.length > 0,
  hasCheck: lesson.check.length >= 5,
  reviewStatus: unit.status,
}));

import { vocab } from '../vocab';
const baseWord = (en: string): string => en.split(/\s+[–-]\s+/)[0]!.trim().toLowerCase();
/** Vocabulary ids (shared word list) for the words a lesson introduces. Words not in the list are skipped. */
export function lessonWordIds(lessonId: string): string[] {
  const l = lessonById(lessonId)?.lesson;
  return (l?.vocab ?? []).map((v) => vocab.find((w) => w.word.toLowerCase() === baseWord(v.en))?.id).filter((x): x is string => !!x);
}
