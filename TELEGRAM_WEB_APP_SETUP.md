# Telegram Web App Setup Guide

## Completed Backend Setup

✅ **Telegram Bot Token**: Securely stored in environment variables
✅ **Bot Commands**: /start, /profile, /help implemented
✅ **Web App Authentication**: Secure data verification system
✅ **Auto User Registration**: Users automatically register via bot
✅ **Referral System**: Bonus rewards for referrals

## Bot Information
- **Bot Username**: @DubaiCITY_robot
- **Bot Token**: 7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc (stored securely)

## Available API Endpoints for Web App

### Authentication
```
POST /api/telegram/auth
Body: { "initData": "telegram_web_app_init_data" }
```

### User Data
```
GET /api/telegram/user/{telegramId}
```

## Frontend Integration Requirements

### 1. Telegram Web App SDK
Add to your frontend HTML:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

### 2. Authentication Flow
```javascript
// Get Telegram Web App data
const webApp = window.Telegram.WebApp;
const initData = webApp.initData;

// Authenticate with backend
const response = await fetch('/api/telegram/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ initData })
});

const result = await response.json();
if (result.success) {
  const user = result.data.user;
  const telegramUser = result.data.telegram;
  
  // Store user data for the session
  localStorage.setItem('gameUser', JSON.stringify(user));
  localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
}
```

### 3. Bot Commands Available
- `/start` - Welcome message with Web App button
- `/start {referral_code}` - Welcome with referral bonus
- `/profile` - Show user profile
- `/help` - Show help information

### 4. Web App Features
- **Secure Authentication**: Data verified using Telegram's signature
- **Auto Registration**: New users automatically created
- **Referral System**: Bonus coins for referrals
- **User Profile**: Complete game profile management

## Next Steps for Frontend

1. **Add Telegram Web App SDK** to your frontend
2. **Implement Authentication** using the provided API
3. **Test with Bot**: Use @DubaiCITY_robot to test Web App
4. **Update API URLs** in your frontend to use this backend

## Testing the Bot

1. Go to: https://t.me/DubaiCITY_robot
2. Send `/start` command
3. Click "🎮 O'yinni boshlash" button
4. Web App should open and authenticate automatically

## Current Backend URL
Your backend is running at: `https://your-replit-domain.replit.app`

## Security Features
- ✅ Telegram Web App data verification
- ✅ Secure token storage
- ✅ User authentication
- ✅ CORS enabled for all origins
- ✅ Error handling and logging