import { loadResults } from '../lib/storage';

export default function Progress() {
  const results = loadResults();
  return (
    <div className="card">
      <h2>Natijalarim</h2>
      {results.length === 0 ? <p>Hozircha natija yo‘q. Reading, Listening yoki Grammar mashqini bajaring.</p> : (
        <table className="data">
          <thead><tr><th>Sana</th><th>Test</th><th>Natija</th><th>Band (taxm.)</th></tr></thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleDateString('uz-UZ')}</td>
                <td>{r.title}</td>
                <td>{r.correct} / {r.total}</td>
                <td>{r.band !== undefined ? r.band.toFixed(1) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="evidence">Natijalar faqat shu qurilmada saqlanadi.</p>
    </div>
  );
}
