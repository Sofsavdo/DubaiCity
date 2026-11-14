import { RankBadge } from '../components/RankBadge';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { vocabById } from '../content/vocab';
import { Mascot } from '../components/Mascot';
import { JoinForm } from '../components/JoinForm';
import { createDuel, duelUrl, fetchDuel, getAccount, submitDuel, type DuelInfo } from '../lib/account';
import { addXp, recordReview } from '../lib/store';
import { buildOptions } from '../lib/vocabGame';

const SECONDS = 12;

function ShareBox({ code }: { code: string }) {
  const url = duelUrl(code);
  const [copied, setCopied] = useState(false);
  const text = 'Bandly duelida meni yutib ko‘ring!';
  return (
    <div className="card">
      <h3>Do‘stingizni chaqiring</h3>
      <p className="bubble" style={{ wordBreak: 'break-all' }}>{url}</p>
      <div className="row">
        <button className="btn" onClick={() => { void navigator.clipboard?.writeText(url).then(() => setCopied(true)); }}>{copied ? 'Nusxalandi' : 'Havolani nusxalash'}</button>
        <a className="btn" target="_blank" rel="noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}>Telegramda ulashish</a>
        {typeof navigator.share === 'function' && <button className="btn" onClick={() => void navigator.share({ title: 'Bandly duel', text, url })}>Ulashish</button>}
      </div>
    </div>
  );
}

function Play({ info, onDone }: { info: DuelInfo; onDone: (i: DuelInfo) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [err, setErr] = useState('');
  const qStart = useRef(Date.now());
  const t0 = useRef(Date.now());
  const acc = useRef({ score: 0, correct: 0 });
  const finished = useRef(false);

  const word = vocabById[info.words[i]];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const opts = useMemo(() => buildOptions(word, 'en'), [i, info.code]);
  useEffect(() => { qStart.current = Date.now(); setLeft(SECONDS); setPicked(null); }, [i]);

  const finish = useCallback(async () => {
    if (finished.current) return;
    finished.current = true;
    try {
      const res = await submitDuel(info.code, acc.current.score, acc.current.correct, Math.max(5000, Date.now() - t0.current));
      addXp(25);
      onDone(res);
    } catch (e) { setErr((e as Error).message); }
  }, [info.code, onDone]);

  const next = useCallback(() => { if (i + 1 >= info.words.length) void finish(); else setI((n) => n + 1); }, [i, info.words.length, finish]);

  const answer = useCallback((id: string | null) => {
    if (picked !== null) return;
    const rem = Math.max(0, SECONDS - (Date.now() - qStart.current) / 1000);
    const ok = id === word.id;
    recordReview(word.id, ok);
    setPicked(id ?? '__timeout');
    if (ok) {
      const pts = 100 + Math.min(50, Math.max(0, Math.round((rem / SECONDS) * 50)));
      acc.current = { score: acc.current.score + pts, correct: acc.current.correct + 1 };
      setScore(acc.current.score); setCorrect(acc.current.correct);
    }
    setTimeout(next, 700);
  }, [picked, word, next]);

  useEffect(() => {
    const id = setInterval(() => {
      const rem = SECONDS - (Date.now() - qStart.current) / 1000;
      setLeft(Math.max(0, rem));
      if (rem <= 0) answer(null);
    }, 100);
    return () => clearInterval(id);
  }, [answer]);

  if (err) return <div className="card"><p className="notice">{err}</p></div>;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="pill">{i + 1} / {info.words.length}</span>
        <span className="combo">{score} ball</span>
        <span className="pill">{correct} to‘g‘ri</span>
      </div>
      <div className="bar" style={{ margin: '10px 0' }}><i style={{ width: `${(left / SECONDS) * 100}%`, background: left < 4 ? 'var(--bad)' : undefined }} /></div>
      <div className="pill">Ma’nosini toping</div>
      <div className="qword">{word.word}</div>
      <div className="opts">
        {opts.map((o) => {
          const cls = picked === null ? 'opt' : o.id === word.id ? 'opt right' : o.id === picked ? 'opt bad' : 'opt';
          return <button key={o.id} className={cls} disabled={picked !== null} onClick={() => answer(o.id)}>{o.text}</button>;
        })}
      </div>
    </div>
  );
}

function Results({ info }: { info: DuelInfo }) {
  return (
    <div className="card">
      <table className="data" style={{ width: '100%' }}>
        <thead><tr><th>#</th><th>Laqab</th><th>Ball</th><th>To‘g‘ri</th><th>Vaqt</th></tr></thead>
        <tbody>
          {info.players.map((p) => (
            <tr key={p.nickname} style={p.me ? { background: 'rgba(255,77,61,.12)', fontWeight: 700 } : undefined}>
              <td><RankBadge n={p.rank} /></td>
              <td>{p.nickname}{p.me ? ' (siz)' : ''}</td>
              <td>{p.score ?? 'kutilmoqda'}</td><td>{p.correct ?? '—'}</td><td>{p.ms ? `${Math.round(p.ms / 1000)} s` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="evidence">Ball teng bo‘lsa tezroq tugatgan yutadi. Natijalar har 4 soniyada yangilanadi.</p>
    </div>
  );
}

export function DuelRoom({ code }: { code: string }) {
  const [acc, setAcc] = useState(getAccount());
  const [info, setInfo] = useState<DuelInfo | null>(null);
  const [err, setErr] = useState('');
  const [playing, setPlaying] = useState(false);

  const load = useCallback(async () => { try { setInfo(await fetchDuel(code)); setErr(''); } catch (e) { setErr((e as Error).message); } }, [code]);
  useEffect(() => { void load(); const t = setInterval(() => { if (!playing) void load(); }, 4000); return () => clearInterval(t); }, [load, playing]);

  if (err && !info) return <div className="card"><p className="notice">{err}</p><a className="btn" href="#/duel">Duellar</a></div>;
  if (!info) return <div className="card">Yuklanmoqda…</div>;
  if (!acc) return <JoinForm onJoined={setAcc} text="Duelda qatnashish uchun laqab tanlang (parol shart emas)." />;
  if (playing) return <Play info={info} onDone={(i) => { setInfo(i); setPlaying(false); }} />;

  return (
    <div>
      <div className="card hero">
        <Mascot mood={info.iFinished ? 'happy' : 'think'} size={84} />
        <div>
          <h2 style={{ margin: 0 }}>Duel {info.code}</h2>
          <p style={{ margin: '4px 0' }}>10 ta so‘z, har biriga {SECONDS} soniya. Tez va to‘g‘ri javob ko‘proq ball beradi.</p>
          {info.expired ? <span className="badge">Muddati tugagan</span> : info.iFinished ? <span className="badge on">Siz o‘ynadingiz</span> :
            info.full && !info.players.some((p) => p.me) ? <span className="badge">Duel to‘lgan</span> :
              <button className="btn primary" onClick={() => setPlaying(true)}>O‘ynash</button>}
        </div>
      </div>
      <Results info={info} />
      {!info.expired && <ShareBox code={info.code} />}
    </div>
  );
}

export default function DuelHub() {
  const [acc, setAcc] = useState(getAccount());
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [codeIn, setCodeIn] = useState('');
  const create = async () => {
    setBusy(true);
    try { const d = await createDuel(); window.location.hash = `#/duel/${d.code}`; } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  if (!acc) return <JoinForm onJoined={setAcc} text="Duel uchun laqab tanlang (parol shart emas)." />;
  return (
    <div>
      <div className="card hero">
        <Mascot mood="angry" size={90} />
        <div>
          <h2 style={{ margin: 0 }}>Duel</h2>
          <p style={{ margin: '4px 0' }}>Do‘stlaringiz bilan bir xil 10 ta so‘zda raqobatlashing. Havolani yuboring, kim yutadi?</p>
          <button className="btn primary" disabled={busy} onClick={() => void create()}>Yangi duel yaratish</button>
        </div>
      </div>
      <div className="card">
        <h3>Kod bilan qo‘shilish</h3>
        <div className="row">
          <input type="text" value={codeIn} maxLength={8} placeholder="Masalan: K7M2QX" onChange={(e) => setCodeIn(e.target.value.toUpperCase())}
            style={{ padding: 10, borderRadius: 10, border: '2px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: 16, textTransform: 'uppercase' }} />
          <a className="btn" href={codeIn.length >= 4 ? `#/duel/${codeIn}` : undefined} aria-disabled={codeIn.length < 4}>Qo‘shilish</a>
        </div>
        {err && <p className="notice" style={{ marginTop: 10 }}>{err}</p>}
      </div>
    </div>
  );
}
