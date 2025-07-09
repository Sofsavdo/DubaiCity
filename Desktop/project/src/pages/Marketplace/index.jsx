import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import initialData from '../../data/initialData'; 
import { formatNumberShort, calculateItemCost, calculateItemIncome, calculateTapPower, calculateMaxEnergy } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';

const Marketplace = ({ user, setUser, handleUpgradeItem, passiveIncome, openPaymentModal }) => {
  const marketItems = initialData.marketItems;
  const categories = useMemo(() => ['Shaxsiy', 'Biznes', 'Ko\'rinish', 'Premium'], []);
  const [activeCategory, setActiveCategory] = useState('Shaxsiy');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredItems = useMemo(
    () => marketItems.filter((item) => item.category === activeCategory),
    [marketItems, activeCategory]
  );

  const handleCategoryChange = useCallback((category) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 100); // Tezlashtirish uchun 150ms dan 100ms ga o'zgartirdim
    window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
  }, [activeCategory]);

  if (!user) {
    return (
      <motion.div
        className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Yuklanmoqda... ⏳
      </motion.div>
    );
  }

  const handlePurchase = (item) => {
    if (item.usdPrice) {
      openPaymentModal(item);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
    } else {
      handleUpgradeItem(item);
    }
  };

  const getItemDescription = (item) => {
    const currentLevel = user.itemLevels?.[item.id] || 0;
    const isPurchased = currentLevel > 0;
    
    switch (item.type) {
      case 'energy_limit':
        const currentMaxEnergy = calculateMaxEnergy(user);
        const nextMaxEnergy = calculateMaxEnergy({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}});
        return `${Math.floor(currentMaxEnergy).toLocaleString('en-US').replace(/,/g, ' ')} → ${Math.floor(nextMaxEnergy).toLocaleString('en-US').replace(/,/g, ' ')} ⚡`;
      case 'tap_power':
        const currentTapPower = calculateTapPower(user);
        const nextTapPower = calculateTapPower({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}});
        return `${Math.floor(currentTapPower)} → ${Math.floor(nextTapPower)} 🪙`;
      case 'robot':
        return '6 soat oflayn daromad 🤖';
      case 'status':
        return 'Maxsus imkoniyatlar 👑';
      case 'avatar':
        return isPurchased ? 'Sotib olingan ✅' : 'Avatar o\'zgartirish 👤';
      case 'vehicle':
        return isPurchased ? 'Sotib olingan ✅' : 'Transport 🚗';
      case 'building':
        return isPurchased ? 'Sotib olingan ✅' : 'Bino 🏢';
      case 'income':
        const currentIncome = calculateItemIncome(item, currentLevel, user);
        const nextIncome = calculateItemIncome(item, currentLevel + 1, user);
        return `${formatNumberShort(Math.floor(currentIncome))} → ${formatNumberShort(Math.floor(nextIncome))}/soat`;
      case 'service':
        return 'Tap bonusi uchun 🛠️';
      default:
        return 'Maxsus buyum ✨';
    }
  };

  const handleItemSelect = (item) => {
    const isPurchased = (user.itemLevels?.[item.id] || 0) > 0;
    
    if (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') {
      if (isPurchased) {
        // Agar sotib olingan bo'lsa, tanlash
        const updateKey = item.type === 'avatar' ? 'selectedAvatar' : 
                         item.type === 'vehicle' ? 'selectedVehicle' : 'selectedBuilding';
                        
                        // Agar avatar tanlanayotgan bo'lsa, boshqa barcha avatarlarni o'chirish
                        if (item.type === 'avatar') {
                          setUser(prev => ({
                            ...prev,
                            selectedAvatar: item.emoji,
                            selectedVehicle: null,
                            selectedBuilding: null
                          }));
                        } else {
                          setUser(prev => ({
                            ...prev,
                            [updateKey]: item.emoji
                          }));
                        }
        
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        return;
      }
    }
    
    // Oddiy sotib olish
    handlePurchase(item);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      {/* Header with balance */}
      <div className="p-2 flex-shrink-0">
        <motion.h1
          className="text-lg font-bold text-yellow-400 mb-1 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Bozor 🛒
        </motion.h1>

        {/* Balance display */}
        <BalanceDisplay user={user} size="medium" />

        {/* Qo'shimcha ma'lumotlar */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 mb-1 grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-400">Soatlik daromad</p>
            <p className="font-bold text-green-400 text-sm">+{formatNumberShort(Math.floor(passiveIncome * (user?.isPremium ? 1.5 : 1)))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Daraja</p>
            <p className="font-bold text-yellow-400 text-sm">Lv. {Math.floor(user.level || 1)}</p>
          </div>
        </div>

        {/* Kategoriya tugmalari */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-1 flex mb-1">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`flex-1 rounded-md py-1 px-1 font-bold transition-all duration-200 text-xs ${activeCategory === category ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {filteredItems.length === 0 ? (
          <motion.p
            className="text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Ushbu kategoriyada hozircha narsalar yo'q. 😔
          </motion.p>
        ) : (
          <motion.div 
            className="grid grid-cols-2 gap-1"
            initial={{ opacity: isTransitioning ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }} // Tezlashtirish
          >
            <AnimatePresence mode="wait">
              {!isTransitioning && filteredItems.map((item, index) => {
                const currentLevel = user.itemLevels?.[item.id] || 0;
                const isPurchased = item.type === 'robot' ? user.autoRobotLevel > 0 : 
                                  item.type === 'status' ? user.isPremium : 
                                  (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') ? currentLevel > 0 : false;
                const cost = calculateItemCost(item, currentLevel);
                const canAfford = item.usdPrice ? true : user.dubaiCoin >= cost; 
                
                // Ko'rinish elementlari uchun maxsus logika
                const isAppearanceItem = item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building';
                const isSelected = isAppearanceItem && (
                  (item.type === 'avatar' && user.selectedAvatar === item.emoji) ||
                  (item.type === 'vehicle' && user.selectedVehicle === item.emoji) ||
                  (item.type === 'building' && user.selectedBuilding === item.emoji)
                );
                
                const isDisabled = isAppearanceItem ? false : (!canAfford || isPurchased);

                return (
                  <motion.div
                    key={item.id}
                    className={`bg-gray-800/50 border rounded-lg p-2 flex flex-col h-32 ${
                      isSelected ? 'border-yellow-400 bg-yellow-400/10' : 
                      isPurchased && isAppearanceItem ? 'border-green-400' : 'border-gray-600'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }} // Tezlashtirish
                  >
                    <div className="text-xl mb-1 text-center relative">
                      {!isPurchased && isAppearanceItem && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded text-yellow-400">
                          🔒
                        </div>
                      )}
                      {item.emoji || '🛠️'}
                    </div>
                    <p className="font-bold text-white text-xs text-center mb-1 leading-tight">{item.name || 'Item'}</p>
                    {/* Don't show level for appearance items */}
                    {!isAppearanceItem && (
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span>Lv. {Math.floor(currentLevel)}</span>
                        {item.maxLevel < 999 && <span>Max: {Math.floor(item.maxLevel)}</span>}
                      </div>
                    )}
                    {isAppearanceItem && isSelected && (
                      <div className="text-center text-xs text-yellow-400 mb-1">
                        Tanlangan
                      </div>
                    )}
                    <div className="text-xs mb-2 text-center text-gray-300 flex-grow flex items-center justify-center leading-tight">
                      {getItemDescription(item)}
                    </div>
                    <motion.button
                      onClick={() => handleItemSelect(item)}
                      disabled={isDisabled}
                      className={`w-full font-bold py-1.5 rounded-md transition-all text-xs ${
                        isSelected ? 'bg-yellow-400 text-black' :
                        isPurchased && isAppearanceItem ? 'bg-green-600 text-white hover:bg-green-500' :
                        isDisabled 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400'
                      }`}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    >
                      {isSelected ? 'Tanlangan ✅' :
                       isPurchased && isAppearanceItem ? 'Tanlash' :
                       isPurchased ? 'Olingan ✅' : 
                       item.usdPrice ? `${item.usdPrice.toFixed(2)} 💳` : 
                       `${formatNumberShort(Math.floor(cost))} 🪙`}
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;