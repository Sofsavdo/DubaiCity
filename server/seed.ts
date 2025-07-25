
import { db } from './db';
import { users, tasks, skins, businesses, promoCodes, empireLevels, settings } from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Empire levels
    await db.insert(empireLevels).values([
      { level: 1, name: 'Beginner Explorer', requiredCoins: 0, nameUz: 'Boshlang\'ich tadqiqotchi', nameRu: 'Начинающий исследователь' },
      { level: 2, name: 'Street Merchant', requiredCoins: 10000, nameUz: 'Ko\'cha savdogari', nameRu: 'Уличный торговец' },
      { level: 3, name: 'Business Owner', requiredCoins: 50000, nameUz: 'Biznes egasi', nameRu: 'Владелец бизнеса' },
      { level: 4, name: 'Local Entrepreneur', requiredCoins: 150000, nameUz: 'Mahalliy tadbirkor', nameRu: 'Местный предприниматель' },
      { level: 5, name: 'District Manager', requiredCoins: 500000, nameUz: 'Tuman menejeri', nameRu: 'Районный менеджер' },
      { level: 6, name: 'City Investor', requiredCoins: 1000000, nameUz: 'Shahar investori', nameRu: 'Городской инвестор' },
      { level: 7, name: 'Regional Director', requiredCoins: 2500000, nameUz: 'Mintaqaviy direktor', nameRu: 'Региональный директор' },
      { level: 8, name: 'Dubai Resident', requiredCoins: 5000000, nameUz: 'Dubay rezidenti', nameRu: 'Резидент Дубая' },
      { level: 9, name: 'Emirates Elite', requiredCoins: 10000000, nameUz: 'Emiratlar elitasi', nameRu: 'Элита эмиратов' },
      { level: 10, name: 'Burj Khalifa VIP', requiredCoins: 25000000, nameUz: 'Burj Khalifa VIP', nameRu: 'Burj Khalifa VIP' },
      { level: 11, name: 'Palm Island Owner', requiredCoins: 50000000, nameUz: 'Palm Island egasi', nameRu: 'Владелец Palm Island' },
      { level: 12, name: 'Gold Souk Tycoon', requiredCoins: 100000000, nameUz: 'Gold Souk magnati', nameRu: 'Магнат Gold Souk' },
      { level: 13, name: 'Dubai Royalty', requiredCoins: 250000000, nameUz: 'Dubay qirolligi', nameRu: 'Королевская семья Дубая' },
      { level: 14, name: 'Dubai King', requiredCoins: 500000000, nameUz: 'Dubay shohi', nameRu: 'Король Дубая' },
    ]).onConflictDoNothing();

    // Sample tasks
    await db.insert(tasks).values([
      {
        title: 'Subscribe to our Telegram channel',
        titleUz: 'Telegram kanalimizga obuna bo\'ling',
        titleRu: 'Подпишитесь на наш Telegram канал',
        description: 'Join our official channel for latest updates',
        type: 'telegram',
        requirement: 'https://t.me/DubaiCity_live',
        reward: 5000,
        order: 1,
        isActive: true,
      },
      {
        title: 'Follow us on YouTube',
        titleUz: 'YouTube\'da bizni kuzatib boring',
        titleRu: 'Подпишитесь на нас в YouTube',
        description: 'Subscribe to our YouTube channel',
        type: 'youtube',
        requirement: 'https://youtube.com/@DubaiCity',
        reward: 3000,
        order: 2,
        isActive: true,
      },
      {
        title: 'Share with friends',
        titleUz: 'Do\'stlaringiz bilan bo\'lishing',
        titleRu: 'Поделитесь с друзьями',
        description: 'Invite 5 friends to join the game',
        type: 'referral',
        requirement: '5',
        reward: 10000,
        order: 3,
        isActive: true,
      },
    ]).onConflictDoNothing();

    // Sample skins
    await db.insert(skins).values([
      {
        name: 'Classic Avatar',
        nameUz: 'Klassik avatar',
        nameRu: 'Классический аватар',
        description: 'Default character appearance',
        imageUrl: '/images/skins/classic.png',
        price: 0,
        rarity: 'common',
        isActive: true,
      },
      {
        name: 'Business Suit',
        nameUz: 'Biznes kostyumi',
        nameRu: 'Деловой костюм',
        description: 'Professional business appearance',
        imageUrl: '/images/skins/business.png',
        price: 50000,
        rarity: 'rare',
        isActive: true,
      },
      {
        name: 'Dubai Sheikh',
        nameUz: 'Dubay shaykhi',
        nameRu: 'Дубайский шейх',
        description: 'Royal Dubai appearance',
        imageUrl: '/images/skins/sheikh.png',
        price: 500000,
        rarity: 'legendary',
        isActive: true,
      },
    ]).onConflictDoNothing();

    // Sample businesses
    await db.insert(businesses).values([
      {
        name: 'Small Cafe',
        nameUz: 'Kichik kafe',
        nameRu: 'Небольшое кафе',
        description: 'A cozy neighborhood cafe',
        price: 25000,
        income: 50,
        requiredLevel: 1,
        imageUrl: '/images/businesses/cafe.png',
        category: 'restaurant',
        isActive: true,
      },
      {
        name: 'Tech Startup',
        nameUz: 'Tech startap',
        nameRu: 'Технологический стартап',
        description: 'Innovative technology company',
        price: 100000,
        income: 250,
        requiredLevel: 3,
        imageUrl: '/images/businesses/tech.png',
        category: 'technology',
        isActive: true,
      },
      {
        name: 'Gold Trading',
        nameUz: 'Oltin savdosi',
        nameRu: 'Торговля золотом',
        description: 'Luxury gold trading business',
        price: 1000000,
        income: 2500,
        requiredLevel: 8,
        imageUrl: '/images/businesses/gold.png',
        category: 'luxury',
        isActive: true,
      },
    ]).onConflictDoNothing();

    // Sample promo codes
    await db.insert(promoCodes).values([
      {
        code: 'WELCOME2024',
        title: 'Welcome Bonus',
        titleUz: 'Xush kelibsiz bonusi',
        titleRu: 'Приветственный бонус',
        description: 'Welcome bonus for new players',
        reward: 10000,
        usageLimit: 1000,
        usedCount: 0,
        isActive: true,
      },
      {
        code: 'DUBAI100K',
        title: 'Dubai Special',
        titleUz: 'Dubay maxsus',
        titleRu: 'Дубай специальный',
        description: 'Special Dubai promotion',
        reward: 100000,
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
      },
    ]).onConflictDoNothing();

    // Game settings
    await db.insert(settings).values([
      { key: 'COINS_PER_TAP', value: '1' },
      { key: 'MAX_ENERGY', value: '1000' },
      { key: 'ENERGY_REFILL_RATE', value: '1' },
      { key: 'REFERRAL_BONUS', value: '5000' },
      { key: 'DAILY_REWARD_MULTIPLIER', value: '1.5' },
      { key: 'MAINTENANCE_MODE', value: 'false' },
      { key: 'MIN_WITHDRAWAL', value: '100000' },
      { key: 'GAME_VERSION', value: '1.0.0' },
    ]).onConflictDoNothing();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };
