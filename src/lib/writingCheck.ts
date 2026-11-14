import { linkingWords } from '../content/writing';

export interface WritingReport {
  words: number;
  paragraphs: number;
  sentences: number;
  avgSentence: number;
  linkers: string[];
  repeated: { word: string; count: number }[];
  tips: string[];
}

const STOP = new Set(['about', 'after', 'again', 'also', 'because', 'before', 'being', 'could', 'every', 'their', 'there', 'these', 'they', 'those', 'which', 'while', 'would', 'should', 'people', 'other', 'where', 'with', 'from', 'have', 'that', 'this', 'than', 'then', 'more', 'most', 'many', 'some', 'what', 'when', 'will', 'were', 'been', 'such', 'into', 'only']);

/** Oddiy qoidaviy tekshiruv. Bu AI baholash emas va band bermaydi. */
export function analyzeWriting(text: string, minWords: number): WritingReport {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const avgSentence = sentences ? words.length / sentences : 0;
  const lower = text.toLowerCase();
  const linkers = linkingWords.filter((w) => lower.includes(w));

  const freq = new Map<string, number>();
  for (const w of lower.match(/[a-z']{5,}/g) ?? []) if (!STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const repeated = [...freq.entries()].filter(([, c]) => c >= 4).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([word, count]) => ({ word, count }));

  const tips: string[] = [];
  if (words.length < minWords) tips.push(`So‘zlar soni ${words.length} ta, minimum ${minWords} ta. Kam so‘z ball kamayishiga olib keladi.`);
  else tips.push(`So‘zlar soni yetarli (${words.length}).`);
  if (minWords >= 250 && paragraphs < 4) tips.push('Task 2 uchun odatda 4–5 ta abzats kerak: kirish, 2 ta asosiy abzats, xulosa.');
  if (minWords < 250 && paragraphs < 3) tips.push('Task 1 uchun kirish (nima tasvirlangan), umumiy tendensiya (overview) va tafsilotlar abzatslarini ajrating.');
  if (linkers.length < 4) tips.push('Bog‘lovchi so‘zlar kam (however, moreover, for example kabi). Mantiqiy bog‘lanishni oshiring.');
  if (avgSentence > 0 && avgSentence < 12) tips.push('Gaplar juda qisqa. Murakkab gaplardan (although, which, while) foydalaning.');
  if (avgSentence > 32) tips.push('Gaplar juda uzun. O‘qilishi qiyinlashmasin.');
  if (repeated.length) tips.push(`Takrorlanayotgan so‘zlar: ${repeated.map((r) => `${r.word} (${r.count})`).join(', ')}. Sinonimlardan foydalaning.`);
  if (/\b(i think|in my opinion)\b/.test(lower) && minWords < 250) tips.push('Task 1 da shaxsiy fikr bildirilmaydi, faqat ma‘lumotni tasvirlang.');
  return { words: words.length, paragraphs, sentences, avgSentence, linkers, repeated, tips };
}
