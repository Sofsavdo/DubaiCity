import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavButton from './NavButton';
import { CityIcon, MarketIcon, ProjectsIcon, AssetsIcon, TeamIcon, ProfileIcon } from '../Icons';

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
      icon: <CityIcon className="w-6 h-6" />, 
      key: 'Imperiya',
      color: 'from-amber-500 to-orange-600',
      activeColor: 'from-amber-400 to-orange-500'
    },
    { 
      label: 'Bozor', 
      icon: <MarketIcon className="w-6 h-6" />, 
      key: 'Bozor',
      color: 'from-green-500 to-emerald-600',
      activeColor: 'from-green-400 to-emerald-500'
    },
    { 
      label: 'Loyihalar', 
      icon: <ProjectsIcon className="w-6 h-6" />, 
      key: 'Loyihalar',
      color: 'from-blue-500 to-indigo-600',
      activeColor: 'from-blue-400 to-indigo-500'
    },

    { 
      label: 'Aktivlar', 
      icon: <AssetsIcon className="w-6 h-6" />, 
      key: 'Aktivlar',
      color: 'from-purple-500 to-violet-600',
      activeColor: 'from-purple-400 to-violet-500'
    },
    { 
      label: 'Jamoa', 
      icon: <TeamIcon className="w-6 h-6" />, 
      key: 'Jamoa',
      color: 'from-pink-500 to-rose-600',
      activeColor: 'from-pink-400 to-rose-500'
    },
    { 
      label: 'Profil', 
      icon: <ProfileIcon className="w-6 h-6" />, 
      key: 'Profil',
      color: 'from-cyan-500 to-teal-600',
      activeColor: 'from-cyan-400 to-teal-500'
    },
  ];

  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-slate-900/90 to-transparent backdrop-blur-xl border-t border-white/20"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glowing top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-r from-amber-400/10 via-purple-400/10 to-blue-400/10"></div>
        </div>

        <div className="relative flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;
            const badgeCount = getBadgeCount(tab.key);
            
            return (
              <motion.div
                key={tab.key}
                className="relative flex-1 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <motion.button
                  className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 shadow-xl' 
                      : 'hover:bg-slate-800/50'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Icon without background - just larger */}
                  <motion.div
                    className="relative flex items-center justify-center mb-1"
                    animate={isActive ? {
                      filter: [
                        "drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))",
                        "drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))",
                        "drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))"
                      ]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <motion.div
                      className={`${isActive ? 'text-amber-400' : 'text-gray-400'} scale-150`}
                      animate={isActive ? { scale: [1.5, 1.6, 1.5] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {tab.icon}
                    </motion.div>

                    {/* Badge for notifications */}
                    <AnimatePresence mode="wait">
                      {badgeCount > 0 && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center border border-black"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <span className="text-xs font-bold text-white">
                            {badgeCount > 9 ? '9+' : badgeCount}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className={`text-xs font-medium transition-all ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    {tab.label}
                  </motion.span>

                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>


      </div>
    </motion.footer>
  );
};

export default Nav;