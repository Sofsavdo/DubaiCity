# 🚀 Dubai City Bot - Production Launch Guide

## Bot Information
- **Bot Username**: @DubaiCITY_robot
- **Bot Token**: `7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc`
- **Channel**: https://t.me/DubaiCity_live
- **TON Wallet**: `UQCyQs9OCWvwYqwfcWE5rDkH0T9B4iJyp52_6Bv64_uNyVg6`

## 🎯 Referral System Features

### User Registration
- New users get unique referral code: `DC + last 6 digits of Telegram ID`
- Starting bonus: 1000 coins
- If referred: +2000 extra coins (total 3000)

### Referral Rewards
- **Referrer**: +5000 coins per successful referral
- **New User**: +2000 welcome bonus
- **Real-time notifications**: Both users get immediate feedback
- **Statistics tracking**: Count of referrals in profile

### Bot Commands
- `/start` - Welcome message with Web App button
- `/start {user_id}` - Register with referral bonus
- `/profile` - Show user stats and referral info
- `/help` - Help information

## 🔧 Technical Implementation

### Referral Link Format
```
https://t.me/DubaiCITY_robot?start={referrer_user_id}
```

### Example Referral Flow
1. User A shares: `https://t.me/DubaiCITY_robot?start=123456`
2. User B clicks link and starts bot
3. User A gets +5000 coins notification
4. User B gets 3000 coins (1000 base + 2000 referral bonus)
5. Both users see updated statistics

### Database Integration
- **Development**: Uses MemStorage (in-memory)
- **Production**: Switches to DatabaseStorage with PostgreSQL
- **Automatic**: Detects `DATABASE_URL` environment variable

## 🌍 Multi-Language Support
- **Primary**: Uzbek (uz)
- **Secondary**: Russian (ru), English (en)
- **Auto-detection**: Based on Telegram user language

## 💰 Payment Features
- **TON Cryptocurrency**: Native Telegram payment system
- **Premium Status**: 2 TON for 30 days
- **Bot Activation**: 0.5 TON
- **Coin Purchases**: 1M coins for $1 equivalent

## 📊 Channel Integration
- All bot messages include channel link
- Cross-promotion between bot and channel
- Community building features

## 🚀 Deployment Instructions

### Environment Variables
```bash
TELEGRAM_BOT_TOKEN=7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc
TON_WALLET_ADDRESS=UQCyQs9OCWvwYqwfcWE5rDkH0T9B4iJyp52_6Bv64_uNyVg6
DATABASE_URL=postgresql://username:password@host:5432/database
NODE_ENV=production
PORT=5000
BOT_USERNAME=DubaiCITY_robot
CHANNEL_URL=https://t.me/DubaiCity_live
```

### Database Setup
1. Create PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Run `npm run db:push` to create tables
4. Bot automatically switches to database storage

### Testing Referral System
1. Go to: https://t.me/DubaiCITY_robot
2. Send `/start` command
3. Click "🎁 Taklif qilish" button
4. Share referral link with friends
5. Monitor statistics in profile

## ✅ Features Confirmed Working
- ✅ User registration via Telegram
- ✅ Referral code generation
- ✅ Bonus distribution system
- ✅ Real-time notifications
- ✅ Profile statistics
- ✅ Web App integration
- ✅ Channel promotion
- ✅ Multi-language support
- ✅ Payment system ready
- ✅ Database schema complete

## 🎮 Web App Features
- Complete game interface
- Balance synchronization
- Task completion system
- Marketplace functionality
- Asset management
- Team features
- Rating system

The bot is production-ready with full referral system implementation!