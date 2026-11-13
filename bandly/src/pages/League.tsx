import { useCallback, useEffect, useState } from 'react';
import { Mascot } from '../components/Mascot';
import { fetchBoard, getAccount, joinLeague, leaveLeague, syncNow, type Board } from '../lib/account';
import { useProfile } from '../lib/store';

export default function League() {
  useProfile(); // XP o'zgarsa qayta chizish
  const [period, setPeriod] = useState<'week' | 'all'>('week');
  const [board, setBoard] = useState<Board | null>(null);
  const [err, setErr] = useState('');
  const [nick, setNick] = useState('');
  const [busy, setBusy] = useState(false);
  const [acc, setAcc] = useState(getAccount());

  const load = useCallback(async () => {
    try { await syncNow(); setBoard(await fetchBoard(period)); setErr(''); } catch (e) { setErr((e as Error).message); }
  }, [period]);
  useEffect(() => { void load(); const t = setInterval(() => void load(), 20_000); return () => clearInterval(t); }, [load]);

  const join = async () => {
    setBusy(true);
    try { setAcc(await joinLeague(nick)); setErr(''); await load(); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="card hero">
        <Mascot mood="happy" size={84} />
        <div>
          <h2 style={{ margin: 0 }}>Reyting</h2>
          <p style={{ margin: '4px 0' }}>Har hafta dushanba kuni yangilanadi. XP yig‘ing va yuqoriga chiqing.</p>
          <div className="tabs" style={{ margin: 0 }}>
            <button className={`btn ${period === 'week' ? 'primary' : ''}`} onClick={() => setPeriod('week')}>Shu hafta</button>
            <button className={`btn ${period === 'all' ? 'primary' : ''}`} onClick={() => setPeriod('all')}>Hamma vaqt</button>
          </div>
        </div>
      </div>

      {!acc && (
        <div className="card">
          <h3>Reytingda qatnashish</h3>
          <p>Laqab tanlang (parol shart emas). Natijangiz shu qurilmadagi hisobga bog‘lanadi.</p>
          <div className="row">
            <input type="text" value={nick} maxLength={20} placeholder="Laqab" onChange={(e) => setNick(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void join(); }}
              style={{ padding: 10, borderRadius: 10, border: '2px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: 16 }} />
            <button className="btn primary" disabled={busy || nick.trim().length < 2} onClick={() => void join()}>Qo‘shilish</button>
          </div>
        </div>
      )}
      {err && <p className="notice">{err}</p>}

      <div className="card">
        {board && board.top.length === 0 && <p>Hali hech kim yo‘q. Birinchi bo‘ling: o‘yin o‘ynab XP yig‘ing!</p>}
        {board && board.top.length > 0 && (
          <table className="data" style={{ width: '100%' }}>
            <thead><tr><th>#</th><th>Laqab</th><th>XP</th><th>🔥</th></tr></thead>
            <tbody>
              {board.top.map((r) => (
                <tr key={r.rank} style={r.me ? { background: 'rgba(255,77,61,.12)', fontWeight: 700 } : undefined}>
                  <td>{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}</td>
                  <td>{r.nickname}{r.me ? ' (siz)' : ''}</td><td>{r.xp}</td><td>{r.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {board?.me && board.me.rank > 20 && <p className="evidence">Sizning o‘rningiz: {board.me.rank}-o‘rin, {board.me.xp} XP</p>}
        {acc && <p className="evidence">Laqabingiz: <b>{acc.nickname}</b> · <button className="btn" onClick={() => { leaveLeague(); setAcc(null); }}>Chiqish</button></p>}
        <p className="evidence">Aldovning oldini olish uchun server qisqa vaqtda juda katta XP sakrashlarini qabul qilmaydi.</p>
      </div>
    </div>
  );
}
