# Bandly: IELTS tayyorgarlik platformasi (MVP 0.1)

Vaqtinchalik brend nomi: **Bandly** (faqat `src/brand.ts` da; almashtirish uchun shu fayl yetarli).
"IELTS" so'zi brend nomida ishlatilmaydi (savdo belgisi); materiallar rasmiy emasligi haqidagi ogohlantirish `BRAND.disclaimer` da.

## Ishga tushirish

```bash
cd bandly
npm install
npm run dev      # http://localhost:3100
npm test         # ball hisoblash va baholash mantiqi testlari
npm run build    # statik fayllar: dist/ (istalgan hostingga qo'yiladi)
```

## Hozir nima bor (AI kalitisiz ishlaydi)

| Bo'lim | Holat |
|---|---|
| Reading mock | 1 matn, 13 savol (T/F/NG, bo'sh joy, test), taymer, avtomatik baholash, dalil izohlari |
| Listening mock | 1 suhbat, 10 savol; audio brauzer ovoz sintezi (TTS) bilan; transkript |
| Grammar | 25 savol, 5 mavzu, o'zbekcha tushuntirish |
| Writing | 2 ta Task 1 va 5 ta Task 2 mavzu, taymer, so'z hisoblagich, **qoidaviy** tekshiruv (AI emas) |
| Speaking | Part 1/2/3 savollari, Part 2 taymeri (1 daq. tayyorgarlik + 2 daq.), qurilmada ovoz yozish |
| Asboblar | Umumiy band kalkulyatori (IELTS yaxlitlash qoidasi), to'g'ri javoblar → band |
| Natijalarim | Natijalar `localStorage` da (faqat shu qurilmada) |

## Ma'lum cheklovlar

- Mini-testlar 40 ballik shkalaga keltiriladi, shuning uchun band faqat taxminiy. 13 savoldan 13 tasi to'g'ri bo'lsa 9.0 chiqadi; haqiqiy 40 savollik testda bu boshqacha.
- Listening audiosi qurilmadagi ingliz ovoziga bog'liq (ovoz yo'q bo'lsa transkript ko'rsatiladi). Keyin oldindan yaratilgan audio fayllar bilan almashtiriladi.
- Hisoblar, serversiz saqlash va to'lov yo'q.
- AI Writing/Speaking baholash yo'q (kalit kerak).

## Keyingi bosqichlar

1. **Kontent:** har ko'nikma uchun 10 ta test (original, AI yordamida yozilib, odam tekshirgan). Rasmiy Cambridge/IELTS materiallarini nusxalamaslik.
2. **Backend** (Node + Postgres): hisoblar, natijalar, obuna.
3. **AI provayder qatlami:** Writing va Speaking baholash uchun bitta interfeys (kalit `.env` da, hech qachon chatga yozilmaydi). Nutq → matn → LLM → ovoz. Xarajat hisoblagichi.
4. **To'lov:** Payme/Click/Uzum (so'm), obuna.
5. **O'zbekcha SEO qo'llanmalar** va bepul asboblar sahifalari.
6. **Kreator/affiliate** dasturi (sotuvdan komissiya).

## Kontent qoidalari

- Faqat original matnlar. Mashq ma'lumotlari xayoliy bo'lishi mumkin.
- Har bir javob uchun `evidence` (dalil) yoziladi.
- Band ko'rsatilganda doim "taxminiy" belgisi bo'lishi shart.
