import { MockTest } from '../components/MockTest';
import { reading1 } from '../content/reading1';
import { READING_ACADEMIC_TABLE } from '../lib/band';

export default function Reading() {
  const t = reading1;
  return (
    <MockTest
      kind="reading"
      title={t.title}
      minutes={t.minutes}
      groups={t.groups}
      questions={t.questions}
      table={READING_ACADEMIC_TABLE}
      intro={<p>Bitta matn va 13 ta savol (True/False/Not Given, bo‘sh joylarni to‘ldirish, test). Vaqt tugagach test avtomatik yakunlanadi. Matn original mashq materiali.</p>}
      left={() => (
        <div className="passage">
          <h3>{t.passageTitle}</h3>
          {t.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      )}
    />
  );
}
