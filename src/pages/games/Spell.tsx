import { Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { vocab, vocabById } from '../../content/vocab';
import { lines, pickLine } from '../../content/lines';
import { Mascot, type Mood } from '../../components/Mascot';
import { LockCard } from '../../components/Gate';
import { norm } from '../../lib/grade';
import { pickSession } from '../../lib/srs';
import { addXp, consumeGame, getProfile, recordReview, useProfile } from '../../lib/store';
import { blankExample, speak } from '../../lib/vocabGame';

const SIZE = 8;

export default function Spell() {
  const profile = useProfile();
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [ids, setIds] = useState<string[]>([]);
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [result, setResult] = useState<'ok' | 'bad' | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const [msg, setMsg] = useState('');
  const [correct, setCorrect] = useState(0);
  const [earned, setEarned] = useState(0);
  const [locked, setLocked] = useState(false);
  const correctRef = useRef(0);

  function start() {
    if (!consumeGame()) { setLocked(true); return; }
    setIds(pickSession(vocab.map((w) => w.id), getProfile().srs, Date.now(), SIZE));
    setI(0); setText(''); setResult(null); setCorrect(0); correctRef.current = 0; setMood('idle'); setMsg('Eshiting, o‘ylang, yozing.');
    setPhase('play');
  }

  function check() {
    if (result || !text.trim()) return;
    const w = vocabById[ids[i]];
    const ok = norm(text) === norm(w.word);
    recordReview(w.id, ok);
    setResult(ok ? 'ok' : 'bad');
    if (ok) { correctRef.current += 1; setCorrect(correctRef.current); }
    setMood(ok ? 'happy' : profile.hardMode ? 'angry' : 'sad');
    setMsg(pickLine(ok ? (profile.hardMode ? lines.correct.hard : lines.correct.soft) : profile.hardMode ? lines.wrong.hard : lines.wrong.soft));
  }

  function next() {
    if (i + 1 >= ids.length) {
      const xp = correctRef.current * 6 + (correctRef.current === ids.length ? 10 : 0);
      setEarned(xp);
      addXp(xp);
      setPhase('end');
      return;
    }
    setI(i + 1); setText(''); setResult(null); setMood('idle'); setMsg('');
  }

  if (locked) return <LockCard track="exam" reason="Bugungi bepul o‘yinlar tugadi. Istalgan obuna bilan o‘yinlar cheksiz." />;

  if (phase === 'intro') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood="think" size={110} /></div>
        <h2>Imlo sinovi</h2>
        <p>O‘zbekcha ma’no va misol gap beriladi, siz inglizcha so‘zni yozasiz. Talaffuzni eshitish tugmasi ham bor.</p>
        <button className="btn primary" onClick={start}>Boshlash</button>
      </div>
    );
  }

  if (phase === 'end') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood={correct >= ids.length / 2 ? 'happy' : 'sad'} size={110} /></div>
        <h2>{correct} / {ids.length}</h2>
        <p><b>+{earned} XP</b></p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={start}>Yana o‘ynash</button>
          <a className="btn" href="#/games">O‘yinlar</a>
        </div>
      </div>
    );
  }

  const w = vocabById[ids[i]];
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="pill">{i + 1} / {ids.length}</span>
        <span className="pill">{w.pos} · {w.topic}</span>
      </div>
      <div className="hero" style={{ margin: '10px 0' }}>
        <Mascot mood={mood} size={72} />
        <div>{msg && <div className="bubble">{msg}</div>}</div>
      </div>
      <div className="qword">{w.uz}</div>
      <p className="evidence">{w.def}</p>
      <p>{blankExample(w)}</p>
      <div className="row">
        <input type="text" autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} readOnly={!!result} value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') (result ? next() : check()); }}
          placeholder={`${w.word[0]}${' _'.repeat(Math.max(0, w.word.length - 1))}`} style={{ padding: 10, fontSize: 18, borderRadius: 10, border: '2px solid var(--line)', background: 'var(--bg)', color: 'var(--text)' }} />
        <button className="btn" onClick={() => speak(w.word)}><Volume2 size={18} /> Eshitish</button>
        {!result ? <button className="btn primary" onClick={check}>Tekshirish</button> : <button className="btn primary" onClick={next}>{i + 1 >= ids.length ? 'Yakunlash' : 'Keyingi'}</button>}
      </div>
      {result && <p className={result === 'ok' ? 'ok' : 'bad'}>{result === 'ok' ? 'To‘g‘ri!' : `To‘g‘ri javob: ${w.word}`}</p>}
    </div>
  );
}
