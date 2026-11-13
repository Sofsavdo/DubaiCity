export type Mood = 'idle' | 'happy' | 'sad' | 'angry' | 'think' | 'laugh';

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
      {mood === 'laugh' ? (
        <>
          <path d="M34 78 Q44 64 54 78" stroke={eye} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M66 78 Q76 64 86 78" stroke={eye} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M38 86 Q60 116 82 86 Z" fill="#8b1d1d" stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M48 92 Q60 100 72 92" stroke="#ff9aa0" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path className="tear" d="M30 84 Q26 94 32 98 M90 84 Q94 94 88 98" stroke="#4aa8ff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'happy' ? (
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
