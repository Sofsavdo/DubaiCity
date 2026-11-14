import { Lightbulb, Mic, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EvalCard } from '../components/EvalCard';
import { JoinForm } from '../components/JoinForm';
import { getAccount } from '../lib/account';
import { aiEnabled, aiEvaluateSpeaking, aiFollowup, type Evaluation } from '../lib/ai';
import { Mascot, type Mood } from '../components/Mascot';
import { capBand } from '../lib/progress';
import { reviewAll } from '../lib/speakingReview';
import { Examiner, summarize, type Summary, type TurnStat } from '../lib/examiner';
import { SpeechError, hasVoice, listenTurn, say, sayReaction, stopSpeaking, sttSupported, type MicStatus, type Signal, type TurnResult } from '../lib/speech';
import type { Reaction } from '../content/roasts';
import { PersonaPicker } from '../components/PersonaPicker';
import { detectSlip } from '../lib/roast';
import { saveResult } from '../lib/storage';
import { addXp, personaLevel, useProfile } from '../lib/store';

type Stage = 'intro' | 'live' | 'report';
type Status = 'speaking' | 'listening' | 'prep' | 'thinking';
const ACCENTS = [
  { id: 'en-US', label: 'AQSh (en-US)', hint: 'Ko‘pchilik uchun eng yaxshi tanish' },
  { id: 'en-GB', label: 'Britaniya (en-GB)', hint: 'IELTS talaffuziga yaqin' },
  { id: 'en-IN', label: 'Hind (en-IN)', hint: 'Janubiy Osiyo aksentini yaxshiroq tushunishi mumkin' },
] as const;
const readAccent = (): string => { try { return localStorage.getItem('bandly.stt') ?? 'en-US'; } catch { return 'en-US'; } };
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function Speaking() {
  const profile = useProfile();
  const supported = sttSupported();
  const [stage, setStage] = useState<Stage>('intro');
  const [textMode, setTextMode] = useState(!supported);
  const [caption, setCaption] = useState('');
  const [hint, setHint] = useState('');
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [flash, setFlash] = useState(false);
  const flashed = useRef(false);
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
  const [aiOn, setAiOn] = useState(false);
  const [acct, setAcct] = useState(getAccount());
  const [aiEval, setAiEval] = useState<Evaluation | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiErr, setAiErr] = useState('');
  const [accent, setAccent] = useState(readAccent);
  const [mic, setMic] = useState<MicStatus>('starting');
  const [review, setReview] = useState<string | null>(null);
  const reviewRes = useRef<((a: 'ok' | 'redo') => void) | null>(null);
  const forceText = useRef(false);
  const accentRef = useRef(accent);
  accentRef.current = accent;
  useEffect(() => { void aiEnabled().then(setAiOn); }, []);

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
    setMic('starting');
    try {
      if (!textModeRef.current) {
        try {
          const r = await listenTurn({
            silenceMs: mono ? 6000 : 2300, maxMs: mono ? 125_000 : 60_000, noSpeechMs: 12_000, lang: accentRef.current,
            onInterim: (t) => { setInterim(t); if (personaLevel() >= 1 && !flashed.current && detectSlip(t)) { flashed.current = true; setFlash(true); } },
            onStatus: setMic, signal: sig.current, endRef,
          });
          if (!forceText.current) return r;
        } catch (e) {
          const msg = e instanceof SpeechError ? e.message : 'Nutqni tanishda xato';
          setErr(`${msg}. Yozma rejimga o‘tildi, suhbat davom etadi.`);
        }
        setTextMode(true); textModeRef.current = true; setTimed(false); forceText.current = false;
      }
      return await new Promise<TurnResult>((resolve) => { textResolve.current = resolve; });
    } finally { clearInterval(tick); }
  };

  /** Ovozli javobdan keyin tanilgan matnni ko'rsatadi: noto'g'ri tushunilgan bo'lsa qayta aytish mumkin. */
  const confirmTurn = (text: string): Promise<'ok' | 'redo'> => new Promise((resolve) => {
    setReview(text);
    const finishWith = (a: 'ok' | 'redo') => { clearTimeout(timer); reviewRes.current = null; setReview(null); resolve(a); };
    const timer = setTimeout(() => finishWith('ok'), 3200);
    reviewRes.current = finishWith;
  });

  const run = async () => {
    setErr(''); setSummary(null); setAiEval(null); setAiState('idle'); setTimed(!textMode);
    const useAiNow = aiOn && !!getAccount();
    let aiAsked = 0;
    sig.current = { cancelled: false };
    const ex = new Examiner(Math.random, personaLevel(profile), profile.level);
    setStage('live');
    let step = ex.start();
    while (!sig.current.cancelled) {
      setPart(step.part); setInterim(''); setTyped(''); setElapsed(0); setFlash(false); flashed.current = false;
      if (step.reaction) { setReaction(step.reaction); setStatus('speaking'); await sayReaction(step.reaction, sig.current); if (sig.current.cancelled) return; }
      setCaption(step.say); setHint(ex.hintFor(step.say) ?? ''); setStatus('speaking');
      await say(step.say, sig.current);
      if (sig.current.cancelled) return;
      if (step.wait === 'end') break;
      if (step.wait === 'prep') { await prep(); if (sig.current.cancelled) return; step = ex.beginMonologue(); continue; }
      setReaction(null);
      let r: TurnResult;
      for (;;) {
        setStatus('listening'); setInterim('');
        r = await getTurn(step.wait === 'monologue');
        if (sig.current.cancelled) return;
        if (textModeRef.current || !r.text.trim()) break;
        setStatus('thinking');
        if ((await confirmTurn(r.text)) === 'ok') break;
        if (sig.current.cancelled) return;
      }
      setStatus('thinking');
      const before = ex.turns.length;
      step = ex.answer(r.text, textModeRef.current ? 0 : r.seconds, r.latencyMs);
      // AI: yaxshi javobdan keyin skriptdagi savol o'rniga javobga bog'liq savol (xatoda skript davom etadi)
      const last = ex.turns.at(-1);
      if (useAiNow && aiAsked < 4 && ex.turns.length > before && last && last.words >= 8 && step.wait === 'answer' && (step.part === 1 || step.part === 3)) {
        const r2 = await aiFollowup(last.q, last.text, personaLevel());
        if (sig.current.cancelled) return;
        if (r2.question) { aiAsked += 1; ex.overrideQuestion(r2.question); step = { ...step, say: r2.question }; }
        // Aniq grammatik xato topilgan bo'lsa qoidaviy tuzatish qoladi, aks holda AI reaksiyasi
        if (r2.reaction && !(step.reaction && detectSlip(last.text))) step = { ...step, reaction: r2.reaction };
      }
    }
    if (sig.current.cancelled) return;
    const useTimed = !textModeRef.current;
    const s = summarize(ex.turns, useTimed);
    setTurns(ex.turns); setSummary(s); setTimed(useTimed); setStage('report');
    if (useAiNow) { setAiState('loading'); aiEvaluateSpeaking(ex.turns.map((t) => ({ q: t.q, text: t.text }))).then((e) => { setAiEval(e); setAiState('idle'); }).catch((e: Error) => { setAiErr(e.message); setAiState('error'); }); }
    saveResult({ kind: 'speaking', title: 'Speaking: jonli suhbat', correct: ex.turns.filter((t) => t.words >= 12).length, total: ex.turns.length, band: capBand(Math.min(6.5, Math.round(((s.fluencyBand + s.lexicalBand) / 2) * 2) / 2), profile.level ?? undefined), level: profile.level ?? undefined });
    addXp(30);
  };

  const abort = () => { sig.current.cancelled = true; stopSpeaking(); endRef.current?.(); prepSkip.current?.(); reviewRes.current?.('ok'); setStage('intro'); };
  const switchToText = () => { forceText.current = true; endRef.current?.(); };
  const chooseAccent = (id: string) => { setAccent(id); try { localStorage.setItem('bandly.stt', id); } catch { /* */ } };
  const submitText = () => { if (!typed.trim()) return; textResolve.current?.({ text: typed.trim(), seconds: 0, latencyMs: 0 }); textResolve.current = null; };

  if (stage === 'intro') {
    return (
      <div>
        <div className="stage">
          <div className="hero">
            <Mascot mood="think" size={120} />
            <div>
              <span className="eyebrow"><Mic size={15} /> Jonli ovozli suhbat</span>
              <h2 style={{ marginBottom: 8 }}>Speaking: ustoz bilan suhbat</h2>
              <p style={{ color: 'var(--ink-2)' }}>Ustoz Bandi IELTS tartibida gaplashadi: Part 1 (tanishuv), Part 2 (1 daqiqa tayyorgarlik va monolog), Part 3 (muhokama). U gapiradi, siz ovoz bilan javob berasiz.</p>
              <div className="row">
                <span className="pill"><ShieldCheck size={14} /> Ovoz yozilmaydi</span>
                <span className="pill">Part 1 · 2 · 3</span>
                <span className="pill">~10 daqiqa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Ustoz xarakteri</h3>
          <PersonaPicker />
          {personaLevel(profile) >= 1 && !hasVoice('uz') && <p className="evidence">Qurilmangizda o‘zbekcha ovoz topilmadi: ustoz reaksiyalarni inglizcha ovozda aytadi, o‘zbekcha matn ekranda ko‘rinadi.</p>}
        </div>

        <div className="card">
          <h3>Boshlashdan oldin</h3>
          {!supported && <p className="notice">Brauzeringiz nutqni tanishni qo‘llamaydi. Yozma rejim ishlaydi; ovozli rejim uchun Chrome yoki Safari kerak.</p>}
          {aiOn && !acct && <JoinForm onJoined={setAcct} text="AI bilan suhbat va baho uchun laqab tanlang (parol shart emas). Laqabsiz ham qoidaviy ustoz bilan davom etish mumkin." />}
          {aiOn && acct && <p className="notice">AI yoqilgan: suhbatning <b>matni</b> (ovoz emas) javobingizga bog‘liq savol berish va baholash uchun AI provayderiga yuboriladi.</p>}
          <p className="evidence">Ovozingiz <b>yozib olinmaydi va saqlanmaydi</b>. Nutqni matnga o‘girishni brauzeringiz xizmati bajaradi (Chrome, Edge, Safari qo‘llaydi; bu xizmat ovozni o‘z serveriga yuborishi mumkin). Naushnik ishlatsangiz, ustoz ovozi mikrofonga kirmaydi.</p>
          <div style={{ margin: '12px 0' }}>
            <b style={{ fontSize: 14 }}>Nutqni tanish aksenti</b>
            <div className="tabs" style={{ margin: '8px 0 4px' }}>
              {ACCENTS.map((a) => <button key={a.id} className={`btn sm ${accent === a.id ? 'dark' : ''}`} onClick={() => chooseAccent(a.id)}>{a.label}</button>)}
            </div>
            <span className="evidence">{ACCENTS.find((a) => a.id === accent)?.hint}. Ustoz sizni noto‘g‘ri tushunsa, boshqa aksentni sinab ko‘ring.</span>
          </div>
          <p><label><input type="checkbox" checked={textMode} disabled={!supported} onChange={(e) => setTextMode(e.target.checked)} /> Mikrofonsiz rejim (yozib javob berish)</label></p>
          <button className="btn primary lg" onClick={() => void run()}><Mic size={18} /> Suhbatni boshlash</button>
          <p className="evidence" style={{ marginTop: 14 }}>
            Ustozning javoblari hozircha <b>qoidaviy</b>{aiOn ? ' (AI yoqilgan bo‘lsa, javobingizga bog‘liq savollar ham beradi)' : ' (AI hali ulanmagan)'}: savollarni tartib bilan beradi, qisqa javobda "batafsilroq ayting" deydi. Talaffuz va grammatika baholanmaydi.
          </p>
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
              {!aiEval && <span className="pill">{aiState === 'loading' ? 'AI baholayapti…' : 'Grammar va Pronunciation: AI kerak'}</span>}
            </div>
          </div>
        </div>
        {aiEval && <EvalCard ev={aiEval} title="AI baho (suhbat matni bo‘yicha)" />}
        {aiState === 'error' && <p className="notice">AI baho berolmadi: {aiErr}. Quyidagi qoidaviy tahlil ishlaydi.</p>}
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
          <h3>Javoblar tahlili</h3>
          <p className="evidence">Har bir javob bo‘yicha: xatolar, ishlatgan kuchli so‘z va iboralaringiz va «bunday aytsa yaxshiroq» namuna. Matn faqat shu sahifada ko‘rinadi, saqlanmaydi.</p>
        </div>
        {reviewAll(turns).map((r, i) => (
          <div className="card review" key={i}>
            <div className="row"><span className="pill">Part {r.part}</span><b>{r.q}</b></div>
            <div className="fb-block"><small>Sizning javobingiz</small><p>{r.text || '(javob yo‘q)'}</p></div>
            {r.lengthNote && <p className="fb-line">• {r.lengthNote}</p>}
            {r.issues.map((x) => <div key={x.id} className="fb-line"><b><del>{x.wrong}</del> → <ins>{x.right}</ins></b><br /><span>{x.ruleUz}</span></div>)}
            {(r.advanced.length > 0 || r.phrases.length > 0) && <p className="fb-line ok">Yaxshi: {[...r.phrases, ...r.advanced].map((w) => <span key={w} className="chip-ok">{w}</span>)}</p>}
            {r.model && (
              <div className="fb-block up">
                <small><Sparkles size={13} /> Bunday aytsa yaxshiroq (namuna)</small>
                <p>{r.model.model}</p>
                <p className="fb-line">{r.model.phrases.map((w) => <span key={w} className="chip-up">{w}</span>)}</p>
                <p className="fb-line"><Lightbulb size={14} style={{ verticalAlign: -2 }} /> {r.model.tipUz}</p>
              </div>
            )}
          </div>
        ))}
        <div className="card">
          <div className="row" style={{ marginTop: 10 }}><button className="btn primary" onClick={() => setStage('intro')}>Qayta o‘tish</button></div>
        </div>
      </div>
    );
  }

  const EMO: Record<Reaction['emotion'], Mood> = { angry: 'angry', laugh: 'laugh', disappointed: 'sad', impressed: 'impressed', happy: 'happy' };
  const mood: Mood = reaction && status === 'speaking' ? EMO[reaction.emotion] : flash && status === 'listening' ? 'angry' : status === 'speaking' ? 'idle' : status === 'listening' ? 'listen' : 'think';
  const statusLabel = status === 'speaking' ? 'Ustoz gapiryapti' : status === 'listening' ? 'Sizni tinglayapti' : status === 'prep' ? 'Tayyorgarlik vaqti' : 'O‘ylayapti';
  return (
    <div>
      <div className="stage">
        <div className="stage-top">
          <span className="pill">{part === 0 ? 'Tanishuv' : `Part ${part}`}</span>
          <span className={`pill ${status === 'listening' ? 'ok' : ''}`}>{statusLabel}</span>
          <button className="btn sm" onClick={abort}>Tugatish</button>
        </div>
        <div className="stage-center">
          <div className={`mascot-wrap ${status}`}><Mascot mood={mood} size={150} talking={status === 'speaking'} /></div>
          {reaction && <div className="bubble" style={{ maxWidth: 640 }}><b>{reaction.uz}</b><div className="evidence">{reaction.en}</div></div>}
          <div className="say">{caption}</div>
          {hint && <p className="hint-uz"><b>O‘zbekcha:</b> {hint}</p>}
          {status === 'listening' && !textMode && <span className="wave" aria-hidden="true" style={{ opacity: mic === 'speech' ? 1 : .35 }}><i /><i /><i /><i /><i /><i /><i /></span>}
          {status === 'listening' && !textMode && <span className={`pill ${mic === 'starting' ? '' : 'ok'}`}>{mic === 'starting' ? 'Mikrofon ulanmoqda…' : mic === 'mic' ? 'Mikrofon tayyor, gapiring' : 'Eshityapman'}</span>}
          {err && <p className="notice">{err}</p>}
          {review !== null && (
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div className="transcript"><span className="evidence">Siz aytdingiz:</span><br /><b>{review}</b></div>
              <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
                <button className="btn primary" onClick={() => reviewRes.current?.('ok')}>To‘g‘ri, davom etish</button>
                <button className="btn" onClick={() => reviewRes.current?.('redo')}>Noto‘g‘ri tushundi, qayta aytaman</button>
              </div>
            </div>
          )}

          {status === 'prep' && (
            <div className="row" style={{ justifyContent: 'center' }}>
              <span className="timer">{mmss(prepLeft)}</span>
              <button className="btn primary" onClick={() => prepSkip.current?.()}>Tayyorman</button>
              <span className="evidence" style={{ width: '100%' }}>Fikrlaringizni o‘ylab oling. Hech narsa yozib olinmaydi.</span>
            </div>
          )}

          {status === 'listening' && !textMode && (
            <>
              <div className="transcript">{interim || <span className="evidence">Gapiring…</span>}</div>
              <div className="row" style={{ justifyContent: 'center' }}>
                {part === 2 && <span className="timer">{mmss(elapsed)} / 2:00</span>}
                <button className="btn primary lg" onClick={() => endRef.current?.()}>Men tugatdim</button>
              </div>
              <span className="evidence">Ikki soniya jim qolsangiz ham javob tugaydi.</span>
              <button className="btn sm" onClick={switchToText}>Mikrofon ishlamayaptimi? Yozib javob berish</button>
            </>
          )}

          {status === 'listening' && textMode && (
            <div style={{ width: '100%', maxWidth: 720 }}>
              <textarea className="essay" style={{ minHeight: 110 }} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Javobingizni inglizcha yozing…" />
              <div className="row" style={{ marginTop: 10, justifyContent: 'center' }}><button className="btn primary" disabled={!typed.trim()} onClick={submitText}>Yuborish</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
