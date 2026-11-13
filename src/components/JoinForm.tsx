import { useState } from 'react';
import { joinLeague, type Account } from '../lib/account';

export function JoinForm({ onJoined, text }: { onJoined: (a: Account) => void; text?: string }) {
  const [nick, setNick] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { onJoined(await joinLeague(nick)); setErr(''); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="card">
      <h3>Laqab tanlang</h3>
      <p>{text ?? 'Parol shart emas. Laqabingiz reyting va duellarda ko‘rinadi.'}</p>
      <div className="row">
        <input type="text" value={nick} maxLength={20} placeholder="Laqab" onChange={(e) => setNick(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void go(); }}
          style={{ padding: 10, borderRadius: 10, border: '2px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: 16 }} />
        <button className="btn primary" disabled={busy || nick.trim().length < 2} onClick={() => void go()}>Davom etish</button>
      </div>
      {err && <p className="notice" style={{ marginTop: 10 }}>{err}</p>}
    </div>
  );
}
