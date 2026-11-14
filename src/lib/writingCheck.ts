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

// ---------------- Task 2: tuzilma va odatiy xatolar tekshiruvi ----------------
import { essayTypes, writingTopics, type EssayTypeId } from '../content/writingGuide';
import { findIssues, type Issue } from './grammarCheck';

export interface Check { id: string; ok: boolean; label: string; detail?: string }
export interface Task2Report extends WritingReport {
  checks: Check[];
  passed: number;
  grammar: Issue[];
  topicWords: string[];
}

const CONTRACTION = /\b\w+n't\b|\b(it|that|there|he|she|what|let|here)'s\b|\b(I|you|we|they)'(m|re|ve|ll|d)\b/gi;
const INFORMAL: Record<string, string> = { nice: 'beneficial / pleasant', silly: 'unwise', stuff: 'things / items', kids: 'children', guys: 'people', awesome: 'excellent', cool: 'impressive', 'a lot of': 'numerous / a great deal of', 'lots of': 'numerous', thing: 'aspect / factor', things: 'aspects / factors', gonna: 'going to', wanna: 'want to', 'big problem': 'serious problem' };
const ANECDOTE = /\b(my (?:friend|mother|father|family|brother|sister|uncle|aunt|neighbou?r|teacher|cousin|grandmother|grandfather|wife|husband)|when I was|I remember|last year I|once I)\b/i;
const EMOTION = /\b(disgusting|hate|hated|detest|terrible|horrible|awful|stupid|ridiculous|crazy|insane|idiot)\b/i;
const STANCE = /\b(I (?:strongly |fully |partly |largely )?(?:agree|disagree|believe|think|would argue|maintain|feel)|in my (?:opinion|view)|to (?:a|some) (?:large |certain |great )?extent|personally)\b/i;
const CONCLUSION = /\b(in conclusion|to conclude|to summari[sz]e|to sum up|in summary|overall)\b/i;

const norm = (t: string) => t.replace(/[’‘]/g, "'");

/** Task 2 uchun tekshiruv ro'yxati. Band bermaydi: tuzilma, uslub va odatiy xatolarni ko'rsatadi. */
export function analyzeTask2(textRaw: string, type?: EssayTypeId, topicId?: string): Task2Report {
  const text = norm(textRaw);
  const base = analyzeWriting(text, 250);
  const lower = text.toLowerCase();
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim());
  const checks: Check[] = [];
  const add = (id: string, ok: boolean, label: string, detail?: string) => checks.push({ id, ok, label, detail });

  add('words', base.words >= 250 && base.words <= 340, 'So‘zlar soni 250–340 oralig‘ida', `${base.words} ta so‘z${base.words < 250 ? ': kam (minimum 250)' : base.words > 340 ? ': juda uzun, vaqtingiz va xato ehtimoli oshadi' : ''}`);
  add('structure', paras.length >= 4, 'Kamida 4 abzats (kirish, 2 asosiy, xulosa)', `${paras.length} ta abzats${paras.length < 4 ? ': abzatslarni bo‘sh qator bilan ajrating' : ''}`);
  add('conclusion', CONCLUSION.test(lower), '“In conclusion” kabi xulosa bor');
  const contr = [...new Set((text.match(CONTRACTION) ?? []).map((x) => x.toLowerCase()))];
  add('contractions', contr.length === 0, 'Qisqartmalar yo‘q (do not, it is, cannot)', contr.length ? `topildi: ${contr.slice(0, 5).join(', ')}` : undefined);
  const inf = Object.keys(INFORMAL).filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower));
  add('informal', inf.length === 0, 'Norasmiy so‘zlar yo‘q', inf.length ? inf.slice(0, 5).map((w) => `${w} → ${INFORMAL[w]}`).join('; ') : undefined);
  const an = text.match(ANECDOTE);
  add('anecdote', !an, 'Shaxsiy hikoya yo‘q (umumiy misollar bilan yozing)', an ? `“${an[0]}”: Task 2 da dunyodan misol keltiring` : undefined);
  const em = text.match(EMOTION);
  add('emotion', !em, 'Haddan tashqari hissiy so‘zlar yo‘q', em ? `“${em[0]}” o‘rniga: unacceptable, undesirable, I disapprove of` : undefined);
  const linkers = base.linkers.length;
  add('linkers', linkers >= 4, 'Bog‘lovchi iboralar yetarli (kamida 4 xil)', `${linkers} ta: ${base.linkers.slice(0, 6).join(', ') || '—'}`);

  const et = essayTypes.find((e) => e.id === type);
  if (et) {
    const first = paras[0] ?? '';
    if (et.id === 'discuss') {
      add('type', /\b(some (?:people )?(?:argue|believe|think|say|claim|want)|those who|supporters|advocates|proponents|it is (?:often )?argued|on the one hand|one view)\b/i.test(lower) && /\b(others|on the other hand|whereas|opponents|critics|by contrast|conversely)\b/i.test(lower), 'Ikkala fikr ham yoritilgan', 'Birinchi fikrni, so‘ng “others / whereas / critics” bilan ikkinchisini yozing');
      add('opinion', STANCE.test(lower), 'O‘z fikringiz aniq aytilgan', '“In my opinion / I believe that ...” qo‘shing');
    } else if (et.id === 'agree') {
      add('opinion', STANCE.test(first), 'Pozitsiya 1-abzatsda aniq aytilgan', 'Birinchi abzatsda “I agree / I disagree / to a large extent” bo‘lsin');
    } else if (et.id === 'evaluate') {
      add('type', /\b(advantage|benefit|drawback|disadvantage|downside|positive|negative)\w*\b/i.test(lower) && /\b(outweigh|on balance|overall|in my view|I believe)\b/i.test(lower), 'Afzallik va kamchilik hamda yakuniy baho bor', '“outweigh” / “on balance” bilan qaysi tomon og‘irligini ayting');
    } else if (et.id === 'problem') {
      add('type', /\b(problem|issue|challenge|difficult|concern)\w*\b/i.test(lower) && /\b(solution|solve|measure|could be done|could also|should|can be done|address)\w*\b/i.test(lower), 'Muammo ham, yechim ham yozilgan', 'Har bir muammoga mos yechim keltiring');
      if (STANCE.test(first)) add('opinion', false, 'Bu turda uzun shaxsiy fikr shart emas', 'Muammo-yechim savolida asosiy e’tiborni g‘oyalarga qarating');
    } else if (et.id === 'cause') {
      add('type', /\b(reason|cause|due to|because|primarily|stems from|result of)\w*\b/i.test(lower) && /\b(effect|consequence|impact|result in|lead to|leads to|as a result|consequently|solution|measures|could be done|should)\w*\b/i.test(lower), 'Sabab ham, oqibat (yoki yechim) ham yozilgan', '“Due to ...” (sabab) va “This leads to ...” (oqibat) yoki “could be done” (yechim) qoliplarini ishlating');
    }
  }
  if (type === undefined) add('opinion', STANCE.test(lower), 'Fikr bildirish iborasi bor', 'Savol fikr so‘rasa, “I believe / in my view” ishlating');

  const grammar = findIssues(text);
  add('grammar', grammar.length === 0, 'Tanish grammatik xatolar topilmadi', grammar.length ? `${grammar.length} ta: ${grammar.slice(0, 3).map((g) => `${g.wrong} → ${g.right}`).join('; ')}` : undefined);

  const topic = writingTopics.find((t) => t.id === topicId);
  const topicWords = topic ? topic.vocab.filter((x) => new RegExp(`\\b${x.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')}`, 'i').test(text)).map((x) => x.phrase) : [];
  if (topic) add('topicwords', topicWords.length >= 3, 'Mavzu so‘zlaridan kamida 3 tasi ishlatilgan', `${topicWords.length} ta: ${topicWords.join(', ') || '—'}`);
  return { ...base, checks, passed: checks.filter((c) => c.ok).length, grammar, topicWords };
}
