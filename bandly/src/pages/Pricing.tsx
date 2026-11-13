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
              <div style={{ fontSize: 30 }}>{pl.icon}</div>
              <h3 style={{ margin: 0 }}>{pl.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>{pl.short}</p>
              <div className="price">{pl.priceUzs.toLocaleString('ru-RU')} so‘m<span className="evidence"> / oy (namunaviy)</span></div>
              <ul>{pl.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <button className={`btn ${on ? '' : 'primary'}`} onClick={() => setPlan(pl.id, !on)}>{on ? 'Demo obunani o‘chirish' : 'Demo: yoqish'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
