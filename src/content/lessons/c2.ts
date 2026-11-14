import type { Unit } from './types';
import { ch, gap, ord } from './helpers';

// PILOT content — original, written for Bandly. Status 'pilot': shown with a "methodologist review pending" label.

export const C2_U1: Unit = {
  id: 'c2-u1', level: 'C2', title: 'Precision and register', titleUz: 'Aniqlik va uslub',
  situationUz: 'Rasmiy xatlar, akademik matn va murakkab munozarada fikrni nozik farqlar bilan ifodalash: shart inversiyasi, aralash shart gaplar va kuchli kollokatsiyalar.',
  status: 'pilot',
  lessons: [
    {
      id: 'c2-u1-l1', title: 'Conditional inversion', titleUz: 'Shart inversiyasi: Should you…, Were I to…, Had I known…',
      objectiveUz: 'if ni tushirib, Should / Were / Had bilan rasmiy shart gaplar tuzasiz.',
      objective: 'Use inverted conditionals (should/were/had) in formal English.',
      taxonomyIds: ['G.conditional', 'G.complex_structure'], minutes: 15,
      explanationUz: [
        'Rasmiy uslubda if tushirib qoldirilib, yordamchi fe’l gap boshiga chiqadi.',
        '1-tur (real ehtimol): If you need help → Should you need help, please contact us. (Rasmiy xatlarda juda keng tarqalgan.)',
        '2-tur (xayoliy): If I were in your position → Were I in your position, I would resign. Fe’l bilan: If they decided → Were they to decide, …',
        '3-tur (o‘tmish): If I had known → Had I known, I would have acted differently. Inkor: Had it not been for your help, … (“Hadn’t it been” — xato).',
      ],
      table: [
        { form: 'Should + ega + fe’l, …', example: 'Should you have any questions, do not hesitate to call.' },
        { form: 'Were + ega + to + fe’l / Were + ega + …', example: 'Were the government to raise taxes, prices would rise.' },
        { form: 'Had + ega + V3, … would have + V3', example: 'Had we left earlier, we would have caught the train.' },
        { form: 'Had it not been for + ot', example: 'Had it not been for her support, I would have given up.' },
      ],
      examples: [
        { en: 'Should the flight be delayed, passengers will receive a meal voucher.', uz: 'Reys kechiksa, yo‘lovchilarga ovqat taloni beriladi.' },
        { en: 'Were I to choose again, I would study medicine.', uz: 'Qayta tanlash imkoni bo‘lsa, tibbiyotni o‘qigan bo‘lardim.' },
        { en: 'Had I known about the problem, I would have helped.', uz: 'Muammodan xabarim bo‘lganida, yordam bergan bo‘lardim.' },
        { en: 'Had it not been for the rain, the match would have finished on time.', uz: 'Yomg‘ir bo‘lmaganida, o‘yin vaqtida tugagan bo‘lardi.' },
      ],
      practice: [
        ch('___ you require further information, please contact our office.', ['Should', 'Would', 'Had'], 0, 'Real ehtimol, rasmiy: Should you…'),
        ch('___ I in your position, I would accept the offer.', ['Was', 'Were', 'Had'], 1, 'Xayoliy: Were I…'),
        ch('___ we known, we would have come earlier.', ['If', 'Had', 'Were'], 1, 'O‘tmish: Had we known…'),
        gap('Had it not ___ for your advice, I would have made a mistake.', ['been'], 'Had it not been for …'),
        ord(['Should', 'need', 'help', 'you', 'call', 'us'], 'Should you need help call us', 'Should + ega + fe’l, … (Yozuvda vergul bilan.)'),
      ],
      check: [
        ch('Choose the correct sentence.', ['Hadn’t it been for the map, we would have got lost.', 'Had it not been for the map, we would have got lost.', 'Had not it been for the map, we would have got lost.'], 1, 'Inkor: Had it not been for …'),
        ch('___ the company to close, hundreds of jobs would be lost.', ['Should', 'Were', 'Had'], 1, 'Were + ega + to + fe’l.'),
        ch('___ you notice any damage, report it immediately.', ['Should', 'Were', 'Had'], 0, 'Rasmiy ko‘rsatma: Should you…'),
        gap('___ I realised how difficult it was, I would never have started.', ['Had'], 'O‘tmishdagi xayoliy shart: Had + ega + V3.'),
        gap('Were the price ___ (fall), demand would increase.', ['to fall'], 'Were + ega + to + fe’l.'),
        ord(['Had', 'earlier', 'I', 'left'], 'Had I left earlier', 'Had + ega + V3 + …'),
      ],
    },
    {
      id: 'c2-u1-l2', title: 'Mixed conditionals', titleUz: 'Aralash shart gaplar',
      objectiveUz: 'O‘tmishdagi shartning hozirgi natijasini va hozirgi holatning o‘tmishdagi natijasini aralash shart gaplar bilan ifodalaysiz.',
      objective: 'Use mixed conditionals to link past and present.',
      taxonomyIds: ['G.conditional', 'G.tense'], minutes: 15,
      explanationUz: [
        'Shart va natija turli vaqtga tegishli bo‘lsa, aralash shart gap ishlatiladi.',
        'O‘tmish shart → hozirgi natija: If + had + V3, would + fe’l: If I had taken that job, I would be living in London now.',
        'Hozirgi (doimiy) holat → o‘tmish natija: If + Past Simple, would have + V3: If she weren’t so shy, she would have spoken at the meeting.',
        'Vaqt so‘zlari (now, today, yesterday, last year) qaysi qism qaysi vaqtga tegishli ekanini aniqlashga yordam beradi.',
      ],
      table: [
        { form: 'If + had + V3, … would + fe’l (now)', example: 'If I had saved money, I would be rich now.' },
        { form: 'If + Past Simple, … would have + V3', example: 'If he were more careful, he wouldn’t have crashed the car.' },
        { form: 'Inkor variantlari', example: 'If we hadn’t missed the bus, we wouldn’t be late now.' },
      ],
      examples: [
        { en: 'If I had studied harder at school, I would have a better job now.', uz: 'Maktabda yaxshiroq o‘qiganimda, hozir yaxshiroq ishim bo‘lardi.' },
        { en: 'If she spoke Russian, she would have understood the film.', uz: 'U ruscha bilganida, filmni tushungan bo‘lardi.' },
        { en: 'If they hadn’t moved to Tashkent, they wouldn’t know each other.', uz: 'Ular Toshkentga ko‘chmaganida, bir-birini tanimas edi.' },
        { en: 'If I weren’t afraid of flying, I would have visited you last summer.', uz: 'Uchishdan qo‘rqmaganimda, o‘tgan yozda sizni ko‘rgani borgan bo‘lardim.' },
      ],
      practice: [
        ch('If I had eaten breakfast, I ___ hungry now.', ['wouldn’t be', 'wouldn’t have been', 'won’t be'], 0, 'O‘tmish shart → hozirgi natija: wouldn’t be.'),
        ch('If he ___ so lazy, he would have finished the project.', ['wasn’t', 'weren’t', 'hadn’t been being'], 1, 'Hozirgi doimiy xususiyat: weren’t (Past Simple shakli).'),
        ch('If we hadn’t met, my life ___ completely different today.', ['would be', 'would have been', 'will be'], 0, '“today” — hozirgi natija: would be.'),
        gap('If I ___ (accept) the offer last year, I would be living in Dubai now.', ['had accepted'], 'O‘tmish shart: had accepted.'),
        ord(['tired', 'If', 'late', 'stayed', 'I', 'hadn’t', 'I', 'be', 'up', 'wouldn’t'], 'If I hadn’t stayed up late I wouldn’t be tired', 'If + hadn’t + V3, wouldn’t + fe’l. (Yozuvda vergul bilan.)'),
      ],
      check: [
        ch('Choose the correct mixed conditional.', ['If I had won the lottery, I would be rich now.', 'If I won the lottery, I would have been rich now.', 'If I had won the lottery, I will be rich now.'], 0, 'had + V3 → would + fe’l (now).'),
        ch('If she ___ a doctor, she would have helped the injured man.', ['were', 'had been being', 'is'], 0, 'Doimiy holat (u shifokor emas): were.'),
        ch('If you had listened to me, we ___ in this situation now.', ['wouldn’t be', 'wouldn’t have been', 'aren’t'], 0, '“now” — hozirgi natija.'),
        gap('If I ___ (know) the answer, I would have told you. (hozir ham bilmayman)', ['knew'], 'Hozirgi holat → o‘tmish natija: knew.'),
        gap('If they had booked earlier, they ___ (sit) together now.', ['would be sitting', 'would sit'], 'Hozirgi natija: would be sitting.'),
        ord(['would', 'If', 'she', 'had', 'trained', 'she', 'be', 'champion', 'the'], 'If she had trained she would be the champion', 'O‘tmish shart → hozirgi natija.'),
      ],
    },
    {
      id: 'c2-u1-l3', title: 'Strong collocations', titleUz: 'Kuchli kollokatsiyalar va aniq so‘z tanlash',
      objectiveUz: 'Akademik va rasmiy matnda tabiiy so‘z birikmalarini (pose a threat, draw a conclusion, bear in mind…) to‘g‘ri tanlaysiz.',
      objective: 'Choose natural, precise collocations for formal and academic English.',
      taxonomyIds: ['V.collocation', 'V.word_choice'], minutes: 15,
      explanationUz: [
        'Kollokatsiya — birga ishlatiladigan so‘zlar. Grammatik to‘g‘ri, lekin g‘ayritabiiy birikma (“make a crime”, “do a mistake”) yuqori darajada xato hisoblanadi va IELTS Lexical Resource bahosini tushiradi.',
        'Fe’l + ot: pose a threat, draw a conclusion, raise awareness, meet a deadline, reach an agreement, conduct research, commit a crime, make a mistake.',
        'Sifat + ot: heavy traffic, strong evidence, high risk, deep concern, a wide range, a key factor. Ravish + sifat: highly unlikely, deeply concerned, widely recognised.',
        'Iboralar: bear in mind, take into account, play a role in, have an impact on, give rise to.',
      ],
      table: [
        { form: 'pose a threat / raise awareness', example: 'Plastic waste poses a serious threat to marine life.' },
        { form: 'draw a conclusion / reach an agreement', example: 'It is too early to draw any conclusions.' },
        { form: 'strong evidence / heavy traffic', example: 'There is strong evidence that exercise reduces stress.' },
        { form: 'highly unlikely / widely recognised', example: 'It is highly unlikely that prices will fall.' },
      ],
      examples: [
        { en: 'The campaign aims to raise awareness of mental health.', uz: 'Kampaniya ruhiy salomatlik haqida xabardorlikni oshirishni maqsad qilgan.' },
        { en: 'Researchers conducted a study of 2,000 students.', uz: 'Tadqiqotchilar 2 000 talaba ustida tadqiqot o‘tkazdi.' },
        { en: 'We should take cultural differences into account.', uz: 'Madaniy farqlarni hisobga olishimiz kerak.' },
        { en: 'Social media plays a key role in modern politics.', uz: 'Ijtimoiy tarmoqlar zamonaviy siyosatda asosiy rol o‘ynaydi.' },
      ],
      practice: [
        ch('Air pollution ___ a serious threat to public health.', ['makes', 'poses', 'does'], 1, 'pose a threat.'),
        ch('The two sides finally ___ an agreement.', ['reached', 'did', 'got to make'], 0, 'reach an agreement.'),
        ch('There is ___ evidence that sleep affects memory.', ['heavy', 'strong', 'tall'], 1, 'strong evidence.'),
        gap('It is ___ unlikely that the plan will succeed.', ['highly'], 'highly unlikely.'),
        ord(['into', 'We', 'account', 'must', 'take', 'costs', 'the'], 'We must take the costs into account', 'take … into account.'),
      ],
      check: [
        ch('Choose the natural collocation.', ['do a mistake', 'make a mistake', 'create a mistake'], 1, 'make a mistake.'),
        ch('The police believe he ___ the crime alone.', ['did', 'made', 'committed'], 2, 'commit a crime.'),
        ch('Technology ___ an important role in education.', ['plays', 'makes', 'does'], 0, 'play a role in.'),
        gap('Please ___ in mind that the office closes at five.', ['bear', 'keep'], 'bear / keep in mind.'),
        gap('The study was ___ by a team at Tashkent University.', ['conducted', 'carried out'], 'conduct / carry out research.'),
        ord(['to', 'gave', 'The', 'decision', 'rise', 'protests'], 'The decision gave rise to protests', 'give rise to + ot.'),
      ],
    },
  ],
};
