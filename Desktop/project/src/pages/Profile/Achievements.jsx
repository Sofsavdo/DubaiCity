import React from 'react';

const Achievements = ({ achievementTemplates, unlockedAchievements }) => {
     return (
         <div>
             <h3 className="text-lg font-bold mb-3 mt-4">Yutuqlar</h3>
             <div className="grid grid-cols-3 gap-4">
                 {/* O'ZGARTIRISH: (achievementTemplates || []) - prop kelmasa, bo'sh massiv bilan ishlaydi */}
                 {(achievementTemplates || []).map(ach => {
                     const isUnlocked = unlockedAchievements.includes(ach.id);
                     return (
                         <div key={ach.id} title={ach.description} className={`glass-card aspect-square flex flex-col items-center justify-center p-2 text-center transition-all ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                             <span className="text-4xl">{ach.icon}</span>
                             <p className={`mt-2 text-xs font-bold ${isUnlocked ? 'text-yellow-300' : 'text-gray-400'}`}>{ach.name}</p>
                         </div>
                     );
                 })}
             </div>
         </div>
     )
}

export default Achievements;