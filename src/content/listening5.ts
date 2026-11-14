import type { ListeningTest } from './types';

// Original mashq matni (A2 daraja). Rasmiy IELTS materiali emas.
const lines: { speaker: 'A' | 'B'; text: string }[] = [
  { speaker: 'A', text: 'Good morning. Sunrise Hotel. How can I help you?' },
  { speaker: 'B', text: 'Hello. I would like to book a room for two nights, please.' },
  { speaker: 'A', text: 'Of course. When would you like to arrive?' },
  { speaker: 'B', text: 'On the twelfth of June. So I will leave on the fourteenth.' },
  { speaker: 'A', text: 'Certainly. Would you like a single room or a double room?' },
  { speaker: 'B', text: 'A single room, please. How much is it?' },
  { speaker: 'A', text: 'A single room is forty five pounds a night. Breakfast is included.' },
  { speaker: 'B', text: 'That sounds good. Is there a lift? I have a lot of luggage.' },
  { speaker: 'A', text: 'Yes, there is a lift. Your room will be on the third floor.' },
  { speaker: 'B', text: 'Great. Can I pay by card?' },
  { speaker: 'A', text: 'Yes, you can pay by card when you arrive. May I have your name, please?' },
  { speaker: 'B', text: 'My name is Karim Aliev. That is K, A, R, I, M. Aliev, A, L, I, E, V.' },
  { speaker: 'A', text: 'Thank you, Mr Aliev. And a phone number, please?' },
  { speaker: 'B', text: 'It is oh seven seven, one two three, nine eight six.' },
  { speaker: 'A', text: 'Thank you. Your booking is confirmed. We look forward to seeing you.' },
];

export const listening5: ListeningTest = {
  id: 'listening-5',
  level: 'A2',
  title: 'Listening mini-test 5: Booking a hotel room',
  minutes: 6,
  names: { A: 'Receptionist', B: 'Karim' },
  context: 'Mehmonxonada xona band qilish bo‘yicha qisqa telefon suhbati (A2 daraja).',
  script: lines,
  groups: [
    { instruction: 'Questions 1–6: Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.', questionIds: [1, 2, 3, 4, 5, 6] },
    { instruction: 'Questions 7–8: Choose the correct letter.', questionIds: [7, 8] },
  ],
  questions: [
    { id: 1, type: 'fill', text: 'Arrival date: ______ June', answers: ['12', 'twelve', '12th', 'twelfth'], evidence: '"On the twelfth of June".' },
    { id: 2, type: 'fill', text: 'Number of nights: ______', answers: ['2', 'two'], evidence: '"for two nights".' },
    { id: 3, type: 'fill', text: 'Price of a single room: ______ pounds a night', answers: ['45', 'forty five', 'forty-five'], evidence: '"forty five pounds a night".' },
    { id: 4, type: 'fill', text: 'The room is on the ______ floor', answers: ['third', '3rd', '3'], evidence: '"on the third floor".' },
    { id: 5, type: 'fill', text: 'Family name: ______', answers: ['aliev'], evidence: '"Aliev, A, L, I, E, V".' },
    { id: 6, type: 'fill', text: 'Phone number: 077 123 ______', answers: ['986', 'nine eight six'], evidence: '"one two three, nine eight six".' },
    { id: 7, type: 'mcq', text: 'What type of room does Karim book?', options: ['A double room', 'A single room', 'A family room'], answer: 1, evidence: '"A single room, please."' },
    { id: 8, type: 'mcq', text: 'How will he pay?', options: ['By card', 'In cash', 'By bank transfer'], answer: 0, evidence: '"you can pay by card when you arrive".' },
  ],
};
