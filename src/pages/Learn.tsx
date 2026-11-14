import { BookOpenCheck, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { UNITS } from '../content/lessons';
import { isUnlocked, loadProgress, nextLesson } from '../lib/lessons';
import { useProfile } from '../lib/store';

/** General English path: level → unit → lesson. Pilot slice (A1–C2). */
export default function Learn() {
  const p = useProfile();
  const progress = loadProgress();
  const total = UNITS.reduce((s, u) => s + u.lessons.length, 0);
  const next = nextLesson(UNITS, progress, p.level);
  const nextTitle = next ? UNITS.find((u) => u.id === next.unitId)!.lessons.find((l) => l.id === next.lessonId)!.titleUz : null;
  const passed = UNITS.flatMap((u) => u.lessons).filter((l) => progress[l.id]?.passedAt).length;
  return (
    <div>
      <section className="card">
        <h2><BookOpenCheck size={22} /> General English</h2>
        <p>Ingliz tilini darajama-daraja o‘rganish yo‘li: har bir darsda maqsad, qisqa tushuntirish, misollar, mashq va yakuniy tekshiruv bor. Tekshiruvdan {Math.round(0.8 * 100)}% va undan yuqori natija bilan o‘tsangiz, keyingi dars ochiladi.</p>
        <div className="row">
          <span className="pill">{passed}/{total} dars tugallangan</span>
          {p.level ? <span className="pill">Darajangiz: {p.level}</span> : <a className="btn sm" href="#/placement">Darajani aniqlash</a>}
          <a className="btn sm" href="#/skills">Reading / Listening darajasi</a>
        </div>
        {next && <a className="btn primary" style={{ marginTop: 12 }} href={`#/learn/${next.lessonId}`}><PlayCircle size={16} /> Davom ettirish: {nextTitle}</a>}
        <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>Sinov (pilot) versiyasi: A1–C2 darslari Bandly uchun yozilgan va metodist tekshiruvini kutmoqda. Har bir darajada bo‘limlar soni bosqichma-bosqich ko‘payadi.</p>
      </section>
      {UNITS.map((u) => (
        <section className="card" key={u.id}>
          <h3><span className={`lvl-tag ${u.level}`}>{u.level}</span> {u.titleUz} <span className="muted" style={{ fontWeight: 500 }}>· {u.title}</span>{p.level === u.level && <span className="pill" style={{ marginLeft: 8 }}>Sizning darajangiz</span>}</h3>
          <p className="muted">{u.situationUz}</p>
          <div className="stack">
            {u.lessons.map((l, i) => {
              const open = isUnlocked(u, i, progress);
              const pr = progress[l.id];
              const Icon = pr?.passedAt ? CheckCircle2 : open ? PlayCircle : Lock;
              const body = (
                <>
                  <b><Icon size={16} /> {i + 1}. {l.titleUz}</b>
                  <span>{l.minutes} daq · {l.objectiveUz}{pr ? ` · eng yaxshi natija ${Math.round(pr.best * 100)}%` : ''}</span>
                </>
              );
              return open
                ? <a key={l.id} className={`path-step ${pr?.passedAt ? 'done' : ''}`} href={`#/learn/${l.id}`}>{body}</a>
                : <div key={l.id} className="path-step" style={{ opacity: 0.55 }} aria-disabled="true">{body}<span>Avvalgi darsdan o‘ting</span></div>;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
