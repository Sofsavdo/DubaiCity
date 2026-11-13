import { BRAND } from '../brand';

const tiles = [
  { href: '#/reading', title: 'Reading mock', text: 'Matn, 13 ta savol, taymer, avtomatik baholash' },
  { href: '#/listening', title: 'Listening mock', text: 'Audio suhbat, forma va test savollari' },
  { href: '#/grammar', title: 'Grammar', text: '25 ta savol, o‘zbekcha tushuntirish' },
  { href: '#/writing', title: 'Writing', text: 'Task 1 va Task 2, taymer, oddiy tekshiruv' },
  { href: '#/speaking', title: 'Speaking', text: 'Part 1–3 savollari, ovoz yozish' },
  { href: '#/tools', title: 'Bepul asboblar', text: 'Band kalkulyatori va ball o‘tkazgich' },
];

export default function Home() {
  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{BRAND.name}</h1>
        <p className="big" style={{ fontSize: 22 }}>{BRAND.tagline}</p>
        <p>IELTS ning to‘rt bo‘limi, Grammar va mock testlar bir joyda. Hozirgi versiya AI xizmatisiz ishlaydi, AI ustoz keyingi bosqichda qo‘shiladi.</p>
        <p className="notice">Bu dastlabki sinov versiyasi: kontent hajmi hozircha kichik (1 ta Reading, 1 ta Listening, 25 ta Grammar savol).</p>
      </div>
      <div className="grid">
        {tiles.map((t) => (
          <a key={t.href} className="card tile" href={t.href}><h3>{t.title}</h3><p>{t.text}</p></a>
        ))}
      </div>
    </div>
  );
}
