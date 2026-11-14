import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { Item } from '../content/lessons/types';
import { checkItem, correctAnswerText, type ItemAnswer } from '../lib/lessons';

/** Renders one deterministic exercise item (choice / gap / order) with optional reveal of the answer. Shared by lessons and mistake review. */
export function ItemView({ item, value, onChange, revealed }: { item: Item; value: ItemAnswer; onChange: (v: ItemAnswer) => void; revealed: boolean }) {
  const ok = revealed && checkItem(item, value);
  return (
    <div className="q">
      <p><b>{item.kind === 'order' ? 'So‘zlardan to‘g‘ri gap tuzing:' : item.prompt}</b></p>
      {item.kind === 'choice' && (
        <div className="stack">
          {item.options.map((o, i) => (
            <button key={o} type="button" className={`opt ${revealed ? (i === item.answer ? 'right' : i === value ? 'bad' : '') : value === i ? 'sel' : ''}`} disabled={revealed} onClick={() => onChange(i)}>{o}</button>
          ))}
        </div>
      )}
      {item.kind === 'gap' && (
        <input type="text" autoComplete="off" disabled={revealed} value={typeof value === 'string' ? value : ''} placeholder="Javobni yozing" onChange={(e) => onChange(e.target.value)} />
      )}
      {item.kind === 'order' && <OrderInput item={item} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={revealed} />}
      {revealed && (
        <p style={{ marginTop: 8 }}>
          {ok ? <span className="ok"><CheckCircle2 size={16} /> To‘g‘ri. </span> : <span className="bad"><XCircle size={16} /> Noto‘g‘ri. To‘g‘ri javob: «{correctAnswerText(item)}». </span>}
          <span className="muted">{item.explainUz}</span>
        </p>
      )}
    </div>
  );
}

export function OrderInput({ item, value, onChange, disabled }: { item: Extract<Item, { kind: 'order' }>; value: string[]; onChange: (v: string[]) => void; disabled: boolean }) {
  const pool = item.words.map((w, i) => ({ w, i }));
  const [picked, setPicked] = useState<number[]>([]);
  const add = (i: number) => { if (disabled || picked.includes(i)) return; const n = [...picked, i]; setPicked(n); onChange(n.map((k) => item.words[k]!)); };
  const undo = () => { if (disabled) return; const n = picked.slice(0, -1); setPicked(n); onChange(n.map((k) => item.words[k]!)); };
  return (
    <div>
      <div className="card" style={{ minHeight: 48, padding: 10, margin: '6px 0' }}>{value.length ? value.join(' ') : <span className="muted">So‘zlarni tartib bilan bosing</span>}</div>
      <div className="row">
        {pool.map(({ w, i }) => <button key={i} type="button" className="chipbtn" disabled={disabled || picked.includes(i)} style={picked.includes(i) ? { opacity: 0.35 } : undefined} onClick={() => add(i)}>{w}</button>)}
        <button type="button" className="btn sm" disabled={disabled || !picked.length} onClick={undo}><RotateCcw size={14} /> Orqaga</button>
      </div>
    </div>
  );
}

