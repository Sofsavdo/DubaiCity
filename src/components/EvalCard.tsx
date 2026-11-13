import type { Evaluation } from '../lib/ai';

const LABEL: Record<string, string> = {
  fluency: 'Fluency & Coherence', lexical: 'Lexical Resource', grammar: 'Grammar', pronunciation: 'Pronunciation',
  task_response: 'Task Response', task_achievement: 'Task Achievement', coherence: 'Coherence & Cohesion',
};

export function EvalCard({ ev, title = 'AI baho' }: { ev: Evaluation; title?: string }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}: <span className="big">{ev.overall.toFixed(1)}</span></h3>
      <p className="evidence">AI bahosi taxminiy va rasmiy imtihon natijasi emas.</p>
      <div className="row">
        {Object.entries(ev.bands).map(([k, v]) => <span key={k} className="pill">{LABEL[k] ?? k}: <b>{v === null ? 'baholanmaydi' : v.toFixed(1)}</b></span>)}
      </div>
      {ev.strengths.length > 0 && <><h4>Kuchli tomonlar</h4><ul>{ev.strengths.map((s) => <li key={s}>{s}</li>)}</ul></>}
      {ev.improve.length > 0 && <><h4>Yaxshilash kerak</h4><ul>{ev.improve.map((s) => <li key={s}>{s}</li>)}</ul></>}
      {ev.corrections.length > 0 && (
        <>
          <h4>Tuzatishlar</h4>
          <table className="data"><thead><tr><th>Siz aytdingiz</th><th>Yaxshiroq</th></tr></thead>
            <tbody>{ev.corrections.map((c) => <tr key={c.said}><td>{c.said}</td><td>{c.better}</td></tr>)}</tbody></table>
        </>
      )}
    </div>
  );
}
