import type { ReactNode } from 'react';
import { BRAND } from './brand';
import { Gate } from './components/Gate';
import { useHash } from './components/hooks';
import { StatsBar } from './components/StatsBar';
import { Toasts } from './components/Toasts';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Mocks from './pages/Mocks';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import League from './pages/League';
import DuelHub, { DuelRoom } from './pages/Duel';
import Reading from './pages/Reading';
import Listening from './pages/Listening';
import Grammar from './pages/Grammar';
import Writing from './pages/Writing';
import Speaking from './pages/Speaking';
import Tools from './pages/Tools';
import GamesHub from './pages/games/GamesHub';
import WordRush from './pages/games/WordRush';
import Pairs from './pages/games/Pairs';
import Spell from './pages/games/Spell';

const routes: Record<string, () => ReactNode> = {
  '#/': () => <Home />,
  '#/exam': () => <Exam />,
  '#/exam/reading': () => <Gate track="exam"><Reading /></Gate>,
  '#/exam/listening': () => <Gate track="exam"><Listening /></Gate>,
  '#/exam/writing': () => <Gate track="exam"><Writing /></Gate>,
  '#/exam/speaking': () => <Gate track="exam"><Speaking /></Gate>,
  '#/grammar': () => <Grammar />,
  '#/mocks': () => <Mocks />,
  '#/mocks/reading': () => <Gate track="mocks"><Reading /></Gate>,
  '#/mocks/listening': () => <Gate track="mocks"><Listening /></Gate>,
  '#/games': () => <GamesHub />,
  '#/games/rush': () => <WordRush />,
  '#/games/pairs': () => <Pairs />,
  '#/games/spell': () => <Spell />,
  '#/tools': () => <Tools />,
  '#/pricing': () => <Pricing />,
  '#/league': () => <League />,
  '#/duel': () => <DuelHub />,
  '#/profile': () => <Profile />,
};

const nav: [string, string][] = [
  ['#/', 'Bosh sahifa'],
  ['#/exam', 'Imtihon'],
  ['#/grammar', 'Grammar'],
  ['#/mocks', 'Mock'],
  ['#/games', 'O‘yinlar'],
  ['#/league', 'Reyting'],
  ['#/duel', 'Duel'],
  ['#/profile', 'Profil'],
];

const isActive = (hash: string, base: string): boolean => (base === '#/' ? hash === '#/' || hash === '' : hash === base || hash.startsWith(base + '/'));

export default function App() {
  const hash = useHash();
  const duelCode = hash.match(/^#\/duel\/([A-Za-z0-9]{4,8})$/)?.[1];
  const page = duelCode ? <DuelRoom key={duelCode} code={duelCode.toUpperCase()} /> : (routes[hash] ?? routes['#/'])();
  return (
    <>
      <header className="top">
        <div className="container">
          <a className="logo" href="#/">{BRAND.name}</a>
          <nav>
            {nav.map(([h, label]) => <a key={h} href={h} className={isActive(hash, h) ? 'active' : ''}>{label}</a>)}
          </nav>
          <StatsBar />
        </div>
      </header>
      <main className="container">{page}</main>
      <footer className="container">{BRAND.disclaimer}</footer>
      <Toasts />
    </>
  );
}
