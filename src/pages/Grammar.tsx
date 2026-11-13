import { useMemo, useState } from 'react';
import { grammar, grammarTopics } from '../content/grammar';
import { LockCard } from '../components/Gate';
import { saveResult } from '../lib/storage';
import { addXp, recordReview, useProfile } from '../lib/store';

const FREE_TOPIC = 'Artikllar';
const MISTAKES = 'Xatolarim';

export default function Grammar() {
  const profile = useProfile();
  const unlocked = profile.plan.grammar;
  const [topic, setTopic] = useState<string>(FREE_TOPIC);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const locked = !unlocked && topic !== FREE_TOPIC;
  const items = useMemo(() => {
    if (topic === 'Hammasi') return grammar;
    if (topic === MISTAKES) return grammar.filter((g) => { const c = profile.srs[`g${g.id}`]; return c && c.box === 0 && c.wrong > 0; });
    return grammar.filter((g) => g.topic === topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, done]);

  const correct = items.filter((g) => answers[g.id] === g.answer).length;
  const change = (t: string) => { setTopic(t); setAnswers({}); setDone(false); };

  const choose = (id: number, i: number, answer: number) => {
    if (answers[id] !== undefined) return;
    setAnswers((p) => ({ ...p, [id]: i }));
    recordReview(`g${id}`, i === answer);
    if (i === answer) addXp(3);
  };
  const finish = () => {
    setDone(true);
    saveResult({ kind: 'grammar', title: `Grammar: ${topic}`, correct, total: items.length });
    if (correct === items.length && items.length > 0) addXp(10);
  };
  const tabs = ['Hammasi', ...grammarTopics, MISTAKES];

  return (
    <div>
      <div className="card">
        <h2>Grammar</h2>
        <p>Har javobdan keyin o‘zbekcha tushuntirish chiqadi. Noto‘g‘ri javoblar "{MISTAKES}" bo‘limida takrorlanadi.</p>
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t} className={`btn ${t === topic ? 'primary' : ''}`} onClick={() => change(t)}>
              {!unlocked && t !== FREE_TOPIC ? '🔒 ' : ''}{t}
            </button>
          ))}
        </div>
        {!unlocked && <p className="evidence">Bepul: “{FREE_TOPIC}” mavzusi. Qolganlari Grammar obunasi bilan ochiladi.</p>}
      </div>

      {locked ? <LockCard track="grammar" /> : (
        <>
          {topic === MISTAKES && items.length === 0 && <div className="card">Hozircha takrorlanadigan xato yo‘q. Zo‘r!</div>}
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
                <div className="opts">
                  {g.options.map((o, i) => (
                    <button key={o} disabled={a !== undefined} onClick={() => choose(g.id, i, g.answer)}
                      className={a === undefined ? 'opt' : i === g.answer ? 'opt right' : i === a ? 'opt bad' : 'opt'}>{o}</button>
                  ))}
                </div>
                {a !== undefined && (
                  <p className="evidence">
                    {a === g.answer ? <span className="ok">To‘g‘ri. </span> : <span className="bad">Noto‘g‘ri. </span>}
                    {g.explanationUz}
                  </p>
                )}
              </div>
            );
          })}
          {!done && items.length > 0 && <button className="btn primary" disabled={Object.keys(answers).length === 0} onClick={finish}>Natijani saqlash</button>}
        </>
      )}
    </div>
  );
}
