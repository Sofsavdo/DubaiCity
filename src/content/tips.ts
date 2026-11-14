// Kun maslahatlari: qisqa, eslab qolarli IELTS qoidalari (original). Ulashish uchun rasm kartasiga aylantiriladi.
export interface Tip { en: string; uz: string }

export const tips: Tip[] = [
  { en: 'Not Given means the text is silent. Silence is not a reason to write True.', uz: 'Not Given — matnda aytilmagan degani. Jim matn "True" degani emas.' },
  { en: 'Read the questions first. The passage is only your evidence.', uz: 'Avval savollarni o‘qing. Matn faqat dalil manbasi.' },
  { en: 'In Listening, speakers often correct themselves. Wait for the final answer.', uz: 'Listening’da so‘zlovchi o‘zini tuzatadi. Oxirgi variantni kuting.' },
  { en: 'ONE WORD ONLY means one word. Two words is a wrong answer.', uz: '“ONE WORD ONLY” bitta so‘z degani. Ikkita so‘z xato javob.' },
  { en: 'Never leave a blank. A guess costs nothing; silence costs a mark.', uz: 'Bo‘sh joy qoldirmang. Taxmin ball olmaydi, bo‘sh javob esa ball olib ketadi.' },
  { en: 'Every paragraph has one main idea. Find it before you hunt for details.', uz: 'Har abzatsning bitta asosiy g‘oyasi bor. Tafsilotdan oldin uni toping.' },
  { en: 'Paraphrase the question in your first sentence. It shows range, not memory.', uz: 'Birinchi gapda savolni o‘z so‘zingiz bilan qayta ayting. Bu boy lug‘atni ko‘rsatadi.' },
  { en: 'Do not memorise essays. Memorise structures and fill them with fresh ideas.', uz: 'Insho yodlamang. Tuzilmani yodlang va o‘z g‘oyangiz bilan to‘ldiring.' },
  { en: 'Fluency beats perfection. Keep talking, fix errors later.', uz: 'Ravonlik mukammallikdan muhim. Gapirishda davom eting.' },
  { en: 'Speaking Part 2: when ideas run out, describe how it felt.', uz: 'Speaking Part 2: g‘oya tugasa, o‘sha paytdagi hissingizni tasvirlang.' },
  { en: 'Spelling counts in Listening. Check your plurals before the time ends.', uz: 'Listening’da imlo hisobga olinadi. Ko‘plik -s ni tekshiring.' },
  { en: 'Underline numbers, names and dates first. They are the easiest marks.', uz: 'Avval raqam, ism va sanalarni belgilang. Bular eng oson ballar.' },
  { en: 'State your opinion in the first paragraph and keep it to the end.', uz: 'Fikringizni birinchi abzatsda ayting va oxirigacha o‘zgartirmang.' },
  { en: 'A short, clear sentence is better than a long, broken one.', uz: 'Qisqa va aniq gap uzun va buzuq gapdan yaxshi.' },
  { en: 'Be precise with numbers: “roughly a third” beats “many”.', uz: 'Raqamlarda aniq bo‘ling: “taxminan uchdan bir” “ko‘p”dan yaxshi.' },
  { en: 'True means the text says it. Not that it sounds likely.', uz: '“True” matnda aytilgan degani, ehtimoli bor degani emas.' },
  { en: 'The first answer you hear in Listening is not always the right one.', uz: 'Listening’da birinchi eshitilgan javob har doim to‘g‘ri emas.' },
  { en: 'Use linkers to guide the reader, not to decorate: however, as a result, for instance.', uz: 'Bog‘lovchilarni bezak uchun emas, o‘quvchini yo‘naltirish uchun ishlating.' },
  { en: 'Plan for two minutes before you write. A plan saves ten.', uz: 'Yozishdan oldin 2 daqiqa reja tuzing. Reja 10 daqiqani tejaydi.' },
  { en: 'If you do not know a word, explain it. Examiners reward the attempt.', uz: 'So‘zni bilmasangiz, tushuntirib bering. Urinish ham baholanadi.' },
  { en: 'Read 20 minutes a day in English. Small streaks beat weekend marathons.', uz: 'Kuniga 20 daqiqa ingliz tilida o‘qing. Kichik kunlik odat hafta oxiridagi marafondan kuchli.' },
  { en: 'Check the word limit. Too short loses marks, too long loses time.', uz: 'So‘zlar chegarasini tekshiring: kam bo‘lsa ball ketadi, ko‘p bo‘lsa vaqt.' },
  { en: 'Your mistakes are your syllabus. Review them every week.', uz: 'Xatolaringiz — sizning dasturingiz. Har hafta ularni takrorlang.' },
  { en: 'Speak in full sentences. “Yes.” is an invitation for another question.', uz: 'To‘liq gaplar bilan gapiring. Bitta “Yes.” yana savol so‘rashga sabab bo‘ladi.' },
  { en: 'Skim for the topic sentence, scan for the answer.', uz: 'Asosiy gap uchun ko‘z yugurtiring (skim), javob uchun qidiring (scan).' },
];

export const dayIndex = (now = Date.now()): number => Math.floor(new Date(now).setHours(0, 0, 0, 0) / 86_400_000);
export const tipOfDay = (now = Date.now()): Tip => tips[dayIndex(now) % tips.length];
