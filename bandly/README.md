# Bandly: IELTS / SAT / CEFR tayyorgarlik platformasi (MVP 0.2)

Vaqtinchalik brend nomi: **Bandly** (`src/brand.ts`). "IELTS" so'zi brend nomida ishlatilmaydi (savdo belgisi);
rasmiy emasligi haqidagi ogohlantirish `BRAND.disclaimer` da.

## Ishga tushirish

```bash
cd bandly
npm install
npm run dev      # http://localhost:3100  (frontend)
npm run server   # http://127.0.0.1:3101  (reyting API, SQLite; Node 22+, `node:sqlite`)
npm test         # ball hisoblash, baholash, o'yin/XP, takrorlash tizimi, lug'at yaxlitligi
npm run build    # statik fayllar: dist/
```

## Mahsulot tuzilishi: 3 ta mustaqil obuna

| Yo'nalish | Tarkibi | Holat |
|---|---|---|
| **Imtihon tayyorgarligi** (`#/exam`) | IELTS: Reading, Listening, Writing, Speaking. SAT va CEFR | IELTS bor; SAT/CEFR "tez orada" |
| **Grammar** (`#/grammar`) | 50 savol, 10 mavzu (artikl, zamon, shart gap, predlog, majhul nisbat, modal, nisbiy gap, gerund, taqqoslash...), o'zbekcha izoh, "Xatolarim" takrorlash | Bepul: faqat "Artikllar" |
| **Mock testlar** (`#/mocks`) | Taymerli test, avtomatik baho, tahlil, eng yaxshi natija | 4 Reading + 4 Listening mini-mock (to'liq 40 savollik mocklar keyin) |

Foydalanuvchi faqat kerakli yo'nalish uchun to'laydi. Istalgan obuna so'z o'yinlarini cheksiz qiladi;
obunasiz kuniga 2 ta bepul o'yin (`FREE_GAMES_PER_DAY`, `src/config.ts`).

**Muhim:** to'lov hali ulanmagan. Obuna holati **DEMO**: `localStorage` da saqlanadi va "Demo: yoqish" tugmasi bilan
faqat shu qurilmada ochiladi. Narxlar (`src/config.ts`) **namunaviy**, oldindan sotuv sinovidan keyin belgilanadi.

## O'yinlashtirish

- **XP, daraja, kunlik maqsad, seriya (streak), yutuqlar** (`src/lib/game.ts`, sof funksiyalar, testlangan).
- **Takrorlash tizimi (Leitner)** (`src/lib/srs.ts`): xato javob so'zni 0-qutiga qaytaradi, to'g'ri javob intervalni 1/3/7/14/30 kunga oshiradi.
  O'yinlar har sessiyada muddati kelgan so'zlarni birinchi navbatda beradi, kamida 30% yangi so'z bilan.
- **3 ta so'z o'yini** (152 ta IELTS so'zi, 14 mavzu): So'z poygasi (60 soniya, 3 jon, kombo), Juftlik, Imlo sinovi (eshitish tugmasi bilan).
- **Mascot "Bandi"** (original SVG, 5 kayfiyat). **Qattiq rejim (18+)** o'zi yoqilganda xatoga hazil bilan javob beradi; haqorat yo'q.
- Mock test, Grammar, Writing, Speaking tugaganda ham XP beriladi.
- **Duel** (`#/duel`): havola/kod orqali do'st bilan bir xil 10 ta so'zda raqobat (har savolga 12 soniya, tezlik ball beradi, ball teng bo'lsa tezroq tugatgan yutadi). Server natijani tekshiradi (ball va vaqt chegaralari), duel 48 soat amal qiladi, 8 tagacha o'yinchi.
- **Speaking: jonli ovozli suhbat** (`#/exam/speaking`): ustoz Bandi IELTS tartibida (tanishuv, Part 1, Part 2 tayyorgarlik+monolog, Part 3) gapiradi, siz ovoz bilan javob berasiz.
  Ovoz **yozib olinmaydi va yuborilmaydi**: brauzer nutqni tanish (SpeechRecognition) va ovoz sintezi (speechSynthesis) ishlatiladi
  (Chrome/Edge/Safari; nutqni tanishni brauzer xizmati bajaradi). Nutqni tanish yo'q brauzerlarda yozma rejim.
  Ustozning "miyasi" hozircha qoidaviy (`src/lib/examiner.ts`); AI ulanganda shu interfeys almashtiriladi. Hisobot faqat tezlik, to'xtashlar va so'z xilma-xilligi bo'yicha taxminiy.
- **Reyting** (`#/league`): laqab bilan qo'shilish (parolsiz), haftalik va umumiy jadval. Server XP o'sishini cheklaydi
  (bir so'rovda 400, soatiga 1500), lekin XP hozircha mijoz tomonidan yuboriladi, shuning uchun to'liq aldovdan himoya emas.
  Keyingi qadam: XP ni serverda o'yin hodisalaridan hisoblash.

## AI ulash (ixtiyoriy)

Kalit bo'lmasa hammasi qoidaviy rejimda ishlaydi. AI ulash uchun:

```bash
cp .env.example .env     # AI_PROVIDER, AI_API_KEY, AI_MODEL ni to'ldiring (kalitni faqat shu faylga yozing)
npm run server           # AI holati ishga tushganda yoziladi: "(AI: anthropic)"
```

- Qo'llanadi: Anthropic, Gemini va OpenAI-mos xizmatlar (OpenAI, Groq, OpenRouter; `AI_BASE_URL` bilan).
- **Speaking:** AI faqat yaxshi javobdan keyin javobga bog'liq savol beradi (suhbatda eng ko'pi 3 ta) va suhbat oxirida baho beradi. Tartib va vaqtni qoidaviy ustoz boshqaradi. AI xato qilsa skript davom etadi.
- **Writing:** "AI baholash" tugmasi: 4 mezon, kuchli/zaif tomonlar, tuzatishlar. Kamida 30 so'z kerak.
- Xavfsizlik: kalit faqat serverda; AI so'rovlari laqab-token talab qiladi va kuniga `AI_DAILY_LIMIT` bilan cheklangan; nomzod matni "ishonchsiz ma'lumot" sifatida ajratiladi; AI javobi qat'iy tekshiriladi (baho 0–9, 0.5 qadam, overall serverda IELTS qoidasi bilan hisoblanadi).
- Maxfiylik: AI yoqilganda **matn** (ovoz emas) AI provayderiga yuboriladi; foydalanuvchiga ekranda aytiladi.
- Talaffuz matndan baholanmaydi ("baholanmaydi" deb ko'rsatiladi).
- Sinash: `npm test` uchala provayder formatini soxta server bilan tekshiradi; haqiqiy kalit bilan sinalmagan.

## Ma'lum cheklovlar

- Kontent hali kichik: 4 Reading, 4 Listening (13/10 savoldan), 50 Grammar, 152 so'z. Savol turlari: True/False/Not Given, bo'sh joy, test, moslashtirish (sarlavha/harf). Mini-test bandi 40 ballik shkalaga keltirilgan, faqat taxminiy.
- Parolli hisoblar, do'stlar bilan duel, to'lov yo'q. Reyting tokeni shu qurilmada saqlanadi (yo'qolsa, laqab qayta olinmaydi).
- AI Writing/Speaking baholash yo'q (kalit kerak); Writing tekshiruvi qoidaviy.
- Listening audiosi qurilmadagi ingliz ovoziga bog'liq.
- SAT va CEFR hali yo'q.

## Keyingi bosqichlar

1. **Kontent:** har ko'nikmaga 10 ta test, 500+ so'z, 150+ grammar savol (original, dalil izohlari bilan).
2. **Backend**: parolli/Telegram orqali kirish, obuna huquqlari, duellar, duelda ball hisobini serverda qilish, serverda XP hisoblash, Postgres, hostingga joylash.
3. **To'lov** (Payme/Click/Uzum) va haqiqiy obuna tekshiruvi (hozirgi demo o'rniga serverdagi huquqlar).
4. **AI qatlami:** Writing va Speaking baholash (kalit `.env` da, hech qachon chatga yozilmaydi), xarajat hisoblagichi.
5. **SAT va CEFR** yo'nalishlari; o'zbekcha SEO qo'llanmalar; kreator/affiliate dasturi.

## Kontent qoidalari

- Faqat original matnlar (xayoliy ma'lumotlar mumkin); rasmiy Cambridge/IELTS materiallarini nusxalamang.
- Har bir javob uchun `evidence` (dalil). Band doim "taxminiy" deb ko'rsatiladi.
- Lug'atda o'zbekcha ma'nolar takrorlanmasin (variantlar adashmasligi uchun, testda tekshiriladi).
