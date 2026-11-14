import { Check, Puzzle, Target, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PLANS } from '../config';
import { fmtDate, fmtSum, payConfig, startPurchase, type PayConfig } from '../lib/pay';
import { setPlan, useProfile } from '../lib/store';

export default function Pricing() {
  const p = useProfile();
  const [cfg, setCfg] = useState<PayConfig | null>(null);
  const [days, setDays] = useState(30);
  useEffect(() => { void payConfig().then(setCfg); }, []);
  const live = !!cfg?.enabled;
  const per = cfg?.periods.find((x) => x.days === days) ?? cfg?.periods[0];
  return (
    <div>
      <div className="card">
        <h2>Obuna turlari</h2>
        <p>Kerakli yo‘nalishni tanlang va faqat shuning uchun to‘lang. Istalgan obuna bilan so‘z o‘yinlari cheksiz.</p>
        {live ? (
          <>
            <div className="price-tabs" role="tablist">{cfg!.periods.map((x) => <button key={x.days} className={x.days === days ? 'on' : ''} onClick={() => setDays(x.days)}>{x.label}</button>)}</div>
            <p className="evidence">To‘lov bank kartasiga o‘tkazma orqali: summa va karta raqami ko‘rsatiladi, o‘tkazma qilingach obuna avtomatik yoqiladi. Obuna avtomatik yangilanmaydi.</p>
          </>
        ) : (
          <p className="notice">Demo rejim: to‘lov hali ulanmagan. Narxlar namunaviy. “Yoqish” tugmasi bo‘limni faqat shu qurilmada ochadi.</p>
        )}
      </div>
      <div className="tracks">
        {PLANS.map((pl) => {
          const on = p.plan[pl.id];
          const until = p.planUntil[pl.id];
          const price = per?.prices[pl.id];
          return (
            <div key={pl.id} className="card plan">
              <span className={`blob ${pl.id === 'exam' ? 'red' : pl.id === 'grammar' ? 'blue' : 'orange'}`}>{pl.id === 'exam' ? <Target /> : pl.id === 'grammar' ? <Puzzle /> : <Timer />}</span>
              <h3 style={{ margin: 0 }}>{pl.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>{pl.short}</p>
              <div>
                {live && price ? <div className="price">{fmtSum(price)} so‘m <span className="evidence">/ {per!.label}</span></div> : <><div className="price">{pl.priceUzs.toLocaleString('ru-RU')} so‘m <span className="evidence">/ oy</span></div><span className="badge">namunaviy narx</span></>}
                {live && on && until && <span className="badge on">Faol: {fmtDate(until)} gacha</span>}
              </div>
              <ul>{pl.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}</ul>
              {live ? <button className="btn primary" onClick={() => startPurchase(pl.id, days)}>{on ? 'Uzaytirish' : 'Sotib olish'}</button>
                : <button className={`btn ${on ? '' : 'primary'}`} onClick={() => setPlan(pl.id, !on)}>{on ? 'Demo obunani o‘chirish' : 'Demo: yoqish'}</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
