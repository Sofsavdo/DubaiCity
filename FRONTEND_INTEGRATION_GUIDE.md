# DubaiCity Frontend Integration Guide

## O'yin loyihangizni backend bilan bog'lash bo'yicha qo'llanma

### 1. Backend URL ni o'zgartirish

Sizning **DubaiCity_Frontend** loyihangizda API calls qilayotgan joylarni topib, URL ni o'zgartiring:

```javascript
// Eski kod (mahalliy server)
const API_BASE_URL = 'http://localhost:3000';

// Yangi kod (Replit backend)
const API_BASE_URL = 'https://your-replit-domain.replit.app';
```

### 2. API Client funksiyalarini yangilash

**DubaiCity_Frontend** loyihangizda API client yarating yoki mavjudini yangilang:

```javascript
// api.js yoki api.ts
class GameAPI {
  constructor() {
    this.baseURL = 'https://your-replit-domain.replit.app';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Foydalanuvchi ro'yxatdan o'tishi
  async registerUser(telegramId, username, firstName, lastName, language = 'uz') {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        telegramId,
        username,
        firstName,
        lastName,
        language,
      }),
    });
  }

  // Foydalanuvchi ma'lumotlarini olish
  async getUserProfile(telegramId) {
    return this.request(`/api/user/${telegramId}`);
  }

  // Topshiriqlarni olish
  async getUserTasks(telegramId) {
    return this.request(`/api/user/${telegramId}/tasks`);
  }

  // Topshiriqni bajarish
  async completeTask(telegramId, taskId) {
    return this.request(`/api/user/${telegramId}/tasks/${taskId}/complete`, {
      method: 'POST',
    });
  }

  // Skinlarni olish
  async getAvailableSkins() {
    return this.request('/api/skins');
  }

  // Skin sotib olish
  async purchaseSkin(telegramId, skinId) {
    return this.request(`/api/user/${telegramId}/skins/${skinId}/purchase`, {
      method: 'POST',
    });
  }

  // Bizneslarni olish
  async getAvailableBusinesses() {
    return this.request('/api/businesses');
  }

  // Biznes sotib olish
  async purchaseBusiness(telegramId, businessId) {
    return this.request(`/api/user/${telegramId}/businesses/${businessId}/purchase`, {
      method: 'POST',
    });
  }

  // Promo kod ishlatish
  async usePromoCode(telegramId, code) {
    return this.request(`/api/user/${telegramId}/promo/${code}`, {
      method: 'POST',
    });
  }

  // Empire levellarni olish
  async getEmpireLevels() {
    return this.request('/api/empire-levels');
  }
}

export const gameAPI = new GameAPI();
```

### 3. Telegram Bot Integration (agar kerak bo'lsa)

Agar sizda Telegram bot bo'lsa, uni ham yangilang:

```javascript
// bot.js
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
const API_BASE_URL = 'https://your-replit-domain.replit.app';

// /start komandasi
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id.toString();
  const username = msg.from.username;
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name;

  try {
    // Foydalanuvchini ro'yxatdan o'tkazish
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId,
        username,
        firstName,
        lastName,
        language: 'uz'
      })
    });

    const data = await response.json();

    if (data.success) {
      const user = data.data;
      bot.sendMessage(chatId, 
        `🎉 Xush kelibsiz, ${firstName}!\n\n` +
        `💰 Coinlaringiz: ${user.coins}\n` +
        `🏆 Darajangiz: ${user.empireLevel}\n` +
        `🔗 Taklif kodingiz: ${user.referralCode}\n\n` +
        `O'yinni boshlash uchun quyidagi tugmani bosing!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🎮 O\'yinni boshlash',
                  web_app: {
                    url: 'https://your-frontend-domain.replit.app'
                  }
                }
              ]
            ]
          }
        }
      );
    }
  } catch (error) {
    console.error('Error registering user:', error);
    bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
  }
});

// Profil ko'rish
bot.onText(/\/profile/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id.toString();

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${telegramId}`);
    const data = await response.json();

    if (data.success) {
      const user = data.data;
      bot.sendMessage(chatId,
        `👤 Sizning profilingiz:\n\n` +
        `📛 Ism: ${user.firstName} ${user.lastName}\n` +
        `💰 Coinlar: ${user.coins}\n` +
        `🏆 Daraja: ${user.empireLevel}\n` +
        `📊 Faol: ${user.isActive ? 'Ha' : 'Yo\'q'}\n` +
        `🔗 Taklif kodi: ${user.referralCode}`
      );
    }
  } catch (error) {
    bot.sendMessage(chatId, '❌ Profil ma\'lumotlarini olishda xatolik.');
  }
});
```

### 4. React/Vue/Angular komponentlarini yangilash

**React** misoli:

```jsx
// GameDashboard.jsx
import React, { useState, useEffect } from 'react';
import { gameAPI } from './api';

const GameDashboard = ({ telegramId }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [telegramId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Foydalanuvchi ma'lumotlarini olish
      const userResponse = await gameAPI.getUserProfile(telegramId);
      if (userResponse.success) {
        setUser(userResponse.data);
      }

      // Topshiriqlarni olish
      const tasksResponse = await gameAPI.getUserTasks(telegramId);
      if (tasksResponse.success) {
        setTasks(tasksResponse.data.available);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await gameAPI.completeTask(telegramId, taskId);
      if (response.success) {
        // Coin va foydalanuvchi ma'lumotlarini yangilash
        setUser(response.data.user);
        // Topshiriqlar ro'yxatini yangilash
        loadUserData();
        alert(`🎉 Topshiriq bajarildi! +${response.data.reward} coin`);
      }
    } catch (error) {
      alert('❌ Topshiriqni bajarishda xatolik');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-dashboard">
      <div className="user-info">
        <h2>Salom, {user?.firstName}!</h2>
        <p>💰 Coinlar: {user?.coins}</p>
        <p>🏆 Daraja: {user?.empireLevel}</p>
      </div>

      <div className="tasks-section">
        <h3>Mavjud topshiriqlar:</h3>
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h4>{task.titleUz || task.title}</h4>
            <p>{task.descriptionUz || task.description}</p>
            <p>💰 Mukofot: {task.reward} coin</p>
            <button 
              onClick={() => handleCompleteTask(task.id)}
              className="complete-task-btn"
            >
              Bajarish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;
```

### 5. Environment Variables

Frontend loyihangizda `.env` fayl yarating:

```env
# .env
REACT_APP_API_BASE_URL=https://your-replit-domain.replit.app
REACT_APP_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 6. CORS sozlamalari

Backend loyihangizda CORS ni sozlash kerak (men allaqachon qo'shganman):

```javascript
// server/index.ts (allaqachon qo'shilgan)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

## Kerakli o'zgarishlar:

### DubaiCity_Frontend loyihangizda:
1. **API URL** larni yangilang
2. **API client** funksiyalarini qo'shing
3. **Ma'lumotlar formatini** backend bilan moslashtiring
4. **Xato handling** ni qo'shing

### Replit Deploy:
1. **Backend** loyihani deploy qiling
2. **Frontend** loyihani alohida deploy qiling
3. **Environment variables** sozlang
4. **Domain** larni API ga qo'shing

## Test qilish:

```bash
# Backend test
curl https://your-replit-domain.replit.app/api/empire-levels

# Frontend test
# Browser Developer Tools da network tab orqali API calls ni ko'ring
```

Sizning **DubaiCity_Frontend** loyihangizga kirganingizda, men bilan yana bog'lanishingiz mumkin. Men sizga aniq kod o'zgarishlarini ko'rsatib beraman va loyihalarni to'g'ri bog'lashga yordam beraman!