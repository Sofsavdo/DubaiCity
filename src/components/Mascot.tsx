import { useId } from 'react';

export type Mood = 'idle' | 'happy' | 'sad' | 'angry' | 'think' | 'laugh' | 'listen' | 'impressed';

const INK = '#1a1d33';

/** Bandi v2: gradientli yuz, ko'z qovoqlari (pirpiraydi), qosh, yonoq, qo'l-tana, so'zlaganda og'iz harakati. Original personaj. */
export function Mascot({ mood = 'idle', size = 96, talking = false }: { mood?: Mood; size?: number; talking?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const g = (n: string) => `${n}${uid}`;
  const wide = mood === 'listen' || mood === 'impressed';
  const happyEyes = mood === 'happy' || mood === 'laugh';
  const pup = mood === 'think' ? { x: 3, y: -3 } : mood === 'listen' ? { x: 0, y: 0 } : mood === 'sad' ? { x: 0, y: 2 } : { x: 0, y: 0 };

  const Eye = ({ cx }: { cx: number }) => happyEyes ? (
    <path d={`M${cx - 10} 82 Q${cx} ${mood === 'laugh' ? 62 : 68} ${cx + 10} 82`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
  ) : (
    <g className="m-eye">
      <ellipse cx={cx} cy={78} rx={wide ? 11 : 9.5} ry={wide ? 13 : 11} fill="#fff" stroke={INK} strokeWidth="2.5" />
      <circle cx={cx + pup.x} cy={79 + pup.y} r={wide ? 6.5 : 5.5} fill={INK} />
      <circle cx={cx + pup.x + 2} cy={76 + pup.y} r="2" fill="#fff" />
      {mood === 'angry' && <path d={`M${cx - 12} 66 L${cx + 12} ${cx < 80 ? 74 : 66}`} stroke="none" />}
    </g>
  );

  const brow = (cx: number, left: boolean) => {
    const s = left ? 1 : -1;
    if (mood === 'angry') return <path d={`M${cx - 12 * s} 62 L${cx + 12 * s} 69`} stroke={INK} strokeWidth="5" strokeLinecap="round" />;
    if (mood === 'sad') return <path d={`M${cx - 12 * s} 68 L${cx + 12 * s} 62`} stroke={INK} strokeWidth="4" strokeLinecap="round" />;
    if (mood === 'think') return left ? <path d={`M${cx - 10} 64 Q${cx} 60 ${cx + 10} 64`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" /> : <path d={`M${cx - 10} 58 Q${cx} 52 ${cx + 10} 58`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
    if (wide) return <path d={`M${cx - 11} 56 Q${cx} 50 ${cx + 11} 56`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
    if (happyEyes) return null;
    return <path d={`M${cx - 10} 62 Q${cx} 58 ${cx + 10} 62`} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".75" />;
  };

  const mouth = () => {
    if (talking) return <ellipse className="m-talk" cx="80" cy="100" rx="9" ry="7" fill="#7a1530" stroke={INK} strokeWidth="2.5" />;
    switch (mood) {
      case 'laugh': return (<>
        <path d="M58 94 Q80 128 102 94 Z" fill="#7a1530" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M66 108 Q80 118 94 108 Q80 104 66 108Z" fill="#ff8a95" />
        <path d="M63 95 H97" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".95" />
      </>);
      case 'happy': return (<>
        <path d="M62 94 Q80 118 98 94 Z" fill="#7a1530" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M70 105 Q80 112 90 105" stroke="#ff8a95" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>);
      case 'sad': return <path d="M66 108 Q80 94 94 108" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'angry': return <path d="M66 104 Q80 96 94 104" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />;
      case 'think': return <path d="M70 102 Q82 98 92 104" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'impressed': return <ellipse cx="80" cy="102" rx="7" ry="9" fill="#7a1530" stroke={INK} strokeWidth="3" />;
      case 'listen': return <path d="M70 100 Q80 106 90 100" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
      default: return <path d="M66 98 Q80 112 94 98" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <svg className={`mascot ${mood}${talking ? ' talking' : ''}`} width={size} height={size} viewBox="0 0 160 160" role="img" aria-label={`Bandi: ${mood}`}>
      <defs>
        <radialGradient id={g('face')} cx="38%" cy="30%" r="80%"><stop offset="0" stopColor="#fff0a8" /><stop offset=".45" stopColor="#ffd23f" /><stop offset="1" stopColor="#f5a300" /></radialGradient>
        <linearGradient id={g('band')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6a55" /><stop offset="1" stopColor="#e02c1c" /></linearGradient>
        <linearGradient id={g('body')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f7dff" /><stop offset="1" stopColor="#2548c8" /></linearGradient>
      </defs>
      <ellipse cx="80" cy="152" rx="40" ry="6" fill="rgba(10,14,40,.16)" />
      {/* Tana */}
      <g className="m-body">
        <path d="M46 150 Q46 118 80 116 Q114 118 114 150 Z" fill={`url(#${g('body')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M70 118 Q80 128 90 118" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle className="m-arm l" cx="42" cy="132" r="9" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <circle className="m-arm r" cx="118" cy="132" r="9" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      </g>
      {/* Bosh */}
      <g className="m-head">
        <circle cx="80" cy="72" r="54" fill={`url(#${g('face')})`} stroke={INK} strokeWidth="3.5" />
        <ellipse cx="56" cy="44" rx="14" ry="8" fill="#fff" opacity=".35" transform="rotate(-25 56 44)" />
        {/* "Band" bosh bog'ichi */}
        <path d="M27 54 Q80 26 133 54 L133 68 Q80 40 27 68 Z" fill={`url(#${g('band')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 54 Q80 36 120 54" stroke="#fff" strokeWidth="3" fill="none" opacity=".4" strokeLinecap="round" />
        <g className="m-tails">
          <path d="M130 58 L152 46 L148 66 Z" fill="#ff4d3d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M130 62 L153 70 L141 82 Z" fill="#d62a1a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        {/* Yonoqlar */}
        <ellipse cx="42" cy="96" rx="10" ry="6.5" fill="#ff7b8f" opacity={mood === 'angry' ? 0.75 : happyEyes || mood === 'impressed' ? 0.7 : 0.4} />
        <ellipse cx="118" cy="96" rx="10" ry="6.5" fill="#ff7b8f" opacity={mood === 'angry' ? 0.75 : happyEyes || mood === 'impressed' ? 0.7 : 0.4} />
        {brow(60, true)}{brow(100, false)}
        <Eye cx={60} /><Eye cx={100} />
        {mouth()}
        {mood === 'laugh' && <path className="m-tear" d="M44 86 Q38 98 46 104 M116 86 Q122 98 114 104" stroke="#4aa8ff" strokeWidth="4" fill="none" strokeLinecap="round" />}
        {mood === 'sad' && <path className="m-tear" d="M52 92 Q48 104 54 108" stroke="#4aa8ff" strokeWidth="4" fill="none" strokeLinecap="round" />}
      </g>
      {/* Effektlar */}
      {mood === 'angry' && <path className="steam" d="M30 36 Q24 26 32 18 M130 36 Q136 26 128 18" stroke="#9aa3bd" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {mood === 'think' && <g className="m-dots"><circle cx="128" cy="26" r="4" fill={INK} opacity=".5" /><circle cx="138" cy="16" r="6" fill={INK} opacity=".5" /><circle cx="150" cy="8" r="8" fill={INK} opacity=".5" /></g>}
      {(mood === 'happy' || mood === 'impressed') && <g className="m-spark"><path d="M20 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#fff" stroke="#f5b400" strokeWidth="2" /><path d="M140 24 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#fff" stroke="#f5b400" strokeWidth="2" /></g>}
      {mood === 'listen' && <g className="m-ear" fill="none" stroke="#12b76a" strokeWidth="4" strokeLinecap="round"><path d="M18 62 Q10 76 18 90" /><path d="M8 56 Q-2 76 8 96" opacity=".6" /><path d="M142 62 Q150 76 142 90" /><path d="M152 56 Q162 76 152 96" opacity=".6" /></g>}
    </svg>
  );
}
