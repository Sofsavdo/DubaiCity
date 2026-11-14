import { BookOpen, Headphones } from 'lucide-react';
import { Tile } from '../components/Tile';
import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { loadResults } from '../lib/storage';

export default function TestList({ track, kind }: { track: 'exam' | 'mocks'; kind: 'reading' | 'listening' }) {
  const tests = kind === 'reading' ? readingTests : listeningTests;
  const results = loadResults();
  return (
    <div>
      <div className="card">
        <h2>{kind === 'reading' ? 'Reading' : 'Listening'} testlari</h2>
        <p>Testni tanlang. Har bir test imtihon taymeri va to‘liq tahlil bilan keladi.</p>
      </div>
      <div className="grid">
        {tests.map((t, i) => {
          const mine = results.filter((r) => r.title === t.title);
          const best = mine.length ? mine.reduce((a, b) => (b.correct > a.correct ? b : a)) : null;
          return (
            <Tile key={t.id} href={`#/${track}/${kind}/${t.id}`} icon={kind === 'reading' ? BookOpen : Headphones} tone={kind === 'reading' ? 'blue' : 'red'}
              title={<>{t.title.replace(/^(Reading|Listening) mini-test \d+: /, '')}</>} text={`Test ${i + 1} · ${t.questions.length} savol · ${t.minutes} daqiqa`}
              badge={best ? <span className="badge on">Eng yaxshi: {best.correct}/{best.total}</span> : <span className="badge">Hali yechilmagan</span>} />
          );
        })}
      </div>
    </div>
  );
}
