import type { Question } from '../content/types';
import { correctText, isCorrect, type Answer } from '../lib/grade';

interface Props {
  groups: { instruction: string; questionIds: number[] }[];
  questions: Question[];
  answers: Record<number, Answer>;
  onChange: (id: number, a: Answer) => void;
  submitted: boolean;
}

const TFNG = ['True', 'False', 'Not Given'] as const;

export function QuestionList({ groups, questions, answers, onChange, submitted }: Props) {
  return (
    <div>
      {groups.map((g) => (
        <div key={g.instruction}>
          <div className="instr">{g.instruction}</div>
          {g.questionIds.map((id) => {
            const q = questions.find((x) => x.id === id)!;
            const a = answers[id];
            const ok = submitted && isCorrect(q, a);
            const cls = submitted ? (ok ? 'q correct' : 'q wrong') : 'q';
            return (
              <div className={cls} key={id}>
                <div>
                  <b>{id}.</b> {q.text}
                </div>
                {q.type === 'tfng' &&
                  TFNG.map((opt) => (
                    <label key={opt}>
                      <input type="radio" name={`q${id}`} disabled={submitted} checked={a === opt} onChange={() => onChange(id, opt)} /> {opt}
                    </label>
                  ))}
                {q.type === 'mcq' &&
                  q.options.map((opt, i) => (
                    <label key={opt}>
                      <input type="radio" name={`q${id}`} disabled={submitted} checked={a === i} onChange={() => onChange(id, i)} /> {String.fromCharCode(65 + i)}. {opt}
                    </label>
                  ))}
                {q.type === 'fill' && (
                  <input type="text" autoComplete="off" disabled={submitted} value={typeof a === 'string' ? a : ''} onChange={(e) => onChange(id, e.target.value)} />
                )}
                {submitted && (
                  <div className="evidence">
                    {ok ? <span className="ok">To‘g‘ri</span> : <span className="bad">Noto‘g‘ri</span>} — to‘g‘ri javob: <b>{correctText(q)}</b>
                    <div>{q.evidence}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
