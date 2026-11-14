// Neyron ovozda yaratiladigan barcha matnlarni ro'yxatga oladi: tools/gen-audio.py shuni o'qiydi.
// Ishga tushirish: npx tsx tools/audio-tasks.ts > tasks.json
import { listeningTests } from '../src/content/listeningTests';
import { part1Topics, part2Cards } from '../src/content/speaking';
import { roastLines } from '../src/content/roasts';
import { easyPart1Topics, easyPart2Cards, hardPart3 } from '../src/content/speakingEasy';
import { vocab } from '../src/content/vocab';
import { Examiner } from '../src/lib/examiner';
import type { Cefr } from '../src/lib/levels';
import { clipKey } from '../src/lib/clipHash';

type Task = { kind: 'clip'; key: string; text: string; voice: string; speed: number };
type Listen = { kind: 'listening'; id: string; lines: { text: string; voice: string }[]; pauseMs: number };

const EXAMINER_VOICE = 'bf_emma';
const SPEED: Record<string, number> = { happy: 1, angry: 1.12, laugh: 1.15, disappointed: 0.88, impressed: 1 };
const clips = new Map<string, Task>();
const add = (text: string, speed = 1, voice = EXAMINER_VOICE) => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return;
  const key = clipKey(t);
  if (!clips.has(key)) clips.set(key, { kind: 'clip', key, text: t, voice, speed });
};

// 1) Ustozning barcha gaplari: turli urug' va javob uzunliklarida Examiner ni yurgizib yig'amiz
const CEFRS: (Cefr | null)[] = [null, 'A1', 'C1'];
for (const cefr of CEFRS) for (let level = 0; level <= 3; level++) for (let seed = 1; seed <= 400; seed++) {
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const ex = new Examiner(rnd, level as 0 | 1 | 2 | 3, cefr);
  let step = ex.start(); add(step.say);
  const answers = ['Yes', 'I really like my city because it is warm and friendly and full of life', 'Um um uh er well I am agree with it'];
  for (let i = 0; i < 40 && step.wait !== 'end'; i++) {
    if (step.wait === 'prep') { step = ex.beginMonologue(); add(step.say); continue; }
    const mono = step.wait === 'monologue';
    const a = answers[(seed + i) % answers.length];
    step = ex.answer(a, mono ? (seed % 2 ? 70 : 20) : 3, 1000 + (seed % 3) * 3000);
    add(step.say);
  }
}
// 2) Ustoz so'zlarining qolgan qismi
for (const t of part1Topics) t.questions.forEach((q) => add(q));
for (const c of part2Cards) c.part3.forEach((q) => add(q));
for (const t of easyPart1Topics) t.questions.forEach((q) => add(q.en));
for (const c of easyPart2Cards) c.part3.forEach((q) => add(q.en));
hardPart3.forEach((q) => add(q));
add('Ha, ha, ha, ha!', 1.2);
// Lug'at so'zlari va iboralari (kun so'zi, imlo o'yini va Writing mavzu so'zlari uchun)
vocab.forEach((w) => add(w.word));

// 3) Reaksiya satrlari (inglizcha variant). Qo'yiladigan so'zlar: ma'lum xato juftliklari va "um" soni
const PAIRS: [string, string][] = [['I am agree', 'I agree'], ['she go', 'she goes'], ['he have', 'he has'], ['he like', 'he likes'], ["it don't", "it doesn't"], ['more better', 'better'], ['discuss about', 'discuss'], ['I have twenty years old', 'I am twenty years old'], ['peoples', 'people'], ['advices', 'advice'], ['I am boring', 'I am bored'], ['I very like', 'I really like'], ['I am study', 'I study'], ["didn't went", "didn't go"]];
for (const group of Object.values(roastLines)) for (const lv of [0, 1, 2, 3] as const) for (const line of group[lv]) {
  const sp = SPEED[line.emotion] ?? 1;
  if (line.en.includes('{wrong}')) for (const [w, r] of PAIRS) add(line.en.replace(/\{wrong\}/g, w).replace(/\{right\}/g, r), sp);
  else if (line.en.includes('{n}')) for (let n = 3; n <= 9; n++) add(line.en.replace(/\{n\}/g, String(n)), sp);
  else add(line.en, sp);
}

// 4) Listening: har bir test bitta mp3
const VOICES: Record<string, { A: string; B?: string }> = {
  'listening-1': { A: 'bf_emma', B: 'bm_george' },
  'listening-2': { A: 'bf_isabella' },
  'listening-3': { A: 'bm_lewis', B: 'bf_emma' },
  'listening-4': { A: 'bm_george' },
  'listening-5': { A: 'bf_isabella', B: 'bm_lewis' },
};
const listens: Listen[] = listeningTests.map((t) => {
  const v = VOICES[t.id] ?? { A: 'bf_emma', B: 'bm_george' };
  return { kind: 'listening', id: t.id, pauseMs: t.names.B ? 550 : 900, lines: t.script.map((l) => ({ text: l.text, voice: l.speaker === 'A' ? v.A : (v.B ?? v.A) })) };
});

process.stdout.write(JSON.stringify({ clips: [...clips.values()], listens }));
