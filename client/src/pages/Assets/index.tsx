import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Birja from './Birja';
import ScratchCardGame from './ScratchCardGame';
import AdVideoModal from '../../components/Common/AdVideoModal';

import { formatNumberShort, formatNumberFull } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';
import { TopHeader } from '../../components/Common/TopHeader';
import { PREMIUM_AVATARS, calculatePremiumAvatarPrice, RARITY_COLORS } from '../../data/premiumAvatars';
import { useNotifier } from '../../context/NotificationContext';

const Assets = (props) => {
  const { user, setUser, handleBuyPromoCode, handleAdFinished, handleClaimYoutubeReward, youtubeTasks = [] } = props;
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState('games');
  const [showAdModal, setShowAdModal] = useState(false);
  const [youtubeCode, setYoutubeCode] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const [exchangeRates, setExchangeRates] = useState({
    usd: 0.00012,
    eur: 0.00011,
    rub: 8.50
  });
  const notifier = useNotifier();

  // Update exchange rates every second for live effect
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates(prev => ({
        usd: prev.usd * (1 + (Math.random() - 0.5) * 0.02),
        eur: prev.eur * (1 + (Math.random() - 0.5) * 0.02),
        rub: prev.rub * (1 + (Math.random() - 0.5) * 0.02)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const games = [
    { id: 'scratchcard', name: 'Scratch Card 🎫', icon: '🎰', component: ScratchCardGame, description: 'Win instant prizes' }
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    if (props.onGamePlayed) {
      props.onGamePlayed();
    }
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  const handlePremiumAvatarPurchase = (avatar) => {
    if (!user.isPremium) {
      notifier.addNotification('Premium status kerak!', 'error');
      return;
    }

    const price = calculatePremiumAvatarPrice(avatar, user.premiumLevel || 1);
    
    if (user.dubaiCoin < price) {
      notifier.addNotification('Mablag\' yetarli emas!', 'error');
      return;
    }

    if (user.ownedPremiumAvatars?.includes(avatar.id)) {
      notifier.addNotification('Bu avatar allaqachon sizda bor!', 'info');
      return;
    }

    setUser(prev => ({
      ...prev,
      dubaiCoin: prev.dubaiCoin - price,
      ownedPremiumAvatars: [...(prev.ownedPremiumAvatars || []), avatar.id],
      selectedAvatar: avatar.emoji
    }));

    notifier.addNotification(`${avatar.name} sotib olindi!`, 'success');
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  };

  const handleYoutubeSubmit = (taskId) => {
    if (!youtubeCode.trim()) {
      notifier.addNotification('Kodni kiriting!', 'error');
      return;
    }
    handleClaimYoutubeReward(taskId, youtubeCode);
    setYoutubeCode('');
    setSelectedTask(null);
  };

  const handleBuyPromoCodeLocal = () => {
    if (user.dubaiCoin < 10000) {
      notifier.addNotification('Mablag\' yetarli emas!', 'error');
      return;
    }

    // Create a promo code
    const promoCode = {
      id: Date.now(),
      code: `DUBAI${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      description: 'Maxsus Dubai City promo kodi',
      reward: 5000 + Math.floor(Math.random() * 10000),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      externalLink: 'https://t.me/DubaiCityBot'
    };

    setUser(prev => ({
      ...prev,
      dubaiCoin: prev.dubaiCoin - 10000,
      ownedPromoCodes: [...(prev.ownedPromoCodes || []), promoCode]
    }));

    notifier.addNotification('Promo kod sotib olindi!', 'success');
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return <GameComponent {...props} onBack={handleBackToList} />;
    }
  }

  // Calculate level information
  const levelNames = props.levelNames || ['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Elite', 'Supreme', 'Imperial', 'Legendary', 'Mythical', 'Dubai King'];
  const levelThresholds = props.levelThresholds || [0, 5000, 25000, 100000, 1000000, 5000000, 25000000, 100000000, 1000000000, 5000000000, 25000000000, 100000000000, 500000000000, 1000000000000];
  
  let currentLevel = 1;
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (user.totalEarned >= levelThresholds[i]) {
      currentLevel = i + 1;
      break;
    }
  }
  const currentLevelName = levelNames[currentLevel - 1] || 'Rookie';

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden flex flex-col">
      {/* Top Header Section - Responsive Layout */}
      <div className="relative z-10 px-3 sm:px-4 pt-3 sm:pt-4 pb-2 flex-shrink-0">
        {/* Main Balance Display */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
          {/* Main Balance - Responsive */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              >
                <span className="text-xl sm:text-2xl">💰</span>
              </motion.div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {formatNumberFull(user.dubaiCoin || 0)}
              </span>
            </div>
          </div>
          
          {/* Bottom Row - Kurs and Qiymat */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* Exchange Rate */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs sm:text-sm text-gray-400">Kurs</span>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold text-xs sm:text-sm">${exchangeRates.usd.toFixed(6)}</span>
              </div>
            </div>
            
            {/* Dollar Value */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs sm:text-sm text-gray-400">Qiymat</span>
                <span className="text-green-400 font-bold text-xs sm:text-sm">
                  ${((user.dubaiCoin || 0) * exchangeRates.usd).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Fixed Position, Full Width, Responsive */}
      <div className="flex-shrink-0 px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-1 sm:p-2 flex">
          {[
            { id: 'games', label: 'O\'yinlar', icon: '🎮' },
            { id: 'exchange', label: 'Birja', icon: '📊' },
            { id: 'promo', label: 'Promo', icon: '🎁' },
            { id: 'youtube', label: 'YouTube', icon: '📺' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded py-1 sm:py-2 font-bold transition-colors ${
                activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-lg">{tab.icon}</span>
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Code Purchase - Fixed Position, Responsive */}
      {activeTab === 'promo' && (
        <div className="flex-shrink-0 px-3 sm:px-4 mb-3 sm:mb-4">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 sm:p-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl">🎁</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">Promo kodlar sotib olish</h3>
                <p className="text-xs text-gray-400 truncate">Chegirmalar va sovg'alar</p>
              </div>
              <button
                onClick={handleBuyPromoCodeLocal}
                disabled={user.dubaiCoin < 10000}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-3 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex-shrink-0"
              >
                10K DC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable with Safe Area */}
      <div className="flex-1 px-3 sm:px-4 overflow-y-auto pb-20 sm:pb-24" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <AnimatePresence mode="wait">
          {/* Games Tab */}
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >

              
              <div className="grid grid-cols-1 gap-3">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 cursor-pointer hover:border-yellow-400 transition-colors"
                    onClick={() => handleGameSelect(game.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{game.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">Scratch Card</h3>
                          <p className="text-xs text-gray-400">O'ynash uchun bosing</p>
                        </div>
                      </div>
                      <span className="text-yellow-400 text-lg">▶</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Exchange Tab */}
          {activeTab === 'exchange' && (
            <motion.div
              key="exchange"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Birja {...props} />
            </motion.div>
          )}

          {/* Promo Tab */}
          {activeTab === 'promo' && (
            <motion.div
              key="promo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* User's Promo Codes */}
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                <h3 className="text-white font-bold mb-2 text-sm">Sizning promo kodlaringiz</h3>
                {user.ownedPromoCodes && user.ownedPromoCodes.length > 0 ? (
                  <div className="space-y-2">
                    {user.ownedPromoCodes.map((promo) => (
                      <div 
                        key={promo.id}
                        className="bg-gray-700/50 border border-gray-600 rounded-lg p-2"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-sm">Uzum Market</h4>
                              <p className="text-xs text-gray-300">1 mln so'mlik harid uchun 200k so'm chegirma</p>
                            </div>
                            <div className="text-right">
                              <div className="text-orange-400 font-bold text-xs">
                                ⏰ 5k 12s
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-black/30 rounded p-2 text-center">
                            <p className="text-green-400 font-bold text-sm font-mono">{promo.code || 'UZUM2024'}</p>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => {
                                // Forward to Telegram
                                const promoText = `🎁 Dubai City Bot promo kodi: ${promo.code || 'UZUM2024'}\n\n✨ Foydalanish uchun: @DubaiCityBot`;
                                
                                if (window.Telegram?.WebApp?.openTelegramLink) {
                                  window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(promoText)}`);
                                } else if (window.Telegram?.WebApp?.switchInlineQuery) {
                                  window.Telegram.WebApp.switchInlineQuery(promoText);
                                } else {
                                  // Fallback - open Telegram share URL
                                  window.open(`https://t.me/share/url?url=${encodeURIComponent(promoText)}`, '_blank');
                                }
                                notifier.addNotification('Telegram\'da ulashildi!', 'success');
                              }}
                              className="flex-1 bg-blue-600/20 border border-blue-500 text-blue-400 py-1 rounded text-xs font-medium hover:bg-blue-600/30 transition-colors">
                              ↗️ Forward
                            </button>
                            <button 
                              onClick={() => {
                                const textToCopy = promo.code || 'UZUM2024';
                                if (navigator.clipboard && window.isSecureContext) {
                                  navigator.clipboard.writeText(textToCopy);
                                  notifier.addNotification('Nusxalandi!', 'success');
                                } else {
                                  // Fallback for non-secure contexts
                                  const textArea = document.createElement('textarea');
                                  textArea.value = textToCopy;
                                  document.body.appendChild(textArea);
                                  textArea.select();
                                  try {
                                    document.execCommand('copy');
                                    notifier.addNotification('Nusxalandi!', 'success');
                                  } catch (err) {
                                    notifier.addNotification('Nusxalash xatolik!', 'error');
                                  }
                                  document.body.removeChild(textArea);
                                }
                              }}
                              className="flex-1 bg-gray-600/20 border border-gray-500 text-gray-400 py-1 rounded text-xs font-medium hover:bg-gray-600/30 transition-colors">
                              📋 Nusxalash
                            </button>
                            <button 
                              onClick={() => {
                                // Open partner websites/stores
                                const partnerUrls = [
                                  'https://uzum.uz',
                                  'https://olx.uz',
                                  'https://makro.uz',
                                  'https://mediapark.uz'
                                ];
                                const randomUrl = partnerUrls[Math.floor(Math.random() * partnerUrls.length)];
                                window.open(randomUrl, '_blank');
                                notifier.addNotification('Hamkor saytiga o\'tildi!', 'info');
                              }}
                              className="flex-1 bg-green-600/20 border border-green-500 text-green-400 py-1 rounded text-xs font-medium hover:bg-green-600/30 transition-colors">
                              🔗 Ishlatish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">Hozircha sizda promo kodlar yo'q</p>
                )}
              </div>
            </motion.div>
          )}

          {/* YouTube Tab */}
          {activeTab === 'youtube' && (
            <motion.div
              key="youtube"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >


              <div className="grid grid-cols-1 gap-2">
                {youtubeTasks.slice(0, 2).map(task => {
                  const isClaimed = user.claimedYoutubeTasks?.includes(task.id);
                  return (
                    <div key={`yt-${task.id}`} className="bg-gray-800/50 border border-gray-600 rounded-xl p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-lg">📺</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{task.title}</h3>
                          <p className="text-xs text-gray-300">
                            Mukofot: {formatNumberShort(task.rewardAmount)} DC
                          </p>
                        </div>
                      </div>
                    
                    {!isClaimed ? (
                      <>
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-red-600 text-white text-center py-1 rounded-lg mb-2 transition-colors hover:bg-red-700 text-sm"
                        >
                          Videoni Ko'rish 📺
                        </a>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Yashirin kodni kiriting..."
                            value={selectedTask === task.id ? youtubeCode : ''}
                            onChange={(e) => {
                              setYoutubeCode(e.target.value);
                              setSelectedTask(task.id);
                            }}
                            className="flex-1 bg-black/30 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                            maxLength={20}
                          />
                          <button
                            onClick={() => handleYoutubeSubmit(task.id)}
                            disabled={!youtubeCode.trim() || selectedTask !== task.id}
                            className="bg-green-600 text-white px-3 py-1 rounded font-bold transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Yuborish
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500 rounded-lg p-2 text-center">
                        <span className="text-green-400 font-bold text-sm">✅ Olingan</span>
                      </div>
                    )}
                  </div>
                );
              })} 
              </div>
              {youtubeTasks.length === 0 && (
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
                  <span className="text-gray-400">Hozircha YouTube vazifalar yo'q</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Premium Avatars Tab */}
          {activeTab === 'premium-avatars' && (
            <motion.div
              key="premium-avatars"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 rounded-lg p-4 text-center">
                <h2 className="text-lg font-bold text-yellow-400 mb-2">👑 Premium Avatarlar</h2>
                <p className="text-sm text-gray-300">Eksklyuziv premium avatarlarni sotib oling!</p>
                {!user.isPremium && (
                  <p className="text-xs text-red-400 mt-2">Premium status kerak!</p>
                )}
              </div>

              {/* Categories */}
              {['Celebrity', 'Luxury Car', 'Royalty'].map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{category}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {PREMIUM_AVATARS.filter(avatar => avatar.category === category).map(avatar => {
                      const price = calculatePremiumAvatarPrice(avatar, user.premiumLevel || 1);
                      const isOwned = user.ownedPremiumAvatars?.includes(avatar.id);
                      const isActive = user.selectedAvatar === avatar.emoji;
                      
                      return (
                        <motion.div
                          key={avatar.id}
                          className={`bg-gradient-to-r ${RARITY_COLORS[avatar.rarity]} p-0.5 rounded-lg`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="bg-gray-900 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{avatar.emoji}</span>
                              <div className="flex-grow">
                                <h4 className="font-bold text-white text-sm">{avatar.name}</h4>
                                <p className="text-xs text-gray-400">{avatar.description}</p>
                                <p className="text-xs text-yellow-400 capitalize">{avatar.rarity}</p>
                              </div>
                              <div className="text-right">
                                {isActive && (
                                  <span className="block text-xs text-green-400 mb-1">Faol</span>
                                )}
                                <button
                                  onClick={() => {
                                    if (isOwned) {
                                      setUser(prev => ({
                                        ...prev,
                                        selectedAvatar: avatar.emoji
                                      }));
                                      notifier.addNotification('Avatar faollashtirildi!', 'success');
                                    } else {
                                      handlePremiumAvatarPurchase(avatar);
                                    }
                                  }}
                                  disabled={!user.isPremium || (!isOwned && user.dubaiCoin < price)}
                                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                    isActive ? 'bg-green-600 text-white' :
                                    isOwned ? 'bg-blue-600 text-white hover:bg-blue-500' :
                                    'bg-yellow-600 text-black hover:bg-yellow-500 disabled:opacity-50'
                                  }`}
                                >
                                  {isActive ? 'Faol' : isOwned ? 'Tanlash' : `${formatNumberShort(price)} DC`}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ad Modal */}
      <AdVideoModal
        show={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdFinished={() => {
          handleAdFinished();
          setShowAdModal(false);
        }}
      />


    </div>
  );
};

export default Assets;