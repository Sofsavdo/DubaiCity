import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MockTest } from '../components/MockTest';
import type { ListeningTest } from '../content/types';
import { listeningTrack } from '../lib/clips';
import { LISTENING_TABLE } from '../lib/band';
import { bestVoice } from '../lib/speech';

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function Transcript({ test }: { test: ListeningTest }) {
  return (
    <>
      {test.script.map((l, i) => <p key={i}><b>{l.speaker === 'A' ? test.names.A : test.names.B}:</b> {l.text}</p>)}
    </>
  );
}

/** Tayyor neyron ovozli audio (public/audio/listening). Imtihon rejimida faqat bir marta. */
function FilePlayer({ file, seconds, practice }: { file: string; seconds: number; practice: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [plays, setPlays] = useState(0);
  const locked = !practice && plays >= 1 && !playing;

  useEffect(() => () => { ref.current?.pause(); }, []);
  const toggle = () => {
    if (!ref.current) {
      const a = new Audio(file);
      a.ontimeupdate = () => setPos(a.currentTime);
      a.onended = () => { setPlaying(false); setPos(0); ref.current = null; };
      a.onerror = () => { setPlaying(false); ref.current = null; };
      ref.current = a;
      setPlays((n) => n + 1);
    }
    const a = ref.current;
    if (a.paused) { void a.play(); setPlaying(true); } else if (practice) { a.pause(); setPlaying(false); }
  };
  const restart = () => { ref.current?.pause(); ref.current = null; setPos(0); setPlaying(false); toggle(); };
  const total = seconds || 1;
  return (
    <div>
      <div className="row">
        <button className="btn primary" onClick={toggle} disabled={locked || (playing && !practice)}>
          {playing ? <><Pause size={18} /> {practice ? 'Pauza' : 'Eshittirilmoqda…'}</> : <><Play size={18} /> {plays === 0 ? 'Audioni boshlash' : 'Davom ettirish'}</>}
        </button>
        {practice && plays > 0 && <button className="btn" onClick={restart}><RotateCcw size={16} /> Boshidan</button>}
        <span className="pill">{mmss(pos)} / {mmss(total)}</span>
      </div>
      <div className="audio-bar" style={{ marginTop: 12 }}><i style={{ width: `${Math.min(100, (pos / total) * 100)}%`, transition: 'width .25s linear' }} /></div>
    </div>
  );
}

/** Zaxira: audio fayl bo'lmasa brauzer ovozi (sifati qurilmaga bog'liq). */
function BrowserPlayer({ test, practice }: { test: ListeningTest; practice: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const supported = 'speechSynthesis' in window;
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const locked = !practice && plays >= 1 && !playing;
  const play = () => {
    const synth = window.speechSynthesis;
    synth.cancel(); setPlaying(true); setPlays((n) => n + 1);
    const vA = bestVoice('en'); const vB = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en') && v !== vA)[0] ?? vA;
    test.script.forEach((line, i, arr) => {
      const u = new SpeechSynthesisUtterance(line.text);
      const v = line.speaker === 'A' ? vA : vB;
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
      u.rate = 0.92; u.pitch = line.speaker === 'A' ? 1.1 : 0.85;
      if (i === arr.length - 1) u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      synth.speak(u);
    });
  };
  return (
    <div>
      <p className="notice">Tayyor audio topilmadi: brauzer ovozi ishlatiladi, sifati qurilmaga bog‘liq.</p>
      {!supported && <p className="notice">Brauzeringiz ovoz sintezini qo‘llamaydi. Transkriptdan foydalaning.</p>}
      <button className="btn primary" onClick={play} disabled={playing || locked || !supported}><Play size={18} /> {plays === 0 ? 'Audioni boshlash' : 'Qayta eshitish'}</button>
    </div>
  );
}

function Player({ submitted, test }: { submitted: boolean; test: ListeningTest }) {
  const [track, setTrack] = useState<{ file: string; seconds: number } | null | undefined>(undefined);
  const [practice, setPractice] = useState(false);
  useEffect(() => { void listeningTrack(test.id).then(setTrack); }, [test.id]);
  return (
    <div>
      <p><b>{test.context}</b></p>
      {track === undefined ? <p className="muted">Audio yuklanmoqda…</p> : track ? <FilePlayer file={track.file} seconds={track.seconds} practice={practice} /> : <BrowserPlayer test={test} practice={practice} />}
      <p style={{ marginTop: 14 }}><label><input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} /> Mashq rejimi (pauza va qayta eshitish)</label></p>
      <p className="evidence">Imtihon rejimida audio faqat bir marta eshittiriladi.</p>
      {(submitted || practice) && <details open={submitted}><summary>Transkript</summary><Transcript test={test} /></details>}
    </div>
  );
}

export default function Listening({ test: t }: { test: ListeningTest }) {
  return (
    <MockTest
      key={t.id}
      kind="listening"
      title={t.title}
      minutes={t.minutes}
      groups={t.groups}
      questions={t.questions}
      table={LISTENING_TABLE}
      intro={<p>Audioni tinglab {t.questions.length} ta savolga javob bering. Audio tabiiy ovozda yozilgan va imtihon qoidasi bo‘yicha bir marta eshittiriladi (mashq rejimida pauza va qayta eshitish mumkin).</p>}
      left={({ submitted }) => <Player submitted={submitted} test={t} />}
    />
  );
}
