import { ACHIEVEMENTS, levelProgress } from '../lib/game';
import { loadResults } from '../lib/storage';
import { resetAll, setDailyGoal, setHardMode, useProfile } from '../lib/store';
import { vocab } from '../content/vocab';
import { isMastered } from '../lib/srs';
import { Mascot } from '../components/Mascot';

export default function Profile() {
  const p = useProfile();
  const lp = levelProgress(p.xp);
  const results = loadResults();
  const mastered = vocab.filter((w) => isMastered(p.srs[w.id])).length;
  return (
    <div>
      <div className="card hero">
        <Mascot mood={p.streak >= 3 ? 'happy' : 'idle'} size={96} />
        <div>
          <h2 style={{ margin: 0 }}>{lp.level}-daraja</h2>
          <div className="bar" style={{ margin: '8px 0' }}><i style={{ width: `${lp.pct * 100}%` }} /></div>
          <div className="evidence">{lp.into} / {lp.span} XP · jami {p.xp} XP</div>
          <div className="row" style={{ marginTop: 8 }}>
            <span className="pill">🔥 Seriya: {p.streak} kun</span>
            <span className="pill">Eng uzun: {p.longestStreak}</span>
            <span className="pill">So‘zlar: {mastered}/{vocab.length}</span>
            <span className="pill">O‘yinlar: {p.gamesPlayed}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Yutuqlar</h3>
        {ACHIEVEMENTS.map((a) => {
          const on = p.achievements.includes(a.id);
          return <div key={a.id} className={`ach ${on ? '' : 'off'}`}><span style={{ fontSize: 24 }}>{on ? '🏆' : '🔒'}</span><div><b>{a.title}</b><div className="evidence">{a.desc}</div></div></div>;
        })}
      </div>

      <div className="card">
        <h3>Sozlamalar</h3>
        <div className="row">
          <label>Kunlik maqsad:{' '}
            <select value={p.dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}>
              {[30, 50, 100, 150].map((g) => <option key={g} value={g}>{g} XP</option>)}
            </select>
          </label>
        </div>
        <p><label><input type="checkbox" checked={p.hardMode} onChange={(e) => setHardMode(e.target.checked)} /> Qattiq rejim (18+): mascot xatolarga hazil bilan o‘tkir javob beradi</label></p>
        <p className="evidence">Qattiq rejim faqat xatolarga qaratilgan hazil; haqorat yo‘q. Faqat o‘zingiz yoqsangiz ishlaydi.</p>
        <button className="btn" onClick={() => { if (window.confirm('Barcha natijalar, XP va demo obunalar o‘chiriladi. Davom etasizmi?')) { resetAll(); try { localStorage.removeItem('bandly.results.v1'); } catch { /* */ } } }}>Hisobni tiklash</button>
      </div>

      <div className="card">
        <h3>Natijalar tarixi</h3>
        {results.length === 0 ? <p>Hozircha natija yo‘q.</p> : (
          <table className="data">
            <thead><tr><th>Sana</th><th>Test</th><th>Natija</th><th>Band (taxm.)</th></tr></thead>
            <tbody>{results.map((r) => <tr key={r.id}><td>{new Date(r.date).toLocaleDateString('uz-UZ')}</td><td>{r.title}</td><td>{r.correct} / {r.total}</td><td>{r.band !== undefined ? r.band.toFixed(1) : '—'}</td></tr>)}</tbody>
          </table>
        )}
        <p className="evidence">Ma’lumotlar faqat shu qurilmada saqlanadi.</p>
      </div>
    </div>
  );
}
