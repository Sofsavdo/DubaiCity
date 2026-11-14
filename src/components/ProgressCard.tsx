import { Clock, Target, TrendingUp } from 'lucide-react';
import { gain, lastDays, skillBands, studyPlan } from '../lib/progress';
import { loadResults } from '../lib/storage';
import { useProfile } from '../lib/store';

const SKILL: Record<string, string> = { reading: 'Reading', listening: 'Listening', speaking: 'Speaking' };

/** Boshlang'ich → hozirgi → maqsad: o'sish va keyingi qadam. Hammasi TAXMINIY (qurilmadagi natijalardan). */
export function ProgressCard() {
  const p = useProfile();
  if (!p.level || p.baselineBand === null) return null;
  const results = loadResults();
  const g = gain(p, results);
  const sb = skillBands(results);
  const plan = studyPlan(p, results);
  const days = lastDays(p.activity, 14);
  const max = Math.max(20, ...days.map((d) => d.xp));
  const base = p.baselineBand, cur = g.current ?? base, tgt = Math.max(p.target, cur);
  const pct = (v: number) => `${Math.min(100, Math.max(0, ((v - base) / Math.max(0.5, tgt - base)) * 100))}%`;
  const delta = g.delta ?? 0;
  return (
    <section className="card progress-card">
      <div className="myplan-head">
        <div>
          <span className="eyebrow"><TrendingUp size={15} /> Sizning o‘sishingiz</span>
          <h2 style={{ margin: '4px 0' }}>{base.toFixed(1)} → <span className="lvl-inline">{cur.toFixed(1)}</span> → {p.target.toFixed(1)}</h2>
          <p className="evidence">
            Boshlang‘ich · hozirgi (taxminiy) · maqsad. {delta > 0 ? <b className="ok">+{delta.toFixed(1)} band o‘sdi.</b> : delta < 0 ? 'Hozircha pasayish: yana mashq qiling.' : 'Mashq qilgan sari o‘sish shu yerda ko‘rinadi.'}
          </p>
        </div>
        <div className="gainbadge" title="Hozirgi taxminiy band">{cur.toFixed(1)}</div>
      </div>
      <div className="journey" aria-label="Maqsad sari yo‘l">
        <div className="bar"><i style={{ width: pct(cur) }} /></div>
        <div className="journey-marks"><span>{base.toFixed(1)}</span><span>{tgt.toFixed(1)}</span></div>
      </div>
      <div className="skills">
        {(['reading', 'listening', 'speaking'] as const).map((k) => (
          <div key={k} className="skill"><span>{SKILL[k]}</span><b>{sb[k] !== undefined ? (sb[k] as number).toFixed(1) : '—'}</b></div>
        ))}
      </div>
      <div className="plan-note">
        <p><Target size={15} style={{ verticalAlign: -2 }} /> Maqsadga yetish uchun taxminan <b>{plan.hours} soat</b> mashq kerak (o‘rtacha 1 band ≈ 150 soat). {p.examDate && plan.daysLeft !== null ? <>Imtihongacha <b>{plan.daysLeft} kun</b>: kuniga <b>~{plan.minutesPerDay} daqiqa</b>.</> : <>Kuniga <b>{plan.minutesPerDay} daqiqa</b> bilan ~<b>{plan.weeksNeeded} hafta</b>.</>}</p>
        {!plan.realistic && <p className="warn">Muddat qisqa: bu tezlik real bo‘lmasligi mumkin. Maqsad yoki sanani qayta ko‘rib chiqing.</p>}
        {plan.hours > 0 && <p><Clock size={15} style={{ verticalAlign: -2 }} /> Birinchi navbatda: <b>{plan.focus.map((k) => SKILL[k]).join(' → ')}</b> (eng pasti birinchi).</p>}
      </div>
      <div className="spark" aria-label="Oxirgi 14 kun faolligi">
        {days.map((d) => <i key={d.day} title={`${d.day}: ${d.xp} XP`} style={{ height: `${Math.max(6, (d.xp / max) * 44)}px`, opacity: d.xp ? 1 : 0.25 }} />)}
      </div>
      <p className="evidence">Taxminiy hisob: qurilmadagi test natijalariga asoslangan va rasmiy IELTS balli emas. O‘sishni aniq ko‘rish uchun har 2 haftada <a href="#/placement">darajani qayta aniqlang</a>.</p>
    </section>
  );
}
