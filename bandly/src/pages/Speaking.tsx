import { useEffect, useRef, useState } from 'react';
import { Mascot, type Mood } from '../components/Mascot';
import { Examiner, summarize, type Summary, type TurnStat } from '../lib/examiner';
import { listenTurn, say, stopSpeaking, sttSupported, type Signal, type TurnResult } from '../lib/speech';
import { saveResult } from '../lib/storage';
import { addXp, useProfile } from '../lib/store';

type Stage = 'intro' | 'live' | 'report';
type Status = 'speaking' | 'listening' | 'prep' | 'thinking';
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function Speaking() {
  const profile = useProfile();
  const supported = sttSupported();
  const [stage, setStage] = useState<Stage>('intro');
  const [textMode, setTextMode] = useState(!supported);
  const [caption, setCaption] = useState('');
  const [remark, setRemark] = useState('');
  const [status, setStatus] = useState<Status>('thinking');
  const [part, setPart] = useState(0);
  const [interim, setInterim] = useState('');
  const [prepLeft, setPrepLeft] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [err, setErr] = useState('');
  const [typed, setTyped] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [turns, setTurns] = useState<TurnStat[]>([]);
  const [timed, setTimed] = useState(true);

  const sig = useRef<Signal>({ cancelled: false });
  const endRef = useRef<(() => void) | null>(null);
  const textResolve = useRef<((r: TurnResult) => void) | null>(null);
  const prepSkip = useRef<(() => void) | null>(null);
  const textModeRef = useRef(textMode);
  textModeRef.current = textMode;

  useEffect(() => () => { sig.current.cancelled = true; stopSpeaking(); endRef.current?.(); }, []);

  const prep = () => new Promise<void>((resolve) => {
    setStatus('prep'); setPrepLeft(60);
    let left = 60;
    const id = setInterval(() => { left -= 1; setPrepLeft(left); if (left <= 0 || sig.current.cancelled) done(); }, 1000);
    function done() { clearInterval(id); prepSkip.current = null; resolve(); }
    prepSkip.current = done;
  });

  const getTurn = async (mono: boolean): Promise<TurnResult> => {
    const t0 = Date.now();
    const tick = setInterval(() => setElapsed((Date.now() - t0) / 1000), 250);
    try {
      if (!textModeRef.current) {
        try {
          return await listenTurn({ silenceMs: mono ? 6000 : 2300, maxMs: mono ? 125_000 : 60_000, noSpeechMs: 12_000, onInterim: setInterim, signal: sig.current, endRef });
        } catch (e) {
          setErr((e as Error).message + '. Yozma rejimga o‘tildi.');
          setTextMode(true); textModeRef.current = true; setTimed(false);
        }
      }
      return await new Promise<TurnResult>((resolve) => { textResolve.current = resolve; });
    } finally { clearInterval(tick); }
  };

  const run = async () => {
    setErr(''); setSummary(null); setTimed(!textMode);
    sig.current = { cancelled: false };
    const ex = new Examiner(Math.random, profile.hardMode);
    setStage('live');
    let step = ex.start();
    while (!sig.current.cancelled) {
      setPart(step.part); setInterim(''); setTyped(''); setElapsed(0);
      if (step.remark) { setRemark(step.remark); setStatus('speaking'); await say(step.remark, sig.current); setRemark(''); }
      setCaption(step.say); setStatus('speaking');
      await say(step.say, sig.current);
      if (sig.current.cancelled) return;
      if (step.wait === 'end') break;
      if (step.wait === 'prep') { await prep(); if (sig.current.cancelled) return; step = ex.beginMonologue(); continue; }
      setStatus('listening');
      const r = await getTurn(step.wait === 'monologue');
      if (sig.current.cancelled) return;
      setStatus('thinking');
      step = ex.answer(r.text, textModeRef.current ? 0 : r.seconds, r.latencyMs);
    }
    if (sig.current.cancelled) return;
    const useTimed = !textModeRef.current;
    const s = summarize(ex.turns, useTimed);
    setTurns(ex.turns); setSummary(s); setTimed(useTimed); setStage('report');
    saveResult({ kind: 'speaking', title: 'Speaking: jonli suhbat', correct: ex.turns.filter((t) => t.words >= 12).length, total: ex.turns.length });
    addXp(30);
  };

  const abort = () => { sig.current.cancelled = true; stopSpeaking(); endRef.current?.(); prepSkip.current?.(); setStage('intro'); };
  const submitText = () => { if (!typed.trim()) return; textResolve.current?.({ text: typed.trim(), seconds: 0, latencyMs: 0 }); textResolve.current = null; };

  if (stage === 'intro') {
    return (
      <div>
        <div className="card hero">
          <Mascot mood="think" size={110} />
          <div>
            <h2 style={{ margin: 0 }}>Speaking: jonli suhbat</h2>
            <p>Ustoz Bandi siz bilan IELTS tartibida gaplashadi: Part 1 (tanishuv), Part 2 (1 daqiqa tayyorgarlik va monolog), Part 3 (muhokama). U gapiradi, siz ovoz bilan javob berasiz.</p>
            <p className="evidence">
              Ovozingiz <b>yozib olinmaydi va saqlanmaydi</b>. Nutqni matnga o‘girishni brauzeringiz xizmati bajaradi (Chrome, Edge, Safari qo‘llaydi; bu xizmat ovozni o‘z serveriga yuborishi mumkin). Naushnik ishlatsangiz, ustoz ovozi mikrofonga kirmaydi.
            </p>
            {!supported && <p className="notice">Brauzeringiz nutqni tanishni qo‘llamaydi. Yozma rejim ishlaydi; Chrome yoki Safari'da ovozli rejim bor.</p>}
            <label><input type="checkbox" checked={textMode} disabled={!supported} onChange={(e) => setTextMode(e.target.checked)} /> Mikrofonsiz rejim (yozib javob berish)</label>
            {profile.hardMode && <p className="evidence">Qattiq rejim yoqilgan: ustoz to‘ldiruvchi tovushlar va qisqa javoblarga hazil bilan e’tiroz bildiradi.</p>}
            <div style={{ marginTop: 10 }}><button className="btn primary" onClick={() => void run()}>Suhbatni boshlash</button></div>
          </div>
        </div>
        <div className="card">
          <h3>Hozirgi holat</h3>
          <p>Ustozning savollari va tartibi tayyor, suhbat jonli ishlaydi. Ustozning javoblari hozircha <b>qoidaviy</b> (AI emas): u savollarni tartib bilan beradi, qisqa javobda "batafsilroq ayting" deydi. Talaffuz va grammatika baholanmaydi. AI ulanganda ustoz javobingizga qarab erkin savol beradi va 4 mezon bo‘yicha baholaydi.</p>
        </div>
      </div>
    );
  }

  if (stage === 'report' && summary) {
    return (
      <div>
        <div className="card hero">
          <Mascot mood="happy" size={96} />
          <div>
            <h2 style={{ margin: 0 }}>Suhbat tugadi</h2>
            <p style={{ margin: '4px 0' }}>+30 XP. Quyidagi baho <b>taxminiy</b>: faqat javob uzunligi, to‘xtashlar va so‘z xilma-xilligi bo‘yicha.</p>
            <div className="row">
              <span className="pill">Fluency (taxm.): <b>{summary.fluencyBand.toFixed(1)}</b></span>
              <span className="pill">Lexical (taxm.): <b>{summary.lexicalBand.toFixed(1)}</b></span>
              <span className="pill">Grammar va Pronunciation: AI kerak</span>
            </div>
          </div>
        </div>
        <div className="card">
          <table className="data">
            <tbody>
              <tr><td>Javoblar soni</td><td>{summary.answers}</td></tr>
              <tr><td>Jami so‘zlar / o‘rtacha javob</td><td>{summary.words} / {summary.avgWords.toFixed(1)}</td></tr>
              <tr><td>Nutq tezligi</td><td>{timed && summary.wpm !== null ? `${summary.wpm} so‘z/daqiqa` : 'yozma rejimda o‘lchanmaydi'}</td></tr>
              <tr><td>To‘ldiruvchilar (um, uh)</td><td>har 100 so‘zga {summary.fillerPer100.toFixed(1)}</td></tr>
              <tr><td>Javobdan oldin o‘ylash</td><td>{summary.avgLatencySec !== null ? `${summary.avgLatencySec.toFixed(1)} s` : '—'}</td></tr>
              <tr><td>So‘z xilma-xilligi</td><td>{(summary.lexicalRatio * 100).toFixed(0)}%</td></tr>
            </tbody>
          </table>
          <h3>Tavsiyalar</h3>
          <ul>{summary.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
        <div className="card">
          <details>
            <summary>Matn ko‘rinishi (faqat shu sahifada, saqlanmaydi)</summary>
            {turns.map((t, i) => <p key={i}><b>Part {t.part}:</b> {t.q}<br /><i>{t.text || '(javob yo‘q)'}</i></p>)}
          </details>
          <div className="row" style={{ marginTop: 10 }}><button className="btn primary" onClick={() => setStage('intro')}>Qayta o‘tish</button></div>
        </div>
      </div>
    );
  }

  const mood: Mood = remark ? 'angry' : status === 'speaking' ? 'happy' : status === 'listening' ? 'idle' : 'think';
  return (
    <div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="pill">{part === 0 ? 'Tanishuv' : `Part ${part}`}</span>
          <span className="pill">{status === 'speaking' ? 'Ustoz gapiryapti…' : status === 'listening' ? 'Sizni tinglayapti…' : status === 'prep' ? 'Tayyorgarlik' : 'O‘ylayapti…'}</span>
          <button className="btn" onClick={abort}>Tugatish</button>
        </div>
        <div className="hero" style={{ margin: '12px 0' }}>
          <div className={`mascot-wrap ${status}`}><Mascot mood={mood} size={110} /></div>
          <div style={{ flex: 1 }}>
            {remark && <div className="bubble" style={{ marginBottom: 8 }}>{remark}</div>}
            <div className="bubble">{caption}</div>
          </div>
        </div>
        {err && <p className="notice">{err}</p>}

        {status === 'prep' && (
          <div className="row">
            <span className="timer">{mmss(prepLeft)}</span>
            <span className="evidence">Fikrlaringizni o‘ylab oling. Yozib olish mumkin emas: faqat xotirangizda tayyorlaning.</span>
            <button className="btn primary" onClick={() => prepSkip.current?.()}>Tayyorman</button>
          </div>
        )}

        {status === 'listening' && !textMode && (
          <div>
            <div className="bubble" style={{ minHeight: 48 }}>{interim || <span className="evidence">Gapiring…</span>}</div>
            <div className="row" style={{ marginTop: 10 }}>
              {part === 2 && <span className="timer">{mmss(elapsed)} / 2:00</span>}
              <button className="btn primary" onClick={() => endRef.current?.()}>Men tugatdim</button>
              <span className="evidence">Ikki soniya jim qolsangiz ham javob tugaydi.</span>
            </div>
          </div>
        )}

        {status === 'listening' && textMode && (
          <div>
            <textarea className="essay" style={{ minHeight: 110 }} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Javobingizni inglizcha yozing…" />
            <div className="row" style={{ marginTop: 10 }}><button className="btn primary" disabled={!typed.trim()} onClick={submitText}>Yuborish</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
