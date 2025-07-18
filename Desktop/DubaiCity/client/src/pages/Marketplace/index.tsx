import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import initialData from '../../data/initialData'; 
import { formatNumberShort, formatNumberFull, calculateItemCost, calculateItemIncome, calculateTapPower, calculateMaxEnergy } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';
import { useNotifier } from '../../context/NotificationContext';

const Marketplace = ({ user, setUser, handleUpgradeItem, passiveIncome, openPaymentModal, openSimplePaymentModal, isTapBoostActive }) => {
  const marketItems = initialData.marketItems;
  const categories = useMemo(() => ['Shaxsiy', 'Biznes', 'Ko\'rinish', 'Premium'], []);
  const [activeCategory, setActiveCategory] = useState('Shaxsiy');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const notifier = useNotifier();

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
    }, 100);
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
      openSimplePaymentModal({
        name: item.name,
        usdPrice: item.usdPrice,
        description: item.type === 'status' ? 'Premium rejim: airdrop tayyorlash uchun +50% daromad bonus va maxsus imkoniyatlar' : 'Premium buyum'
      }, () => {
        if (item.type === 'status') {
          setUser(prev => ({
            ...prev,
            isPremium: true
          }));
          notifier.addNotification('Premium faollashtirildi! 👑', 'success', 3000);
        } else {
          setUser(prev => ({
            ...prev,
            itemLevels: { ...prev.itemLevels, [item.id]: 1 }
          }));
          notifier.addNotification(`${item.name} sotib olindi!`, 'success', 3000);
        }
      });
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
        return `${formatNumberShort(Math.floor(currentMaxEnergy))} → ${formatNumberShort(Math.floor(nextMaxEnergy))} ⚡`;
      case 'tap_power':
        const currentTapPower = calculateTapPower(user);
        const nextTapPower = calculateTapPower({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}});
        return `${Math.floor(currentTapPower)} → ${Math.floor(nextTapPower)} 🪙`;
      case 'robot':
        return user.hasAutoRobot ? 'Aktiv ✅' : '6 soat oflayn daromad 🤖';
      case 'status':
        return 'Premium rejim: airdrop tayyorlash 👑';
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
        const isCurrentlySelected = 
          (item.type === 'avatar' && user.selectedAvatar === item.emoji) ||
          (item.type === 'vehicle' && user.selectedVehicle === item.emoji) ||
          (item.type === 'building' && user.selectedBuilding === item.emoji);

        if (isCurrentlySelected) {
          const updateKey = item.type === 'avatar' ? 'selectedAvatar' : 
                           item.type === 'vehicle' ? 'selectedVehicle' : 'selectedBuilding';
          setUser(prev => ({ ...prev, [updateKey]: null }));
          notifier.addNotification(`${item.name} olib tashlandi!`, 'info');
        } else {
          setUser(prev => ({
            ...prev,
            selectedAvatar: item.type === 'avatar' ? item.emoji : null,
            selectedVehicle: item.type === 'vehicle' ? item.emoji : null,
            selectedBuilding: item.type === 'building' ? item.emoji : null
          }));
          notifier.addNotification(`${item.name} tanlandi!`, 'success');
        }

        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        return;
      } else {
        if (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') {
          const cost = Math.floor(item.basePrice * Math.pow(item.priceMultiplier || 1.5, 0));
          if (user.dubaiCoin >= cost) {
            setUser(prev => ({
              ...prev,
              dubaiCoin: prev.dubaiCoin - cost,
              itemLevels: { ...prev.itemLevels, [item.id]: 1 },
              selectedAvatar: item.type === 'avatar' ? item.emoji : null,
              selectedVehicle: item.type === 'vehicle' ? item.emoji : null,
              selectedBuilding: item.type === 'building' ? item.emoji : null
            }));
            notifier.addNotification(`${item.name} sotib olindi va tanlandi!`, 'success');
            return;
          }
        }
      }
    }

    handlePurchase(item);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      <div className="p-4 flex-shrink-0">
        <motion.h1
          className="text-2xl font-bold text-white mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Bozor
        </motion.h1>

        <div className="flex justify-between items-center mb-2 bg-gray-800/30 rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-gray-400">Tap +</p>
            <p className="text-yellow-400 font-bold">{Math.floor(calculateTapPower(user) * (isTapBoostActive ? 2 : 1) * (user.isPremium ? 1.5 : 1))}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Balans</p>
            <p className="text-white font-bold">{formatNumberFull(Math.floor(user.dubaiCoin))}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Soatlik</p>
            <p className="text-green-400 font-bold">+{Math.floor(passiveIncome || 0)}</p>
          </div>
        </div>

        <div className="flex bg-gray-800/30 rounded-lg p-1 mb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`flex-1 rounded-md py-2 px-3 font-medium transition-all duration-200 text-sm ${
                activeCategory === category 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pt-1 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
            className="grid grid-cols-2 gap-3 py-1"
            initial={{ opacity: isTransitioning ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {!isTransitioning && filteredItems.map((item, index) => {
                const currentLevel = user.itemLevels?.[item.id] || 0;
                const isPurchased = item.type === 'robot' ? user.hasAutoRobot : 
                                  item.type === 'status' ? user.isPremium : 
                                  (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') ? currentLevel > 0 : false;
                const cost = calculateItemCost(item, currentLevel);
                const canAfford = item.usdPrice ? true : user.dubaiCoin >= cost; 

                const isAppearanceItem = item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building';
                const isSelected = isAppearanceItem && (
                  (item.type === 'avatar' && user.selectedAvatar === item.emoji) ||
                  (item.type === 'vehicle' && user.selectedVehicle === item.emoji) ||
                  (item.type === 'building' && user.selectedBuilding === item.emoji)
                );

                const isDisabled = isAppearanceItem ? false : (!canAfford || (isPurchased && item.type !== 'income' && item.type !== 'tap_power' && item.type !== 'energy_limit'));

                return (
                  <motion.div
                    key={item.id}
                    className={`bg-gray-800/90 rounded-xl p-3 relative cursor-pointer aspect-square flex flex-col ${
                      isSelected ? 'ring-2 ring-green-400' : canAfford ? 'hover:bg-gray-700/90' : 'opacity-50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => handleItemSelect(item)}
                    whileHover={canAfford ? { scale: 1.02 } : {}}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-2xl mx-auto mb-2 flex-shrink-0">
                        {item.emoji || '🛠️'}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="px-1">
                          <h3 className="text-white font-semibold text-xs leading-tight mb-1 text-center break-words">
                            {item.id === '1' ? 'Energy ⬆️' : item.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2 text-center break-words">
                            {getItemDescription(item)}
                          </p>
                        </div>
                        <div className="mt-auto flex justify-between items-end px-1">
                          <div className="text-left">
                            <span className="text-white font-bold text-xs">
                              {item.type === 'robot' ? (user.hasAutoRobot ? '' : '') : `Lvl ${currentLevel}`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
                              <span className="text-black text-xs">🪙</span>
                            </div>
                            <span className="text-yellow-400 font-bold text-xs break-all">
                              {item.type === 'robot' && user.hasAutoRobot ? 'Aktiv' : 
                               item.usdPrice ? `$${item.usdPrice}` : formatNumberShort(Math.floor(cost))}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
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