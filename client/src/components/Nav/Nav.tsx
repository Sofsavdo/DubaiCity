
import React from 'react';
import { motion } from 'framer-motion';

const Nav = ({ activeTab, setActiveTab, tasks, dailyMissions, companies, user }) => {
  const getBadgeCount = (tab) => {
    if (!user) return 0;
    switch (tab) {
      case 'Loyihalar':
        return (
          (tasks?.filter((t) => t.status !== 'completed').length || 0) +
          (dailyMissions?.filter((m) => !m.completed).length || 0)
        );
      case 'Jamoa':
        return companies?.find((c) => c.id === user.companyId)?.messages?.length || 0;
      case 'Aktivlar':
        return user?.dailyAdWatches < (user.isPremium ? 10 : 5) ? 1 : 0;
      default:
        return 0;
    }
  };

  const tabs = [
    { 
      label: 'Imperiya', 
      icon: <span className="text-lg">🏛️</span>, 
      key: 'Shahar'
    },
    { 
      label: 'Bozor', 
      icon: <span className="text-lg">🏪</span>, 
      key: 'Bozor'
    },
    { 
      label: 'Loyihalar', 
      icon: <span className="text-lg">🎯</span>, 
      key: 'Loyihalar'
    },
    { 
      label: 'Aktivlar', 
      icon: <span className="text-lg">⚡</span>, 
      key: 'Aktivlar'
    },
    { 
      label: 'Jamoa', 
      icon: <span className="text-lg">👥</span>, 
      key: 'Jamoa'
    },
    { 
      label: 'Profil', 
      icon: <span className="text-lg">👤</span>, 
      key: 'Profil'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
      <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const badgeCount = getBadgeCount(tab.key);

          return (
            <button
              key={tab.key}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              onClick={() => {
                setActiveTab(tab.key);
                window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
              }}
            >
              {/* Icon */}
              <div className={`mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {tab.icon}
              </div>

              {/* Label */}
              <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {tab.label}
              </span>

              {/* Badge for notifications */}
              {badgeCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Nav;
