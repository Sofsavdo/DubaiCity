import type { ListeningTest } from './types';

const text = [
  "Welcome to Greenfield Public Library. I'm going to give you a short introduction before you start exploring.",
  "First, our opening hours. We are open from nine in the morning until eight in the evening, Monday to Friday. On Saturdays we open later, at ten, and close at four. We are closed on Sundays.",
  "Joining the library is free for all residents. To join, you will need to bring proof of address, such as a bank letter or a utility bill. A passport is not enough, because it does not show where you live.",
  "The children's section is on the first floor, next to the cafe. The ground floor has newspapers and the main book collection.",
  "We have twelve public computers. Each session lasts sixty minutes, and you can extend it if nobody is waiting. Printing used to cost fifteen pence a page, but from this month it is ten pence.",
  "If you need somewhere quiet to study, there is a study room on the second floor. You cannot just walk in, though. You must book it at the main desk, and bookings are for two hours.",
  "Books can be borrowed for three weeks. If you return a book late, there is a charge of twenty pence per day. There is also a return box outside the main entrance, which is open twenty-four hours.",
  "Finally, free wireless internet is available throughout the building. The password is readmore, all one word, with no capital letters. Thank you, and enjoy your visit.",
];

export const listening2: ListeningTest = {
  id: 'listening-2',
  level: 'B1',
  title: 'Listening mini-test 2: Library introduction',
  minutes: 8,
  names: { A: 'Librarian' },
  context: 'Greenfield Public Library: yangi a’zolar uchun qisqa tanishtiruv (monolog).',
  script: text.map((t) => ({ speaker: 'A' as const, text: t })),
  groups: [
    { instruction: 'Questions 1–8: Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.', questionIds: [1, 2, 3, 4, 5, 6, 7, 8] },
    { instruction: 'Questions 9–10: Choose the correct letter.', questionIds: [9, 10] },
  ],
  questions: [
    { id: 1, type: 'fill', text: 'Saturday opening time: ______ am', answers: ['10', 'ten'], evidence: '"On Saturdays we open later, at ten".' },
    { id: 2, type: 'fill', text: 'The library is closed on ______', answers: ['sunday', 'sundays'], evidence: '"We are closed on Sundays".' },
    { id: 3, type: 'fill', text: 'To join, bring proof of ______', answers: ['address'], evidence: '"proof of address".' },
    { id: 4, type: 'fill', text: 'Computer session length: ______ minutes', answers: ['60', 'sixty'], evidence: '"Each session lasts sixty minutes".' },
    { id: 5, type: 'fill', text: 'Printing now costs ______ pence per page', answers: ['10', 'ten'], evidence: 'The old price was fifteen; "from this month it is ten pence".' },
    { id: 6, type: 'fill', text: 'Study room is on the ______ floor', answers: ['second', '2nd', '2'], evidence: '"a study room on the second floor".' },
    { id: 7, type: 'fill', text: 'Late fee: ______ pence per day', answers: ['20', 'twenty'], evidence: '"twenty pence per day".' },
    { id: 8, type: 'fill', text: 'Wi-Fi password: ______', answers: ['readmore'], evidence: '"The password is readmore".' },
    { id: 9, type: 'mcq', text: 'Where is the children’s section?', options: ['On the ground floor', 'On the first floor', 'On the second floor'], answer: 1, evidence: '"The children’s section is on the first floor".' },
    { id: 10, type: 'mcq', text: 'How can visitors use the study room?', options: ['Walk in at any time', 'Book at the main desk', 'Book online only'], answer: 1, evidence: '"You must book it at the main desk".' },
  ],
};
