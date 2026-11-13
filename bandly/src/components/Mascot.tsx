export type Mood = 'idle' | 'happy' | 'sad' | 'angry' | 'think';

/** Bandi: sariq yuz, qizil "band" (bosh bog'ichi). Original personaj. */
export function Mascot({ mood = 'idle', size = 96 }: { mood?: Mood; size?: number }) {
  const eye = '#151a2d';
  return (
    <svg className={`mascot ${mood}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`Bandi: ${mood}`}>
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,.12)" />
      <circle cx="60" cy="62" r="44" fill="#ffd23f" stroke={eye} strokeWidth="3" />
      <path d="M17 52 Q60 32 103 52 L103 64 Q60 44 17 64 Z" fill="#ff4d3d" stroke={eye} strokeWidth="2.5" />
      <path d="M100 56 L116 48 L112 62 Z" fill="#ff4d3d" stroke={eye} strokeWidth="2" />
      <path d="M100 60 L117 66 L108 74 Z" fill="#e63a2b" stroke={eye} strokeWidth="2" />
      {mood === 'happy' ? (
        <>
          <path d="M36 76 Q44 66 52 76" stroke={eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M68 76 Q76 66 84 76" stroke={eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M42 88 Q60 108 78 88 Z" fill="#8b1d1d" stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="44" cy="76" r="5" fill={eye} /><circle cx="76" cy="76" r="5" fill={eye} />
          <path d="M36 68 L52 72" stroke={eye} strokeWidth="3" strokeLinecap="round" /><path d="M84 68 L68 72" stroke={eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M48 96 Q60 86 72 96" stroke={eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'angry' ? (
        <>
          <circle cx="44" cy="78" r="5" fill={eye} /><circle cx="76" cy="78" r="5" fill={eye} />
          <path d="M34 68 L54 76" stroke={eye} strokeWidth="4" strokeLinecap="round" /><path d="M86 68 L66 76" stroke={eye} strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="90" r="6" fill="#ff7a6b" opacity=".7" /><circle cx="86" cy="90" r="6" fill="#ff7a6b" opacity=".7" />
          <path d="M48 96 L72 96" stroke={eye} strokeWidth="4" strokeLinecap="round" />
          <path className="steam" d="M30 36 Q26 28 32 22 M90 36 Q94 28 88 22" stroke="#9aa3bd" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'think' ? (
        <>
          <circle cx="44" cy="76" r="5" fill={eye} /><circle cx="76" cy="76" r="5" fill={eye} />
          <path d="M68 66 L84 62" stroke={eye} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="94" r="4.5" fill="none" stroke={eye} strokeWidth="3" />
        </>
      ) : (
        <>
          <circle cx="44" cy="76" r="5" fill={eye} /><circle cx="76" cy="76" r="5" fill={eye} />
          <path d="M48 90 Q60 98 72 90" stroke={eye} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
