import type { Cefr } from '../lib/levels';
import type { GrammarItem } from './types';

export const grammarTopics = ['To be va there is', 'Present Simple', 'Past Simple', 'Olmoshlar va egalik', 'Sonlar va miqdor', 'Artikllar', 'Zamonlar', 'Shart gaplar', 'Predloglar', 'Ega va kesim moslashuvi', 'Majhul nisbat', 'Modal fe‘llar', 'Nisbiy gaplar', 'Gerund va infinitiv', 'Taqqoslash', 'Murakkab tuzilmalar'] as const;

/** Mavzuning CEFR darajasi (tavsiya uchun) */
export const topicLevel: Record<string, Cefr> = {
  'To be va there is': 'A1', 'Present Simple': 'A1', 'Past Simple': 'A2', 'Olmoshlar va egalik': 'A1', 'Sonlar va miqdor': 'A2',
  Artikllar: 'A2', Zamonlar: 'B1', 'Shart gaplar': 'B1', Predloglar: 'A2', 'Ega va kesim moslashuvi': 'B1', 'Majhul nisbat': 'B2', 'Modal fe‘llar': 'B1', 'Nisbiy gaplar': 'B2', 'Gerund va infinitiv': 'B2', Taqqoslash: 'A2', 'Murakkab tuzilmalar': 'C1',
};

const rawGrammar: Omit<GrammarItem, 'level'>[] = [
  // Artikllar
  { id: 1, topic: 'Artikllar', q: 'She is ____ engineer at a large company.', options: ['a', 'an', 'the', '—'], answer: 1, explanationUz: "Kasb oldidan a/an qo'yiladi. 'engineer' unli tovush bilan boshlangani uchun 'an' ishlatiladi." },
  { id: 2, topic: 'Artikllar', q: '____ sun rises in the east.', options: ['A', 'An', 'The', '—'], answer: 2, explanationUz: "Yagona va noyob narsalar (sun, moon, sky) oldidan 'the' qo'yiladi." },
  { id: 3, topic: 'Artikllar', q: 'I usually have ____ breakfast at seven.', options: ['a', 'an', 'the', '—'], answer: 3, explanationUz: "Ovqat nomlari (breakfast, lunch, dinner) odatda artiklsiz ishlatiladi." },
  { id: 4, topic: 'Artikllar', q: 'He plays ____ guitar very well.', options: ['a', 'an', 'the', '—'], answer: 2, explanationUz: "Musiqa asboblari bilan 'play the ...' qolipi ishlatiladi." },
  { id: 5, topic: 'Artikllar', q: 'Can you pass me ____ salt, please?', options: ['a', 'an', 'the', '—'], answer: 2, explanationUz: "Ikkala suhbatdosh biladigan aniq narsa (stoldagi tuz) uchun 'the' kerak." },
  // Zamonlar
  { id: 6, topic: 'Zamonlar', q: 'By the time we arrived, the film ____.', options: ['started', 'has started', 'had started', 'was starting'], answer: 2, explanationUz: "O'tmishdagi ikki voqeadan oldin sodir bo'lgani uchun Past Perfect (had + V3)." },
  { id: 7, topic: 'Zamonlar', q: 'I ____ in Tashkent since 2019.', options: ['live', 'lived', 'have lived', 'am living'], answer: 2, explanationUz: "'since' + vaqt nuqtasi, hozirgacha davom etayotgan holat: Present Perfect." },
  { id: 8, topic: 'Zamonlar', q: 'Look! It ____.', options: ['rains', 'is raining', 'rained', 'has rain'], answer: 1, explanationUz: "'Look!' hozir bo'layotgan harakatni bildiradi: Present Continuous." },
  { id: 9, topic: 'Zamonlar', q: 'She ____ to the gym every Monday.', options: ['go', 'goes', 'is going', 'went'], answer: 1, explanationUz: "Odatiy harakat: Present Simple. 'She' bilan fe'lga -s/-es qo'shiladi." },
  { id: 10, topic: 'Zamonlar', q: 'While I ____ dinner, the phone rang.', options: ['cooked', 'was cooking', 'am cooking', 'had cooked'], answer: 1, explanationUz: "Davom etayotgan harakat (Past Continuous) boshqa qisqa harakat (rang) bilan to'xtatilgan." },
  // Shart gaplar
  { id: 11, topic: 'Shart gaplar', q: 'If it rains tomorrow, we ____ at home.', options: ['stay', 'will stay', 'would stay', 'stayed'], answer: 1, explanationUz: "Real kelajak sharti (First Conditional): If + Present Simple, will + V1." },
  { id: 12, topic: 'Shart gaplar', q: 'If I ____ more time, I would learn another language.', options: ['have', 'had', 'will have', 'would have'], answer: 1, explanationUz: "Hozirgi xayoliy holat (Second Conditional): If + Past Simple, would + V1." },
  { id: 13, topic: 'Shart gaplar', q: 'If she had studied harder, she ____ the exam.', options: ['would pass', 'will pass', 'would have passed', 'had passed'], answer: 2, explanationUz: "O'tmishdagi xayoliy holat (Third Conditional): If + had + V3, would have + V3." },
  { id: 14, topic: 'Shart gaplar', q: 'Unless you ____ now, you will miss the bus.', options: ['leave', "don't leave", 'will leave', 'left'], answer: 0, explanationUz: "'Unless' o'zi 'if ... not' ma'nosini beradi, shuning uchun gap ichida inkor ishlatilmaydi." },
  { id: 15, topic: 'Shart gaplar', q: 'I wish I ____ taller.', options: ['am', 'were', 'will be', 'would be'], answer: 1, explanationUz: "Hozirgi holatga afsus ('wish') uchun Past Simple ishlatiladi; 'I' bilan ham 'were' qo'llanadi." },
  // Predloglar
  { id: 16, topic: 'Predloglar', q: 'She is good ____ mathematics.', options: ['at', 'in', 'on', 'for'], answer: 0, explanationUz: "'good at' qolipi: biror sohada yaxshi." },
  { id: 17, topic: 'Predloglar', q: 'We arrived ____ the airport at noon.', options: ['in', 'at', 'to', 'on'], answer: 1, explanationUz: "Kichik joy yoki nuqta (airport, station) bilan 'arrive at' ishlatiladi." },
  { id: 18, topic: 'Predloglar', q: 'He has been waiting ____ two hours.', options: ['since', 'for', 'during', 'from'], answer: 1, explanationUz: "Davomiylik oralig'i uchun 'for', boshlanish nuqtasi uchun 'since'." },
  { id: 19, topic: 'Predloglar', q: 'The meeting is ____ Friday.', options: ['at', 'in', 'on', 'by'], answer: 2, explanationUz: "Kunlar oldidan 'on' ishlatiladi (on Friday, on 5 May)." },
  { id: 20, topic: 'Predloglar', q: 'I am interested ____ learning Korean.', options: ['on', 'at', 'in', 'about'], answer: 2, explanationUz: "'interested in' qolipi." },
  // Ega va kesim moslashuvi
  { id: 21, topic: 'Ega va kesim moslashuvi', q: 'Neither of the students ____ late.', options: ['were', 'are', 'was', 'have been'], answer: 2, explanationUz: "'Neither of' + ko'plik ot rasmiy grammatikada birlik fe'l bilan keladi." },
  { id: 22, topic: 'Ega va kesim moslashuvi', q: 'The number of visitors ____ increased this year.', options: ['have', 'has', 'are', 'were'], answer: 1, explanationUz: "'The number of' birlik hisoblanadi; 'a number of' esa ko'plik." },
  { id: 23, topic: 'Ega va kesim moslashuvi', q: 'Each of the rooms ____ a window.', options: ['have', 'has', 'are having', 'having'], answer: 1, explanationUz: "'Each (of)' birlik ega, fe'l ham birlikda: has." },
  { id: 24, topic: 'Ega va kesim moslashuvi', q: 'A lot of people ____ IELTS every year.', options: ['takes', 'take', 'taking', 'is taking'], answer: 1, explanationUz: "'people' ko'plik, shuning uchun fe'lga -s qo'shilmaydi." },
  { id: 25, topic: 'Ega va kesim moslashuvi', q: 'The news ____ spreading fast online.', options: ['are', 'is', 'were', 'have been'], answer: 1, explanationUz: "'News' sanalmaydigan ot, birlik fe'l bilan keladi." },
  // Majhul nisbat
  { id: 26, topic: 'Majhul nisbat', q: 'The bridge ____ in 1998.', options: ['built', 'was built', 'has built', 'is building'], answer: 1, explanationUz: "Ish-harakatni bajaruvchi emas, natija muhim bo'lsa majhul nisbat: was/were + V3." },
  { id: 27, topic: 'Majhul nisbat', q: 'English ____ all over the world.', options: ['speaks', 'is speaking', 'is spoken', 'spoke'], answer: 2, explanationUz: "Hozirgi umumiy fakt, majhul nisbat: is/are + V3." },
  { id: 28, topic: 'Majhul nisbat', q: 'The report ____ by Friday.', options: ['will finish', 'will be finished', 'is finishing', 'finished'], answer: 1, explanationUz: "Kelasi zamon majhul nisbati: will be + V3." },
  { id: 29, topic: 'Majhul nisbat', q: 'The windows ____ at the moment.', options: ['are cleaning', 'are being cleaned', 'were cleaned', 'clean'], answer: 1, explanationUz: "Hozir davom etayotgan harakat, majhul nisbat: am/is/are + being + V3." },
  { id: 30, topic: 'Majhul nisbat', q: 'The thief ____ by the police yesterday.', options: ['caught', 'was caught', 'is caught', 'has caught'], answer: 1, explanationUz: "O'tgan zamon aniq vaqt (yesterday), majhul nisbat: was + V3." },
  // Modal fe'llar
  { id: 31, topic: 'Modal fe‘llar', q: 'You ____ wear a seatbelt. It is the law.', options: ['might', 'must', 'can', 'would'], answer: 1, explanationUz: "Qonun yoki qat'iy majburiyat uchun 'must'." },
  { id: 32, topic: 'Modal fe‘llar', q: 'Her car is outside, so she ____ be at home.', options: ['must', "can't", "shouldn't", "needn't"], answer: 0, explanationUz: "Kuchli taxmin (deduction): dalil bor, shuning uchun 'must be'." },
  { id: 33, topic: 'Modal fe‘llar', q: 'You ____ worry about the test; it is optional.', options: ["mustn't", "needn't", "can't", 'might'], answer: 1, explanationUz: "'needn't' = hojat yo'q. 'mustn't' esa taqiqni bildiradi." },
  { id: 34, topic: 'Modal fe‘llar', q: 'When I was a child, I ____ swim very well.', options: ['can', 'could', 'must', 'should'], answer: 1, explanationUz: "O'tmishdagi umumiy qobiliyat uchun 'could'." },
  { id: 35, topic: 'Modal fe‘llar', q: 'You ____ see a doctor if the pain continues.', options: ['should', 'could to', 'must to', 'may to'], answer: 0, explanationUz: "Maslahat uchun 'should' + V1 ('to' kerak emas)." },
  // Nisbiy gaplar
  { id: 36, topic: 'Nisbiy gaplar', q: 'The man ____ lives next door is a doctor.', options: ['which', 'who', 'whose', 'where'], answer: 1, explanationUz: "Shaxs haqida bo'lsa 'who' (yoki that)." },
  { id: 37, topic: 'Nisbiy gaplar', q: 'This is the book ____ I told you about.', options: ['who', 'which', 'whose', 'where'], answer: 1, explanationUz: "Narsa haqida 'which' (yoki that)." },
  { id: 38, topic: 'Nisbiy gaplar', q: 'That is the girl ____ bag was stolen.', options: ['who', 'which', 'whose', 'whom'], answer: 2, explanationUz: "Egalikni bildiradi (uning sumkasi): 'whose'." },
  { id: 39, topic: 'Nisbiy gaplar', q: 'The city ____ I was born is very old.', options: ['which', 'who', 'whose', 'where'], answer: 3, explanationUz: "Joy haqida: 'where'." },
  { id: 40, topic: 'Nisbiy gaplar', q: 'My brother, ____ lives in Seoul, is visiting us.', options: ['that', 'who', 'which', 'whom'], answer: 1, explanationUz: "Vergul bilan ajratilgan qo'shimcha izohda 'that' ishlatilmaydi; shaxs uchun 'who'." },
  // Gerund va infinitiv
  { id: 41, topic: 'Gerund va infinitiv', q: 'I enjoy ____ to music.', options: ['listen', 'to listen', 'listening', 'listened'], answer: 2, explanationUz: "'enjoy' dan keyin gerund (-ing) keladi." },
  { id: 42, topic: 'Gerund va infinitiv', q: 'She decided ____ abroad.', options: ['studying', 'to study', 'study', 'studied'], answer: 1, explanationUz: "'decide' dan keyin infinitiv (to + V1) keladi." },
  { id: 43, topic: 'Gerund va infinitiv', q: 'He suggested ____ a taxi.', options: ['to take', 'take', 'taking', 'took'], answer: 2, explanationUz: "'suggest' dan keyin gerund keladi." },
  { id: 44, topic: 'Gerund va infinitiv', q: 'They want ____ the exam next month.', options: ['taking', 'to take', 'take', 'took'], answer: 1, explanationUz: "'want' dan keyin infinitiv (to + V1) keladi." },
  { id: 45, topic: 'Gerund va infinitiv', q: 'I am looking forward to ____ you.', options: ['see', 'seeing', 'to see', 'saw'], answer: 1, explanationUz: "'look forward to' dagi 'to' predlog, shuning uchun gerund keladi." },
  // Taqqoslash
  { id: 46, topic: 'Taqqoslash', q: 'This exam is ____ than the last one.', options: ['difficulter', 'more difficult', 'most difficult', 'difficult'], answer: 1, explanationUz: "Uzun sifatlar (3+ bo'g'in) uchun 'more + sifat + than'." },
  { id: 47, topic: 'Taqqoslash', q: 'She is the ____ student in the class.', options: ['good', 'better', 'best', 'most good'], answer: 2, explanationUz: "Orttirma daraja: 'good → better → best'." },
  { id: 48, topic: 'Taqqoslash', q: 'Tashkent is not as ____ as Moscow.', options: ['bigger', 'big', 'biggest', 'more big'], answer: 1, explanationUz: "'as ... as' qolipida sifat oddiy darajada turadi." },
  { id: 49, topic: 'Taqqoslash', q: 'The ____ you practise, the better you speak.', options: ['more', 'most', 'much', 'many'], answer: 0, explanationUz: "'The more..., the better...' qolipi: qanchalik ko'p, shunchalik yaxshi." },
  { id: 50, topic: 'Taqqoslash', q: 'He runs ____ than his brother.', options: ['fast', 'fastest', 'faster', 'more fast'], answer: 2, explanationUz: "Qisqa sifat/ravish uchun '-er + than'." },

  // To be va there is (A1)
  { id: 51, topic: 'To be va there is', q: 'My brother ____ a student.', options: ['am', 'is', 'are', 'be'], answer: 1, explanationUz: "'brother' birlik (he), shuning uchun 'is' ishlatiladi: I am, he/she/it is, we/you/they are." },
  { id: 52, topic: 'To be va there is', q: 'We ____ at home now.', options: ['is', 'am', 'are', 'be'], answer: 2, explanationUz: "'We' bilan 'are' ishlatiladi." },
  { id: 53, topic: 'To be va there is', q: '____ you from Uzbekistan?', options: ['Is', 'Am', 'Are', 'Do'], answer: 2, explanationUz: "'you' bilan 'to be' ning shakli 'are'. Savolda u ega oldiga chiqadi: Are you ...?" },
  { id: 54, topic: 'To be va there is', q: 'There ____ a cat under the table.', options: ['are', 'is', 'am', 'be'], answer: 1, explanationUz: "'There is' + birlik ot (a cat), 'There are' + ko'plik ot." },
  { id: 55, topic: 'To be va there is', q: 'There ____ five students in the room.', options: ['is', 'are', 'am', 'has'], answer: 1, explanationUz: "Ko'plik ot (five students) bilan 'There are' ishlatiladi." },
  // Present Simple (A1)
  { id: 56, topic: 'Present Simple', q: 'She ____ tea every morning.', options: ['drink', 'drinks', 'drinking', 'is drink'], answer: 1, explanationUz: "He/she/it bilan Present Simple da fe'lga -s qo'shiladi: drinks." },
  { id: 57, topic: 'Present Simple', q: 'I ____ like coffee.', options: ["don't", "doesn't", 'am not', 'not'], answer: 0, explanationUz: "I/you/we/they bilan inkor: do not (don't) + fe'l." },
  { id: 58, topic: 'Present Simple', q: '____ he work in a bank?', options: ['Do', 'Does', 'Is', 'Has'], answer: 1, explanationUz: "He/she/it bilan savol: Does + ega + fe'l (asl shaklda)." },
  { id: 59, topic: 'Present Simple', q: 'They ____ football on Sundays.', options: ['plays', 'play', 'playing', 'is play'], answer: 1, explanationUz: "'They' bilan fe'l o'zgarmaydi: play." },
  { id: 60, topic: 'Present Simple', q: 'My father ____ go to work by bus.', options: ["don't", "doesn't", "isn't", 'not'], answer: 1, explanationUz: "'My father' = he. Inkor: doesn't + fe'l asl shaklda (go, goes emas)." },
  // Past Simple (A2)
  { id: 61, topic: 'Past Simple', q: 'We ____ a film last night.', options: ['watch', 'watched', 'watching', 'watches'], answer: 1, explanationUz: "O'tgan zamon: oddiy fe'llarga -ed qo'shiladi: watched." },
  { id: 62, topic: 'Past Simple', q: 'She ____ to school yesterday.', options: ['go', 'goes', 'went', 'gone'], answer: 2, explanationUz: "'go' noto'g'ri fe'l: go → went → gone. Past Simple da 'went'." },
  { id: 63, topic: 'Past Simple', q: 'I ____ not see him at the party.', options: ['did', 'do', 'was', 'am'], answer: 0, explanationUz: "O'tgan zamon inkori: did not (didn't) + fe'l asl shaklda." },
  { id: 64, topic: 'Past Simple', q: '____ you finish your homework?', options: ['Did', 'Do', 'Were', 'Are'], answer: 0, explanationUz: "O'tgan zamon savoli: Did + ega + fe'l asl shaklda." },
  { id: 65, topic: 'Past Simple', q: 'He ____ a new car last month.', options: ['buy', 'buys', 'bought', 'buyed'], answer: 2, explanationUz: "'buy' noto'g'ri fe'l: buy → bought → bought. 'buyed' degan so'z yo'q." },
  // Olmoshlar va egalik (A1)
  { id: 66, topic: 'Olmoshlar va egalik', q: 'This is Ali. ____ sister is a doctor.', options: ['He', 'His', 'Him', 'Her'], answer: 1, explanationUz: "Egalik uchun ega olmoshi: his (uning, erkak), her (uning, ayol)." },
  { id: 67, topic: 'Olmoshlar va egalik', q: 'Can you help ____?', options: ['I', 'my', 'me', 'mine'], answer: 2, explanationUz: "To'ldiruvchi o'rnida (fe'ldan keyin) 'me' ishlatiladi." },
  { id: 68, topic: 'Olmoshlar va egalik', q: 'This book is ____, not yours.', options: ['my', 'me', 'mine', 'I'], answer: 2, explanationUz: "Otsiz egalik olmoshi: mine (meniki), yours (seniki)." },
  { id: 69, topic: 'Olmoshlar va egalik', q: 'Anna and ____ are friends.', options: ['me', 'my', 'I', 'mine'], answer: 2, explanationUz: "Ega vazifasida 'I' ishlatiladi: Anna and I." },
  { id: 70, topic: 'Olmoshlar va egalik', q: 'They love ____ new house.', options: ['there', 'their', 'they', 'them'], answer: 1, explanationUz: "'their' = ularning. 'there' = u yerda; ikkalasini adashtirmang." },
  // Sonlar va miqdor (A2)
  { id: 71, topic: 'Sonlar va miqdor', q: "There aren't ____ apples in the bag.", options: ['some', 'any', 'much', 'a'], answer: 1, explanationUz: "Inkor gapda 'any' ishlatiladi; 'some' darak gapda." },
  { id: 72, topic: 'Sonlar va miqdor', q: 'How ____ water do you drink a day?', options: ['many', 'much', 'few', 'a'], answer: 1, explanationUz: "Sanalmaydigan ot (water) bilan 'much', sanaladigan ko'plik ot bilan 'many'." },
  { id: 73, topic: 'Sonlar va miqdor', q: 'I have ____ friends in this city, so I feel lonely.', options: ['a few', 'few', 'little', 'a little'], answer: 1, explanationUz: "'few' = deyarli yo'q (salbiy), 'a few' = bir nechta (ijobiy). Sanaladigan ot bilan keladi." },
  { id: 74, topic: 'Sonlar va miqdor', q: 'Would you like ____ tea?', options: ['some', 'any', 'many', 'a few'], answer: 0, explanationUz: "Taklif qilinganda savol gapda ham 'some' ishlatiladi." },
  { id: 75, topic: 'Sonlar va miqdor', q: 'We have very ____ time left.', options: ['few', 'little', 'many', 'a few'], answer: 1, explanationUz: "Sanalmaydigan ot (time) bilan 'little' ishlatiladi." },
  // Murakkab tuzilmalar (C1)
  { id: 76, topic: 'Murakkab tuzilmalar', q: 'Rarely ____ such a talented speaker.', options: ['I have heard', 'have I heard', 'I heard', 'did I heard'], answer: 1, explanationUz: "Inversiya: 'rarely', 'seldom', 'never' gap boshida kelsa yordamchi fe'l egadan oldin chiqadi." },
  { id: 77, topic: 'Murakkab tuzilmalar', q: 'Hardly had she sat down ____ the phone rang.', options: ['than', 'when', 'that', 'then'], answer: 1, explanationUz: "'Hardly had ... when ...' qolipi. ('No sooner ... than ...' bilan adashtirmang.)" },
  { id: 78, topic: 'Murakkab tuzilmalar', q: 'It is high time we ____ a decision.', options: ['make', 'made', 'will make', 'have made'], answer: 1, explanationUz: "'It is high time' dan keyin Past Simple keladi, lekin ma'no hozirgi vaqtga tegishli." },
  { id: 79, topic: 'Murakkab tuzilmalar', q: 'No sooner had he left ____ it started to rain.', options: ['when', 'than', 'that', 'as'], answer: 1, explanationUz: "'No sooner had ... than ...' qolipi." },
  { id: 80, topic: 'Murakkab tuzilmalar', q: 'Were he to apply, he ____ the job.', options: ['would get', 'will get', 'gets', 'got'], answer: 0, explanationUz: "'Were he to ...' = 'If he applied ...'. Natija qismida would + V1." },
];

/** To'g'ri javob doim bir xil joyda bo'lib qolmasligi uchun variantlarni aylantiradi (javob indeksi = id % 4). */
export const grammar: GrammarItem[] = rawGrammar.map((g) => {
  const target = g.id % 4;
  const shift = (target - g.answer + 4) % 4;
  const options = g.options.map((_, i, a) => a[(i - shift + 4) % 4]);
  return { ...g, options, answer: target, level: topicLevel[g.topic] ?? 'B1' };
});
