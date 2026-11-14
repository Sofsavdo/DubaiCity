import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Item } from '../content/lessons/types';
import { lessonById, lessonNodeId, ALL_LESSONS } from '../content/lessons';
import { checkItem, correctAnswerText, isUnlocked, loadProgress, PASS_RATE, saveAttempt, scoreCheck, type ItemAnswer } from '../lib/lessons';
import { recordAnswer } from '../lib/adaptive/store';
import { addXp } from '../lib/store';
import { saveResult } from '../lib/storage';

type Step = 'learn' | 'practice' | 'check' | 'result';

function ItemView({ item, value, onChange, revealed }: { item: Item; value: ItemAnswer; onChange: (v: ItemAnswer) => void; revealed: boolean }) {
  const ok = revealed && checkItem(item, value);
  return (
    <div className="q">
      <p><b>{item.kind === 'order' ? 'So‘zlardan to‘g‘ri gap tuzing:' : item.prompt}</b></p>
      {item.kind === 'choice' && (
        <div className="stack">
          {item.options.map((o, i) => (
            <button key={o} type="button" className={`opt ${revealed ? (i === item.answer ? 'right' : i === value ? 'bad' : '') : value === i ? 'sel' : ''}`} disabled={revealed} onClick={() => onChange(i)}>{o}</button>
          ))}
        </div>
      )}
      {item.kind === 'gap' && (
        <input type="text" autoComplete="off" disabled={revealed} value={typeof value === 'string' ? value : ''} placeholder="Javobni yozing" onChange={(e) => onChange(e.target.value)} />
      )}
      {item.kind === 'order' && <OrderInput item={item} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={revealed} />}
      {revealed && (
        <p style={{ marginTop: 8 }}>
          {ok ? <span className="ok"><CheckCircle2 size={16} /> To‘g‘ri. </span> : <span className="bad"><XCircle size={16} /> Noto‘g‘ri. To‘g‘ri javob: «{correctAnswerText(item)}». </span>}
          <span className="muted">{item.explainUz}</span>
        </p>
      )}
    </div>
  );
}

function OrderInput({ item, value, onChange, disabled }: { item: Extract<Item, { kind: 'order' }>; value: string[]; onChange: (v: string[]) => void; disabled: boolean }) {
  const pool = item.words.map((w, i) => ({ w, i }));
  const [picked, setPicked] = useState<number[]>([]);
  const add = (i: number) => { if (disabled || picked.includes(i)) return; const n = [...picked, i]; setPicked(n); onChange(n.map((k) => item.words[k]!)); };
  const undo = () => { if (disabled) return; const n = picked.slice(0, -1); setPicked(n); onChange(n.map((k) => item.words[k]!)); };
  return (
    <div>
      <div className="card" style={{ minHeight: 48, padding: 10, margin: '6px 0' }}>{value.length ? value.join(' ') : <span className="muted">So‘zlarni tartib bilan bosing</span>}</div>
      <div className="row">
        {pool.map(({ w, i }) => <button key={i} type="button" className="chipbtn" disabled={disabled || picked.includes(i)} style={picked.includes(i) ? { opacity: 0.35 } : undefined} onClick={() => add(i)}>{w}</button>)}
        <button type="button" className="btn sm" disabled={disabled || !picked.length} onClick={undo}><RotateCcw size={14} /> Orqaga</button>
      </div>
    </div>
  );
}

export default function LessonPage({ id }: { id: string }) {
  const found = lessonById(id);
  const [step, setStep] = useState<Step>('learn');
  const [pAns, setPAns] = useState<ItemAnswer[]>([]);
  const [pShown, setPShown] = useState<boolean[]>([]);
  const [cAns, setCAns] = useState<ItemAnswer[]>([]);
  const [result, setResult] = useState<ReturnType<typeof scoreCheck> | null>(null);
  const [round, setRound] = useState(0);
  const next = useMemo(() => { const i = ALL_LESSONS.findIndex((x) => x.lesson.id === id); return i >= 0 ? ALL_LESSONS[i + 1] : undefined; }, [id]);

  if (!found) return <div className="card"><h2>Dars topilmadi</h2><a className="btn" href="#/learn">Darslar ro‘yxati</a></div>;
  const { unit, lesson, index } = found;
  if (!isUnlocked(unit, index, loadProgress())) return <div className="card"><h2>{lesson.titleUz}</h2><p>Bu dars avvalgi darsdan o‘tganingizdan keyin ochiladi.</p><a className="btn" href="#/learn">Darslar ro‘yxati</a></div>;

  const submitCheck = () => {
    const r = scoreCheck(lesson.check, cAns);
    const now = Date.now();
    lesson.check.forEach((it, i) => recordAnswer(lessonNodeId(lesson.id), checkItem(it, cAns[i]), lesson.taxonomyIds, now));
    saveAttempt(lesson.id, r, now);
    saveResult({ kind: 'grammar', title: `Dars: ${lesson.titleUz}`, correct: r.correct, total: r.total });
    addXp(r.correct * 3 + (r.passed ? 15 : 0));
    setResult(r); setStep('result');
  };
  const retry = () => { setCAns([]); setResult(null); setRound((x) => x + 1); setStep('check'); };

  return (
    <div>
      <a className="btn sm" href="#/learn"><ArrowLeft size={14} /> Darslar</a>
      <section className="card" style={{ marginTop: 10 }}>
        <p className="row"><span className={`lvl-tag ${unit.level}`}>{unit.level}</span><span className="pill">{unit.titleUz}</span><span className="pill">{lesson.minutes} daq</span><span className="pill">Pilot · metodist tekshiruvi kutilmoqda</span></p>
        <h2>{lesson.titleUz}</h2>
        <p><b>Maqsad:</b> {lesson.objectiveUz}</p>
        <div className="tabs" role="tablist">
          {(['learn', 'practice', 'check'] as const).map((s, i) => (
            <button key={s} role="tab" aria-selected={step === s} className={`chipbtn ${step === s || (step === 'result' && s === 'check') ? 'on' : ''}`} onClick={() => setStep(s)}>{i + 1}. {s === 'learn' ? 'Tushuntirish' : s === 'practice' ? 'Mashq' : 'Tekshiruv'}</button>
          ))}
        </div>
      </section>

      {step === 'learn' && (
        <section className="card">
          {lesson.explanationUz.map((t) => <p key={t}>{t}</p>)}
          {lesson.table && (
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <tbody>{lesson.table.map((r) => <tr key={r.form}><td style={{ padding: '8px 6px', borderTop: '1px solid var(--line)' }}><b>{r.form}</b></td><td style={{ padding: '8px 6px', borderTop: '1px solid var(--line)' }}>{r.example}</td></tr>)}</tbody>
            </table>
          )}
          <h3>Misollar</h3>
          <ul>{lesson.examples.map((e) => <li key={e.en}><b>{e.en}</b> <span className="muted">— {e.uz}</span></li>)}</ul>
          {lesson.vocab && (<><h3>Yangi so‘zlar</h3><p className="row">{lesson.vocab.map((v) => <span key={v.en} className="pill">{v.en} · {v.uz}</span>)}</p></>)}
          <button className="btn primary" onClick={() => setStep('practice')}>Mashqqa o‘tish <ArrowRight size={14} /></button>
        </section>
      )}

      {step === 'practice' && (
        <section className="card">
          <p className="muted">Har bir javobni darhol tekshiring — bu qism ballga ta’sir qilmaydi.</p>
          {lesson.practice.map((it, i) => (
            <div key={i}>
              <ItemView item={it} value={pAns[i]} revealed={!!pShown[i]} onChange={(v) => setPAns((a) => { const n = [...a]; n[i] = v; return n; })} />
              {!pShown[i] && <button className="btn sm" disabled={pAns[i] === undefined || (Array.isArray(pAns[i]) && !(pAns[i] as string[]).length)} onClick={() => setPShown((s) => { const n = [...s]; n[i] = true; return n; })}>Tekshirish</button>}
            </div>
          ))}
          <button className="btn primary" style={{ marginTop: 14 }} onClick={() => setStep('check')}>Yakuniy tekshiruvga o‘tish <ArrowRight size={14} /></button>
        </section>
      )}

      {step === 'check' && (
        <section className="card" key={round}>
          <p className="muted">{lesson.check.length} ta savol. O‘tish uchun kamida {Math.ceil(PASS_RATE * lesson.check.length)} ta to‘g‘ri javob kerak. Javoblar oxirida ko‘rsatiladi.</p>
          {lesson.check.map((it, i) => <ItemView key={i} item={it} value={cAns[i]} revealed={false} onChange={(v) => setCAns((a) => { const n = [...a]; n[i] = v; return n; })} />)}
          <button className="btn primary" style={{ marginTop: 14 }} disabled={!cAns.some((a) => a !== undefined && !(Array.isArray(a) && !a.length))} onClick={submitCheck}>Natijani ko‘rish</button>
          <p className="muted" style={{ fontSize: 13 }}>Javob berilmagan savollar noto‘g‘ri hisoblanadi.</p>
        </section>
      )}

      {step === 'result' && result && (
        <section className="card">
          <h3>{result.passed ? 'Dars o‘zlashtirildi!' : 'Hali biroz mashq kerak'}</h3>
          <p className="row"><span className="pill">{result.correct}/{result.total} to‘g‘ri</span><span className="pill">{Math.round(result.rate * 100)}%</span></p>
          {lesson.check.map((it, i) => <ItemView key={i} item={it} value={cAns[i]} revealed onChange={() => undefined} />)}
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" onClick={retry}><RotateCcw size={14} /> Qayta topshirish</button>
            {result.passed && next && <a className="btn primary" href={`#/learn/${next.lesson.id}`}>Keyingi dars: {next.lesson.titleUz} <ArrowRight size={14} /></a>}
            {!result.passed && <button className="btn" onClick={() => setStep('learn')}>Tushuntirishni qayta o‘qish</button>}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>Natija qurilmangizda saqlandi va bosh sahifadagi “Bugungi reja”ga ta’sir qiladi.</p>
        </section>
      )}
    </div>
  );
}
