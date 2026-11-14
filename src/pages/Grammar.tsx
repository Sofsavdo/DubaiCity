import { Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { grammar, grammarTopics, topicLevel } from '../content/grammar';
import { fits } from '../lib/levels';
import { LockCard } from '../components/Gate';
import { saveResult } from '../lib/storage';
import { addXp, recordReview, useProfile } from '../lib/store';
import { recordGrammarItem } from '../lib/adaptive/record';

const FREE_TOPICS: string[] = ['To be va there is', 'Artikllar'];
const MISTAKES = 'Xatolarim';
const FOR_YOU = 'Sizga mos';

/** Topic chosen on the Home plan card (one-shot handoff via sessionStorage). */
function takeNextTopic(): string | undefined {
  try { const t = sessionStorage.getItem('bandly.nextTopic'); sessionStorage.removeItem('bandly.nextTopic'); return t && (grammarTopics as readonly string[]).includes(t) ? t : undefined; } catch { return undefined; }
}

export default function Grammar() {
  const profile = useProfile();
  const unlocked = profile.plan.grammar;
  const [topic, setTopic] = useState<string>(() => takeNextTopic() ?? (profile.level && profile.plan.grammar ? FOR_YOU : profile.level && ['A1', 'A2'].includes(profile.level) ? FREE_TOPICS[0] : FREE_TOPICS[1]));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const locked = !unlocked && !FREE_TOPICS.includes(topic);
  const items = useMemo(() => {
    if (topic === 'Hammasi') return grammar;
    if (topic === FOR_YOU) return grammar.filter((g) => fits(g.level, profile.level, 0, 1)).slice(0, 15);
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
    recordGrammarItem(id, i === answer);
    if (i === answer) addXp(3);
  };
  const finish = () => {
    setDone(true);
    saveResult({ kind: 'grammar', title: `Grammar: ${topic}`, correct, total: items.length });
    if (correct === items.length && items.length > 0) addXp(10);
  };
  const tabs = [...(profile.level ? [FOR_YOU] : []), 'Hammasi', ...grammarTopics, MISTAKES];

  return (
    <div>
      <div className="card">
        <h2>Grammar</h2>
        {profile.level ? <p className="evidence">Sizning darajangiz: <b>{profile.level}</b>. “{FOR_YOU}” bo‘limida aynan sizga mos savollar bor.</p> : <p className="evidence"><a href="#/placement">Darajangizni aniqlang</a>: sizga mos savollar tanlab beriladi.</p>}
        <p>Har javobdan keyin o‘zbekcha tushuntirish chiqadi. Noto‘g‘ri javoblar "{MISTAKES}" bo‘limida takrorlanadi.</p>
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t} className={`btn ${t === topic ? 'primary' : ''}`} onClick={() => change(t)}>
              {!unlocked && !FREE_TOPICS.includes(t) && <Lock size={14} />}{t}{topicLevel[t] && <span className={`lvl-tag ${topicLevel[t]}`}>{topicLevel[t]}</span>}
            </button>
          ))}
        </div>
        {!unlocked && <p className="evidence">Bepul: {FREE_TOPICS.map((x) => `“${x}”`).join(' va ')} mavzulari. Qolganlari Grammar obunasi bilan ochiladi.</p>}
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
                <div className="row"><span className="pill">{g.topic}</span><span className={`lvl-tag ${g.level}`}>{g.level}</span></div>
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
