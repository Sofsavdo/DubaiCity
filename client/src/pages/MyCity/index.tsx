import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumberShort, formatNumberFull, getLevelProgress, calculateEnergyCost, calculateTapPower, calculateMaxEnergy } from '../../utils/helpers';
import TopInfoPanel from './TopInfoPanel';
import BalanceDisplay from '../../components/Common/BalanceDisplay';
import LevelModal from '../../components/Common/LevelModal';

import { CoinIcon } from '../../components/Icons';

const MyCity = ({
  user,
  setUser,
  passiveIncome,
  levelNames,
  levelThresholds,
  offlineEarningsToClaim,
  handleClaimOfflineEarnings,
  handleActivateTapBoost,
  isTapBoostActive,
  leaderboard = [],
}) => {
  const [taps, setTaps] = useState([]);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [particleEffects, setParticleEffects] = useState([]);
  const tapAreaRef = useRef(null);

  if (!user || !levelThresholds || !levelNames) {
    return (
      <motion.div
        className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className="w-16 h-16 border-4 border-t-amber-400 border-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.p
            className="text-lg font-medium bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Imperium yuklanmoqda...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Progress calculations with permanent level system
  const { currentLevel, progress, levelIncreased } = getLevelProgress(user.dubaiCoin || 0, levelThresholds, user.level || 1);
  const currentLevelName = levelNames[currentLevel - 1] || 'Amir';
  const nextLevelRequirement = levelThresholds[currentLevel - 1] || 'MAX';
  const nextLevelText = nextLevelRequirement === 'MAX' ? 'MAX' : formatNumberShort(Math.floor(nextLevelRequirement - (user.dubaiCoin || 0)));
  const progressPercentage = Math.min(progress, 100);
  
  // Update user level if they achieved a new level
  React.useEffect(() => {
    if (levelIncreased && currentLevel > (user.level || 1)) {
      setUser(prev => ({ ...prev, level: currentLevel }));
    }
  }, [currentLevel, levelIncreased, user.level, setUser]);

  const tapProfit = Math.floor(calculateTapPower(user) * (isTapBoostActive ? 2 : 1) * (user.isPremium ? 1.5 : 1));
  const maxEnergy = calculateMaxEnergy(user);
  const energyPercentage = Math.max(0, Math.min(100, (user.energy / maxEnergy) * 100));

  // Avatar and background logic - only active avatar shows
  const getCurrentAvatar = () => {
    // Check if user has selected an avatar from marketplace/premium
    if (user.selectedAvatar) return user.selectedAvatar;
    
    // Check if user has purchased premium avatars and has one active
    if (user.ownedPremiumAvatars && user.ownedPremiumAvatars.length > 0) {
      // Return the last purchased premium avatar (most recent)
      const lastPremiumAvatar = user.ownedPremiumAvatars[user.ownedPremiumAvatars.length - 1];
      // This should be the emoji from the premium avatar data
      return lastPremiumAvatar.emoji || '🏛️';
    }
    
    // Check if user has any owned skins from marketplace
    if (user.ownedSkins && user.ownedSkins.length > 0) {
      // Return the last purchased skin avatar
      const lastSkin = user.ownedSkins[user.ownedSkins.length - 1];
      return lastSkin.emoji || '🏛️';
    }
    
    // Default avatar
    return '🏛️';
  };

  const getCurrentBackground = () => {
    // Return the selected appearance item that's not an avatar
    if (user.selectedVehicle) return user.selectedVehicle;
    if (user.selectedBuilding) return user.selectedBuilding;
    return null;
  };

  // Combo system - reset after 20 seconds or if tap interval > 0.2 seconds
  useEffect(() => {
    const comboTimeout = setTimeout(() => {
      if (Date.now() - lastTapTime > 20000) {
        setComboCount(0);
      }
    }, 20000);
    return () => clearTimeout(comboTimeout);
  }, [lastTapTime]);

  // Particle effect cleanup
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticleEffects(prev => prev.filter(p => Date.now() - p.timestamp < 2000));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  const createParticleEffect = (x, y, value) => {
    const particle = {
      id: Date.now() + Math.random(),
      x: x - 20,
      y: y - 20,
      value,
      timestamp: Date.now()
    };
    setParticleEffects(prev => [...prev.slice(-4), particle]);
  };

  const handleTap = useCallback((e) => {
    e.preventDefault();
    
    if (user.energy < tapProfit) {
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
      return;
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapTime;
    
    // Combo logic - only works if tap interval is less than 0.2 seconds
    let newComboCount = 1;
    if (timeDiff < 200 && comboCount > 0) {  // 0.2 seconds = 200ms
      newComboCount = Math.min(comboCount + 1, 10); // Max combo count for 2x multiplier
    }
    setComboCount(newComboCount);
    setLastTapTime(currentTime);

    // Combo multiplier - max 2x
    const comboMultiplier = newComboCount > 1 ? Math.min(1 + (newComboCount - 1) * 0.1, 2) : 1;
    const finalTapProfit = Math.floor(tapProfit * comboMultiplier);

    const rect = tapAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left;
      const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top;
      
      // Create tap effect
      const tapId = Date.now() + Math.random();
      setTaps(prev => [...prev.slice(-4), { id: tapId, x, y, value: finalTapProfit }]);
      
      // Create particle effect
      createParticleEffect(x, y, finalTapProfit);
      
      setTimeout(() => {
        setTaps(prev => prev.filter(tap => tap.id !== tapId));
      }, 1000);
    }

    // Update user state - energy consumption equals tap profit
    setUser(prevUser => ({
      ...prevUser,
      dubaiCoin: prevUser.dubaiCoin + finalTapProfit,
      totalEarned: prevUser.totalEarned + finalTapProfit,
      energy: Math.max(0, prevUser.energy - finalTapProfit),
      tapsToday: (prevUser.tapsToday || 0) + 1,
    }));

    // Haptic feedback
    if (newComboCount > 5) {
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('heavy');
    } else {
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
    }
  }, [user.energy, tapProfit, comboCount, lastTapTime, setUser]);

  const currentBackground = getCurrentBackground();
  
  return (
    <div className="min-h-screen h-screen text-white relative overflow-hidden flex flex-col pt-2 sm:pt-4" style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #0e3981 75%, #1a1a2e 100%)",
      backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,215,0,0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255,215,0,0.05) 0%, transparent 50%)"
    }}>
      {/* Selected Background Item Display - Behind everything */}
      {currentBackground && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
          <span className="text-[250px] sm:text-[300px] filter blur-sm">
            {currentBackground}
          </span>
        </div>
      )}
      
      {/* Top Header Section - responsive */}
      <div className="relative z-10 px-3 sm:px-4 pt-1 pb-1 flex-shrink-0">
        {/* Top Row - Profile and Settings */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-white text-sm">👤</span>
              )}
            </div>
            <span className="text-white font-bold text-sm">{user.telegramUsername || user.username || 'User'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm">🏙️</span>
            </div>
            <span className="text-white font-bold text-sm">DubaiCity</span>
            {/* Selected Appearance Item Indicator */}
            {currentBackground && (
              <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                <span className="text-xs">{currentBackground}</span>
              </div>
            )}
          </div>
        </div>

        {/* Three Stats Row - responsive */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="bg-gray-800/50 rounded-xl p-1.5 sm:p-2 text-center">
            <div className="text-xs text-gray-400 mb-1">Earn per tap</div>
            <div className="flex items-center justify-center">
              <CoinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 mr-1" />
              <span className="text-white font-bold text-xs sm:text-sm">+{Math.floor(tapProfit)}</span>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-1.5 sm:p-2 text-center">
            <div className="text-xs text-gray-400 mb-1">Coins to level up</div>
            <div className="text-white font-bold text-xs sm:text-sm">{nextLevelText}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-1.5 sm:p-2 text-center">
            <div className="text-xs text-gray-400 mb-1">Profit per hour</div>
            <div className="flex items-center justify-center">
              <CoinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 mr-1" />
              <span className="text-white font-bold text-xs sm:text-sm">+{Math.floor(passiveIncome || 0)}</span>
            </div>
          </div>
        </div>

        {/* Large Balance - responsive */}
        <div className="text-center mb-2 sm:mb-3">
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <CoinIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </motion.div>
            <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {formatNumberFull(user.dubaiCoin || 0)}
            </motion.h1>
          </div>
          
          {/* Progress Bar with Level Info */}
          <div className="mt-2 mb-0">
            <div className="flex items-center justify-between mb-1">
              <button 
                onClick={() => setShowLevelModal(true)}
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                {currentLevelName}
              </button>
              <span className="text-gray-400 text-xs sm:text-sm">LV {currentLevel}/14</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tap Area - Responsive centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 relative -mt-8 sm:-mt-10 lg:-mt-12">
        <motion.div
          ref={tapAreaRef}
          className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onPointerDown={handleTap}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Blue Ring - exact like Hamster Kombat image - NO ROTATION */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #4F46E5, #7C3AED, #4F46E5)",
              padding: "6px"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full flex items-center justify-center overflow-hidden">
              {/* Character - responsive size */}
              <span className="text-[160px] sm:text-[180px] lg:text-[200px] filter drop-shadow-2xl leading-none">
                {getCurrentAvatar()}
              </span>
            </div>
          </div>

          {/* Tap Effects - Clean without backgrounds */}
          <AnimatePresence mode="popLayout">
            {taps.map((tap) => (
              <motion.div
                key={tap.id}
                className="absolute pointer-events-none z-20"
                style={{ left: tap.x, top: tap.y }}
                initial={{ opacity: 1, scale: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5, 
                  y: -120,
                  x: Math.random() * 40 - 20
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <motion.span 
                  className="text-2xl font-bold"
                  style={{
                    textShadow: "0 0 15px rgba(251, 191, 36, 1), 0 0 30px rgba(251, 191, 36, 0.8)",
                    color: "#FBB836"
                  }}
                  animate={{
                    textShadow: [
                      "0 0 15px rgba(251, 191, 36, 1), 0 0 30px rgba(251, 191, 36, 0.8)",
                      "0 0 25px rgba(251, 191, 36, 1), 0 0 40px rgba(251, 191, 36, 1)",
                      "0 0 15px rgba(251, 191, 36, 1), 0 0 30px rgba(251, 191, 36, 0.8)"
                    ]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  +{formatNumberShort(tap.value)}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Coin Scatter Effects */}
          <AnimatePresence mode="popLayout">
            {particleEffects.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none z-15"
                style={{ left: particle.x, top: particle.y }}
                initial={{ opacity: 1, scale: 1, rotate: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: [1, 1.5, 0],
                  y: -80 + Math.random() * 40,
                  x: Math.random() * 100 - 50,
                  rotate: Math.random() * 720
                }}
                transition={{ 
                  duration: 1.8,
                  scale: { times: [0, 0.3, 1] }
                }}
              >
                <motion.div 
                  className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"
                  style={{
                    boxShadow: "0 0 10px rgba(251, 191, 36, 0.8), inset 0 1px 2px rgba(255,255,255,0.3)"
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(251, 191, 36, 0.8), inset 0 1px 2px rgba(255,255,255,0.3)",
                      "0 0 20px rgba(251, 191, 36, 1), inset 0 1px 2px rgba(255,255,255,0.5)",
                      "0 0 10px rgba(251, 191, 36, 0.8), inset 0 1px 2px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
      </div>

      {/* Energy and Boost Controls - Responsive fixed position */}
      <div className="fixed bottom-24 sm:bottom-28 left-0 right-0 pointer-events-none z-40">
        <div className="flex justify-between px-3 sm:px-4">
          {/* Energy Section - Bottom Left */}
          <motion.button
            className="flex items-center space-x-2 cursor-pointer pointer-events-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const today = new Date().toDateString();
              const dailyRefills = user.dailyEnergyRefills || {};
              const todayRefills = dailyRefills[today] || 0;
              
              if (todayRefills < 5) {
                setUser(prev => ({
                  ...prev,
                  energy: calculateMaxEnergy(prev),
                  dailyEnergyRefills: {
                    ...prev.dailyEnergyRefills,
                    [today]: todayRefills + 1
                  }
                }));
                // Add notification for successful refill
                if (window.notifier) {
                  window.notifier.addNotification(
                    `Energiya to'ldirildi! ${5 - todayRefills - 1} ta bepul qoldi`, 
                    'success', 
                    2000, 
                    'energy-refill'
                  );
                }
                window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
              } else {
                // Add notification for no refills left
                if (window.notifier) {
                  window.notifier.addNotification(
                    'Bugunlik energiya to\'ldirish tugadi (0/5)', 
                    'error', 
                    2000, 
                    'energy-refill-limit'
                  );
                }
                window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
              }
            }}
          >
            <motion.div 
              className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 8px rgba(34, 197, 94, 0)",
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-sm">🔋</span>
            </motion.div>
            <div className="flex flex-col items-start">
              <span className="text-white font-bold text-sm">
                {formatNumberFull(Math.floor(user.energy))}/{formatNumberFull(maxEnergy)}
              </span>
              <span className="text-xs text-gray-400">
                {(() => {
                  const today = new Date().toDateString();
                  const dailyRefills = user.dailyEnergyRefills || {};
                  const todayRefills = dailyRefills[today] || 0;
                  return `${5 - todayRefills}/5`;
                })()}
              </span>
            </div>
          </motion.button>

          {/* Boost Section - Bottom Right */}
          <motion.button
            className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer pointer-events-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const today = new Date().toDateString();
              const dailyBoosts = user.dailyBoosts || {};
              const todayBoosts = dailyBoosts[today] || 0;
              
              if (todayBoosts < 3) {
                handleActivateTapBoost();
                setUser(prev => ({
                  ...prev,
                  dailyBoosts: {
                    ...prev.dailyBoosts,
                    [today]: todayBoosts + 1
                  }
                }));
                // Add notification for successful boost
                if (window.notifier) {
                  window.notifier.addNotification(
                    `Boost aktivlashtirildi! ${3 - todayBoosts - 1} ta bepul qoldi`, 
                    'success', 
                    2000, 
                    'boost-activate'
                  );
                }
              } else {
                // Add notification for no boosts left
                if (window.notifier) {
                  window.notifier.addNotification(
                    'Bugunlik boost limiti tugadi (0/3)', 
                    'error', 
                    2000, 
                    'boost-limit'
                  );
                }
              }
            }}
          >
            <motion.div 
              className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center"
              animate={isTapBoostActive ? {
                backgroundImage: [
                  "linear-gradient(135deg, #FB923C, #EF4444)",
                  "linear-gradient(135deg, #F97316, #DC2626)",
                  "linear-gradient(135deg, #FB923C, #EF4444)"
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <span className="text-sm">
                {isTapBoostActive ? "🔥" : "🚀"}
              </span>
            </motion.div>
            <div className="flex flex-col items-start">
              <span className="text-white font-bold text-sm">Boost</span>
              <span className="text-xs text-gray-400">
                {(() => {
                  const today = new Date().toDateString();
                  const dailyBoosts = user.dailyBoosts || {};
                  const todayBoosts = dailyBoosts[today] || 0;
                  return `${3 - todayBoosts}/3`;
                })()}
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Bottom Section - Navigation only */}
      <div className="px-4 py-3 flex-shrink-0">
        {/* Navigation will be here if needed */}
      </div>

      {/* Offline Earnings Claim */}
      <AnimatePresence mode="wait">
        {offlineEarningsToClaim > 0 && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border border-amber-500/50 max-w-sm mx-4"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-6xl">💰</span>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Offline Daromad!
                </h3>
                <p className="text-gray-300">
                  Siz yo'q bo'lgan vaqtda{' '}
                  <span className="text-amber-400 font-bold">
                    {formatNumberShort(offlineEarningsToClaim)}
                  </span>{' '}
                  tanga yig'ildi!
                </p>
                <motion.button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black py-3 rounded-xl font-bold text-lg shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaimOfflineEarnings}
                >
                  Olish
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Modal */}
      <LevelModal
        show={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        user={user}
        levelNames={levelNames}
        levelThresholds={levelThresholds}
        leaderboard={[]}
      />
    </div>
  );
};

export default MyCity;