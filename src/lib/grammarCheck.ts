// O'zbek tilida so'zlashuvchilarga xos odatiy inglizcha xatolarni topadi va o'zbekcha tushuntirish beradi.
// Bu AI emas: faqat ma'lum qoliplarni ushlaydi, shuning uchun "xato yo'q" degani "grammatika mukammal" degani emas.
export interface Issue { wrong: string; right: string; ruleUz: string; id: string }

type Rule = { id: string; re: RegExp; fix: (m: RegExpMatchArray) => string; ruleUz: string };
const third = (v: string): string => ({ go: 'goes', have: 'has', do: 'does' } as Record<string, string>)[v] ?? (/(s|sh|ch|x|z|o)$/.test(v) ? `${v}es` : /[^aeiou]y$/.test(v) ? `${v.slice(0, -1)}ies` : `${v}s`);
const BASE: Record<string, string> = { went: 'go', saw: 'see', ate: 'eat', took: 'take', did: 'do', came: 'come', got: 'get', made: 'make', had: 'have', said: 'say', wrote: 'write' };

const RULES: Rule[] = [
  { id: 'am-agree', re: /\bI(?: am|'m) agree\b/i, fix: () => 'I agree', ruleUz: "'agree' fe'l, sifat emas: 'am' kerak emas. O'zbekchada 'roziman' deyiladi, inglizcha esa 'I agree'." },
  { id: '3sg', re: /\b(he|she|it|my (?:brother|sister|mother|father|friend|teacher|uncle|aunt|cousin|wife|husband)) (go|like|want|live|work|study|have|do|play|need|think|love|know|speak|watch|enjoy|live|prefer|help|make|take)\b(?! to be)/gi, fix: (m) => `${m[1]} ${third(m[2].toLowerCase())}`, ruleUz: "he/she/it (yoki bitta shaxs) bilan Present Simple da fe'lga -s/-es qo'shiladi." },
  { id: 'dont3', re: /\b(he|she|it) don't\b/i, fix: (m) => `${m[1].toLowerCase()} doesn't`, ruleUz: "he/she/it bilan inkor: doesn't (don't emas)." },
  { id: 'more-adj', re: /\bmore (better|easier|bigger|cheaper|faster|worse|harder|cleaner|smaller|healthier)\b/i, fix: (m) => m[1].toLowerCase(), ruleUz: "Qisqa sifatlarning qiyosiy darajasida -er qo'shiladi, 'more' kerak emas." },
  { id: 'discuss-about', re: /\bdiscuss about\b/i, fix: () => 'discuss', ruleUz: "'discuss' predlogsiz ishlatiladi: discuss the problem." },
  { id: 'years-old', re: /\bI have (\d+|\w+) years?(?: old)?\b/i, fix: (m) => `I am ${m[1]} years old`, ruleUz: "Yosh 'to be' bilan aytiladi: I am 20 years old (I have emas)." },
  { id: 'peoples', re: /\bpeoples\b/i, fix: () => 'people', ruleUz: "'people' o'zi ko'plik; 's' qo'shilmaydi." },
  { id: 'informations', re: /\b(informations|advices|knowledges|furnitures|homeworks|equipments)\b/i, fix: (m) => m[1].toLowerCase().replace(/s$/, ''), ruleUz: "Bu so'z sanalmaydigan ot: ko'plik -s olmaydi (information, advice, knowledge, furniture)." },
  { id: 'boring', re: /\bI(?: am|'m) boring\b/i, fix: () => 'I am bored', ruleUz: "'boring' = zerikarli (narsa/odam), 'bored' = zerikkan (his)." },
  { id: 'very-like', re: /\bI very (like|love|enjoy|want)\b/i, fix: (m) => `I really ${m[1].toLowerCase()}`, ruleUz: "'very' fe'l bilan emas, sifat bilan ishlatiladi. Fe'l oldidan 'really' yoki 'very much' oxirida." },
  { id: 'am-study', re: /\bI(?: am|'m) (study|work|live)\b/i, fix: (m) => `I ${m[1].toLowerCase()}`, ruleUz: "Oddiy odat/holat uchun 'am' kerak emas: I study, I work, I live." },
  { id: 'didnt-past', re: /\b(?:didn't|did not) (went|saw|ate|took|did|came|got|made|had|said|wrote)\b/i, fix: (m) => `didn't ${BASE[m[1].toLowerCase()]}`, ruleUz: "'didn't' dan keyin fe'l asl shaklda turadi (went emas, go)." },
  { id: 'depend-of', re: /\bdepends? (of|from)\b/i, fix: () => 'depends on', ruleUz: "'depend on' qolipi." },
  { id: 'explain-me', re: /\bexplain me\b/i, fix: () => 'explain to me', ruleUz: "'explain' dan keyin 'to + kishi': explain it to me." },
  { id: 'listen-music', re: /\blisten (music|radio|songs?|podcasts?)\b/i, fix: (m) => `listen to ${m[1].toLowerCase()}`, ruleUz: "'listen' dan keyin 'to' kerak: listen to music." },
  { id: 'married-with', re: /\b(married|marry) with\b/i, fix: (m) => `${m[1].toLowerCase()} to`, ruleUz: "'married to' (with emas). 'marry' esa predlogsiz: she married him." },
  { id: 'enter-to', re: /\b(enter|entered|enters) to\b/i, fix: (m) => m[1].toLowerCase(), ruleUz: "'enter' dan keyin predlog kerak emas: enter the room." },
  { id: 'according-me', re: /\baccording to me\b/i, fix: () => 'in my opinion', ruleUz: "O'zingiz haqingizda 'in my opinion' / 'I think' deyiladi. 'According to' boshqa manba uchun." },
  { id: 'much-people', re: /\b(much|a lot of) (people|friends|students|cars|books)\b|\bmuch (people|friends|students|cars|books)\b/i, fix: (m) => `many ${(m[2] ?? m[3]).toLowerCase()}`, ruleUz: "Sanaladigan ko'plik otlar bilan 'many' ishlatiladi (much emas)." },
  { id: 'there-is-many', re: /\bthere is (many|several|a few|two|three|four|five|some \w+s)\b/i, fix: (m) => `there are ${m[1]}`, ruleUz: "Ko'plik ot bilan 'there are' ishlatiladi." },
  { id: 'since-for', re: /\bsince (\d+|a|an|one|two|three|four|five|six|several) (years?|months?|weeks?|days?|hours?)\b/i, fix: (m) => `for ${m[1]} ${m[2]}`, ruleUz: "Davomiylik uchun 'for', boshlanish nuqtasi uchun 'since': for three years / since 2020." },
  { id: 'good-in', re: /\b(good|bad|excellent|weak) in (english|maths?|mathematics|sports?|speaking|writing)\b/i, fix: (m) => `${m[1].toLowerCase()} at ${m[2].toLowerCase()}`, ruleUz: "'good at' qolipi (in emas)." },
  { id: 'interested-on', re: /\binterested (on|about|at)\b/i, fix: () => 'interested in', ruleUz: "'interested in' qolipi." },
  { id: 'afraid-from', re: /\b(afraid|scared|proud|capable|fond) (from|for)\b/i, fix: (m) => `${m[1].toLowerCase()} of`, ruleUz: "Bu sifatlar 'of' bilan keladi: afraid of, proud of, fond of." },
  { id: 'angry-on', re: /\b(angry|annoyed) (on|at)\b(?! the)/i, fix: (m) => `${m[1].toLowerCase()} with`, ruleUz: "Odamga nisbatan 'angry with' (on emas)." },
  { id: 'forward-see', re: /\b(look(?:ing)? forward to) (see|meet|hear|work|visit)\b/i, fix: (m) => `${m[1]} ${m[2].toLowerCase()}ing`, ruleUz: "'look forward to' dagi 'to' predlog, shuning uchun fe'l -ing shaklida: looking forward to seeing." },
  { id: 'is-exist', re: /\b(is|are) exist(s?)\b/i, fix: () => 'exists', ruleUz: "'exist' o'zi fe'l: 'is exist' emas, 'exists' yoki 'there is'." },
  { id: 'the-people-is', re: /\b(the )?people (is|was)\b/i, fix: (m) => `${m[1] ?? ''}people ${m[2].toLowerCase() === 'is' ? 'are' : 'were'}`, ruleUz: "'people' ko'plik: people are." },
  { id: 'cant-to', re: /\b(can|must|should|will|would|could) to (\w+)\b/i, fix: (m) => `${m[1].toLowerCase()} ${m[2]}`, ruleUz: "Modal fe'llardan keyin 'to' qo'yilmaydi." },
  { id: 'more-than-me', re: /\bmore (good|bad)\b/i, fix: (m) => (m[1].toLowerCase() === 'good' ? 'better' : 'worse'), ruleUz: "good → better, bad → worse (more good emas)." },
  { id: 'want-that', re: /\b(want|wants) that\b/i, fix: (m) => `${m[1].toLowerCase()} (kishi) to ...`, ruleUz: "'want that' yo'q. 'want somebody to do': I want you to help me." },
];

/** Matndagi barcha topilgan xatolar (har bir qolipdan birinchisi). */
export function findIssues(text: string): Issue[] {
  const out: Issue[] = [];
  for (const r of RULES) {
    const re = new RegExp(r.re.source, r.re.flags.replace('g', ''));
    const m = text.match(re);
    if (m) out.push({ id: r.id, wrong: m[0], right: r.fix(m), ruleUz: r.ruleUz });
  }
  return out;
}

export const RULE_COUNT = RULES.length;

/** Xatosiz variantni qo'llash (faqat topilgan joylarni almashtiradi). */
export function autoFix(text: string): string {
  let t = text;
  for (const r of RULES) {
    const re = new RegExp(r.re.source, r.re.flags.replace('g', ''));
    const m = t.match(re);
    if (m) t = t.replace(m[0], r.fix(m));
  }
  return t;
}

/** Imlo/uslub: bosh harf, tinish belgisi, "i" kichik harf kabi mayda kamchiliklar. */
export function styleIssues(text: string): string[] {
  const out: string[] = [];
  const t = text.trim();
  if (!t) return out;
  if (/^[a-z]/.test(t)) out.push('Gap bosh harf bilan boshlanishi kerak.');
  if (!/[.!?]["”']?$/.test(t)) out.push('Gap oxirida nuqta (yoki ?, !) bo‘lishi kerak.');
  if (/\bi\b(?!['’])/.test(t.replace(/\bi\.e\b|\be\.g\b/gi, ''))) out.push("'I' (men) doim bosh harf bilan yoziladi.");
  if (/\s{2,}/.test(t)) out.push('Ortiqcha bo‘sh joy bor.');
  if (/\s[,.!?]/.test(t)) out.push('Tinish belgisi oldida bo‘sh joy qoldirilmaydi.');
  return out;
}
