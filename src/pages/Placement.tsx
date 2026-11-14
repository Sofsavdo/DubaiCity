import { ArrowRight, CalendarDays, CheckCircle2, Rocket, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Mascot } from '../components/Mascot';
import { placement } from '../content/placement';
import { CEFR, LEVEL_INFO, suggestedTarget, type Cefr } from '../lib/levels';
import { evaluate, nextQuestion } from '../lib/placement';
import { LEVEL_BAND } from '../lib/progress';
import { addXp, setLevel, useProfile } from '../lib/store';
import { confetti, sfx } from '../lib/fx';

const TARGETS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

function planFor(level: Cefr): { title: string; text: string; href: string }[] {
  const low = level === 'A1' || level === 'A2';
  return [
    { title: 'Har kuni so‘z o‘yini', text: low ? 'Eng kerakli A1–A2 so‘zlar bilan boshlaysiz.' : 'Darajangizga mos IELTS so‘zlari takrorlanadi.', href: '#/games' },
    { title: low ? 'Grammar asoslari' : 'Grammar: zaif joylar', text: low ? 'Zamonlar va artikllarni noldan mustahkamlaysiz.' : 'Xatolaringiz bo‘yicha mavzular tavsiya etiladi.', href: '#/grammar' },
    { title: low ? 'Oson Reading va Listening' : 'IELTS Reading va Listening', text: low ? 'Avval qisqa va oddiy matnlar, keyin imtihon formati.' : 'To‘liq imtihon formatidagi testlar.', href: '#/exam' },
    { title: 'Speaking', text: low ? 'Ustoz sodda savollar beradi va sekin gapiradi.' : 'IELTS Part 1–3, darajangizga mos savollar.', href: '#/exam/speaking' },
  ];
}

export default function Placement() {
  const p = useProfile();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [target, setTargetState] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [saved, setSaved] = useState(false);

  const q = useMemo(() => nextQuestion(answers), [answers]);
  const result = useMemo(() => evaluate(answers), [answers]);
  const done = started && q === null;
  const answeredN = Object.keys(answers).length;
  const lvlName = (l: Cefr) => `${l} · ${LEVEL_INFO[l].name}`;

  const finish = () => {
    const t = target ?? suggestedTarget(result.level);
    setLevel(result.level, t, date || null);
    if (!p.placementAt) addXp(30);
    setSaved(true);
    sfx('level'); confetti(100);
  };

  if (!started) {
    return (
      <div className="stage placement">
        <div className="stage-center">
          <Mascot mood="think" size={150} />
          <h1 className="say">Avval darajangizni aniqlaymiz</h1>
          <p className="lead" style={{ maxWidth: 560 }}>
            20 tagacha qisqa savol. A1 dan C1 gacha bosqichma-bosqich: bilmagan joyingizda test to‘xtaydi. Shunga qarab sizga alohida dastur tuziladi, A1 va B2 talabalar bir xil dars olmaydi.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <span className="pill">~3 daqiqa</span><span className="pill">Taxminiy natija</span><span className="pill">Istalgan payt qayta topshirish</span>
          </div>
          <button className="btn primary lg" onClick={() => setStarted(true)}>Testni boshlash <ArrowRight size={18} /></button>
          {p.level && <a className="evidence" href="#/">Hozirgi daraja: {p.level}. Bekor qilish</a>}
        </div>
      </div>
    );
  }

  if (!done && q) {
    const blockIdx = CEFR.indexOf(q.level);
    return (
      <div className="stage placement">
        <div className="stage-top">
          <span className="pill">{q.kind === 'Grammar' ? 'Grammatika' : 'Lug‘at'}</span>
          <span className="pill">Savol {answeredN + 1}</span>
        </div>
        <div className="level-steps" aria-label="Bosqichlar">
          {CEFR.map((l, i) => <i key={l} className={i < blockIdx ? 'done' : i === blockIdx ? 'now' : ''}><b>{l}</b></i>)}
        </div>
        <div className="stage-center">
          <Mascot mood="think" size={96} />
          <p className="say">{q.q}</p>
        </div>
        <div className="opts">
          {q.options.map((o, i) => (
            <button key={i} className="opt" onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}>
              <b style={{ opacity: .5, marginRight: 10 }}>{'ABCD'[i]}</b>{o}
            </button>
          ))}
        </div>
        <p className="evidence" style={{ textAlign: 'center', marginTop: 14 }}>Bilmasangiz, taxmin qilmang: o‘tkazib yuborish uchun eng yaqin javobni tanlang.</p>
      </div>
    );
  }

  const lvl = result.level;
  const info = LEVEL_INFO[lvl];
  const t = target ?? suggestedTarget(lvl);
  return (
    <div>
      <div className="stage placement result">
        <div className="stage-center">
          <Mascot mood={lvl === 'A1' || lvl === 'A2' ? 'happy' : 'laugh'} size={130} />
          <span className="eyebrow"><CheckCircle2 size={15} /> Natija tayyor</span>
          <h1 className="say">Sizning darajangiz: <span className="lvl-big">{lvl}</span></h1>
          <p className="lead">{lvlName(lvl)} · {info.band}</p>
          <p style={{ maxWidth: 560 }}>{info.desc}</p>
          <div className="level-steps big">
            {CEFR.map((l) => <i key={l} className={l === lvl ? 'now' : CEFR.indexOf(l) < CEFR.indexOf(lvl) ? 'done' : ''}><b>{l}</b></i>)}
          </div>
        </div>
      </div>

      {p.checkpoints.length > 0 && !saved && (
        <div className="card"><b>Oldingi natija: {p.checkpoints[p.checkpoints.length - 1].level}</b> → <b>yangi: {lvl}</b>{LEVEL_BAND[lvl] > LEVEL_BAND[p.checkpoints[p.checkpoints.length - 1].level] ? <span className="ok"> · +{(LEVEL_BAND[lvl] - LEVEL_BAND[p.checkpoints[p.checkpoints.length - 1].level]).toFixed(1)} band o‘sdingiz</span> : null}</div>
      )}

      <div className="card">
        <h3><Target size={18} style={{ verticalAlign: -3 }} /> Maqsadingiz: IELTS {t.toFixed(1)}</h3>
        <p className="evidence">Maqsadga qarab kunlik reja va tavsiyalar o‘zgaradi. Hozir tavsiya: {suggestedTarget(lvl).toFixed(1)}.</p>
        <div className="row" style={{ marginBottom: 12 }}>
          {TARGETS.map((x) => <button key={x} className={`chipbtn ${t === x ? 'on' : ''}`} onClick={() => setTargetState(x)}>{x.toFixed(1)}</button>)}
        </div>
        <label className="evidence" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <CalendarDays size={16} /> Imtihon sanasi (ixtiyoriy):
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" style={{ width: 'auto' }} />
        </label>
      </div>

      <div className="card">
        <h3>Sizga tuzilgan dastur</h3>
        <div className="plan-list">
          {planFor(lvl).map((s, i) => (
            <a key={s.title} className="plan-step" href={saved ? s.href : undefined} onClick={(e) => { if (!saved) e.preventDefault(); }}>
              <span className="n">{i + 1}</span><div><b>{s.title}</b><p>{s.text}</p></div>
            </a>
          ))}
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          {!saved ? <button className="btn primary lg" onClick={finish}><Rocket size={18} /> Dasturni saqlash</button> : <a className="btn primary lg" href="#/">Boshlash <ArrowRight size={18} /></a>}
          <button className="btn lg" onClick={() => { setAnswers({}); setSaved(false); }}>Qayta topshirish</button>
        </div>
      </div>
      <p className="evidence">Natija taxminiy va rasmiy IELTS ballini bildirmaydi.</p>
    </div>
  );
}
