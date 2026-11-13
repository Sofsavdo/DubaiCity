import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { loadResults } from '../lib/storage';

export default function TestList({ track, kind }: { track: 'exam' | 'mocks'; kind: 'reading' | 'listening' }) {
  const tests = kind === 'reading' ? readingTests : listeningTests;
  const results = loadResults();
  return (
    <div>
      <div className="card">
        <h2>{kind === 'reading' ? '📖 Reading' : '🎧 Listening'} testlari</h2>
        <p>Testni tanlang. Har bir test imtihon taymeri va to‘liq tahlil bilan keladi.</p>
      </div>
      <div className="grid">
        {tests.map((t, i) => {
          const mine = results.filter((r) => r.title === t.title);
          const best = mine.length ? mine.reduce((a, b) => (b.correct > a.correct ? b : a)) : null;
          return (
            <a key={t.id} className="card tile" href={`#/${track}/${kind}/${t.id}`}>
              <div className="pill">Test {i + 1}</div>
              <h3>{t.title.replace(/^(Reading|Listening) mini-test \d+: /, '')}</h3>
              <p>{t.questions.length} savol · {t.minutes} daqiqa</p>
              <p style={{ marginTop: 6 }}>{best ? <span className="badge on">Eng yaxshi: {best.correct}/{best.total}</span> : <span className="badge">Hali yechilmagan</span>}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
