import { Check, Puzzle, Target, Timer } from 'lucide-react';
import { PLANS } from '../config';
import { setPlan, useProfile } from '../lib/store';

export default function Pricing() {
  const p = useProfile();
  return (
    <div>
      <div className="card">
        <h2>Obuna turlari</h2>
        <p>Kerakli yo‘nalishni tanlang va faqat shuning uchun to‘lang. Istalgan obuna bilan so‘z o‘yinlari cheksiz.</p>
        <p className="notice">Demo rejim: to‘lov hali ulanmagan. Narxlar namunaviy va oldindan sotuv sinovidan keyin o‘zgaradi. “Yoqish” tugmasi bo‘limni faqat shu qurilmada ochadi.</p>
      </div>
      <div className="tracks">
        {PLANS.map((pl) => {
          const on = p.plan[pl.id];
          return (
            <div key={pl.id} className="card plan">
              <span className={`blob ${pl.id === 'exam' ? 'red' : pl.id === 'grammar' ? 'blue' : 'orange'}`}>{pl.id === 'exam' ? <Target /> : pl.id === 'grammar' ? <Puzzle /> : <Timer />}</span>
              <h3 style={{ margin: 0 }}>{pl.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>{pl.short}</p>
              <div><div className="price">{pl.priceUzs.toLocaleString('ru-RU')} so‘m <span className="evidence">/ oy</span></div><span className="badge">namunaviy narx</span></div>
              <ul>{pl.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}</ul>
              <button className={`btn ${on ? '' : 'primary'}`} onClick={() => setPlan(pl.id, !on)}>{on ? 'Demo obunani o‘chirish' : 'Demo: yoqish'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
