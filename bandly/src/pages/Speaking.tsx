import { useEffect, useRef, useState } from 'react';
import { part1Topics, part2Cards } from '../content/speaking';
import { fmt, useCountdown } from '../components/hooks';
import { addXp } from '../lib/store';

const pick = <T,>(a: T[], not?: T): T => {
  let x = a[Math.floor(Math.random() * a.length)];
  if (a.length > 1) while (x === not) x = a[Math.floor(Math.random() * a.length)];
  return x;
};

function Recorder() {
  const [rec, setRec] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const mr = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const start = async () => {
    setErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const m = new MediaRecorder(stream);
      chunks.current = [];
      m.ondataavailable = (e) => chunks.current.push(e.data);
      m.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setUrl(URL.createObjectURL(new Blob(chunks.current, { type: m.mimeType })));
        addXp(10);
      };
      m.start();
      mr.current = m;
      setUrl(null);
      setRec(true);
    } catch {
      setErr('Mikrofonga ruxsat berilmadi yoki qurilma mavjud emas.');
    }
  };
  const stop = () => { mr.current?.stop(); setRec(false); };
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  return (
    <div>
      <div className="row">
        {!rec ? <button className="btn primary" onClick={start}>Yozishni boshlash</button> : <button className="btn" onClick={stop}>To‘xtatish</button>}
        {rec && <span className="bad">● yozilmoqda</span>}
      </div>
      {err && <p className="notice">{err}</p>}
      {url && <audio controls src={url} style={{ marginTop: 10, width: '100%' }} />}
      <p className="evidence">Yozuv faqat qurilmangizda qoladi, hech qayerga yuborilmaydi. O‘zingizni tinglab, pauzalar va xatolarni sezing. AI baholash keyingi versiyada.</p>
    </div>
  );
}

function Part2() {
  const [card, setCard] = useState(() => pick(part2Cards));
  const [phase, setPhase] = useState<'idle' | 'prep' | 'speak'>('idle');
  const [left, reset] = useCountdown(60, phase !== 'idle', () => {
    if (phase === 'prep') { setPhase('speak'); reset(120); } else setPhase('idle');
  });
  const begin = () => { reset(60); setPhase('prep'); };
  const next = () => { setCard(pick(part2Cards, card)); setPhase('idle'); reset(60); };
  return (
    <div className="card">
      <h3>Part 2: yakka monolog</h3>
      <div className="notice"><b>{card.title}</b><ul>{card.points.map((x) => <li key={x}>You should say: {x}</li>)}</ul></div>
      <div className="row" style={{ margin: '12px 0' }}>
        <span className="pill">{phase === 'idle' ? 'Tayyor' : phase === 'prep' ? 'Tayyorgarlik (1 daqiqa)' : 'Gapiring (2 daqiqagacha)'}</span>
        <span className="timer">{fmt(left)}</span>
        <button className="btn primary" onClick={begin} disabled={phase !== 'idle'}>Boshlash</button>
        <button className="btn" onClick={next}>Boshqa savol</button>
      </div>
      <Recorder />
      <h4>Part 3: kengaytirilgan savollar</h4>
      <ul>{card.part3.map((q) => <li key={q}>{q}</li>)}</ul>
    </div>
  );
}

function Part1() {
  const [t, setT] = useState(() => pick(part1Topics));
  return (
    <div className="card">
      <h3>Part 1: tanishuv savollari</h3>
      <div className="notice"><b>{t.topic}</b><ol>{t.questions.map((q) => <li key={q}>{q}</li>)}</ol></div>
      <div className="row" style={{ margin: '12px 0' }}>
        <button className="btn" onClick={() => setT(pick(part1Topics, t))}>Boshqa mavzu</button>
      </div>
      <p className="evidence">Har bir savolga 2–3 gap bilan javob bering va sababini qo‘shing.</p>
      <Recorder />
    </div>
  );
}

export default function Speaking() {
  return (
    <div>
      <div className="card">
        <h2>Speaking mashqi</h2>
        <p>Savolni tanlang, javobingizni yozib oling va o‘zingiz tinglang. Real vaqt AI ustoz (ovozli suhbat va baholash) keyingi bosqichda qo‘shiladi.</p>
      </div>
      <Part1 />
      <Part2 />
    </div>
  );
}
