import { ArrowRight, CalendarDays, PenLine, Compass, Map as MapIcon, BookOpen, Brain, Flame, Gamepad2, Headphones, Languages, Mic, Plus, Puzzle, ShieldCheck, Star, Swords, Target, Timer, Zap } from 'lucide-react';
import { BRAND } from '../brand';
import { Mascot } from '../components/Mascot';
import { ProgressCard } from '../components/ProgressCard';
import { Tile } from '../components/Tile';
import { grammar } from '../content/grammar';
import { listeningTests } from '../content/listeningTests';
import { readingTests } from '../content/readingTests';
import { vocab } from '../content/vocab';
import { levelProgress } from '../lib/game';
import { isDue } from '../lib/srs';
import { useProfile } from '../lib/store';
import { CEFR, LEVEL_INFO, levelIndex } from '../lib/levels';
import { loadResults } from '../lib/storage';

const faq: [string, string][] = [
  ['Obuna qanday ishlaydi?', 'Uchta yo‘nalish (Imtihon tayyorgarligi, Grammar, Mock testlar) alohida obuna bo‘ladi: faqat kerakli bittasi uchun to‘laysiz. Istalgan obuna so‘z o‘yinlarini cheksiz qiladi. Hozircha to‘lov ulanmagan, obuna demo rejimda.'],
  ['Speaking\'da ovozim yozib olinadimi?', 'Yo‘q. Ovoz yozib olinmaydi va saqlanmaydi. Nutqni matnga o‘girishni brauzeringiz bajaradi (Chrome, Edge, Safari). AI yoqilsa, faqat suhbatning matni yuboriladi, ovoz emas.'],
  ['Ustoz haqiqiy AI’mi?', 'Hozircha ustoz IELTS tartibini va savollarni qoidalar bilan boshqaradi, o‘zbek tilida so‘zlashuvchilarga xos odatiy xatolarni topadi. AI ulanganda javobingizga qarab erkin savol beradi va 4 mezon bo‘yicha baholaydi.'],
  ['“Qattiq” rejim nima?', 'Ixtiyoriy, 18+ tasdiqlash bilan ochiladi: ustoz xatolaringiz ustidan kuladi va yengil so‘kadi. Oila, din, millat, tashqi ko‘rinish haqida hech qachon gapirmaydi. Istalgan payt o‘chirish mumkin.'],
  ['Baholar rasmiy natijami?', 'Yo‘q. Barcha ballar taxminiy va tayyorgarlikni kuzatish uchun. Rasmiy natijani faqat IELTS imtihoni beradi.'],
  ['Telefonda ishlaydimi?', 'Ha, brauzerda. Speaking uchun mikrofon ruxsati kerak (HTTPS orqali ishlaydi). Naushnik ishlatsangiz, ustoz ovozi mikrofonga kirmaydi.'],
];

export default function Home() {
  const p = useProfile();
  const lp = levelProgress(p.xp);
  const goal = Math.min(1, p.dailyXp / Math.max(1, p.dailyGoal));
  const due = vocab.filter((w) => p.srs[w.id] && isDue(p.srs[w.id], Date.now())).length;
  const started = p.xp > 0;
  const tests = readingTests.length + listeningTests.length;
  const lvl = p.level;
  const todayKey = new Date().toISOString().slice(0, 10);
  const solved = new Set(loadResults().map((r) => r.title));
  const byDist = <T extends { level: typeof CEFR[number] }>(a: T[]) => [...a].sort((x, y) => Math.abs(levelIndex(x.level) - levelIndex(lvl)) - Math.abs(levelIndex(y.level) - levelIndex(lvl)));
  const nextRead = byDist(readingTests).find((t) => !solved.has(t.title)) ?? byDist(readingTests)[0];
  const nextListen = byDist(listeningTests).find((t) => !solved.has(t.title)) ?? byDist(listeningTests)[0];
  const daysLeft = p.examDate ? Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000) : null;
  const low = lvl === 'A1' || lvl === 'A2';
  const path = lvl ? [
    { task: 'words', icon: Zap, title: 'So‘z o‘yini', text: due > 0 ? `${due} ta so‘z takrorlashga tayyor` : low ? 'A1–A2 so‘zlari bilan boshlang' : 'Yangi IELTS so‘zlari', href: '#/games/rush' },
    { task: 'grammar', icon: Puzzle, title: 'Grammar', text: low ? 'Asoslar: to be, Present Simple, Past Simple' : '“Sizga mos” savollar', href: '#/grammar' },
    { task: 'practice', icon: PenLine, title: 'Gap tuzish', text: low ? 'Tarjima va so‘z tartibi mashqlari' : 'Xatoni toping, gapni kuchaytiring', href: '#/practice' },
    { task: 'reading', icon: BookOpen, title: 'Reading', text: nextRead.title.replace(/^Reading mini-test \d+: /, ''), href: `#/exam/reading/${nextRead.id}` },
    { task: 'listening', icon: Headphones, title: 'Listening', text: nextListen.title.replace(/^Listening mini-test \d+: /, ''), href: `#/exam/listening/${nextListen.id}` },
    { task: 'speaking', icon: Mic, title: 'Speaking', text: low ? 'Sodda savollar, o‘zbekcha yordam bilan' : 'IELTS Part 1–3', href: '#/exam/speaking' },
  ] : [];

  return (
    <div>
      <section className="landing-hero">
        <div className="hero-main">
          <span className="eyebrow"><Zap size={15} /> IELTS · Grammar · Mock testlar</span>
          <h1>IELTS ga o‘zbek tilida, o‘yin kabi tayyorlaning</h1>
          <p className="lead">{BRAND.name}: jonli ovozli Speaking, mock testlar va takrorlash o‘yinlari bir joyda. Yodlash emas, o‘ynab o‘rganing.</p>
          <div className="row" style={{ marginTop: 22 }}>
            <a className="btn primary lg" href="#/exam">Boshlash <ArrowRight size={18} /></a>
            <a className="btn lg" href="#/games/rush"><Gamepad2 size={18} /> Bepul o‘yin</a>
          </div>
          <div className="hero-stats">
            <div><b>{vocab.length}</b><span>so‘z (A1–C1)</span></div>
            <div><b>{tests}</b><span>Reading/Listening test</span></div>
            <div><b>{grammar.length}</b><span>Grammar savol</span></div>
            <div><b>3</b><span>So‘z o‘yini</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Mascot mood={started && goal >= 1 ? 'laugh' : 'happy'} size={190} />
          <span className="chip c1"><Flame size={16} color="#ff7a1a" fill="#ff7a1a" /> {p.streak || 0} kunlik seriya</span>
          <span className="chip c2"><Star size={16} color="#f5b400" fill="#f5b400" /> {lp.level}-daraja</span>
          <span className="chip c3"><Mic size={16} color="#ea3624" /> Jonli Speaking</span>
        </div>
      </section>

      {!lvl && (
        <div className="banner">
          <div><h3><Compass size={20} style={{ verticalAlign: -4 }} /> Avval darajangizni aniqlang</h3><p>3 daqiqalik test: A1 dan C1 gacha. Shunga qarab sizga alohida dastur tuziladi.</p></div>
          <a className="btn lg" href="#/placement">Testni boshlash <ArrowRight size={18} /></a>
        </div>
      )}

      {lvl && (
        <section className="card myplan">
          <div className="myplan-head">
            <div>
              <span className="eyebrow"><MapIcon size={15} /> Sizning dasturingiz</span>
              <h2 style={{ margin: '4px 0' }}>Daraja {lvl} · {LEVEL_INFO[lvl].name}</h2>
              <p className="evidence">Maqsad: IELTS {p.target.toFixed(1)}{daysLeft !== null && daysLeft >= 0 ? <> · <CalendarDays size={14} style={{ verticalAlign: -2 }} /> imtihongacha {daysLeft} kun</> : null}</p>
            </div>
            <div className="level-steps">{CEFR.map((l) => <i key={l} className={l === lvl ? 'now' : levelIndex(l) < levelIndex(lvl) ? 'done' : ''}><b>{l}</b></i>)}</div>
          </div>
          <div className="path">
            {path.map((s, i) => (
              <a key={s.title} className={`path-step ${p.today.day === todayKey && p.today.done.includes(s.task) ? 'done' : ''}`} href={s.href}>
                <span className="pn">{i + 1}</span><s.icon size={22} /><b>{s.title}</b><span>{s.text}</span>
              </a>
            ))}
          </div>
          <div className="row"><a className="btn sm" href="#/placement">Darajani qayta aniqlash</a></div>
        </section>
      )}

      <ProgressCard />

      {started && (
        <div className="dash">
          <div className="kpi"><b>{Math.min(p.dailyXp, p.dailyGoal)}/{p.dailyGoal}</b><span>Bugungi maqsad (XP)</span><div className="bar" style={{ marginTop: 10 }}><i style={{ width: `${goal * 100}%` }} /></div></div>
          <div className="kpi"><b>{p.streak}</b><span>Ketma-ket kunlar</span></div>
          <div className="kpi"><b>{due}</b><span>So‘z takrorlashga tayyor</span><div style={{ marginTop: 10 }}><a className="btn sm primary" href="#/games/rush">Takrorlash</a></div></div>
          <div className="kpi"><b>{lp.level}</b><span>Daraja · {lp.into}/{lp.span} XP</span><div className="bar" style={{ marginTop: 10 }}><i style={{ width: `${lp.pct * 100}%` }} /></div></div>
        </div>
      )}

      <div className="section-title"><h2>Yo‘nalishlar</h2><a href="#/pricing" className="btn sm">Obuna turlari</a></div>
      <div className="tracks">
        <Tile big href="#/exam" tone="red" icon={Target} title="Imtihon tayyorgarligi" text="IELTS: Reading, Listening, Writing va jonli Speaking. SAT va CEFR tez orada." badge={p.plan.exam ? <span className="badge on">{p.planUntil.exam ? 'Obuna faol' : 'Obuna faol (demo)'}</span> : <span className="badge">Obuna kerak</span>} />
        <Tile big href="#/grammar" tone="blue" icon={Puzzle} title="Grammar" text="Mavzular bo‘yicha mashqlar, o‘zbekcha tushuntirish, xatolar ustida ishlash." badge={p.plan.grammar ? <span className="badge on">{p.planUntil.grammar ? 'Obuna faol' : 'Obuna faol (demo)'}</span> : <span className="badge">Bepul: Artikllar</span>} />
        <Tile big href="#/mocks" tone="orange" icon={Timer} title="Mock testlar" text="Imtihon taymeri, avtomatik baho va har savol bo‘yicha tahlil." badge={p.plan.mocks ? <span className="badge on">{p.planUntil.mocks ? 'Obuna faol' : 'Obuna faol (demo)'}</span> : <span className="badge">Obuna kerak</span>} />
      </div>

      <div className="section-title"><h2>Nega {BRAND.name}</h2></div>
      <div className="features">
        <div className="feature"><span className="blob red"><Mic /></span><h3>Jonli Speaking</h3><p>Ustoz gapiradi, siz ovoz bilan javob berasiz. IELTS tartibida: Part 1, 2, 3. Ovoz yozilmaydi.</p></div>
        <div className="feature"><span className="blob purple"><Brain /></span><h3>Yodlash o‘rniga takrorlash</h3><p>Bilmagan so‘zlaringiz tez, bilganlaringiz kamroq qaytadi. Har o‘yin shu tizimga ulangan.</p></div>
        <div className="feature"><span className="blob blue"><Swords /></span><h3>Do‘stlar bilan duel</h3><p>Havolani yuboring, bir xil so‘zlarda raqobatlashing. Haftalik reyting bor.</p></div>
        <div className="feature"><span className="blob green"><Languages /></span><h3>O‘zbekcha tushuntirish</h3><p>Grammar izohlari va so‘z ma’nolari o‘zbek tilida, odatiy xatolar uchun maxsus tuzatishlar.</p></div>
        <div className="feature"><span className="blob orange"><Headphones /></span><h3>Listening audio</h3><p>Tabiiy ovozli audio, imtihon qoidasi bo‘yicha bir marta eshittiriladi, transkript bilan tahlil.</p></div>
        <div className="feature"><span className="blob ink"><ShieldCheck /></span><h3>Maxfiylik</h3><p>Ovoz saqlanmaydi, natijalar sizning qurilmangizda. Qattiq rejim faqat 18+ va faqat xohlasangiz.</p></div>
      </div>

      <div className="section-title"><h2>Qanday ishlaydi</h2></div>
      <div className="steps">
        <div className="step"><h3>Yo‘nalish tanlang</h3><p>Imtihon, Grammar yoki Mock testlar. Faqat kerakli bittasi uchun obuna bo‘ling.</p></div>
        <div className="step"><h3>Har kuni mashq qiling</h3><p>Kunlik maqsad, ketma-ket kunlar seriyasi va so‘z o‘yinlari sizni qaytarib keladi.</p></div>
        <div className="step"><h3>Natijani kuzating</h3><p>Mock testlar, hisobot va tavsiyalar bilan zaif joylaringizni toping.</p></div>
      </div>

      <div className="section-title"><h2>Bepul o‘yinlar</h2><a className="btn sm" href="#/games">Hammasi</a></div>
      <div className="grid">
        <a className="gcard" href="#/games/rush"><span className="gico"><Zap size={26} color="#ffb02e" /></span><h3>So‘z poygasi</h3><p>60 soniya, 3 jon, kombo ball.</p><span className="play">O‘ynash <ArrowRight size={16} /></span></a>
        <a className="gcard g2" href="#/games/pairs"><span className="gico"><Puzzle size={26} color="#5cd6ff" /></span><h3>Juftlik</h3><p>So‘z va ma’noni juftlang.</p><span className="play">O‘ynash <ArrowRight size={16} /></span></a>
        <a className="gcard g3" href="#/games/spell"><span className="gico"><BookOpen size={26} color="#ff8fb1" /></span><h3>Imlo sinovi</h3><p>Misol gapdan so‘zni yozing.</p><span className="play">O‘ynash <ArrowRight size={16} /></span></a>
      </div>

      <div className="section-title"><h2>Savollar</h2></div>
      <div className="faq">
        {faq.map(([q, a]) => <details key={q}><summary>{q}<Plus size={20} /></summary><p>{a}</p></details>)}
      </div>

      <div className="cta-band">
        <h2>Bugun boshlang</h2>
        <p>Ro‘yxatdan o‘tish shart emas. Bepul o‘yin bilan boshlang, keyin yo‘nalishni tanlang.</p>
        <a className="btn primary lg" href="#/games/rush">So‘z poygasini boshlash <ArrowRight size={18} /></a>
      </div>
    </div>
  );
}
