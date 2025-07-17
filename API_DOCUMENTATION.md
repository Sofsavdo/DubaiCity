# Dubai City Bot API Documentation

## Base URL
```
https://your-replit-domain.replit.app
```

## Authentication
Most endpoints don't require authentication, but admin endpoints should be protected in production.

## Frontend Game API Endpoints

### 1. User Registration/Login
```http
POST /api/auth/register
Content-Type: application/json

{
  "telegramId": "123456789",
  "username": "user123",
  "firstName": "John",
  "lastName": "Doe",
  "referralCode": "REF123", // optional
  "language": "en" // optional, defaults to "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "telegramId": "123456789",
    "username": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "coins": 0,
    "empireLevel": 1,
    "referralCode": "abc123",
    "isActive": true,
    "createdAt": "2025-01-11T22:41:00.000Z"
  }
}
```

### 2. Get User Profile
```http
GET /api/user/{telegramId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "telegramId": "123456789",
    "username": "user123",
    "coins": 1500,
    "empireLevel": 2,
    "referralCode": "abc123",
    "isActive": true
  }
}
```

### 3. Update User Profile
```http
PUT /api/user/{telegramId}
Content-Type: application/json

{
  "coins": 2000,
  "empireLevel": 3,
  "profileImage": "https://example.com/image.jpg"
}
```

### 4. Get Available Tasks
```http
GET /api/user/{telegramId}/tasks
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": [
      {
        "id": 1,
        "title": "Follow our Telegram channel",
        "titleUz": "Telegram kanalimizga obuna bo'ling",
        "description": "Follow our official Telegram channel",
        "type": "telegram",
        "url": "https://t.me/dubaicitybot",
        "reward": 500,
        "isActive": true
      }
    ],
    "completed": [
      {
        "id": 1,
        "userId": 1,
        "taskId": 2,
        "completedAt": "2025-01-11T22:41:00.000Z",
        "rewardClaimed": true
      }
    ]
  }
}
```

### 5. Complete Task
```http
POST /api/user/{telegramId}/tasks/{taskId}/complete
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userTask": {
      "id": 1,
      "userId": 1,
      "taskId": 1,
      "completedAt": "2025-01-11T22:41:00.000Z",
      "rewardClaimed": false
    },
    "user": {
      "id": 1,
      "coins": 2000,
      "empireLevel": 2
    },
    "reward": 500
  }
}
```

### 6. Get Available Skins
```http
GET /api/skins
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Golden Suit",
      "nameUz": "Oltin kostyum",
      "description": "Premium golden business suit",
      "price": 1000,
      "rarity": "legendary",
      "imageUrl": "https://example.com/golden-suit.jpg",
      "category": "character",
      "isActive": true
    }
  ]
}
```

### 7. Get User Skins
```http
GET /api/user/{telegramId}/skins
```

### 8. Purchase Skin
```http
POST /api/user/{telegramId}/skins/{skinId}/purchase
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userSkin": {
      "id": 1,
      "userId": 1,
      "skinId": 1,
      "purchasedAt": "2025-01-11T22:41:00.000Z",
      "isEquipped": false
    },
    "user": {
      "coins": 500
    },
    "cost": 1000
  }
}
```

### 9. Get Available Businesses
```http
GET /api/businesses
```

### 10. Get User Businesses
```http
GET /api/user/{telegramId}/businesses
```

### 11. Purchase Business
```http
POST /api/user/{telegramId}/businesses/{businessId}/purchase
```

### 12. Use Promo Code
```http
POST /api/user/{telegramId}/promo/{code}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usage": {
      "id": 1,
      "userId": 1,
      "promoCodeId": 1,
      "usedAt": "2025-01-11T22:41:00.000Z"
    },
    "user": {
      "coins": 3000
    },
    "reward": 1000
  }
}
```

### 13. Get Empire Levels
```http
GET /api/empire-levels
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "level": 1,
      "name": "Beginner",
      "nameUz": "Yangi boshlovchi",
      "nameRu": "Начинающий",
      "requiredCoins": 0,
      "hourlyIncome": 10,
      "description": "Level 1 - Beginner",
      "icon": "level_1"
    },
    {
      "id": 2,
      "level": 2,
      "name": "Entrepreneur",
      "nameUz": "Tadbirkor",
      "nameRu": "Предприниматель",
      "requiredCoins": 1000,
      "hourlyIncome": 25,
      "description": "Level 2 - Entrepreneur",
      "icon": "level_2"
    }
  ]
}
```

## Error Responses

All API endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Frontend Integration Examples

### JavaScript/React Example
```javascript
// User registration
const registerUser = async (telegramId, username, firstName) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telegramId,
      username,
      firstName,
      language: 'uz' // or 'en', 'ru'
    })
  });
  
  const data = await response.json();
  return data;
};

// Complete task
const completeTask = async (telegramId, taskId) => {
  const response = await fetch(`/api/user/${telegramId}/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  return data;
};

// Get user profile
const getUserProfile = async (telegramId) => {
  const response = await fetch(`/api/user/${telegramId}`);
  const data = await response.json();
  return data;
};
```

### Telegram Bot Integration
```javascript
// Example for Node.js Telegram Bot
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id.toString();
  const username = msg.from.username;
  const firstName = msg.from.first_name;
  
  // Register user
  const response = await fetch('https://your-replit-domain.replit.app/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telegramId,
      username,
      firstName,
      language: 'uz'
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    bot.sendMessage(chatId, `Welcome! You have ${data.data.coins} coins and you're level ${data.data.empireLevel}`);
  }
});
```

## Admin Panel API

All admin endpoints are prefixed with `/api/admin/` and should be protected with authentication in production.

### Get Statistics
```http
GET /api/admin/stats
```

### Manage Users
```http
GET /api/admin/users?page=1&limit=50
POST /api/admin/users
PUT /api/admin/users/{id}
```

### Manage Tasks
```http
GET /api/admin/tasks
POST /api/admin/tasks
PUT /api/admin/tasks/{id}
DELETE /api/admin/tasks/{id}
```

### Manage Skins
```http
GET /api/admin/skins
POST /api/admin/skins
PUT /api/admin/skins/{id}
DELETE /api/admin/skins/{id}
```

### Manage Businesses
```http
GET /api/admin/businesses
POST /api/admin/businesses
PUT /api/admin/businesses/{id}
DELETE /api/admin/businesses/{id}
```

### Manage Promo Codes
```http
GET /api/admin/promocodes
POST /api/admin/promocodes
PUT /api/admin/promocodes/{id}
DELETE /api/admin/promocodes/{id}
```

### Manage Notifications
```http
GET /api/admin/notifications
POST /api/admin/notifications
PUT /api/admin/notifications/{id}
DELETE /api/admin/notifications/{id}
```

### Manage Teams
```http
GET /api/admin/teams
POST /api/admin/teams
PUT /api/admin/teams/{id}
DELETE /api/admin/teams/{id}
GET /api/admin/teams/{id}/members
```

### Manage Projects
```http
GET /api/admin/projects
POST /api/admin/projects
PUT /api/admin/projects/{id}
DELETE /api/admin/projects/{id}
```

### Manage Settings
```http
GET /api/admin/settings
PUT /api/admin/settings/{key}
```