import { BookOpenCheck, CheckCircle2, CircleAlert, Layers, PenLine, Sparkles } from 'lucide-react';
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { EvalCard } from '../components/EvalCard';
import { JoinForm } from '../components/JoinForm';
import { getAccount } from '../lib/account';
import { aiEnabled, aiEvaluateWriting, type Evaluation } from '../lib/ai';
import { writingPrompts } from '../content/writing';
import { commonMistakes, essayTypes, writingTopics, type EssayTypeId } from '../content/writingGuide';
import { analyzeTask2, analyzeWriting, type Task2Report, type WritingReport } from '../lib/writingCheck';
import { fmt, useCountdown } from '../components/hooks';
import { addXp } from '../lib/store';
import { saveResult } from '../lib/storage';

type Tab = 'practice' | 'types' | 'topics';

/** **qalin** belgilangan so'zlarni ajratib ko'rsatadi */
const Highlight = ({ text }: { text: string }) => (
  <>{text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p.split(/(\*\*[^*]+\*\*)/g).map((s, k) => s.startsWith('**') ? <mark key={k} className="kw">{s.slice(2, -2)}</mark> : <Fragment key={k}>{s}</Fragment>)}</p>)}</>
);

function TypeBadge({ id }: { id?: EssayTypeId }): ReactNode {
  const t = essayTypes.find((e) => e.id === id);
  return t ? <span className="pill">{t.name.split(' (')[0]}</span> : null;
}

export default function Writing() {
  const [tab, setTab] = useState<Tab>('practice');
  const [id, setId] = useState(writingPrompts.find((x) => x.task === 2)!.id);
  const p = writingPrompts.find((x) => x.id === id)!;
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<WritingReport | null>(null);
  const [t2, setT2] = useState<Task2Report | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [left, reset] = useCountdown(p.minutes * 60, running, () => setRunning(false));
  const [aiOn, setAiOn] = useState(false);
  const [acct, setAcct] = useState(getAccount());
  const [aiEval, setAiEval] = useState<Evaluation | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const [topicId, setTopicId] = useState(writingTopics[0].id);
  useEffect(() => { void aiEnabled().then(setAiOn); }, []);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const topic = writingTopics.find((t) => t.id === p.topicId);
  const et = essayTypes.find((e) => e.id === p.type);

  const choose = (v: string) => {
    const np = writingPrompts.find((x) => x.id === v)!;
    setId(v); setText(''); setReport(null); setT2(null); setShowModel(false); setAiEval(null); setAiErr(''); setRunning(false); reset(np.minutes * 60);
  };
  const practiceTopic = (tid: string) => { choose(`wt-${tid}`); setTab('practice'); };
  const check = () => {
    if (p.task === 2) { const r = analyzeTask2(text, p.type, p.topicId); setT2(r); setReport(null); if (r.words >= p.minWords) { addXp(10 + r.passed * 2); saveResult({ kind: 'writing', title: p.title, correct: r.passed, total: r.checks.length }); } }
    else { const r = analyzeWriting(text, p.minWords); setReport(r); setT2(null); if (r.words >= p.minWords) addXp(20); }
  };

  return (
    <div>
      <div className="card">
        <h2>Writing</h2>
        <div className="tabs" role="tablist">
          <button className={`btn ${tab === 'practice' ? 'primary' : ''}`} onClick={() => setTab('practice')}><PenLine size={15} /> Mashq</button>
          <button className={`btn ${tab === 'types' ? 'primary' : ''}`} onClick={() => setTab('types')}><Layers size={15} /> Insho turlari va xatolar</button>
          <button className={`btn ${tab === 'topics' ? 'primary' : ''}`} onClick={() => setTab('topics')}><BookOpenCheck size={15} /> 10 mavzu: namuna va so‘zlar</button>
        </div>
      </div>

      {tab === 'types' && (
        <>
          <div className="card">
            <h3>Task 2 insho turlari</h3>
            <p className="evidence">Birinchi qadam: savol qaysi turga kirishini aniqlang. Tur tuzilmani belgilaydi, noto‘g‘ri turda yozilgan insho yaxshi tilda yozilsa ham ball yo‘qotadi.</p>
          </div>
          {essayTypes.map((e) => (
            <div className="card" key={e.id}>
              <h3 style={{ marginTop: 0 }}>{e.name}</h3>
              <p className="evidence">Topshiriqda: {e.signals.map((s) => `“${s}”`).join(' · ')}</p>
              <p><span className={`pill ${e.opinion === 'ha' ? 'ok' : ''}`}>O‘z fikringiz: {e.opinion === 'ha' ? 'talab etiladi' : 'asosiy emas'}</span></p>
              <ol className="pay-steps">{e.structure.map((s) => <li key={s}>{s}</li>)}</ol>
              <p className="fb-line">{e.frames.map((f) => <span key={f} className="chip-up">{f}</span>)}</p>
              <p className="fb-line"><b>Maslahat:</b> {e.tipUz}</p>
            </div>
          ))}
          <div className="card">
            <h3>Eng ko‘p uchraydigan xatolar</h3>
            {commonMistakes.map((m) => (
              <div key={m.id} className="fb-block"><small>{m.title}</small><p>{m.why}</p><p className="ok" style={{ margin: 0 }}>To‘g‘risi: {m.fix}</p></div>
            ))}
          </div>
        </>
      )}

      {tab === 'topics' && (
        <>
          <div className="card">
            <h3>10 asosiy mavzu</h3>
            <p className="evidence">IELTS savollari odatda shu mavzulardan tuziladi. Har mavzuda: savol, insho rejasi, namuna insho (mavzu so‘zlari belgilangan) va 8 ta so‘z. Barcha so‘zlar o‘yinlar va takrorlash tizimiga ham qo‘shilgan. Hamma namunalar Bandly uchun yozilgan.</p>
            <div className="kinds">
              {writingTopics.map((t) => <button key={t.id} className={`kindbtn ${t.id === topicId ? 'on' : ''}`} onClick={() => setTopicId(t.id)}><b>{t.title}</b><span>{essayTypes.find((e) => e.id === t.type)!.name.split(' (')[0]}</span></button>)}
            </div>
          </div>
          {(() => {
            const t = writingTopics.find((x) => x.id === topicId)!;
            return (
              <>
                <div className="card">
                  <h3 style={{ marginTop: 0 }}>{t.title}</h3>
                  <p className="evidence">{t.about}</p>
                  <div className="fb-block"><small>Namunaviy savol</small><p>{t.prompt}</p></div>
                  <p><TypeBadge id={t.type} /></p>
                  <h4>Reja</h4>
                  <ol className="pay-steps">{t.outline.map((o) => <li key={o}>{o}</li>)}</ol>
                  <button className="btn primary" onClick={() => practiceTopic(t.id)}><PenLine size={16} /> Shu mavzuda yozish</button>
                </div>
                <div className="card">
                  <h3 style={{ marginTop: 0 }}>Namuna insho <span className="pill">{t.essay.replace(/\*\*/g, '').trim().split(/\s+/).length} so‘z</span></h3>
                  <p className="evidence">Mavzu so‘zlari <mark className="kw">shunday</mark> belgilangan. Avval o‘zingiz yozib ko‘ring, keyin solishtiring: so‘zlarni ko‘chirmang, o‘z fikringiz bilan ishlating.</p>
                  <div className="essay-model"><Highlight text={t.essay} /></div>
                </div>
                <div className="card">
                  <h3 style={{ marginTop: 0 }}>Mavzu so‘zlari</h3>
                  <table className="data">
                    <thead><tr><th>So‘z / ibora</th><th>Ma’nosi</th><th>Misol</th></tr></thead>
                    <tbody>{t.vocab.map((x) => <tr key={x.phrase}><td><b>{x.phrase}</b> <span className="evidence">{x.pos}</span></td><td>{x.uz}</td><td>{x.example}</td></tr>)}</tbody>
                  </table>
                  <p className="evidence">Bu so‘zlar <a href="#/games/rush">so‘z o‘yinlarida</a> ham uchraydi.</p>
                </div>
              </>
            );
          })()}
        </>
      )}

      {tab === 'practice' && (
        <>
          <div className="card">
            <div className="row">
              <select value={id} onChange={(e) => choose(e.target.value)}>
                <optgroup label="Task 1">{writingPrompts.filter((w) => w.task === 1).map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}</optgroup>
                <optgroup label="Task 2">{writingPrompts.filter((w) => w.task === 2).map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}</optgroup>
              </select>
              <span className={`timer ${left < 60 ? 'low' : ''}`}>{fmt(left)}</span>
              <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? 'To‘xtatish' : 'Taymerni boshlash'}</button>
            </div>
            <p><b>{p.prompt}</b></p>
            {p.table && (
              <table className="data">
                <thead><tr>{p.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>{p.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
              </table>
            )}
            <div className="row"><span className="pill">Kamida {p.minWords} so‘z · {p.minutes} daqiqa</span><TypeBadge id={p.type} /></div>
            {et && <details style={{ marginTop: 10 }}><summary>Reja: {et.name.split(' (')[0]}</summary><ol className="pay-steps">{et.structure.map((s) => <li key={s}>{s}</li>)}</ol><p className="evidence">{et.tipUz}</p></details>}
            {topic && <details style={{ marginTop: 6 }}><summary>Mavzu so‘zlari ({topic.title})</summary><p className="fb-line">{topic.vocab.map((x) => <span key={x.phrase} className="chip-up" title={x.uz}>{x.phrase}</span>)}</p></details>}
          </div>
          <div className="card">
            <textarea className="essay" value={text} onChange={(e) => setText(e.target.value)} placeholder="Javobingizni inglizcha yozing... (abzatslarni bo‘sh qator bilan ajrating)" />
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className={words >= p.minWords ? 'ok' : 'pill'}>{words} so‘z</span>
              {aiOn && acct && <button className="btn" disabled={aiBusy || words < 30} onClick={() => { setAiBusy(true); setAiErr(''); aiEvaluateWriting(p.task, p.prompt, text).then((e) => { setAiEval(e); addXp(10); }).catch((e: Error) => setAiErr(e.message)).finally(() => setAiBusy(false)); }}>{aiBusy ? 'AI baholayapti…' : 'AI baholash'}</button>}
              <button className="btn primary" onClick={check} disabled={words === 0}>Tekshirish</button>
            </div>
            <p className="notice" style={{ marginTop: 12 }}>
              Bu <b>AI baholash emas</b>: tuzilma, uslub va tanish xatolarni tekshiradi, band bermaydi. AI bilan 4 mezon bo‘yicha batafsil baho AI xizmati ulanganda “AI baholash” tugmasi orqali ishlaydi.
            </p>
            {aiOn && !acct && <JoinForm onJoined={setAcct} text="AI baholash uchun laqab tanlang (parol shart emas)." />}
            {aiOn && acct && <p className="evidence">AI baholashda insho matni AI provayderiga yuboriladi.</p>}
            {aiErr && <p className="notice">{aiErr}</p>}
            {aiEval && <EvalCard ev={aiEval} title="AI baho" />}
          </div>

          {t2 && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Tekshiruv natijasi: {t2.passed} / {t2.checks.length}</h3>
              <div className="bar" style={{ margin: '8px 0 14px' }}><i style={{ width: `${(t2.passed / t2.checks.length) * 100}%` }} /></div>
              {t2.checks.map((c) => (
                <div key={c.id + c.label} className={`check ${c.ok ? 'ok' : 'no'}`}>
                  {c.ok ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
                  <div><b>{c.label}</b>{c.detail && (!c.ok || ['words', 'structure', 'linkers', 'topicwords'].includes(c.id)) && <div className="evidence">{c.detail}</div>}</div>
                </div>
              ))}
              {t2.grammar.map((g) => <div key={g.id} className="fb-line"><b><del>{g.wrong}</del> → <ins>{g.right}</ins></b><br /><span>{g.ruleUz}</span></div>)}
              {t2.repeated.length > 0 && <p className="fb-line">Takrorlanayotgan so‘zlar: {t2.repeated.map((r) => `${r.word} (${r.count})`).join(', ')}. Sinonimlardan foydalaning.</p>}
              <p className="evidence">Abzatslar: {t2.paragraphs} · Gaplar: {t2.sentences} · O‘rtacha gap uzunligi: {t2.avgSentence.toFixed(1)} so‘z · Bog‘lovchilar: {t2.linkers.join(', ') || 'topilmadi'}</p>
              {topic && <div className="row" style={{ marginTop: 10 }}><button className="btn" onClick={() => setShowModel((v) => !v)}><Sparkles size={15} /> {showModel ? 'Namunani yashirish' : 'Namuna inshoni ko‘rish'}</button></div>}
              {topic && showModel && <div className="essay-model" style={{ marginTop: 10 }}><Highlight text={topic.essay} /></div>}
            </div>
          )}
          {report && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Natija</h3>
              <ul>{report.tips.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="evidence">Abzatslar: {report.paragraphs} · Gaplar: {report.sentences} · O‘rtacha gap uzunligi: {report.avgSentence.toFixed(1)} so‘z · Bog‘lovchilar: {report.linkers.join(', ') || 'topilmadi'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
