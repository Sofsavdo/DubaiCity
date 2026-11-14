import { BRAND } from '../brand';
import { Mascot } from './Mascot';

const cols: [string, [string, string][]][] = [
  ['Yo‘nalishlar', [['Imtihon tayyorgarligi', '#/exam'], ['Grammar', '#/grammar'], ['Mock testlar', '#/mocks'], ['Obuna turlari', '#/pricing']]],
  ['O‘yinlar', [['So‘z poygasi', '#/games/rush'], ['Juftlik', '#/games/pairs'], ['Imlo sinovi', '#/games/spell'], ['Duel', '#/duel']]],
  ['Bepul', [['Band kalkulyatori', '#/tools'], ['Reyting', '#/league'], ['Natijalarim', '#/profile']]],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a className="logo" href="#/"><Mascot mood="happy" size={36} />{BRAND.name}</a>
            <p className="muted" style={{ marginTop: 12, maxWidth: 240 }}>{BRAND.tagline}</p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}><h4>{title}</h4>{links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</div>
          ))}
        </div>
        <p className="disclaimer">{BRAND.disclaimer}</p>
      </div>
    </footer>
  );
}
