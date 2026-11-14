import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { WritingTask } from '../content/lessons/types';
import { checkWriting, wordCount, type WritingCheck } from '../lib/lessons';
import { logErrors } from '../lib/adaptive/store';
import { addMistake } from '../lib/mistakes';
import type { TaxonomyId } from '../lib/adaptive/taxonomy';

// grammarCheck rule id → error type (only where the mapping is clear)
const ISSUE_TAX: Record<string, TaxonomyId> = { '3sg': 'G.sva', dont3: 'G.sva', 'didnt-past': 'G.tense', 'more-adj': 'G.comparison', peoples: 'G.plural', informations: 'G.plural', 'am-study': 'G.tense', 'years-old': 'V.word_choice', 'listen-music': 'G.preposition', 'depend-of': 'G.preposition', 'married-with': 'G.preposition' };

/** Writing step: rule-based checks only (length, required structures, forbidden patterns, known learner errors). Not an AI or band score. */
export function LessonWrite({ task }: { task: WritingTask }) {
  const [text, setText] = useState('');
  const [res, setRes] = useState<WritingCheck | null>(null);
  const run = () => {
    const r = checkWriting(task, text);
    setRes(r);
    logErrors(r.issues.map((i) => ISSUE_TAX[i.id]).filter((x): x is TaxonomyId => !!x));
    for (const i of r.issues) { try { addMistake('writing', { kind: 'fix', wrong: i.wrong, right: i.right, whyUz: i.ruleUz }, ISSUE_TAX[i.id] ? [ISSUE_TAX[i.id]!] : []); } catch { /* not a usable pair */ } }
  };
  return (
    <div>
      <p><b>Topshiriq:</b> {task.promptUz}</p>
      <textarea className="answer" rows={5} style={{ width: '100%' }} value={text} placeholder="Inglizcha yozing…" onChange={(e) => { setText(e.target.value); setRes(null); }} />
      <p className="muted" style={{ fontSize: 13 }}>{wordCount(text)} / kamida {task.minWords} so‘z</p>
      <button type="button" className="btn primary" disabled={!text.trim()} onClick={run}>Tekshirish</button>
      {res && (
        <div style={{ marginTop: 12 }}>
          <ul>
            <li>{res.enoughWords ? <CheckCircle2 size={14} className="ok" /> : <XCircle size={14} className="bad" />} Hajm: {res.words} so‘z</li>
            {res.reqs.map((r) => <li key={r.labelUz}>{r.ok ? <CheckCircle2 size={14} className="ok" /> : <XCircle size={14} className="bad" />} {r.labelUz}</li>)}
            {res.forbidden.map((f) => <li key={f} className="bad"><XCircle size={14} /> {f}</li>)}
            {res.issues.map((i) => <li key={i.id + i.wrong}><XCircle size={14} className="bad" /> «{i.wrong}» → «{i.right}»: <span className="muted">{i.ruleUz}</span></li>)}
          </ul>
          <p className={res.passed ? 'ok' : 'bad'}>{res.passed ? 'Topshiriq talablari bajarildi.' : 'Yuqoridagilarni tuzatib, qayta tekshiring.'}</p>
          <p><b>Namuna javob:</b> <span className="muted">{task.model}</span></p>
          <p className="muted" style={{ fontSize: 13 }}>Bu tekshiruv qoidalarga asoslangan: u ma’lum xatolarni topadi, lekin matningizdagi barcha xatolarni topa olmaydi va ball bermaydi.</p>
        </div>
      )}
    </div>
  );
}
