import { LEVELS } from '../content/roasts';
import { setPersona, useProfile } from '../lib/store';

export function PersonaPicker() {
  const p = useProfile();
  return (
    <div>
      <h4 style={{ margin: '8px 0' }}>Ustoz xarakteri</h4>
      <div className="opts" style={{ marginTop: 0 }}>
        {LEVELS.map((lv) => {
          const locked = lv.id >= 2 && !p.adult;
          const on = p.roastLevel === lv.id && !locked;
          return (
            <button key={lv.id} className={`opt ${on ? 'sel' : ''}`} disabled={locked} onClick={() => setPersona(lv.id, p.adult)}>
              <b>{lv.name}</b><div className="evidence">{lv.desc}</div>
            </button>
          );
        })}
      </div>
      <p><label><input type="checkbox" checked={p.adult} onChange={(e) => setPersona(e.target.checked ? p.roastLevel : Math.min(p.roastLevel, 1), e.target.checked)} /> Men 18 yoshdan oshganman va qattiq so‘kishni o‘zim xohlayman</label></p>
      <p className="evidence">Qattiq darajalarda ustoz xatolaringiz ustidan kuladi va yengil so‘kadi (tentak, eshak, ahmoq kabi). Oila, din, millat, tashqi ko‘rinish, jins va nogironlik haqida hech qachon gapirmaydi.</p>
    </div>
  );
}
