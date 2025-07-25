// Kengaytirilgan level tizimi - 5B+ gacha
export const levelThresholds = [
  0,           // Level 1: 0
  1000,        // Level 2: 1K
  2500,        // Level 3: 2.5K
  5000,        // Level 4: 5K
  10000,       // Level 5: 10K
  25000,       // Level 6: 25K
  50000,       // Level 7: 50K
  100000,      // Level 8: 100K
  250000,      // Level 9: 250K
  500000,      // Level 10: 500K
  1000000,     // Level 11: 1M
  2500000,     // Level 12: 2.5M
  5000000,     // Level 13: 5M
  10000000,    // Level 14: 10M
];

export const levelNames = [
  'Amir',      // Level 1
  'Mansabdar', // Level 2
  'Vazir',     // Level 3
  'Shah',      // Level 4
  'Malik',     // Level 5
  'Sultan',    // Level 6
  'Padshah',   // Level 7
  'Imperator', // Level 8
  'Legendary', // Level 9
  'Immortal',  // Level 10
  'Divine',    // Level 11
  'Cosmic',    // Level 12
  'Universal', // Level 13
  'Omnipotent', // Level 14
];

export const ADMIN_WALLET_ADDRESS = '@YourTelegramWallet';

// Unique promo code generator
const generateUniquePromoCode = (partnerId: string, userId: string, existingCodes: string[] = []): string => {
  let code;
  let attempts = 0;
  do {
    const timestamp = Date.now().toString(36);
    const userHash = userId.toString(36);
    const partnerCode = partnerId.toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    code = `${partnerCode}-${userHash}-${timestamp}-${randomSuffix}`.toUpperCase();
    attempts++;
  } while (existingCodes.includes(code) && attempts < 10);

  return code;
};

// Turli xil promo kod generatorlari
const generatePromoCodeForPartner = (partnerId: string, userId: string, existingCodes: string[] = []) => {
  const partners = ['TEXNO', 'UZUM', 'OLCHA', 'MAKRO', 'KORZINKA', 'MEDIAPARK'];
  const randomPartner = partners[Math.floor(Math.random() * partners.length)];

  let code;
  let attempts = 0;
  do {
    const timestamp = Date.now().toString(36);
    const userHash = userId.toString(36);
    const partnerCode = randomPartner;
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    code = `${partnerCode}-${userHash}-${timestamp}-${randomSuffix}`.toUpperCase();
    attempts++;
  } while (existingCodes.includes(code) && attempts < 10);

  const partnerInfo = {
    'TEXNO': { name: 'TEXNOMART', description: 'Har qanday xarid uchun 100,000 so\'m chegirma.', link: 'https://texnomart.uz' },
    'UZUM': { name: 'UZUM MARKET', description: 'Birinchi xarid uchun 50,000 so\'m chegirma.', link: 'https://uzum.uz' },
    'OLCHA': { name: 'OLCHA.UZ', description: 'Elektronika uchun 75,000 so\'m chegirma.', link: 'https://olcha.uz' },
    'MAKRO': { name: 'MAKRO', description: 'Oziq-ovqat uchun 25,000 so\'m chegirma.', link: 'https://makro.uz' },
    'KORZINKA': { name: 'KORZINKA.UZ', description: 'Yetkazib berish bepul + 30,000 so\'m chegirma.', link: 'https://korzinka.uz' },
    'MEDIAPARK': { name: 'MEDIAPARK', description: 'Texnika uchun 120,000 so\'m chegirma.', link: 'https://mediapark.uz' }
  };

  return {
    code,
    partner: partnerInfo[randomPartner].name,
    description: partnerInfo[randomPartner].description,
    link: partnerInfo[randomPartner].link
  };
};

export { generatePromoCodeForPartner };

export const youtubeTasks = [
  {
    id: 1,
    title: 'Dubay O\'yini Haqida Video',
    url: 'https://youtube.com/watch?v=example1',
    rewardAmount: 1000,
    validCodes: ['DUBAI2025', 'CITYGAME'],
  },
  {
    id: 2,
    title: 'Strategiya Bo\'yicha Video',
    url: 'https://youtube.com/watch?v=example2',
    rewardAmount: 2000,
    validCodes: ['STRATEGY25', 'DUBAICITY'],
  },
];

export default {
  user: {
    id: 'user1',
    username: 'Foydalanuvchi',
    dubaiCoin: 5000000,
    energy: 2000,
    maxEnergy: 2000,
    totalEarned: 5000000,
    level: 9, // Buyuk Usta (9th level, 8th index)
    isPremium: true,
    premiumLevel: 3,
    hasAutoRobot: false,
    itemLevels: {
      '1': 5, // Energiya To'ldirish
      '2': 5, // Tap Kuchaytirish
      '5': 3, // Restoran Zanjiri
      '6': 2, // Mehmonxona Biznesi
      '10': 1, // Oltin Yaxta Skin
      '11': 1, // Neon Avatar
    },
    referrals: [],
    taskStatus: {},
    claimedYoutubeTasks: [],
    ownedPremiumAvatars: [],
    dailyLoginStreak: 0,
    lastDailyClaim: null,
    dailyAdWatches: 0,
    lastAdWatchTimestamp: null,
    tapsToday: 0,
    upgradesToday: 0,
    gamesPlayedToday: 0,
    dailyTapBoostsUsed: 0,
    lastTapBoostTimestamp: null,
    activeTapBoostEnd: null,
    profilePicture: '🧑‍🚀',
    profilePictureUrl: 'https://placehold.co/80x80/3b82f6/ffffff?text=DC',
    promoCodes: [],
    tradeHistory: [],
    selectedAvatar: '🏙️', // Joriy avatar
    selectedVehicle: null, // Joriy transport
    selectedBuilding: null, // Joriy bino
    dailyEnergyRefills: {}, // Kunlik energiya to'ldirish
    dailyBoosts: {}, // Kunlik boost
    lastOnlineTimestamp: Date.now(),
  },
  marketItems: [
    // Shaxsiy kategoriya
    {
      id: '1',
      name: 'Energiya Sig\'imini Oshirish',
      category: 'Shaxsiy',
      type: 'energy_limit',
      baseCost: 1000,
      maxLevel: 999,
      emoji: '⚡',
    },
    {
      id: '2',
      name: 'Tap Kuchaytirish',
      category: 'Shaxsiy',
      type: 'tap_power',
      baseCost: 1000,
      maxLevel: 999,
      emoji: '💪',
    },
    {
      id: '3',
      name: 'Auto Robot',
      category: 'Shaxsiy',
      type: 'robot',
      baseCost: 500000,
      maxLevel: 1,
      emoji: '🤖',
    },


    // Daromad kategoriyasi
    {
      id: '5',
      name: 'Restoran Zanjiri',
      category: 'Biznes',
      type: 'income',
      baseCost: 1000,
      baseIncome: 100,
      maxLevel: 999,
      emoji: '🍽️',
    },
    {
      id: '6',
      name: 'Mehmonxona Biznesi',
      category: 'Biznes',
      type: 'income',
      baseCost: 5000,
      baseIncome: 500,
      maxLevel: 999,
      emoji: '🏨',
    },
    {
      id: '7',
      name: 'Ko\'chmas Mulk',
      category: 'Biznes',
      type: 'income',
      baseCost: 10000,
      baseIncome: 1000,
      maxLevel: 999,
      emoji: '🏢',
    },
    {
      id: '8',
      name: 'Neft Kompaniyasi',
      category: 'Biznes',
      type: 'income',
      baseCost: 50000,
      baseIncome: 5000,
      maxLevel: 999,
      emoji: '🛢️',
    },
    {
      id: '9',
      name: 'Aviakompaniya',
      category: 'Biznes',
      type: 'income',
      baseCost: 100000,
      baseIncome: 10000,
      maxLevel: 999,
      emoji: '✈️',
    },

    // Ko'rinish kategoriyasi (soatlik daromadga ta'sir qiladi)

    // Premium kategoriyasi (soatlik daromadga ta'sir qiladi)
    {
      id: '10',
      name: 'Premium Status',
      category: 'Premium',
      type: 'status',
      usdPrice: 2.00,
      maxLevel: 1,
      emoji: '👑',
    },
    // Premium Avatars
    {
      id: 'premium_avatar_1',
      name: 'Hollywood Star',
      category: 'Premium',
      type: 'avatar',
      baseCost: 50000,
      maxLevel: 1,
      emoji: '🌟',
    },
    {
      id: 'premium_avatar_2',
      name: 'Pop Icon',
      category: 'Premium',
      type: 'avatar',
      baseCost: 75000,
      maxLevel: 1,
      emoji: '🎤',
    },
    {
      id: 'premium_avatar_3',
      name: 'Sports Legend',
      category: 'Premium',
      type: 'avatar',
      baseCost: 60000,
      maxLevel: 1,
      emoji: '🏆',
    },
    {
      id: 'premium_avatar_4',
      name: 'Golden Lamborghini',
      category: 'Premium',
      type: 'vehicle',
      baseCost: 100000,
      maxLevel: 1,
      emoji: '🏎️',
    },
    {
      id: 'premium_avatar_5',
      name: 'Diamond Ferrari',
      category: 'Premium',
      type: 'vehicle',
      baseCost: 120000,
      maxLevel: 1,
      emoji: '🚗',
    },
    {
      id: 'premium_avatar_6',
      name: 'Dubai Sheikh',
      category: 'Premium',
      type: 'avatar',
      baseCost: 200000,
      maxLevel: 1,
      emoji: '👳‍♂️',
    },
    {
      id: 'premium_avatar_7',
      name: 'Royal Emir',
      category: 'Premium',
      type: 'avatar',
      baseCost: 300000,
      maxLevel: 1,
      emoji: '👑',
    },
    {
      id: '11',
      name: 'Oltin Paket',
      category: 'Premium',
      type: 'income',
      baseCost: 20000,
      baseIncome: 1000,
      maxLevel: 999,
      emoji: '🏆',
    },
    {
      id: '12',
      name: 'Platina Pass',
      category: 'Premium',
      type: 'income',
      baseCost: 25000,
      baseIncome: 1500,
      maxLevel: 999,
      emoji: '🌟',
    },
    {
      id: '13',
      name: 'Elita Bonus',
      category: 'Premium',
      type: 'income',
      baseCost: 30000,
      baseIncome: 2000,
      maxLevel: 999,
      emoji: '💰',
    },

    // Ko'rinish kategoriyasi - Avatarlar
    {
      id: '14',
      name: 'Shayx Avatar',
      category: 'Ko\'rinish',
      type: 'avatar',
      baseCost: 50000,
      maxLevel: 1,
      emoji: '👳‍♂️',
      description: 'Dubai shayx avatari'
    },
    {
      id: '15',
      name: 'Malika Avatar',
      category: 'Ko\'rinish',
      type: 'avatar',
      baseCost: 75000,
      maxLevel: 1,
      emoji: '👸',
      description: 'Dubai malikasi avatari'
    },
    {
      id: '16',
      name: 'Amir Avatar',
      category: 'Ko\'rinish',
      type: 'avatar',
      baseCost: 100000,
      maxLevel: 1,
      emoji: '🤴',
      description: 'Dubai amiri avatari'
    },


  ],
  tasks: [
    {
      id: 1,
      title: 'Telegram Kanaliga Obuna',
      description: 'Bizning rasmiy Telegram kanalimizga obuna bo\'ling',
      url: 'https://t.me/yourchannel',
      reward: { type: 'coin', amount: 1000 },
      category: 'social',
      action: 'telegram_subscribe'
    },
    {
      id: 2,
      title: 'Instagram Sahifasini Kuzatish',
      description: 'Instagram sahifamizni kuzatib boring',
      url: 'https://instagram.com/yourpage',
      reward: { type: 'coin', amount: 800 },
      category: 'social',
      action: 'instagram_follow'
    },
    {
      id: 3,
      title: 'YouTube Kanalga Obuna',
      description: 'YouTube kanalimizga obuna bo\'ling',
      url: 'https://youtube.com/yourchannel',
      reward: { type: 'coin', amount: 1200 },
      category: 'social',
      action: 'youtube_subscribe'
    },
    {
      id: 4,
      title: 'Twitter\'da Kuzatish',
      description: 'Twitter sahifamizni kuzatib boring',
      url: 'https://twitter.com/yourpage',
      reward: { type: 'coin', amount: 700 },
      category: 'social',
      action: 'twitter_follow'
    },
    {
      id: 5,
      title: 'TikTok Sahifasini Kuzatish',
      description: 'TikTok sahifamizni kuzatib boring',
      url: 'https://tiktok.com/@yourpage',
      reward: { type: 'coin', amount: 900 },
      category: 'social',
      action: 'tiktok_follow'
    },
  ],
  dailyMissionTemplates: [
    {
      id: 1,
      type: 'tap',
      goal: 100,
      description: '100 marta bosing',
      reward: { type: 'coin', amount: 500 },
    },
    {
      id: 2,
      type: 'upgrade',
      goal: 3,
      description: '3 ta narsani yaxshilang',
      reward: { type: 'coin', amount: 1000 },
    },
    {
      id: 3,
      type: 'game',
      goal: 2,
      description: '2 ta o\'yin o\'ynang',
      reward: { type: 'energy', amount: 200 },
    },
    {
      id: 4,
      type: 'login',
      goal: 1,
      description: 'O\'yinga kiring',
      reward: { type: 'coin', amount: 300 },
    },
  ],
  dailyRewards: [
    { day: 1, reward: { type: 'coin', amount: 1000 } },
    { day: 2, reward: { type: 'coin', amount: 1500 } },
    { day: 3, reward: { type: 'coin', amount: 2000 } },
    { day: 4, reward: { type: 'coin', amount: 2500 } },
    { day: 5, reward: { type: 'coin', amount: 3000 } },
    { day: 6, reward: { type: 'coin', amount: 4000 } },
    { day: 7, reward: { type: 'coin', amount: 5000 } },
    { day: 8, reward: { type: 'coin', amount: 6000 } },
    { day: 9, reward: { type: 'coin', amount: 7000 } },
    { day: 10, reward: { type: 'coin', amount: 8000 } },
    { day: 11, reward: { type: 'coin', amount: 9000 } },
    { day: 12, reward: { type: 'coin', amount: 10000 } },
    { day: 13, reward: { type: 'coin', amount: 12000 } },
    { day: 14, reward: { type: 'coin', amount: 15000 } },
    { day: 15, reward: { type: 'coin', amount: 20000 } },
  ],
  companies: [],
  leaderboard: [
    {
      id: 1,
      name: 'Crypto Whale',
      telegramUsername: 'cryptowhale',
      dubaiCoin: 2158819,
      totalEarned: 2158819,
      level: 8,
      profilePictureUrl: 'https://placehold.co/64x64/1e40af/ffffff?text=CW'
    },
    {
      id: 2,
      name: 'Leonid Leo',
      telegramUsername: 'leonidleo',
      dubaiCoin: 1938961,
      totalEarned: 1938961,
      level: 7,
      profilePictureUrl: 'https://placehold.co/64x64/dc2626/ffffff?text=LL'
    },
    {
      id: 3,
      name: 'Makhsadovich',
      telegramUsername: 'makhsadovich',
      dubaiCoin: 1803082,
      totalEarned: 1803082,
      level: 7,
      profilePictureUrl: 'https://placehold.co/64x64/059669/ffffff?text=M'
    },
    {
      id: 4,
      name: 'Shahram Sh',
      telegramUsername: 'shahramsh',
      dubaiCoin: 1575175,
      totalEarned: 1575175,
      level: 7,
      profilePictureUrl: 'https://placehold.co/64x64/7c3aed/ffffff?text=SS'
    },
    {
      id: 5,
      name: 'Nikita Anufriev',
      telegramUsername: 'nikitaanufriev',
      dubaiCoin: 1544954,
      totalEarned: 1544954,
      level: 7,
      profilePictureUrl: 'https://placehold.co/64x64/ea580c/ffffff?text=NA'
    },
    {
      id: 6,
      name: 'Oleg Crypto',
      telegramUsername: 'olegcrypto',
      dubaiCoin: 1344235,
      totalEarned: 1344235,
      level: 7,
      profilePictureUrl: 'https://placehold.co/64x64/0891b2/ffffff?text=OC'
    },
    // Level 9 players (Buyuk Usta) - including sample players with user's level
    {
      id: 7,
      name: 'Elite Player',
      telegramUsername: 'eliteplayer',
      dubaiCoin: 8500000,
      totalEarned: 8500000,
      level: 9,
      profilePictureUrl: 'https://placehold.co/64x64/fbbf24/ffffff?text=EP'
    },
    {
      id: 8,
      name: 'Dubai Master',
      telegramUsername: 'dubaimaster',
      dubaiCoin: 7200000,
      totalEarned: 7200000,
      level: 9,
      profilePictureUrl: 'https://placehold.co/64x64/f59e0b/ffffff?text=DM'
    },
    {
      id: 9,
      name: 'Golden King',
      telegramUsername: 'goldenking',
      dubaiCoin: 6800000,
      totalEarned: 6800000,
      level: 9,
      profilePictureUrl: 'https://placehold.co/64x64/d97706/ffffff?text=GK'
    },
    {
      id: 10,
      name: 'Rich Trader',
      telegramUsername: 'richtrader',
      dubaiCoin: 5300000,
      totalEarned: 5300000,
      level: 9,
      profilePictureUrl: 'https://placehold.co/64x64/92400e/ffffff?text=RT'
    },
    // User will be added automatically by the leaderboard system with their exact 5,000,000 balance
    {
      id: 'user1',
      name: 'Foydalanuvchi',
      telegramUsername: 'dubaiuser',
      dubaiCoin: 5000000,
      totalEarned: 5000000,
      level: 9,
      profilePictureUrl: 'https://placehold.co/64x64/3b82f6/ffffff?text=DC'
    }
  ],
  donators: [],
  exchangeRate: 0.0001,
  availablePromoCodes: [],
  youtubeTasks: youtubeTasks,
  generateUniquePromoCode,
  generatePromoCodeForPartner,
};