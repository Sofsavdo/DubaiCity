import { BRAND } from '../brand';
import { useT, type Key } from '../i18n';
import { Mascot } from './Mascot';

const cols: [Key, [Key, string][]][] = [
  ['footer.tracks', [['footer.exam', '#/exam'], ['nav.grammar', '#/grammar'], ['nav.practice', '#/practice'], ['nav.shadow', '#/shadow'], ['nav.mocks', '#/mocks'], ['cta.plans', '#/pricing']]],
  ['footer.games', [['footer.rush', '#/games/rush'], ['footer.pairs', '#/games/pairs'], ['footer.spell', '#/games/spell'], ['nav.duel', '#/duel']]],
  ['footer.free', [['nav.homework', '#/homework'], ['nav.results', '#/results'], ['nav.tools', '#/tools'], ['nav.league', '#/league']]],
];

export function Footer() {
  const t = useT();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a className="logo" href="#/"><Mascot mood="happy" size={36} />{BRAND.name}</a>
            <p className="muted" style={{ marginTop: 12, maxWidth: 240 }}>{t('brand.tagline')}</p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}><h4>{t(title)}</h4>{links.map(([l, h]) => <a key={h} href={h}>{t(l)}</a>)}</div>
          ))}
        </div>
        <p className="disclaimer">{BRAND.disclaimer}</p>
      </div>
    </footer>
  );
}
