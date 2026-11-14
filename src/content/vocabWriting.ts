import type { Word } from './vocab';
import { writingTopics } from './writingGuide';

/** Writing mavzularining so'zlari o'yinlar va takrorlash tizimiga ham qo'shiladi. */
export const writingWords: Word[] = writingTopics.flatMap((t) =>
  t.vocab.map((x): Word => ({ id: `wr-${x.phrase.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`, word: x.phrase, pos: x.pos, uz: x.uz, def: x.def, example: x.example, topic: `Writing: ${t.title}`, level: x.level })),
);
