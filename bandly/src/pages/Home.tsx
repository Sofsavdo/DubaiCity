import { BRAND } from '../brand';
import { PLANS } from '../config';
import { Mascot } from '../components/Mascot';
import { vocab } from '../content/vocab';
import { isDue } from '../lib/srs';
import { useProfile } from '../lib/store';

const hrefs = { exam: '#/exam', grammar: '#/grammar', mocks: '#/mocks' } as const;

export default function Home() {
  const p = useProfile();
  const goal = Math.min(1, p.dailyXp / Math.max(1, p.dailyGoal));
  const due = vocab.filter((w) => p.srs[w.id] && isDue(p.srs[w.id], Date.now())).length;
  const done = p.dailyXp >= p.dailyGoal;
  return (
    <div>
      <div className="card hero">
        <Mascot mood={done ? 'happy' : 'idle'} size={110} />
        <div>
          <h1 style={{ margin: 0 }}>{BRAND.name}</h1>
          <p style={{ margin: '4px 0' }}>{BRAND.tagline}</p>
          <div className="bar" style={{ margin: '10px 0' }}><i style={{ width: `${goal * 100}%` }} /></div>
          <div className="evidence">Kunlik maqsad: {Math.min(p.dailyXp, p.dailyGoal)} / {p.dailyGoal} XP {done && '· bajarildi!'}</div>
          <div className="row" style={{ marginTop: 10 }}>
            <a className="btn primary" href="#/games/rush">⚡ So‘z poygasi</a>
            {due > 0 && <span className="pill">{due} ta so‘z takrorlashga tayyor</span>}
          </div>
        </div>
      </div>

      <h3>Yo‘nalishlar</h3>
      <div className="tracks">
        {PLANS.map((pl) => (
          <a key={pl.id} className="card track" href={hrefs[pl.id]}>
            <div className="ico">{pl.icon}</div>
            <h3 style={{ margin: '4px 0' }}>{pl.title}</h3>
            <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 14 }}>{pl.short}</p>
            {p.plan[pl.id] ? <span className="badge on">Obuna faol (demo)</span> : <span className="badge">Obuna kerak</span>}
          </a>
        ))}
      </div>

      <h3>Bepul</h3>
      <div className="grid">
        <a className="card tile" href="#/games"><h3>🎮 So‘z o‘yinlari</h3><p>Kuniga 2 ta bepul o‘yin</p></a>
        <a className="card tile" href="#/tools"><h3>🧮 Band kalkulyatori</h3><p>Ro‘yxatdan o‘tish shart emas</p></a>
        <a className="card tile" href="#/pricing"><h3>💳 Obuna turlari</h3><p>Faqat kerakli yo‘nalish uchun to‘lang</p></a>
      </div>
    </div>
  );
}
