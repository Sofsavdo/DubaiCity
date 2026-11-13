import { BRAND } from './brand';
import { useHash } from './components/hooks';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Listening from './pages/Listening';
import Grammar from './pages/Grammar';
import Writing from './pages/Writing';
import Speaking from './pages/Speaking';
import Tools from './pages/Tools';
import Progress from './pages/Progress';

const routes: Record<string, { label: string; el: () => JSX.Element }> = {
  '#/reading': { label: 'Reading', el: Reading },
  '#/listening': { label: 'Listening', el: Listening },
  '#/grammar': { label: 'Grammar', el: Grammar },
  '#/writing': { label: 'Writing', el: Writing },
  '#/speaking': { label: 'Speaking', el: Speaking },
  '#/tools': { label: 'Asboblar', el: Tools },
  '#/progress': { label: 'Natijalarim', el: Progress },
};

export default function App() {
  const hash = useHash();
  const route = routes[hash];
  const Page = route ? route.el : Home;
  return (
    <>
      <header className="top">
        <div className="container">
          <a className="logo" href="#/">{BRAND.name}</a>
          <nav>
            {Object.entries(routes).map(([h, r]) => (
              <a key={h} href={h} className={hash === h ? 'active' : ''}>{r.label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="container"><Page /></main>
      <footer className="container">{BRAND.disclaimer}</footer>
    </>
  );
}
