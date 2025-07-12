import initialData from '../data/initialData';

const loadGameData = async () => {
  let data = JSON.parse(localStorage.getItem('dubaiCityGameData_v17')) || initialData;
  const now = Date.now();
  const lastOnline = data.user.lastOnlineTimestamp || now;
  const offlineTimeInSeconds = Math.min((now - lastOnline) / 1000, 6 * 3600); // Maks 6 soat
  let offlineEarnings = 0;

  // Faqat robot faol bo'lsa offline daromad beradi
  if (data.user.autoRobotLevel > 0 && offlineTimeInSeconds > 60) { // Kamida 1 daqiqa offline bo'lgan bo'lsa
    // Barcha income itemlardan passiv daromadni hisoblash
    let totalPassiveIncome = 0;
    for (const itemId in data.user.itemLevels || {}) {
      const level = data.user.itemLevels[itemId];
      const item = data.marketItems.find((i) => i.id.toString() === itemId.toString());
      if (item && item.type === 'income' && level > 0) {
        const baseIncome = item.baseIncome || 0;
        const multiplier = data.user.isPremium ? 1.5 : 1;
        totalPassiveIncome += baseIncome * level * multiplier;
      }
    }
    
    // Soatlik daromadni sekundga o'girish va offline vaqtga ko'paytirish
    offlineEarnings = Math.floor((totalPassiveIncome / 3600) * offlineTimeInSeconds);
  }

  return {
    ...data,
    user: {
      ...data.user,
      lastOnlineTimestamp: now,
    },
    offlineEarningsToClaim: offlineEarnings,
  };
};

const saveGameData = (data) => {
  localStorage.setItem('dubaiCityGameData_v17', JSON.stringify(data));
};

export const gameService = {
  loadGameData,
  saveGameData
};

// Keep the original export for backward compatibility
export const loadDataAndCalculateOffline = loadGameData;