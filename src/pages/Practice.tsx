import { ArrowRight, CheckCircle2, CircleAlert, Lightbulb, Sparkles, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LockCard } from '../components/Gate';
import { Mascot, type Mood } from '../components/Mascot';
import { exercises, type Exercise, type Kind } from '../content/practice';
import { CEFR, LEVEL_INFO, fits, type Cefr } from '../lib/levels';
import { check, xpFor, type DiffOp, type Result } from '../lib/practice';
import { saveResult } from '../lib/storage';
import { addXp, getProfile, recordReview, useProfile } from '../lib/store';
import { recordPracticeItem } from '../lib/adaptive/record';
import { shuffle } from '../lib/vocabGame';

const KINDS: { id: Kind | 'mix'; label: string; hint: string }[] = [
  { id: 'mix', label: 'Aralash', hint: 'Hamma turdan' },
  { id: 'translate', label: 'Tarjima', hint: "O'zbekchadan inglizchaga" },
  { id: 'fix', label: 'Xatoni toping', hint: 'Xatoli gapni tuzating' },
  { id: 'use', label: 'O‘z gapingiz', hint: 'Berilgan qolipda gap tuzing' },
  { id: 'upgrade', label: 'Kuchaytiring', hint: 'Gapni band oshiradigan qilib yozing' },
  { id: 'build', label: 'So‘z tartibi', hint: "So'zlardan gap yig'ing" },
];
const KIND_NAME: Record<Kind, string> = { translate: 'Tarjima', fix: 'Xatoni toping', use: 'O‘z gapingiz', upgrade: 'Kuchaytiring', build: 'So‘z tartibi' };
const SIZE = 8;
const FREE_PER_DAY = 5;

const dayKey = () => new Date().toISOString().slice(0, 10);
function freeUsed(): number { try { const j = JSON.parse(localStorage.getItem('bandly.practice.free') ?? '{}') as { d?: string; n?: number }; return j.d === dayKey() ? j.n ?? 0 : 0; } catch { return 0; } }
function useFree(): void { try { localStorage.setItem('bandly.practice.free', JSON.stringify({ d: dayKey(), n: freeUsed() + 1 })); } catch { /* saqlash yo'q */ } }

function Diff({ ops }: { ops: DiffOp[] }) {
  return (
    <p className="diff">
      {ops.map((o, i) => o.t === 'same' ? <span key={i}>{o.user} </span>
        : o.t === 'extra' ? <del key={i}>{o.user} </del>
        : o.t === 'sub' ? <span key={i}><del>{o.user}</del><ins>{o.want}</ins> </span>
        : <ins key={i} className="miss">+ {o.want} </ins>)}
    </p>
  );
}

function Feedback({ e, r, answer }: { e: Exercise; r: Result; answer: string }) {
  const head = r.verdict === 'correct' ? { icon: <CheckCircle2 size={20} />, text: 'To‘g‘ri!', cls: 'ok' } : r.verdict === 'close' ? { icon: <Lightbulb size={20} />, text: 'Deyarli to‘g‘ri', cls: 'near' } : { icon: <CircleAlert size={20} />, text: 'Hali to‘g‘ri emas', cls: 'no' };
  const open = e.kind === 'use' || e.kind === 'upgrade';
  return (
    <div className={`fb ${head.cls}`}>
      <div className="fb-head">{head.icon}<b>{head.text}</b>{r.verdict === 'correct' && <span className="pill">+{xpFor('correct')} XP</span>}{r.verdict === 'close' && <span className="pill">+{xpFor('close')} XP</span>}</div>
      <div className="fb-block"><small>Sizning javobingiz</small>{r.diff && !open ? <Diff ops={r.diff} /> : <p>{answer || '—'}</p>}</div>
      {r.typos.map(([a, b]) => <p key={a} className="fb-line">Imlo: <del>{a}</del> → <ins>{b}</ins></p>)}
      {r.issues.map((i) => <div key={i.id} className="fb-line"><b><del>{i.wrong}</del> → <ins>{i.right}</ins></b><br /><span>{i.ruleUz}</span></div>)}
      {r.notes.map((n) => <p key={n} className="fb-line">• {n}</p>)}
      {r.style.map((n) => <p key={n} className="fb-line">• {n}</p>)}
      {r.verdict !== 'correct' || open ? (
        <div className="fb-block good"><small>{open ? 'Namuna javob' : 'To‘g‘ri variant'}</small><p>{open ? e.model : r.closest}</p></div>
      ) : null}
      {e.better && <div className="fb-block up"><small><Sparkles size={13} /> Yaxshiroq variant (band ↑)</small><p>{e.better}</p></div>}
      <p className="fb-why"><b>Nima uchun:</b> {e.explainUz}</p>
    </div>
  );
}

export default function Practice() {
  const p = useProfile();
  const unlocked = p.plan.grammar;
  const [level, setLevel] = useState<Cefr>(p.level ?? 'B1');
  const [kind, setKind] = useState<Kind | 'mix'>('mix');
  const [queue, setQueue] = useState<Exercise[] | null>(null);
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [res, setRes] = useState<{ r: Result; answer: string } | null>(null);
  const [log, setLog] = useState<{ e: Exercise; v: Result['verdict'] }[]>([]);
  const [xp, setXp] = useState(0);
  const [lockedNow, setLockedNow] = useState(false);

  const cur = queue?.[i];
  const bank = useMemo(() => (cur?.kind === 'build' ? shuffle([...cur.model.replace(/[.?!]$/, '').split(' '), ...(cur.extra ?? [])].map((w, k) => ({ w, k }))) : []), [cur]);

  const start = () => {
    if (!unlocked && freeUsed() >= FREE_PER_DAY) { setLockedNow(true); return; }
    const pool = exercises.filter((x) => (kind === 'mix' || x.kind === kind) && fits(x.level, level, 0, 0));
    // Avval xato qilinganlar, keyin yangilari, keyin o'zlashtirilganlar
    const srs = getProfile().srs;
    const due = pool.filter((x) => srs[`p${x.id}`] && srs[`p${x.id}`].box === 0);
    const fresh = shuffle(pool.filter((x) => !srs[`p${x.id}`]));
    const rest = shuffle(pool.filter((x) => srs[`p${x.id}`] && srs[`p${x.id}`].box > 0));
    const picked2 = [...due, ...fresh, ...rest].slice(0, SIZE);
    setQueue(kind === 'mix' ? shuffle(picked2) : picked2);
    setI(0); setText(''); setPicked([]); setRes(null); setLog([]); setXp(0); setLockedNow(false);
  };

  const submit = () => {
    if (!cur || res) return;
    const answer = cur.kind === 'build' ? picked.map((k) => bank.find((b) => b.k === k)!.w).join(' ') : text;
    if (!answer.trim()) return;
    const r = check(cur, answer);
    setRes({ r, answer });
    setLog((l) => [...l, { e: cur, v: r.verdict }]);
    recordReview(`p${cur.id}`, r.verdict === 'correct');
    recordPracticeItem(cur.id, r.verdict === 'correct');
    const gain = xpFor(r.verdict);
    if (gain) { addXp(gain); setXp((x) => x + gain); }
    if (!unlocked) useFree();
  };

  const next = () => {
    if (!queue) return;
    if (i + 1 >= queue.length) {
      const good = log.filter((l) => l.v === 'correct').length;
      saveResult({ kind: 'practice', title: `Gap tuzish (${level})`, correct: good, total: queue.length });
      if (good === queue.length) addXp(15);
      setI(queue.length); return;
    }
    if (!unlocked && freeUsed() >= FREE_PER_DAY) { setQueue(null); setLockedNow(true); return; }
    setI(i + 1); setText(''); setPicked([]); setRes(null);
  };

  // ---------- Kirish ----------
  if (!queue) {
    return (
      <div>
        <div className="card">
          <h2>Gap tuzish va xatolar ustida ishlash</h2>
          <p>Ustoz kabi ishlaydi: javobingizni tekshiradi, xatoni <del>qizil</del>, to‘g‘risini <ins>yashil</ins> ko‘rsatadi, nima uchun xatoligini o‘zbekcha tushuntiradi va <b>yaxshiroq variant</b> taklif qiladi.</p>
          {!p.level && <p className="evidence"><a href="#/placement">Darajangizni aniqlang</a>: mashqlar sizga mos tanlanadi.</p>}
          <h3>Daraja</h3>
          <div className="tabs">{CEFR.map((l) => <button key={l} className={`btn ${l === level ? 'primary' : ''}`} onClick={() => setLevel(l)}>{l}{p.level === l ? ' ★' : ''}</button>)}</div>
          <p className="evidence">{LEVEL_INFO[level].name}: {LEVEL_INFO[level].desc}</p>
          <h3>Mashq turi</h3>
          <div className="kinds">
            {KINDS.map((k) => <button key={k.id} className={`kindbtn ${k.id === kind ? 'on' : ''}`} onClick={() => setKind(k.id)}><b>{k.label}</b><span>{k.hint}</span></button>)}
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn primary lg" onClick={start}>Boshlash ({SIZE} ta) <ArrowRight size={18} /></button>
            {!unlocked && <span className="evidence">Bugun bepul: {Math.max(0, FREE_PER_DAY - freeUsed())} ta mashq. Grammar obunasi bilan cheksiz.</span>}
          </div>
        </div>
        {lockedNow && <LockCard track="grammar" reason="Bugungi bepul mashqlar tugadi. Grammar obunasi bilan cheklovsiz davom eting." />}
      </div>
    );
  }

  // ---------- Natija ----------
  if (i >= queue.length) {
    const good = log.filter((l) => l.v === 'correct').length;
    const wrong = log.filter((l) => l.v !== 'correct');
    return (
      <div>
        <div className="stage">
          <div className="stage-center">
            <Mascot mood={good >= queue.length / 2 ? 'happy' : 'sad'} size={110} />
            <div className="score">{good} / {queue.length}</div>
            <p className="lead">+{xp} XP{good === queue.length ? ' · mukammal natija: +15 XP bonus' : ''}</p>
          </div>
        </div>
        {wrong.length > 0 && (
          <div className="card">
            <h3>Ustida ishlash kerak</h3>
            {wrong.map(({ e }) => <div key={e.id} className="fb-block good"><small>{KIND_NAME[e.kind]} · {e.topic}</small><p>{e.shown ?? e.promptUz}</p><p><b>{e.model}</b></p><p className="evidence">{e.explainUz}</p></div>)}
            <p className="evidence">Bu mashqlar keyingi safar birinchi bo‘lib qaytadi.</p>
          </div>
        )}
        <div className="row"><button className="btn primary" onClick={start}>Yana mashq</button><button className="btn" onClick={() => setQueue(null)}>Sozlamalar</button></div>
      </div>
    );
  }

  // ---------- Mashq ----------
  const mood: Mood = !res ? 'think' : res.r.verdict === 'correct' ? 'happy' : res.r.verdict === 'close' ? 'idle' : 'sad';
  const showText = cur!.kind !== 'build';
  return (
    <div>
      <div className="stage practice">
        <div className="stage-top">
          <span className="pill">{KIND_NAME[cur!.kind]}</span><span className={`lvl-tag ${cur!.level}`}>{cur!.level}</span><span className="pill">{cur!.topic}</span>
          <span className="pill" style={{ marginLeft: 'auto' }}><Target size={14} /> {i + 1} / {queue.length}</span>
        </div>
        <div className="bar" style={{ margin: '12px 0' }}><i style={{ width: `${((i + (res ? 1 : 0)) / queue.length) * 100}%` }} /></div>
        <div className="prompt-row">
          <Mascot mood={mood} size={84} />
          <div>
            <p className="evidence" style={{ margin: 0 }}>{cur!.kind === 'translate' ? 'Inglizchaga tarjima qiling' : cur!.kind === 'build' ? "So'zlardan to'g'ri gap tuzing" : cur!.promptUz}</p>
            {cur!.kind === 'translate' || cur!.kind === 'build' ? <p className="ptext">{cur!.promptUz}</p> : null}
            {cur!.shown && <p className="ptext shown">{cur!.shown}</p>}
          </div>
        </div>

        {cur!.kind === 'build' && (
          <>
            <div className="built" aria-live="polite">{picked.length ? picked.map((k, idx) => <button key={idx} className="tile-w" disabled={!!res} onClick={() => setPicked(picked.filter((_, n) => n !== idx))}>{bank.find((b) => b.k === k)!.w}</button>) : <span className="evidence">So‘zlarni bosib gap tuzing</span>}</div>
            <div className="wordbank">{bank.map((b) => <button key={b.k} className="tile-w" disabled={!!res || picked.includes(b.k)} onClick={() => setPicked([...picked, b.k])}>{b.w}</button>)}</div>
          </>
        )}
        {showText && (
          <textarea className="answer" rows={cur!.kind === 'use' || cur!.kind === 'upgrade' ? 3 : 2} value={text} disabled={!!res} placeholder="Javobingizni inglizcha yozing..." onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!res) submit(); } }} />
        )}
        {!res ? <button className="btn primary" disabled={cur!.kind === 'build' ? picked.length === 0 : !text.trim()} onClick={submit}>Tekshirish</button> : <button className="btn primary" onClick={next}>{i + 1 >= queue.length ? 'Natijani ko‘rish' : 'Keyingisi'} <ArrowRight size={16} /></button>}
      </div>
      {res && <Feedback e={cur!} r={res.r} answer={res.answer} />}
      <p className="evidence">Tekshiruv qoidalarga asoslangan (AI emas): u tanish xato va qoliplarni topadi. Mukammal baholash uchun AI ustoz ulanadi.</p>
    </div>
  );
}
