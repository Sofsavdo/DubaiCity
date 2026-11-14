import assert from 'node:assert/strict';
import { availableLangs, dicts, setLang, t, translate } from './index';
import { uz } from './uz';

assert.equal(t('nav.exam'), 'Imtihon');
assert.equal(t('greet.progress', { n: 3 }), '3 ta qoldi');
assert.equal(translate('uz', 'greet.progress'), '{n} ta qoldi', 'berilmagan o‘zgaruvchi joyida qoladi');
// Yetishmagan kalit asosiy tilga tushadi
dicts.xx = { 'nav.exam': 'Exam' };
assert.equal(translate('xx', 'nav.exam'), 'Exam');
assert.equal(translate('xx', 'nav.games'), uz['nav.games']);
delete dicts.xx;
// Noma'lum tilga o'tib bo'lmaydi
setLang('zz'); assert.equal(t('nav.exam'), 'Imtihon');
// Har bir qo'shilgan til to'liq bo'lishi shart (hozircha faqat uz)
for (const l of availableLangs()) {
  const missing = (Object.keys(uz) as (keyof typeof uz)[]).filter((k) => !dicts[l][k]);
  assert.deepEqual(missing, [], `${l}: tarjima qilinmagan kalitlar`);
  // O'zgaruvchilar ({n}) barcha tillarda bir xil
  for (const k of Object.keys(uz) as (keyof typeof uz)[]) {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
    assert.equal(vars(dicts[l][k] as string), vars(uz[k]), `${l}: ${k} o‘zgaruvchilari mos emas`);
  }
}
console.log('i18n.test: OK');
