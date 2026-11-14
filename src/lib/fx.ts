// Ovozli effektlar (WebAudio, fayl kerak emas) va konfeti. Ovoz sozlamasi qurilmada saqlanadi.
const KEY = 'bandly.sound';

export const soundOn = (): boolean => { try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; } };
export const setSound = (on: boolean): void => { try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ruxsat yo'q */ } };

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12): void {
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + 0.02);
}

export type Sfx = 'ok' | 'bad' | 'level' | 'ach' | 'tick';
export function sfx(kind: Sfx): void {
  if (!soundOn() || (typeof document !== 'undefined' && document.hidden)) return;
  const c = audio(); if (!c) return;
  switch (kind) {
    case 'ok': tone(c, 660, 0, .12, 'triangle'); tone(c, 880, .09, .16, 'triangle'); break;
    case 'bad': tone(c, 220, 0, .18, 'sawtooth', .07); tone(c, 165, .12, .22, 'sawtooth', .07); break;
    case 'tick': tone(c, 1000, 0, .04, 'square', .04); break;
    case 'ach': [523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * .1, .22, 'triangle', .11)); break;
    case 'level': [392, 523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * .09, .3, 'triangle', .12)); tone(c, 1319, .5, .5, 'sine', .1); break;
  }
}

const COLORS = ['#ff4b3a', '#ffb02e', '#1f5cff', '#12b76a', '#a855f7', '#ff8fb1'];
/** Konfeti: DOM zarralar (kutubxonasiz), 2 soniyada o'chadi. Harakat kamaytirish yoqilgan bo'lsa ko'rsatilmaydi. */
export function confetti(count = 70): void {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    const size = 6 + Math.random() * 8;
    const x = 50 + (Math.random() - 0.5) * 30;
    const dx = (Math.random() - 0.5) * 90;
    const rot = Math.random() * 720 - 360;
    p.style.cssText = `position:absolute;left:${x}%;top:38%;width:${size}px;height:${size * 0.5}px;background:${COLORS[i % COLORS.length]};border-radius:2px;opacity:1;transition:transform ${1.4 + Math.random() * .8}s cubic-bezier(.15,.7,.3,1),opacity 2s ease-in;`;
    host.appendChild(p);
    requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transform = `translate(${dx}vw,${35 + Math.random() * 55}vh) rotate(${rot}deg)`; p.style.opacity = '0'; }));
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2600);
}
