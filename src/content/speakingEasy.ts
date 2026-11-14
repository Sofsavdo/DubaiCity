// A1–A2 daraja uchun sodda Speaking savollari. Har bir savolning o'zbekcha tarjimasi ekranda yordam sifatida ko'rsatiladi.
export interface EasyQ { en: string; uz: string }

export const easyPart1Topics: { topic: string; questions: EasyQ[] }[] = [
  { topic: 'Family', questions: [
    { en: 'Do you have a big family?', uz: 'Katta oilangiz bormi?' },
    { en: 'Who do you live with?', uz: 'Kim bilan birga yashaysiz?' },
    { en: 'Do you like spending time with your family?', uz: 'Oilangiz bilan vaqt o‘tkazishni yoqtirasizmi?' },
  ] },
  { topic: 'Home', questions: [
    { en: 'Do you live in a house or a flat?', uz: 'Siz uyda yashaysizmi yoki kvartirada?' },
    { en: 'What is your favourite room?', uz: 'Eng yoqtirgan xonangiz qaysi?' },
    { en: 'Do you like your home?', uz: 'Uyingiz sizga yoqadimi?' },
  ] },
  { topic: 'Daily routine', questions: [
    { en: 'What time do you get up?', uz: 'Soat nechada turasiz?' },
    { en: 'What do you do in the morning?', uz: 'Ertalab nima qilasiz?' },
    { en: 'What do you usually do in the evening?', uz: 'Kechqurun odatda nima qilasiz?' },
  ] },
  { topic: 'Food', questions: [
    { en: 'What food do you like?', uz: 'Qanday ovqatni yoqtirasiz?' },
    { en: 'Do you cook at home?', uz: 'Uyda ovqat pishirasizmi?' },
    { en: 'What did you eat today?', uz: 'Bugun nima yedingiz?' },
  ] },
  { topic: 'Hobbies', questions: [
    { en: 'What do you like to do in your free time?', uz: 'Bo‘sh vaqtingizda nima qilishni yoqtirasiz?' },
    { en: 'Do you like sport?', uz: 'Sportni yoqtirasizmi?' },
    { en: 'Do you like music?', uz: 'Musiqani yoqtirasizmi?' },
  ] },
  { topic: 'Study and work', questions: [
    { en: 'Are you a student or do you work?', uz: 'Siz talabamisiz yoki ishlaysizmi?' },
    { en: 'What do you study or what is your job?', uz: 'Nimani o‘qiysiz yoki kasbingiz nima?' },
    { en: 'Do you like it?', uz: 'Bu sizga yoqadimi?' },
  ] },
];

export const easyPart2Cards: { title: string; titleUz: string; points: string[]; part3: EasyQ[] }[] = [
  {
    title: 'Describe your best friend.', titleUz: 'Eng yaqin do‘stingiz haqida gapirib bering.',
    points: ['who the person is', 'how long you have known them', 'what you do together', 'and say why you like them.'],
    part3: [
      { en: 'Is it easy to make friends?', uz: 'Do‘st orttirish osonmi?' },
      { en: 'Do you prefer one close friend or many friends?', uz: 'Bitta yaqin do‘st yaxshimi yoki ko‘p do‘st?' },
      { en: 'Why are friends important?', uz: 'Do‘stlar nima uchun muhim?' },
    ],
  },
  {
    title: 'Describe your favourite food.', titleUz: 'Eng yoqtirgan ovqatingiz haqida gapirib bering.',
    points: ['what it is', 'who makes it', 'when you eat it', 'and say why you like it.'],
    part3: [
      { en: 'Do people in your country eat healthy food?', uz: 'Yurtingizda odamlar sog‘lom ovqatlanadimi?' },
      { en: 'Do you prefer home food or restaurant food?', uz: 'Uy ovqati yaxshimi yoki restoran ovqati?' },
      { en: 'Why do some people like to cook?', uz: 'Nega ba’zi odamlar ovqat pishirishni yaxshi ko‘radi?' },
    ],
  },
  {
    title: 'Describe your home.', titleUz: 'Uyingiz haqida gapirib bering.',
    points: ['where it is', 'how many rooms it has', 'what you like in it', 'and say why you like it.'],
    part3: [
      { en: 'Do many people live in flats in your city?', uz: 'Shahringizda ko‘pchilik kvartirada yashaydimi?' },
      { en: 'Is a big house better than a small house?', uz: 'Katta uy kichik uydan yaxshimi?' },
      { en: 'Why do people move to new homes?', uz: 'Odamlar nega yangi uyga ko‘chadi?' },
    ],
  },
];

/** C1: murakkabroq Part 3 savollari (har bir kartaga qo'shiladi) */
export const hardPart3: string[] = [
  'To what extent do you agree that individual choices matter more than government policy in solving social problems?',
  'How might the relationship between education and employment evolve over the next few decades?',
  'Some argue that economic growth inevitably comes at the expense of the environment. How far is that true?',
];
