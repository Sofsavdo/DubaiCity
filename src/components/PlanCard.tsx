import { CalendarCheck, ArrowRight } from 'lucide-react';
import { ALL_NODES, nodeById, skillNodeTitle, topicOfNode } from '../content/curriculum/inventory';
import { ALL_LESSONS } from '../content/lessons';
import { loadAdaptive } from '../lib/adaptive/store';
import { planDay, type PlanTask } from '../lib/adaptive/recommend';
import { levelIndex, type Cefr } from '../lib/levels';
import { useProfile } from '../lib/store';

const ERR_UZ: Record<string, string> = {
  'G.tense': 'zamonlar', 'G.article': 'artikllar', 'G.preposition': 'predloglar', 'G.sva': 'ega-kesim moslashuvi', 'G.word_order': 'so‘z tartibi', 'G.modal': 'modal fe’llar',
  'G.conditional': 'shart gaplar', 'G.plural': 'ko‘plik', 'G.pronoun': 'olmoshlar', 'G.quantifier': 'miqdor', 'G.passive': 'majhul nisbat', 'G.relative_clause': 'nisbiy gaplar',
  'G.comparison': 'taqqoslash', 'G.gerund_infinitive': 'gerund/infinitiv', 'G.complex_structure': 'murakkab tuzilmalar', 'V.word_choice': 'so‘z tanlash', 'V.spelling': 'imlo',
  'R.inference': 'xulosa chiqarish (Reading)', 'R.detail': 'tafsilotni topish (Reading)', 'R.main_idea': 'asosiy g‘oya (Reading)',
  'L.detail': 'tafsilotni eshitish (Listening)', 'L.gist': 'umumiy mazmun (Listening)', 'L.distractor': 'chalg‘ituvchi javoblar (Listening)',
};
const levelOf = (l: string): number => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(l);

function whyUz(t: PlanTask): string {
  switch (t.reason) {
    case 'revision_due': return `Takrorlash vaqti keldi (${t.params.days} kun kechikkan).`;
    case 'repeated_error': return `Yaqinda «${ERR_UZ[String(t.params.taxonomy)] ?? t.params.taxonomy}» xatosini ${t.params.count} marta qildingiz — shu ustida ishlaymiz.`;
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
  const isSkill = (s: string): boolean => s === 'reading' || s === 'listening';
  // levels that already have structured General English lessons: the lessons replace the loose legacy grammar topics in the plan (answers there still count)
  const lessonLevels = new Set(ALL_LESSONS.map((x) => x.unit.level as string));
  const window = ALL_NODES.filter((n) => (isSkill(n.skill) || Math.abs(levelOf(n.level) - u) <= 1) && !(n.id.startsWith('ge.grammar.') && lessonLevels.has(n.level))); // reading/listening question types matter at every level
  const saved = loadAdaptive();
  const assumedIds = ALL_NODES.filter((n) => !isSkill(n.skill) && levelOf(n.level) < u).map((n) => n.id);
  // below-level nodes count as known (placement evidence) and are only planned once real answers show they are weak
  const candidates = window.filter((n) => !assumedIds.includes(n.id) || !!saved.mastery[n.id]);
  const examDate = p.examDate ? new Date(p.examDate).getTime() : undefined;
  const plan = planDay(candidates, {
    mastery: saved.mastery, recentErrors: saved.errors, goalTags: ['general'], examDate, now: Date.now(),
    assumed: assumedIds,
  }, { minutes: 25 });
  return (
    <section className="card">
      <h3><CalendarCheck size={18} /> Bugungi reja <span className="pill">taxminiy · {plan.reduce((s, t) => s + t.minutes, 0)} daqiqa</span></h3>
      {plan.length === 0 && <p className="muted">Bugun uchun yangi vazifa topilmadi. Grammar bo‘limida mashq qilib ko‘ring.</p>}
      <div className="stack">
        {plan.map((t) => {
          const node = nodeById(t.nodeId);
          const isVocab = node?.skill === 'vocabulary';
          const skillTitle = skillNodeTitle(t.nodeId);
          const lesson = ALL_LESSONS.find((x) => `ge.lesson.${x.lesson.id}` === t.nodeId);
          const title = lesson ? `Dars: ${lesson.lesson.titleUz}` : skillTitle ?? (isVocab ? `So‘z boyligi · ${node!.level}` : (topicOfNode(t.nodeId) ?? t.nodeId));
          const href = lesson ? `#/learn/${lesson.lesson.id}` : node?.skill === 'reading' ? '#/exam/reading' : node?.skill === 'listening' ? '#/exam/listening' : isVocab ? '#/games' : '#/grammar';
          return (
            <a key={t.nodeId} className="path-step" href={href} onClick={() => { if (href === '#/grammar') { try { sessionStorage.setItem('bandly.nextTopic', title); } catch { /* ignore */ } } }}>
              <b>{title}</b><span>{t.minutes} daq · {whyUz(t)}</span>
            </a>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 13 }}>Reja daraja testingiz hamda General English darslari, Grammar, Gap tuzish, so‘z o‘yinlari, Reading va Listening testlaridagi javoblaringiz asosida tuziladi; bilimingiz o‘zgarganda yangilanadi.</p>
    </section>
  );
}
