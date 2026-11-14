import { CalendarCheck, ArrowRight } from 'lucide-react';
import { GRAMMAR_NODES, topicOfNode } from '../content/curriculum/inventory';
import { loadAdaptive } from '../lib/adaptive/store';
import { planDay, type PlanTask } from '../lib/adaptive/recommend';
import { levelIndex, type Cefr } from '../lib/levels';
import { useProfile } from '../lib/store';

const levelOf = (l: string): number => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(l);

function whyUz(t: PlanTask): string {
  switch (t.reason) {
    case 'revision_due': return `Takrorlash vaqti keldi (${t.params.days} kun kechikkan).`;
    case 'repeated_error': return `Yaqinda bu mavzuda ${t.params.count} marta xato qildingiz — shu xatolarni tuzatamiz.`;
    case 'exam_soon': return `Imtihongacha ${t.params.days} kun qoldi.`;
    case 'goal_match': return 'Maqsadingizga mos.';
    case 'weak_skill': return `Hozirgi o‘zlashtirish darajangiz: ${t.params.mastery}%.`;
    default: return 'Yo‘lingizdagi keyingi qadam.';
  }
}

/** "Today's plan": built only from the learner's real placement level and answered items; never invented numbers. */
export function PlanCard() {
  const p = useProfile();
  if (!p.level) {
    return (
      <section className="card"><h3><CalendarCheck size={18} /> Bugungi reja</h3>
        <p className="muted">Reja sizning real darajangizga qurilishi uchun avval daraja testini topshiring.</p>
        <a className="btn sm primary" href="#/placement">Darajani aniqlash <ArrowRight size={14} /></a>
      </section>
    );
  }
  const u = levelIndex(p.level as Cefr);
  const window = GRAMMAR_NODES.filter((n) => Math.abs(levelOf(n.level) - u) <= 1);
  const saved = loadAdaptive();
  const examDate = p.examDate ? new Date(p.examDate).getTime() : undefined;
  const plan = planDay(window, {
    mastery: saved.mastery, recentErrors: saved.errors, goalTags: ['general'], examDate, now: Date.now(),
    assumed: GRAMMAR_NODES.filter((n) => levelOf(n.level) < u).map((n) => n.id),
  }, { minutes: 25 });
  return (
    <section className="card">
      <h3><CalendarCheck size={18} /> Bugungi reja <span className="pill">taxminiy · {plan.reduce((s, t) => s + t.minutes, 0)} daqiqa</span></h3>
      {plan.length === 0 && <p className="muted">Bugun uchun yangi vazifa topilmadi. Grammar bo‘limida mashq qilib ko‘ring.</p>}
      <div className="stack">
        {plan.map((t) => {
          const topic = topicOfNode(t.nodeId) ?? t.nodeId;
          return (
            <a key={t.nodeId} className="path-step" href="#/grammar" onClick={() => { try { sessionStorage.setItem('bandly.nextTopic', topic); } catch { /* ignore */ } }}>
              <b>{topic}</b><span>{t.minutes} daq · {whyUz(t)}</span>
            </a>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 13 }}>Reja Grammar javoblaringiz va daraja testingiz asosida tuziladi; bilimingiz o‘zgarganda yangilanadi.</p>
    </section>
  );
}
