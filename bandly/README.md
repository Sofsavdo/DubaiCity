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
| **Mock testlar** (`#/mocks`) | Taymerli test, avtomatik baho, tahlil | 2 ta mini-mock (to'liq mocklar keyin) |

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
- **Reyting** (`#/league`): laqab bilan qo'shilish (parolsiz), haftalik va umumiy jadval. Server XP o'sishini cheklaydi
  (bir so'rovda 400, soatiga 1500), lekin XP hozircha mijoz tomonidan yuboriladi, shuning uchun to'liq aldovdan himoya emas.
  Keyingi qadam: XP ni serverda o'yin hodisalaridan hisoblash.

## Ma'lum cheklovlar

- Kontent hali kichik: 1 Reading, 1 Listening, 50 Grammar, 152 so'z. Mini-test bandi 40 ballik shkalaga keltirilgan, faqat taxminiy.
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
