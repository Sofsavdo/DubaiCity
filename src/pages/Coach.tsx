import { Bot, Lock, Mic, Send, Square, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { JoinForm } from '../components/JoinForm';
import { PERSONAS, personaById, type CoachEmotion, type PersonaId } from '../content/personas';
import { getAccount, type Account } from '../lib/account';
import { coachSay, coachStatus, newTurnId, prosodyFor, type CoachReply, type CoachStatus } from '../lib/coach';
import { listenTurn, say, SpeechError, stopSpeaking, sttSupported, ttsSupported } from '../lib/speech';
import { useProfile } from '../lib/store';
import { addMistake } from '../lib/mistakes';
import { logErrors } from '../lib/adaptive/store';
import { isTaxonomyId, type TaxonomyId } from '../lib/adaptive/taxonomy';

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
const PHASE_UZ: Record<Phase, string> = { idle: 'Navbat sizda', listening: 'Tinglayapman…', thinking: 'O‘ylayapman…', speaking: 'Gapiryapman…', error: 'Xato' };
const EMO_UZ: Record<CoachEmotion, string> = { neutral: 'xotirjam', happy: 'xursand', laugh: 'kulyapti', angry: 'jahli chiqdi', disappointed: 'hafsalasi pir', impressed: 'hayratda', serious: 'jiddiy', sarcastic: 'kinoyali' };
const OPENERS: Record<PersonaId, string> = {
  friendly: 'Hi! I’m your coach. Tell me a little about yourself. What’s your name and where are you from?',
  examiner: 'Good afternoon. My name is Bandi. Can you tell me your full name, please? … Thank you. Do you work or are you a student?',
  savage: 'Oh great, another “I am agree” champion? Prove me wrong. Tell me about your weekend — in proper English, please.',
  comedy: 'Hey hey! Quick question: if your phone could talk, what would it complain about the most?',
  debate: 'Here’s my claim: homework should be banned in schools. I bet you can’t change my mind. Go ahead.',
};

interface Msg { role: 'learner' | 'coach'; text: string; reply?: CoachReply }

export default function Coach() {
  const p = useProfile();
  const [status, setStatus] = useState<CoachStatus | null>(null);
  const [acc, setAcc] = useState<Account | null>(() => getAccount());
  const [persona, setPersona] = useState<PersonaId>('friendly');
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [err, setErr] = useState('');
  const [text, setText] = useState('');
  const [interim, setInterim] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);
  const endRef = useRef<(() => void) | null>(null);
  const pending = useRef<{ text: string; turnId: string } | null>(null);
  const started = msgs.length > 0;
  const info = personaById(persona)!;
  const stt = typeof window !== 'undefined' && sttSupported();
  const tts = typeof window !== 'undefined' && ttsSupported();

  useEffect(() => { void coachStatus().then(setStatus); return () => stopSpeaking(); }, []);

  const speak = async (line: string, emo: CoachEmotion) => {
    if (!voiceOn || !tts) return;
    setPhase('speaking');
    const pr = prosodyFor(info.voice, emo);
    try { await say(line, { cancelled: false }, 'en-GB', pr); } finally { setPhase((ph) => (ph === 'speaking' ? 'idle' : ph)); }
  };

  const start = () => {
    const opener = OPENERS[mode === 'exam' ? 'examiner' : persona];
    setMsgs([{ role: 'coach', text: opener }]);
    void speak(opener, 'neutral');
  };

  const send = async (learnerText: string, retry = false) => {
    const t = learnerText.trim();
    if (!t || phase === 'thinking') return;
    stopSpeaking(); setErr('');
    const turn = retry && pending.current ? pending.current : { text: t, turnId: newTurnId() };
    pending.current = turn;
    if (!retry) setMsgs((m) => [...m, { role: 'learner', text: t }]);
    setText(''); setPhase('thinking');
    try {
      const history = msgs.map((m) => ({ role: m.role, text: m.text }));
      const r = await coachSay({ persona, mode, adult: p.adult, level: p.level, history, text: turn.text, turnId: turn.turnId });
      pending.current = null;
      if (r.correction) {
        const tax: TaxonomyId[] = r.correction.errorType && isTaxonomyId(r.correction.errorType) ? [r.correction.errorType] : [];
        logErrors(tax);
        try { addMistake('coach', { kind: 'fix', wrong: r.correction.wrong, right: r.correction.right, whyUz: r.correction.whyUz }, tax); } catch { /* not a usable pair */ }
      }
      const line = [r.reply, r.question].filter(Boolean).join(' ');
      setMsgs((m) => [...m, { role: 'coach', text: line, reply: r }]);
      setPhase('idle');
      await speak(line, r.emotion);
    } catch (e) {
      setErr((e as Error).message); setPhase('error');
    }
  };

  const listen = async () => {
    if (phase === 'listening') { endRef.current?.(); return; }
    stopSpeaking(); setErr(''); setInterim(''); setPhase('listening');
    try {
      const r = await listenTurn({ silenceMs: 1500, maxMs: 45_000, noSpeechMs: 8000, lang: 'en-US', onInterim: setInterim, signal: { cancelled: false }, endRef });
      setInterim(''); setPhase('idle');
      if (r.text.trim()) await send(r.text);
    } catch (e) {
      const code = e instanceof SpeechError ? e.code : 'unstable';
      setErr(code === 'denied' ? 'Mikrofonga ruxsat berilmagan.' : code === 'nomic' ? 'Mikrofon topilmadi.' : 'Nutqni tanib bo‘lmadi. Yozib yuborishingiz mumkin.');
      setPhase('error');
    }
  };

  const corrections = msgs.flatMap((m) => (m.reply?.correction ? [m.reply.correction] : []));

  return (
    <div>
      <section className="card">
        <h2><Bot size={22} /> AI ustoz</h2>
        <p>Beshta xarakterdan birini tanlang va ingliz tilida gaplashing: ustoz javob beradi, xatoingizni tuzatadi va keyingi savolni beradi.</p>
        {status && !status.ai && <p className="bad">AI ustoz hali ulanmagan: administrator AI kalitini va xarajat chegarasini sozlamaguncha suhbat ishlamaydi. Xarakterlarni ko‘rib chiqishingiz mumkin.</p>}
        {status && status.ai && !status.coach && <p className="bad">AI ulangan, lekin umumiy kunlik xarajat chegarasi hali belgilanmagan — xavfsizlik uchun suhbat yopiq.</p>}
        <p className="muted" style={{ fontSize: 13 }}>Hozir navbatma-navbat suhbat: nutqingiz brauzerda matnga aylanadi, javob brauzer ovozida o‘qiladi (ovoz va his-tuyg‘u sifati qurilmaga bog‘liq). Uzluksiz real vaqt ovozi va tabiiy hissiyotli ovozlar AI provayder ulangach sinovdan o‘tkaziladi.</p>
      </section>

      {!started && (
        <section className="card">
          <h3>Xarakterni tanlang</h3>
          <div className="stack">
            {PERSONAS.map((x) => {
              const locked = x.adultOnly && !p.adult;
              return (
                <button key={x.id} type="button" className={`opt ${persona === x.id ? 'sel' : ''}`} style={{ borderLeft: `6px solid ${x.accent}` }} disabled={locked} onClick={() => setPersona(x.id)}>
                  <b>{locked && <Lock size={14} />} {x.nameUz} · {x.name}</b>
                  <div className="evidence">{x.descUz}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{locked ? 'Ochish uchun Profil → “Men 18 yoshdan oshganman” ni belgilang.' : x.audienceUz}</div>
                </button>
              );
            })}
          </div>
          <p className="row" style={{ marginTop: 12 }}>
            <button type="button" className={`chipbtn ${mode === 'practice' ? 'on' : ''}`} onClick={() => setMode('practice')}>Mashq</button>
            <button type="button" className={`chipbtn ${mode === 'exam' ? 'on' : ''}`} onClick={() => setMode('exam')}>Imtihon rejimi (faqat qattiqqo‘l imtihonchi)</button>
          </p>
          {!acc
            ? <JoinForm onJoined={setAcc} text="AI ustoz bilan gaplashish uchun laqab tanlang (kunlik limit shu laqabga hisoblanadi)." />
            : <button className="btn primary" disabled={!status?.coach} onClick={start}>Suhbatni boshlash</button>}
        </section>
      )}

      {started && (
        <section className="card" style={{ borderTop: `6px solid ${info.accent}` }}>
          <p className="row">
            <span className="pill" style={{ whiteSpace: 'normal' }}><Bot size={14} /> {mode === 'exam' ? 'Qattiqqo‘l imtihonchi' : info.nameUz}</span>
            <span className="pill" aria-live="polite">{PHASE_UZ[phase]}</span>
            {tts && <button type="button" className="btn sm" onClick={() => { setVoiceOn((v) => !v); stopSpeaking(); }} aria-label={voiceOn ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}>{voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>}
          </p>
          <div className="stack" style={{ maxHeight: 420, overflowY: 'auto' }}>
            {msgs.map((m, i) => (
              <div key={i} className="q" style={{ textAlign: m.role === 'learner' ? 'right' : 'left' }}>
                <p style={{ margin: 0 }}><b>{m.role === 'learner' ? 'Siz' : 'Ustoz'}{m.reply ? ` · ${EMO_UZ[m.reply.emotion]}` : ''}:</b> {m.text}</p>
                {m.reply?.notice && <p className="muted" style={{ fontSize: 13 }}>{m.reply.notice}</p>}
                {m.reply?.correction && <p style={{ fontSize: 14 }}><span className="bad">«{m.reply.correction.wrong}»</span> → <span className="ok">«{m.reply.correction.right}»</span> <span className="muted">{m.reply.correction.whyUz}</span></p>}
              </div>
            ))}
            {phase === 'listening' && <p className="muted">{interim || '…'}</p>}
          </div>
          {err && <p className="bad">{err} {pending.current && <button className="btn sm" onClick={() => void send(pending.current!.text, true)}>Qayta yuborish</button>}</p>}
          <div className="row" style={{ marginTop: 10 }}>
            {stt && <button type="button" className={`btn ${phase === 'listening' ? 'primary' : ''}`} disabled={phase === 'thinking'} onClick={() => void listen()}>{phase === 'listening' ? <><Square size={16} /> Tugatdim</> : <><Mic size={16} /> Gapirish</>}</button>}
            {phase === 'speaking' && <button type="button" className="btn" onClick={() => { stopSpeaking(); setPhase('idle'); }}>Ustozni to‘xtatish</button>}
          </div>
          <form className="row" style={{ marginTop: 8 }} onSubmit={(e) => { e.preventDefault(); void send(text); }}>
            <input type="text" value={text} maxLength={800} placeholder="Yoki inglizcha yozing…" onChange={(e) => setText(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
            <button className="btn" disabled={!text.trim() || phase === 'thinking'} aria-label="Yuborish"><Send size={16} /></button>
          </form>
          <button type="button" className="btn" style={{ marginTop: 12 }} onClick={() => { stopSpeaking(); setMsgs([]); setPhase('idle'); setErr(''); pending.current = null; }}>Suhbatni tugatish</button>
          {corrections.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h3>Bu suhbatdagi tuzatishlar</h3>
              <ul>{corrections.map((c, i) => <li key={i}><span className="bad">{c.wrong}</span> → <span className="ok">{c.right}</span> <span className="muted">{c.whyUz}</span></li>)}</ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
