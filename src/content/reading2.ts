import type { ReadingTest } from './types';

const headings = [
  'i. A surprising level of activity',
  'ii. Why teenagers struggle',
  'iii. Strengthening what we have learned',
  'iv. The cost of light at night',
  'v. Physical repair and protection',
  'vi. Differences between individuals and limits to recovery',
  'vii. The history of sleep research',
];

export const reading2: ReadingTest = {
  id: 'reading-2',
  level: 'C1',
  title: 'Reading mini-test 2: The Hidden Work of Sleep',
  minutes: 18,
  passageTitle: 'The Hidden Work of Sleep',
  paragraphs: [
    'A. For centuries, sleep was seen as a passive state, a kind of switching off that the body needed in order to recover. Modern research has shown the opposite. Brain scans reveal that during the night the brain passes through several cycles, and in some of them it is almost as active as when we are awake. Far from being idle, the sleeping brain is busy with tasks that cannot be done during the day.',
    'B. One of these tasks is memory. During deep sleep the brain replays the events of the day, moving information from short-term memory to long-term storage. In one experiment, two groups of students studied the same list of words. The group that slept after studying remembered considerably more words the next morning than the group that stayed awake. Sleep, it seems, does not just preserve what we learn; it makes it stronger.',
    'C. The body also uses the night to repair itself. Growth hormone is released mostly during deep sleep, helping muscles and tissues to recover. The immune system is active too: people who regularly sleep for fewer than six hours are more likely to catch a cold than those who sleep for eight. Doctors now regard sleep as one of the basic protections for health, alongside food and exercise.',
    'D. Teenagers face a particular problem. During puberty the body clock shifts, so that young people naturally feel sleepy later in the evening and wake later in the morning. Yet most schools begin early. When some schools moved the start of lessons back by one hour, attendance improved, students reported better moods, and the number of road accidents involving young drivers fell.',
    'E. Modern life makes good sleep harder. Artificial light in the evening, and especially the blue light from phones and tablets, delays the release of melatonin, the hormone that tells the body it is time to sleep. Experts advise keeping a regular schedule, sleeping in a dark room and avoiding screens for an hour before bed.',
    'F. However, sleep is not the same for everyone. Most adults need between seven and nine hours, but some people function well on slightly less, and others need more. Sleeping late at weekends can reduce the effects of a short week, but it only partly makes up for lost sleep. Researchers stress that regular, sufficient sleep cannot simply be stored up or caught up later.',
  ],
  groups: [
    { instruction: 'Questions 1–6: The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings.', questionIds: [1, 2, 3, 4, 5, 6] },
    { instruction: 'Questions 7–10: Complete the sentences. Write ONE WORD ONLY from the passage for each answer.', questionIds: [7, 8, 9, 10] },
    { instruction: 'Questions 11–13: Do the following statements agree with the information in the passage? Choose TRUE, FALSE or NOT GIVEN.', questionIds: [11, 12, 13] },
  ],
  questions: [
    { id: 1, type: 'match', text: 'Paragraph A', options: headings, answer: 0, evidence: 'A: the sleeping brain is "almost as active as when we are awake".' },
    { id: 2, type: 'match', text: 'Paragraph B', options: headings, answer: 2, evidence: 'B: sleep "makes it stronger" (memory).' },
    { id: 3, type: 'match', text: 'Paragraph C', options: headings, answer: 4, evidence: 'C: growth hormone, tissue repair and the immune system.' },
    { id: 4, type: 'match', text: 'Paragraph D', options: headings, answer: 1, evidence: 'D: the teenage body clock shifts but schools begin early.' },
    { id: 5, type: 'match', text: 'Paragraph E', options: headings, answer: 3, evidence: 'E: artificial and blue light delay melatonin.' },
    { id: 6, type: 'match', text: 'Paragraph F', options: headings, answer: 5, evidence: 'F: needs differ, and lost sleep is only partly made up.' },
    { id: 7, type: 'fill', text: 'During deep sleep, information is moved from short-term memory to long-term ______.', answers: ['storage'], evidence: 'B: "long-term storage".' },
    { id: 8, type: 'fill', text: 'People who sleep fewer than six hours are more likely to catch a ______.', answers: ['cold'], evidence: 'C: "more likely to catch a cold".' },
    { id: 9, type: 'fill', text: 'When lessons started an hour later, school ______ improved.', answers: ['attendance'], evidence: 'D: "attendance improved".' },
    { id: 10, type: 'fill', text: 'Blue light from screens delays the release of ______.', answers: ['melatonin'], evidence: 'E: "delays the release of melatonin".' },
    { id: 11, type: 'tfng', text: 'Most adults need between seven and nine hours of sleep.', answer: 'True', evidence: 'F: "Most adults need between seven and nine hours".' },
    { id: 12, type: 'tfng', text: 'Teenagers naturally feel sleepy earlier in the evening than adults.', answer: 'False', evidence: 'D: they feel sleepy later in the evening.' },
    { id: 13, type: 'tfng', text: 'Short naps during the day improve exam results.', answer: 'Not Given', evidence: 'Naps are not mentioned anywhere in the passage.' },
  ],
};
