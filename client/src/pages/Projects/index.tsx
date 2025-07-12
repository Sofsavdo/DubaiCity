import React, { useState, useCallback } from 'react';
import { CheckIcon, CoinIcon } from '../../components/Icons';
import { formatNumberShort, formatNumberFull, calculateTapPower } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import initialData from '../../data/initialData';

const Projects = ({
  user,
  setUser,
  notifier,
}) => {
  const [activeTab, setActiveTab] = useState('daily');
  
  const passiveIncome = user?.businesses?.reduce((total, business) => total + business.hourlyIncome, 0) || 0;
  const isTapBoostActive = user?.boostActive && user?.boostExpiresAt && new Date(user.boostExpiresAt) > new Date();

  // Daily reward system - 4x3 grid (12 days) with progressive rewards
  const dailyRewards = [
    { day: 1, reward: 500, claimed: false },
    { day: 2, reward: 1000, claimed: false },
    { day: 3, reward: 2500, claimed: false },
    { day: 4, reward: 5000, claimed: false },
    { day: 5, reward: 15000, claimed: false },
    { day: 6, reward: 25000, claimed: false },
    { day: 7, reward: 100000, claimed: false },
    { day: 8, reward: 500000, claimed: false },
    { day: 9, reward: 1000000, claimed: false },
    { day: 10, reward: 5000000, claimed: false },
    { day: 11, reward: 25000000, claimed: false },
    { day: 12, reward: 100000000, claimed: false }
  ];

  // Social media tasks in premium style
  const socialTasks = [
    {
      id: 'telegram_channel',
      title: 'Join our TG channel',
      description: 'Telegram kanalimizga qo\'shiling',
      reward: 5000,
      icon: '📱',
      platform: 'Telegram',
      url: 'https://t.me/dubaicity',
      completed: false
    },
    {
      id: 'youtube_exclusive',
      title: 'Get exclusive listing info',
      description: 'Maxsus ro\'yxat ma\'lumotlarini oling',
      reward: 50000,
      icon: '📺',
      platform: 'YouTube',
      url: 'https://youtube.com/@dubaicity',
      completed: false
    },
    {
      id: 'twitter_follow',
      title: 'Follow our X account',
      description: 'X hisobimizni kuzatib boring',
      reward: 5000,
      icon: '🐦',
      platform: 'X',
      url: 'https://x.com/dubaicity',
      completed: false
    },
    {
      id: 'exchange_choose',
      title: 'Choose your exchange',
      description: 'O\'z birjangizni tanlang',
      reward: 5000,
      icon: '💱',
      platform: 'Exchange',
      url: 'https://exchange.dubaicity.com',
      completed: false
    },
    {
      id: 'invite_friends',
      title: 'Invite 3 friends',
      description: '3 ta do\'stingizni taklif qiling',
      reward: 25000,
      icon: '👥',
      platform: 'Referral',
      url: '',
      completed: false
    }
  ];

  // Daily reward claiming logic
  const handleDailyReward = useCallback((reward) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastClaimDate = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    if (lastClaimDate) lastClaimDate.setHours(0, 0, 0, 0);
    
    const daysSinceLastClaim = lastClaimDate ? Math.floor((today.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const shouldResetStreak = daysSinceLastClaim > 1;
    
    const canClaimToday = !lastClaimDate || today.getTime() > lastClaimDate.getTime();
    const currentStreak = shouldResetStreak ? 0 : (user?.dailyLoginStreak || 0);
    
    // Check if user can claim this day
    const canClaimThisDay = canClaimToday && reward === currentStreak + 1;
    
    if (canClaimThisDay) {
      const rewardAmount = dailyRewards.find(r => r.day === reward)?.reward || 0;
      
      setUser(prev => ({
        ...prev,
        dubaiCoin: prev.dubaiCoin + rewardAmount,
        totalEarned: (prev.totalEarned || 0) + rewardAmount,
        dailyLoginStreak: reward,
        lastDailyClaim: today.toISOString(),
      }));
      
      notifier.addNotification(`+${rewardAmount.toLocaleString()} coins! Kun ${reward} mukofot olindi`, 'success');
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    } else {
      notifier.addNotification('Bu mukofotni hali olish mumkin emas', 'error');
    }
  }, [user, setUser, notifier]);

  // Task completion logic
  const handleTaskComplete = useCallback((task) => {
    const today = new Date().toDateString();
    const userTasks = user.completedTasks || {};
    
    if (!userTasks[today] || !userTasks[today].includes(task.id)) {
      // Open task URL if available
      if (task.url) {
        window.open(task.url, '_blank');
      }
      
      // Mark as completed and give reward
      setUser(prev => ({
        ...prev,
        dubaiCoin: prev.dubaiCoin + task.reward,
        totalEarned: (prev.totalEarned || 0) + task.reward,
        completedTasks: {
          ...prev.completedTasks,
          [today]: [...(prev.completedTasks?.[today] || []), task.id]
        }
      }));
      
      notifier.addNotification(`+${task.reward.toLocaleString()} coins! ${task.title} bajarildi`, 'success');
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    }
  }, [user, setUser, notifier]);

  const isTaskCompleted = useCallback((taskId) => {
    const today = new Date().toDateString();
    const userTasks = user.completedTasks || {};
    return userTasks[today] && userTasks[today].includes(taskId);
  }, [user]);

  const isDailyRewardClaimed = useCallback((day) => {
    const currentStreak = user?.dailyLoginStreak || 0;
    return day <= currentStreak;
  }, [user]);

  const canClaimDailyReward = useCallback((day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastClaimDate = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    if (lastClaimDate) lastClaimDate.setHours(0, 0, 0, 0);
    
    const daysSinceLastClaim = lastClaimDate ? Math.floor((today.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const shouldResetStreak = daysSinceLastClaim > 1;
    
    const canClaimToday = !lastClaimDate || today.getTime() > lastClaimDate.getTime();
    const currentStreak = shouldResetStreak ? 0 : (user?.dailyLoginStreak || 0);
    
    return canClaimToday && day === currentStreak + 1;
  }, [user]);

  // Daily Tasks Section
  const DailyTasksSection = () => (
    <div className="space-y-4">
      {/* Daily Reward Card */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-600 relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <div className="text-xl">📅</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight">DAILY REWARD</h3>
            <div className="flex items-center space-x-1 mt-1">
              <CoinIcon className="w-4 h-4 text-amber-400" />
              <span className="text-yellow-400 font-bold text-sm">
                +{formatNumberFull(dailyRewards.reduce((sum, reward) => sum + reward.reward, 0))}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-tight">12 kun davomida jami mukofot</p>
          </div>
          
          {/* Coin Scatter Animation */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-16 h-16 pointer-events-none">
            <div className="relative w-full h-full">
              <motion.div
                className="absolute w-3 h-3 bg-amber-400 rounded-full opacity-80"
                animate={{
                  x: [0, 15, 5, 20, 10],
                  y: [0, -10, 5, -15, 0],
                  rotate: [0, 180, 360, 540, 720],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ top: '20%', left: '30%' }}
              />
              <motion.div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full opacity-70"
                animate={{
                  x: [0, -12, 8, -18, 0],
                  y: [0, 12, -8, 18, 0],
                  rotate: [0, -180, -360, -540, -720],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                style={{ top: '50%', left: '50%' }}
              />
              <motion.div
                className="absolute w-2.5 h-2.5 bg-amber-300 rounded-full opacity-60"
                animate={{
                  x: [0, 10, -5, 18, 0],
                  y: [0, -8, 12, -12, 0],
                  rotate: [0, 270, 540, 810, 1080],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                style={{ top: '70%', left: '20%' }}
              />
              <motion.div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50"
                animate={{
                  x: [0, -8, 12, -15, 0],
                  y: [0, 15, -10, 20, 0],
                  rotate: [0, -270, -540, -810, -1080],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                style={{ top: '10%', left: '60%' }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full opacity-40"
                animate={{
                  x: [0, 6, -10, 14, 0],
                  y: [0, -6, 8, -14, 0],
                  rotate: [0, 360, 720, 1080, 1440],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                style={{ top: '40%', left: '70%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Reward Grid */}
      <div className="grid grid-cols-4 gap-2">
        {dailyRewards.map((reward) => {
          const claimed = isDailyRewardClaimed(reward.day);
          const canClaim = canClaimDailyReward(reward.day);
          
          return (
            <motion.button
              key={reward.day}
              onClick={() => handleDailyReward(reward.day)}
              disabled={claimed || !canClaim}
              className={`relative p-3 rounded-lg transition-all duration-200 ${
                claimed
                  ? 'bg-green-600/20 border-2 border-green-500'
                  : canClaim
                  ? 'bg-blue-600/20 border-2 border-blue-400 hover:border-blue-300 animate-pulse'
                  : 'bg-gray-700/30 border-2 border-gray-600 opacity-50'
              }`}
              whileHover={canClaim ? { scale: 1.05 } : {}}
              whileTap={canClaim ? { scale: 0.95 } : {}}
            >
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Day {reward.day}</div>
                <div className="flex items-center justify-center mb-1">
                  <CoinIcon className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs font-bold text-white">
                  {reward.reward >= 1000000 ? `${Math.floor(reward.reward/1000000)}M` : 
                   reward.reward >= 1000 ? `${Math.floor(reward.reward/1000)}K` : 
                   reward.reward}
                </div>
              </div>
              {claimed && (
                <div className="absolute top-1 right-1">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // Tasks List Section
  const TasksListSection = () => (
    <div className="space-y-3">
      {socialTasks.map((task) => {
        const completed = isTaskCompleted(task.id);
        
        return (
          <motion.div
            key={task.id}
            className={`bg-gray-800/50 rounded-xl p-4 border border-gray-600 transition-all duration-200 ${
              completed ? 'opacity-50' : 'hover:border-gray-500 cursor-pointer'
            }`}
            whileHover={completed ? {} : { scale: 1.01 }}
            onClick={() => !completed && handleTaskComplete(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center">
                  <div className="text-2xl">{task.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{task.title}</h3>
                  <div className="flex items-center mt-1">
                    <CoinIcon className="w-4 h-4 text-amber-400 mr-1" />
                    <span className="text-yellow-400 font-bold text-sm">
                      +{task.reward.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {completed ? (
                  <div className="text-green-400">
                    <CheckIcon className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black text-white">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      {/* Header */}
      <div className="p-4 flex-shrink-0">
        <motion.h1
          className="text-2xl font-bold text-white mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Earn more coins
        </motion.h1>

        {/* Balance Display */}
        <div className="text-center mb-4">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <CoinIcon className="w-6 h-6 text-amber-400" />
              <span className="text-2xl font-bold text-white">
                {formatNumberFull(Math.floor(user.dubaiCoin))}
              </span>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex bg-gray-800/30 rounded-lg p-1 mb-2">
          <motion.button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 rounded-md py-2 px-3 font-medium transition-all duration-200 text-sm ${
              activeTab === 'daily' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Daily tasks
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 rounded-md py-2 px-3 font-medium transition-all duration-200 text-sm ${
              activeTab === 'tasks' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Tasks list
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto px-4 pb-4 mt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DailyTasksSection />
            </motion.div>
          )}
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TasksListSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;