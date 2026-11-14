import { ArrowLeft, CheckCircle2, Circle, Clapperboard, Ear, Headphones, Mic, PenLine, Play, Repeat, Square, Subtitles, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { scenes, type Scene } from '../content/scenes';
import { vocab } from '../content/vocab';
import { LEVEL_INFO } from '../lib/levels';
import { playClip, stopClip } from '../lib/clips';
import { SpeechError, listenTurn, say, sttSupported, type Signal } from '../lib/speech';
import { accuracy, cloze, coverage, sameWord, verdict, type Accuracy } from '../lib/shadow';
import { markStep, progressOf, type StepId } from '../lib/shadowStore';
import { addXp, markDone, recordReview, useProfile } from '../lib/store';
import { saveResult } from '../lib/storage';
import { Mascot } from '../components/Mascot';

const STEPS: { id: StepId; label: string; icon: LucideIcon; tip: string }[] = [
  { id: 'watch', label: 'Tinglash + subtitr', icon: Subtitles, tip: 'Avval butun sahnani subtitr bilan tinglang. Keyin tezlikni 0.75 ga tushirib, qiyin gaplarni qayta eshiting.' },
  { id: 'quiz', label: 'Subtitrsiz tinglash', icon: Ear, tip: 'Endi matnsiz: faqat quloq. IELTS Listening aynan shunday ishlaydi.' },
  { id: 'cloze', label: 'Bo‘shliqlar', icon: PenLine, tip: 'Tushib qolgan so‘zlarni eshitib yozing. Imlo ham hisobga olinadi.' },
  { id: 'shadow', label: 'Shadowing', icon: Repeat, tip: 'Gapni eshiting va darhol, aynan o‘sha ritm va ohangda takrorlang. Bu talaffuz va ravonlikning eng tez yo‘li.' },
  { id: 'dictate', label: 'Dictant', icon: Headphones, tip: 'Gapni eshiting va to‘liq yozing. Quloq va imloni birga mashq qiladi.' },
  { id: 'retell', label: 'Qayta aytish', icon: Mic, tip: 'Sahnani o‘z so‘zlaringiz bilan 2–3 gapda gapirib bering. Matnni ko‘rmasdan, asosiy g‘oyalarni eslang.' },
];

/** Gap audiosini chaladi (tayyor neyron ovoz; bo'lmasa brauzer ovozi). */
function usePlayer() {
  const sig = useRef<Signal>({ cancelled: false });
  const [active, setActive] = useState<number | null>(null);
  const stop = () => { sig.current.cancelled = true; stopClip(); setActive(null); };
  useEffect(() => () => { sig.current.cancelled = true; stopClip(); }, []);
  const line = async (text: string, rate = 1) => {
    if (!(await playClip(text, sig.current, rate))) await say(text, sig.current, 'en-GB', { pitch: 1, rate: 0.9 * rate, volume: 1 });
  };
  const all = async (texts: string[], rate: number, pause = 450) => {
    stop(); sig.current = { cancelled: false };
    for (let i = 0; i < texts.length; i++) {
      if (sig.current.cancelled) return;
      setActive(i); await line(texts[i], rate);
      if (sig.current.cancelled) return;
      await new Promise((r) => setTimeout(r, pause));
    }
    setActive(null);
  };
  const one = async (text: string, rate = 1, idx?: number) => { stop(); sig.current = { cancelled: false }; if (idx !== undefined) setActive(idx); await line(text, rate); setActive(null); };
  return { active, all, one, stop, signal: sig };
}

function DiffView({ a }: { a: Accuracy }) {
  return <p className="diff">{a.ops.map((o, i) => o.t === 'same' ? <span key={i}>{o.want} </span> : o.t === 'extra' ? <del key={i}>{o.user} </del> : o.t === 'sub' ? <span key={i}><del>{o.user}</del><ins>{o.want}</ins> </span> : <ins key={i} className="miss">+ {o.want} </ins>)}</p>;
}

function Result({ pct, extra }: { pct: number; extra?: string }) {
  const v = verdict(pct);
  return <div className={`fb ${v.tone === 'ok' ? 'ok' : v.tone === 'near' ? 'near' : 'no'}`}><div className="fb-head"><b>{v.label}</b><span className="pill">{pct}%</span></div>{extra && <p className="fb-line">{extra}</p>}</div>;
}

// ------------------ Bosqichlar ------------------
function Watch({ sc, onDone }: { sc: Scene; onDone: () => void }) {
  const pl = usePlayer();
  const [rate, setRate] = useState(1);
  const [sub, setSub] = useState(true);
  const texts = sc.lines.map((l) => l.text);
  return (
    <div className="card">
      <div className="row">
        <button className="btn primary" onClick={() => { void pl.all(texts, rate).then(onDone); }}><Play size={16} /> Hammasini tinglash</button>
        <button className="btn" onClick={pl.stop}><Square size={14} /> To‘xtatish</button>
        <span className="price-tabs">{[1, 0.75, 0.6].map((r) => <button key={r} className={rate === r ? 'on' : ''} onClick={() => setRate(r)}>{r}x</button>)}</span>
        <label className="evidence"><input type="checkbox" checked={sub} onChange={(e) => setSub(e.target.checked)} /> Subtitr</label>
      </div>
      <div className="subs">
        {sc.lines.map((l, i) => (
          <button key={i} className={`subline ${pl.active === i ? 'now' : ''}`} onClick={() => void pl.one(l.text, rate, i)}>
            <b>{l.sp === 'A' ? sc.names.A : sc.names.B}</b>
            <span>{sub ? l.text : '• • •'}</span>
          </button>
        ))}
      </div>
      <h4>Muhim iboralar</h4>
      <div className="row">{sc.phrases.map((p) => (
        <button key={p.phrase} className="chip-up" title={`${p.uz}: ${p.example}`} onClick={() => { const w = vocab.find((x) => x.word === p.phrase); if (w) recordReview(w.id, false); void pl.one(p.phrase); }}>{p.phrase} <small>· {p.uz}</small></button>
      ))}</div>
      <p className="evidence">Gap ustiga bossangiz, o‘sha gap qayta eshittiriladi. Iborani bossangiz, takrorlash tizimiga qo‘shiladi.</p>
    </div>
  );
}

function Quiz({ sc, onDone }: { sc: Scene; onDone: (pct: number) => void }) {
  const pl = usePlayer();
  const [ans, setAns] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const right = sc.quiz.filter((q, i) => ans[i] === q.answer).length;
  const pct = Math.round((right / sc.quiz.length) * 100);
  return (
    <div className="card">
      <div className="row"><button className="btn primary" onClick={() => void pl.all(sc.lines.map((l) => l.text), 1)}><Play size={16} /> Tinglash (matnsiz)</button><button className="btn" onClick={pl.stop}><Square size={14} /> To‘xtatish</button></div>
      <p className="evidence">Matn ko‘rinmaydi. Tinglab, savollarga javob bering (istagancha qayta tinglash mumkin).</p>
      {sc.quiz.map((q, i) => (
        <div key={i} className="fb-block">
          <p><b>{i + 1}. {q.q}</b></p>
          <div className="opts">{q.options.map((o, k) => <button key={o} disabled={done} onClick={() => setAns((a) => ({ ...a, [i]: k }))} className={!done ? `opt ${ans[i] === k ? 'sel' : ''}` : k === q.answer ? 'opt right' : ans[i] === k ? 'opt bad' : 'opt'}>{o}</button>)}</div>
          {done && <p className="evidence">Dalil: “{sc.lines[q.line].text}”</p>}
        </div>
      ))}
      {!done ? <button className="btn primary" disabled={Object.keys(ans).length < sc.quiz.length} onClick={() => { setDone(true); onDone(pct); }}>Tekshirish</button> : <Result pct={pct} extra={`${right} / ${sc.quiz.length} to‘g‘ri`} />}
    </div>
  );
}

function Cloze({ sc, onDone }: { sc: Scene; onDone: (pct: number) => void }) {
  const pl = usePlayer();
  const n = sc.level === 'A2' ? 2 : sc.level === 'B1' ? 3 : 4;
  const items = useMemo(() => sc.lines.filter((l) => l.text.split(/\s+/).length >= 5).map((l) => ({ text: l.text, parts: cloze(l.text, n) })), [sc, n]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const all = items.flatMap((it, ii) => it.parts.map((p, pi) => ({ p, key: `${ii}-${pi}` })).filter((x) => typeof x.p !== 'string'));
  const right = all.filter((x) => sameWord(vals[x.key] ?? '', (x.p as { answer: string }).answer)).length;
  const pct = all.length ? Math.round((right / all.length) * 100) : 0;
  return (
    <div className="card">
      <p className="evidence">Har gapni eshiting va tushib qolgan so‘zlarni yozing.</p>
      {items.map((it, ii) => (
        <div key={ii} className="cloze-line">
          <button className="icon-btn" aria-label="Eshitish" onClick={() => void pl.one(it.text)}><Play size={16} /></button>
          <p>{it.parts.map((p, pi) => typeof p === 'string' ? <span key={pi}>{p}</span> : (
            <input key={pi} type="text" className={`blank ${checked ? (sameWord(vals[`${ii}-${pi}`] ?? '', p.answer) ? 'ok' : 'bad') : ''}`} value={vals[`${ii}-${pi}`] ?? ''} disabled={checked} size={Math.max(4, p.answer.length)} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setVals((v) => ({ ...v, [`${ii}-${pi}`]: e.target.value }))} />
          ))}</p>
          {checked && <p className="evidence">{it.text}</p>}
        </div>
      ))}
      {!checked ? <button className="btn primary" onClick={() => { setChecked(true); onDone(pct); }}>Tekshirish</button> : <Result pct={pct} extra={`${right} / ${all.length} so‘z to‘g‘ri`} />}
    </div>
  );
}

function useRecorder() {
  const [text, setText] = useState(''); const [live, setLive] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const [textMode, setTextMode] = useState(!sttSupported());
  const sig = useRef<Signal>({ cancelled: false }); const end = useRef<(() => void) | null>(null);
  useEffect(() => () => { sig.current.cancelled = true; end.current?.(); }, []);
  const accent = (() => { try { return localStorage.getItem('bandly.stt') ?? 'en-US'; } catch { return 'en-US'; } })();
  const listen = async (maxMs = 15000, silenceMs = 1600): Promise<string | null> => {
    setErr(''); setLive(''); setBusy(true); sig.current = { cancelled: false };
    try { const r = await listenTurn({ silenceMs, maxMs, noSpeechMs: 9000, lang: accent, onInterim: setLive, signal: sig.current, endRef: end }); setText(r.text); return r.text; }
    catch (e) { setErr(`${e instanceof SpeechError ? e.message : 'Nutqni tanishda xato'}. Yozma rejimga o‘tildi.`); setTextMode(true); return null; }
    finally { setBusy(false); }
  };
  return { text, setText, live, busy, err, textMode, setTextMode, listen, finish: () => end.current?.() };
}

function Shadow({ sc, onDone }: { sc: Scene; onDone: (pct: number) => void }) {
  const pl = usePlayer(); const rec = useRecorder();
  const lines = sc.lines.filter((l) => l.text.split(/\s+/).length >= 4);
  const [i, setI] = useState(0); const [res, setRes] = useState<Accuracy | null>(null); const [scores, setScores] = useState<number[]>([]);
  const cur = lines[i];
  const judge = (said: string) => { const a = accuracy(cur.text, said); setRes(a); setScores((s) => { const n = [...s]; n[i] = Math.max(n[i] ?? 0, a.pct); return n; }); };
  const go = (d: number) => { setI((x) => x + d); setRes(null); rec.setText(''); };
  const finished = i >= lines.length - 1 && res;
  return (
    <div className="card">
      <div className="row"><span className="pill">{i + 1} / {lines.length}</span><button className="btn sm" onClick={() => rec.setTextMode(!rec.textMode)}>{rec.textMode ? 'Mikrofon bilan' : 'Yozib takrorlash'}</button></div>
      <div className="shadow-line"><b>{cur.sp === 'A' ? sc.names.A : sc.names.B}</b><p className="ptext">{cur.text}</p></div>
      <div className="row">
        <button className="btn" onClick={() => void pl.one(cur.text, 1)}><Play size={15} /> Eshitish</button>
        <button className="btn" onClick={() => void pl.one(cur.text, 0.7)}>Sekin (0.7x)</button>
        {!rec.textMode && (rec.busy ? <button className="btn primary" onClick={rec.finish}><Square size={14} /> Tugatdim</button> : <button className="btn primary" onClick={() => { pl.stop(); void rec.listen().then((t) => { if (t !== null) judge(t); }); }}><Mic size={15} /> Takrorlang</button>)}
      </div>
      {rec.textMode && <div className="row" style={{ marginTop: 8 }}><input type="text" style={{ flex: 1, minWidth: 220 }} value={rec.text} placeholder="Eshitganingizni yozing..." onChange={(e) => rec.setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && rec.text.trim()) judge(rec.text); }} /><button className="btn" disabled={!rec.text.trim()} onClick={() => judge(rec.text)}>Tekshirish</button></div>}
      {rec.busy && <p className="evidence">Eshityapman… {rec.live}</p>}
      {rec.err && <p className="notice">{rec.err}</p>}
      {res && (<><Result pct={res.pct} extra={res.missing.length ? `Tushib qolgan/xato: ${res.missing.join(', ')}` : 'Hamma so‘z to‘g‘ri!'} /><div className="fb-block"><small>Siz aytdingiz</small><DiffView a={res} /></div></>)}
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" disabled={i === 0} onClick={() => go(-1)}>Oldingisi</button>
        {i < lines.length - 1 ? <button className="btn primary" disabled={!res} onClick={() => go(1)}>Keyingisi</button> : <button className="btn primary" disabled={!finished} onClick={() => onDone(Math.round(scores.reduce((a, b) => a + (b ?? 0), 0) / lines.length))}>Yakunlash</button>}
      </div>
      <p className="evidence">Aniqlik brauzer nutqni tanishi bo‘yicha: bu <b>talaffuz bahosi emas</b>, balki qanchalik tushunarli ekaningizning ko‘rsatkichi.</p>
    </div>
  );
}

function Dictate({ sc, onDone }: { sc: Scene; onDone: (pct: number) => void }) {
  const pl = usePlayer();
  const lines = useMemo(() => sc.lines.filter((l) => l.text.split(/\s+/).length >= 6).slice(0, 4), [sc]);
  const [i, setI] = useState(0); const [typed, setTyped] = useState(''); const [res, setRes] = useState<Accuracy | null>(null); const [plays, setPlays] = useState(0); const [scores, setScores] = useState<number[]>([]);
  const cur = lines[i];
  const check = () => { const a = accuracy(cur.text, typed); setRes(a); setScores((s) => [...s, a.pct]); };
  return (
    <div className="card">
      <div className="row"><span className="pill">{i + 1} / {lines.length}</span><span className="pill">Eshitish: {plays}/3</span></div>
      <div className="row"><button className="btn primary" disabled={plays >= 3 || !!res} onClick={() => { setPlays((p) => p + 1); void pl.one(cur.text, 1); }}><Play size={15} /> Eshitish</button></div>
      <textarea className="answer" rows={3} value={typed} disabled={!!res} placeholder="Eshitganingizni to‘liq yozing..." onChange={(e) => setTyped(e.target.value)} />
      {!res ? <button className="btn primary" disabled={!typed.trim()} onClick={check}>Tekshirish</button> : (
        <>
          <Result pct={res.pct} extra={res.missing.length ? `Xato/tushib qolgan: ${res.missing.join(', ')}` : 'Mukammal!'} />
          <div className="fb-block good"><small>To‘g‘ri matn</small><p>{cur.text}</p></div>
          {i < lines.length - 1 ? <button className="btn primary" onClick={() => { setI(i + 1); setTyped(''); setRes(null); setPlays(0); }}>Keyingisi</button> : <button className="btn primary" onClick={() => onDone(Math.round([...scores].reduce((a, b) => a + b, 0) / lines.length))}>Yakunlash</button>}
        </>
      )}
    </div>
  );
}

function Retell({ sc, onDone }: { sc: Scene; onDone: (pct: number) => void }) {
  const pl = usePlayer(); const rec = useRecorder();
  const [res, setRes] = useState<ReturnType<typeof coverage> | null>(null);
  const submit = (t: string) => { const c = coverage(t, sc.retell.points); setRes(c); onDone(c.pct); };
  return (
    <div className="card">
      <p className="evidence">Sahnani yana bir marta tinglang, so‘ng matnsiz, o‘z so‘zlaringiz bilan 2–3 gapda aytib bering. Asosiy g‘oyalarning qanchasini eslaganingiz tekshiriladi.</p>
      <div className="row"><button className="btn" onClick={() => void pl.all(sc.lines.map((l) => l.text), 1)}><Play size={15} /> Tinglash</button><button className="btn" onClick={pl.stop}><Square size={14} /> To‘xtatish</button><button className="btn sm" onClick={() => rec.setTextMode(!rec.textMode)}>{rec.textMode ? 'Mikrofon bilan' : 'Yozib aytish'}</button></div>
      {!rec.textMode ? (rec.busy ? <button className="btn primary" onClick={rec.finish}><Square size={14} /> Tugatdim</button> : <button className="btn primary" disabled={!!res} onClick={() => { pl.stop(); void rec.listen(60_000, 3500).then((t) => { if (t !== null) submit(t); }); }}><Mic size={15} /> Gapiring</button>)
        : <><textarea className="answer" rows={4} value={rec.text} disabled={!!res} placeholder="Sahnani o‘z so‘zlaringiz bilan qayta aytib bering (inglizcha)..." onChange={(e) => rec.setText(e.target.value)} />{!res && <button className="btn primary" disabled={rec.text.trim().split(/\s+/).length < 5} onClick={() => submit(rec.text)}>Tekshirish</button>}</>}
      {rec.busy && <p className="evidence">Eshityapman… {rec.live}</p>}
      {rec.err && <p className="notice">{rec.err}</p>}
      {res && (
        <>
          <Result pct={res.pct} extra={`${res.hit.filter(Boolean).length} / ${sc.retell.points.length} g‘oya tilga olindi`} />
          {sc.retell.points.map((p, k) => <div key={p.label} className={`check ${res.hit[k] ? 'ok' : 'no'}`}>{res.hit[k] ? <CheckCircle2 size={18} /> : <Circle size={18} />}<div><b>{p.label}</b></div></div>)}
          <div className="fb-block up"><small>Namuna (Senior Examiner varianti)</small><p>{sc.retell.model}</p></div>
          <p className="fb-line">Siz aytgan: {rec.text}</p>
        </>
      )}
    </div>
  );
}

// ------------------ Sahna va ro'yxat ------------------
function SceneView({ sc }: { sc: Scene }) {
  useProfile();
  const [step, setStep] = useState<StepId>('watch');
  const [, force] = useState(0);
  const prog = progressOf(sc.id);
  const done = (s: StepId, score?: number) => {
    if (markStep(sc.id, s, score)) { addXp(s === 'watch' ? 5 : 10 + Math.round((score ?? 0) / 10)); }
    markDone('shadow');
    force((x) => x + 1);
    if (s === 'retell' || s === 'shadow' || s === 'dictate') saveResult({ kind: 'practice', title: `Lavha: ${sc.title} (${STEPS.find((x) => x.id === s)!.label})`, correct: Math.round(score ?? 0), total: 100 });
  };
  const S = STEPS.find((x) => x.id === step)!;
  return (
    <div>
      <a className="evidence" href="#/shadow"><ArrowLeft size={14} style={{ verticalAlign: -2 }} /> Barcha sahnalar</a>
      <div className="card">
        <div className="row"><span className="pill">{sc.genre}</span><span className={`lvl-tag ${sc.level}`}>{sc.level}</span></div>
        <h2 style={{ margin: '6px 0' }}>{sc.title}</h2>
        <p className="evidence">{sc.about}</p>
        <div className="exam-brief"><Mascot mood="think" size={64} /><div><b>Senior Examiner:</b> <span>{sc.brief}</span></div></div>
        <div className="tabs" role="tablist" style={{ marginTop: 12 }}>
          {STEPS.map((s, k) => <button key={s.id} className={`btn ${step === s.id ? 'primary' : ''}`} onClick={() => setStep(s.id)}>{prog.steps.includes(s.id) ? <CheckCircle2 size={14} /> : <s.icon size={14} />}{k + 1}. {s.label}{prog.best[s.id as 'quiz'] !== undefined ? ` · ${prog.best[s.id as 'quiz']}%` : ''}</button>)}
        </div>
        <p className="evidence"><b>{S.label}.</b> {S.tip}</p>
      </div>
      {step === 'watch' && <Watch sc={sc} onDone={() => done('watch')} />}
      {step === 'quiz' && <Quiz sc={sc} onDone={(p) => done('quiz', p)} />}
      {step === 'cloze' && <Cloze sc={sc} onDone={(p) => done('cloze', p)} />}
      {step === 'shadow' && <Shadow sc={sc} onDone={(p) => done('shadow', p)} />}
      {step === 'dictate' && <Dictate sc={sc} onDone={(p) => done('dictate', p)} />}
      {step === 'retell' && <Retell sc={sc} onDone={(p) => done('retell', p)} />}
    </div>
  );
}

export default function ShadowHub({ id }: { id?: string }) {
  const sc = scenes.find((s) => s.id === id);
  if (sc) return <SceneView key={sc.id} sc={sc} />;
  return (
    <div>
      <div className="card">
        <span className="eyebrow"><Clapperboard size={15} /> Eshit va takrorla</span>
        <h2 style={{ margin: '4px 0' }}>Senior Examiner studiyasi</h2>
        <p>Eng tez natija beradigan zamonaviy usullar bir joyda: <b>subtitrli sahnalar, shadowing, dictant, bo‘shliqlarni to‘ldirish va eshitganini qayta aytish</b>. Sahnalar film dialogi, podkast, akademik ma’ruza va hujjatli film uslubida yozilgan (original matnlar, ikki xil ovozda).</p>
        <ol className="pay-steps"><li>Subtitr bilan tinglang, so‘ng subtitrsiz.</li><li>Gapni eshitib, aynan shu ritm bilan takrorlang (shadowing).</li><li>Eshitganingizni yozing, keyin sahnani o‘z so‘zingiz bilan aytib bering.</li></ol>
        <p className="evidence">Tinglash va takrorlash darajangizga mos sahnadan boshlang. Ovozni yozib olmaymiz: faqat tanilgan matn ekranda ko‘rinadi.</p>
      </div>
      <div className="hw-grid">
        {scenes.map((s) => {
          const p = progressOf(s.id);
          return (
            <a key={s.id} className="hw-card" href={`#/shadow/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="hw-top"><span className="hw-ico"><Clapperboard size={22} /></span><span className={`lvl-tag ${s.level}`}>{s.level}</span></div>
              <small className="hw-kind">{s.genre}</small>
              <h3>{s.title}</h3>
              <p className="evidence">{LEVEL_INFO[s.level].name} · {s.lines.length} gap</p>
              <div className="bar"><i style={{ width: `${(p.steps.length / STEPS.length) * 100}%` }} /></div>
              <span className="evidence">{p.steps.length}/{STEPS.length} bosqich</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
