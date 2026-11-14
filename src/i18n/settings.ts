// The four independent language settings (docs/audit/master-spec-v2/MULTILINGUAL_ARCHITECTURE.md).
export const LOCALES = ['en', 'uz', 'ru', 'kk', 'ky', 'tg'] as const;
export type Locale = (typeof LOCALES)[number];
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);

export interface LanguageSettings {
  interface: Locale;    // UI text
  explanation: Locale;  // feedback / grammar explanations
  learning: 'en';       // language being learned (extensible later)
  voice: 'en';          // spoken conversation language
}

/** Voice languages that may be offered. Only English, and even that is UNVERIFIED on real devices; local languages join only after provider tests pass (VOICE_ENGINE_SPEC). */
export const VOICE_LANGS: readonly string[] = ['en'];

/** Languages that actually have a catalogue today (passed in by the caller so this module stays pure). */
export function pickLocale(preferred: readonly string[], available: readonly string[], fallback: Locale = 'en'): Locale {
  for (const p of preferred) {
    const base = p.toLowerCase().split('-')[0]!;
    if (isLocale(base) && available.includes(base)) return base;
  }
  return available.includes(fallback) ? fallback : (available.find(isLocale) ?? fallback);
}

export function defaultSettings(browserLangs: readonly string[], available: readonly string[]): LanguageSettings {
  const ui = pickLocale(browserLangs, available);
  return { interface: ui, explanation: ui, learning: 'en', voice: 'en' };
}

/** Returns problems (empty = valid). Settings are independent: any interface/explanation pair is valid; voice is restricted to verified voice languages. */
export function validateSettings(s: LanguageSettings, available: readonly string[]): string[] {
  const p: string[] = [];
  if (!isLocale(s.interface) || !available.includes(s.interface)) p.push(`interface language "${s.interface}" has no catalogue`);
  if (!isLocale(s.explanation)) p.push(`unknown explanation language "${s.explanation}"`);
  if (s.learning !== 'en') p.push('learning language must be en for now');
  if (!VOICE_LANGS.includes(s.voice)) p.push(`voice language "${s.voice}" is not verified`);
  return p;
}
