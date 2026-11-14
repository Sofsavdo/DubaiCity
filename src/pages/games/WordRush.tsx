import { Heart } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { vocabById, vocabForLevel } from '../../content/vocab';
import { lines, pickLine } from '../../content/lines';
import { Mascot, type Mood } from '../../components/Mascot';
import { LockCard } from '../../components/Gate';
import { fmt, useCountdown } from '../../components/hooks';
import { pickSession } from '../../lib/srs';
import { addXp, consumeGame, getProfile, recordReview, useProfile } from '../../lib/store';
import { buildOptions } from '../../lib/vocabGame';
import { recordWordItem } from '../../lib/adaptive/record';

const SECONDS = 60;
type Phase = 'intro' | 'play' | 'end';

export default function WordRush() {
  const profile = useProfile();
  const [phase, setPhase] = useState<Phase>('intro');
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const [msg, setMsg] = useState('Tayyormisiz?');
  const [missed, setMissed] = useState<string[]>([]);
  const [earned, setEarned] = useState(0);
  const [locked, setLocked] = useState(false);
  const stats = useRef({ score: 0, correct: 0, total: 0, done: false });
  const [left, reset] = useCountdown(SECONDS, phase === 'play', () => finish());

  const cur = queue.length ? vocabById[queue[idx % queue.length]] : undefined;
  const dir: 'en' | 'uz' = idx % 2 === 0 ? 'en' : 'uz';
  const options = useMemo(() => (cur ? buildOptions(cur, dir, vocabForLevel(getProfile().level)) : []), [cur, dir]);

  function finish() {
    if (stats.current.done) return;
    stats.current.done = true;
    const xp = Math.round(stats.current.score / 4) + (stats.current.correct >= 15 ? 10 : 0);
    setEarned(xp);
    addXp(xp);
    setPhase('end');
  }

  function start() {
    if (!consumeGame()) { setLocked(true); return; }
    setQueue(pickSession(vocabForLevel(getProfile().level).map((w) => w.id), getProfile().srs, Date.now(), 24));
    setIdx(0); setLives(3); setCombo(0); setScore(0); setPicked(null); setMissed([]); setMood('idle'); setMsg('Tez va aniq!');
    stats.current = { score: 0, correct: 0, total: 0, done: false };
    reset(SECONDS);
    setPhase('play');
  }

  function answer(id: string) {
    if (picked !== null || !cur) return;
    const ok = id === cur.id;
    setPicked(id);
    stats.current.total += 1;
    recordReview(cur.id, ok);
    recordWordItem(cur.id, ok);
    let nextLives = lives;
    if (ok) {
      const mult = 1 + Math.min(4, Math.floor(combo / 3));
      stats.current.score += 10 * mult;
      stats.current.correct += 1;
      setScore(stats.current.score);
      setCombo(combo + 1);
      setMood('happy');
      setMsg(combo + 1 >= 3 && (combo + 1) % 3 === 0 ? `${pickLine(lines.combo)} x${1 + Math.min(4, Math.floor((combo + 1) / 3))}` : pickLine(profile.hardMode ? lines.correct.hard : lines.correct.soft));
    } else {
      nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      setMood(profile.hardMode ? 'angry' : 'sad');
      setMsg(pickLine(profile.hardMode ? lines.wrong.hard : lines.wrong.soft));
      setMissed((m) => (m.includes(cur.id) ? m : [...m, cur.id]));
    }
    setTimeout(() => {
      if (nextLives <= 0) { finish(); return; }
      setPicked(null);
      setIdx((i) => i + 1);
    }, 700);
  }

  if (locked) return <LockCard track="exam" reason="Bugungi bepul o‘yinlar tugadi. Istalgan obuna bilan o‘yinlar cheksiz." />;

  if (phase === 'intro') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood="idle" size={110} /></div>
        <h2>So‘z poygasi</h2>
        <p>60 soniyada iloji boricha ko‘p so‘zni toping. 3 ta jon bor. Ketma-ket to‘g‘ri javoblar ballni 5 martagacha oshiradi.</p>
        <p className="evidence">Takrorlash tizimi sizga hali yaxshi bilmagan so‘zlarni ko‘proq beradi.</p>
        <button className="btn primary" onClick={start}>Boshlash</button>
      </div>
    );
  }

  if (phase === 'end') {
    const acc = stats.current.total ? Math.round((stats.current.correct / stats.current.total) * 100) : 0;
    const set = acc >= 80 ? lines.end.good : acc >= 50 ? lines.end.ok : lines.end.bad;
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood={acc >= 50 ? 'happy' : 'sad'} size={110} /></div>
        <h2>{pickLine(set)}</h2>
        <p className="score">{score} ball</p>
        <p>To‘g‘ri: {stats.current.correct} / {stats.current.total} ({acc}%) · <b>+{earned} XP</b></p>
        {missed.length > 0 && (
          <div style={{ textAlign: 'left' }}>
            <h4>Xato qilgan so‘zlaringiz</h4>
            {missed.map((id) => <p key={id} className="bubble"><b>{vocabById[id].word}</b>: {vocabById[id].uz}</p>)}
          </div>
        )}
        <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
          <button className="btn primary" onClick={start}>Yana o‘ynash</button>
          <a className="btn" href="#/games">O‘yinlar</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="timer">{fmt(left)}</span>
        <span className="hearts">{[0, 1, 2].map((i) => <Heart key={i} size={22} color="#ff4b3a" fill={i < lives ? '#ff4b3a' : 'none'} />)}</span>
        <span className="combo">x{1 + Math.min(4, Math.floor(combo / 3))} · {score}</span>
      </div>
      <div className="hero" style={{ margin: '10px 0' }}>
        <Mascot mood={mood} size={84} />
        <div><div className="bubble">{msg}</div></div>
      </div>
      <div className="pill">{dir === 'en' ? 'Ma’nosini toping' : 'Inglizchasini toping'}</div>
      <div className="qword">{cur ? (dir === 'en' ? cur.word : cur.uz) : ''}</div>
      <div className="opts">
        {options.map((o) => {
          const cls = picked === null ? 'opt' : o.id === cur?.id ? 'opt right' : o.id === picked ? 'opt bad' : 'opt';
          return <button key={o.id} className={cls} disabled={picked !== null} onClick={() => answer(o.id)}>{o.text}</button>;
        })}
      </div>
    </div>
  );
}
