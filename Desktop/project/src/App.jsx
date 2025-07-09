import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationProvider } from './context/NotificationContext';
import { useNotifier } from './hooks/useNotifier';
import { loadDataAndCalculateOffline } from './services/gameService';
import {
  formatNumberShort,
  calculateItemIncome,
  calculateItemCost,
  calculateEnergyCost,
  getLevelProgress,
  formatTime,
  calculateTapPower,
  calculateMaxEnergy,
} from './utils/helpers';
import initialData, { levelThresholds, levelNames, ADMIN_WALLET_ADDRESS, youtubeTasks } from './data/initialData';
import MyCity from './pages/MyCity';
import Marketplace from './pages/Marketplace';
import Projects from './pages/Projects';
import AssetsPage from './pages/Assets';
import CommunityPage from './pages/Community';
import Profile from './pages/Profile';
import Nav from './components/Nav/Nav';
import InputModal from './components/Common/InputModal';
import PaymentModal from './components/Common/PaymentModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('Imperiya');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalConfig, setInputModalConfig] = useState(null);
  const [paymentModalConfig, setPaymentModalConfig] = useState({ show: false, item: null });
  const [selectedGame, setSelectedGame] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [hasShownLoadNotification, setHasShownLoadNotification] = useState(false);
  const notifier = useNotifier();

  // Telegram Web App sozlamalari
  useEffect(() => {
    const WebApp = window.Telegram?.WebApp;
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();
      WebApp.HapticFeedback.impactOccurred('light');
    }
  }, []);

  // Ma'lumotlarni yuklash - faqat bir marta
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        const loadedData = await loadDataAndCalculateOffline();
        if (isMounted) {
          // Premium test rejimi uchun ma'lumotlarni yangilash
          const testUser = {
            ...loadedData.user,
            dubaiCoin: 5000000,
            totalEarned: 5000000,
            level: 10,
            isPremium: true,
            autoRobotLevel: 1,
            energy: 2000,
            maxEnergy: 2000,
            profilePictureUrl: 'https://placehold.co/80x80/FFD700/000000?text=👑',
            // Test uchun ba'zi itemlarni sotib olingan qilib qo'yamiz
            itemLevels: {
              '1': 5, // Energiya To'ldirish
              '2': 5, // Tap Kuchaytirish
              '5': 3, // Restoran Zanjiri
              '6': 2, // Mehmonxona Biznesi
              '10': 1, // Oltin Yaxta Skin
              '11': 1, // Neon Avatar
            }
          };
          
          // Energiya sig'imini yangilash
          testUser.maxEnergy = calculateMaxEnergy(testUser);
          testUser.energy = Math.min(testUser.energy, testUser.maxEnergy);
          
          setData({
            ...loadedData,
            user: testUser
          });
          setIsLoading(false);
          
          // Faqat bir marta bildirishnoma ko'rsatish
          if (!hasShownLoadNotification) {
            notifier.addNotification('Premium test rejimi faollashtirildi! 👑', 'success', 3000, 'premium-test');
            setHasShownLoadNotification(true);
          }
        }
      } catch (error) {
        console.error('Ma\'lumotlarni yuklashda xato:', error);
        if (isMounted) {
          notifier.addNotification('Ma\'lumotlarni yuklashda xato yuz berdi!', 'error', 3000, 'load-error');
          setIsLoading(false);
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Bo'sh dependency array - faqat bir marta ishga tushadi

  // Ma'lumotlarni localStorage'ga saqlash (debouncing)
  useEffect(() => {
    if (!data) return;
    const saveData = setTimeout(() => {
      localStorage.setItem('dubaiCityGameData_v17', JSON.stringify(data));
    }, 1000);
    return () => clearTimeout(saveData);
  }, [data]);

  // Tab o'zgarganda o'yinni tozalash
  useEffect(() => {
    if (activeTab !== 'Aktivlar') {
      setSelectedGame(null);
    }
  }, [activeTab]);

  const setUserState = useCallback((updater) => {
    setData((prev) => {
      if (!prev?.user) return prev;
      const newUser = typeof updater === 'function' ? updater(prev.user) : updater;
      return { ...prev, user: newUser };
    });
  }, []);

  // Passiv daromadni hisoblash - barcha kategoriyalardan
  const passiveIncome = useMemo(() => {
    if (!data?.user?.itemLevels || !data?.marketItems) return 0;
    let totalIncome = 0;
    for (const itemId in data.user.itemLevels) {
      const level = data.user.itemLevels[itemId];
      const item = data.marketItems.find((i) => i.id.toString() === itemId.toString());
      if (item && item.type === 'income' && level > 0) {
        totalIncome += calculateItemIncome(item, level, data.user);
      }
    }
    return totalIncome;
  }, [data?.user?.itemLevels, data?.marketItems, data?.user]);

  const incomePerSecond = useMemo(() => passiveIncome / 3600, [passiveIncome]);

  // Game loop optimallashtirilgan - faqat robot faol bo'lsa ishlaydi
  useEffect(() => {
    if (!data?.user) return;
    
    const gameLoop = setInterval(() => {
      setUserState((prev) => {
        if (!prev) return prev;
        
        // Faqat robot faol bo'lsa passiv daromad beradi
        const shouldGivePassiveIncome = prev.autoRobotLevel > 0;
        const multiplier = prev.isPremium ? 1.5 : 1;
        const newEnergy = Math.min(calculateMaxEnergy(prev), (prev.energy || 0) + 1);
        
        let updatedDubaiCoin = prev.dubaiCoin || 0;
        let updatedTotalEarned = prev.totalEarned || 0;
        
        if (shouldGivePassiveIncome) {
          updatedDubaiCoin += incomePerSecond * multiplier;
          updatedTotalEarned += incomePerSecond * multiplier;
        }
        
        return {
          ...prev,
          energy: newEnergy,
          maxEnergy: calculateMaxEnergy(prev),
          dubaiCoin: updatedDubaiCoin,
          totalEarned: updatedTotalEarned,
          lastOnlineTimestamp: Date.now(),
        };
      });
    }, 1000);
    return () => clearInterval(gameLoop);
  }, [setUserState, incomePerSecond, data?.user]);

  // Level o'sishi - real balansga asoslangan
  useEffect(() => {
    if (!data?.user?.dubaiCoin) return;
    const currentBalance = data.user.dubaiCoin;
    const currentLevel = data.user.level || 1;
    const { currentLevel: newLevel } = getLevelProgress(currentBalance, levelThresholds);
    if (newLevel > currentLevel) {
      setUserState((prev) => ({ 
        ...prev, 
        level: newLevel,
        maxEnergy: calculateMaxEnergy({...prev, level: newLevel})
      }));
      notifier.addNotification(
        `Tabriklaymiz! Siz ${levelNames[newLevel - 1] || newLevel}-darajaga o'tdingiz!`,
        'success',
        3000,
        `level-up-${newLevel}`
      );
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    }
  }, [data?.user?.dubaiCoin, data?.user?.level, setUserState, notifier]);

  // Offline daromadni ko'rsatish - faqat bir marta
  useEffect(() => {
    if (data?.offlineEarningsToClaim > 0 && !data.offlineEarningsShown) {
      notifier.addNotification(
        `Robot siz uchun ${formatNumberShort(data.offlineEarningsToClaim)} tanga yig'di!`,
        'success',
        5000,
        'offline-earnings'
      );
      setData(prev => ({ ...prev, offlineEarningsShown: true }));
    }
  }, [data?.offlineEarningsToClaim, notifier]);

  const handleClaimOfflineEarnings = useCallback(() => {
    if (!data?.offlineEarningsToClaim || data.offlineEarningsToClaim <= 0) return;
    const amountToClaim = data.offlineEarningsToClaim;
    setData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        dubaiCoin: (prev.user.dubaiCoin || 0) + amountToClaim,
        totalEarned: (prev.user.totalEarned || 0) + amountToClaim,
      },
      offlineEarningsToClaim: 0,
    }));
    notifier.addNotification(
      `Robot siz uchun ${formatNumberShort(amountToClaim)} tanga yig'di!`,
      'success',
      3000,
      'claim-offline'
    );
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  }, [data?.offlineEarningsToClaim, notifier]);

  const handleUpdateHistory = useCallback(
    (newEntry) => {
      setUserState((user) => {
        const updatedHistory = [newEntry, ...(user.tradeHistory || [])].slice(0, 10);
        return { ...user, tradeHistory: updatedHistory };
      });
    },
    [setUserState]
  );

  const openInputModal = useCallback((config) => {
    setInputModalConfig(config);
    setIsInputModalOpen(true);
    window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
  }, []);

  const openPaymentModal = useCallback((item) => {
    setPaymentModalConfig({ show: true, item });
    window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
  }, []);

  const openDonationModal = useCallback(() => {
    openInputModal({
      title: 'Homiylik qilish',
      placeholder: 'Summani kiriting ($)',
      inputType: 'number',
      onConfirm: (amount) => {
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
          notifier.addNotification('Noto\'g\'ri summa kiritildi', 'error', 2000, 'donation-error');
          return;
        }
        openPaymentModal({
          name: 'Homiylik',
          usdPrice: donationAmount,
          onConfirm: () => {
            setUserState((prev) => ({
              ...prev,
              totalDonated: (prev.totalDonated || 0) + donationAmount,
            }));
            notifier.addNotification('Homiyligingiz uchun tashakkur!', 'success', 3000, 'donation-success');
            window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
          },
        });
      },
    });
  }, [openInputModal, openPaymentModal, notifier, setUserState]);

  const handleUpgradeItem = useCallback(
    (item) => {
      if (!item || !data?.user) return;
      const WebApp = window.Telegram?.WebApp;
      if (WebApp) WebApp.HapticFeedback.impactOccurred('medium');
      
      if (item.usdPrice) {
        openPaymentModal({
          name: item.name,
          usdPrice: item.usdPrice,
          onConfirm: () => {
            setUserState((prev) => {
              if (item.type === 'robot') return { ...prev, autoRobotLevel: 1 };
              if (item.type === 'status') return { ...prev, isPremium: true };
              return prev;
            });
            notifier.addNotification(`Sotib olindi: ${item.name}`, 'success', 2000, `buy-${item.id}`);
            window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
          },
        });
        return;
      }
      
      const currentLevel = data.user?.itemLevels?.[item.id] || 0;
      const cost = calculateItemCost(item, currentLevel);
      
      if (data.user?.dubaiCoin < cost) {
        notifier.addNotification("Yetarli mablag' yo'q!", 'error', 2000, `buy-error-${item.id}`);
        return;
      }
      
      setUserState((prev) => {
        const newLevels = { ...prev.itemLevels, [item.id]: currentLevel + 1 };
        const updatedUser = {
          ...prev,
          dubaiCoin: prev.dubaiCoin - cost,
          upgradesToday: (prev.upgradesToday || 0) + 1,
          itemLevels: newLevels,
        };
        
        // Energiya sig'imini yangilash
        if (item.type === 'energy_limit') {
          updatedUser.maxEnergy = calculateMaxEnergy(updatedUser);
        }
        
        return updatedUser;
      });
      
      notifier.addNotification(`"${item.name}" yaxshilandi!`, 'success', 1500, `upgrade-${item.id}`);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
    },
    [data?.user, notifier, openPaymentModal, setUserState]
  );

  const handleBuyPromoCode = useCallback(() => {
    if (Math.floor(data?.user?.dubaiCoin || 0) < 10000) {
      notifier.addNotification("Yetarli mablag' yo'q!", 'error', 2000, 'promo-error');
      return;
    }
    
    setUserState((prev) => {
      const existingCodes = (prev.promoCodes || []).map(p => p.code);
      const promoData = initialData.generatePromoCodeForPartner('RANDOM', prev.id, existingCodes);
      
      // Foydalanuvchi allaqachon shu partnerni promo kodiga ega emasligini tekshirish
      const hasPartnerCode = (prev.promoCodes || []).some(p => p.partner === promoData.partner);
      if (hasPartnerCode) {
        // Agar shu partner kodi mavjud bo'lsa, boshqa partnerni tanlash
        const availablePartners = ['TEXNOMART', 'UZUM MARKET', 'OLCHA.UZ', 'MAKRO', 'KORZINKA.UZ', 'MEDIAPARK'];
        const usedPartners = (prev.promoCodes || []).map(p => p.partner);
        const unusedPartners = availablePartners.filter(p => !usedPartners.includes(p));
        
        if (unusedPartners.length === 0) {
          notifier.addNotification('Barcha promo kodlar allaqachon olingan!', 'info', 2000, 'promo-all-used');
          return prev;
        }
      }
      
      const newPromo = {
        id: Date.now(),
        partner: promoData.partner,
        code: promoData.code,
        description: promoData.description,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 kun
        link: promoData.link,
        createdAt: Date.now(),
        used: false,
      };
      
      return {
        ...prev,
        dubaiCoin: Math.floor(prev.dubaiCoin - 10000),
        promoCodes: [...(prev.promoCodes || []), newPromo],
      };
    });
    notifier.addNotification('Yangi promo-kod qo\'shildi!', 'success', 1500, 'promo-success');
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  }, [data?.user?.dubaiCoin, notifier, setUserState]);

  const handleClaimYoutubeReward = useCallback(
    (taskId, enteredCode) => {
      if (!enteredCode || enteredCode.trim() === '') {
        notifier.addNotification('Iltimos, yashirin kodni kiriting!', 'error', 2000, `youtube-error-${taskId}`);
        return;
      }
      const task = youtubeTasks.find((t) => t.id === taskId);
      if (!task) {
        notifier.addNotification('Bunday topshiriq mavjud emas.', 'error', 2000, `youtube-task-error-${taskId}`);
        return;
      }
      if (data?.user?.claimedYoutubeTasks?.includes(taskId)) {
        notifier.addNotification('Siz bu video uchun mukofotni allaqachon olgansiz!', 'info', 2000, `youtube-claimed-${taskId}`);
        return;
      }
      const isCodeValid = task.validCodes.includes(enteredCode.trim().toUpperCase());
      if (isCodeValid) {
        setUserState((currentUser) => {
          const rewardAmount = task.rewardAmount;
          return {
            ...currentUser,
            dubaiCoin: (currentUser.dubaiCoin || 0) + rewardAmount,
            totalEarned: (currentUser.totalEarned || 0) + rewardAmount,
            claimedYoutubeTasks: [...(currentUser.claimedYoutubeTasks || []), taskId],
          };
        });
        notifier.addNotification(
          `Tabriklaymiz! Siz ${formatNumberShort(task.rewardAmount)} tanga yutib oldingiz!`,
          'success',
          3000,
          `youtube-success-${taskId}`
        );
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
      } else {
        notifier.addNotification("Yashirin kod noto'g'ri. Qayta urinib ko'ring.", 'error', 2000, `youtube-invalid-${taskId}`);
      }
    },
    [data?.user?.claimedYoutubeTasks, notifier, setUserState]
  );

  const checkTaskClaimable = useCallback(
    (task, user) => {
      if (!task || !user) return false;
      switch (task.id) {
        case 2:
        case 3:
          return true;
        case 4:
          return Object.keys(user.itemLevels || {}).length > 0 || user.autoRobotLevel > 0;
        case 5:
          return (user.referrals || []).length > 0 && user.companyId !== null;
        default:
          return false;
      }
    },
    []
  );

  const checkDailyMissionClaimable = useCallback(
    (missionTemplate, user) => {
      if (!missionTemplate || !user) return false;
      switch (missionTemplate.type) {
        case 'tap':
          return (user.tapsToday || 0) >= missionTemplate.goal;
        case 'upgrade':
          return (user.upgradesToday || 0) >= missionTemplate.goal;
        case 'game':
          return (user.gamesPlayedToday || 0) >= missionTemplate.goal;
        case 'login':
          return true;
        default:
          return false;
      }
    },
    []
  );

  const handlePerformTask = useCallback(
    (task) => {
      const currentStatus = (data?.user?.taskStatus || {})[task.id] || 'not_started';
      if (currentStatus === 'not_started') {
        const WebApp = window.Telegram?.WebApp;
        if (task.url && WebApp) {
          WebApp.openTelegramLink(task.url);
          setUserState((user) => ({
            ...user,
            taskStatus: { ...(user.taskStatus || {}), [task.id]: 'pending_verification' },
          }));
          notifier.addNotification('Obuna tekshirilmoqda...', 'info', 2000, `task-${task.id}`);
          window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
        }
      } else if (currentStatus === 'pending_verification') {
        notifier.addNotification('Obuna tekshirilmoqda...', 'info', 2000, `task-pending-${task.id}`);
        setTimeout(() => handleClaimTask(task), 2000);
      }
    },
    [data?.user?.taskStatus, notifier, setUserState]
  );

  const handleClaimTask = useCallback(
    (task) => {
      if ((data?.user?.taskStatus || {})[task.id] === 'completed') return;
      const isSubscribed = true; // TODO: Haqiqiy obuna tekshiruvini qo'shing
      if (!isSubscribed) {
        notifier.addNotification("Siz kanalga obuna bo'lmagansiz!", 'error', 2000, `task-error-${task.id}`);
        return;
      }
      setUserState((prev) => {
        const rewardAmount = task.reward.amount;
        return {
          ...prev,
          dubaiCoin: (prev.dubaiCoin || 0) + rewardAmount,
          totalEarned: (prev.totalEarned || 0) + rewardAmount,
          taskStatus: { ...(prev.taskStatus || {}), [task.id]: 'completed' },
        };
      });
      notifier.addNotification(
        `Mukofot olindi: +${formatNumberShort(task.reward.amount)} tanga!`,
        'success',
        1500,
        `task-success-${task.id}`
      );
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    },
    [data?.user?.taskStatus, notifier, setUserState]
  );

  const handleActivateTapBoost = useCallback(() => {
    const now = Date.now();
    const user = data?.user;
    if (!user) return;
    const today = new Date().setHours(0, 0, 0, 0);
    const lastBoostDay = user?.lastTapBoostTimestamp
      ? new Date(user.lastTapBoostTimestamp).setHours(0, 0, 0, 0)
      : null;
    let currentBoostsUsed = user?.dailyTapBoostsUsed || 0;
    if (lastBoostDay !== today) currentBoostsUsed = 0;
    const maxBoosts = user.isPremium ? 5 : 3;
    if (currentBoostsUsed >= maxBoosts) {
      notifier.addNotification(`Bugunlik ${maxBoosts}x Tap limiti tugadi`, 'error', 2000, 'boost-error');
      return;
    }
    if (user?.activeTapBoostEnd && now < user.activeTapBoostEnd) {
      notifier.addNotification('Tezlatgich allaqachon faol', 'info', 2000, 'boost-active');
      return;
    }
    setUserState((prev) => ({
      ...prev,
      dailyTapBoostsUsed: lastBoostDay !== today ? 1 : (prev.dailyTapBoostsUsed || 0) + 1,
      activeTapBoostEnd: now + 60 * 1000,
      lastTapBoostTimestamp: now,
    }));
    notifier.addNotification('2x Tap faollashtirildi!', 'success', 2000, 'boost-activated');
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  }, [data?.user, notifier, setUserState]);

  const handleAdFinished = useCallback(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastAdDay = data?.user?.lastAdWatchTimestamp
      ? new Date(data.user.lastAdWatchTimestamp).setHours(0, 0, 0, 0)
      : null;
    const maxAds = data?.user?.isPremium ? 10 : 5;
    if (lastAdDay === today && data?.user?.dailyAdWatches >= maxAds) {
      notifier.addNotification('Kundalik reklama limiti tugadi!', 'error', 2000, 'ad-error');
      return;
    }
    setUserState((prev) => ({
      ...prev,
      dubaiCoin: prev.dubaiCoin + 500,
      totalEarned: prev.totalEarned + 500,
      dailyAdWatches: lastAdDay === today ? prev.dailyAdWatches + 1 : 1,
      lastAdWatchTimestamp: Date.now(),
    }));
    notifier.addNotification('Reklama ko\'rildi! +500 tanga!', 'success', 2000, 'ad-watched');
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  }, [data?.user, notifier, setUserState]);

  const handleClaimDaily = useCallback(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastClaim = data?.user?.lastDailyClaim
      ? new Date(data.user.lastDailyClaim).setHours(0, 0, 0, 0)
      : null;
    
    // Har qanday kun uchun 1 kun o'tkazib yuborsa streak reset bo'ladi
    const daysSinceLastClaim = lastClaim ? Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24)) : 0;
    const shouldResetStreak = daysSinceLastClaim > 1;
    
    if (lastClaim && today === lastClaim) {
      notifier.addNotification('Bugunlik bonus allaqachon olingan!', 'info', 2000, 'daily-claim');
      return;
    }
    
    const currentStreak = shouldResetStreak ? 0 : (data?.user?.dailyLoginStreak || 0);
    const nextDay = (currentStreak % 15) + 1;
    const rewardData = data?.dailyRewards.find((r) => r.day === nextDay);
    if (!rewardData) return;
    
    let notificationMessage = '';
    setUserState((prev) => {
      let updatedUser = { ...prev };
      const reward = rewardData.reward;
      switch (reward.type) {
        case 'coin':
          updatedUser.dubaiCoin = (updatedUser.dubaiCoin || 0) + reward.amount;
          updatedUser.totalEarned = (updatedUser.totalEarned || 0) + reward.amount;
          notificationMessage = `Kundalik bonus: +${formatNumberShort(reward.amount)}!`;
          break;
        case 'energy':
          updatedUser.energy = updatedUser.maxEnergy;
          notificationMessage = 'Kundalik bonus: Energiya to\'ldirildi!';
          break;
        case 'booster':
          updatedUser.activeBoosters = [
            ...(updatedUser.activeBoosters || []),
            { id: reward.name.toLowerCase().replace(/\s/g, '-'), duration: reward.duration },
          ];
          notificationMessage = `Kundalik bonus: ${reward.name} faollashtirildi!`;
          break;
        case 'avatar':
          updatedUser.profilePictureUrl = reward.imageUrl;
          notificationMessage = `Kundalik bonus: ${reward.name} avatar olindi!`;
          break;
        default:
          break;
      }
      updatedUser.dailyLoginStreak = nextDay;
      updatedUser.lastDailyClaim = Date.now();
      return updatedUser;
    });
    if (notificationMessage) {
      notifier.addNotification(notificationMessage, 'success', 3000, 'daily-reward');
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    }
  }, [data?.user, data?.dailyRewards, notifier, setUserState]);

  const handleClaimDailyMission = useCallback(
    (missionToClaim) => {
      let notificationMessage = '';
      setUserState((prev) => {
        const missionIndex = (prev.dailyMissions || []).findIndex(
          (m) => m.missionId === missionToClaim.missionId && !m.completed
        );
        if (missionIndex === -1) return prev;
        const template = data?.dailyMissionTemplates.find((t) => t.id === missionToClaim.missionId);
        if (!template || !checkDailyMissionClaimable(template, prev)) {
          notifier.addNotification('Missiya shartlari bajarilmagan!', 'error', 2000, `mission-error-${missionToClaim.missionId}`);
          return prev;
        }
        let updatedUser = { ...prev };
        const reward = template.reward;
        switch (reward.type) {
          case 'coin':
            updatedUser.dubaiCoin = (updatedUser.dubaiCoin || 0) + reward.amount;
            updatedUser.totalEarned = (updatedUser.totalEarned || 0) + reward.amount;
            notificationMessage = `+${formatNumberShort(reward.amount)} tanga!`;
            break;
          case 'energy':
            updatedUser.energy = Math.min(
              updatedUser.maxEnergy,
              (updatedUser.energy || 0) + reward.amount
            );
            notificationMessage = `+${reward.amount} energiya!`;
            break;
          default:
            break;
        }
        const newMissions = [...(prev.dailyMissions || [])];
        newMissions[missionIndex] = { ...newMissions[missionIndex], completed: true };
        updatedUser.dailyMissions = newMissions;
        return updatedUser;
      });
      if (notificationMessage) {
        notifier.addNotification(notificationMessage, 'success', 3000, `mission-${missionToClaim.missionId}`);
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
      }
    },
    [data?.user, data?.dailyMissions, data?.dailyMissionTemplates, notifier, setUserState, checkDailyMissionClaimable]
  );

  const handleInviteFriend = useCallback(
    (newCompanyName) => {
      setUserState((prev) => {
        const referralId = `${prev.id}_${Date.now()}`;
        const WebApp = window.Telegram?.WebApp;
        if (WebApp) {
          const botUsername = "DubaiCityUzBot"; // Bot username
          const inviteLink = `https://t.me/${botUsername}?start=ref_${referralId}`;
          const shareText = `Mening Dubay shahri o'yinimga qo'shiling va birgalikda boylik to'playmiz!`;
          const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
          WebApp.openTelegramLink(shareUrl);
          notifier.addNotification('Do\'st taklif qilindi!', 'success', 2000, `invite-${referralId}`);
          window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        }
        return {
          ...prev,
          referrals: [...(prev.referrals || []), { id: referralId, name: newCompanyName || 'Do\'st', wealth: 0 }],
          dubaiCoin: prev.dubaiCoin + 500, // Referal bonusi
          totalEarned: prev.totalEarned + 500,
        };
      });
    },
    [notifier, setUserState]
  );

  const handleCreateCompany = useCallback(
    (newCompanyName) => {
      if (data?.user?.dubaiCoin < 10000) {
        notifier.addNotification("Kompaniya yaratish uchun 10,000 DC kerak!", 'error', 2000, 'company-create-error');
        return;
      }
      
      setUserState((prev) => {
        const newCompanyId = Date.now().toString();
        setData((prevData) => ({
          ...prevData,
          companies: [
            ...(prevData.companies || []),
            {
              id: newCompanyId,
              name: newCompanyName,
              ownerId: prev.id,
              members: [{ id: prev.id, name: prev.username, wealth: prev.totalEarned, level: prev.level, profilePictureUrl: prev.profilePictureUrl }],
              totalWealth: prev.totalEarned,
              messages: [],
              announcements: [],
            },
          ],
        }));
        notifier.addNotification(`Kompaniya "${newCompanyName}" yaratildi!`, 'success', 2000, `company-${newCompanyId}`);
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        return {
          ...prev,
          dubaiCoin: prev.dubaiCoin - 10000,
          companyId: newCompanyId,
          companyName: newCompanyName,
        };
      });
    },
    [notifier, setUserState, data?.user?.dubaiCoin]
  );

  const handleSendMessage = useCallback(
    (companyId, text, type = 'chat') => {
      setData((prev) => {
        if (!prev.companies) return prev;
        const companyIndex = prev.companies.findIndex((c) => c.id === companyId);
        if (companyIndex === -1) return prev;
        const newMessage = {
          id: Date.now(),
          senderId: data?.user?.id,
          sender: data?.user?.username,
          text,
          type,
          timestamp: Date.now(),
        };
        const updatedCompanies = [...prev.companies];
        updatedCompanies[companyIndex] = {
          ...updatedCompanies[companyIndex],
          [type === 'chat' ? 'messages' : 'announcements']: [
            ...(updatedCompanies[companyIndex][type === 'chat' ? 'messages' : 'announcements'] || []),
            newMessage,
          ],
        };
        return { ...prev, companies: updatedCompanies };
      });
      notifier.addNotification('Xabar yuborildi!', 'success', 2000, `message-${companyId}`);
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    },
    [notifier, data?.user?.username, data?.user?.id]
  );

  const handleJoinCompany = useCallback(
    (companyId) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const company = data?.companies.find((c) => c.id === companyId);
        if (!company) {
          notifier.addNotification('Kompaniya topilmadi!', 'error', 2000, `join-error-${companyId}`);
          return prev;
        }
        setData((prevData) => {
          const updatedCompanies = prevData.companies.map((c) =>
            c.id === companyId
              ? {
                  ...c,
                  members: [
                    ...(c.members || []),
                    {
                      id: prev.id,
                      name: prev.username,
                      wealth: prev.totalEarned,
                      level: prev.level,
                      profilePictureUrl: prev.profilePictureUrl,
                    },
                  ],
                  totalWealth: (c.totalWealth || 0) + prev.totalEarned,
                }
              : c
          );
          return { ...prevData, companies: updatedCompanies };
        });
        notifier.addNotification("Kompaniyaga qo'shildingiz!", 'success', 2000, `join-${companyId}`);
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        return {
          ...prev,
          companyId,
          companyName: company.name,
        };
      });
    },
    [notifier, setUserState, data?.companies, data?.user]
  );

  const handleLeaveCompany = useCallback(() => {
    setUserState((prev) => {
      if (!prev || !prev.companyId) return prev;
      setData((prevData) => {
        const updatedCompanies = prevData.companies.map((c) =>
          c.id === prev.companyId
            ? {
                ...c,
                members: c.members.filter((m) => m.id !== prev.id),
                totalWealth: c.totalWealth - prev.totalEarned,
              }
            : c
        );
        return { ...prevData, companies: updatedCompanies };
      });
      notifier.addNotification('Kompaniyadan chiqdingiz!', 'success', 2000, `leave-${prev.companyId}`);
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
      return {
        ...prev,
        companyId: null,
        companyName: null,
      };
    });
  }, [notifier, setUserState]);

  const handleDeleteCompany = useCallback(() => {
    setUserState((prev) => {
      if (!prev || !prev.companyId) return prev;
      setData((prevData) => ({
        ...prevData,
        companies: prevData.companies.filter((c) => c.id !== prev.companyId),
      }));
      notifier.addNotification("Kompaniya o'chirildi!", 'success', 2000, `delete-company-${prev.companyId}`);
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
      return {
        ...prev,
        companyId: null,
        companyName: null,
      };
    });
  }, [notifier, setUserState]);

  const handleRenameCompany = useCallback(
    (newName) => {
      setUserState((prev) => {
        if (!prev || !prev.companyId) return prev;
        setData((prevData) => {
          const updatedCompanies = prevData.companies.map((c) =>
            c.id === prev.companyId ? { ...c, name: newName } : c
          );
          return { ...prevData, companies: updatedCompanies };
        });
        notifier.addNotification(`Kompaniya "${newName}" deb o'zgartirildi!`, 'success', 2000, `rename-${prev.companyId}`);
        window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        return {
          ...prev,
          companyName: newName,
        };
      });
    },
    [notifier, setUserState]
  );

  if (isLoading || !data || !data.user) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-cyan-400 border-gray-700 rounded-full neon-glow"
        />
      </motion.div>
    );
  }

  const props = {
    user: data.user,
    setUser: setUserState,
    passiveIncome,
    handleUpgradeItem,
    handleBuyPromoCode,
    handleAdFinished,
    marketItems: data.marketItems,
    availablePromoCodes: data.availablePromoCodes,
    handleUpdateHistory,
    exchangeRate: data.exchangeRate,
    setSelectedGame,
    onGamePlayed: () =>
      setUserState((prev) => ({
        ...prev,
        gamesPlayedToday: (prev.gamesPlayedToday || 0) + 1,
      })),
    tasks: data.tasks,
    dailyMissionTemplates: data.dailyMissionTemplates,
    checkTaskClaimable,
    checkDailyMissionClaimable,
    handlePerformTask,
    handleClaimTask,
    handleClaimDaily,
    handleClaimDailyMission,
    handleInviteFriend,
    handleJoinCompany,
    handleLeaveCompany,
    handleCreateCompany,
    handleSendMessage,
    handleActivateTapBoost,
    companies: data.companies,
    leaderboard: data.leaderboard,
    donators: data.donators,
    levelNames,
    levelThresholds,
    openInputModal,
    openPaymentModal,
    openDonationModal,
    isTapBoostActive: data.user?.activeTapBoostEnd && Date.now() < data.user.activeTapBoostEnd,
    handleDeleteCompany,
    handleRenameCompany,
    youtubeTasks: data.youtubeTasks,
    handleClaimYoutubeReward,
    offlineEarningsToClaim: data.offlineEarningsToClaim,
    handleClaimOfflineEarnings,
  };

  return (
    <NotificationProvider>
      <div
        className="relative min-h-screen text-white flex flex-col max-w-lg mx-auto bg-gradient-to-b from-gray-900 to-black"
        style={{ height: '100vh' }}
      >
        <div
          className="flex-grow overflow-hidden"
          style={{ display: selectedGame ? 'none' : 'block', opacity: isPending ? 0.7 : 1 }}
          role="main"
          aria-label="Asosiy o'yin oynasi"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {({
                Imperiya: <MyCity {...props} />,
                Bozor: <Marketplace {...props} />,
                Loyihalar: <Projects {...props} />,
                Aktivlar: <AssetsPage {...props} selectedGame={selectedGame} setSelectedGame={setSelectedGame} />,
                Jamoa: <CommunityPage {...props} />,
                Profil: <Profile {...props} leaderboard={data.leaderboard} />,
              })[activeTab] || <MyCity {...props} />}
            </motion.div>
          </AnimatePresence>
        </div>
        {selectedGame === 'scratch' && (
          <AssetsPage {...props} selectedGame={selectedGame} setSelectedGame={setSelectedGame} />
        )}
        {(selectedGame === 'casino-slots' || selectedGame === 'roulette' || selectedGame === 'crash') && (
          <AssetsPage {...props} selectedGame={selectedGame} setSelectedGame={setSelectedGame} />
        )}
        {!selectedGame && (
          <Nav activeTab={activeTab} setActiveTab={(tab) => startTransition(() => setActiveTab(tab))} />
        )}
        <InputModal
          show={isInputModalOpen}
          onClose={() => setIsInputModalOpen(false)}
          config={inputModalConfig}
          user={data.user}
        />
        <PaymentModal
          show={paymentModalConfig.show}
          onClose={() => setPaymentModalConfig({ show: false, item: null })}
          item={paymentModalConfig.item}
          user={data.user}
          onPaymentSuccess={paymentModalConfig.item?.onConfirm}
          ADMIN_WALLET_ADDRESS={ADMIN_WALLET_ADDRESS}
        />
      </div>
    </NotificationProvider>
  );
};

export default React.memo(App);