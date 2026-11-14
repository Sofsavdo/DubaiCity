import { BookOpen, Headphones } from 'lucide-react';
import { Tile } from '../components/Tile';
import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { loadResults } from '../lib/storage';
import { levelIndex } from '../lib/levels';
import { useProfile } from '../lib/store';

export default function TestList({ track, kind }: { track: 'exam' | 'mocks'; kind: 'reading' | 'listening' }) {
  const p = useProfile();
  const all = kind === 'reading' ? readingTests : listeningTests;
  // Darajaga yaqinlari birinchi; daraja aniqlanmagan bo'lsa asl tartib
  const tests = p.level ? [...all].sort((a, b) => Math.abs(levelIndex(a.level) - levelIndex(p.level)) - Math.abs(levelIndex(b.level) - levelIndex(p.level))) : all;
  const near = (l: typeof all[number]['level']) => !!p.level && Math.abs(levelIndex(l) - levelIndex(p.level)) <= 1;
  const results = loadResults();
  return (
    <div>
      <div className="card">
        <h2>{kind === 'reading' ? 'Reading' : 'Listening'} testlari</h2>
        <p>Testni tanlang. Har bir test imtihon taymeri va to‘liq tahlil bilan keladi.</p>
        {p.level ? <p className="evidence">Darajangiz: <b>{p.level}</b>. Sizga mos testlar birinchi ko‘rsatilgan.</p> : <p className="evidence"><a href="#/placement">Darajangizni aniqlang</a>: testlar sizga moslab tartiblanadi.</p>}
      </div>
      <div className="grid">
        {tests.map((t, i) => {
          const mine = results.filter((r) => r.title === t.title);
          const best = mine.length ? mine.reduce((a, b) => (b.correct > a.correct ? b : a)) : null;
          return (
            <Tile key={t.id} href={`#/${track}/${kind}/${t.id}`} icon={kind === 'reading' ? BookOpen : Headphones} tone={kind === 'reading' ? 'blue' : 'red'}
              title={<>{t.title.replace(/^(Reading|Listening) mini-test \d+: /, '')} <span className={`lvl-tag ${t.level}`}>{t.level}</span></>} text={`Test ${i + 1} · ${t.questions.length} savol · ${t.minutes} daqiqa${near(t.level) ? ' · Sizga mos' : ''}`}
              badge={best ? <span className="badge on">Eng yaxshi: {best.correct}/{best.total}</span> : <span className="badge">Hali yechilmagan</span>} />
          );
        })}
      </div>
    </div>
  );
}
