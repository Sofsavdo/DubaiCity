import { useProfile } from '../lib/store';

import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';

const mocks = [
  { href: '#/mocks/reading', icon: '📖', title: 'IELTS Reading mini-mocklar', meta: `${readingTests.length} ta test · 13 savoldan` },
  { href: '#/mocks/listening', icon: '🎧', title: 'IELTS Listening mini-mocklar', meta: `${listeningTests.length} ta test · 10 savoldan` },
];

export default function Mocks() {
  const p = useProfile();
  return (
    <div>
      <div className="card">
        <h2>Mock testlar {p.plan.mocks ? <span className="badge on">Obuna faol (demo)</span> : <span className="badge">Obuna kerak</span>}</h2>
        <p>Imtihon sharoitida: taymer, avtomatik baho va har savol bo‘yicha tahlil. Natijalar profilda saqlanadi.</p>
      </div>
      <div className="grid">
        {mocks.map((m) => (
          <a key={m.href} className="card tile" href={m.href}><div style={{ fontSize: 30 }}>{m.icon}</div><h3>{!p.plan.mocks && '🔒 '}{m.title}</h3><p>{m.meta}</p></a>
        ))}
        <div className="card tile"><div style={{ fontSize: 30 }}>🧪</div><h3>To‘liq IELTS mock <span className="badge soon">tez orada</span></h3><p>40 savollik Reading va Listening, to‘liq Writing va Speaking</p></div>
        <div className="card tile"><div style={{ fontSize: 30 }}>📐</div><h3>SAT va CEFR mock <span className="badge soon">tez orada</span></h3><p>Alohida imtihon formatlari</p></div>
      </div>
    </div>
  );
}
