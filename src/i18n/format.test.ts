import assert from 'node:assert/strict';
import { LOCALES, defaultSettings, validateSettings, pickLocale } from './settings';
import { plural, missingPluralForms, pluralCategories, formatNumber, formatMoney, formatDate, dayKeyIn } from './format';

// every planned locale is supported by the runtime's Intl data
for (const l of LOCALES) assert.equal(Intl.NumberFormat.supportedLocalesOf([l]).length, 1, `${l} supported`);
// plural categories (verified facts, docs FINAL_ARCHITECTURE_SPEC §5 + kk/ky/tg probe)
for (const l of ['en', 'uz', 'kk', 'ky', 'tg']) assert.deepEqual([...pluralCategories(l)].sort(), ['one', 'other'], l);
assert.deepEqual([...pluralCategories('ru')].sort(), ['few', 'many', 'one', 'other']);
const ru = { one: '{n} слово', few: '{n} слова', many: '{n} слов', other: '{n} слова' };
assert.equal(plural('ru', 1, ru), '1 слово'); assert.equal(plural('ru', 2, ru), '2 слова'); assert.equal(plural('ru', 5, ru), '5 слов'); assert.equal(plural('ru', 21, ru), '21 слово');
assert.deepEqual(missingPluralForms('ru', { one: 'a', other: 'b' }).sort(), ['few', 'many']);
assert.equal(plural('en', 2, { one: '{n} word', other: '{n} words' }), '2 words');
assert.equal(plural('uz', 3, { other: '{n} ta so‘z' }), '3 ta so‘z', 'missing category falls back to other');
// number / money / date
assert.equal(formatNumber('en', 1234567.5), '1,234,567.5');
assert.match(formatNumber('ru', 1234567.5), /^1\s234\s567,5$/);
assert.match(formatMoney('en', 599, 'USD'), /\$5\.99/);
assert.match(formatMoney('en', 7_900_000, 'UZS'), /79,000/); // amounts are minor units (tiyin); decimals come from Intl
assert.match(formatDate('en', Date.UTC(2026, 5, 3, 12), 'Asia/Tashkent'), /June 3, 2026/);
// day keys follow the user's time zone (Tashkent is UTC+5, no DST)
assert.equal(dayKeyIn(Date.UTC(2026, 0, 1, 20, 0), 'Asia/Tashkent'), '2026-01-02');
assert.equal(dayKeyIn(Date.UTC(2026, 0, 1, 20, 0), 'UTC'), '2026-01-01');
for (const z of ['Asia/Tashkent', 'Asia/Almaty', 'Asia/Bishkek', 'Asia/Dushanbe', 'Asia/Ashgabat']) assert.ok(Intl.supportedValuesOf('timeZone').includes(z), z);
// settings
const avail = ['uz'];
assert.equal(pickLocale(['ru-RU', 'uz-UZ'], avail), 'uz'); assert.equal(pickLocale(['de'], ['en', 'uz']), 'en'); assert.equal(pickLocale(['de'], ['uz']), 'uz');
const d = defaultSettings(['kk-KZ'], ['uz', 'en']); assert.deepEqual(d, { interface: 'en', explanation: 'en', learning: 'en', voice: 'en' });
// independence: owner's examples are valid combinations
assert.deepEqual(validateSettings({ interface: 'uz', explanation: 'uz', learning: 'en', voice: 'en' }, ['uz', 'ru', 'en']), []);
assert.deepEqual(validateSettings({ interface: 'ru', explanation: 'kk', learning: 'en', voice: 'en' }, ['uz', 'ru', 'en']), []);
assert.match(validateSettings({ interface: 'kk', explanation: 'uz', learning: 'en', voice: 'en' }, ['uz']).join(), /no catalogue/);
assert.match(validateSettings({ interface: 'uz', explanation: 'uz', learning: 'en', voice: 'uz' as 'en' }, ['uz']).join(), /not verified/);
console.log('format.test: OK');
