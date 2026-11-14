import type { WritingTask } from './types';

// Short guided writing per lesson (pilot). Checked by rules only: length, required structures, forbidden patterns and known learner errors.
const PP = String.raw`\b(have|has|'ve|'s)( never| ever| already| just)? \w+(ed|en|wn|ne|t|ght|ung|ade|id)\b`;

export const WRITING: Record<string, WritingTask> = {
  'a1-u1-l1': {
    promptUz: 'O‘zingizni tanishtiring: ismingiz, yoshingiz va qayerdan ekaningiz (3–4 ta gap).', minWords: 12,
    require: [{ re: String.raw`\b(I am|I'm)\b`, labelUz: '“I am / I’m” ishlatilgan' }, { re: String.raw`\bfrom\b`, labelUz: 'qayerdanligingiz (from)' }],
    model: 'Hi! My name is Aziz. I am nineteen years old. I am from Namangan. I am a student.',
  },
  'a1-u1-l2': {
    promptUz: 'Yangi tanishingizga 2 ta savol yozing (Are you…? / Is your…?) va o‘zingiz haqida 1 ta inkor gap.', minWords: 10,
    require: [{ re: String.raw`\b(Are|Is) (you|he|she|it|they|your|his|her)\b[^?]*\?`, labelUz: '“to be” bilan savol' }, { re: String.raw`\b(isn't|aren't|'m not|am not|is not|are not)\b`, labelUz: 'inkor gap' }],
    model: 'Are you a student? Is your sister at home? I am not busy today.',
  },
  'a1-u1-l3': {
    promptUz: 'Oilangizdagi 3 kishining kasbini yozing (a / an va my / his / her bilan).', minWords: 12,
    require: [{ re: String.raw`\b(is|am|are) (a|an) \w+`, labelUz: 'kasb oldida a / an' }, { re: String.raw`\b(my|his|her|their|our)\b`, labelUz: 'egalik so‘zi (my, his, her…)' }],
    model: 'My father is an engineer. My mother is a teacher. My brother is a driver.',
  },
  'a1-u2-l1': {
    promptUz: 'Kun tartibingiz haqida 4 ta gap yozing (usually / always / never va soat bilan).', minWords: 16,
    require: [{ re: String.raw`\b(always|usually|often|never|sometimes)\b`, labelUz: 'usually / always / never' }, { re: String.raw`\bat (\d|half|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)`, labelUz: 'at + soat' }],
    model: 'I usually get up at seven. I have breakfast at half past seven. I go to work by bus. I never watch TV in the morning.',
  },
  'a1-u2-l2': {
    promptUz: 'Oila a’zolaringizdan birining kuni haqida 3 ta gap yozing (he yoki she bilan).', minWords: 12,
    require: [{ re: String.raw`\b(he|she) (usually |always |often |never )?\w+(s|es)\b`, labelUz: 'he / she + fe’l-s' }],
    model: 'My sister works in a bank. She gets up at six. She goes to work by metro.',
  },
  'a1-u2-l3': {
    promptUz: 'Do‘stingizga 2 ta Do / Does savoli va 1 ta don’t / doesn’t gapi yozing.', minWords: 12,
    require: [{ re: String.raw`\b(Do|Does)\b[^?]*\?`, labelUz: 'Do / Does savoli' }, { re: String.raw`\b(don't|doesn't|do not|does not)\b`, labelUz: 'don’t / doesn’t' }],
    model: 'Do you like football? Does your brother play the guitar? I don’t eat fast food.',
  },
  'a2-u1-l1': {
    promptUz: 'Kecha nima qilganingiz haqida 3 ta gap yozing (to‘g‘ri fe’llar, -ed).', minWords: 12,
    require: [{ re: String.raw`\b\w+ed\b`, labelUz: '-ed bilan fe’l' }, { re: String.raw`\b(yesterday|last|ago)\b`, labelUz: 'o‘tgan vaqt so‘zi (yesterday, last, ago)' }],
    model: 'Yesterday I cleaned my room. Then I cooked dinner for my family. In the evening I watched a film.',
  },
  'a2-u1-l2': {
    promptUz: 'O‘tgan dam olish kunlari haqida 3–4 ta gap yozing; noto‘g‘ri fe’llarni ishlating.', minWords: 15,
    require: [{ re: String.raw`\b(went|had|saw|bought|made|came|ate|took|got|met)\b`, labelUz: 'noto‘g‘ri fe’lning o‘tgan shakli' }],
    forbid: [{ re: String.raw`\b(goed|haved|seed|buyed|maked|comed|eated|taked|getted|meeted)\b`, labelUz: 'noto‘g‘ri fe’lga -ed qo‘shilgan' }],
    model: 'Last weekend I went to Chimgan with my friends. We took a lot of photos. We ate shashlik and had a great time.',
  },
  'a2-u1-l3': {
    promptUz: 'Do‘stingizga dam olishi haqida 2 ta savol (did bilan) va o‘zingiz haqida 1 ta didn’t gapi yozing.', minWords: 14,
    require: [{ re: String.raw`\b[Dd]id\b[^?]*\?`, labelUz: 'did bilan savol' }, { re: String.raw`\b(didn't|did not)\b`, labelUz: 'didn’t gapi' }],
    forbid: [{ re: String.raw`\b(did|didn't|did not) (\w+ )?(went|saw|ate|took|came|got|made|had|bought)\b`, labelUz: 'did dan keyin fe’l oddiy shaklda bo‘lishi kerak' }],
    model: 'Did you go to the mountains? What did you do on Sunday? I didn’t go out because it rained.',
  },
  'a2-u2-l1': {
    promptUz: 'Mahallangizni tasvirlang: 3 ta gap, there is va there are bilan.', minWords: 15,
    require: [{ re: String.raw`\b(there is|there's|there isn't)\b`, labelUz: 'there is' }, { re: String.raw`\b(there are|there aren't)\b`, labelUz: 'there are' }],
    model: 'There is a big park near my house. There are some small shops and a café. There isn’t a cinema, but there are two schools.',
  },
  'a2-u2-l2': {
    promptUz: 'Xonangizni tasvirlang: narsalar qayerda joylashgan (3 ta gap).', minWords: 14,
    require: [{ re: String.raw`\b(next to|opposite|between|behind|in front of|on|in|under)\b`, labelUz: 'joy predlogi' }, { re: String.raw`\b(next to|opposite|between|behind|in front of)\b`, labelUz: 'next to / opposite / between / behind / in front of dan biri' }],
    model: 'My desk is next to the window. There is a lamp on the desk. My bed is opposite the door.',
  },
  'a2-u2-l3': {
    promptUz: 'Do‘konda sotuvchi bilan qisqa dialog yozing: narx so‘rang va miqdorni ayting.', minWords: 15,
    require: [{ re: String.raw`\bHow (much|many)\b`, labelUz: 'How much / How many' }, { re: String.raw`\b(bottles?|kilos?|loaf|loaves|packets?|boxes|box) of\b`, labelUz: 'a bottle / kilo / loaf of …' }],
    model: 'How much are these apples? — Twelve thousand som a kilo. — Two kilos of apples and a bottle of water, please.',
  },
  'b1-u1-l1': {
    promptUz: 'Hayotingizdagi 3 ta tajriba haqida yozing (have / has + 3-shakl, ever / never).', minWords: 15,
    require: [{ re: PP, labelUz: 'have / has + 3-shakl' }, { re: String.raw`\b(never|ever)\b`, labelUz: 'ever yoki never' }],
    model: 'I have visited Kazakhstan twice. I have never tried skydiving. Have you ever seen the Aral Sea?',
  },
  'b1-u1-l2': {
    promptUz: 'Bitta tajribangiz haqida yozing: avval Present Perfect bilan umumiy gap, keyin aniq vaqt bilan Past Simple.', minWords: 18,
    require: [{ re: PP, labelUz: 'Present Perfect (umumiy tajriba)' }, { re: String.raw`\b(in (19|20)\d\d|last \w+|ago|yesterday)\b`, labelUz: 'aniq o‘tgan vaqt' }],
    forbid: [{ re: String.raw`\b(have|has|'ve) \w+ (yesterday|last \w+|in (19|20)\d\d|\w+ ago)\b`, labelUz: 'aniq vaqt bilan Present Perfect ishlatilmaydi' }],
    model: 'I have been to Istanbul. I went there in 2023 with my family. We visited many museums and ate a lot of street food.',
  },
  'b1-u1-l3': {
    promptUz: 'Ishingiz yoki o‘qishingiz haqida 3 ta gap: for, since va already / yet / just ishlating.', minWords: 18,
    require: [{ re: String.raw`\bfor (\w+ )?(years?|months?|weeks?|days?|hours?|a long time)\b`, labelUz: 'for + davomiylik' }, { re: String.raw`\bsince\b`, labelUz: 'since + boshlanish vaqti' }, { re: String.raw`\b(already|yet|just)\b`, labelUz: 'already / yet / just' }],
    forbid: [{ re: String.raw`\bI (live|work|study|know) \w*\s*\w*\s*since\b`, labelUz: 'since bilan Present Simple emas, Present Perfect kerak' }],
    model: 'I have studied at this university since 2022. I have lived in Tashkent for three years. I haven’t finished my final project yet.',
  },
  'b1-u2-l1': {
    promptUz: 'Kelasi yil rejalaringizni (going to) va bitta bashoratingizni (will) yozing.', minWords: 18,
    require: [{ re: String.raw`\bgoing to\b`, labelUz: 'going to (reja)' }, { re: String.raw`\b(will|'ll|won't)\b`, labelUz: 'will (bashorat yoki qaror)' }],
    forbid: [{ re: String.raw`\bwill (goes|comes|does|has|works|lives|studies|makes|takes|gets|starts|buys|finishes)\b`, labelUz: 'will dan keyin fe’l -s olmaydi' }],
    model: 'Next year I’m going to start a new job. I’m also going to save money for a car. I think it will be a busy but happy year.',
  },
  'b1-u2-l2': {
    promptUz: '3 ta birinchi shart gap yozing (If + Present Simple, … will …).', minWords: 20,
    require: [{ re: String.raw`\bif\b`, labelUz: 'if' }, { re: String.raw`\b(will|'ll|won't)\b`, labelUz: 'natijada will' }],
    forbid: [{ re: String.raw`\bif\b[^,.]*\bwill\b`, labelUz: 'if qismida will ishlatilmaydi' }],
    model: 'If it rains tomorrow, we will stay at home. If I pass the exam, I’ll celebrate with my friends. If you don’t hurry, you will miss the bus.',
  },
  'b1-u2-l3': {
    promptUz: 'Ikki narsani taqqoslang (masalan, shahar va qishloq hayoti): 3 ta gap.', minWords: 18,
    require: [{ re: String.raw`\b(\w+er|more \w+|less \w+) than\b`, labelUz: 'qiyosiy daraja + than' }, { re: String.raw`\b(the \w+est|the most \w+|as \w+ as)\b`, labelUz: 'the -est / the most / as … as' }],
    forbid: [{ re: String.raw`\bmore (cheaper|bigger|better|easier|faster|smaller|cleaner|quieter|noisier|happier|older|younger|larger|longer|shorter|higher|lower|worse|warmer|colder|hotter|richer|poorer|busier)\b`, labelUz: 'more va -er birga ishlatilmaydi' }],
    model: 'Life in the city is more exciting than life in a village. A village is not as noisy as a city. For me, Tashkent is the most comfortable place to live.',
  },
  'b2-u1-l1': {
    promptUz: 'Shahringizdagi biror bino yoki joy haqida qisqa ma’lumot yozing: qachon qurilgan, nima uchun ishlatiladi (kamida 2 ta passiv gap).', minWords: 25,
    require: [{ re: String.raw`\b(is|are|was|were|has been|have been|will be|can be)( \w+ly)? \w+(ed|en|wn|lt|ght|ne|un|t)\b`, labelUz: 'passiv: be + 3-shakl' }],
    forbid: [{ re: String.raw`\b(was|were|is) (happened|died|arrived|existed)\b`, labelUz: 'happen / die / arrive / exist o‘timsiz — passivi yo‘q' }, { re: String.raw`\b(was|were|is|are) (build|make|write|take|give|speak)\b`, labelUz: 'be dan keyin 3-shakl kerak (built, made, written…)' }],
    model: 'The Amir Temur Museum in Tashkent was opened in 1996. It was built in the centre of the city, and it is visited by thousands of tourists every year. Many old manuscripts are kept there.',
  },
  'b2-u1-l2': {
    promptUz: 'Kecha kimdir sizga aytgan 3 ta gapni o‘zlashtirma gap bilan yetkazing (said / told / asked).', minWords: 22,
    require: [{ re: String.raw`\b(said|told|asked)\b`, labelUz: 'said / told / asked' }, { re: String.raw`\b(was|were|had|would|could|wanted|liked|lived|worked)\b`, labelUz: 'zamon bir pog‘ona orqaga surilgan' }],
    forbid: [{ re: String.raw`\bsaid (me|him|her|us|them)\b`, labelUz: 'said + kishi emas: told me / said to me' }, { re: String.raw`\basked (me |him |her )?(where|what|when|why|how) (do|does|did|is|are|can|will) `, labelUz: 'o‘zlashtirma savolda so‘roq tartibi bo‘lmaydi' }],
    model: 'My friend told me that she had passed her driving test. My teacher said that the exam would be on Monday. My brother asked me where I had put his charger.',
  },
  'b2-u1-l3': {
    promptUz: 'Sizga muhim bo‘lgan odam, joy va narsani tasvirlang: who, where, which/that ishlatib 3 ta gap.', minWords: 25,
    require: [{ re: String.raw`\bwho\b`, labelUz: 'who (odam)' }, { re: String.raw`\b(where|whose)\b`, labelUz: 'where yoki whose' }, { re: String.raw`\b(which|that)\b`, labelUz: 'which / that (narsa)' }],
    forbid: [{ re: String.raw`, that\b`, labelUz: 'vergulli (qo‘shimcha ma’lumot) gapda that ishlatilmaydi' }],
    model: 'My grandfather, who was a teacher, taught me to read. Samarkand is the city where I spent my childhood. The book which changed my life was a gift from him.',
  },
  'b2-u2-l1': {
    promptUz: '“Agar bir yil ishlamasdan yashay olsangiz, nima qilardingiz?” — 3 ta gap bilan javob bering.', minWords: 25,
    require: [{ re: String.raw`\bif\b`, labelUz: 'if' }, { re: String.raw`\b(would|could|might|'d)\b`, labelUz: 'would / could + fe’l' }],
    forbid: [{ re: String.raw`\bif\b[^,.]*\bwould\b`, labelUz: 'if qismida would ishlatilmaydi' }],
    model: 'If I didn’t have to work for a year, I would travel around Central Asia. I would visit Almaty and Bishkek first. If I had enough money, I could also learn to paint.',
  },
  'b2-u2-l2': {
    promptUz: 'O‘tmishdagi bitta qaroringiz haqida yozing: boshqacha qilganingizda nima bo‘lardi va nimadan afsuslanasiz.', minWords: 25,
    require: [{ re: String.raw`\bif (I|we|you|he|she|they) had\b`, labelUz: 'If + had + 3-shakl' }, { re: String.raw`\bwould(n't)? have\b`, labelUz: 'would have + 3-shakl' }, { re: String.raw`\bwish\b`, labelUz: 'I wish …' }],
    forbid: [{ re: String.raw`\bif\b[^,.]*\bwould\b`, labelUz: 'if qismida would ishlatilmaydi' }],
    model: 'Two years ago I chose economics instead of medicine. If I had chosen medicine, I would have studied for seven years. Sometimes I wish I had listened to my heart, but I am happy with my job now.',
  },
  'b2-u2-l3': {
    promptUz: '“Onlayn ta’lim an’anaviy darsdan yaxshimi?” — ikki tomonni keltirib 3–4 ta gap yozing (although / however / despite).', minWords: 30,
    require: [{ re: String.raw`\b(although|even though|though)\b`, labelUz: 'although / even though' }, { re: String.raw`\b(however|despite|in spite of)\b`, labelUz: 'however yoki despite' }],
    forbid: [{ re: String.raw`\bdespite of\b`, labelUz: '“despite of” — xato' }, { re: String.raw`\b(despite|in spite of) (it|he|she|they|we|I|the \w+) (is|was|are|were|has|have)\b`, labelUz: 'despite dan keyin to‘liq gap emas, ot yoki -ing keladi' }],
    model: 'Although online learning is flexible, it requires a lot of discipline. Students can study at any time. However, many of them miss face-to-face contact with teachers. Despite these problems, I think a mix of both is the best option.',
  },
};
