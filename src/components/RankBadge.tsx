/** 1–3 o'rin uchun oltin/kumush/bronza doira, qolganlari oddiy raqam. */
export function RankBadge({ n }: { n: number | null }) {
  if (n === null) return <span className="muted">…</span>;
  return n <= 3 ? <span className={`rank r${n}`}>{n}</span> : <span className="muted" style={{ fontWeight: 700 }}>{n}</span>;
}
