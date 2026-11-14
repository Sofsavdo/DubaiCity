export interface Pt { label: string; value: number }

/** Oddiy SVG chiziqli grafik (kutubxonasiz): oxirgi nuqta ajratib ko'rsatiladi. */
export function LineChart({ points, min = 3, max = 9, height = 220 }: { points: Pt[]; min?: number; max?: number; height?: number }) {
  if (points.length === 0) return <p className="evidence">Grafik uchun hali natija yo‘q.</p>;
  const W = 640, H = height, padX = 40, padTop = 30, padBottom = 34;
  const x = (i: number) => (points.length === 1 ? W / 2 : padX + (i * (W - padX * 2)) / (points.length - 1));
  const y = (v: number) => padTop + (1 - (Math.min(max, Math.max(min, v)) - min) / (max - min)) * (H - padTop - padBottom);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const last = points.length - 1;
  return (
    <svg className="linechart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Band o‘sishi grafigi">
      {[min, (min + max) / 2, max].map((g) => <g key={g}><line x1={padX - 10} x2={W - padX + 10} y1={y(g)} y2={y(g)} className="grid" /><text x={6} y={y(g) + 4} className="axis">{g.toFixed(1)}</text></g>)}
      <path d={path} className="line" fill="none" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r={i === last ? 7 : 5} className={i === last ? 'dot now' : 'dot'} />
          <text x={x(i)} y={y(p.value) - 12} textAnchor="middle" className={i === last ? 'val now' : 'val'}>{p.value.toFixed(1)}</text>
          <text x={x(i)} y={H - 10} textAnchor="middle" className="axis">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}
