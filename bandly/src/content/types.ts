export type Question =
  | { id: number; type: 'tfng'; text: string; answer: 'True' | 'False' | 'Not Given'; evidence: string }
  | { id: number; type: 'mcq'; text: string; options: string[]; answer: number; evidence: string }
  | { id: number; type: 'fill'; text: string; answers: string[]; evidence: string }
  /** Moslashtirish: ro'yxatdan (sarlavha, abzats harfi) to'g'ri variantni tanlash */
  | { id: number; type: 'match'; text: string; options: string[]; answer: number; evidence: string };

export interface ReadingTest {
  id: string;
  title: string;
  minutes: number;
  passageTitle: string;
  paragraphs: string[];
  groups: { instruction: string; questionIds: number[] }[];
  questions: Question[];
}

export interface ListeningTest {
  id: string;
  title: string;
  minutes: number;
  context: string;
  /** Ekranda ko'rsatiladigan ismlar (transkript uchun) */
  names: { A: string; B?: string };
  script: { speaker: 'A' | 'B'; text: string }[];
  groups: { instruction: string; questionIds: number[] }[];
  questions: Question[];
}

export interface GrammarItem {
  id: number;
  topic: string;
  q: string;
  options: string[];
  answer: number;
  explanationUz: string;
}
