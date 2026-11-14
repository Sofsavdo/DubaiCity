import { ArrowRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type Tone = 'red' | 'blue' | 'orange' | 'yellow' | 'purple' | 'green' | 'ink';

interface Props { href?: string; icon: LucideIcon; tone: Tone; title: ReactNode; text?: ReactNode; badge?: ReactNode; big?: boolean }

/** Rangli ikonkali karta-havola (href bo'lmasa oddiy karta). */
export function Tile({ href, icon: Icon, tone, title, text, badge, big }: Props) {
  const inner = (
    <>
      <span className={`blob ${tone}`}><Icon /></span>
      <div className="grow">
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {badge && <div style={{ marginTop: 8 }}>{badge}</div>}
      </div>
      {href && <span className="go"><ArrowRight size={18} /></span>}
    </>
  );
  const cls = `tile${big ? ' big-tile' : ''}`;
  return href ? <a className={cls} href={href}>{inner}</a> : <div className={cls}>{inner}</div>;
}
