// Ustoz Bandi shaxsiyati. Darajalar: 0 yumshoq, 1 hazil (kinoya), 2 qattiq (yengil so'kish), 3 jallod (dramatik g'azab).
// 2 va 3 faqat 18+ tasdiqlangan foydalanuvchiga. Taqiqlangan: oila, din, millat, jins, tashqi ko'rinish, nogironlik, siyosat, jinsiy mazmun.
export type Emotion = 'happy' | 'angry' | 'laugh' | 'disappointed' | 'impressed';
export interface Reaction { uz: string; en: string; emotion: Emotion }
type L = Reaction;

export const LEVELS = [
  { id: 0, name: 'Yumshoq', desc: 'Do‘stona ustoz, xatolarga muloyim tuzatish' },
  { id: 1, name: 'Hazil', desc: 'Kinoya va hazil, haqoratsiz' },
  { id: 2, name: 'Qattiq (18+)', desc: 'Yengil so‘kish, xatolar ustidan kulish' },
  { id: 3, name: 'Jallod (18+)', desc: 'Dramatik g‘azab, qattiq so‘kish' },
] as const;

const l = (emotion: Emotion, uz: string, en: string): L => ({ emotion, uz, en });

/** {wrong}, {right}, {n} o'rniga qiymat qo'yiladi */
export const roastLines = {
  error: {
    0: [l('happy', 'Kichik tuzatish: “{wrong}” emas, “{right}” deyiladi.', 'Small tip: say “{right}”, not “{wrong}”.')],
    1: [
      l('disappointed', '“{wrong}”? Qiziq... ingliz tili hozir yig‘layapti. To‘g‘risi: “{right}”.', '“{wrong}”? Interesting. English is crying right now. It is “{right}”.'),
      l('laugh', '“{wrong}” deysanmi? Gramatika kitobi uyalib ketdi. To‘g‘risi “{right}”.', '“{wrong}”? The grammar book is blushing. It is “{right}”.'),
    ],
    2: [
      l('angry', '“{wrong}”?! Tentak, to‘g‘risi “{right}”! Yana shunday desang, eshak deb yozib qo‘yaman.', '“{wrong}”?! You muppet, it is “{right}”! Say that again and I will write you down as a donkey.'),
      l('laugh', 'Ha-ha-ha! “{wrong}” deysanmi? Eshak ham bundan yaxshi gapiradi! To‘g‘risi “{right}”.', 'Ha ha ha! “{wrong}”? Even a donkey speaks better! It is “{right}”.'),
      l('angry', 'Voy, ahmoq-ey! “{wrong}” emas, “{right}”!', 'Oh, you fool! Not “{wrong}”, it is “{right}”!'),
    ],
    3: [
      l('angry', 'NIMA?! “{wrong}”?! Ahmoq, miyang bormi o‘zi?! To‘g‘risi “{right}”, yodla!', 'WHAT?! “{wrong}”?! Are you out of your mind?! It is “{right}”, memorise it!'),
      l('laugh', 'Voy-voy-voy... “{wrong}”. Gramatika kitobi o‘z-o‘zidan yonib ketdi. “{right}”, chumo!', 'Oh dear... “{wrong}”. The grammar book just set itself on fire. “{right}”, you fool!'),
      l('angry', '“{wrong}”!!! Miyasiz! Qulog‘im og‘riydi! “{right}” de, “{right}”!', '“{wrong}”!!! Brainless! My ears hurt! Say “{right}”, “{right}”!'),
    ],
  },
  fillers: {
    0: [l('happy', 'Juda ko‘p “um” deyapsiz. Qisqa pauza qilib ko‘ring.', 'You say “um” a lot. Try a short pause instead.')],
    1: [l('disappointed', '{n} ta “um” sanadim. Rekord!', 'I counted {n} “ums”. A record!')],
    2: [l('angry', '{n} ta “um”?! Tentak, gapirasanmi yoki motorni yurgizasanmi?!', '{n} “ums”?! You muppet, are you speaking or starting an engine?!')],
    3: [l('angry', '{n} ta “um”!!! Miyasiz, gapingni oldindan o‘ylab ol!', '{n} “ums”!!! Brainless, think before you speak!')],
  },
  short: {
    0: [l('happy', 'Biroz batafsilroq javob bering: sababini qo‘shing.', 'Please say a little more and add a reason.')],
    1: [l('disappointed', 'Bu javobmi yoki ishoramimi?', 'Is that an answer or a hint?')],
    2: [l('angry', 'Bu nima, bir so‘zmi?! Eshak ham ko‘proq gapiradi!', 'What is that, one word?! A donkey talks more!')],
    3: [l('angry', 'BIR SO‘Z?! Ahmoq, men senga gapir deyapman, jim bo‘l demayapman!', 'ONE WORD?! You fool, I said speak, not be silent!')],
  },
  silence: {
    0: [l('happy', 'Eshitmadim. Mikrofon ishlayaptimi? Qayta urinib ko‘ring.', 'I did not hear you. Is the microphone working? Please try again.')],
    1: [l('disappointed', 'Jimlikmi? Ajoyib strategiya.', 'Silence? A brilliant strategy.')],
    2: [l('angry', 'Jim?! Tilingni yutdingmi, tentak?', 'Silent?! Did you swallow your tongue, muppet?')],
    3: [l('angry', 'Jim turibsan?! Gapir, ahmoq!', 'Standing there silent?! Speak, you fool!')],
  },
  slow: {
    0: [l('happy', 'Shoshilmang, lekin sal tezroq javob berishga harakat qiling.', 'No rush, but try to answer a little faster.')],
    1: [l('disappointed', 'Uyg‘ondingmi?', 'Are you awake?')],
    2: [l('angry', 'Uxlab qoldingmi, tentak?', 'Did you fall asleep, muppet?')],
    3: [l('angry', 'Hoy, miyang ishlayaptimi?! Javob ber!', 'Hey, is your brain working?! Answer!')],
  },
  praise: {
    0: [l('impressed', 'Juda yaxshi javob!', 'A very good answer!')],
    1: [l('impressed', 'Hm, yomon emas. Hayronman.', 'Hm, not bad. I am surprised.')],
    2: [l('impressed', 'Ho‘sh, seni ahmoq deb o‘ylagandim. Xato qilibman.', 'Well, I thought you were a fool. I was wrong.')],
    3: [l('impressed', 'Hayratdaman! Voy, miya ishlaydi-ku! Hozircha so‘kmayman.', 'I am amazed! Look, the brain works! I will not curse you. For now.')],
  },
} as const;

/** Barcha darajalarda taqiqlangan mavzular (testda tekshiriladi) */
export const FORBIDDEN = /\b(?:ona|ota|oila|din|millat|musulmon|nasroniy|yahudiy|nogiron|semiz|xotin|ayol|erkak|qiz|jinsiy|hindu|negr|gay|(?:onang|otang|opang|akang|singling|bobong|buvang|dining|millating|oilang|yurting)\w*)\b/i;
