
# Dubai City Bot - To'liq O'rnatish Qo'llanmasi

## 1. Telegram Bot Yaratish

1. Telegram'da @BotFather ni oching
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting: `Dubai City Bot`
4. Bot username kiriting: `DubaiCITY_robot` (yoki mavjud bo'lmagan boshqa nom)
5. Bot tokenini saqlab qo'ying

## 2. Environment Variables O'rnatish

Replit'da "Secrets" tab'ini oching va quyidagi kalitlarni qo'shing:

```
TELEGRAM_BOT_TOKEN=7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc
DATABASE_URL=sqlite:///dubai_city.db
NODE_ENV=production
VITE_API_URL=https://workspace.cinihaj942.repl.co
```

## 3. Bot Web App sozlash

1. @BotFather'da `/setdomain` buyrug'ini yuboring
2. Botingizni tanlang
3. Replit URL'ni kiriting: `https://workspace.cinihaj942.repl.co`

## 4. Bot Commands o'rnatish

@BotFather'da `/setcommands` buyrug'ini yuboring va quyidagilarni kiriting:

```
start - O'yinni boshlash
profile - Profilingizni ko'rish
help - Yordam
```

## 5. Bot Permissions

@BotFather'da quyidagi ruxsatlarni bering:
- `/setinline` - Inline rejimni yoqish
- `/setinlinefeedback` - Inline feedback
- `/setjoingroups` - Gruplarga qo'shilish
- `/setprivacy` - Privacy disable

## 6. Test qilish

1. Replit'da "Run" tugmasini bosing
2. Telegram'da botingizni toping
3. `/start` buyrug'ini yuboring
4. Web App ochilishini kutib turing

## Muammolarni Hal Qilish

### Bot ishlamayotgan bo'lsa:
- TELEGRAM_BOT_TOKEN to'g'ri kiritilganligini tekshiring
- Replit URL aktiv ekanligini tekshiring
- Console loglarni tekshiring

### Web App ochilmayotgan bo'lsa:
- BotFather'da domain to'g'ri o'rnatilganligini tekshiring
- HTTPS protokoli ishlatilganligini tekshiring
