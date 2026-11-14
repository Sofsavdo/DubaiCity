import { BookOpen, Gamepad2, House, Puzzle, Swords, Target, Timer, Trophy, User, type LucideIcon } from 'lucide-react';

export interface NavItem { href: string; label: string; icon: LucideIcon }

export const NAV: NavItem[] = [
  { href: '#/exam', label: 'Imtihon', icon: Target },
  { href: '#/grammar', label: 'Grammar', icon: Puzzle },
  { href: '#/mocks', label: 'Mock testlar', icon: Timer },
  { href: '#/games', label: 'O‘yinlar', icon: Gamepad2 },
  { href: '#/league', label: 'Reyting', icon: Trophy },
  { href: '#/duel', label: 'Duel', icon: Swords },
];
export const HOME: NavItem = { href: '#/', label: 'Bosh sahifa', icon: House };
export const PROFILE: NavItem = { href: '#/profile', label: 'Profil', icon: User };
export const TABS: NavItem[] = [HOME, NAV[0], NAV[3], NAV[4], PROFILE];
export const TOOLS: NavItem = { href: '#/tools', label: 'Band kalkulyatori', icon: BookOpen };

export const isActive = (hash: string, base: string): boolean =>
  base === '#/' ? hash === '#/' || hash === '' : hash === base || hash.startsWith(base + '/');
