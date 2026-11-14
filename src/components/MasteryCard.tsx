import { Brain } from 'lucide-react';
import { ALL_NODES, skillNodeTitle, topicOfNode } from '../content/curriculum/inventory';
import { ALL_LESSONS } from '../content/lessons';
import { effectiveMastery, stateOf, type MasteryState } from '../lib/adaptive/mastery';
import { loadAdaptive } from '../lib/adaptive/store';
import { TAXONOMY, type TaxonomyId } from '../lib/adaptive/taxonomy';
import { loadSkills } from '../lib/skillCheck';

const STATE_UZ: Record<MasteryState, string> = { new: 'yangi', learning: 'o‘rganilmoqda', known: 'biladi', needs_revision: 'takrorlash kerak', mastered: 'o‘zlashtirilgan' };

function SkillLine() {
  const s = loadSkills();
  return (
    <p className="row">
      <span className="pill">Reading: {s.reading?.level ?? '—'}</span><span className="pill">Listening: {s.listening?.level ?? '—'}</span>
      <a className="btn sm" style={{ whiteSpace: 'normal' }} href="#/skills">{s.reading || s.listening ? 'Qayta tekshirish' : 'Reading / Listening darajasini aniqlash'}</a>
    </p>
  );
}

function titleOf(id: string): string {
  const l = ALL_LESSONS.find((x) => `ge.lesson.${x.lesson.id}` === id);
  if (l) return `Dars: ${l.lesson.titleUz}`;
  const n = ALL_NODES.find((x) => x.id === id);
  if (n?.skill === 'vocabulary') return `So‘z boyligi · ${n.level}`;
  return skillNodeTitle(id) ?? topicOfNode(id) ?? id;
}

/** "My knowledge map": only practised nodes, real mastery values and the error types that repeat most. No numbers are invented. */
export function MasteryCard() {
  const s = loadAdaptive();
  const now = Date.now();
  const rows = Object.entries(s.mastery)
    .map(([id, r]) => ({ id, eff: effectiveMastery(r, now), state: stateOf(r, now), attempts: r.attempts }))
    .sort((a, b) => a.eff - b.eff);
  const counts = new Map<string, number>();
  for (const e of s.errors) counts.set(e, (counts.get(e) ?? 0) + 1);
  const topErrors = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return (
    <div className="card">
      <span className="eyebrow"><Brain size={15} /> Bilim xaritam</span>
      <SkillLine />
      {rows.length === 0 ? (
        <p className="muted">Hali ma’lumot yo‘q. Dars, Grammar, o‘yin yoki Reading/Listening testini bajaring — shu yerda har bir mavzu bo‘yicha o‘zlashtirish darajangiz ko‘rinadi.</p>
      ) : (
        <>
          <p className="evidence">O‘zlashtirish — javoblaringiz, qiyinligi va vaqt o‘tishi bilan unutilishni hisobga olgan taxminiy ko‘rsatkich (qurilmada saqlanadi).</p>
          <div className="stack">
            {rows.map((r) => (
              <div key={r.id} className="skill" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 4 }}>
                <span>{titleOf(r.id)} <span className="muted">· {STATE_UZ[r.state]} · {r.attempts} javob</span></span>
                <b>{Math.round(r.eff * 100)}%</b>
                <div className="bar" style={{ gridColumn: '1 / -1' }}><i style={{ width: `${Math.round(r.eff * 100)}%` }} /></div>
              </div>
            ))}
          </div>
          {topErrors.length > 0 && (
            <>
              <h3 style={{ marginTop: 14 }}>Ko‘p takrorlanayotgan xatolar (oxirgi {s.errors.length} ta xato ichida)</h3>
              <p className="row">{topErrors.map(([t, c]) => <span key={t} className="pill">{TAXONOMY[t as TaxonomyId] ?? t} · {c}</span>)}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
