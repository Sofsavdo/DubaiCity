import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumberShort, getUserLevel } from '../../utils/helpers';

// Level avatars function
const getLevelAvatar = (level) => {
  const avatars = {
    1: '🌟', 2: '💎', 3: '🏆', 4: '👑', 5: '🦅', 6: '🌊', 7: '🔥', 8: '⚡', 9: '🏰', 10: '🦁', 11: '🐺', 12: '🐅', 13: '🐉', 14: '🦁'
  };
  return avatars[level] || '🌟';
};

const LevelModal = ({ show, onClose, user, levelNames, levelThresholds, leaderboard = [] }) => {
  // Get user's actual level based on balance
  const userBalance = user?.dubaiCoin || user?.totalEarned || 0;
  const userActualLevel = getUserLevel(userBalance, levelThresholds);
  const [currentLevelView, setCurrentLevelView] = useState(userActualLevel);
  
  if (!show) return null;

  // Sample users for testing - representing different levels based on reference image
  const sampleUsers = [
    {
      id: 'user1',
      name: 'E',
      telegramUsername: 'user1',
      dubaiCoin: 573962,
      totalEarned: 573962,
      profilePictureUrl: 'https://placehold.co/48x48/4A90E2/FFFFFF?text=E',
      level: getUserLevel(573962, levelThresholds)
    },
    {
      id: 'user2', 
      name: 'Nikita Anufriev',
      telegramUsername: 'nikita_a',
      dubaiCoin: 562078,
      totalEarned: 562078,
      profilePictureUrl: 'https://placehold.co/48x48/F5A623/FFFFFF?text=N',
      level: getUserLevel(562078, levelThresholds)
    },
    {
      id: 'user3',
      name: 'Leonid Batrakov', 
      telegramUsername: 'leo_b',
      dubaiCoin: 516201,
      totalEarned: 516201,
      profilePictureUrl: 'https://placehold.co/48x48/7ED321/FFFFFF?text=L',
      level: getUserLevel(516201, levelThresholds)
    },
    {
      id: 'user4',
      name: 'Hung Nguyen',
      telegramUsername: 'hung_n',
      dubaiCoin: 510807,
      totalEarned: 510807,
      profilePictureUrl: 'https://placehold.co/48x48/50E3C2/FFFFFF?text=H',
      level: getUserLevel(510807, levelThresholds)
    },
    {
      id: 'user5',
      name: 'Mukhsadovich',
      telegramUsername: 'mukh_s',
      dubaiCoin: 481051,
      totalEarned: 481051,
      profilePictureUrl: 'https://placehold.co/48x48/B8E986/FFFFFF?text=M',
      level: getUserLevel(481051, levelThresholds)
    },
    {
      id: 'user6',
      name: 'TESTONE OFFICIAL',
      telegramUsername: 'testone_off',
      dubaiCoin: 465469,
      totalEarned: 465469,
      profilePictureUrl: 'https://placehold.co/48x48/9013FE/FFFFFF?text=T',
      level: getUserLevel(465469, levelThresholds)
    }
  ];

  // Darajalar bo'yicha leaderboard yaratish
  const createLevelLeaderboard = (level) => {
    const levelMin = level === 1 ? 0 : levelThresholds[level - 2];
    const levelMax = levelThresholds[level - 1] || Infinity;
    
    // Combine sample users with existing leaderboard
    const allPlayers = [...leaderboard, ...sampleUsers];
    
    // Shu darajadagi o'yinchilarni filtrlash (dubaiCoin balance bo'yicha)
    const levelPlayers = allPlayers.filter(player => {
      const playerBalance = player.dubaiCoin || player.totalEarned || 0;
      return playerBalance >= levelMin && (levelMax === Infinity || playerBalance < levelMax);
    });
    
    // Foydalanuvchini qo'shish
    if (user && user.id) {
      const userBalance = user.dubaiCoin || user.totalEarned || 0;
      const userLevel = getUserLevel(userBalance, levelThresholds);
      
      if (userLevel === level) {
        const userInList = levelPlayers.find(p => p.id === user.id);
        if (!userInList) {
          levelPlayers.push({
            id: user.id,
            name: user.telegramUsername || user.username,
            dubaiCoin: user.dubaiCoin,
            totalEarned: user.totalEarned,
            level: userLevel,
            profilePictureUrl: user.profilePictureUrl,
            isCurrentUser: true
          });
        }
      }
    }
    
    // Reyting bo'yicha saralash (dubaiCoin balance bo'yicha)
    return levelPlayers.sort((a, b) => (b.dubaiCoin || b.totalEarned || 0) - (a.dubaiCoin || a.totalEarned || 0)).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  };

  const currentLevelData = createLevelLeaderboard(currentLevelView);
  const currentLevelName = levelNames?.[currentLevelView - 1] || 'Amir';
  const currentLevelThreshold = currentLevelView === 1 ? 0 : levelThresholds[currentLevelView - 2];
  const nextLevelThreshold = levelThresholds[currentLevelView - 1];
  
  const userRank = user && user.id ? currentLevelData.findIndex(p => p.id === user.id) + 1 : 0;
  const topPlayers = currentLevelData.slice(0, 10);
  const userPosition = user && user.id ? currentLevelData.find(p => p.id === user.id) : null;

  const canGoLeft = currentLevelView > 1;
  const canGoRight = currentLevelView < (levelNames?.length || 0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-b from-slate-800 via-slate-900 to-black rounded-xl w-full max-w-md h-[600px] flex flex-col"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with Back button only */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <button onClick={onClose} className="text-white text-lg">
              ← Back
            </button>
            <div className="text-center">
              <h2 className="text-white text-lg font-bold">Reyting</h2>
            </div>
            <div className="w-8"></div>
          </div>

          {/* Level Display - exact like reference image */}
          <div className="text-center p-6 flex-shrink-0">
            {/* Navigation arrows */}
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => setCurrentLevelView(prev => Math.max(1, prev - 1))}
                disabled={!canGoLeft}
                className="text-white text-2xl disabled:opacity-30 p-2"
              >
                ‹
              </button>
              
              {/* Large Level Avatar - exactly like reference */}
              <div className="mx-8">
                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl">
                  {getLevelAvatar(currentLevelView)}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{currentLevelName}</h2>
                <p className="text-sm text-gray-400">from {formatNumberShort(Math.floor(currentLevelThreshold))}+</p>
              </div>
              
              <button
                onClick={() => setCurrentLevelView(prev => Math.min(levelNames.length, prev + 1))}
                disabled={!canGoRight}
                className="text-white text-2xl disabled:opacity-30 p-2"
              >
                ›
              </button>
            </div>
          </div>

          {/* Player List - show top 3 and current user */}
          <div className="flex-grow px-4 overflow-hidden">
            <div className="space-y-1">
              {/* Top 3 players */}
              {topPlayers.slice(0, 3).map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl ${
                    player.isCurrentUser ? 'bg-gray-700/50' : 'bg-gray-800/30'
                  }`}
                >
                  {/* Player avatar - square like reference image */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-600 flex items-center justify-center">
                    {player.profilePictureUrl ? (
                      <img 
                        src={player.profilePictureUrl} 
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm">{player.name?.charAt(0) || '👤'}</span>
                    )}
                  </div>
                  
                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Telegram flag icon like reference */}
                      <span className="text-blue-400 text-xs">❌</span>
                      <span className="text-sm font-medium text-white truncate">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">🪙</span>
                      <span className="text-sm text-white">{Math.floor(player.dubaiCoin || player.totalEarned || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Rank - exact styling like reference */}
                  <div className={`text-3xl font-bold w-8 text-center ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-orange-400' : 'text-gray-500'
                  }`}>
                    {player.rank}
                  </div>
                </div>
              ))}
              
              {/* Dots if there are more players */}
              {userRank > 3 && (
                <div className="text-center py-4">
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              )}
              
              {/* Current user if not in top 3 */}
              {userPosition && userRank > 3 && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-500/20 border border-blue-400/50">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-600 flex items-center justify-center">
                    {userPosition.profilePictureUrl ? (
                      <img 
                        src={userPosition.profilePictureUrl} 
                        alt={userPosition.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm">{userPosition.name?.charAt(0) || '👤'}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 text-xs">❌</span>
                      <span className="text-sm font-medium text-white truncate">{userPosition.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">🪙</span>
                      <span className="text-sm text-white">{Math.floor(userPosition.dubaiCoin || userPosition.totalEarned || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold w-8 text-center text-blue-400">
                    {userRank}
                  </div>
                </div>
              )}
            </div>
            
            {currentLevelData.length === 0 && (
              <div className="text-center py-8">
                <span className="text-gray-400">Bu darajada hali o'yinchi yo'q</span>
              </div>
            )}
          </div>


        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



export default LevelModal;