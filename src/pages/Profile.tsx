import { Flame, Lock, Trophy } from 'lucide-react';
import { useState } from 'react';
import { getAccount, restoreAccount } from '../lib/account';
import { fmtDate, refreshEntitlements } from '../lib/pay';
import { TRACK_NAME } from '../config';
import { setSound, sfx, soundOn } from '../lib/fx';
import { LEVEL_INFO } from '../lib/levels';
import { ACHIEVEMENTS, levelProgress } from '../lib/game';
import { loadResults } from '../lib/storage';
import { resetAll, setDailyGoal, useProfile } from '../lib/store';
import { PersonaPicker } from '../components/PersonaPicker';
import { vocab } from '../content/vocab';
import { isMastered } from '../lib/srs';
import { Mascot } from '../components/Mascot';
import { ProgressCard } from '../components/ProgressCard';

export default function Profile() {
  const p = useProfile();
  const [snd, setSnd] = useState(soundOn());
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const acc = getAccount();
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
            <span className="pill"><Flame size={14} color="#ff7a1a" fill="#ff7a1a" /> Seriya: {p.streak} kun</span>
            <span className="pill">Eng uzun: {p.longestStreak}</span>
            {p.level && <span className="pill">Daraja: {p.level} · {LEVEL_INFO[p.level].name}</span>}
            <span className="pill">So‘zlar: {mastered}/{vocab.length}</span>
            <span className="pill">O‘yinlar: {p.gamesPlayed}</span>
          </div>
        </div>
      </div>

      <ProgressCard />

      <div className="card">
        <h3>Hisob va obunalar</h3>
        {(['exam', 'grammar', 'mocks'] as const).map((t) => (
          <p key={t} style={{ margin: '4px 0' }}>{TRACK_NAME[t]}: {p.planUntil[t] && p.planUntil[t]! > Date.now() ? <b className="ok">faol, {fmtDate(p.planUntil[t]!)} gacha</b> : p.plan[t] ? <span>demo</span> : <span className="evidence">obuna yo‘q</span>}</p>
        ))}
        {acc ? (
          <>
            <p className="evidence">Laqab: <b>{acc.nickname}</b>. Hisob kodi obunani boshqa qurilmada tiklash uchun kerak, uni hech kimga bermang.</p>
            <div className="row"><button className="btn sm" onClick={async () => { await navigator.clipboard.writeText(acc.token).catch(() => {}); setMsg('Hisob kodi nusxalandi. Xavfsiz joyda saqlang.'); }}>Hisob kodini nusxalash</button></div>
          </>
        ) : <p className="evidence">Obuna sotib olish uchun hisob kerak: u to‘lov vaqtida laqab bilan yaratiladi.</p>}
        <div className="row" style={{ marginTop: 10 }}>
          <input type="text" value={code} placeholder="Boshqa qurilmadagi hisob kodi" onChange={(e) => setCode(e.target.value)} style={{ minWidth: 220 }} />
          <button className="btn sm" disabled={code.trim().length < 20} onClick={async () => { try { const a = await restoreAccount(code); await refreshEntitlements(); setMsg(`Kirdingiz: ${a.nickname}`); setCode(''); } catch (e) { setMsg((e as Error).message); } }}>Kod bilan kirish</button>
        </div>
        {msg && <p className="evidence">{msg}</p>}
      </div>

      <div className="card">
        <h3>Yutuqlar</h3>
        {ACHIEVEMENTS.map((a) => {
          const on = p.achievements.includes(a.id);
          return <div key={a.id} className={`ach ${on ? '' : 'off'}`}><span className="ach-ico">{on ? <Trophy size={20} /> : <Lock size={18} />}</span><div><b>{a.title}</b><div className="evidence">{a.desc}</div></div></div>;
        })}
      </div>

      <div className="card">
        <h3>Sozlamalar</h3>
        <div className="row" style={{ marginBottom: 10 }}>
          <a className="btn sm" href="#/placement">{p.level ? `Darajani qayta aniqlash (${p.level})` : 'Darajani aniqlash'}</a>
          <label><input type="checkbox" checked={snd} onChange={(e) => { setSnd(e.target.checked); setSound(e.target.checked); if (e.target.checked) sfx('ok'); }} /> Ovozli effektlar</label>
        </div>
        <div className="row">
          <label>Kunlik maqsad:{' '}
            <select value={p.dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}>
              {[30, 50, 100, 150].map((g) => <option key={g} value={g}>{g} XP</option>)}
            </select>
          </label>
        </div>
        <PersonaPicker />
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
