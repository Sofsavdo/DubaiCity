// Premium Avatar System
export const PREMIUM_AVATARS = [
  {
    id: 1,
    name: "Golden CEO",
    level: 5,
    image: "🎩"
  },
  {
    id: 2,
    name: "Diamond Elite",
    level: 10,
    image: "💎"
  },
  {
    id: 3,
    name: "Platinum VIP",
    level: 15,
    image: "👑"
  },
  {
    id: 4,
    name: "Dubai Prince",
    level: 20,
    image: "🤴"
  },
  {
    id: 5,
    name: "Oil Baron",
    level: 25,
    image: "⛽"
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