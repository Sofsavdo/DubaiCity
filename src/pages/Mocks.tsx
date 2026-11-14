import { BookOpen, FlaskConical, Headphones, Ruler } from 'lucide-react';
import { Tile } from '../components/Tile';
import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { useProfile } from '../lib/store';

export default function Mocks() {
  const p = useProfile();
  const lock = !p.plan.mocks && <span className="badge">Obuna kerak</span>;
  return (
    <div>
      <div className="card">
        <h2>Mock testlar {p.plan.mocks ? <span className="badge on">{p.planUntil.mocks ? 'Obuna faol' : 'Obuna faol (demo)'}</span> : <span className="badge">Obuna kerak</span>}</h2>
        <p style={{ marginBottom: 0 }}>Imtihon sharoitida: taymer, avtomatik baho va har savol bo‘yicha tahlil. Natijalar profilda saqlanadi.</p>
      </div>
      <div className="grid">
        <Tile href="#/mocks/reading" icon={BookOpen} tone="blue" title="IELTS Reading mini-mocklar" text={`${readingTests.length} ta test · 13 savoldan`} badge={lock} />
        <Tile href="#/mocks/listening" icon={Headphones} tone="red" title="IELTS Listening mini-mocklar" text={`${listeningTests.length} ta test · 10 savoldan`} badge={lock} />
        <Tile href="#/mocks/full" icon={FlaskConical} tone="purple" title="To‘liq imtihon simulyatsiyasi" text="Listening → Reading → Writing → Speaking, taymer bilan, umumiy band" badge={lock} />
        <Tile icon={Ruler} tone="ink" title="SAT va CEFR mock" text="Alohida imtihon formatlari" badge={<span className="badge soon">tez orada</span>} />
      </div>
    </div>
  );
}
