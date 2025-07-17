import React from 'react';
import { formatNumberShort } from '../../utils/helpers';

const LevelProgressBar = ({ user, levelNames, levelThresholds }) => {
    // Xatolikni oldini olish uchun propslar mavjudligini tekshirish
    if (!user || !levelNames || !levelThresholds) {
        return <div className="w-full h-10"></div>; // Bo'sh joy qaytaramiz
    }
    
    const currentLevel = user.level || 1;
    const currentLevelIndex = currentLevel - 1;
    
    const currentLevelRequirement = levelThresholds[currentLevelIndex] || 0;
    const nextLevelRequirement = levelThresholds[currentLevel];

    let progressPercentage = 100;
    
    if (nextLevelRequirement !== undefined && nextLevelRequirement > currentLevelRequirement) {
        const totalNeededForLevel = nextLevelRequirement - currentLevelRequirement;
        const earnedForThisLevel = (user.totalEarned || 0) - currentLevelRequirement;
        progressPercentage = Math.max(0, Math.min((earnedForThisLevel / totalNeededForLevel) * 100, 100));
    }

    return (
         <div className="w-full max-w-sm px-4">
            <div className="flex justify-between text-sm mb-1 text-gray-300">
                <span className="font-bold text-yellow-300">{levelNames[currentLevelIndex] || 'Amir'}</span>
                <span>Daraja {currentLevel}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-4 border border-slate-700 p-0.5 relative">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                <div className="absolute inset-0 flex justify-center items-center text-xs font-bold text-white" style={{textShadow: '0 0 2px black'}}>
                    {formatNumberShort(user.totalEarned || 0)} / {nextLevelRequirement ? formatNumberShort(nextLevelRequirement) : 'MAX'}
                </div>
            </div>
        </div>
    );
};

export default LevelProgressBar;