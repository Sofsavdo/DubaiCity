import type { ReadingTest } from './types';

export const reading3: ReadingTest = {
  id: 'reading-3',
  title: 'Reading mini-test 3: The Return of the Night Train',
  minutes: 18,
  passageTitle: 'The Return of the Night Train',
  paragraphs: [
    "A. Thirty years ago, an overnight train journey was a normal way to cross Europe. Then budget airlines arrived. With tickets sometimes costing less than a train sandwich, many routes lost passengers, and railway companies cancelled their night services one after another. By the early 2010s, only a handful of sleeper trains were left on the continent.",
    "B. Recently, the picture has begun to change. Growing concern about climate change has led many travellers to look for ways to reduce their carbon footprint, and some now choose not to fly when an alternative exists. Several governments have responded by supporting new night routes, and passenger numbers on the restored services have often been higher than expected.",
    "C. Night trains have clear advantages. Passengers travel from one city centre to another, avoiding long journeys to and from airports. Tickets are not always cheaper than flights, but travellers save the cost of a hotel room, since they sleep on the train. Emissions per passenger are also much lower than on a plane.",
    "D. There are, however, practical problems. Many sleeper carriages are old and uncomfortable, and few factories still build new ones. International journeys are complicated by technical differences: countries use different power systems and signals, so locomotives and drivers often have to change at the border. In addition, companies must pay fees for using the tracks, and night services compete for space with freight trains.",
    "E. Operators are trying to solve the comfort problem. New sleeper cars offer private cabins with their own washbasins and showers, and some companies have ordered dozens of them. Better design, supporters argue, can turn the night train from a cheap necessity into a pleasant experience.",
    "F. Most analysts do not expect trains to replace aeroplanes on very long routes. But on journeys of up to about twelve hours, a night train can leave in the evening and arrive in the morning, and that makes it a realistic competitor. If more investment follows, the sleeper train may become a permanent part of European travel once again.",
  ],
  groups: [
    { instruction: 'Questions 1–4 and 13: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [1, 2, 3, 4, 13] },
    { instruction: 'Questions 5–8: Complete the sentences. Write NO MORE THAN TWO WORDS from the passage for each answer.', questionIds: [5, 6, 7, 8] },
    { instruction: 'Questions 9–12: Choose the correct answer.', questionIds: [9, 10, 11, 12] },
  ],
  questions: [
    { id: 1, type: 'tfng', text: 'Cheap flights contributed to the decline of night trains.', answer: 'True', evidence: 'A: budget airlines took passengers and night services were cancelled.' },
    { id: 2, type: 'tfng', text: 'Night train tickets are always cheaper than flight tickets.', answer: 'False', evidence: 'C: "Tickets are not always cheaper than flights".' },
    { id: 3, type: 'tfng', text: 'All European countries use the same railway signals.', answer: 'False', evidence: 'D: "countries use different power systems and signals".' },
    { id: 4, type: 'tfng', text: 'Some governments are paying for new sleeper carriages.', answer: 'Not Given', evidence: 'B says governments support new routes; payment for carriages is not mentioned.' },
    { id: 5, type: 'fill', text: 'Many travellers want to reduce their ______ by not flying.', answers: ['carbon footprint'], evidence: 'B: "reduce their carbon footprint".' },
    { id: 6, type: 'fill', text: 'Countries use different power systems and ______.', answers: ['signals'], evidence: 'D: "different power systems and signals".' },
    { id: 7, type: 'fill', text: 'New sleeper cars offer private ______ with washbasins and showers.', answers: ['cabins'], evidence: 'E: "private cabins".' },
    { id: 8, type: 'fill', text: 'Night trains can compete on journeys of up to about twelve ______.', answers: ['hours'], evidence: 'F: "up to about twelve hours".' },
    { id: 9, type: 'mcq', text: 'What was the main reason night trains disappeared from many routes?', options: ['Competition from budget airlines', 'Government bans', 'A lack of drivers', 'Frequent accidents'], answer: 0, evidence: 'A: budget airlines and cancellations.' },
    { id: 10, type: 'mcq', text: 'What do passengers save by taking a night train?', options: ['Airport tax', 'The cost of a hotel room', 'Baggage fees', 'The cost of food'], answer: 1, evidence: 'C: "save the cost of a hotel room".' },
    { id: 11, type: 'mcq', text: 'Which technical problem is mentioned for international journeys?', options: ['Narrow tracks', 'Too few stations', 'Different power systems and signals', 'Lack of fuel'], answer: 2, evidence: 'D: different power systems and signals.' },
    { id: 12, type: 'mcq', text: 'How does the writer describe the future of night trains?', options: ['They will replace all short flights', 'They can compete on medium-length journeys', 'They will soon disappear again', 'They are only for tourists'], answer: 1, evidence: 'F: "a realistic competitor" on journeys up to about twelve hours.' },
    { id: 13, type: 'tfng', text: 'Night trains will soon replace aeroplanes on very long routes.', answer: 'False', evidence: 'F: analysts "do not expect trains to replace aeroplanes on very long routes".' },
  ],
};
