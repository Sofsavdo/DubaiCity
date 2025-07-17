# Dubai City Bot - Vercel Deployment Guide

## 🚀 Vercel'da Deploy Qilish Qadamlari

### 1. Environment Variables ni Sozlash
Vercel dashboard'da "Settings" > "Environment Variables" bo'limiga o'ting va quyidagi o'zgaruvchilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TON_WALLET_ADDRESS=your_ton_wallet_address
NODE_ENV=production
```

### 2. GitHub'ga Upload
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Vercel'da Deploy
1. [Vercel.com](https://vercel.com) ga kiring
2. "New Project" tugmasini bosing
3. GitHub'dan loyihangizni tanlang
4. "Deploy" tugmasini bosing
5. Deploy URL'sini eslab qoling (masalan: `https://dubaicity-lilac.vercel.app`)

### 4. Telegram Bot ni Sozlash

#### Bot Yaratish:
1. Telegram'da `@BotFather` ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: "Dubai City Bot")
4. Username kiriting (masalan: `@DubaiCityBot`)
5. Tokenni oling va Vercel'da saqlang

#### Mini App URL ni Sozlash:
1. `@BotFather` da `/setdomain` yoki "Configure Mini App" ni tanlang
2. Vercel deploy URL'sini kiriting: `https://dubaicity-lilac.vercel.app`

#### Komandalar:
`/setcommands` buyrug'i orqali quyidagi komandalarni qo'shing:
```
start - O'yinni boshlash
profile - Profilingizni ko'rish
help - Yordam
```

### 5. TON Wallet ni Sozlash
1. TON Wallet yarating ([Tonkeeper](https://tonkeeper.com/) yoki [TON Wallet](https://wallet.ton.org/) ishlatishingiz mumkin)
2. Wallet address'ni ko'chiring
3. Vercel'da `TON_WALLET_ADDRESS` sifatida saqlang

### 6. Sinov va Tekshirish
1. Telegram'da botni ishga tushiring: `/start`
2. Web App ochilishini kutib turing
3. Vercel dashboard'dan "Functions" > "Logs" ni tekshiring
4. TON to'lovlarini sinov qiling

## 🔧 Texnik Tafsilotlar

### Arxitektura
- **Frontend**: React + Vite (static files `/public` da)
- **Backend**: Express.js serverless functions (`/api` da)
- **Database**: In-memory storage (production uchun PostgreSQL'ga o'tish mumkin)
- **Payments**: TON Wallet integration

### API Endpoints
- `GET /api/health` - Server holati
- `POST /api/telegram/auth` - Telegram autentifikatsiya
- `GET /api/users` - Foydalanuvchilar ro'yxati
- `POST /api/telegram/payment/create` - TON to'lov yaratish
- `POST /api/telegram/notification/bulk` - Bulk xabar yuborish

### Security Features
- CORS configuration for Telegram domains
- Request size limits (50mb)
- Error handling and logging
- Environment-based configuration

## 🐛 Xatolarni Tuzatish

### Bot ochilmayotgan bo'lsa:
1. Vercel URL'ning to'g'riligini tekshiring
2. `@BotFather` da URL'ni qayta kiring
3. HTTPS protokoli ishlatilganligiga ishonch hosil qiling

### TON to'lovlar ishlamayotgan bo'lsa:
1. TON Wallet address'ning to'g'riligini tekshiring
2. Vercel environment variables'ni qayta tekshiring
3. Network va wallet provider'ni tekshiring

### Server xatolari:
1. Vercel Functions logs'ni tekshiring
2. Environment variables'ni verify qiling
3. GitHub'ga yangi commit va redeploy qiling

## 📞 Yordam
Agar muammolar davom etsa, quyidagi ma'lumotlarni taqdim eting:
- Vercel deployment URL
- Error messages (Vercel logs'dan)
- Telegram bot username
- TON wallet address (xavfsizlik uchun oxirgi 4 ta belgini ko'rsating)