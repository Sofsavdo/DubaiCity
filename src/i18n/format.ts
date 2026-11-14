// Locale-aware helpers built on Intl only (no hand-written formatting). Browser ICU data may differ slightly from Node's; tests assert categories, not exact glyphs, for non-core locales.
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export const pluralCategories = (locale: string): Intl.LDMLPluralRule[] => new Intl.PluralRules(locale).resolvedOptions().pluralCategories as Intl.LDMLPluralRule[];

/** Pick the plural form for n; falls back to `other` if the locale needs a category the catalogue lacks. */
export function plural(locale: string, n: number, forms: PluralForms): string {
  const cat = new Intl.PluralRules(locale).select(n);
  return (forms[cat] ?? forms.other).replace('{n}', formatNumber(locale, n));
}
/** Categories the locale requires that the given forms do not define — catalogue lint. */
export const missingPluralForms = (locale: string, forms: PluralForms): Intl.LDMLPluralRule[] => pluralCategories(locale).filter((c) => !(c in forms));

export const formatNumber = (locale: string, n: number, opts?: Intl.NumberFormatOptions): string => new Intl.NumberFormat(locale, opts).format(n);
export const formatDate = (locale: string, ts: number, timeZone: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string => new Intl.DateTimeFormat(locale, { timeZone, ...opts }).format(ts);
/** amountMinor is in the currency's minor unit (e.g. tiyin); the number of decimals comes from Intl, not from us. */
export function formatMoney(locale: string, amountMinor: number, currency: string): string {
  const f = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const digits = f.resolvedOptions().maximumFractionDigits ?? 2;
  return f.format(amountMinor / 10 ** digits);
}
/** Local calendar day key (YYYY-MM-DD) in an IANA time zone — used for daily limits and streaks. */
export const dayKeyIn = (ts: number, timeZone: string): string => new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ts);
