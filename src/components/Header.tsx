import { Flame, Menu, Star, Target, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BRAND } from '../brand';
import { levelProgress } from '../lib/game';
import { useProfile } from '../lib/store';
import { Mascot } from './Mascot';
import { HOME, NAV, PROFILE, TOOLS, isActive } from './nav';

function Stats() {
  const p = useProfile();
  const lp = levelProgress(p.xp);
  const goal = Math.min(1, p.dailyXp / Math.max(1, p.dailyGoal));
  return (
    <div className="stats" aria-label="Statistika">
      <span className="stat" title="Ketma-ket kunlar"><Flame color="#ff7a1a" fill="#ff7a1a" />{p.streak}</span>
      <span className="stat" title={`${lp.into}/${lp.span} XP`}><Star color="#f5b400" fill="#f5b400" />{lp.level}<span className="mini"><i style={{ width: `${lp.pct * 100}%` }} /></span></span>
      <span className="stat" title="Kunlik maqsad"><Target color="#12b76a" />{Math.min(p.dailyXp, p.dailyGoal)}/{p.dailyGoal}<span className="mini"><i style={{ width: `${goal * 100}%`, background: goal >= 1 ? 'var(--ok)' : undefined }} /></span></span>
    </div>
  );
}

export function Header({ hash }: { hash: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [hash]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <>
      <header className="app-header">
        <div className="container">
          <a className="logo" href="#/" aria-label={BRAND.name}><Mascot mood="happy" size={38} />{BRAND.name}</a>
          <nav className="nav" aria-label="Asosiy menyu">
            {NAV.map((n) => <a key={n.href} href={n.href} className={isActive(hash, n.href) ? 'active' : ''}><n.icon size={16} />{n.label}</a>)}
          </nav>
          <div className="header-right">
            <Stats />
            <a className="btn primary sm header-cta" href="#/pricing">Obuna turlari</a>
            <a className="icon-btn desk-only" href={PROFILE.href} aria-label="Profil"><User size={18} /></a>
            <button className="icon-btn menu-btn" aria-label="Menyu" onClick={() => setOpen(true)}><Menu size={20} /></button>
          </div>
        </div>
      </header>
      {open && (
        <>
          <div className="drawer-back" onClick={() => setOpen(false)} />
          <aside className="drawer" aria-label="Menyu">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="logo"><Mascot mood="happy" size={34} />{BRAND.name}</span>
              <button className="icon-btn" aria-label="Yopish" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <div className="dstats"><Stats /></div>
            {[HOME, ...NAV, TOOLS, PROFILE].map((n) => <a key={n.href} href={n.href} className={`dlink ${isActive(hash, n.href) ? 'active' : ''}`}><n.icon size={20} />{n.label}</a>)}
            <a className="btn primary" href="#/pricing" style={{ marginTop: 10 }}>Obuna turlari</a>
          </aside>
        </>
      )}
    </>
  );
}
