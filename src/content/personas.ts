// The five Bandly AI personalities (display data shared by client and server). Behaviour prompts live server-side in server/coach.ts.
export type PersonaId = 'friendly' | 'examiner' | 'savage' | 'comedy' | 'debate';
export type CoachEmotion = 'neutral' | 'happy' | 'laugh' | 'angry' | 'disappointed' | 'impressed' | 'serious' | 'sarcastic';
export const COACH_EMOTIONS: CoachEmotion[] = ['neutral', 'happy', 'laugh', 'angry', 'disappointed', 'impressed', 'serious', 'sarcastic'];

export interface PersonaInfo {
  id: PersonaId;
  name: string;
  nameUz: string;
  descUz: string;
  audienceUz: string;
  adultOnly: boolean;      // needs the learner's 18+ confirmation (OD-06b decides the standard; today: self-declared)
  examSafe: boolean;       // allowed in official exam-simulation mode
  accent: string;          // CSS colour
  voice: { pitch: number; rate: number };
}

export const PERSONAS: PersonaInfo[] = [
  { id: 'friendly', name: 'Friendly Coach', nameUz: 'Mehribon murabbiy', descUz: 'Sabrli va qo‘llab-quvvatlaydi. Xatoni yumshoq tuzatadi, qisqa gaplar bilan gapiradi.', audienceUz: 'Boshlovchilar, o‘ziga ishonchi past bo‘lganlar', adultOnly: false, examSafe: false, accent: '#12b76a', voice: { pitch: 1.1, rate: 0.9 } },
  { id: 'examiner', name: 'Strict Examiner', nameUz: 'Qattiqqo‘l imtihonchi', descUz: 'IELTS imtihonchisidek jiddiy: hazilsiz, qisqa va aniq. Fikr-mulohazani suhbat oxirida beradi.', audienceUz: 'IELTS va imtihonga tayyorlanuvchilar', adultOnly: false, examSafe: true, accent: '#1f5cff', voice: { pitch: 0.95, rate: 0.95 } },
  { id: 'savage', name: 'Savage Coach', nameUz: 'Shafqatsiz murabbiy', descUz: 'Keskin hazil, roast, jahl va yengil so‘kish — faqat ingliz tilingizdagi xatolar ustidan. Shaxsingizni hech qachon kamsitmaydi.', audienceUz: 'Faqat 18+ va bu rejimni o‘zi tanlaganlar', adultOnly: true, examSafe: false, accent: '#e5372b', voice: { pitch: 0.9, rate: 1.08 } },
  { id: 'comedy', name: 'Comedy Friend', nameUz: 'Hazilkash do‘st', descUz: 'Kulib, hazillashib gaplashadi va sizni ko‘proq gapirishga undaydi.', audienceUz: 'Kundalik suhbat mashqi', adultOnly: false, examSafe: false, accent: '#f5b400', voice: { pitch: 1.15, rate: 1.02 } },
  { id: 'debate', name: 'Debate Opponent', nameUz: 'Bahs raqibi', descUz: 'Fikringizga qarshi chiqadi, dalil so‘raydi va zaif mantiqni ko‘rsatadi.', audienceUz: 'B2–C2, fikr bildirish va IELTS Speaking Part 3', adultOnly: false, examSafe: false, accent: '#a855f7', voice: { pitch: 1.0, rate: 1.0 } },
];
export const personaById = (id: string): PersonaInfo | undefined => PERSONAS.find((p) => p.id === id);
