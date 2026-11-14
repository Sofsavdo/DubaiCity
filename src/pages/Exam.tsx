import { BookOpen, Headphones, Mic, PenLine } from 'lucide-react';
import { useState } from 'react';
import { Tile } from '../components/Tile';
import { useProfile } from '../lib/store';

const skills = [
  { href: '#/exam/reading', icon: BookOpen, tone: 'blue', title: 'Reading', text: 'Matn va savollar, taymer, dalil izohlari' },
  { href: '#/exam/listening', icon: Headphones, tone: 'red', title: 'Listening', text: 'Tabiiy ovozli audio, forma va test savollari' },
  { href: '#/exam/writing', icon: PenLine, tone: 'orange', title: 'Writing', text: 'Task 1 va Task 2, taymer, tekshiruv va AI baho' },
  { href: '#/exam/speaking', icon: Mic, tone: 'purple', title: 'Speaking', text: 'Jonli ovozli suhbat: Part 1, 2, 3' },
] as const;

export default function Exam() {
  const p = useProfile();
  const [tab, setTab] = useState<'ielts' | 'sat' | 'cefr'>('ielts');
  return (
    <div>
      <div className="card">
        <h2>Imtihon tayyorgarligi {p.plan.exam ? <span className="badge on">Obuna faol (demo)</span> : <span className="badge">Obuna kerak</span>}</h2>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <button className={`btn ${tab === 'ielts' ? 'dark' : ''}`} onClick={() => setTab('ielts')}>IELTS</button>
          <button className={`btn ${tab === 'sat' ? 'dark' : ''}`} onClick={() => setTab('sat')}>SAT <span className="badge soon">tez orada</span></button>
          <button className={`btn ${tab === 'cefr' ? 'dark' : ''}`} onClick={() => setTab('cefr')}>CEFR <span className="badge soon">tez orada</span></button>
        </div>
        {tab !== 'ielts' && <p style={{ marginTop: 14 }}>{tab.toUpperCase()} bo‘limi ishlab chiqilmoqda. Imtihon tayyorgarligi obunasi bilan qo‘shilganda qo‘shimcha to‘lovsiz ochiladi.</p>}
      </div>
      {tab === 'ielts' && (
        <div className="grid">
          {skills.map((s) => <Tile key={s.href} href={s.href} icon={s.icon} tone={s.tone} title={s.title} text={s.text} badge={!p.plan.exam && <span className="badge">Obuna kerak</span>} />)}
        </div>
      )}
    </div>
  );
}
