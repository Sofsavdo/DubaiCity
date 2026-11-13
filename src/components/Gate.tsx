import type { ReactNode } from 'react';
import { PLANS, TRACK_NAME } from '../config';
import type { TrackId } from '../lib/types';
import { setPlan, useProfile } from '../lib/store';
import { Mascot } from './Mascot';

export function LockCard({ track, reason }: { track: TrackId; reason?: string }) {
  const plan = PLANS.find((p) => p.id === track)!;
  return (
    <div className="card lock">
      <Mascot mood="think" size={96} />
      <h2>{TRACK_NAME[track]} obunasi kerak</h2>
      <p>{reason ?? plan.short}</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <a className="btn primary" href="#/pricing">Obuna turlari</a>
        <button className="btn" onClick={() => setPlan(track, true)}>Demo: sinab ko‘rish</button>
      </div>
      <p className="evidence">Demo rejim: to‘lov hali ulanmagan, bu tugma faqat shu qurilmada bo‘limni ochadi.</p>
    </div>
  );
}

export function Gate({ track, children }: { track: TrackId; children: ReactNode }) {
  const p = useProfile();
  return p.plan[track] ? <>{children}</> : <LockCard track={track} />;
}
