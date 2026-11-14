import { Target } from 'lucide-react';
import { loadResults } from '../lib/storage';
import { readiness, type ExamSkill } from '../lib/readiness';
import { useProfile } from '../lib/store';

const NAME: Record<ExamSkill, string> = { reading: 'Reading', listening: 'Listening', speaking: 'Speaking' };
const HREF: Record<ExamSkill, string> = { reading: '#/exam/reading', listening: '#/exam/listening', speaking: '#/exam/speaking' };
const CONF: Record<string, string> = { none: 'ma’lumot yo‘q', low: 'past (natijalar kam)', medium: 'o‘rtacha', good: 'yaxshi' };

/** IELTS readiness, shown next to — never merged with — the General English level. */
export function ReadinessCard() {
  const p = useProfile();
  const r = readiness(loadResults(), p.target, p.examDate);
  return (
    <div className="card">
      <span className="eyebrow"><Target size={15} /> IELTS tayyorgarligi (taxminiy)</span>
      <div className="stack">
        {(['reading', 'listening', 'speaking'] as const).map((k) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)' }}>
            <span>{NAME[k]} <span className="muted">· {r.skills[k].evidence ? `${r.skills[k].evidence} ta natija` : 'hali test yo‘q'}</span></span>
            <b>{r.skills[k].band?.toFixed(1) ?? '—'}</b>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)' }}>
          <span>Writing <span className="muted">· qoidaga asoslangan tekshiruv, ball berilmaydi</span></span><b>—</b>
        </div>
      </div>
      <p className="row" style={{ marginTop: 10 }}>
        <span className="pill">Umumiy: {r.overall?.toFixed(1) ?? '—'}</span>
        <span className="pill">Maqsad: {r.target.toFixed(1)}</span>
        {r.gap !== null && <span className="pill">Farq: {r.gap.toFixed(1)}</span>}
        <span className="pill" style={{ whiteSpace: 'normal' }}>Ishonchlilik: {CONF[r.confidence]}</span>
        {r.daysToExam !== null && r.daysToExam >= 0 && <span className="pill">Imtihongacha {r.daysToExam} kun</span>}
        {p.level && <span className="pill" style={{ whiteSpace: 'normal' }}>General English: {p.level} (alohida o‘lchanadi)</span>}
      </p>
      {r.weakest && (
        <a className="btn primary" style={{ whiteSpace: 'normal' }} href={HREF[r.weakest]}>
          {r.skills[r.weakest].band === null ? `${NAME[r.weakest]} bo‘yicha birinchi testni topshiring` : `Eng zaif ko‘nikma: ${NAME[r.weakest]} — mashq qilish`}
        </a>
      )}
      <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>Har bir ko‘nikma — oxirgi 3 ta test natijasining o‘rtachasi; umumiy ko‘rsatkich kamida 2 ta ko‘nikma bo‘lganda hisoblanadi. Bu rasmiy IELTS bali emas. Writing uchun AI baholash ulanmaguncha ball ko‘rsatilmaydi.</p>
    </div>
  );
}
