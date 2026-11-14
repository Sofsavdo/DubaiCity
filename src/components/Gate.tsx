import { useEffect, useState, type ReactNode } from 'react';
import { fmtSum, payConfig, startPurchase, type PayConfig } from '../lib/pay';
import { PLANS, TRACK_NAME } from '../config';
import type { TrackId } from '../lib/types';
import { setPlan, useProfile } from '../lib/store';
import { Mascot } from './Mascot';

export function LockCard({ track, reason }: { track: TrackId; reason?: string }) {
  const plan = PLANS.find((p) => p.id === track)!;
  const [cfg, setCfg] = useState<PayConfig | null>(null);
  useEffect(() => { void payConfig().then(setCfg); }, []);
  const live = !!cfg?.enabled;
  const price = cfg?.periods[0]?.prices[track];
  return (
    <div className="card lock">
      <Mascot mood="think" size={96} />
      <h2>{TRACK_NAME[track]} obunasi kerak</h2>
      <p>{reason ?? plan.short}</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <a className="btn primary" href="#/pricing">Obuna turlari</a>
        {live ? <button className="btn primary" onClick={() => startPurchase(track, 30)}>Sotib olish{price ? ` · ${fmtSum(price)} so‘m / oy` : ''}</button> : <button className="btn" onClick={() => setPlan(track, true)}>Demo: sinab ko‘rish</button>}
      </div>
      {!live && <p className="evidence">Demo rejim: to‘lov hali ulanmagan, bu tugma faqat shu qurilmada bo‘limni ochadi.</p>}
    </div>
  );
}

export function Gate({ track, children }: { track: TrackId; children: ReactNode }) {
  const p = useProfile();
  return p.plan[track] ? <>{children}</> : <LockCard track={track} />;
}
