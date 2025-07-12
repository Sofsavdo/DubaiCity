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
      // Premium status va boshqa USD to'lovlari uchun soddalashtirilgan to'lov
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
        return `${Math.floor(currentMaxEnergy).toLocaleString('en-US').replace(/,/g, ' ')} → ${Math.floor(nextMaxEnergy).toLocaleString('en-US').replace(/,/g, ' ')} ⚡`;
      case 'tap_power':
        const currentTapPower = calculateTapPower(user);
        const nextTapPower = calculateTapPower({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}});
        return `${Math.floor(currentTapPower)} → ${Math.floor(nextTapPower)} 🪙`;
      case 'robot':
        return '6 soat oflayn daromad 🤖';
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
        // Check if this item is currently selected
        const isCurrentlySelected = 
          (item.type === 'avatar' && user.selectedAvatar === item.emoji) ||
          (item.type === 'vehicle' && user.selectedVehicle === item.emoji) ||
          (item.type === 'building' && user.selectedBuilding === item.emoji);
        
        if (isCurrentlySelected) {
          // Deselect current item
          const updateKey = item.type === 'avatar' ? 'selectedAvatar' : 
                           item.type === 'vehicle' ? 'selectedVehicle' : 'selectedBuilding';
          setUser(prev => ({ ...prev, [updateKey]: null }));
          notifier.addNotification(`${item.name} olib tashlandi!`, 'info');
        } else {
          // Select this item and deselect all other appearance items
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
        // Not purchased yet, purchase and auto-select for appearance items
        if (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') {
          const cost = Math.floor(item.basePrice * Math.pow(item.priceMultiplier || 1.5, 0));
          if (user.dubaiCoin >= cost) {
            setUser(prev => ({
              ...prev,
              dubaiCoin: prev.dubaiCoin - cost,
              itemLevels: { ...prev.itemLevels, [item.id]: 1 },
              // Auto-select after purchase and deselect other appearance items
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
    
    // Regular purchase for other items
    handlePurchase(item);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      {/* Header with stats */}
      <div className="p-4 flex-shrink-0">
        <motion.h1
          className="text-2xl font-bold text-white mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Markets
        </motion.h1>

        {/* Top stats row */}
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

        {/* Category tabs */}
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

      <div className="flex-grow overflow-y-auto px-2 pt-1 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                const isPurchased = item.type === 'robot' ? user.autoRobotLevel > 0 : 
                                  item.type === 'status' ? user.isPremium : 
                                  (item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building') ? currentLevel > 0 : false;
                const cost = calculateItemCost(item, currentLevel);
                const canAfford = item.usdPrice ? true : user.dubaiCoin >= cost; 
                
                // Calculate stats for display
                const currentIncome = calculateItemIncome(item, currentLevel, user);
                const nextIncome = calculateItemIncome(item, currentLevel + 1, user);
                const currentTapPower = item.type === 'tap_power' ? calculateTapPower(user) : 0;
                const nextTapPower = item.type === 'tap_power' ? calculateTapPower({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}}) : 0;
                
                // Ko'rinish elementlari uchun maxsus logika
                const isAppearanceItem = item.type === 'avatar' || item.type === 'vehicle' || item.type === 'building';
                const isSelected = isAppearanceItem && (
                  (item.type === 'avatar' && user.selectedAvatar === item.emoji) ||
                  (item.type === 'vehicle' && user.selectedVehicle === item.emoji) ||
                  (item.type === 'building' && user.selectedBuilding === item.emoji)
                );
                
                const isDisabled = isAppearanceItem ? false : (!canAfford || (isPurchased && item.type !== 'income' && item.type !== 'tap_power' && item.type !== 'energy_limit'));

                // Special layout for appearance items (avatars)
                if (isAppearanceItem) {
                  return (
                    <motion.div
                      key={item.id}
                      className={`bg-gray-800/90 rounded-xl p-3 relative cursor-pointer h-32 flex flex-col ${
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
                      {/* Top: Name */}
                      <div className="text-center mb-2">
                        <h3 className="text-white font-medium text-xs truncate">
                          {item.name}
                        </h3>
                      </div>

                      {/* Center: Large Avatar Image */}
                      <div className="flex-1 flex items-center justify-center mb-2">
                        <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-3xl">
                          {item.emoji || '👤'}
                        </div>
                      </div>

                      {/* Bottom: Price or Status */}
                      <div className="text-center">
                        {isPurchased ? (
                          isSelected ? (
                            <span className="text-green-400 font-bold text-xs">Tanlangan</span>
                          ) : (
                            <span className="text-green-400 font-bold text-xs">Sotib olingan</span>
                          )
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
                              <span className="text-black text-xs">🪙</span>
                            </div>
                            <span className="text-yellow-400 font-bold text-sm">
                              {item.usdPrice ? `$${item.usdPrice}` : formatNumberShort(Math.floor(cost))}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </motion.div>
                  );
                }

                // Regular layout for other items
                return (
                  <motion.div
                    key={item.id}
                    className={`bg-gray-800/90 rounded-xl p-3 relative cursor-pointer h-32 flex flex-col ${
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
                    {/* Top section: Icon, Name and Profit per hour */}
                    <div className="flex items-center mb-2 flex-1">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xl mr-2 flex-shrink-0">
                        {item.emoji || '🛠️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-xs leading-tight mb-1 truncate">
                          {item.name}
                        </h3>
                        {item.type === 'income' && (
                          <>
                            <p className="text-gray-400 text-xs mb-1">Profit per hour</p>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
                                <span className="text-black text-xs">🪙</span>
                              </div>
                              <span className="text-yellow-400 font-bold text-sm">
                                {formatNumberShort(Math.floor(nextIncome))}
                              </span>
                            </div>
                          </>
                        )}
                        {item.type === 'energy_limit' && (
                          <>
                            <p className="text-gray-400 text-xs mb-1">Energy +500</p>
                            <div className="flex items-center">
                              <span className="text-green-400 text-xs">⚡</span>
                              <span className="text-green-400 font-bold text-sm ml-1">
                                {formatNumberShort(calculateMaxEnergy(user))} → {formatNumberShort(calculateMaxEnergy({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}}))}
                              </span>
                            </div>
                          </>
                        )}
                        {item.type === 'tap_power' && (
                          <>
                            <p className="text-gray-400 text-xs mb-1">Tap +1</p>
                            <div className="flex items-center">
                              <span className="text-blue-400 text-xs">💪</span>
                              <span className="text-blue-400 font-bold text-sm ml-1">
                                {calculateTapPower(user)} → {calculateTapPower({...user, itemLevels: {...user.itemLevels, [item.id]: currentLevel + 1}})}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom section: Level and Price */}
                    <div className="flex justify-between items-center mt-auto">
                      {/* Level */}
                      <span className="text-white font-bold text-sm">
                        lvl {currentLevel}
                      </span>

                      {/* Price */}
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
                          <span className="text-black text-xs">🪙</span>
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">
                          {item.usdPrice ? `$${item.usdPrice}` : formatNumberShort(Math.floor(cost))}
                        </span>
                      </div>
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