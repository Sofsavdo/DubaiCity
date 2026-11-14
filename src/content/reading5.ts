import type { ReadingTest } from './types';

// Original mashq matni (A2 daraja). Rasmiy IELTS materiali emas.
export const reading5: ReadingTest = {
  id: 'reading-5',
  level: 'A2',
  title: 'Reading mini-test 5: A Saturday at the Market',
  minutes: 10,
  passageTitle: 'A Saturday at the Market',
  paragraphs: [
    'A. Every Saturday, Dilnoza goes to the big market in her town with her mother. They leave home at seven in the morning because the market is busy after nine. They go by bus, and the ride takes about twenty minutes.',
    'B. First, they buy vegetables and fruit. Dilnoza likes red apples and sweet grapes, but her mother always buys tomatoes and onions first. The prices are lower at the market than in the supermarket, so many families shop there.',
    'C. Next, they visit the bread section. A man called Rustam sells fresh bread from a traditional oven. He starts baking at five o’clock, and by eight the best bread is usually finished. Dilnoza always eats a small piece while it is still hot.',
    'D. At eleven o’clock, they have tea and a snack at a small cafe near the entrance. Then they carry the heavy bags to the bus stop. Dilnoza is tired when she gets home, but she says the market is the best part of her week.',
  ],
  groups: [
    { instruction: 'Questions 1–5: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [1, 2, 3, 4, 5] },
    { instruction: 'Questions 6–8: Choose the correct letter.', questionIds: [6, 7, 8] },
    { instruction: 'Questions 9–10: Complete the sentences. Write ONE WORD ONLY from the passage for each answer.', questionIds: [9, 10] },
  ],
  questions: [
    { id: 1, type: 'tfng', text: 'Dilnoza goes to the market every Saturday.', answer: 'True', evidence: 'A: "Every Saturday, Dilnoza goes to the big market".' },
    { id: 2, type: 'tfng', text: 'The market is quiet after nine o’clock.', answer: 'False', evidence: 'A: "the market is busy after nine".' },
    { id: 3, type: 'tfng', text: 'Prices at the market are lower than in the supermarket.', answer: 'True', evidence: 'B: "The prices are lower at the market".' },
    { id: 4, type: 'tfng', text: 'Rustam has a shop in the city centre.', answer: 'Not Given', evidence: 'The text does not say where else Rustam works.' },
    { id: 5, type: 'tfng', text: 'Dilnoza feels tired when she gets home.', answer: 'True', evidence: 'D: "Dilnoza is tired when she gets home".' },
    { id: 6, type: 'mcq', text: 'How do Dilnoza and her mother travel to the market?', options: ['By bus', 'By car', 'On foot'], answer: 0, evidence: 'A: "They go by bus".' },
    { id: 7, type: 'mcq', text: 'What does Dilnoza’s mother buy first?', options: ['Apples and grapes', 'Tomatoes and onions', 'Fresh bread'], answer: 1, evidence: 'B: "her mother always buys tomatoes and onions first".' },
    { id: 8, type: 'mcq', text: 'Where do they have tea?', options: ['At home', 'At the bus stop', 'At a small cafe'], answer: 2, evidence: 'D: "tea and a snack at a small cafe near the entrance".' },
    { id: 9, type: 'fill', text: 'They leave home at ______ in the morning.', answers: ['seven'], evidence: 'A: "They leave home at seven".' },
    { id: 10, type: 'fill', text: 'Dilnoza eats a piece of bread while it is still ______.', answers: ['hot'], evidence: 'C: "while it is still hot".' },
  ],
};
