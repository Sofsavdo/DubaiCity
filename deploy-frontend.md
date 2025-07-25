
# Frontend Deployment Guide

## 1. Yangi Repl yarating
- Template: Node.js
- Nom: DubaiCity-Frontend

## 2. Client kodlarini ko'chiring
```bash
# client/ papkasidagi barcha fayllarni root ga ko'chiring
cp -r client/src ./src
cp client/index.html ./index.html
cp client/package.json ./package.json
```

## 3. Build qiling
```bash
npm install
npm run build
```

## 4. Static Deployment yarating
- Deployments tab ochib, Static ni tanlang
- Build command: `npm run build`
- Public directory: `dist`

## 5. Environment variables
```
VITE_API_URL=https://your-backend-repl.replit.app
VITE_TELEGRAM_BOT_TOKEN=7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc
```
