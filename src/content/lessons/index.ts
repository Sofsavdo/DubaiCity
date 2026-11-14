import type { CurriculumNode } from '../curriculum/types';
import type { Lesson, Unit } from './types';
import { A1_U1, A1_U2 } from './a1';
import { A2_U1, A2_U2 } from './a2';
import { B1_U1, B1_U2 } from './b1';

/** General English path (pilot slice A1–B1). Order matters: units and lessons follow the learning sequence. */
export const UNITS: Unit[] = [A1_U1, A1_U2, A2_U1, A2_U2, B1_U1, B1_U2];

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
