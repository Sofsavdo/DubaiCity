import assert from 'node:assert/strict';
import { RULE_COUNT, autoFix, findIssues, styleIssues } from './grammarCheck';

const fix = (s: string) => autoFix(s);
assert.ok(RULE_COUNT >= 25);
const cases: [string, string][] = [
  ['I am agree with you.', 'I agree with you.'],
  ['She go to school every day.', 'She goes to school every day.'],
  ['My brother play football.', 'My brother plays football.'],
  ['He don\'t like tea.', 'He doesn\'t like tea.'],
  ['This is more better.', 'This is better.'],
  ['We discuss about the problem.', 'We discuss the problem.'],
  ['I have 20 years old.', 'I am 20 years old.'],
  ['Many peoples live here.', 'Many people live here.'],
  ['I need some informations.', 'I need some information.'],
  ['I am boring at home.', 'I am bored at home.'],
  ['I very like football.', 'I really like football.'],
  ['It depends of the weather.', 'It depends on the weather.'],
  ['Please explain me this rule.', 'Please explain to me this rule.'],
  ['I listen music every day.', 'I listen to music every day.'],
  ['She is married with a doctor.', 'She is married to a doctor.'],
  ['There is many students here.', 'There are many students here.'],
  ['I live here since three years.', 'I live here for three years.'],
  ['She is good in English.', 'She is good at english.'],
  ['I am interested on art.', 'I am interested in art.'],
  ['He is afraid from dogs.', 'He is afraid of dogs.'],
  ['I look forward to see you.', 'I look forward to seeing you.'],
  ['We must to leave now.', 'We must leave now.'],
  ['There are much people.', 'There are many people.'],
  ['He didn\'t went home.', 'He didn\'t go home.'],
];
for (const [bad, good] of cases) {
  assert.ok(findIssues(bad).length >= 1, `topilmadi: ${bad}`);
  // 'good in English' kabi holatda qayta yozish katta-kichik harfni o'zgartirishi mumkin: solishtirishda e'tiborsiz
  assert.equal(fix(bad).toLowerCase(), good.toLowerCase(), `tuzatish: ${bad}`);
}
// To'g'ri gaplar tegilmaydi (yolg'on signal yo'q)
for (const ok of ['I agree with you.', 'She goes to school.', 'He doesn\'t like tea.', 'I have two brothers.', 'This is better than that.', 'There are many students here.', 'I am interested in art.', 'People are friendly here.', 'I listen to music.', 'He has a car.', 'She studies law.', 'I live here for three years.', 'I have lived here since 2020.', 'We can discuss the problem.', 'We have two cats.', 'They have a car.', 'You work hard.', 'People like it.', 'My parents live in Samarkand.']) {
  assert.deepEqual(findIssues(ok), [], `yolg‘on signal: ${ok}`);
}
// Tushuntirish bor
assert.ok(findIssues('I am agree.')[0].ruleUz.length > 20);
// Uslub
assert.deepEqual(styleIssues('I like tea.'), []);
assert.ok(styleIssues('i like tea').length >= 3);
assert.ok(styleIssues('Hello .').some((s) => s.includes('bo‘sh joy')));
console.log('grammarCheck.test: OK');
