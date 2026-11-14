import { BookOpen, PenLine, Gamepad2, House, Puzzle, Swords, Target, Timer, Trophy, User, type LucideIcon } from 'lucide-react';

import type { Key } from '../i18n';

export interface NavItem { href: string; label: Key; icon: LucideIcon }

export const NAV: NavItem[] = [
  { href: '#/exam', label: 'nav.exam', icon: Target },
  { href: '#/grammar', label: 'nav.grammar', icon: Puzzle },
  { href: '#/mocks', label: 'nav.mocks', icon: Timer },
  { href: '#/games', label: 'nav.games', icon: Gamepad2 },
  { href: '#/league', label: 'nav.league', icon: Trophy },
  { href: '#/duel', label: 'nav.duel', icon: Swords },
];
export const HOME: NavItem = { href: '#/', label: 'nav.home', icon: House };
export const PROFILE: NavItem = { href: '#/profile', label: 'nav.profile', icon: User };
export const TABS: NavItem[] = [HOME, NAV[0], NAV[3], NAV[4], PROFILE];
export const PRACTICE: NavItem = { href: '#/practice', label: 'nav.practice', icon: PenLine };
export const TOOLS: NavItem = { href: '#/tools', label: 'nav.tools', icon: BookOpen };

export const isActive = (hash: string, base: string): boolean =>
  base === '#/' ? hash === '#/' || hash === '' : hash === base || hash.startsWith(base + '/');
