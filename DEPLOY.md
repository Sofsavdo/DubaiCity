# Joylashtirish (deploy)

Bandly bitta Node jarayoni: `npm start` frontend (`dist/`) va API'ni birga xizmat qiladi. Node **22.12+** kerak (`node:sqlite`).

## Railway (yoki shunga o'xshash xizmat)

1. Repo'ni ulang. Build: `npm ci && npm run build`. Start: `npm start`.
2. **Doimiy disk (Volume)** ulang va `DB_PATH=/data/bandly.sqlite` qo'ying. Diskssiz reyting va duellar har deployda o'chadi.
3. O'zgaruvchilar: `TRUST_PROXY=1` (so'rov tezligi cheklovi haqiqiy IP bo'yicha ishlashi uchun), `PORT` (xizmat o'zi beradi).
4. AI uchun (ixtiyoriy): `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL` (`.env.example` ga qarang). Kalitni faqat xizmatning maxfiy o'zgaruvchilariga yozing.
5. Mikrofon (Speaking) faqat **HTTPS** da ishlaydi; xizmat HTTPS beradi.

Docker: `docker build -t bandly . && docker run -p 3101:3101 -v bandly-data:/data bandly`.

## Muhim cheklovlar

- SQLite bitta nusxada (bitta instance) ishlaydi; bir nechta nusxaga ko'paytirish uchun Postgres'ga o'tish kerak.
- Hisoblar parolsiz (laqab + qurilmadagi token). To'lov hali yo'q (obuna demo).
- Zaxira: `DB_PATH` faylini muntazam nusxalang.
