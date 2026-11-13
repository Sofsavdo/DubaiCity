import type { ListeningTest } from './types';

const parts = [
  "Today I'd like to talk about urban beekeeping. Over the last decade, the number of hives in cities has increased rapidly, and many people are surprised to hear that city bees often produce more honey than bees in the countryside.",
  "There are two main reasons for this. The first is variety. Parks, gardens and even balconies provide flowers throughout the season, whereas farmland may offer a single crop for only a few weeks. The second is temperature. Cities are warmer, so bees can begin collecting food earlier in the spring.",
  "Let me give you some figures. In summer, a typical hive contains around fifty thousand bees. An individual worker bee lives for only about six weeks. In a good location, one hive can produce an average of twenty kilograms of honey a year.",
  "Of course, there are challenges. Neighbours may worry about stings, so hives in cities are usually placed on rooftops, at least three metres above the ground, or behind a tall fence.",
  "Another problem is competition. If there are too many hives in one area, the bees compete for nectar, and wild bees can suffer. Experts therefore recommend no more than about five hives per square kilometre.",
  "Finally, people sometimes ask whether city honey is safe. It is regularly tested for pollution, and the results show that it is generally safe to eat. Thank you for listening.",
];

export const listening4: ListeningTest = {
  id: 'listening-4',
  title: 'Listening mini-test 4: Urban beekeeping (lecture)',
  minutes: 9,
  names: { A: 'Lecturer' },
  context: 'Ma’ruza: shahar asalarichiligi.',
  script: parts.map((t) => ({ speaker: 'A' as const, text: t })),
  groups: [{ instruction: 'Questions 1–10: Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.', questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }],
  questions: [
    { id: 1, type: 'fill', text: 'The number of hives in cities has increased ______', answers: ['rapidly'], evidence: '"has increased rapidly".' },
    { id: 2, type: 'fill', text: 'One reason for more honey: a ______ of flowers', answers: ['variety'], evidence: '"The first is variety".' },
    { id: 3, type: 'fill', text: 'Cities are ______ than the countryside', answers: ['warmer'], evidence: '"Cities are warmer".' },
    { id: 4, type: 'fill', text: 'A summer hive has around ______ bees', answers: ['50000', 'fiftythousand'], evidence: '"around fifty thousand bees".' },
    { id: 5, type: 'fill', text: 'A worker bee lives about ______ weeks', answers: ['6', 'six'], evidence: '"about six weeks".' },
    { id: 6, type: 'fill', text: 'Honey per hive per year: ______ kg', answers: ['20', 'twenty'], evidence: '"twenty kilograms of honey a year".' },
    { id: 7, type: 'fill', text: 'Hives are placed at least ______ metres above the ground', answers: ['3', 'three'], evidence: '"at least three metres above the ground".' },
    { id: 8, type: 'fill', text: 'Too many hives: bees compete for ______', answers: ['nectar'], evidence: '"the bees compete for nectar".' },
    { id: 9, type: 'fill', text: 'Maximum recommended: ______ hives per square kilometre', answers: ['5', 'five'], evidence: '"no more than about five hives per square kilometre".' },
    { id: 10, type: 'fill', text: 'City honey is regularly tested for ______', answers: ['pollution'], evidence: '"tested for pollution".' },
  ],
};
