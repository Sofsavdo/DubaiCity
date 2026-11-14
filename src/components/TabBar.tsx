import { useT } from '../i18n';
import { TABS, isActive } from './nav';

export function TabBar({ hash }: { hash: string }) {
  const t = useT();
  return (
    <nav className="tabbar" aria-label={t('nav.quick')}>
      {TABS.map((x) => <a key={x.href} href={x.href} className={isActive(hash, x.href) ? 'active' : ''}><x.icon size={22} />{x.label === 'nav.home' ? t('nav.home.short') : t(x.label)}</a>)}
    </nav>
  );
}
