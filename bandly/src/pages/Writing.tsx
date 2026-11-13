import { useState } from 'react';
import { writingPrompts } from '../content/writing';
import { analyzeWriting, type WritingReport } from '../lib/writingCheck';
import { fmt, useCountdown } from '../components/hooks';
import { addXp } from '../lib/store';

export default function Writing() {
  const [id, setId] = useState(writingPrompts[2].id);
  const p = writingPrompts.find((x) => x.id === id)!;
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<WritingReport | null>(null);
  const [left, reset] = useCountdown(p.minutes * 60, running, () => setRunning(false));
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const choose = (v: string) => {
    const np = writingPrompts.find((x) => x.id === v)!;
    setId(v); setText(''); setReport(null); setRunning(false); reset(np.minutes * 60);
  };

  return (
    <div>
      <div className="card">
        <h2>Writing mashqi</h2>
        <div className="row">
          <select value={id} onChange={(e) => choose(e.target.value)}>
            {writingPrompts.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
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
        <p className="pill">Kamida {p.minWords} so‘z · {p.minutes} daqiqa</p>
      </div>
      <div className="card">
        <textarea className="essay" value={text} onChange={(e) => setText(e.target.value)} placeholder="Javobingizni inglizcha yozing..." />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className={words >= p.minWords ? 'ok' : 'pill'}>{words} so‘z</span>
          <button className="btn primary" onClick={() => { const r = analyzeWriting(text, p.minWords); setReport(r); if (r.words >= p.minWords) addXp(20); }} disabled={words === 0}>Oddiy tekshiruv</button>
        </div>
        <p className="notice" style={{ marginTop: 12 }}>
          Bu <b>AI baholash emas</b>: faqat so‘zlar soni, abzatslar, bog‘lovchilar va takrorlarni tekshiradi, band bermaydi. AI bilan batafsil baho (4 mezon bo‘yicha) keyingi versiyada, AI xizmati ulanganda qo‘shiladi.
        </p>
        {report && (
          <div>
            <h3>Natija</h3>
            <ul>{report.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="evidence">
              Abzatslar: {report.paragraphs} · Gaplar: {report.sentences} · O‘rtacha gap uzunligi: {report.avgSentence.toFixed(1)} so‘z · Bog‘lovchilar: {report.linkers.join(', ') || 'topilmadi'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
