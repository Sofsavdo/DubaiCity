# 🏙️ Dubai City Bot - Telegram Mini App Game

## Project Overview
A comprehensive Dubai-themed city building game built as a Telegram Web App with complete bot integration. This is a Hamster Kombat-style tap-to-earn game with Dubai empire building mechanics.

## What This Project Does
- **Telegram Bot Game**: Complete mini-app game accessible through @DubaiCITY_robot
- **Empire Building**: 14-level progression system (Beginner → Dubai King)
- **Tap-to-Earn**: Coin generation with energy system and combo multipliers
- **Business Management**: Restaurants, cafes, offices, and factories investment system
- **Social Features**: Referral system, companies, leaderboards
- **Admin Panel**: Complete management dashboard for game operations
- **Payment System**: TON cryptocurrency integration for premium features

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Bot**: Telegram Bot API with Web App integration
- **Admin Panel**: Separate React app for game management

## Key Features
1. **Real Telegram Bot**: @DubaiCITY_robot with working Web App
2. **Multi-language Support**: Uzbek, Russian, English
3. **Referral System**: 5000 coin bonus for referrer, 2000 for new user
4. **Premium System**: Bot activation ($0.50), Premium status ($2.00)
5. **Daily Rewards**: 12-day progressive reward system
6. **Task System**: Social media engagement rewards
7. **Mini Games**: Scratch cards, casino slots, roulette
8. **Live Exchange**: Real-time currency conversion

## Current Status
- ✅ Fully functional game with all features working
- ✅ Real Telegram bot deployed and active
- ✅ Complete admin panel with analytics
- ✅ Payment system with TON integration
- ✅ Database with full schema and relationships
- ✅ Multi-environment support (dev/production)

## Tech Stack Details
- **React 18** with TypeScript and modern hooks
- **Framer Motion** for smooth animations
- **Shadcn/ui** component library
- **Express.js** RESTful API
- **PostgreSQL** with Drizzle ORM
- **Telegram Bot API** for bot functionality
- **TON Wallet** for cryptocurrency payments

## Development Commands
```bash
npm install              # Install all dependencies
npm run dev             # Start all services (client, server, admin)
npm run client:dev      # Start client only (port 3000)
npm run server:dev      # Start server only (port 5000)
npm run admin:dev       # Start admin panel (port 3001)
npm run build           # Build for production
npm run db:push         # Push database schema
```

## Environment Variables Needed
```bash
# Bot credentials (already configured)
TELEGRAM_BOT_TOKEN=7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc
BOT_USERNAME=DubaiCITY_robot
CHANNEL_URL=https://t.me/DubaiCity_live

# Database (auto-configured for Replit)
DATABASE_URL=postgresql://...

# Development settings
NODE_ENV=development
PORT=5000
```

## Project Structure
- `/client` - React game frontend
- `/server` - Express.js backend API
- `/admin-panel` - Admin dashboard
- `/shared` - Shared types and schemas
- `/attached_assets` - Static assets

## Ready for Agent Enhancement
This project is fully functional and ready for AI Agent improvements. The Agent can:
- Add new game features and mechanics
- Enhance UI/UX components
- Expand admin panel functionality
- Implement new mini-games
- Add more social features
- Optimize performance and database queries

The codebase is well-structured with TypeScript, proper component organization, and comprehensive documentation for easy Agent understanding and enhancement.