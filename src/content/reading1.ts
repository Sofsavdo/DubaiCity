import type { ReadingTest } from './types';

// Original mashq matni (xayoliy ma'lumotlar bilan). Rasmiy IELTS materiali emas.
export const reading1: ReadingTest = {
  id: 'reading-1',
  level: 'B1',
  title: 'Reading mini-test 1: The Rise of the Rooftop Garden',
  minutes: 15,
  passageTitle: 'The Rise of the Rooftop Garden',
  paragraphs: [
    'A. In many large cities, the tops of buildings are among the least used spaces. For most of the twentieth century, roofs were treated as simple coverings, designed to keep rain out and little else. In recent decades, however, architects and city planners have begun to see them as an opportunity. Rooftop gardens, once a rare luxury found on a handful of hotels and private homes, are now appearing on schools, hospitals and office blocks around the world.',
    'B. One of the main reasons for this change is heat. Cities are usually warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. Dark surfaces such as asphalt and tar roofing absorb sunlight during the day and release it slowly at night. One study of a North American city suggested that if all suitable roofs were covered with plants, the average summer temperature in the centre could fall by up to two degrees Celsius. On a single building, a green roof can also reduce the cost of cooling the rooms below, because the layer of soil and plants acts as insulation.',
    'C. Water management is a second benefit. In a city, rain that falls on hard surfaces runs quickly into drains, and during heavy storms the drainage system can be overwhelmed, causing floods. A green roof absorbs part of this rainfall and releases it slowly. Studies in several European countries have suggested that a roof with a soil layer of about ten centimetres can keep around half of the yearly rainfall from reaching the drains at all.',
    'D. Rooftop gardens are not only practical. They also create habitats for wildlife. In cities where parks are small and far apart, insects and birds can use roofs as stepping stones between green areas. Some enthusiasts have gone further and placed beehives on rooftops, and honey produced in the middle of a city is now sold in several markets as a local speciality.',
    'E. There are, however, challenges. A green roof is much heavier than a conventional one, so the building must be strong enough to carry the extra load, especially when the soil is wet. Installation typically costs two to three times as much as a normal roof, and the plants need regular watering and weeding. Yet over time the plant layer protects the waterproof membrane from sunlight and sudden changes in temperature. As a result, a green roof may last around forty years, compared with about twenty for a conventional roof.',
    'F. Governments have started to respond. A few cities now require new large buildings with flat roofs to include vegetation, while others simply offer tax reductions to owners who install green roofs. Critics argue that rules which demand plants may be less effective than rules which set targets for cooling or water retention, leaving builders free to choose the best method for each building.',
  ],
  groups: [
    { instruction: 'Questions 1–5: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [1, 2, 3, 4, 5] },
    { instruction: 'Questions 6–9: Complete the sentences. Write NO MORE THAN TWO WORDS from the passage for each answer.', questionIds: [6, 7, 8, 9] },
    { instruction: 'Questions 10–13: Choose the correct answer.', questionIds: [10, 11, 12, 13] },
  ],
  questions: [
    { id: 1, type: 'tfng', text: 'For most of the twentieth century, roofs were designed mainly to keep rain out.', answer: 'True', evidence: 'A: "designed to keep rain out and little else".' },
    { id: 2, type: 'tfng', text: 'The first rooftop gardens were built on hotels.', answer: 'Not Given', evidence: 'A: hotels are mentioned as a place where gardens were found, but nothing says they were the first.' },
    { id: 3, type: 'tfng', text: 'Dark roofing materials release absorbed heat slowly during the night.', answer: 'True', evidence: 'B: "absorb sunlight during the day and release it slowly at night".' },
    { id: 4, type: 'tfng', text: 'A green roof increases the cost of cooling the rooms below it.', answer: 'False', evidence: 'B: a green roof can "reduce the cost of cooling".' },
    { id: 5, type: 'tfng', text: 'Every city has made green roofs compulsory for new buildings.', answer: 'False', evidence: 'F: "A few cities" require them; others only offer tax reductions.' },
    { id: 6, type: 'fill', text: 'Cities are warmer than the countryside because of the urban ______ effect.', answers: ['heat island'], evidence: 'B: "the urban heat island effect".' },
    { id: 7, type: 'fill', text: 'During heavy storms, drainage systems can be overwhelmed, causing ______.', answers: ['floods'], evidence: 'C: "overwhelmed, causing floods".' },
    { id: 8, type: 'fill', text: 'A building with a green roof must be strong enough to carry the extra ______.', answers: ['load'], evidence: 'E: "carry the extra load".' },
    { id: 9, type: 'fill', text: 'The plant layer protects the waterproof ______ from sunlight and temperature changes.', answers: ['membrane'], evidence: 'E: "protects the waterproof membrane".' },
    { id: 10, type: 'mcq', text: 'What is the main purpose of paragraph B?', options: ['To explain how green roofs can help reduce temperatures', 'To compare asphalt with tar', 'To describe studies of rainfall', 'To argue that cities should be cooler'], answer: 0, evidence: 'B is about heat, the heat island effect and cooling.' },
    { id: 11, type: 'mcq', text: 'According to the passage, what is one disadvantage of green roofs?', options: ['They need no maintenance', 'They cost more to install', 'They attract insects', 'They reduce the usable space'], answer: 1, evidence: 'E: "two to three times as much as a normal roof".' },
    { id: 12, type: 'mcq', text: 'How long may a green roof last compared with a conventional roof?', options: ['About the same time', 'Around twice as long', 'Half as long', 'Three times as long'], answer: 1, evidence: 'E: forty years compared with about twenty.' },
    { id: 13, type: 'mcq', text: 'What do critics of rules that demand plants suggest?', options: ['Rules should set targets for performance', 'Rules should be stricter', 'Green roofs should be banned', 'Tax reductions should end'], answer: 0, evidence: 'F: rules should "set targets for cooling or water retention".' },
  ],
};
