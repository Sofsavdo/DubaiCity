import { useMemo, useState } from 'react';
import { grammar, grammarTopics } from '../content/grammar';
import { saveResult } from '../lib/storage';

export default function Grammar() {
  const [topic, setTopic] = useState<string>('Hammasi');
  const items = useMemo(() => (topic === 'Hammasi' ? grammar : grammar.filter((g) => g.topic === topic)), [topic]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const correct = items.filter((g) => answers[g.id] === g.answer).length;
  const change = (t: string) => { setTopic(t); setAnswers({}); setDone(false); };
  const finish = () => {
    setDone(true);
    saveResult({ kind: 'grammar', title: `Grammar: ${topic}`, correct, total: items.length });
  };

  return (
    <div>
      <div className="card">
        <h2>Grammar mashqlari</h2>
        <p>Har bir javobdan keyin o‘zbekcha tushuntirish ko‘rsatiladi. Mavzuni tanlang:</p>
        <div className="row">
          {['Hammasi', ...grammarTopics].map((t) => (
            <button key={t} className={`btn ${t === topic ? 'primary' : ''}`} onClick={() => change(t)}>{t}</button>
          ))}
        </div>
      </div>
      {done && (
        <div className="card">
          <div className="score">{correct} / {items.length}</div>
          <button className="btn" onClick={() => change(topic)}>Qayta urinish</button>
        </div>
      )}
      {items.map((g, idx) => {
        const a = answers[g.id];
        return (
          <div className="card" key={g.id}>
            <div className="pill">{g.topic}</div>
            <p><b>{idx + 1}.</b> {g.q}</p>
            {g.options.map((o, i) => (
              <label key={o} style={{ display: 'block', padding: '3px 0' }}>
                <input type="radio" name={`g${g.id}`} disabled={a !== undefined || done} checked={a === i} onChange={() => setAnswers((p) => ({ ...p, [g.id]: i }))} /> {o}
              </label>
            ))}
            {a !== undefined && (
              <p className="evidence">
                {a === g.answer ? <span className="ok">To‘g‘ri. </span> : <span className="bad">Noto‘g‘ri. To‘g‘ri javob: {g.options[g.answer]}. </span>}
                {g.explanationUz}
              </p>
            )}
          </div>
        );
      })}
      {!done && <button className="btn primary" disabled={Object.keys(answers).length === 0} onClick={finish}>Natijani saqlash</button>}
    </div>
  );
}
