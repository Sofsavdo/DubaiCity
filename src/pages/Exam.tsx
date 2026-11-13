import { useState } from 'react';
import { useProfile } from '../lib/store';

const skills = [
  { href: '#/exam/reading', icon: '📖', title: 'Reading', text: 'Matn va savollar, taymer, dalil izohlari' },
  { href: '#/exam/listening', icon: '🎧', title: 'Listening', text: 'Audio suhbat, forma va test savollari' },
  { href: '#/exam/writing', icon: '✍️', title: 'Writing', text: 'Task 1 va Task 2, taymer, tekshiruv' },
  { href: '#/exam/speaking', icon: '🎤', title: 'Speaking', text: 'Part 1–3, ovoz yozish' },
];

export default function Exam() {
  const p = useProfile();
  const [tab, setTab] = useState<'ielts' | 'sat' | 'cefr'>('ielts');
  return (
    <div>
      <div className="card">
        <h2>Imtihon tayyorgarligi {p.plan.exam ? <span className="badge on">Obuna faol (demo)</span> : <span className="badge">Obuna kerak</span>}</h2>
        <div className="tabs">
          <button className={`btn ${tab === 'ielts' ? 'primary' : ''}`} onClick={() => setTab('ielts')}>IELTS</button>
          <button className={`btn ${tab === 'sat' ? 'primary' : ''}`} onClick={() => setTab('sat')}>SAT <span className="badge soon">tez orada</span></button>
          <button className={`btn ${tab === 'cefr' ? 'primary' : ''}`} onClick={() => setTab('cefr')}>CEFR <span className="badge soon">tez orada</span></button>
        </div>
        {tab !== 'ielts' && <p>{tab.toUpperCase()} bo‘limi ishlab chiqilmoqda. Imtihon tayyorgarligi obunasi bilan qo‘shilganda qo‘shimcha to‘lovsiz ochiladi.</p>}
      </div>
      {tab === 'ielts' && (
        <>
          <div className="grid">
            {skills.map((s) => (
              <a key={s.href} className="card tile" href={s.href}>
                <div style={{ fontSize: 30 }}>{s.icon}</div>
                <h3>{!p.plan.exam && '🔒 '}{s.title}</h3>
                <p>{s.text}</p>
              </a>
            ))}
          </div>
          <a className="card tile" href="#/games"><h3>⚡ So‘z o‘yinlari</h3><p>IELTS lug‘ati: o‘ynab takrorlash</p></a>
        </>
      )}
    </div>
  );
}
