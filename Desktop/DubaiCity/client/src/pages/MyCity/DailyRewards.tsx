
import React, { useState, useEffect } from 'react';

interface DailyRewardsProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  notifier: any;
}

const DailyRewards: React.FC<DailyRewardsProps> = ({ user, setUser, notifier }) => {
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
    const now = new Date();
    
    if (!lastClaim || now.getTime() - lastClaim.getTime() >= 24 * 60 * 60 * 1000) {
      setCanClaim(true);
    }
  }, [user.lastDailyReward]);

  const claimDailyReward = () => {
    if (!canClaim) return;

    const streak = user.dailyStreak || 0;
    const newStreak = streak + 1;
    const baseReward = 1000;
    const streakBonus = Math.min(newStreak * 500, 10000); // Maksimum 10k bonus
    const totalReward = baseReward + streakBonus;

    setUser(prev => ({
      ...prev,
      coins: prev.coins + totalReward,
      dailyStreak: newStreak,
      lastDailyReward: new Date().toISOString()
    }));

    if (notifier) {
      notifier.addNotification(
        `Kunlik mukofot olindi! +${totalReward.toLocaleString()} coin (${newStreak} kun ketma-ket)`, 
        'success', 
        4000
      );
    }

    setCanClaim(false);
  };

  const streakReward = Math.min((user.dailyStreak || 0) * 500, 10000);

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">🎁 Kunlik Mukofot</h3>
          <p className="text-yellow-100 text-sm">
            Streak: {user.dailyStreak || 0} kun | Bonus: +{streakReward.toLocaleString()}
          </p>
        </div>
        <button
          onClick={claimDailyReward}
          disabled={!canClaim}
          className={`px-4 py-2 rounded-lg font-bold ${
            canClaim 
              ? 'bg-white text-orange-600 hover:bg-yellow-100' 
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          } transition-colors`}
        >
          {canClaim ? 'Olish' : 'Kutish'}
        </button>
      </div>
    </div>
  );
};

export default DailyRewards;
