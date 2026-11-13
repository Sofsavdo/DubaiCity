import { part1Topics, part2Cards } from '../content/speaking';

export type Wait = 'answer' | 'prep' | 'monologue' | 'end';
export interface Step { say: string; wait: Wait; part: 0 | 1 | 2 | 3; remark?: string }
export interface TurnStat { part: 1 | 2 | 3; q: string; text: string; words: number; seconds: number; fillers: number; latencyMs: number }

const FILLERS = /\b(um+|uh+|er+|erm|hmm+|you know|i mean)\b/gi;
export const countWords = (t: string): number => t.trim().split(/\s+/).filter(Boolean).length;
export const countFillers = (t: string): number => (t.match(FILLERS) ?? []).length;

const shuffle = <T,>(a: readonly T[], rnd: () => number): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};

const ROUND_OFF = ['Do you think most people would find that easy to do?', 'Is that something many people in your country do?', 'Would you recommend that to a friend?'];

/**
 * IELTS Speaking tartibidagi ustoz (qoidaviy "miya"). Keyinchalik shu interfeys AI bilan almashtiriladi:
 * start() va answer() ga javoban ustoz aytadigan gap va keyingi kutilayotgan amalni qaytaradi.
 */
export class Examiner {
  phase: 'intro' | 'p1' | 'p2prep' | 'p2' | 'p2after' | 'p3' | 'done' = 'intro';
  turns: TurnStat[] = [];
  readonly p1Qs: string[];
  readonly card = part2Cards[0];
  readonly p3Qs: string[];
  private qi = 0;
  private followed = false;
  private pending = { text: '', seconds: 0, latency: 0 };
  private currentQ = '';
  private p2Extended = false;
  private rnd: () => number;

  constructor(rnd: () => number = Math.random, public hardMode = false) {
    this.rnd = rnd;
    const topics = shuffle(part1Topics, rnd).slice(0, 2);
    this.p1Qs = topics.flatMap((t) => t.questions.slice(0, 3));
    const card = shuffle(part2Cards, rnd)[0];
    this.card = card;
    this.p3Qs = card.part3;
  }

  start(): Step {
    return { say: "Good morning. My name is Bandi, and I will be your examiner today. Could you tell me your full name, please?", wait: 'answer', part: 0 };
  }

  private record(part: 1 | 2 | 3, q: string): void {
    const { text, seconds, latency } = this.pending;
    this.turns.push({ part, q, text, words: countWords(text), seconds, fillers: countFillers(text), latencyMs: latency });
    this.pending = { text: '', seconds: 0, latency: 0 };
    this.followed = false;
  }

  private take(text: string, seconds: number, latencyMs: number): void {
    this.pending = {
      text: `${this.pending.text} ${text}`.trim(),
      seconds: this.pending.seconds + Math.max(0, seconds),
      latency: this.pending.latency || latencyMs,
    };
  }

  /** Qattiq rejimda xatolarga hazil (haqorat yo'q). */
  private remark(): string | undefined {
    if (!this.hardMode) return undefined;
    const fillers = countFillers(this.pending.text);
    const words = countWords(this.pending.text);
    if (fillers >= 3) return `I counted ${fillers} ums and ers. Please stop collecting them.`;
    if (words < 6) return 'That was short. Even my microphone fell asleep.';
    return undefined;
  }

  answer(text: string, seconds: number, latencyMs: number): Step {
    switch (this.phase) {
      case 'intro': {
        this.phase = 'p1';
        this.currentQ = this.p1Qs[0];
        return { say: `Thank you. Now, in this first part, I would like to ask you some questions about yourself. ${this.currentQ}`, wait: 'answer', part: 1 };
      }
      case 'p1':
      case 'p3': {
        this.take(text, seconds, latencyMs);
        const part = this.phase === 'p1' ? 1 : 3;
        if (countWords(this.pending.text) < 6 && !this.followed) {
          this.followed = true;
          return { say: 'Could you tell me a little more about that?', wait: 'answer', part };
        }
        const remark = this.remark();
        this.record(part, this.currentQ);
        this.qi += 1;
        const list = part === 1 ? this.p1Qs : this.p3Qs;
        if (this.qi < list.length) {
          this.currentQ = list[this.qi];
          return { say: this.currentQ, wait: 'answer', part, remark };
        }
        if (part === 1) {
          this.phase = 'p2prep';
          const pts = this.card.points.map((p) => `You should say ${p}.`.replace('.,', '.')).join(' ');
          return { say: `Thank you. Now I am going to give you a topic, and I would like you to talk about it for one to two minutes. You have one minute to think. Here is your topic. ${this.card.title} ${pts}`, wait: 'prep', part: 2, remark };
        }
        this.phase = 'done';
        return { say: 'Thank you very much. That is the end of the speaking test.', wait: 'end', part: 3, remark };
      }
      case 'p2': {
        this.take(text, seconds, latencyMs);
        if (this.pending.seconds < 60 && !this.p2Extended) {
          this.p2Extended = true;
          return { say: 'Please continue. You still have some time.', wait: 'monologue', part: 2 };
        }
        const remark = this.remark();
        this.record(2, this.card.title);
        this.phase = 'p2after';
        this.currentQ = ROUND_OFF[Math.floor(this.rnd() * ROUND_OFF.length)];
        return { say: `Thank you. ${this.currentQ}`, wait: 'answer', part: 2, remark };
      }
      case 'p2after': {
        this.take(text, seconds, latencyMs);
        this.record(2, this.currentQ);
        this.phase = 'p3';
        this.qi = 0;
        this.currentQ = this.p3Qs[0];
        return { say: `Thank you. Now let us talk about some more general questions related to this topic. ${this.currentQ}`, wait: 'answer', part: 3 };
      }
      default:
        return { say: 'The test is finished.', wait: 'end', part: 3 };
    }
  }

  /** AI aytgan savol skriptdagi savol o'rnini egallaydi: keyingi javob shu savolga yoziladi. */
  overrideQuestion(q: string): void { this.currentQ = q; }

  /** Tayyorgarlik tugagach (60 soniya yoki "Tayyorman" bosilganda). */
  beginMonologue(): Step {
    this.phase = 'p2';
    this.currentQ = this.card.title;
    return { say: 'All right. Remember, you have one to two minutes. Please begin speaking now.', wait: 'monologue', part: 2 };
  }
}

export interface Summary {
  answers: number;
  words: number;
  avgWords: number;
  wpm: number | null;
  fillerPer100: number;
  avgLatencySec: number | null;
  lexicalRatio: number;
  fluencyBand: number;
  lexicalBand: number;
  notes: string[];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Faqat tezlik, to'xtashlar va so'z xilma-xilligi bo'yicha TAXMINIY baho. Talaffuz va grammatikani baholamaydi. */
export function summarize(turns: TurnStat[], timed: boolean): Summary {
  const real = turns.filter((t) => t.words > 0);
  const words = real.reduce((a, t) => a + t.words, 0);
  const avgWords = real.length ? words / real.length : 0;
  const secs = real.reduce((a, t) => a + t.seconds, 0);
  const wpm = timed && secs >= 10 ? Math.round((words / secs) * 60) : null;
  const fillers = real.reduce((a, t) => a + t.fillers, 0);
  const fillerPer100 = words ? (fillers / words) * 100 : 0;
  const lat = real.filter((t) => t.latencyMs > 0);
  const avgLatencySec = timed && lat.length ? lat.reduce((a, t) => a + t.latencyMs, 0) / lat.length / 1000 : null;
  const tokens = real.flatMap((t) => t.text.toLowerCase().match(/[a-z']+/g) ?? []).slice(0, 150);
  const lexicalRatio = tokens.length ? new Set(tokens).size / tokens.length : 0;

  let fluency = avgWords < 6 ? 4.5 : avgWords < 12 ? 5 : avgWords < 20 ? 5.5 : avgWords < 30 ? 6 : avgWords < 45 ? 6.5 : 7;
  if (fillerPer100 > 6) fluency -= 0.5;
  if (avgLatencySec !== null && avgLatencySec > 4) fluency -= 0.5;
  if (wpm !== null && wpm < 70) fluency -= 0.5;
  const lexical = tokens.length < 30 ? 5 : lexicalRatio >= 0.65 ? 7 : lexicalRatio >= 0.55 ? 6.5 : lexicalRatio >= 0.47 ? 6 : lexicalRatio >= 0.4 ? 5.5 : 5;

  const notes: string[] = [];
  if (avgWords < 12) notes.push('Javoblar qisqa. Har savolga 2–3 gap bilan javob bering va sababini qo‘shing.');
  if (fillerPer100 > 6) notes.push(`To‘ldiruvchi tovushlar ("um", "uh") ko‘p: har 100 so‘zga ${fillerPer100.toFixed(1)} ta.`);
  if (avgLatencySec !== null && avgLatencySec > 4) notes.push('Javob berishdan oldin uzoq o‘ylayapsiz. Qisqa "Well, ..." bilan boshlab vaqt yutish mumkin.');
  if (wpm !== null && wpm < 70) notes.push('Nutq tezligi past. Fikrni to‘xtamasdan davom ettirishga harakat qiling.');
  if (lexicalRatio < 0.47 && tokens.length >= 30) notes.push('So‘zlar takrorlanyapti. Sinonimlar va aniqroq so‘zlar ishlating.');
  if (!notes.length) notes.push('Yaxshi tezlik va xilma-xillik. Endi grammatika va talaffuzni AI ustoz bilan sinash vaqti.');
  return { answers: real.length, words, avgWords, wpm, fillerPer100, avgLatencySec, lexicalRatio, fluencyBand: clamp(fluency, 4, 7.5), lexicalBand: lexical, notes };
}
