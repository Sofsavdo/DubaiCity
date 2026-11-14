import type { Item } from './lessons/types';
import type { Cefr } from '../lib/levels';
import { ch } from './lessons/helpers';

// Skill check (pilot): one short reading text and one short listening monologue per band. Original texts written for Bandly.
// Purpose: estimate Reading and Listening separately from the grammar/vocabulary placement. Results are estimates, not certified levels.
export interface SkillSet {
  level: Cefr;
  reading: { title: string; text: string; questions: Item[] };
  listening: { title: string; script: string; questions: Item[] };
}

export const SKILL_SETS: SkillSet[] = [
  {
    level: 'A2',
    reading: {
      title: 'A message from Lola',
      text: 'Hi Dilshod! I’m writing from Samarkand. We arrived on Friday evening by the fast train. The journey took only two hours. Our hotel is small but very clean, and it is near the Registan. On Saturday we visited three old madrasas and had lunch in a traditional café. The plov was delicious, but the tea was too sweet for me! Tomorrow we are going to the Siab Bazaar to buy some dried fruit for my grandmother. We are coming back on Monday morning. See you at work on Tuesday. Lola',
      questions: [
        ch('How did Lola travel to Samarkand?', ['By bus', 'By train', 'By car'], 1, 'Matnda: “by the fast train”.'),
        ch('What does Lola say about the hotel?', ['It is big and modern.', 'It is clean and near the Registan.', 'It is far from the centre.'], 1, '“small but very clean, and it is near the Registan”.'),
        ch('What didn’t Lola like?', ['The plov', 'The tea', 'The madrasas'], 1, '“the tea was too sweet for me”.'),
        ch('When will Lola see Dilshod?', ['On Monday', 'On Tuesday', 'On Saturday'], 1, '“See you at work on Tuesday.”'),
      ],
    },
    listening: {
      title: 'At the information desk',
      script: 'Good morning, and welcome to the city museum. The museum is open every day from nine a.m. to six p.m., but it is closed on Mondays. Tickets cost twenty thousand som for adults and ten thousand for students. Please show your student card at the desk. The café is on the second floor, and the toilets are next to the main entrance. Photos are allowed, but please do not use the flash. Enjoy your visit!',
      questions: [
        ch('When is the museum closed?', ['On Sundays', 'On Mondays', 'Every evening after five'], 1, '“it is closed on Mondays”.'),
        ch('How much is a student ticket?', ['10,000 som', '20,000 som', '12,000 som'], 0, '“ten thousand for students”.'),
        ch('Where is the café?', ['Next to the entrance', 'On the second floor', 'Outside the museum'], 1, '“The café is on the second floor”.'),
        ch('What is NOT allowed?', ['Taking photos', 'Using the flash', 'Visiting the café'], 1, '“do not use the flash”.'),
      ],
    },
  },
  {
    level: 'B1',
    reading: {
      title: 'Learning on the move',
      text: 'More and more people in Tashkent are using their daily journey to learn something new. According to a small survey by a local university, almost half of metro passengers listen to podcasts or audiobooks on their way to work. Many of them say this is the only free time they have during the day. However, not everyone finds it easy. Some passengers complain that the trains are too noisy in the morning, so they prefer reading short articles instead. The researchers also found that people who studied for at least fifteen minutes a day were more likely to continue for several months than those who studied for an hour once a week. Their advice is simple: small, regular sessions work better than long, irregular ones.',
      questions: [
        ch('What do almost half of metro passengers do?', ['Read newspapers', 'Listen to podcasts or audiobooks', 'Talk to other passengers'], 1, '“almost half … listen to podcasts or audiobooks”.'),
        ch('Why do some passengers prefer reading?', ['Because reading is cheaper', 'Because the trains are noisy in the morning', 'Because they have more time'], 1, '“trains are too noisy in the morning, so they prefer reading”.'),
        ch('Who was more likely to continue studying?', ['People who studied one hour a week', 'People who studied at least 15 minutes a day', 'People who studied only at weekends'], 1, '“at least fifteen minutes a day were more likely to continue”.'),
        ch('What is the main message of the text?', ['Long sessions are best.', 'Short, regular study is more effective.', 'The metro is not a good place to learn.'], 1, '“small, regular sessions work better”.'),
      ],
    },
    listening: {
      title: 'A change of plan',
      script: 'Hi everyone, it’s Kamila from the travel club. I’m afraid there’s a change to Saturday’s trip. We were planning to visit the Chimgan mountains, but the weather forecast says there will be heavy snow, and the road might be closed. So instead, we’re going to visit the botanical garden and then have lunch together in the city. We’ll meet at ten o’clock, not at seven, so you can sleep a bit longer. If you’ve already paid for the bus, don’t worry — you’ll get your money back next week. Please reply to this message if you can’t come.',
      questions: [
        ch('Why has the plan changed?', ['The bus is broken.', 'Heavy snow is expected.', 'Not enough people signed up.'], 1, '“there will be heavy snow, and the road might be closed”.'),
        ch('Where will the group go instead?', ['To a museum', 'To the botanical garden', 'To another mountain'], 1, '“we’re going to visit the botanical garden”.'),
        ch('What time will they meet?', ['At seven', 'At ten', 'At noon'], 1, '“We’ll meet at ten o’clock, not at seven”.'),
        ch('What will happen to the bus money?', ['It will be used next month.', 'It will be returned next week.', 'It will not be returned.'], 1, '“you’ll get your money back next week”.'),
      ],
    },
  },
  {
    level: 'B2',
    reading: {
      title: 'The four-day week',
      text: 'Several companies in Europe and Asia have experimented with a four-day working week, and the early results appear promising. In one large trial, employees worked eighty per cent of their usual hours for the same salary, provided that they maintained their productivity. Most firms reported that output stayed the same or even improved, while staff took fewer sick days and reported lower levels of stress. Critics, however, point out that the model may not suit every sector. Hospitals, schools and shops, for instance, need staff to be present at fixed times, so reducing hours could simply mean hiring more people. Others argue that the benefits may fade once the novelty wears off. Supporters respond that the real lesson is not the number of days but the way work is organised: fewer meetings and clearer priorities could help even companies that keep a five-day week.',
      questions: [
        ch('In the trial, what condition did employees have to meet?', ['Work longer days', 'Keep the same productivity', 'Accept a lower salary'], 1, '“provided that they maintained their productivity”.'),
        ch('Which result is mentioned?', ['Higher salaries', 'Fewer sick days', 'More meetings'], 1, '“staff took fewer sick days”.'),
        ch('Why might the model not suit hospitals and schools?', ['Staff need to be present at fixed times.', 'Their staff are already stressed.', 'They are too small.'], 0, '“need staff to be present at fixed times”.'),
        ch('According to supporters, what is the “real lesson”?', ['Everyone should work four days.', 'How work is organised matters most.', 'Companies should hire more people.'], 1, '“the real lesson is not the number of days but the way work is organised”.'),
      ],
    },
    listening: {
      title: 'A short talk on sleep',
      script: 'Today I want to challenge a common belief: that we can “catch up” on sleep at the weekend. Many students sleep five or six hours on weekdays and then twelve hours on Saturday, hoping to repay the debt. Recent studies suggest this only partly works. Weekend sleep may reduce tiredness for a day or two, but it doesn’t fully restore concentration or memory, and an irregular schedule can actually make it harder to fall asleep on Sunday night. The researchers’ recommendation is less exciting but more effective: keep roughly the same bedtime every day, and if you must lose sleep, try a short nap of twenty minutes in the early afternoon rather than a long lie-in.',
      questions: [
        ch('What belief does the speaker challenge?', ['That naps are harmful', 'That weekend sleep can repay sleep debt', 'That students sleep too much'], 1, '“that we can catch up on sleep at the weekend”.'),
        ch('What does weekend sleep fail to restore fully?', ['Appetite', 'Concentration and memory', 'Physical strength'], 1, '“doesn’t fully restore concentration or memory”.'),
        ch('What problem can an irregular schedule cause?', ['Difficulty falling asleep on Sunday night', 'Headaches on Monday', 'Eating too much'], 0, '“harder to fall asleep on Sunday night”.'),
        ch('What does the speaker recommend?', ['Sleeping twelve hours at weekends', 'A consistent bedtime and short naps', 'Studying late at night'], 1, '“keep roughly the same bedtime … a short nap of twenty minutes”.'),
      ],
    },
  },
];
