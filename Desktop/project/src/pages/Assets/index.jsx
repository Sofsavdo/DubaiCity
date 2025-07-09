import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Birja from './Birja';
import ScratchCardGame from './ScratchCardGame';
import AdVideoModal from '../../components/Common/AdVideoModal';
import { formatNumberShort } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';
import { PREMIUM_AVATARS, calculatePremiumAvatarPrice, RARITY_COLORS } from '../../data/premiumAvatars';
import { useNotifier } from '../../hooks/useNotifier';

const Assets = (props) => {
  const { user, setUser, handleBuyPromoCode, handleAdFinished, handleClaimYoutubeReward, youtubeTasks = [] } = props;
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState('games');
  const [showAdModal, setShowAdModal] = useState(false);
  const [youtubeCode, setYoutubeCode] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const notifier = useNotifier();

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

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return <GameComponent {...props} onBack={handleBackToList} />;
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      {/* Header */}
      <div className="p-2 flex-shrink-0">
        <h1 className="text-lg font-bold text-yellow-400 mb-1 text-center">Aktivlar</h1>
        
        {/* Birja uchun kurs va qiymat */}
        {activeTab === 'exchange' && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 mb-1 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Kurs</p>
              <p className="font-bold text-sm text-green-400" id="live-price">
                ${(0.0001).toFixed(6)}
              </p>
            </div>
            <div>
              <BalanceDisplay user={user} size="small" showIcon={false} />
            </div>
            <div>
              <p className="text-xs text-gray-400">USD Qiymati</p>
              <p className="font-bold text-sm text-yellow-400">
                ${((user.dubaiCoin || 0) * (props.exchangeRate || 0.0001)).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        
        {/* Boshqa tablar uchun oddiy balans */}
        {activeTab !== 'exchange' && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 mb-1 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Kurs</p>
              <p className="font-bold text-sm text-green-400">
                ${(props.exchangeRate || 0.0001).toFixed(6)}
              </p>
            </div>
            <div>
              <BalanceDisplay user={user} size="small" showIcon={false} />
            </div>
            <div>
              <p className="text-xs text-gray-400">USD Qiymati</p>
              <p className="font-bold text-sm text-yellow-400">
                ${((user.dubaiCoin || 0) * (props.exchangeRate || 0.0001)).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-1 flex mb-1">
          {[
            { id: 'games', label: 'O\'yinlar', icon: '🎮' },
            { id: 'exchange', label: 'Birja', icon: '📊' },
            { id: 'promo', label: 'Promo', icon: '🎁' },
            { id: 'youtube', label: 'YouTube', icon: '📺' },
            { id: 'premium-avatars', label: 'Premium', icon: '👑' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded py-1 font-bold transition-colors text-xs ${
                activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs">{tab.icon}</span>
                <span className="text-[10px]">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-center">
                <h2 className="text-lg font-bold text-white mb-2">Mini O'yinlar 🎮</h2>
                <p className="text-sm text-gray-300">O'ynang va tanga yutib oling!</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 cursor-pointer hover:border-yellow-400 transition-colors"
                    onClick={() => handleGameSelect(game.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{game.icon}</span>
                      <div className="flex-grow">
                        <h3 className="font-bold text-white text-sm">{game.name}</h3>
                        <p className="text-xs text-gray-400">{game.description}</p>
                      </div>
                      <span className="text-yellow-400">▶</span>
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
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center">
                <h2 className="text-lg font-bold text-white mb-2">Promo Kodlar 🎁</h2>
                <p className="text-sm text-gray-300 mb-4">Maxsus promo kodlarni sotib oling!</p>
                
                <button
                  onClick={handleBuyPromoCode}
                  disabled={user.dubaiCoin < 10000}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Promo Kod Sotib Olish (10,000 DC)
                </button>
              </div>

              {/* User's Promo Codes */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Sizning Promo Kodlaringiz:</h3>
                {user.promoCodes && user.promoCodes.length > 0 ? (
                  user.promoCodes.map(promo => (
                    <div key={promo.id} className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-yellow-400">{promo.partner}</span>
                        <span className="text-xs text-gray-400">{promo.expiry}</span>
                      </div>
                      <p className="text-sm text-white mb-2">{promo.description}</p>
                      <div className="bg-black/30 rounded p-2 font-mono text-center">
                        <span className="text-green-400 font-bold">{promo.code}</span>
                      </div>
                      <a
                        href={promo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-center bg-blue-500 text-white py-1 rounded text-sm"
                      >
                        Ishlatish
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">Hozircha promo kodlaringiz yo'q</p>
                )}
              </div>

              {/* Ad Section */}
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Reklama Ko'rish 📺</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Reklama ko'rib, tanga yutib oling! 
                  ({user.dailyAdWatches || 0}/{user.isPremium ? 10 : 5})
                </p>
                <button
                  onClick={() => setShowAdModal(true)}
                  disabled={(user.dailyAdWatches || 0) >= (user.isPremium ? 10 : 5)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reklama Ko'rish (+500 DC)
                </button>
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
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center">
                <h2 className="text-lg font-bold text-white mb-2">YouTube Vazifalar 📺</h2>
                <p className="text-sm text-gray-300">Videolarni ko'ring va yashirin kodlarni toping!</p>
              </div>

              {youtubeTasks.map(task => {
                const isClaimed = user.claimedYoutubeTasks?.includes(task.id);
                return (
                  <div key={task.id} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                    <h3 className="font-bold text-white mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Mukofot: {formatNumberShort(task.rewardAmount)} DC
                    </p>
                    
                    {!isClaimed ? (
                      <>
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-red-600 text-white text-center py-2 rounded-lg mb-3"
                        >
                          Videoni Ko'rish
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
                            className="flex-1 bg-black/30 border border-gray-600 rounded px-3 py-2 text-white"
                          />
                          <button
                            onClick={() => handleYoutubeSubmit(task.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                          >
                            Yuborish
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
                        <span className="text-green-400 font-bold">✅ Olingan</span>
                      </div>
                    )}
                  </div>
                );
              })}
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