import { diffTokens, normalize, type DiffOp } from './practice';
import type { RetellPoint } from '../content/scenes';

const toks = (s: string): string[] => normalize(s).split(' ').filter(Boolean);

export interface Accuracy { pct: number; matched: number; total: number; ops: DiffOp[]; missing: string[]; extra: string[] }

/** Eshitganini takrorlash/yozish aniqligi: maqsad matndagi so'zlarning necha foizi to'g'ri aytilgan. */
export function accuracy(target: string, said: string): Accuracy {
  const t = toks(target), u = toks(said);
  const ops = diffTokens(u, t);
  const matched = ops.filter((o) => o.t === 'same').length;
  return {
    pct: t.length ? Math.round((matched / t.length) * 100) : 0, matched, total: t.length, ops,
    missing: ops.filter((o) => o.t === 'missing' || o.t === 'sub').map((o) => o.want!).filter(Boolean),
    extra: ops.filter((o) => o.t === 'extra' || o.t === 'sub').map((o) => o.user!).filter(Boolean),
  };
}

export const verdict = (pct: number): { label: string; tone: 'ok' | 'near' | 'no' } =>
  pct >= 90 ? { label: 'A’lo', tone: 'ok' } : pct >= 75 ? { label: 'Yaxshi', tone: 'ok' } : pct >= 55 ? { label: 'O‘rtacha', tone: 'near' } : { label: 'Ustida ishlang', tone: 'no' };

const STOP = new Set(['this', 'that', 'with', 'have', 'from', 'your', 'what', 'will', 'would', 'could', 'there', 'their', 'they', 'them', 'then', 'than', 'been', 'were', 'when', 'which', 'about', 'into', 'some', 'very', 'just', 'also', 'does', 'should', 'might', 'while', 'where', 'because']);
const hash = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

export type ClozePart = string | { answer: string };
/** Gapdan `n` ta mazmunli so'zni yashiradi (qaysilari — gap matniga bog'liq, har safar bir xil). */
export function cloze(line: string, n: number): ClozePart[] {
  const words = line.split(/(\s+)/);
  const cand = words.map((w, i) => ({ w, i, core: w.replace(/[^A-Za-z'-]/g, '') })).filter((x) => x.core.length >= 4 && !STOP.has(x.core.toLowerCase()));
  const start = hash(line) % Math.max(1, cand.length);
  const picked = new Set<number>();
  for (let k = 0; picked.size < Math.min(n, cand.length) && k < cand.length * 2; k++) {
    const c = cand[(start + k * 2) % cand.length];
    if (!picked.has(c.i)) picked.add(c.i);
  }
  return words.map((w, i) => {
    if (!picked.has(i)) return w;
    const m = w.match(/^([^A-Za-z]*)([A-Za-z'-]+)(.*)$/s)!;
    return m ? [m[1], { answer: m[2] }, m[3]] : w;
  }).flat();
}

export const sameWord = (a: string, b: string): boolean => a.trim().toLowerCase().replace(/[^a-z0-9']/g, '') === b.trim().toLowerCase().replace(/[^a-z0-9']/g, '');

export interface Coverage { hit: boolean[]; pct: number }
/** Qayta aytish: asosiy g'oyalarning qaysilari tilga olingan (kalit so'zlar bo'yicha). */
export function coverage(text: string, points: RetellPoint[]): Coverage {
  const t = text.toLowerCase();
  const hit = points.map((p) => p.keys.some((k) => t.includes(k.toLowerCase())));
  return { hit, pct: points.length ? Math.round((hit.filter(Boolean).length / points.length) * 100) : 0 };
}
