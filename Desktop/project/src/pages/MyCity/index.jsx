import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumberShort, getLevelProgress, calculateEnergyCost, calculateTapPower, calculateMaxEnergy } from '../../utils/helpers';
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
  const tapAreaRef = useRef(null);

  if (!user || !levelThresholds || !levelNames) {
    return (
      <motion.div
        className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Yuklanmoqda...
      </motion.div>
    );
  }

  // Real balansga asoslangan level progress
  const { currentLevel, progress } = getLevelProgress(user.totalEarned || 0, levelThresholds);
  const currentLevelName = levelNames[currentLevel - 1] || 'Amir';
  const nextLevelRequirement = levelThresholds[currentLevel] || 'MAX';
  const nextLevelText = nextLevelRequirement === 'MAX' ? 'MAX' : formatNumberShort(Math.floor(nextLevelRequirement - (user.totalEarned || 0)));

  const tapProfit = Math.floor(calculateTapPower(user) * (isTapBoostActive ? 2 : 1) * (user.isPremium ? 1.5 : 1));

  // Joriy avatarni aniqlash
  const getCurrentAvatar = () => {
    // Agar foydalanuvchi avatar tanlagan bo'lsa
    if (user.selectedAvatar) {
      return user.selectedAvatar;
    }
    
    // Default avatar
    return '🏙️';
  };

  // Joriy transport/binoni aniqlash
  const getCurrentBackground = () => {
    const items = user.itemLevels || {};
    
    // Transport
    if (user.selectedVehicle) return user.selectedVehicle;
    
    // Bino
    if (user.selectedBuilding) return user.selectedBuilding;
    
    return null;
  };

  const handleTap = useCallback(
    (e) => {
      e.preventDefault();
      if (user.energy < tapProfit) {
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
        return;
      }
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          dubaiCoin: Math.floor((prevUser.dubaiCoin || 0) + tapProfit),
          energy: Math.floor((prevUser.energy || 0) - tapProfit),
          totalEarned: Math.floor((prevUser.totalEarned || 0) + tapProfit),
          tapsToday: Math.floor((prevUser.tapsToday || 0) + 1),
        };
      });
      const event = e.touches ? e.touches[0] : e;
      if (!tapAreaRef.current) return;
      const rect = tapAreaRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setTaps((prev) => [...prev.slice(-10), { id: Date.now(), x, y, amount: `+${Math.floor(tapProfit)}` }]);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
    },
    [user.energy, setUser, tapProfit]
  );

  const boostsLeft = (user.isPremium ? 5 : 3) - (user.dailyTapBoostsUsed || 0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-blue-900 to-black pb-20 overflow-hidden">
      {/* Minimal Header */}
      <div className="flex-shrink-0 px-2 pt-1">
        <motion.div className="flex items-center justify-center gap-2 mb-1" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
          <img src={user.profilePictureUrl || '/default-avatar.png'} className="w-5 h-5 rounded-full border border-yellow-400" alt="User" />
          <p className="font-bold text-xs text-white">{user.username || 'Foydalanuvchi'}</p>
          {user.isPremium && <span className="text-xs bg-yellow-400/20 text-yellow-300 px-1 py-0.5 rounded">👑</span>}
        </motion.div>
        
        {/* Hamster Kombat uslubida top panel */}
        <motion.div
          className="grid grid-cols-3 gap-1 text-center w-full px-1 py-1 bg-gray-800/40 border border-gray-600/50 rounded-lg backdrop-blur-sm mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1">
            <p className="text-xs text-gray-400">Har bosishga</p>
            <div className="flex items-center justify-center gap-1">
              <CoinIcon className="w-3 h-3 text-yellow-400" />
              <p className={`text-sm font-bold ${isTapBoostActive ? 'text-purple-400 animate-pulse' : 'text-yellow-400'}`}>
                +{formatNumberShort(Math.floor(tapProfit || 0))}
              </p>
            </div>
          </div>
          
          <div className="flex-1 border-x border-white/10">
            <p className="text-xs text-gray-400">Soatlik</p>
            <div className="flex items-center justify-center gap-1">
              <CoinIcon className="w-3 h-3 text-green-400" />
              <p className="text-sm font-bold text-green-400">
                +{formatNumberShort(Math.floor(passiveIncome * (user?.isPremium ? 1.5 : 1)) || 0)}
              </p>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-xs text-gray-400">Keyingi daraja</p>
            <p className="text-sm font-bold text-white">{nextLevelText}</p>
          </div>
        </motion.div>
        
        {/* Asosiy balans - alohida va katta */}
        <motion.div 
          className="text-center mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BalanceDisplay user={user} size="large" />
        </motion.div>
        
        {/* Minimal progress bar with clickable level */}
        <div className="w-full max-w-md mx-auto px-1 mb-1">
          <div className="flex justify-between items-center text-xs mb-1">
            <button
              onClick={() => setShowLevelModal(true)}
              className="font-bold text-yellow-300 hover:text-yellow-200 transition-colors cursor-pointer"
            >
              {currentLevelName}
            </button>
            <span className="text-white/60 text-xs">Lv. {Math.floor(currentLevel)}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>
      </div>

      {/* Tap area - markaziy qism */}
      <div className="flex-grow flex items-center justify-center relative px-4">
        <AnimatePresence>
          {offlineEarningsToClaim > 0 && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gray-800/95 border border-yellow-400/50 rounded-xl p-6 text-center backdrop-blur-sm max-w-sm mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl font-bold text-white mb-3">🤖 Robot ishladi!</p>
                <p className="text-3xl font-bold text-yellow-300 mb-4">+{Math.floor(offlineEarningsToClaim || 0).toLocaleString('en-US').replace(/,/g, ' ')}</p>
                <motion.button
                  onClick={handleClaimOfflineEarnings}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yig'ib olish
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Professional tap area */}
        <motion.div
          ref={tapAreaRef}
          className="relative w-64 h-64 cursor-pointer select-none"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          {/* Gradient background circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          
          {/* Character/City icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Background element (transport/bino) */}
              {getCurrentBackground() && (
                <motion.div 
                  className="absolute inset-0 text-6xl opacity-30 flex items-center justify-center"
                  animate={{ 
                    scale: isTapBoostActive ? [1, 1.05, 1] : 1
                  }}
                  transition={{ 
                    duration: isTapBoostActive ? 0.5 : 0,
                    repeat: isTapBoostActive ? Infinity : 0
                  }}
                >
                  {getCurrentBackground()}
                </motion.div>
              )}
              
              {/* Main avatar */}
              <motion.div 
                className="text-8xl filter drop-shadow-2xl relative z-10 cursor-pointer select-none"
                animate={{ 
                  scale: isTapBoostActive ? [1, 1.1, 1] : 1,
                  rotate: isTapBoostActive ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: isTapBoostActive ? 0.5 : 0,
                  repeat: isTapBoostActive ? Infinity : 0
                }}
                onMouseDown={handleTap}
                onTouchStart={handleTap}
              >
                {getCurrentAvatar()}
              </motion.div>
            </div>
          </div>
          
          {/* Tap effects */}
          <AnimatePresence>
            {taps.map((tap) => (
              <motion.div
                key={tap.id}
                className="absolute text-yellow-400 font-bold text-xl pointer-events-none z-10"
                style={{ top: tap.y, left: tap.x, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -60, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {tap.amount}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="flex-shrink-0 px-4 pb-2">
        <div className="flex justify-between items-center bg-gray-800/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 font-bold text-cyan-300">
            <span>⚡️</span>
            <span className="text-sm">
              {Math.floor(user.energy || 0).toLocaleString('en-US').replace(/,/g, ' ')} / {Math.floor(user.maxEnergy || 500).toLocaleString('en-US').replace(/,/g, ' ')}
            </span>
          </div>
          <motion.button
            onClick={handleActivateTapBoost}
            disabled={isTapBoostActive || boostsLeft <= 0}
            className="flex items-center gap-2 font-bold text-yellow-300 transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-yellow-400/10 px-3 py-1 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🚀</span>
            <span>{Math.floor(boostsLeft)}/{user.isPremium ? 5 : 3}</span>
          </motion.button>
        </div>
      </div>

      {/* Level Modal */}
      <LevelModal
        show={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        user={user}
        levelNames={levelNames}
        levelThresholds={levelThresholds}
        leaderboard={leaderboard}
      />
    </div>
  );
};

export default MyCity;