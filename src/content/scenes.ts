import type { Cefr } from '../lib/levels';

// Original sahnalar (film uslubidagi dialoglar, podkast, ma'ruza, hujjatli matn). Hech qaysi film yoki kitobdan olinmagan.
// Har sahna neyron ovozda (ikki rolda) yozilgan; subtitr, shadowing, dictant, bo'shliqlar va qayta aytish mashqlari shu matndan quriladi.
export interface SceneLine { sp: 'A' | 'B'; text: string }
export interface SceneQuiz { q: string; options: string[]; answer: number; line: number }
export interface ScenePhrase { phrase: string; pos: string; uz: string; def: string; example: string }
export interface RetellPoint { label: string; keys: string[] }
export interface Scene {
  id: string;
  title: string;
  genre: 'Film lavhasi' | 'Podkast' | 'Akademik ma‘ruza' | 'Hujjatli film';
  level: Cefr;
  about: string;
  brief: string;
  names: { A: string; B?: string };
  voices: { A: string; B?: string };
  lines: SceneLine[];
  quiz: SceneQuiz[];
  phrases: ScenePhrase[];
  retell: { points: RetellPoint[]; model: string };
}

const ph = (phrase: string, pos: string, uz: string, def: string, example: string): ScenePhrase => ({ phrase, pos, uz, def, example });

export const scenes: Scene[] = [
  {
    id: 'airport', title: 'Aeroportda ro‘yxatdan o‘tish', genre: 'Film lavhasi', level: 'A2',
    about: 'Yo‘lovchi aeroportda reysga ro‘yxatdan o‘tmoqda.',
    brief: 'Sekin boshlaymiz: har bir gapni eshiting, subtitrga qarab takrorlang. Maqsad — ravon va aniq talaffuz.',
    names: { A: 'Agent', B: 'Sam' }, voices: { A: 'bf_isabella', B: 'bm_lewis' },
    lines: [
      { sp: 'A', text: 'Good morning. Where are you flying today?' },
      { sp: 'B', text: 'Good morning. I am flying to London, flight BA one four two.' },
      { sp: 'A', text: 'May I see your passport, please?' },
      { sp: 'B', text: 'Of course. Here you are.' },
      { sp: 'A', text: 'Do you have any bags to check in?' },
      { sp: 'B', text: 'Yes, just this one suitcase. Is it too heavy?' },
      { sp: 'A', text: 'No, it is fine. It is twenty kilos.' },
      { sp: 'B', text: 'Great. Could I have a window seat, please?' },
      { sp: 'A', text: 'Certainly. Your gate is number twelve, and boarding starts at half past ten.' },
      { sp: 'B', text: 'Thank you very much. Have a nice flight!' },
    ],
    quiz: [
      { q: 'Where is Sam flying?', options: ['To Paris', 'To London', 'To Rome'], answer: 1, line: 1 },
      { q: 'What does Sam ask for?', options: ['A window seat', 'A bigger bag', 'A later flight'], answer: 0, line: 7 },
      { q: 'When does boarding start?', options: ['At ten', 'At twelve', 'At half past ten'], answer: 2, line: 8 },
    ],
    phrases: [
      ph('check in', 'phrasal verb', 'ro‘yxatdan o‘tmoq (aviareys, mehmonxona)', 'to register when you arrive at an airport or hotel', 'You must check in two hours before the flight.'),
      ph('window seat', 'n', 'deraza yonidagi o‘rindiq', 'a seat next to the window', 'I always ask for a window seat.'),
      ph('Here you are', 'idiom', 'marhamat (biror narsani uzatganda)', 'what you say when you give someone something', 'Here you are, this is my passport.'),
    ],
    retell: {
      points: [
        { label: 'London reysi', keys: ['london'] },
        { label: 'Pasport ko‘rsatildi', keys: ['passport'] },
        { label: 'Bitta chamadon (20 kg)', keys: ['suitcase', 'bag', 'twenty', 'kilo'] },
        { label: 'Deraza yonidagi o‘rindiq', keys: ['window'] },
        { label: 'Gate 12, boarding 10:30', keys: ['gate', 'twelve', 'boarding', 'half past ten', '10'] },
      ],
      model: 'Sam is flying to London. He shows his passport and checks in one suitcase that weighs twenty kilos. He asks for a window seat, and the agent tells him that his gate is number twelve and that boarding starts at half past ten.',
    },
  },
  {
    id: 'cafe', title: 'Kafeda noto‘g‘ri buyurtma', genre: 'Film lavhasi', level: 'A2',
    about: 'Mijoz kafeda buyurtma bergan, lekin boshqa narsa keltirishgan.',
    brief: 'Kundalik iboralarni eshiting: kechirim so‘rash va muammoni xushmuomalalik bilan aytish.',
    names: { A: 'Waiter', B: 'Anna' }, voices: { A: 'bm_george', B: 'bf_emma' },
    lines: [
      { sp: 'A', text: 'Here is your coffee, madam, and your chocolate cake.' },
      { sp: 'B', text: 'Excuse me, I think there is a mistake. I ordered tea, not coffee.' },
      { sp: 'A', text: 'Oh, I am very sorry. Let me change it for you.' },
      { sp: 'B', text: 'Thank you. And could I have some milk with it?' },
      { sp: 'A', text: 'Of course. Would you like anything else?' },
      { sp: 'B', text: 'Actually, the cake looks big. Can I get a smaller piece?' },
      { sp: 'A', text: 'No problem at all. I will bring everything in two minutes.' },
      { sp: 'B', text: 'That is very kind of you. By the way, is the cafe open on Sundays?' },
      { sp: 'A', text: 'Yes, we open at nine and close at six every day.' },
    ],
    quiz: [
      { q: 'What did Anna order?', options: ['Coffee', 'Tea', 'Juice'], answer: 1, line: 1 },
      { q: 'What does she want with her drink?', options: ['Sugar', 'Lemon', 'Milk'], answer: 2, line: 3 },
      { q: 'When does the cafe close?', options: ['At six', 'At nine', 'At five'], answer: 0, line: 8 },
    ],
    phrases: [
      ph('I am very sorry', 'idiom', 'juda afsusdaman (kechirim)', 'a polite way to say sorry', 'I am very sorry for the delay.'),
      ph('by the way', 'linker', 'aytgancha, darvoqe', 'used to add a new subject', 'By the way, what time does the shop open?'),
      ph('no problem at all', 'idiom', 'umuman muammo emas (xushmuomalalik)', 'a friendly way to say that something is not a trouble', 'No problem at all, I can wait.'),
    ],
    retell: {
      points: [
        { label: 'Anna choy buyurtma qilgan edi', keys: ['tea'] },
        { label: 'Ofitsiant qahva keltirdi (xato)', keys: ['coffee', 'mistake', 'wrong'] },
        { label: 'Ofitsiant kechirim so‘radi va almashtirdi', keys: ['sorry', 'change', 'apolog'] },
        { label: 'Sut va kichikroq tort so‘radi', keys: ['milk', 'smaller', 'cake'] },
        { label: 'Kafe 9 dan 6 gacha ochiq', keys: ['nine', 'six', 'open'] },
      ],
      model: 'Anna ordered tea, but the waiter brought her coffee by mistake. He apologised and promised to change it. She also asked for some milk and a smaller piece of cake, and she found out that the cafe is open from nine to six every day.',
    },
  },
  {
    id: 'interview', title: 'Ish suhbatining birinchi daqiqalari', genre: 'Film lavhasi', level: 'B1',
    about: 'Nomzod marketing menejeri lavozimi uchun suhbatda.',
    brief: 'Rasmiy, ammo tabiiy ohang: o‘zingizni tanishtirish va kuchli tomonlarni aytish iboralariga e’tibor bering.',
    names: { A: 'Ms Clarke', B: 'Daniel' }, voices: { A: 'bf_emma', B: 'bm_george' },
    lines: [
      { sp: 'A', text: 'Thank you for coming in, Daniel. Please, take a seat. Could you start by telling me a little about yourself?' },
      { sp: 'B', text: 'Certainly. I have worked in marketing for six years, mostly with small technology companies.' },
      { sp: 'A', text: 'And what made you apply for this position?' },
      { sp: 'B', text: 'I have been following your company for a while, and I admire the way you reach young customers.' },
      { sp: 'A', text: 'What would you say is your greatest strength?' },
      { sp: 'B', text: 'I think I am good at turning complicated ideas into simple messages that people remember.' },
      { sp: 'A', text: 'That is useful. And is there an area you are trying to improve?' },
      { sp: 'B', text: 'Yes, I sometimes spend too long on details, so I am learning to set strict deadlines for myself.' },
      { sp: 'A', text: 'Good. Finally, where do you see yourself in five years?' },
      { sp: 'B', text: 'Leading a creative team here, I hope, and helping the brand grow into new markets.' },
    ],
    quiz: [
      { q: 'How long has Daniel worked in marketing?', options: ['Three years', 'Six years', 'Ten years'], answer: 1, line: 1 },
      { q: 'What does Daniel say he is good at?', options: ['Making simple messages from complex ideas', 'Managing large budgets', 'Writing computer programs'], answer: 0, line: 5 },
      { q: 'What does he want to improve?', options: ['His speaking', 'Spending too long on details', 'His computer skills'], answer: 1, line: 7 },
    ],
    phrases: [
      ph('take a seat', 'idiom', 'o‘tiring (rasmiy taklif)', 'a polite way to ask someone to sit', 'Please take a seat, the doctor will see you soon.'),
      ph('apply for', 'phrasal verb', 'ariza topshirmoq (ishga)', 'to make a formal request for a job or place', 'She decided to apply for a scholarship.'),
      ph('set a deadline', 'collocation', 'muddat belgilamoq', 'to decide the last date for finishing work', 'It helps to set a deadline for each task.'),
    ],
    retell: {
      points: [
        { label: '6 yillik marketing tajribasi', keys: ['six years', 'marketing'] },
        { label: 'Kompaniyani kuzatib, yoshlar bilan ishlashini yoqtirgan', keys: ['follow', 'admire', 'young'] },
        { label: 'Kuchli tomoni: murakkab g‘oyani sodda xabarga aylantirish', keys: ['simple', 'complicated', 'message'] },
        { label: 'Ustida ishlayotgani: tafsilotga ko‘p vaqt ketkazish, muddat belgilash', keys: ['detail', 'deadline'] },
        { label: '5 yildan keyin: ijodiy jamoani boshqarish', keys: ['lead', 'team'] },
      ],
      model: 'Daniel has six years of marketing experience and admires how the company reaches young customers. His strength is turning complicated ideas into simple messages, and he is working on spending less time on details by setting deadlines. In five years he hopes to lead a creative team.',
    },
  },
  {
    id: 'hotel', title: 'Mehmonxonada shikoyat', genre: 'Film lavhasi', level: 'B1',
    about: 'Mehmon xonadagi shovqin va ishlamaydigan konditsioner haqida shikoyat qilmoqda.',
    brief: 'Shikoyat qilish va yechim so‘rash: xushmuomala, lekin qat’iy ohang.',
    names: { A: 'Receptionist', B: 'Mr Hall' }, voices: { A: 'bf_isabella', B: 'bm_lewis' },
    lines: [
      { sp: 'B', text: 'Excuse me, I would like to make a complaint about my room.' },
      { sp: 'A', text: 'I am sorry to hear that, sir. What seems to be the problem?' },
      { sp: 'B', text: 'The air conditioning has not worked since last night, and it is extremely hot.' },
      { sp: 'A', text: 'I apologise for the inconvenience. I will send someone from maintenance immediately.' },
      { sp: 'B', text: 'That would be helpful. There is also a lot of noise from the street, and I could hardly sleep.' },
      { sp: 'A', text: 'I understand. We could move you to a quieter room on the fifth floor, if you would like.' },
      { sp: 'B', text: 'Yes, please. And would it be possible to have a discount for the trouble?' },
      { sp: 'A', text: 'Let me speak to the manager. I am sure we can offer you breakfast free of charge tomorrow.' },
      { sp: 'B', text: 'That sounds fair. Thank you for your help.' },
    ],
    quiz: [
      { q: 'What is wrong with the room?', options: ['The air conditioning does not work', 'The bed is broken', 'There is no hot water'], answer: 0, line: 2 },
      { q: 'What does the receptionist offer?', options: ['A refund', 'A quieter room', 'A taxi'], answer: 1, line: 5 },
      { q: 'What can the hotel give for free tomorrow?', options: ['Dinner', 'A late checkout', 'Breakfast'], answer: 2, line: 7 },
    ],
    phrases: [
      ph('make a complaint', 'collocation', 'shikoyat qilmoq (rasmiy)', 'to say officially that you are not satisfied', 'You can make a complaint at the front desk.'),
      ph('free of charge', 'idiom', 'bepul (to‘lovsiz)', 'without having to pay', 'The tour is free of charge for children.'),
      ph('apologise for the inconvenience', 'collocation', 'noqulaylik uchun uzr so‘ramoq', 'to say sorry for causing trouble', 'We apologise for the inconvenience caused by the delay.'),
    ],
    retell: {
      points: [
        { label: 'Konditsioner kechadan beri ishlamaydi', keys: ['air conditioning', 'hot', 'not worked'] },
        { label: 'Ko‘chadan shovqin', keys: ['noise', 'street', 'sleep'] },
        { label: 'Xodim yuborildi / tinchroq xona taklif qilindi', keys: ['quieter', 'maintenance', 'move', 'fifth'] },
        { label: 'Chegirma so‘raldi', keys: ['discount'] },
        { label: 'Ertaga bepul nonushta', keys: ['breakfast', 'free'] },
      ],
      model: 'Mr Hall complains that the air conditioning has not worked since last night and that the street is very noisy. The receptionist apologises, sends maintenance and offers him a quieter room on the fifth floor. He asks for a discount, and she suggests free breakfast tomorrow.',
    },
  },
  {
    id: 'witness', title: 'Guvoh bilan so‘roq', genre: 'Film lavhasi', level: 'B2',
    about: 'Detektiv kechqurun do‘kon ochilishida nimalarni ko‘rganini guvohdan so‘ramoqda (noir uslubi).',
    brief: 'Detektiv ohangi: sekin, keskin va aniq. Taxminiy so‘zlar (“I could not be certain”) va o‘tgan zamonni diqqat bilan eshiting.',
    names: { A: 'Detective Rhodes', B: 'Mrs Patel' }, voices: { A: 'bm_george', B: 'bf_emma' },
    lines: [
      { sp: 'A', text: 'Mrs Patel, I realise it is late, but I need you to walk me through what you saw this evening.' },
      { sp: 'B', text: 'Of course, Detective. I was closing the shop around eight when I noticed a man standing across the street.' },
      { sp: 'A', text: 'Can you describe him?' },
      { sp: 'B', text: 'Tall, in a dark coat. He kept looking at the jeweller’s window as if he was waiting for somebody.' },
      { sp: 'A', text: 'Did anyone join him?' },
      { sp: 'B', text: 'A woman, I think, although I could not be certain. She was wearing a red scarf.' },
      { sp: 'A', text: 'And then?' },
      { sp: 'B', text: 'They disappeared round the corner, and a few minutes later the alarm went off.' },
      { sp: 'A', text: 'Had you ever seen either of them before?' },
      { sp: 'B', text: 'Never. But I would recognise that scarf anywhere.' },
    ],
    quiz: [
      { q: 'What time did Mrs Patel see the man?', options: ['Around six', 'Around eight', 'Around ten'], answer: 1, line: 1 },
      { q: 'What was the man looking at?', options: ['The bank', 'The jeweller’s window', 'His watch'], answer: 1, line: 3 },
      { q: 'What detail does Mrs Patel remember about the woman?', options: ['A red scarf', 'A black hat', 'A long coat'], answer: 0, line: 5 },
    ],
    phrases: [
      ph('walk me through', 'phrasal verb', 'menga qadamma-qadam tushuntirib bermoq', 'to explain each step of something to me', 'Can you walk me through the process?'),
      ph('go off', 'phrasal verb', 'jaranglamoq (signal), portlamoq', 'to make a sudden loud noise', 'The alarm may go off at midnight.'),
      ph('I could not be certain', 'idiom', 'aniq ayta olmayman', 'a careful way to say you are not completely sure', 'I could not be certain who was at the door.'),
    ],
    retell: {
      points: [
        { label: 'Soat 8 atrofida do‘kon yopilayotgan edi', keys: ['eight', 'closing', 'shop'] },
        { label: 'Qora paltoli novcha erkak zargarlik oynasiga qarab turgan', keys: ['tall', 'dark coat', 'window', 'jeweller'] },
        { label: 'Qizil sharfli ayol qo‘shildi (aniq emas)', keys: ['woman', 'scarf', 'red'] },
        { label: 'Ular burchakda g‘oyib bo‘ldi, signal jaranglagan', keys: ['disappear', 'corner', 'alarm'] },
        { label: 'Ularni avval ko‘rmagan', keys: ['never', 'before'] },
      ],
      model: 'Around eight, while closing her shop, Mrs Patel noticed a tall man in a dark coat watching the jeweller’s window. A woman in a red scarf joined him, although she could not be certain. They vanished round the corner and soon afterwards the alarm went off. She had never seen either of them before.',
    },
  },
  {
    id: 'mission', title: 'Boshqaruv markazi: kemadagi nosozlik', genre: 'Film lavhasi', level: 'B2',
    about: 'Kosmik missiya markazi ekipaj bilan aloqada: kislorod bosimi tushmoqda (ilmiy-fantastika uslubi).',
    brief: 'Tez va aniq buyruqlar: ohangni tutib turing, raqam va ko‘rsatmalarni eshitib takrorlash — eng yaxshi mashq.',
    names: { A: 'Mission Control', B: 'Commander Reyes' }, voices: { A: 'bm_lewis', B: 'bf_isabella' },
    lines: [
      { sp: 'B', text: 'Control, this is Reyes. We have a pressure warning in the second module.' },
      { sp: 'A', text: 'Copy that, Commander. Read me the number on the main gauge.' },
      { sp: 'B', text: 'It has dropped to eighty-two percent and it is still falling.' },
      { sp: 'A', text: 'Understood. Seal the hatch to the second module immediately, then check the valve on panel four.' },
      { sp: 'B', text: 'Hatch sealed. The valve is loose, but I think I can tighten it by hand.' },
      { sp: 'A', text: 'Negative. Do not touch it until the engineer confirms the procedure. We are sending the steps now.' },
      { sp: 'B', text: 'Received. How long do we have before the pressure becomes critical?' },
      { sp: 'A', text: 'Roughly forty minutes at the current rate, which is enough time if you follow the checklist.' },
      { sp: 'B', text: 'Understood. We will keep you updated every five minutes.' },
    ],
    quiz: [
      { q: 'What is the problem?', options: ['A fire in the kitchen', 'Falling pressure in a module', 'A radio failure'], answer: 1, line: 0 },
      { q: 'What does Control tell the Commander to do first?', options: ['Tighten the valve', 'Seal the hatch', 'Restart the engine'], answer: 1, line: 3 },
      { q: 'How much time do they have?', options: ['About forty minutes', 'About four hours', 'About five minutes'], answer: 0, line: 7 },
    ],
    phrases: [
      ph('copy that', 'idiom', 'tushunarli, qabul qildim (radio)', 'a way to confirm that you heard a message', 'Copy that, we are moving to the exit.'),
      ph('at the current rate', 'collocation', 'hozirgi tezlikda', 'if things continue at the same speed', 'At the current rate, the lake will be empty by summer.'),
      ph('keep me updated', 'collocation', 'meni doimiy xabardor qilib turmoq', 'to give me new information regularly', 'Please keep me updated about the results.'),
    ],
    retell: {
      points: [
        { label: 'Ikkinchi modulda bosim ogohlantirishi', keys: ['pressure', 'warning', 'second module'] },
        { label: 'Bosim 82% ga tushgan va pasayishda', keys: ['eighty', '82', 'falling', 'dropped'] },
        { label: 'Lyukni yopish va klapanni tekshirish buyrug‘i', keys: ['hatch', 'seal', 'valve'] },
        { label: 'Muhandis tasdig‘ini kutish (qo‘lda tortmaslik)', keys: ['engineer', 'not touch', 'wait', 'confirm'] },
        { label: 'Taxminan 40 daqiqa va har 5 daqiqada hisobot', keys: ['forty', '40', 'five minutes'] },
      ],
      model: 'Commander Reyes reports a pressure warning in the second module, where the gauge has fallen to eighty-two percent. Control orders her to seal the hatch and not to touch the loose valve until the engineer confirms the procedure. They have about forty minutes, and she promises updates every five minutes.',
    },
  },
  {
    id: 'podcast', title: 'Podkast: ertalabki odatlar', genre: 'Podkast', level: 'B2',
    about: 'Ikki boshlovchi ertalabki odatlar mahsuldorlikka qanchalik ta’sir qilishini muhokama qilmoqda.',
    brief: 'Jonli suhbat ohangi: qisqartmalar, “well”, “honestly” kabi so‘zlar. Tabiiy ritmni qayta ishlashga urining.',
    names: { A: 'Maya', B: 'Tom' }, voices: { A: 'bf_emma', B: 'bm_george' },
    lines: [
      { sp: 'A', text: 'So, Tom, everyone online keeps saying that you should wake up at five to be successful. Honestly, is that realistic?' },
      { sp: 'B', text: 'Well, I think it depends on the person. Some people are morning larks, but others only really get going at night.' },
      { sp: 'A', text: 'Right, I have tried the early start, and by noon I was completely worn out.' },
      { sp: 'B', text: 'Exactly. What matters is the routine, not the time on the clock. A few quiet minutes before checking your phone can make a huge difference.' },
      { sp: 'A', text: 'That is interesting, because I used to scroll through the news the second I opened my eyes.' },
      { sp: 'B', text: 'Most of us do. But it puts you in reaction mode instead of letting you set the tone for your day.' },
      { sp: 'A', text: 'So what do you do instead?' },
      { sp: 'B', text: 'I drink a glass of water, stretch for five minutes and write down the one thing I need to finish today.' },
      { sp: 'A', text: 'Simple enough. I might give that a go tomorrow, and I will report back next week.' },
    ],
    quiz: [
      { q: 'What is Tom’s main point?', options: ['Everyone should wake up at five', 'The routine matters more than the time', 'Phones should be banned'], answer: 1, line: 3 },
      { q: 'What did Maya used to do first thing in the morning?', options: ['Exercise', 'Read the news on her phone', 'Cook breakfast'], answer: 1, line: 4 },
      { q: 'What does Tom write down each morning?', options: ['A shopping list', 'The one thing he must finish', 'A short poem'], answer: 1, line: 7 },
    ],
    phrases: [
      ph('worn out', 'adj', 'juda charchagan (holdan toygan)', 'extremely tired', 'After the long trip I felt worn out.'),
      ph('set the tone', 'idiom', 'ohangni belgilamoq (kayfiyatni)', 'to decide the mood of what follows', 'A friendly start can set the tone for the meeting.'),
      ph('give it a go', 'idiom', 'bir urinib ko‘rmoq', 'to try something', 'I will give it a go this weekend.'),
    ],
    retell: {
      points: [
        { label: '5 da turish haqidagi maslahat real emas', keys: ['five', 'realistic', 'depends'] },
        { label: 'Muhimi — tartib, soat emas', keys: ['routine', 'matter'] },
        { label: 'Telefonni darhol ochmaslik', keys: ['phone', 'scroll', 'news'] },
        { label: 'Tom: suv, cho‘zilish, bugungi bitta muhim ish', keys: ['water', 'stretch', 'one thing'] },
        { label: 'Maya ertaga sinab ko‘radi', keys: ['try', 'give', 'tomorrow', 'report'] },
      ],
      model: 'Tom argues that waking up at five is not necessary for success; what matters is a calm routine instead of checking the phone straight away. He drinks water, stretches and writes down the one task he must finish, and Maya says she will try this tomorrow.',
    },
  },
  {
    id: 'lecture-sleep', title: 'Ma‘ruza: uyqu va xotira', genre: 'Akademik ma‘ruza', level: 'C1',
    about: 'Universitet ma’ruzasidan parcha: uyqu xotirani qanday mustahkamlaydi.',
    brief: 'Akademik nutq: uzun gaplar, bog‘lovchilar va aniq terminlar. Birinchi tinglashda g‘oyani, ikkinchisida iboralarni ushlang.',
    names: { A: 'Lecturer' }, voices: { A: 'bm_george' },
    lines: [
      { sp: 'A', text: 'Good afternoon, everyone. Today I would like to examine a question that has fascinated researchers for decades: why do we need to sleep?' },
      { sp: 'A', text: 'For a long time, sleep was regarded as little more than a period of rest, during which the brain simply switched off.' },
      { sp: 'A', text: 'However, modern imaging techniques have shown that the sleeping brain is remarkably active, particularly in the processing of memories.' },
      { sp: 'A', text: 'During deep sleep, information acquired during the day is gradually transferred from temporary storage to long-term memory.' },
      { sp: 'A', text: 'In one well-known experiment, students who slept after studying recalled significantly more than those who stayed awake for the same period.' },
      { sp: 'A', text: 'It would be tempting to conclude that more sleep is always better, but the evidence suggests a more nuanced picture.' },
      { sp: 'A', text: 'Both chronic sleep deprivation and excessive sleep are associated with poorer concentration and a higher risk of illness.' },
      { sp: 'A', text: 'Consequently, researchers now emphasise regular, good-quality sleep rather than simply increasing the number of hours.' },
    ],
    quiz: [
      { q: 'What did researchers once believe about sleep?', options: ['It strengthens the heart', 'It is mainly a period of rest', 'It is harmful to memory'], answer: 1, line: 1 },
      { q: 'What happens during deep sleep?', options: ['Memories are moved to long-term storage', 'The brain stops working', 'Dreams become shorter'], answer: 0, line: 3 },
      { q: 'What do researchers emphasise today?', options: ['Sleeping as long as possible', 'Regular, good-quality sleep', 'Short naps only'], answer: 1, line: 7 },
    ],
    phrases: [
      ph('be regarded as', 'collocation', 'deb hisoblanmoq', 'to be thought of in a particular way', 'Sleep used to be regarded as a waste of time.'),
      ph('a more nuanced picture', 'collocation', 'murakkabroq, nozik manzara', 'a more detailed and balanced understanding', 'Further research gives a more nuanced picture.'),
      ph('be associated with', 'collocation', 'bilan bog‘liq bo‘lmoq', 'to be connected with something', 'Stress can be associated with heart problems.'),
    ],
    retell: {
      points: [
        { label: 'Uyqu avval oddiy dam olish deb qaralgan', keys: ['rest', 'switched off', 'regarded'] },
        { label: 'Tasvirlash usullari miyaning faolligini ko‘rsatdi', keys: ['imaging', 'active', 'brain'] },
        { label: 'Chuqur uyquda ma’lumot uzoq muddatli xotiraga o‘tadi', keys: ['long-term', 'memory', 'transferred', 'deep sleep'] },
        { label: 'Tajriba: uxlagan talabalar ko‘proq eslab qolgan', keys: ['students', 'experiment', 'recalled', 'more'] },
        { label: 'Ko‘p uyqu emas, sifatli va muntazam uyqu muhim', keys: ['quality', 'regular', 'deprivation', 'excessive'] },
      ],
      model: 'The lecturer explains that sleep was once seen as simple rest, but imaging shows that the brain is active, moving information into long-term memory during deep sleep. An experiment found that students who slept recalled more, yet both too little and too much sleep are harmful, so quality and regularity matter most.',
    },
  },
  {
    id: 'debate-ai', title: 'Munozara: sun’iy intellekt va ish o‘rinlari', genre: 'Akademik ma‘ruza', level: 'C1',
    about: 'Ikki mutaxassis ish o‘rinlariga AI ta’siri haqida bahslashmoqda (rasmiy munozara).',
    brief: 'Rasmiy munozara: fikrni bildirish, qarshi dalilga javob berish iboralari — Speaking Part 3 uchun ideal namuna.',
    names: { A: 'Dr Hughes', B: 'Prof Adeyemi' }, voices: { A: 'bf_isabella', B: 'bm_lewis' },
    lines: [
      { sp: 'A', text: 'Let me begin by challenging the prevailing view. The claim that automation will eliminate millions of jobs is, in my opinion, considerably exaggerated.' },
      { sp: 'B', text: 'With respect, Dr Hughes, the historical parallel is less reassuring than you suggest. Previous revolutions replaced muscle power, whereas this one is replacing cognitive tasks.' },
      { sp: 'A', text: 'That is a fair point. Nevertheless, new technologies have consistently created categories of work that nobody had imagined beforehand.' },
      { sp: 'B', text: 'Yes, but the transition may be painful. Workers cannot retrain overnight, and the new roles will not necessarily appear in the same regions.' },
      { sp: 'A', text: 'I would not deny that. Which is precisely why governments should invest in education and retraining rather than attempt to slow down innovation.' },
      { sp: 'B', text: 'I agree with that to a certain extent. Yet without stronger safeguards, the benefits risk being concentrated in the hands of a few companies.' },
      { sp: 'A', text: 'Then perhaps we are closer than it first appeared. The real question is not whether change will come, but who will be prepared for it.' },
    ],
    quiz: [
      { q: 'What is Dr Hughes’s opening position?', options: ['Automation will destroy millions of jobs', 'The fear of job losses is exaggerated', 'AI should be banned'], answer: 1, line: 0 },
      { q: 'What worry does Prof Adeyemi raise?', options: ['The transition may be painful for workers', 'Computers are too expensive', 'People will stop studying'], answer: 0, line: 3 },
      { q: 'What do both speakers finally agree on?', options: ['Governments should ignore the issue', 'Preparation and retraining are essential', 'Technology is always harmful'], answer: 1, line: 6 },
    ],
    phrases: [
      ph('with respect', 'linker', 'hurmat bilan aytganda (rasmiy e’tiroz)', 'a polite way to start disagreeing', 'With respect, I do not think that is accurate.'),
      ph('a fair point', 'idiom', 'o‘rinli fikr (rozi bo‘lganda)', 'a reasonable argument that you accept', 'That is a fair point, I had not thought of it.'),
      ph('precisely why', 'collocation', 'aynan shuning uchun', 'exactly the reason', 'That is precisely why we need new rules.'),
    ],
    retell: {
      points: [
        { label: 'Hughes: ish o‘rinlari yo‘qolishi haqidagi qo‘rquv oshirib yuborilgan', keys: ['exaggerat', 'automation', 'jobs'] },
        { label: 'Adeyemi: bu inqilob aqliy mehnatni almashtiryapti', keys: ['cognitive', 'replacing', 'revolution'] },
        { label: 'Yangi texnologiyalar yangi kasblar yaratgan', keys: ['create', 'new roles', 'categories'] },
        { label: 'O‘tish og‘ir bo‘lishi mumkin, qayta o‘qitish zarur', keys: ['retrain', 'transition', 'painful', 'education'] },
        { label: 'Ikkalasi tayyorgarlik muhimligiga kelishdi', keys: ['prepared', 'safeguards', 'agree', 'closer'] },
      ],
      model: 'Dr Hughes argues that fears of mass unemployment are exaggerated because new technologies create new kinds of work, while Professor Adeyemi replies that this revolution replaces cognitive tasks and that the transition may hurt workers. They finally agree that education, retraining and safeguards are what matter.',
    },
  },
  {
    id: 'doc-reef', title: 'Hujjatli film: marjon riflari', genre: 'Hujjatli film', level: 'C1',
    about: 'Tabiat haqidagi hujjatli film ovozi: marjon riflarining ahamiyati va tahdidlari.',
    brief: 'Hikoyachi ohangi: ritm, pauza va urg‘uni tutib turing. Shadowing uchun eng yaxshi janr.',
    names: { A: 'Narrator' }, voices: { A: 'bm_george' },
    lines: [
      { sp: 'A', text: 'Beneath the surface of the tropical ocean lies one of the most diverse ecosystems on Earth: the coral reef.' },
      { sp: 'A', text: 'Although reefs cover less than one percent of the sea floor, they provide a home for roughly a quarter of all marine species.' },
      { sp: 'A', text: 'Millions of people depend on them for food, income from tourism and natural protection against powerful storms.' },
      { sp: 'A', text: 'Yet these delicate structures are extraordinarily sensitive to temperature, and even a slight rise can cause the corals to expel the algae that feed them.' },
      { sp: 'A', text: 'The result is bleaching, a ghostly whitening that, if prolonged, leaves the reef lifeless.' },
      { sp: 'A', text: 'Scientists are now experimenting with heat-resistant corals in the hope of restoring damaged areas.' },
      { sp: 'A', text: 'But they warn that without a sharp reduction in carbon emissions, such efforts may only delay the inevitable.' },
    ],
    quiz: [
      { q: 'What proportion of marine species live on reefs?', options: ['About a quarter', 'About a tenth', 'Nearly all'], answer: 0, line: 1 },
      { q: 'What causes coral bleaching?', options: ['Overfishing only', 'A rise in sea temperature', 'Lack of sunlight'], answer: 1, line: 3 },
      { q: 'What do scientists say is necessary?', options: ['More tourism', 'A sharp cut in carbon emissions', 'Bigger fishing boats'], answer: 1, line: 6 },
    ],
    phrases: [
      ph('depend on', 'phrasal verb', 'ga tayanmoq, bog‘liq bo‘lmoq', 'to need something in order to survive', 'Many communities depend on fishing.'),
      ph('in the hope of', 'collocation', 'umidida, maqsadida', 'with the wish that something will happen', 'They moved in the hope of finding work.'),
      ph('delay the inevitable', 'idiom', 'muqarrarni kechiktirmoq', 'to postpone something that will certainly happen', 'Repairs may only delay the inevitable.'),
    ],
    retell: {
      points: [
        { label: 'Riflar okean tubining 1% dan kamini egallaydi, lekin dengiz turlarining choragiga uy', keys: ['one percent', 'quarter', 'species'] },
        { label: 'Odamlar oziq-ovqat, turizm va to‘lqindan himoya uchun bog‘liq', keys: ['food', 'tourism', 'storms', 'depend', 'millions', 'protect'] },
        { label: 'Harorat ko‘tarilsa, marjonlar suv o‘tlarini chiqaradi', keys: ['temperature', 'algae'] },
        { label: 'Oqarish (bleaching) rifni o‘ldiradi', keys: ['bleaching', 'lifeless', 'whitening'] },
        { label: 'Issiqqa chidamli marjonlar sinovda, lekin emissiyani kamaytirish shart', keys: ['heat-resistant', 'emissions', 'restore'] },
      ],
      model: 'Coral reefs cover under one percent of the sea floor but host a quarter of marine species and protect and feed millions of people. Rising temperatures make corals expel their algae, causing bleaching that can kill a reef; scientists are testing heat-resistant corals, but they say that carbon emissions must fall sharply.',
    },
  },
];
