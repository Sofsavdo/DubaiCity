import type { ReadingTest } from './types';

// Original mashq matni (B1 daraja). Rasmiy IELTS materiali emas.
export const reading6: ReadingTest = {
  id: 'reading-6',
  level: 'B1',
  title: 'Reading mini-test 6: Why More People Are Cycling to Work',
  minutes: 12,
  passageTitle: 'Why More People Are Cycling to Work',
  paragraphs: [
    'A. In many cities, the number of people who cycle to work has grown steadily over the last ten years. Some workers say that the main reason is cost. A monthly bus ticket can be expensive, while a bicycle needs only a small amount of money for repairs.',
    'B. Health is another reason. Doctors recommend at least thirty minutes of exercise a day, and many office workers find it difficult to fit that into a busy schedule. Cycling to work solves the problem, because the journey itself becomes exercise. One survey found that cyclists took fewer days off sick than people who drove.',
    'C. However, cycling is not always easy. In cities without separate bicycle lanes, riders share the road with cars and buses, and many people feel unsafe. Bad weather is also a problem: few people enjoy arriving at the office wet and cold.',
    'D. To help, some companies now provide showers and secure places to keep bicycles. A few offer small payments to employees who cycle. City councils are also building new lanes, although progress is often slow because the work is expensive.',
  ],
  groups: [
    { instruction: 'Questions 1–4: Which paragraph contains the following information? Choose the correct letter, A–D.', questionIds: [1, 2, 3, 4] },
    { instruction: 'Questions 5–8: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [5, 6, 7, 8] },
    { instruction: 'Questions 9–10: Complete the sentences. Write ONE WORD ONLY from the passage for each answer.', questionIds: [9, 10] },
  ],
  questions: [
    { id: 1, type: 'match', text: 'a comparison of transport costs', options: ['A', 'B', 'C', 'D'], answer: 0, evidence: 'A compares a bus ticket with bicycle repairs.' },
    { id: 2, type: 'match', text: 'a reference to a survey', options: ['A', 'B', 'C', 'D'], answer: 1, evidence: 'B: "One survey found".' },
    { id: 3, type: 'match', text: 'the problem of sharing roads with cars', options: ['A', 'B', 'C', 'D'], answer: 2, evidence: 'C: "riders share the road with cars and buses".' },
    { id: 4, type: 'match', text: 'ways in which employers help cyclists', options: ['A', 'B', 'C', 'D'], answer: 3, evidence: 'D: showers, secure places and payments.' },
    { id: 5, type: 'tfng', text: 'The number of cyclists in cities has fallen recently.', answer: 'False', evidence: 'A: the number "has grown steadily".' },
    { id: 6, type: 'tfng', text: 'Cyclists took fewer days off sick than drivers.', answer: 'True', evidence: 'B: "cyclists took fewer days off sick".' },
    { id: 7, type: 'tfng', text: 'Most companies provide free bicycles to staff.', answer: 'Not Given', evidence: 'Free bicycles are not mentioned.' },
    { id: 8, type: 'tfng', text: 'Building new bicycle lanes is cheap and quick.', answer: 'False', evidence: 'D: "progress is often slow because the work is expensive".' },
    { id: 9, type: 'fill', text: 'Doctors recommend at least thirty minutes of ______ a day.', answers: ['exercise'], evidence: 'B: "at least thirty minutes of exercise a day".' },
    { id: 10, type: 'fill', text: 'Some companies provide ______ and secure places for bicycles.', answers: ['showers'], evidence: 'D: "provide showers and secure places".' },
  ],
};
