import { useEffect, useRef, useState } from 'react';
import { vocabById, vocabForLevel } from '../../content/vocab';
import { Mascot, type Mood } from '../../components/Mascot';
import { LockCard } from '../../components/Gate';
import { fmt } from '../../components/hooks';
import { pickSession } from '../../lib/srs';
import { addXp, consumeGame, getProfile, recordReview } from '../../lib/store';
import { shuffle } from '../../lib/vocabGame';
import { recordWordItem } from '../../lib/adaptive/record';

export default function Pairs() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [words, setWords] = useState<string[]>([]);
  const [rightOrder, setRightOrder] = useState<string[]>([]);
  const [selL, setSelL] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);
  const [earned, setEarned] = useState(0);
  const [mood, setMood] = useState<Mood>('idle');
  const [locked, setLocked] = useState(false);
  const mistakesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    if (!consumeGame()) { setLocked(true); return; }
    const ids = pickSession(vocabForLevel(getProfile().level).map((w) => w.id), getProfile().srs, Date.now(), 6);
    setWords(ids);
    setRightOrder(shuffle(ids));
    setSelL(null); setMatched([]); setMistakes({}); mistakesRef.current = {}; setElapsed(0); setMood('idle');
    setPhase('play');
  }

  function pickRight(id: string) {
    if (!selL || matched.includes(id)) return;
    if (id === selL) {
      recordReview(id, !mistakesRef.current[id]);
      recordWordItem(id, !mistakesRef.current[id]);
      const next = [...matched, id];
      setMatched(next);
      setSelL(null);
      setMood('happy');
      if (next.length === words.length) {
        const total = Object.values(mistakesRef.current).reduce((a, b) => a + b, 0);
        const xp = Math.max(10, 40 - total * 4 - Math.floor(elapsed / 10) * 2);
        setEarned(xp);
        addXp(xp);
        setPhase('end');
      }
    } else {
      mistakesRef.current = { ...mistakesRef.current, [selL]: (mistakesRef.current[selL] ?? 0) + 1 };
      setMistakes(mistakesRef.current);
      setWrongFlash(id);
      setMood('sad');
      setTimeout(() => setWrongFlash(null), 400);
      setSelL(null);
    }
  }

  if (locked) return <LockCard track="exam" reason="Bugungi bepul o‘yinlar tugadi. Istalgan obuna bilan o‘yinlar cheksiz." />;

  if (phase === 'intro') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood="idle" size={110} /></div>
        <h2>Juftlik</h2>
        <p>Chapdagi inglizcha so‘zni tanlang, keyin o‘ng tomondan uning o‘zbekcha ma’nosini toping. Tez va xatosiz bo‘lsa ko‘proq XP.</p>
        <button className="btn primary" onClick={start}>Boshlash</button>
      </div>
    );
  }

  if (phase === 'end') {
    const total = Object.values(mistakes).reduce((a, b) => a + b, 0);
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Mascot mood="happy" size={110} /></div>
        <h2>Hammasi topildi!</h2>
        <p>Vaqt: {fmt(elapsed)} · Xatolar: {total} · <b>+{earned} XP</b></p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={start}>Yana o‘ynash</button>
          <a className="btn" href="#/games">O‘yinlar</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="timer">{fmt(elapsed)}</span>
        <Mascot mood={mood} size={56} />
        <span className="pill">{matched.length} / {words.length}</span>
      </div>
      <div className="pairs" style={{ marginTop: 10 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {words.map((id) => (
            <button key={id} className={`opt ${matched.includes(id) ? 'done' : selL === id ? 'sel' : ''}`} onClick={() => setSelL(id)}>{vocabById[id].word}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {rightOrder.map((id) => (
            <button key={id} className={`opt ${matched.includes(id) ? 'done' : wrongFlash === id ? 'bad' : ''}`} onClick={() => pickRight(id)}>{vocabById[id].uz}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
