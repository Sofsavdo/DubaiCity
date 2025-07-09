import React from 'react';
import { motion } from 'framer-motion';
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
    { label: 'Imperiya', icon: <CityIcon className="w-6 h-6" />, key: 'Imperiya' },
    { label: 'Bozor', icon: <MarketIcon className="w-6 h-6" />, key: 'Bozor' },
    { label: 'Loyihalar', icon: <ProjectsIcon className="w-6 h-6" />, key: 'Loyihalar' },
    { label: 'Aktivlar', icon: <AssetsIcon className="w-6 h-6" />, key: 'Aktivlar' },
    { label: 'Jamoa', icon: <TeamIcon className="w-6 h-6" />, key: 'Jamoa' },
    { label: 'Profil', icon: <ProfileIcon className="w-6 h-6" />, key: 'Profil' },
  ];

  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-md border-t border-white/10 neon-glow"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center p-1 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavButton
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
            }}
            badgeCount={getBadgeCount(tab.key)}
          />
        ))}
      </div>
    </motion.footer>
  );
};

export default Nav;