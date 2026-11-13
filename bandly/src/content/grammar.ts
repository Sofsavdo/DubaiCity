import type { GrammarItem } from './types';

export const grammarTopics = ['Artikllar', 'Zamonlar', 'Shart gaplar', 'Predloglar', 'Ega va kesim moslashuvi'] as const;

export const grammar: GrammarItem[] = [
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
];
