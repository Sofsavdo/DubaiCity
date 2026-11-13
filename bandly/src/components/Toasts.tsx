import { useToasts } from '../lib/store';

export function Toasts() {
  const toasts = useToasts();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast t-${t.kind}`}>{t.text}</div>)}
    </div>
  );
}
