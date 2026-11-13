export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  title: string;
  prompt: string;
  table?: { head: string[]; rows: string[][] };
  minWords: number;
  minutes: number;
}

export const writingPrompts: WritingPrompt[] = [
  {
    id: 'w1-internet',
    task: 1,
    title: 'Task 1: Internet access',
    prompt: 'The table shows the percentage of households with internet access in three countries in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    table: { head: ['Country', '2010', '2020'], rows: [['Country A', '45%', '88%'], ['Country B', '30%', '75%'], ['Country C', '62%', '91%']] },
    minWords: 150,
    minutes: 20,
  },
  {
    id: 'w1-transport',
    task: 1,
    title: 'Task 1: Commuting methods',
    prompt: 'The table shows how people in one city travelled to work in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    table: { head: ['Method', '2000', '2020'], rows: [['Car', '55%', '40%'], ['Bus', '25%', '22%'], ['Bicycle', '5%', '18%'], ['Walking', '15%', '20%']] },
    minWords: 150,
    minutes: 20,
  },
  { id: 'w2-tech', task: 2, title: 'Task 2: Technology and communication', prompt: 'Some people think that modern technology has made communication between people worse. To what extent do you agree or disagree?', minWords: 250, minutes: 40 },
  { id: 'w2-work', task: 2, title: 'Task 2: Working from home', prompt: 'More and more people now work from home. Discuss the advantages and disadvantages of this trend and give your own opinion.', minWords: 250, minutes: 40 },
  { id: 'w2-edu', task: 2, title: 'Task 2: University education', prompt: 'Some people believe that university education should be free for everyone, while others think students should pay. Discuss both views and give your own opinion.', minWords: 250, minutes: 40 },
  { id: 'w2-city', task: 2, title: 'Task 2: Living in cities', prompt: 'In many countries, more people are moving to big cities. What are the causes of this, and what problems can it create?', minWords: 250, minutes: 40 },
  { id: 'w2-env', task: 2, title: 'Task 2: Environment', prompt: 'Some people say that individuals can do little to protect the environment and that only governments can solve the problem. To what extent do you agree or disagree?', minWords: 250, minutes: 40 },
];

export const linkingWords = [
  'however', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'for example',
  'for instance', 'on the other hand', 'in contrast', 'as a result', 'in conclusion', 'to conclude',
  'although', 'while', 'whereas', 'despite', 'firstly', 'secondly', 'finally', 'overall',
];
