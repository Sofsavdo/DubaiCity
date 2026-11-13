import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown(totalSeconds: number, running: boolean, onEnd?: () => void): [number, (s?: number) => void] {
  const [left, setLeft] = useState(totalSeconds);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setTimeout(() => endRef.current?.(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);
  const reset = useCallback((s?: number) => setLeft(s ?? totalSeconds), [totalSeconds]);
  return [left, reset];
}

export const fmt = (s: number): string =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const on = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}
