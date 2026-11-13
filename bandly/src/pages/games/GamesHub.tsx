import { vocab } from '../../content/vocab';
import { isDue, isMastered } from '../../lib/srs';
import { freeGamesLeft, hasAnyPlan, useProfile } from '../../lib/store';

const games = [
  { href: '#/games/rush', icon: '⚡', title: 'So‘z poygasi', text: '60 soniya, 3 jon, kombo ball' },
  { href: '#/games/pairs', icon: '🧩', title: 'Juftlik', text: 'So‘z va ma’noni juftlang' },
  { href: '#/games/spell', icon: '✍️', title: 'Imlo sinovi', text: 'Misol gapdan so‘zni yozing' },
  { href: '#/duel', icon: '⚔️', title: 'Duel', text: 'Do‘st bilan bir xil so‘zlarda' },
];

export default function GamesHub() {
  const p = useProfile();
  const now = Date.now();
  const mastered = vocab.filter((w) => isMastered(p.srs[w.id])).length;
  const due = vocab.filter((w) => p.srs[w.id] && isDue(p.srs[w.id], now)).length;
  const fresh = vocab.filter((w) => !p.srs[w.id]).length;
  const topics = [...new Set(vocab.map((w) => w.topic))];
  const left = freeGamesLeft(p);
  return (
    <div>
      <div className="card">
        <h2>So‘z o‘yinlari</h2>
        <p>Yodlash o‘rniga o‘ynang: har bir o‘yin takrorlash tizimiga ulangan. Bilmagan so‘zlaringiz tezroq, bilganlaringiz kamroq qaytadi.</p>
        <p className="evidence">
          {hasAnyPlan(p) ? 'Obunangiz bilan o‘yinlar cheksiz.' : `Bugun bepul o‘yinlar: ${left} ta qoldi (kuniga 2 ta). Istalgan obuna bilan cheksiz.`}
        </p>
        <div className="row">
          <span className="pill">Yangi: {fresh}</span>
          <span className="pill">Takrorlash vaqti: {due}</span>
          <span className="pill">O‘zlashtirilgan: {mastered} / {vocab.length}</span>
        </div>
      </div>
      <div className="grid">
        {games.map((g) => (
          <a key={g.href} className="card tile" href={g.href}><div className="ico" style={{ fontSize: 30 }}>{g.icon}</div><h3>{g.title}</h3><p>{g.text}</p></a>
        ))}
      </div>
      <div className="card">
        <h3>Mavzular bo‘yicha o‘zlashtirish</h3>
        {topics.map((t) => {
          const list = vocab.filter((w) => w.topic === t);
          const m = list.filter((w) => isMastered(p.srs[w.id])).length;
          return (
            <div key={t} style={{ margin: '8px 0' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}><span>{t}</span><span className="evidence">{m} / {list.length}</span></div>
              <div className="bar"><i style={{ width: `${(m / list.length) * 100}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
