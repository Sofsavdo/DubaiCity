import type { Word } from './vocab';

// Words introduced in General English lessons (src/content/lessons) that were not yet in the app word list.
// Definitions and examples are original. They join the shared SRS deck and word games.
const g = (word: string, pos: string, uz: string, def: string, example: string, level: Word['level']): Word =>
  ({ id: `gl-${word.toLowerCase().replace(/[^a-z]+/g, '-')}`, word, pos, uz, def, example, topic: 'General English', level });

export const lessonWords: Word[] = [
  g('name', 'n', 'ism', 'the word that a person is called by', 'My name is Aziz.', 'A1'),
  g('student', 'n', 'talaba', 'a person who is studying at a school or university', 'She is a student at Tashkent State University.', 'A1'),
  g('from', 'prep', '…dan (joy)', 'used to say where someone was born or lives', 'I am from Namangan.', 'A1'),
  g('engineer', 'n', 'muhandis', 'a person who designs or builds machines, roads or buildings', 'My father is an engineer.', 'A1'),
  g('nurse', 'n', 'hamshira', 'a person whose job is to care for sick people', 'Her sister works as a nurse.', 'A1'),
  g('driver', 'n', 'haydovchi', 'a person who drives a car, bus or taxi as a job', 'The bus driver was very friendly.', 'A1'),
  g('cook', 'n', 'oshpaz', 'a person who prepares food', 'He is a cook in a small café.', 'A1'),
  g('have breakfast', 'phr', 'nonushta qilmoq', 'to eat the first meal of the day', 'We have breakfast at eight.', 'A1'),
  g('go to work', 'phr', 'ishga bormoq', 'to travel to the place where you work', 'I go to work by metro.', 'A1'),
  g('usually', 'adv', 'odatda', 'in most cases; most of the time', 'I usually drink tea in the morning.', 'A1'),
  g('yesterday', 'adv', 'kecha', 'on the day before today', 'I called my grandmother yesterday.', 'A2'),
  g('last weekend', 'phr', 'o‘tgan dam olish kunlari', 'the Saturday and Sunday before this week', 'Last weekend we visited the mountains.', 'A2'),
  g('ago', 'adv', '… oldin', 'before now (used after a period of time)', 'We moved here two years ago.', 'A2'),
  g('price', 'n', 'narx', 'the amount of money you pay for something', 'The price of bread has gone up.', 'A2'),
  g('change', 'n', 'qaytim', 'the money you get back when you pay more than the price', 'Here is your change.', 'A2'),
  g('ever', 'adv', 'hech (qachon) — savolda', 'at any time (in questions)', 'Have you ever been to Khiva?', 'B1'),
  g('never', 'adv', 'hech qachon', 'not at any time', 'I have never seen the sea.', 'B1'),
  g('abroad', 'adv', 'chet elda', 'in or to another country', 'She wants to study abroad.', 'B1'),
  g('announce', 'v', 'e’lon qilmoq', 'to tell people something officially', 'The results will be announced on Friday.', 'B2'),
  g('build', 'v', 'qurmoq', 'to make a building or structure (past: built)', 'The bridge was built in 1975.', 'B2'),
  g('arrest', 'v', 'hibsga olmoq', 'when the police take someone because of a crime', 'Two men were arrested last night.', 'B2'),
];
