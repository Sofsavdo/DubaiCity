export const formatNumberShort = (num) => {
  const rounded = Math.floor(num); // Barcha sonlarni butun songa aylantirish
  if (rounded >= 1e9) return Math.floor(rounded / 1e9) + 'B';
  if (rounded >= 1e6) return Math.floor(rounded / 1e6) + 'M';
  if (rounded >= 1e3) return Math.floor(rounded / 1e3) + 'K';
  return rounded.toString();
};

export const formatNumberFull = (num) => {
  return Math.floor(num).toLocaleString('fr-FR');
};

export const calculateItemIncome = (item, level, user) => {
  if (!item || level <= 0) return 0;
  const baseIncome = item.baseIncome || 0;
  const multiplier = user?.isPremium ? 1.5 : 1;
  
  // Ko'rinish kategoriyasidagi skinlar uchun maxsus logika
  if (item.category === 'Ko\'rinish') {
    // Skin sotib olingan bo'lsa, daromadga ta'sir qiladi
    return Math.floor(baseIncome * level * multiplier);
  }
  
  return Math.floor(baseIncome * level * multiplier);
};

export const calculateItemCost = (item, level) => {
  if (!item) return 0;
  const baseCost = item.baseCost || 1000;
  return Math.floor(baseCost * Math.pow(1.5, level));
};

export const calculateEnergyCost = (taps, user) => {
  return 1; // Har bir tap uchun 1 energiya
};

export const calculateTapPower = (user) => {
  const baseLevel = user?.level || 1;
  const tapUpgrades = user?.itemLevels?.['2'] || 0; // Tap Kuchaytirish item ID = 2
  
  return Math.floor(baseLevel + tapUpgrades);
};

export const calculateMaxEnergy = (user) => {
  const baseEnergy = 500;
  const levelBonus = Math.floor(((user?.level || 1) - 1) * 500);
  const energyUpgrades = Math.floor((user?.itemLevels?.['1'] || 0) * 500); // Energiya To'ldirish item ID = 1
  return Math.floor(baseEnergy + levelBonus + energyUpgrades);
};

export const getLevelProgress = (currentBalance, levelThresholds) => {
  if (!levelThresholds || levelThresholds.length === 0) {
    return { currentLevel: 1, progress: 0 };
  }
  
  let currentLevel = 1;
  for (let i = 0; i < levelThresholds.length; i++) {
    if (currentBalance >= levelThresholds[i]) {
      currentLevel = i + 2; // +2 chunki level 1'dan boshlanadi
    } else {
      break;
    }
  }
  
  const currentLevelThreshold = levelThresholds[currentLevel - 2] || 0;
  const nextLevelThreshold = levelThresholds[currentLevel - 1];
  
  if (!nextLevelThreshold) {
    return { currentLevel, progress: 100 };
  }
  
  const progressInLevel = currentBalance - currentLevelThreshold;
  const levelRange = nextLevelThreshold - currentLevelThreshold;
  const progress = Math.min((progressInLevel / levelRange) * 100, 100);
  
  return { currentLevel: Math.floor(currentLevel), progress };
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const calculateUpgradeConditions = (item, currentLevel, user) => {
  const conditions = item.upgradeConditions?.find(cond => cond.level === currentLevel + 1)?.condition || [];
  return Array.isArray(conditions) ? conditions : [conditions];
};