import React, { useState, useMemo, useCallback } from 'react';
import { CheckIcon } from '../../components/Icons';
import { formatNumberShort } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';
import initialData from '../../data/initialData';

const Projects = ({
  tasks = [],
  dailyMissionTemplates = [],
  user,
  handleClaimTask,
  handlePerformTask,
  handleClaimDailyMission,
  handleClaimDaily,
  checkTaskClaimable = () => false,
  checkDailyMissionClaimable = () => false,
}) => {
  const [projectsTab, setProjectsTab] = useState('daily');

  const renderReward = useCallback((reward) => {
    if (!reward) return '';
    switch (reward.type) {
      case 'coin':
        return <span className="font-bold text-yellow-400">{formatNumberShort(reward.amount)}</span>;
      case 'booster':
        return <span className="font-bold text-blue-400">{reward.name} ({reward.duration})</span>;
      case 'energy':
        return (
          <span className="font-bold text-cyan-400">
            {reward.amount === 'full' ? 'To\'liq' : `+${reward.amount}`} Energiya
          </span>
        );
      default:
        return '';
    }
  }, []);

  const renderDailyRewardText = useCallback((reward) => {
    if (!reward) return '';
    switch (reward.type) {
      case 'coin':
        return `${formatNumberShort(reward.amount)}`;
      case 'booster':
        return reward.name;
      case 'energy':
        return 'Energiya';
      default:
        return '';
    }
  }, []);

  const TaskCard = React.memo(({ task }) => {
    const taskStatus = user?.taskStatus?.[task.id] || 'not_started';
    const isPremiumTask = task.category === 'special' && task.premiumOnly && !user?.isPremium;
    let buttonText = 'Bajarish';
    let buttonAction = () => handlePerformTask(task);
    let isDisabled = isPremiumTask || taskStatus === 'completed';

    if (task.action === 'telegram_subscribe' || task.action === 'instagram_follow' || task.action === 'youtube_subscribe' || task.action === 'twitter_follow' || task.action === 'tiktok_follow') {
      switch (taskStatus) {
        case 'not_started':
          buttonText = 'Obuna bo\'lish';
          break;
        case 'pending_verification':
          buttonText = 'Tekshirish';
          break;
        case 'completed':
          buttonText = 'Olingan';
          isDisabled = true;
          break;
        default:
          buttonText = 'Bajarish';
      }
    } else {
      buttonAction = () => handleClaimTask(task);
      buttonText = taskStatus === 'completed' ? 'Olingan' : isDisabled ? 'Bajarilmagan' : 'Olish';
    }

    return (
      <div className={`p-2 bg-gray-800/50 border border-gray-600 rounded-lg ${isDisabled && taskStatus === 'completed' ? 'opacity-50' : ''}`}>
        <p className="font-bold text-white text-xs">{task.description || 'Vazifa'}</p>
        <p className="text-xs my-1 text-gray-300">Mukofot: {renderReward(task.reward)}</p>
        {isPremiumTask && (
          <p className="text-xs text-yellow-300 mb-1">Faqat Premium foydalanuvchilar uchun</p>
        )}
        <button
          onClick={() => {
            buttonAction();
            window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
          }}
          disabled={isDisabled}
          className="w-full mt-1 bg-green-600 text-white font-bold py-1 px-2 rounded-lg disabled:bg-gray-600 disabled:opacity-70 hover:bg-green-700 transition-colors duration-200 text-xs"
        >
          {buttonText}
        </button>
      </div>
    );
  });

  const DailyLogin = React.memo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastClaimDate = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    if (lastClaimDate) lastClaimDate.setHours(0, 0, 0, 0);
    
    const daysSinceLastClaim = lastClaimDate ? Math.floor((today.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const shouldResetStreak = daysSinceLastClaim > 1;
    
    const canClaimToday = !lastClaimDate || today.getTime() > lastClaimDate.getTime();
    const currentStreak = shouldResetStreak ? 0 : (user?.dailyLoginStreak || 0);
    const streakProgress = Math.min((currentStreak / 15) * 100, 100);

    return (
      <div className="p-2 bg-gray-800/50 border border-gray-600 rounded-lg">
        <h2 className="text-sm font-bold text-white mb-2">Kundalik Kirish Bonusi</h2>
        <p className="text-xs text-gray-400 mb-2">
          Seriyangiz: <span className="font-bold text-yellow-400">{currentStreak} kun</span>
        </p>
        {shouldResetStreak && daysSinceLastClaim > 1 && (
          <p className="text-xs text-red-400 mb-2">
            Davomiylik buzildi! Qaytadan boshlanadi.
          </p>
        )}
        <div className="w-full bg-black/50 rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${streakProgress}%` }}
          />
        </div>
        <div className="grid grid-cols-5 gap-1">
          {initialData.dailyRewards.slice(0, 15).map((item) => {
            const isClaimed = item.day <= currentStreak;
            const isClaimable = item.day === currentStreak + 1 && canClaimToday;
            return (
              <div
                key={item.day}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg p-1 text-center transition-all duration-200 bg-black/20 border border-gray-600 ${
                  isClaimed ? 'bg-yellow-400/20 border-yellow-500' : ''
                } ${isClaimable ? 'cursor-pointer hover:border-yellow-400 animate-pulse' : 'opacity-70'}`}
                onClick={isClaimable ? () => {
                  handleClaimDaily();
                  window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
                } : null}
              >
                {isClaimed ? (
                  <CheckIcon className="text-green-400 w-3 h-3" />
                ) : (
                  <>
                    <p className="text-xs text-gray-400">Kun {item.day}</p>
                    <p className="text-xs font-bold text-yellow-300 mt-1">
                      {renderDailyRewardText(item.reward)}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  const DailyMissions = React.memo(() => (
    <div>
      <h2 className="text-sm font-bold text-white mb-2">Kundalik Missiyalar</h2>
      <div className="space-y-2">
        {user?.dailyMissions && user.dailyMissions.length > 0 ? (
          user.dailyMissions.map((mission, index) => {
            const template = dailyMissionTemplates.find((t) => t.id === mission.missionId);
            if (!template) return null;
            const isCompleted = mission.completed;
            const canClaim = checkDailyMissionClaimable(template, user);

            return (
              <div
                key={index}
                className={`p-2 bg-gray-800/50 border border-gray-600 rounded-lg flex justify-between items-center ${isCompleted ? 'opacity-50' : ''}`}
              >
                <div>
                  <p className="font-bold text-white text-xs">{template.description}</p>
                  <p className="text-xs my-1 text-gray-300">Mukofot: {renderReward(template.reward)}</p>
                </div>
                <button
                  onClick={() => {
                    handleClaimDailyMission(mission);
                    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
                  }}
                  disabled={isCompleted || !canClaim}
                  className="bg-green-600 text-white font-bold py-1 px-2 rounded-lg disabled:bg-gray-600 hover:bg-green-700 transition-colors duration-200 text-xs"
                >
                  {isCompleted ? 'Olingan' : canClaim ? 'Olish' : 'Bajarish'}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center pt-4 text-xs">Bugungi missiyalar yo'q.</p>
        )}
      </div>
    </div>
  ));

  const TasksTab = React.memo(() => {

    // Remove duplicate tasks by filtering unique IDs
    const uniqueTasks = tasks.filter((task, index, self) => 
      index === self.findIndex(t => t.id === task.id)
    );
    
    const taskCategories = useMemo(
      () => ({
        'Premium Vazifalar': uniqueTasks.filter((t) => t.category === 'social'),
        'Maxsus Vazifalar': uniqueTasks.filter((t) => t.category === 'special'),
      }),
      [uniqueTasks]
    );

    return (
      <div className="space-y-4">
        {Object.keys(taskCategories).map((category) => (
          taskCategories[category].length > 0 && (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-bold text-white">{category}</h2>
                {category === 'Premium Vazifalar' && (
                  <span className="bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded text-xs font-bold">👑 PREMIUM</span>
                )}
              </div>
              <div className="space-y-2">
                {taskCategories[category].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  });

  if (!user || !tasks || !dailyMissionTemplates) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black text-white">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
      {/* Header with balance */}
      <div className="p-2 flex-shrink-0">
        <h1 className="text-lg font-bold text-yellow-400 mb-1 text-center">Loyihalar</h1>
        
        {/* Balance display */}
        <BalanceDisplay user={user} size="medium" />
        
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-1 flex mb-1">
          <button
            onClick={() => {
              setProjectsTab('daily');
              window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
            }}
            className={`flex-1 rounded py-1 font-bold transition-colors text-xs ${
              projectsTab === 'daily' ? 'bg-gray-700 text-white' : 'text-gray-400'
            }`}
          >
            Kundalik
          </button>
          <button
            onClick={() => {
              setProjectsTab('tasks');
              window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
            }}
            className={`flex-1 rounded py-1 font-bold transition-colors text-xs ${
              projectsTab === 'tasks' ? 'bg-gray-700 text-white' : 'text-gray-400'
            }`}
          >
            Vazifalar
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="space-y-4 transition-opacity duration-200">
          {projectsTab === 'daily' && (
            <>
              <DailyMissions />
              <DailyLogin />
            </>
          )}
          {projectsTab === 'tasks' && <TasksTab />}
        </div>
      </div>
    </div>
  );
};

export default Projects;