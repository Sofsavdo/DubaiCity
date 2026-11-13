import { MockTest } from '../components/MockTest';
import type { ReadingTest } from '../content/types';
import { READING_ACADEMIC_TABLE } from '../lib/band';

export default function Reading({ test: t }: { test: ReadingTest }) {
  return (
    <MockTest
      key={t.id}
      kind="reading"
      title={t.title}
      minutes={t.minutes}
      groups={t.groups}
      questions={t.questions}
      table={READING_ACADEMIC_TABLE}
      intro={<p>Bitta matn va {t.questions.length} ta savol. Vaqt tugagach test avtomatik yakunlanadi. Matn original mashq materiali.</p>}
      left={() => (
        <div className="passage">
          <h3>{t.passageTitle}</h3>
          {t.paragraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </div>
      )}
    />
  );
}
