import { PLANS } from '../src/config';
import type { TrackId } from '../src/lib/types';

// Narxlar serverda belgilanadi (mijozdan kelgan summaga ishonilmaydi). Namunaviy narxlar src/config.ts da;
// haqiqiy narxni Railway'da PRICE_EXAM, PRICE_GRAMMAR, PRICE_MOCKS (so'm/oy) bilan almashtiring.
export interface Period { days: number; label: string; mult: number }
export const PERIODS: Period[] = [{ days: 30, label: '1 oy', mult: 1 }, { days: 90, label: '3 oy', mult: 2.5 }];
export const TRACKS: TrackId[] = ['exam', 'grammar', 'mocks'];

export function monthlyPrice(track: TrackId, env: NodeJS.ProcessEnv = process.env): number {
  const o = Number(env[`PRICE_${track.toUpperCase()}`]);
  if (Number.isFinite(o) && o >= 1000) return Math.round(o);
  return PLANS.find((p) => p.id === track)!.priceUzs;
}

export function priceFor(track: TrackId, days: number, env: NodeJS.ProcessEnv = process.env): number {
  const per = PERIODS.find((p) => p.days === days);
  if (!per) throw new Error('period');
  return Math.round((monthlyPrice(track, env) * per.mult) / 1000) * 1000;
}
