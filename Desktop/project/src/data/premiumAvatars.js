// Premium Avatar System
export const PREMIUM_AVATARS = [
  // Celebrities
  {
    id: 'celebrity_1',
    name: 'Hollywood Star',
    emoji: '🌟',
    category: 'Celebrity',
    basePrice: 50000,
    description: 'Exclusive Hollywood celebrity avatar',
    rarity: 'legendary',
    premiumMultiplier: 2.0
  },
  {
    id: 'celebrity_2',
    name: 'Pop Icon',
    emoji: '🎤',
    category: 'Celebrity',
    basePrice: 75000,
    description: 'World-famous pop star avatar',
    rarity: 'legendary',
    premiumMultiplier: 2.5
  },
  {
    id: 'celebrity_3',
    name: 'Sports Legend',
    emoji: '🏆',
    category: 'Celebrity',
    basePrice: 60000,
    description: 'Legendary sports champion avatar',
    rarity: 'legendary',
    premiumMultiplier: 2.2
  },

  // Luxury Cars
  {
    id: 'car_1',
    name: 'Golden Lamborghini',
    emoji: '🏎️',
    category: 'Luxury Car',
    basePrice: 100000,
    description: 'Exclusive golden Lamborghini',
    rarity: 'mythic',
    premiumMultiplier: 3.0
  },
  {
    id: 'car_2',
    name: 'Diamond Ferrari',
    emoji: '🚗',
    category: 'Luxury Car',
    basePrice: 120000,
    description: 'Diamond-encrusted Ferrari',
    rarity: 'mythic',
    premiumMultiplier: 3.5
  },
  {
    id: 'car_3',
    name: 'Platinum Bugatti',
    emoji: '🏁',
    category: 'Luxury Car',
    basePrice: 150000,
    description: 'Ultra-rare platinum Bugatti',
    rarity: 'mythic',
    premiumMultiplier: 4.0
  },

  // Dubai Sheikhs
  {
    id: 'sheikh_1',
    name: 'Dubai Sheikh',
    emoji: '👳‍♂️',
    category: 'Royalty',
    basePrice: 200000,
    description: 'Majestic Dubai Sheikh avatar',
    rarity: 'divine',
    premiumMultiplier: 5.0
  },
  {
    id: 'sheikh_2',
    name: 'Golden Sheikh',
    emoji: '🤴',
    category: 'Royalty',
    basePrice: 250000,
    description: 'Golden robed Sheikh avatar',
    rarity: 'divine',
    premiumMultiplier: 6.0
  },
  {
    id: 'sheikh_3',
    name: 'Royal Emir',
    emoji: '👑',
    category: 'Royalty',
    basePrice: 300000,
    description: 'Supreme Royal Emir avatar',
    rarity: 'divine',
    premiumMultiplier: 7.0
  },

  // International Royalty
  {
    id: 'royalty_1',
    name: 'European Queen',
    emoji: '👸',
    category: 'Royalty',
    basePrice: 180000,
    description: 'Elegant European Queen avatar',
    rarity: 'divine',
    premiumMultiplier: 4.5
  },
  {
    id: 'royalty_2',
    name: 'Ancient Pharaoh',
    emoji: '🏺',
    category: 'Royalty',
    basePrice: 220000,
    description: 'Mystical Ancient Pharaoh avatar',
    rarity: 'divine',
    premiumMultiplier: 5.5
  },
  {
    id: 'royalty_3',
    name: 'Imperial Emperor',
    emoji: '🐉',
    category: 'Royalty',
    basePrice: 280000,
    description: 'Mighty Imperial Emperor avatar',
    rarity: 'divine',
    premiumMultiplier: 6.5
  }
];

export const calculatePremiumAvatarPrice = (avatar, userPremiumLevel = 1) => {
  return Math.floor(avatar.basePrice * avatar.premiumMultiplier * userPremiumLevel);
};

export const RARITY_COLORS = {
  legendary: 'from-purple-500 to-pink-500',
  mythic: 'from-yellow-400 to-orange-500',
  divine: 'from-cyan-400 to-blue-600'
};