import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ItemView } from '../components/LessonItem';
import { grammar } from '../content/grammar';
import { lessonById, lessonNodeId } from '../content/lessons';
import { nodeForGrammarTopic, taxonomyOfNode } from '../content/curriculum/inventory';
import { checkItem, type ItemAnswer } from '../lib/lessons';
import { checkFix, dueMistakes, load, openMistakes, recordReview, RESOLVE_AFTER, type Mistake } from '../lib/mistakes';
import { recordAnswer, logErrors } from '../lib/adaptive/store';
import { addXp } from '../lib/store';

const SOURCE_UZ: Record<Mistake['source'], string> = { lesson: 'Dars', grammar: 'Grammar', writing: 'Yozish', coach: 'AI ustoz' };

/** One review card. Returns the verdict to the parent; the parent stores it. */
function Card({ m, onDone }: { m: Mistake; onDone: (correct: boolean) => void }) {
  const [ans, setAns] = useState<ItemAnswer>(undefined);
  const [text, setText] = useState('');
  const [shown, setShown] = useState<boolean | null>(null);
  const r = m.ref;
  const finish = (ok: boolean) => { setShown(ok); onDone(ok); };

  if (r.kind === 'fix') {
    return (
      <div>
        <p>Bu gapni to‘g‘rilab yozing:</p>
        <p><span className="bad" style={{ fontSize: 18 }}>«{r.wrong}»</span></p>
        <input type="text" value={text} disabled={shown !== null} placeholder="To‘g‘ri variantni yozing" onChange={(e) => setText(e.target.value)} style={{ width: '100%' }} />
        {shown === null && <button className="btn primary" style={{ marginTop: 8 }} disabled={!text.trim()} onClick={() => finish(checkFix(r, text))}>Tekshirish</button>}
        {shown !== null && <p style={{ marginTop: 8 }}>{shown ? <span className="ok"><CheckCircle2 size={16} /> To‘g‘ri!</span> : <span className="bad"><XCircle size={16} /> Hali emas.</span>} To‘g‘risi: <b>«{r.right}»</b>. <span className="muted">{r.whyUz}</span></p>}
      </div>
    );
  }
  if (r.kind === 'lesson') {
    const l = lessonById(r.lessonId)?.lesson;
    const item = l ? (r.part === 'check' ? l.check : l.practice)[r.index] : undefined;
    if (!l || !item) return <p className="muted">Bu mashq endi mavjud emas.</p>;
    return (
      <div>
        <p className="muted">Dars: {l.titleUz}</p>
        <ItemView item={item} value={ans} revealed={shown !== null} onChange={setAns} />
        {shown === null && <button className="btn primary" style={{ marginTop: 8 }} disabled={ans === undefined || (Array.isArray(ans) && !ans.length)} onClick={() => finish(checkItem(item, ans))}>Tekshirish</button>}
      </div>
    );
  }
  const g = grammar.find((x) => x.id === r.grammarId);
  if (!g) return <p className="muted">Bu savol endi mavjud emas.</p>;
  return (
    <div>
      <p className="muted">Grammar: {g.topic}</p>
      <p><b>{g.q}</b></p>
      <div className="stack">
        {g.options.map((o, i) => (
          <button key={o} type="button" disabled={shown !== null} className={`opt ${shown !== null ? (i === g.answer ? 'right' : ans === i ? 'bad' : '') : ans === i ? 'sel' : ''}`} onClick={() => setAns(i)}>{o}</button>
        ))}
      </div>
      {shown === null && <button className="btn primary" style={{ marginTop: 8 }} disabled={ans === undefined} onClick={() => finish(ans === g.answer)}>Tekshirish</button>}
      {shown !== null && <p className="muted" style={{ marginTop: 8 }}>{g.explanationUz}</p>}
    </div>
  );
}

/** "Xatolar ustida ishlash": the learner's own mistakes, scheduled until fixed 3 times in a row. */
export default function Mistakes() {
  const [round, setRound] = useState(0);
  const queue = useMemo(() => dueMistakes(), [round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ ok: 0, bad: 0 });
  const open = openMistakes(load());
  const cur = queue[idx];

  const onDone = (ok: boolean) => {
    if (!cur) return;
    recordReview(cur.id, ok);
    const r = cur.ref;
    if (r.kind === 'lesson') recordAnswer(lessonNodeId(r.lessonId), ok, cur.taxonomy);
    else if (r.kind === 'grammar') { const g = grammar.find((x) => x.id === r.grammarId); const node = g && nodeForGrammarTopic(g.topic); if (node) recordAnswer(node, ok, taxonomyOfNode(node)); }
    else if (!ok) logErrors(cur.taxonomy);
    if (ok) addXp(2);
    setStats((s) => (ok ? { ...s, ok: s.ok + 1 } : { ...s, bad: s.bad + 1 }));
    setAnswered(true);
  };
  const next = () => { setAnswered(false); setIdx((i) => i + 1); };

  return (
    <div>
      <section className="card">
        <h2>Xatolar ustida ishlash</h2>
        <p>Darslar, Grammar, yozish va AI ustoz bilan suhbatda qilgan xatolaringiz shu yerga yig‘iladi va to‘g‘ri bajarmaguningizcha qaytib keladi: 1, 3 va 7 kundan keyin. Ketma-ket {RESOLVE_AFTER} marta to‘g‘ri javob bersangiz, xato “yengilgan” hisoblanadi.</p>
        <p className="row"><span className="pill">Bugun: {queue.length}</span><span className="pill">Ochiq xatolar: {open.length}</span>{(stats.ok + stats.bad) > 0 && <span className="pill">Bu safar: {stats.ok} ✓ · {stats.bad} ✗</span>}</p>
      </section>
      {cur ? (
        <section className="card" key={cur.id + round}>
          <p className="row"><span className="pill">{idx + 1}/{queue.length}</span><span className="pill">{SOURCE_UZ[cur.source]}</span><span className="pill">to‘g‘ri ketma-ket: {cur.streak}/{RESOLVE_AFTER}</span></p>
          <Card m={cur} onDone={onDone} />
          {answered && <button className="btn primary" style={{ marginTop: 12 }} onClick={next}>Keyingisi</button>}
        </section>
      ) : (
        <section className="card">
          <p>{queue.length ? 'Bugungi takrorlash tugadi. Zo‘r!' : open.length ? 'Hozircha takrorlash vaqti kelgan xato yo‘q — keyingi takrorlash vaqti kelganda shu yerda paydo bo‘ladi.' : 'Hali saqlangan xato yo‘q. Dars, Grammar yoki AI ustoz bilan mashq qiling.'}</p>
          <div className="row"><button className="btn" onClick={() => { setRound((r) => r + 1); setIdx(0); setAnswered(false); }}><RotateCcw size={14} /> Yangilash</button><a className="btn" href="#/">Bosh sahifa</a></div>
        </section>
      )}
    </div>
  );
}
