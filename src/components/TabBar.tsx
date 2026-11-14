import { TABS, isActive } from './nav';

export function TabBar({ hash }: { hash: string }) {
  return (
    <nav className="tabbar" aria-label="Tezkor menyu">
      {TABS.map((t) => <a key={t.href} href={t.href} className={isActive(hash, t.href) ? 'active' : ''}><t.icon size={22} />{t.label.replace('Bosh sahifa', 'Asosiy')}</a>)}
    </nav>
  );
}
