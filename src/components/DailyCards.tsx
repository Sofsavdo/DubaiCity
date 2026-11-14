import { Download, Share2, Volume2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { vocab, vocabForLevel } from '../content/vocab';
import { tipOfDay } from '../content/tips';
import { say } from '../lib/speech';
import { renderCard, shareCard } from '../lib/shareCard';
import { recordReview, useProfile } from '../lib/store';
import { levelIndex } from '../lib/levels';

const dayIdx = (): number => Math.floor(new Date().setHours(0, 0, 0, 0) / 86_400_000);

/** Bugungi so'z (darajaga mos, har kuni yangi) */
export function wordOfDay(level: Parameters<typeof vocabForLevel>[0], di = dayIdx()) {
  const pool = vocabForLevel(level).filter((w) => levelIndex(w.level) >= Math.max(0, levelIndex(level) - 1)).sort((a, b) => a.id.localeCompare(b.id));
  const list = pool.length ? pool : vocab;
  return list[(di * 7) % list.length];
}

/** Kun so'zi va kun maslahati kartalari: eshitish, takrorlashga qo'shish, rasm sifatida ulashish. */
export function DailyCards() {
  const p = useProfile();
  const w = useMemo(() => wordOfDay(p.level), [p.level]);
  const tip = tipOfDay();
  const [msg, setMsg] = useState('');
  const listen = () => { void say(w.word, { cancelled: false }, 'en-GB'); };
  const share = async (kind: 'tip' | 'word') => {
    const blob = kind === 'tip'
      ? await renderCard({ title: 'Kun maslahati', body: tip.en, sub: tip.uz, foot: '— Bandi, IELTS ustozi' })
      : await renderCard({ title: `Kun so‘zi · ${w.pos}`, body: w.word, sub: `${w.uz}. ${w.example}`, foot: '— Bandi, IELTS ustozi' });
    if (!blob) return;
    const r = await shareCard(blob, kind === 'tip' ? 'bandly-maslahat' : 'bandly-soz', kind === 'tip' ? `${tip.en} — ${location.origin}` : `${w.word}: ${w.def} — ${location.origin}`);
    setMsg(r === 'shared' ? 'Ulashildi' : 'Rasm yuklab olindi');
  };
  return (
    <div className="daily">
      <div className="daily-card word">
        <small>Kun so‘zi · {w.pos} · {w.level}</small>
        <h3>{w.word}</h3>
        <p className="uz">{w.uz}</p>
        <p className="def">{w.def}</p>
        <p className="ex">“{w.example}”</p>
        <div className="row">
          <button className="btn sm" onClick={listen}><Volume2 size={15} /> Eshitish</button>
          <button className="btn sm" onClick={() => { recordReview(w.id, false); setMsg('Takrorlashga qo‘shildi'); }}>Yodlayman</button>
          <button className="btn sm" onClick={() => { recordReview(w.id, true); setMsg('Bildim: kamroq takrorlanadi'); }}>Bilaman</button>
          <button className="icon-btn" aria-label="Rasm sifatida ulashish" onClick={() => void share('word')}><Share2 size={16} /></button>
        </div>
      </div>
      <div className="daily-card tip">
        <small>Kun maslahati</small>
        <p className="tipen">{tip.en}</p>
        <p className="uz">{tip.uz}</p>
        <div className="row"><button className="btn sm primary" onClick={() => void share('tip')}><Share2 size={15} /> Ulashish</button><button className="btn sm" onClick={() => void share('tip')}><Download size={15} /> Rasm</button></div>
      </div>
      {msg && <p className="evidence" style={{ gridColumn: '1 / -1' }}>{msg}</p>}
    </div>
  );
}
