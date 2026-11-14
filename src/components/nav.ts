import { BookOpenCheck, BookOpen, Clapperboard, ClipboardList, LineChart as ChartIcon, PenLine, Gamepad2, House, Puzzle, Swords, Target, Timer, Trophy, User, type LucideIcon } from 'lucide-react';

import type { Key } from '../i18n';

export interface NavItem { href: string; label: Key; icon: LucideIcon }

export const NAV: NavItem[] = [
  { href: '#/learn', label: 'nav.learn', icon: BookOpenCheck },
  { href: '#/exam', label: 'nav.exam', icon: Target },
  { href: '#/grammar', label: 'nav.grammar', icon: Puzzle },
  { href: '#/mocks', label: 'nav.mocks', icon: Timer },
  { href: '#/games', label: 'nav.games', icon: Gamepad2 },
  { href: '#/league', label: 'nav.league', icon: Trophy },
  { href: '#/duel', label: 'nav.duel', icon: Swords },
];
export const HOME: NavItem = { href: '#/', label: 'nav.home', icon: House };
export const PROFILE: NavItem = { href: '#/profile', label: 'nav.profile', icon: User };
export const TABS: NavItem[] = [HOME, NAV[0]!, NAV[1]!, NAV[4]!, PROFILE]; // Home, General English, Exam, Games, Profile
export const PRACTICE: NavItem = { href: '#/practice', label: 'nav.practice', icon: PenLine };
export const HOMEWORK: NavItem = { href: '#/homework', label: 'nav.homework', icon: ClipboardList };
export const RESULTS: NavItem = { href: '#/results', label: 'nav.results', icon: ChartIcon };
export const SHADOW: NavItem = { href: '#/shadow', label: 'nav.shadow', icon: Clapperboard };
export const TOOLS: NavItem = { href: '#/tools', label: 'nav.tools', icon: BookOpen };

export const isActive = (hash: string, base: string): boolean =>
  base === '#/' ? hash === '#/' || hash === '' : hash === base || hash.startsWith(base + '/');
