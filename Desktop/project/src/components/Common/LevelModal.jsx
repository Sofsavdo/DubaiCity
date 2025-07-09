import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumberShort } from '../../utils/helpers';

const LevelModal = ({ show, onClose, user, levelNames, levelThresholds, leaderboard = [] }) => {
  const [currentLevelView, setCurrentLevelView] = useState(user?.level || 1);
  
  if (!show) return null;

  // Darajalar bo'yicha leaderboard yaratish
  const createLevelLeaderboard = (level) => {
    const levelMin = level === 1 ? 0 : levelThresholds[level - 2];
    const levelMax = levelThresholds[level - 1] || Infinity;
    
    // Shu darajadagi o'yinchilarni filtrlash
    const levelPlayers = leaderboard.filter(player => {
      return player.totalEarned >= levelMin && (levelMax === Infinity || player.totalEarned < levelMax);
    });
    
    // Foydalanuvchini qo'shish agar u shu darajada bo'lsa
    if (user.level === level) {
      const userInList = levelPlayers.find(p => p.id === user.id);
      if (!userInList) {
        levelPlayers.push({
          id: user.id,
          name: user.username,
          totalEarned: user.totalEarned,
          level: user.level,
          profilePictureUrl: user.profilePictureUrl,
          isCurrentUser: true
        });
      }
    }
    
    // Reyting bo'yicha saralash
    return levelPlayers.sort((a, b) => b.totalEarned - a.totalEarned).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  };

  const currentLevelData = createLevelLeaderboard(currentLevelView);
  const currentLevelName = levelNames[currentLevelView - 1] || 'Amir';
  const currentLevelThreshold = currentLevelView === 1 ? 0 : levelThresholds[currentLevelView - 2];
  const nextLevelThreshold = levelThresholds[currentLevelView - 1];
  
  const userRank = currentLevelData.findIndex(p => p.id === user.id) + 1;
  const topPlayers = currentLevelData.slice(0, 10);
  const userPosition = currentLevelData.find(p => p.id === user.id);

  const canGoLeft = currentLevelView > 1;
  const canGoRight = currentLevelView < levelNames.length;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-b from-gray-900 to-black border border-yellow-400/50 rounded-xl p-6 w-full max-w-md h-[600px] flex flex-col"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-4 flex-shrink-0">
            {/* Level avatar */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl border-4 border-yellow-400">
              {getLevelAvatar(currentLevelView)}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCurrentLevelView(prev => Math.max(1, prev - 1))}
                disabled={!canGoLeft}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-lg"
              >
                ←
              </button>
              
              <div className="flex-1 mx-4">
                <h2 className="text-2xl font-bold text-yellow-400">{currentLevelName}</h2>
                <p className="text-sm text-gray-400">Daraja {Math.floor(currentLevelView)}</p>
              </div>
              
              <button
                onClick={() => setCurrentLevelView(prev => Math.min(levelNames.length, prev + 1))}
                disabled={!canGoRight}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-lg"
              >
                →
              </button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400">Daraja talabi</p>
              <p className="font-bold text-white">
                {formatNumberShort(Math.floor(currentLevelThreshold))} - {nextLevelThreshold ? formatNumberShort(Math.floor(nextLevelThreshold)) : 'MAX'}
              </p>
            </div>
          </div>

          {/* Top 10 */}
          <div className="flex-grow overflow-y-auto mb-4">
            <h3 className="text-lg font-bold text-white mb-3">Top 10</h3>
            <div className="space-y-2">
              {topPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    player.isCurrentUser ? 'bg-yellow-400/20 border border-yellow-400' : 'bg-gray-800/50'
                  }`}
                >
                  <span className={`text-lg font-bold w-6 text-center ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-yellow-700' : 'text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <img 
                    src={player.profilePictureUrl} 
                    className="w-8 h-8 rounded-full border border-gray-600" 
                    alt={player.name}
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src='https://placehold.co/32x32/090979/ffffff?text=U'; 
                    }}
                  />
                  <div className="flex-grow">
                    <p className="font-bold text-white text-sm">{player.name}</p>
                  </div>
                  <p className="font-bold text-yellow-400 text-sm">
                    {formatNumberShort(Math.floor(player.totalEarned))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {currentLevelData.length > 10 && userRank > 10 && (
            <div className="text-center py-2">
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Yana {currentLevelData.length - 10} kishi</p>
            </div>
          )}

          {/* User position */}
          {userPosition && userRank > 10 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-white mb-2">Sizning o'rningiz</h3>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-400/20 border border-yellow-400">
                <span className="text-lg font-bold w-6 text-center text-yellow-400">{userRank}</span>
                <img 
                  src={userPosition.profilePictureUrl} 
                  className="w-8 h-8 rounded-full border border-yellow-400" 
                  alt={userPosition.name}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src='https://placehold.co/32x32/FFD700/000000?text=U'; 
                  }}
                />
                <div className="flex-grow">
                  <p className="font-bold text-white text-sm">{userPosition.name}</p>
                </div>
                <p className="font-bold text-yellow-400 text-sm">
                  {formatNumberShort(Math.floor(userPosition.totalEarned))}
                </p>
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex-shrink-0"
          >
            Yopish
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Level avatarlari
const getLevelAvatar = (level) => {
  const avatars = {
    1: '👶', 2: '🧒', 3: '👦', 4: '👨', 5: '🧑‍💼', 6: '👨‍💻', 7: '🧑‍🎓', 
    8: '👨‍🏫', 9: '👨‍⚖️', 10: '👑', 11: '🏆', 12: '💎', 13: '🌟', 14: '⚡'
  };
  return avatars[level] || '👤';
};

export default LevelModal;