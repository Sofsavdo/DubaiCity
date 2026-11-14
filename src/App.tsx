import { useEffect, type ReactNode } from 'react';
import { Gate } from './components/Gate';
import { useHash } from './components/hooks';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { Toasts } from './components/Toasts';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Mocks from './pages/Mocks';
import Pricing from './pages/Pricing';
import Placement from './pages/Placement';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import League from './pages/League';
import DuelHub, { DuelRoom } from './pages/Duel';
import Reading from './pages/Reading';
import Listening from './pages/Listening';
import TestList from './pages/TestList';
import { listeningTests } from './content/listeningTests';
import { readingTests } from './content/readingTests';
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
  '#/exam/writing': () => <Gate track="exam"><Writing /></Gate>,
  '#/exam/speaking': () => <Gate track="exam"><Speaking /></Gate>,
  '#/grammar': () => <Grammar />,
  '#/mocks': () => <Mocks />,
  '#/games': () => <GamesHub />,
  '#/games/rush': () => <WordRush />,
  '#/games/pairs': () => <Pairs />,
  '#/games/spell': () => <Spell />,
  '#/tools': () => <Tools />,
  '#/pricing': () => <Pricing />,
  '#/league': () => <League />,
  '#/duel': () => <DuelHub />,
  '#/profile': () => <Profile />,
  '#/placement': () => <Placement />,
  '#/practice': () => <Practice />,
};

/** #/exam|mocks/reading|listening[/id] yo'nalishi: ro'yxat yoki bitta test, tegishli obuna bilan */
function testRoute(hash: string): ReactNode | null {
  const m = hash.match(/^#\/(exam|mocks)\/(reading|listening)(?:\/([\w-]+))?$/);
  if (!m) return null;
  const [, track, kind, id] = m as [string, 'exam' | 'mocks', 'reading' | 'listening', string | undefined];
  let body: ReactNode;
  if (!id) body = <TestList track={track} kind={kind} />;
  else if (kind === 'reading') { const t = readingTests.find((x) => x.id === id); body = t ? <Reading test={t} /> : <TestList track={track} kind={kind} />; }
  else { const t = listeningTests.find((x) => x.id === id); body = t ? <Listening test={t} /> : <TestList track={track} kind={kind} />; }
  return <Gate track={track}>{body}</Gate>;
}

export default function App() {
  const hash = useHash();
  // Menyu bosilganda yangi sahifa har doim tepadan boshlansin
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, [hash]);
  const duelCode = hash.match(/^#\/duel\/([A-Za-z0-9]{4,8})$/)?.[1];
  const tr = testRoute(hash);
  const page = tr ? tr : duelCode ? <DuelRoom key={duelCode} code={duelCode.toUpperCase()} /> : (routes[hash] ?? routes['#/'])();
  return (
    <>
      <Header hash={hash} />
      <main className="container">{page}</main>
      <Footer />
      <TabBar hash={hash} />
      <Toasts />
    </>
  );
}
