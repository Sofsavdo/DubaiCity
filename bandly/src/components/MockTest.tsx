import { useState, type ReactNode } from 'react';
import type { Question } from '../content/types';
import { gradeAll, type Answer } from '../lib/grade';
import { scaledBand } from '../lib/band';
import { saveResult } from '../lib/storage';
import { addXp } from '../lib/store';
import { fmt, useCountdown } from './hooks';
import { QuestionList } from './QuestionList';

interface Props {
  kind: 'reading' | 'listening';
  title: string;
  minutes: number;
  groups: { instruction: string; questionIds: number[] }[];
  questions: Question[];
  table: ReadonlyArray<readonly [number, number]>;
  /** started=true bo'lganda ko'rsatiladigan chap panel (matn yoki audio) */
  left: (state: { started: boolean; submitted: boolean }) => ReactNode;
  intro: ReactNode;
}

export function MockTest({ kind, title, minutes, groups, questions, table, left, intro }: Props) {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = gradeAll(questions, answers);
    saveResult({ kind, title, correct, total: questions.length, band: scaledBand(correct, questions.length, table) });
    addXp(correct * 5 + (correct / questions.length >= 0.8 ? 20 : 0));
  };

  const [left_, reset] = useCountdown(minutes * 60, started && !submitted, submit);
  const correct = gradeAll(questions, answers);
  const band = scaledBand(correct, questions.length, table);

  const restart = () => {
    setAnswers({});
    setSubmitted(false);
    setStarted(false);
    reset(minutes * 60);
  };

  if (!started) {
    return (
      <div className="card">
        <h2>{title}</h2>
        {intro}
        <p className="pill">{questions.length} ta savol · {minutes} daqiqa</p>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={() => setStarted(true)}>Testni boshlash</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card row" style={{ justifyContent: 'space-between' }}>
        <b>{title}</b>
        <span className={`timer ${left_ < 60 ? 'low' : ''}`}>{fmt(left_)}</span>
        {!submitted ? (
          <button className="btn primary" onClick={submit}>Yakunlash</button>
        ) : (
          <button className="btn" onClick={restart}>Qayta boshlash</button>
        )}
      </div>

      {submitted && (
        <div className="card">
          <div className="score">{correct} / {questions.length}</div>
          <div>
            Taxminiy band: <b>{band.toFixed(1)}</b> <span className="pill">40 ballik shkalaga keltirilgan, rasmiy natija emas</span>
          </div>
        </div>
      )}

      <div className="split">
        <div className="card scroll">{left({ started, submitted })}</div>
        <div className="card scroll">
          <QuestionList groups={groups} questions={questions} answers={answers} onChange={(id, a) => setAnswers((p) => ({ ...p, [id]: a }))} submitted={submitted} />
        </div>
      </div>
    </div>
  );
}
