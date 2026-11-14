import { useSyncExternalStore } from 'react';
import { uz, type Key } from './uz';

export type { Key };
export type Dict = Record<Key, string>;
export type Lang = 'uz';

/** Ro'yxatdagi tillar. Yangi tilni shu yerga qo'shing (masalan: ru). Yetishmagan kalit o'zbekchaga tushadi. */
export const dicts: Record<string, Partial<Dict>> = { uz };
export const LANG_NAMES: Record<string, string> = { uz: 'O‘zbekcha' };
export const availableLangs = (): string[] => Object.keys(dicts);

const KEY = 'bandly.lang';
function load(): string {
  try { const v = localStorage.getItem(KEY); if (v && dicts[v]) return v; } catch { /* saqlash yo'q */ }
  return 'uz';
}
let lang = load();
const listeners = new Set<() => void>();
export const getLang = (): string => lang;
export function setLang(l: string): void {
  if (!dicts[l]) return;
  lang = l;
  try { localStorage.setItem(KEY, l); } catch { /* ruxsat yo'q */ }
  if (typeof document !== 'undefined') document.documentElement.lang = l;
  listeners.forEach((f) => f());
}

/** Tarjima + {o'zgaruvchi} o'rniga qo'yish. Kalit tilda bo'lmasa o'zbekcha, u ham bo'lmasa kalitning o'zi. */
export function translate(l: string, key: Key, vars?: Record<string, string | number>): string {
  const s = dicts[l]?.[key] ?? uz[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : s;
}
export const t = (key: Key, vars?: Record<string, string | number>): string => translate(lang, key, vars);

/** Komponent ichida: til o'zgarsa qayta chizadi. */
export function useT(): typeof t {
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => lang);
  return t;
}
