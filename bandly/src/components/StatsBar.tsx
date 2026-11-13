import { levelProgress } from '../lib/game';
import { useProfile } from '../lib/store';

export function StatsBar() {
  const p = useProfile();
  const lp = levelProgress(p.xp);
  const goalPct = Math.min(1, p.dailyXp / Math.max(1, p.dailyGoal));
  return (
    <div className="stats" aria-label="Statistika">
      <span className="stat" title="Ketma-ket kunlar">🔥 {p.streak}</span>
      <span className="stat" title={`${lp.into}/${lp.span} XP`}>
        ⭐ {lp.level}
        <span className="mini"><i style={{ width: `${lp.pct * 100}%` }} /></span>
      </span>
      <span className="stat" title="Kunlik maqsad">
        🎯 {Math.min(p.dailyXp, p.dailyGoal)}/{p.dailyGoal}
        <span className="mini"><i style={{ width: `${goalPct * 100}%`, background: goalPct >= 1 ? 'var(--ok)' : undefined }} /></span>
      </span>
    </div>
  );
}
