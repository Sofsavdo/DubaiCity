import { useEffect, useRef, useState } from 'react';
import { MockTest } from '../components/MockTest';
import { listening1 } from '../content/listening1';
import { LISTENING_TABLE } from '../lib/band';

function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en')));
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);
  return voices;
}

function Player({ submitted }: { submitted: boolean }) {
  const voices = useVoices();
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const [practice, setPractice] = useState(false);
  const stopRef = useRef(false);
  const supported = 'speechSynthesis' in window;

  const play = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    stopRef.current = false;
    setPlaying(true);
    setPlays((n) => n + 1);
    const vA = voices[0];
    const vB = voices.find((v) => v !== vA) ?? vA;
    listening1.script.forEach((line, i, arr) => {
      const u = new SpeechSynthesisUtterance(line.text);
      const v = line.speaker === 'A' ? vA : vB;
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
      u.rate = 0.92;
      u.pitch = line.speaker === 'A' ? 1.15 : 0.8;
      if (i === arr.length - 1) u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      synth.speak(u);
    });
  };
  const stop = () => { stopRef.current = true; window.speechSynthesis?.cancel(); setPlaying(false); };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const locked = !practice && plays >= 1 && !playing;
  return (
    <div>
      <p><b>{listening1.context}</b></p>
      {!supported && <p className="notice">Brauzeringiz ovoz sintezini qo‘llamaydi. Transkriptni quyida ko‘ring.</p>}
      {supported && voices.length === 0 && <p className="notice">Inglizcha ovoz topilmadi. Telefon/kompyuter sozlamalarida ingliz ovozini yoqing yoki mashq rejimida transkriptdan foydalaning.</p>}
      <div className="row">
        <button className="btn primary" onClick={play} disabled={playing || locked || !supported}>{plays === 0 ? 'Audioni boshlash' : 'Qayta eshitish'}</button>
        <button className="btn" onClick={stop} disabled={!playing}>To‘xtatish</button>
        <label><input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} /> Mashq rejimi (qayta eshitish mumkin)</label>
      </div>
      <p className="evidence">Imtihon rejimida audio faqat bir marta eshittiriladi. Ovoz sifati qurilmangizga bog‘liq.</p>
      {(submitted || practice) && (
        <details open={submitted}>
          <summary>Transkript</summary>
          {listening1.script.map((l, i) => (
            <p key={i}><b>{l.speaker === 'A' ? 'Anna' : 'Daniel'}:</b> {l.text}</p>
          ))}
        </details>
      )}
    </div>
  );
}

export default function Listening() {
  const t = listening1;
  return (
    <MockTest
      kind="listening"
      title={t.title}
      minutes={t.minutes}
      groups={t.groups}
      questions={t.questions}
      table={LISTENING_TABLE}
      intro={<p>Suhbatni tinglab 10 ta savolga javob bering. Audio brauzerning ovoz sintezi bilan o‘qiladi (internet audio fayl emas), tezlik va ovoz qurilmaga bog‘liq.</p>}
      left={({ submitted }) => <Player submitted={submitted} />}
    />
  );
}
