# 🏙️ Dubai City Bot - Telegram Mini App

A comprehensive Dubai-themed city building game built as a Telegram Web App with complete bot integration.

## 🚀 Live Production Bot
- **Bot**: [@DubaiCITY_robot](https://t.me/DubaiCITY_robot)
- **Channel**: [Dubai City Live](https://t.me/DubaiCity_live)
- **Game**: Hamster Kombat-style tap-to-earn with Dubai theme

## ✨ Features

### 🎮 Game Features
- **Empire Building**: 14-level progression system (Beginner → Dubai King)
- **Tap-to-Earn**: Coin generation with energy system
- **Business Assets**: Restaurants, cafes, offices, and factories
- **Premium Skins**: Character and vehicle customization
- **Daily Rewards**: 12-day progressive reward system
- **Tasks System**: Social media engagement rewards

### 🤖 Telegram Integration
- **Real Bot**: @DubaiCITY_robot with Web App integration
- **Multi-language**: Uzbek, Russian, English support
- **Referral System**: 5000 coin bonus for referrer, 2000 for new user
- **Channel Integration**: https://t.me/DubaiCity_live promotion

### 💰 Payment System
- **TON Cryptocurrency**: Native Telegram payments
- **Premium Features**: Bot activation ($0.50), Premium status ($2.00)
- **Direct Purchases**: 1M coins for $1 equivalent

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **Shadcn/ui** components

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Telegram Bot API** integration
- **TON payment processing**

### Deployment
- **Vercel** serverless functions
- **GitHub** integration
- **PostgreSQL** database (Neon/Railway)
- **Environment-based configuration**

## 🚀 Deployment to Vercel

### Prerequisites
1. GitHub repository with this code
2. Vercel account connected to GitHub
3. PostgreSQL database (Neon Database recommended)

### Step 1: GitHub Setup
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Vercel auto-detects Node.js project

### Step 3: Environment Variables
Add these in Vercel Project Settings → Environment Variables:

```bash
# Production Bot Credentials
TELEGRAM_BOT_TOKEN=7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc
TON_WALLET_ADDRESS=UQCyQs9OCWvwYqwfcWE5rDkH0T9B4iJyp52_6Bv64_uNyVg6

# Database (PostgreSQL recommended)
DATABASE_URL=postgresql://username:password@host:5432/database

# Environment Configuration
NODE_ENV=production
PORT=5000
BOT_USERNAME=DubaiCITY_robot
CHANNEL_URL=https://t.me/DubaiCity_live
```

### Step 4: Deploy
- Vercel automatically builds and deploys
- Frontend: Static files served from `/dist/public`
- Backend: Serverless function at `/api/index.js`

## 📱 Testing the Deployment

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Bot Integration Test
1. Go to [@DubaiCITY_robot](https://t.me/DubaiCITY_robot)
2. Send `/start` command
3. Click "🎮 O'yinni boshlash" button
4. Should open your deployed Web App

### Referral System Test
1. Share referral link: `https://t.me/DubaiCITY_robot?start=YOUR_USER_ID`
2. New user should get 3000 coins (1000 base + 2000 referral)
3. Referrer should get 5000 coin bonus

## 🏗️ Development

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Database Management
```bash
npm run db:push  # Push schema changes
```

## 📁 Project Structure

```
├── client/src/          # React frontend
├── server/              # Express.js backend
├── shared/              # Shared types and schemas
├── api/                 # Vercel serverless functions
├── dist/                # Built files
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🎯 Key Features Implementation

### Referral System
- Unique codes: `DC` + last 6 digits of Telegram ID
- Automatic bonus distribution
- Real-time notifications
- Statistics tracking

### Payment Integration
- TON wallet integration
- Telegram native payments
- Direct coin purchases
- Premium feature unlocks

### Game Mechanics
- Energy system with refills
- Progressive empire levels
- Business income generation
- Task completion rewards

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  }
}
```

### Environment Setup
- Development: In-memory storage (MemStorage)
- Production: PostgreSQL database (DatabaseStorage)
- Automatic detection via `DATABASE_URL`

## 📞 Support

- **Bot**: [@DubaiCITY_robot](https://t.me/DubaiCITY_robot)
- **Channel**: [Dubai City Live](https://t.me/DubaiCity_live)
- **Documentation**: See `/VERCEL_DEPLOYMENT_FIX.md` for troubleshooting

## 🎮 Ready for Production!

The bot is fully configured with real credentials and ready for production use. All features including referral system, payments, and game mechanics are implemented and tested.

Deploy to Vercel and start building your Dubai empire! 🏙️