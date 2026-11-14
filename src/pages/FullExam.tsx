import { ArrowRight, CheckCircle2, Circle, ClipboardCheck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { levelIndex } from '../lib/levels';
import { roundHalf } from '../lib/progress';
import { loadResults, type ResultRecord } from '../lib/storage';
import { useProfile } from '../lib/store';

const KEY = 'bandly.fullexam.v1';
interface State { startedAt: number; listeningId: string; readingId: string; writingDone: boolean }

export const loadFull = (): State | null => { try { const j = localStorage.getItem(KEY); return j ? (JSON.parse(j) as State) : null; } catch { return null; } };
const saveFull = (s: State | null) => { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch { /* saqlash yo'q */ } };

const nearest = <T extends { level: Parameters<typeof levelIndex>[0] }>(list: T[], level: Parameters<typeof levelIndex>[0]): T =>
  [...list].sort((a, b) => Math.abs(levelIndex(a.level) - levelIndex(level)) - Math.abs(levelIndex(b.level) - levelIndex(level)))[0];

const since = (results: ResultRecord[], t0: number, pred: (r: ResultRecord) => boolean) => results.find((r) => Date.parse(r.date) >= t0 && pred(r));

export default function FullExam() {
  const p = useProfile();
  const [st, setSt] = useState<State | null>(loadFull());
  const results = loadResults();

  const start = () => {
    const s: State = { startedAt: Date.now(), listeningId: nearest(listeningTests, p.level ?? 'B1').id, readingId: nearest(readingTests, p.level ?? 'B1').id, writingDone: false };
    saveFull(s); setSt(s);
  };
  const reset = () => { saveFull(null); setSt(null); };

  if (!st) {
    return (
      <div className="stage">
        <div className="stage-center">
          <span className="eyebrow"><ClipboardCheck size={15} /> Imtihon simulyatsiyasi</span>
          <h1 className="say">To‘liq IELTS tartibida bir o‘tirishda</h1>
          <p className="lead" style={{ maxWidth: 620 }}>Haqiqiy imtihondagi tartib: <b>Listening → Reading → Writing → Speaking</b>. Har bo‘lim taymer bilan, Listening faqat bir marta eshittiriladi. Oxirida bo‘limlar bo‘yicha taxminiy umumiy band chiqadi.</p>
          <ul className="rules">
            <li>Telefonni o‘chiring, naushnik taqing va to‘xtamasdan bajaring.</li>
            <li>Test darajangizga ({p.level ?? 'B1'}) mos tanlanadi.</li>
            <li>Natijalar taxminiy: rasmiy IELTS balli emas.</li>
          </ul>
          <button className="btn primary lg" onClick={start}>Imtihonni boshlash <ArrowRight size={18} /></button>
        </div>
      </div>
    );
  }

  const L = listeningTests.find((t) => t.id === st.listeningId)!;
  const R = readingTests.find((t) => t.id === st.readingId)!;
  const rl = since(results, st.startedAt, (r) => r.kind === 'listening' && r.title === L.title);
  const rr = since(results, st.startedAt, (r) => r.kind === 'reading' && r.title === R.title);
  const rs = since(results, st.startedAt, (r) => r.kind === 'speaking');
  const parts = [
    { name: 'Listening', sub: `${L.title.replace(/^Listening mini-test \d+: /, '')} · ${L.minutes} daqiqa`, res: rl, href: `#/mocks/listening/${L.id}`, done: !!rl },
    { name: 'Reading', sub: `${R.title.replace(/^Reading mini-test \d+: /, '')} · ${R.minutes} daqiqa`, res: rr, href: `#/mocks/reading/${R.id}`, done: !!rr },
    { name: 'Writing', sub: 'Task 2 insho: yozib, tekshiruvdan o‘tkazing (band berilmaydi)', res: undefined, href: '#/exam/writing', done: st.writingDone },
    { name: 'Speaking', sub: 'Ustoz bilan jonli suhbat (Part 1–3)', res: rs, href: '#/exam/speaking', done: !!rs },
  ];
  const bands = [rl?.band, rr?.band, rs?.band].filter((b): b is number => typeof b === 'number');
  const doneN = parts.filter((x) => x.done).length;
  const overall = bands.length ? roundHalf(bands.reduce((a, b) => a + b, 0) / bands.length) : null;
  const all = doneN === 4;
  const nextIdx = parts.findIndex((x) => !x.done);

  return (
    <div>
      <div className="card">
        <h2><ClipboardCheck size={22} style={{ verticalAlign: -4 }} /> To‘liq imtihon ({doneN}/4)</h2>
        <div className="bar" style={{ margin: '10px 0' }}><i style={{ width: `${(doneN / 4) * 100}%` }} /></div>
        <div className="exam-steps">
          {parts.map((x, i) => (
            <div key={x.name} className={`exam-step ${x.done ? 'done' : i === nextIdx ? 'now' : ''}`}>
              <span className="ico">{x.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}</span>
              <div className="grow">
                <b>{i + 1}. {x.name}</b>
                <p className="evidence" style={{ margin: 0 }}>{x.sub}</p>
                {x.res && <p className="ok" style={{ margin: '2px 0 0' }}>{x.res.kind === 'speaking' ? 'Bajarildi' : `${x.res.correct}/${x.res.total}`}{typeof x.res.band === 'number' ? ` · taxminiy band ${x.res.band.toFixed(1)}` : ''}</p>}
              </div>
              {x.name === 'Writing' && !x.done && <button className="btn sm" onClick={() => { const n = { ...st, writingDone: true }; saveFull(n); setSt(n); }}>Bajardim</button>}
              {!x.done && i === nextIdx && <a className="btn primary sm" href={x.href}>Boshlash</a>}
              {!x.done && i !== nextIdx && x.name !== 'Writing' && <a className="btn sm" href={x.href}>Ochish</a>}
              {x.name === 'Writing' && !x.done && i !== nextIdx && <a className="btn sm" href={x.href}>Ochish</a>}
            </div>
          ))}
        </div>
      </div>

      {overall !== null && (
        <div className="stage">
          <div className="stage-center">
            <p className="evidence">{all ? 'Imtihon yakunlandi' : `Hozirgacha ${bands.length} ta bo‘lim bo‘yicha`}</p>
            <div className="score">{overall.toFixed(1)}</div>
            <p className="lead">Taxminiy umumiy band</p>
            {p.baselineBand !== null && <p>{overall > p.baselineBand ? <b className="ok">Boshlang‘ich {p.baselineBand.toFixed(1)} dan +{(overall - p.baselineBand).toFixed(1)} yuqori.</b> : overall === p.baselineBand ? 'Boshlang‘ich natijangiz bilan teng.' : 'Boshlang‘ich bahodan past: yana mashq kerak.'}</p>}
            <p className="evidence">Writing band kiritilmagan, rasmiy imtihon natijasi boshqacha bo‘lishi mumkin.</p>
          </div>
        </div>
      )}
      <div className="row"><button className="btn" onClick={reset}><RotateCcw size={16} /> Yangi imtihon</button></div>
    </div>
  );
}
