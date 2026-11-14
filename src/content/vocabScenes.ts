import type { Word } from './vocab';
import { scenes } from './scenes';

/** Sahnalardagi iboralar so'z o'yinlari va takrorlash tizimiga ham qo'shiladi. */
export const sceneWords: Word[] = scenes.flatMap((s) =>
  s.phrases.map((x): Word => ({ id: `sc-${x.phrase.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`, word: x.phrase, pos: x.pos, uz: x.uz, def: x.def, example: x.example, topic: 'Lavha iboralari', level: s.level })),
);
