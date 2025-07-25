export const GAME_CONFIG = {
  // Energy system
  ENERGY_REFILL_RATE: 1, // 1 energy per minute
  MAX_ENERGY_DEFAULT: 1000,
  ENERGY_PER_TAP: 1,
  
  // Coins
  COINS_PER_TAP_DEFAULT: 1,
  BONUS_MULTIPLIER_PREMIUM: 2,
  
  // Referral system
  REFERRAL_BONUS_REFERRER: 5000,
  REFERRAL_BONUS_NEW_USER: 2000,
  BASE_COINS_NEW_USER: 1000,
  
  // Level system
  MAX_LEVEL: 14,
  XP_PER_TAP: 1,
  
  // Business system
  BUSINESS_UPGRADE_MULTIPLIER: 2,
  BUSINESS_INCOME_INTERVAL: 60000, // 1 minute in milliseconds
  
  // Daily rewards
  DAILY_REWARD_DAYS: 12,
  DAILY_REWARD_RESET_HOUR: 0, // UTC
  
  // Animation durations
  COIN_ANIMATION_DURATION: 1000,
  TAP_ANIMATION_DURATION: 200,
  LEVEL_UP_ANIMATION_DURATION: 3000,
  
  // API endpoints
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://dubai-city-lilac.vercel.app/api'
    : '/api',
};

export const TELEGRAM_CONFIG = {
  BOT_USERNAME: 'DubaiCITY_robot',
  CHANNEL_URL: 'https://t.me/DubaiCity_live',
  WEBAPP_URL: process.env.NODE_ENV === 'production'
    ? 'https://dubai-city-lilac.vercel.app'
    : 'http://localhost:5000',
};

export const THEME_COLORS = {
  dubai: {
    gold: '#FFD700',
    blue: '#1E40AF',
    red: '#DC2626',
    dark: '#0F172A',
    card: '#1E293B',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #FFD700, #FFA500)',
    blue: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
    dark: 'linear-gradient(135deg, #0F172A, #1E293B)',
  },
};

export const SOUND_URLS = {
  tap: '/sounds/tap.mp3',
  coin: '/sounds/coin.mp3',
  levelUp: '/sounds/level-up.mp3',
  purchase: '/sounds/purchase.mp3',
  error: '/sounds/error.mp3',
  notification: '/sounds/notification.mp3',
  achievement: '/sounds/achievement.mp3',
};

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: '🇬🇧 English', nativeLabel: 'English' },
  { code: 'ru', label: '🇷🇺 Русский', nativeLabel: 'Русский' },
  { code: 'uz', label: '🇺🇿 O\'zbek', nativeLabel: 'O\'zbek' },
];

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/DubaiCity_live',
  support: 'https://t.me/DubaiCITY_robot',
  website: 'https://dubai-city-lilac.vercel.app',
};

export const PAYMENT_CONFIG = {
  TON_WALLET: 'UQCyQs9OCWvwYqwfcWE5rDkH0T9B4iJyp52_6Bv64_uNyVg6',
  CURRENCY: 'TON',
  MIN_PAYMENT: 0.5,
  PACKAGES: {
    premium: { price: 2.00, coins: 0, benefits: ['2x multiplier', 'exclusive skins'] },
    coins_1m: { price: 1.00, coins: 1000000, benefits: ['instant delivery'] },
    energy_boost: { price: 0.50, coins: 0, benefits: ['+500 max energy'] },
    activation: { price: 0.50, coins: 0, benefits: ['unlock all features'] },
  },
};

export const ACHIEVEMENT_TYPES = {
  FIRST_TAP: 'first_tap',
  COINS_MILESTONE: 'coins_milestone',
  LEVEL_MILESTONE: 'level_milestone',
  REFERRAL_MILESTONE: 'referral_milestone',
  BUSINESS_MILESTONE: 'business_milestone',
  DAILY_STREAK: 'daily_streak',
  PREMIUM_USER: 'premium_user',
};

export const LOCAL_STORAGE_KEYS = {
  SOUND_ENABLED: 'dubai-sound',
  VIBRATION_ENABLED: 'dubai-vibration',
  THEME: 'dubai-theme',
  LANGUAGE: 'dubai-language',
  TUTORIAL_COMPLETED: 'dubai-tutorial',
  LAST_ACTIVE: 'dubai-last-active',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  INSUFFICIENT_ENERGY: 'Not enough energy to perform this action.',
  INSUFFICIENT_COINS: 'Not enough coins for this purchase.',
  USER_NOT_FOUND: 'User account not found. Please restart the game.',
  INVALID_PAYMENT: 'Payment verification failed. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
};

export const SUCCESS_MESSAGES = {
  LEVEL_UP: 'Congratulations! You reached a new level!',
  PURCHASE_SUCCESS: 'Purchase completed successfully!',
  REWARD_CLAIMED: 'Reward claimed successfully!',
  REFERRAL_SUCCESS: 'Friend invited successfully!',
  TASK_COMPLETED: 'Task completed! Reward earned.',
};
