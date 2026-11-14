import type { Exercise } from '../content/practice';
import { findIssues, styleIssues, type Issue } from './grammarCheck';

export type Verdict = 'correct' | 'close' | 'wrong';
export interface DiffOp { t: 'same' | 'extra' | 'missing' | 'sub'; user?: string; want?: string }

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\bi'm\b/g, 'i am'], [/\b(you|we|they)'re\b/g, '$1 are'],
  [/\b(he|she|it|that|there|what|where)'s\b/g, '$1 is'], [/\b(\w+)n't\b/g, '$1 not'], [/\b(i|you|we|they)'ve\b/g, '$1 have'],
  [/\b(i|you|he|she|it|we|they)'ll\b/g, '$1 will'], [/\blet's\b/g, 'let us'],
];

/** Taqqoslash uchun matn: kichik harf, apostrof turlari, qisqartmalar ochiladi, tinish belgilari olib tashlanadi. */
export function normalize(s: string): string {
  let t = s.toLowerCase().replace(/[’‘`]/g, "'").replace(/\bdoesn't\b/g, 'does not').replace(/\bdon't\b/g, 'do not').replace(/\bdidn't\b/g, 'did not');
  for (const [re, to] of CONTRACTIONS) t = t.replace(re, to);
  return t.replace(/[.,!?;:"“”()]/g, ' ').replace(/\s+/g, ' ').trim();
}
const tokens = (s: string): string[] => normalize(s).split(' ').filter(Boolean);

const lev = (a: string, b: string): number => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};

/** So'z darajasidagi farq (LCS asosida): qaysi so'z ortiqcha, qaysi yetishmaydi, qaysi almashgan. */
export function diffTokens(user: string[], want: string[]): DiffOp[] {
  const n = user.length, m = want.length;
  const L = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0) as number[]);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = user[i] === want[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const raw: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (user[i] === want[j]) { raw.push({ t: 'same', user: user[i], want: want[j] }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) raw.push({ t: 'extra', user: user[i++] });
    else raw.push({ t: 'missing', want: want[j++] });
  }
  while (i < n) raw.push({ t: 'extra', user: user[i++] });
  while (j < m) raw.push({ t: 'missing', want: want[j++] });
  // yonma-yon extra+missing = almashgan so'z
  const out: DiffOp[] = [];
  for (let k = 0; k < raw.length; k++) {
    const a = raw[k], b = raw[k + 1];
    if (a.t === 'extra' && b?.t === 'missing') { out.push({ t: 'sub', user: a.user, want: b.want }); k++; }
    else if (a.t === 'missing' && b?.t === 'extra') { out.push({ t: 'sub', user: b.user, want: a.want }); k++; }
    else out.push(a);
  }
  return out;
}

export interface Result {
  verdict: Verdict;
  diff: DiffOp[] | null;
  /** Eng yaqin qabul qilingan javob (diff shunga nisbatan) */
  closest: string;
  issues: Issue[];
  style: string[];
  /** Topshiriq talablariga oid izohlar (use/upgrade) */
  notes: string[];
  /** Imlo ehtimoli: [yozilgan, ehtimol] */
  typos: [string, string][];
}

const accepted = (e: Exercise): string[] => [e.model, ...(e.accept ?? [])];

export function check(e: Exercise, answer: string): Result {
  const text = answer.trim();
  const base: Result = { verdict: 'wrong', diff: null, closest: e.model, issues: findIssues(text), style: e.kind === 'build' ? [] : styleIssues(text), notes: [], typos: [] };
  if (!text) return { ...base, notes: ['Javob yozilmagan.'] };

  if (e.kind === 'use' || e.kind === 'upgrade') {
    const words = text.split(/\s+/).filter(Boolean).length;
    for (const m of e.must ?? []) if (!new RegExp(m.re, 'i').test(text)) base.notes.push(m.hintUz);
    for (const m of e.mustNot ?? []) if (new RegExp(m.re, 'i').test(text)) base.notes.push(m.hintUz);
    if (e.minWords && words < e.minWords) base.notes.push(`Gap juda qisqa: ${words} ta so'z, kamida ${e.minWords} ta kerak.`);
    if (e.kind === 'upgrade' && e.shown && normalize(text) === normalize(e.shown)) base.notes.push("Gapni o'zgartirmadingiz: asl gapni yaxshilash kerak.");
    if (base.notes.length) return { ...base, verdict: 'wrong' };
    return { ...base, verdict: base.issues.length || base.style.length ? 'close' : 'correct' };
  }

  // translate / fix / build: qabul qilingan javoblar bilan solishtirish
  const user = tokens(text);
  let best: { want: string; ops: DiffOp[]; cost: number } | null = null;
  for (const w of accepted(e)) {
    const ops = diffTokens(user, tokens(w));
    const cost = ops.filter((o) => o.t !== 'same').length;
    if (!best || cost < best.cost) best = { want: w, ops, cost };
  }
  const b = best!;
  const res: Result = { ...base, closest: b.want, diff: b.ops };
  if (b.cost === 0) {
    // So'zlar mos; faqat bosh harf/tinish belgisi kamchiliklari bo'lishi mumkin
    return { ...res, verdict: res.style.length ? 'close' : 'correct', diff: null };
  }
  for (const o of b.ops) if (o.t === 'sub' && o.user && o.want && lev(o.user, o.want) <= 1 && o.want.length > 3) res.typos.push([o.user, o.want]);
  res.verdict = b.cost === 1 ? 'close' : 'wrong';
  if (res.typos.length === b.cost) res.verdict = 'close';
  return res;
}

/** Natijadan XP: to'g'ri 5, deyarli 2. */
export const xpFor = (v: Verdict): number => (v === 'correct' ? 5 : v === 'close' ? 2 : 0);
