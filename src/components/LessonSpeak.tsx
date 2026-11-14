import { Mic, Square, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { accuracy, verdict } from '../lib/shadow';
import { listenTurn, say, SpeechError, stopSpeaking, sttSupported, ttsSupported } from '../lib/speech';

/** Speaking step: listen to each example sentence, say it, see which words were recognised.
 *  Browser speech recognition is used; it is NOT a pronunciation score and is not saved to mastery (device-dependent, unverified). */
export function LessonSpeak({ sentences }: { sentences: string[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [interim, setInterim] = useState('');
  const [said, setSaid] = useState<Record<number, string>>({});
  const [err, setErr] = useState('');
  const endRef = useRef<(() => void) | null>(null);
  const sig = useRef({ cancelled: false });
  const stt = typeof window !== 'undefined' && sttSupported();
  const tts = typeof window !== 'undefined' && ttsSupported();

  const listen = async (i: number) => {
    if (active !== null) return;
    stopSpeaking(); setErr(''); setInterim(''); setActive(i);
    sig.current = { cancelled: false };
    try {
      const r = await listenTurn({ silenceMs: 1400, maxMs: 15000, noSpeechMs: 7000, lang: 'en-US', onInterim: setInterim, signal: sig.current, endRef });
      setSaid((s) => ({ ...s, [i]: r.text }));
    } catch (e) {
      const code = e instanceof SpeechError ? e.code : 'unstable';
      setErr(code === 'denied' ? 'Mikrofonga ruxsat berilmagan. Brauzer sozlamalarida ruxsat bering.' : code === 'nomic' ? 'Mikrofon topilmadi.' : code === 'network' ? 'Nutqni tanish xizmati bilan aloqa yo‘q.' : 'Nutqni tanib bo‘lmadi, qayta urinib ko‘ring.');
    } finally { setActive(null); setInterim(''); }
  };

  if (!stt) {
    return <p className="muted">Bu brauzer nutqni tanishni qo‘llamaydi (Chrome yoki Edge tavsiya etiladi). Gaplarni ovoz chiqarib o‘qing va eshitish tugmasi bilan solishtiring.</p>;
  }
  return (
    <div>
      <p className="muted">Har bir gapni eshiting, keyin mikrofonni bosib ayting. Brauzer tanigan so‘zlar ko‘rsatiladi — bu talaffuz bahosi emas, faqat mashq uchun; natija saqlanmaydi.</p>
      {sentences.map((s, i) => {
        const res = said[i] !== undefined ? accuracy(s, said[i]!) : null;
        const v = res ? verdict(res.pct) : null;
        return (
          <div key={s} className="q">
            <p className="row">
              {tts && <button type="button" className="btn sm" aria-label={`Eshitish: ${s}`} onClick={() => { stopSpeaking(); void say(s, { cancelled: false }); }}><Volume2 size={14} /></button>}
              <b>{s}</b>
            </p>
            {active === i
              ? <button type="button" className="btn sm primary" onClick={() => endRef.current?.()}><Square size={14} /> Tugatdim</button>
              : <button type="button" className="btn sm" disabled={active !== null} onClick={() => void listen(i)}><Mic size={14} /> Aytish</button>}
            {active === i && <p className="muted">Tinglayapman… {interim}</p>}
            {res && v && (
              <p style={{ marginTop: 6 }}>
                <span className={v.tone === 'no' ? 'bad' : 'ok'}>{v.label} · {res.pct}%</span>
                <span className="muted"> — tanildi: “{said[i] || '…'}”{res.missing.length ? ` · tushib qolgan/boshqacha: ${res.missing.join(', ')}` : ''}</span>
              </p>
            )}
          </div>
        );
      })}
      {err && <p className="bad">{err}</p>}
    </div>
  );
}
