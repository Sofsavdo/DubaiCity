import { ArrowRight, BookOpen, Headphones, Play } from 'lucide-react';
import { useState } from 'react';
import type { Item } from '../content/lessons/types';
import { checkItem } from '../lib/lessons';
import { estimate, loadSkills, saveSkill, setFor } from '../lib/skillCheck';
import { recordTestAnswers } from '../lib/adaptive/record';
import { say, stopSpeaking, ttsSupported } from '../lib/speech';
import { useProfile } from '../lib/store';

type Phase = 'intro' | 'reading' | 'listening' | 'done';
const MAX_PLAYS = 2;

function Questions({ items, answers, onPick, show }: { items: Item[]; answers: (number | undefined)[]; onPick: (i: number, v: number) => void; show: boolean }) {
  return (
    <div>
      {items.map((it, i) => it.kind === 'choice' && (
        <div className="q" key={i}>
          <p><b>{i + 1}. {it.prompt}</b></p>
          <div className="stack">
            {it.options.map((o, k) => (
              <button key={o} type="button" disabled={show} className={`opt ${show ? (k === it.answer ? 'right' : answers[i] === k ? 'bad' : '') : answers[i] === k ? 'sel' : ''}`} onClick={() => onPick(i, k)}>{o}</button>
            ))}
          </div>
          {show && <p className="muted" style={{ marginTop: 6 }}>{it.explainUz}</p>}
        </div>
      ))}
    </div>
  );
}

/** Reading + Listening skill check, separate from the grammar/vocabulary placement. */
export default function SkillCheck() {
  const p = useProfile();
  const set = setFor(p.level);
  const [phase, setPhase] = useState<Phase>('intro');
  const [rAns, setRAns] = useState<(number | undefined)[]>([]);
  const [lAns, setLAns] = useState<(number | undefined)[]>([]);
  const [rShown, setRShown] = useState(false);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tts = typeof window !== 'undefined' && ttsSupported();
  const prev = loadSkills();

  const score = (items: Item[], ans: (number | undefined)[]) => items.filter((it, i) => checkItem(it, ans[i])).length;
  const finishReading = () => {
    const c = score(set.reading.questions, rAns);
    saveSkill('reading', estimate(set.level, c, set.reading.questions.length), c, set.reading.questions.length);
    recordTestAnswers('reading', set.reading.questions.map((it, i) => ({ type: 'mcq' as const, correct: checkItem(it, rAns[i]) })), set.level, p.level);
    setRShown(true);
  };
  const finishListening = () => {
    const c = score(set.listening.questions, lAns);
    saveSkill('listening', estimate(set.level, c, set.listening.questions.length), c, set.listening.questions.length);
    recordTestAnswers('listening', set.listening.questions.map((it, i) => ({ type: 'mcq' as const, correct: checkItem(it, lAns[i]) })), set.level, p.level);
    stopSpeaking(); setPhase('done');
  };
  const play = async () => {
    if (plays >= MAX_PLAYS || playing) return;
    setPlaying(true); setPlays((n) => n + 1);
    try { await say(set.listening.script, { cancelled: false }, 'en-GB', { pitch: 1, rate: 0.92, volume: 1 }); } finally { setPlaying(false); }
  };
  const skills = loadSkills();

  return (
    <div>
      <section className="card">
        <h2>Ko‘nikmalar tekshiruvi</h2>
        <p>Daraja testi grammatika va so‘z boyligini o‘lchaydi. Bu tekshiruv esa <b>Reading</b> va <b>Listening</b> darajangizni alohida baholaydi — ular bir-biridan farq qilishi tabiiy.</p>
        <p className="row"><span className="pill">To‘plam: {set.level}</span><span className="pill">~10 daqiqa</span>{p.level ? <span className="pill" style={{ whiteSpace: 'normal' }}>Daraja testi: {p.level}</span> : <a className="btn sm" href="#/placement">Avval daraja testi</a>}</p>
        <p className="muted" style={{ fontSize: 13 }}>Natija taxminiy (pilot, metodist tekshiruvi kutilmoqda): 4 savoldan kamida 3 tasi to‘g‘ri bo‘lsa — {set.level}, aks holda bir pog‘ona past deb olinadi. Bu rasmiy CEFR yoki IELTS natijasi emas.</p>
        {phase === 'intro' && <button className="btn primary" onClick={() => setPhase('reading')}>Boshlash <ArrowRight size={14} /></button>}
      </section>

      {phase === 'reading' && (
        <section className="card">
          <h3><BookOpen size={18} /> Reading · {set.reading.title}</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{set.reading.text}</p>
          <Questions items={set.reading.questions} answers={rAns} show={rShown} onPick={(i, v) => setRAns((a) => { const n = [...a]; n[i] = v; return n; })} />
          {!rShown
            ? <button className="btn primary" disabled={rAns.filter((x) => x !== undefined).length < set.reading.questions.length} onClick={finishReading}>Javoblarni tekshirish</button>
            : <button className="btn primary" onClick={() => setPhase('listening')}>Listening qismiga o‘tish <ArrowRight size={14} /></button>}
        </section>
      )}

      {phase === 'listening' && (
        <section className="card">
          <h3><Headphones size={18} /> Listening · {set.listening.title}</h3>
          {tts ? (
            <>
              <p className="muted">Matnni {MAX_PLAYS} martagacha eshitishingiz mumkin. Ovoz brauzer sintezatori orqali (sifati qurilmaga bog‘liq).</p>
              <button className="btn" disabled={plays >= MAX_PLAYS || playing} onClick={() => void play()}><Play size={14} /> {playing ? 'O‘qilmoqda…' : `Eshitish (${MAX_PLAYS - plays} marta qoldi)`}</button>
              <Questions items={set.listening.questions} answers={lAns} show={false} onPick={(i, v) => setLAns((a) => { const n = [...a]; n[i] = v; return n; })} />
              <button className="btn primary" disabled={plays === 0 || lAns.filter((x) => x !== undefined).length < set.listening.questions.length} onClick={finishListening}>Natijani ko‘rish</button>
            </>
          ) : (
            <>
              <p className="bad">Bu brauzer ovozli o‘qishni qo‘llamaydi, shuning uchun Listening qismini o‘tkazib bo‘lmaydi.</p>
              <button className="btn" onClick={() => setPhase('done')}>Natijaga o‘tish</button>
            </>
          )}
        </section>
      )}

      {(phase === 'done' || (phase === 'intro' && (prev.reading || prev.listening))) && (
        <section className="card">
          <h3>{phase === 'done' ? 'Natija' : 'Oldingi natija'}</h3>
          <div className="stack">
            {([
              ['General English (grammatika + so‘z)', p.level ?? '—'],
              [`Reading${skills.reading ? ` · ${skills.reading.correct}/${skills.reading.total}` : ''}`, skills.reading?.level ?? '—'],
              [`Listening${skills.listening ? ` · ${skills.listening.correct}/${skills.listening.total}` : ''}`, skills.listening?.level ?? '—'],
            ] as const).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)' }}><span>{k}</span><b>{v}</b></div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>Taxminiy daraja. Natijalar qurilmangizda saqlanadi va “Bugungi reja”dagi Reading/Listening vazifalariga ta’sir qiladi. IELTS tayyorgarligi bu yerda alohida o‘lchanmaydi.</p>
          <div className="row"><a className="btn primary" href="#/learn">Darslarga o‘tish</a><a className="btn" href="#/">Bosh sahifa</a></div>
        </section>
      )}
    </div>
  );
}
