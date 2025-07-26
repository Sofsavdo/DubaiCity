import { useGame } from "@/hooks/use-game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DAILY_REWARDS } from "@shared/schema";
import { formatNumber, showToast } from "@/lib/game-utils";
import { X, Gift, Coins } from "lucide-react";

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyRewardModal({ isOpen, onClose }: DailyRewardModalProps) {
  const { user } = useGame();
  const queryClient = useQueryClient();

  const claimRewardMutation = useMutation({
    mutationFn: async (day: number) => {
      const response = await apiRequest('POST', '/api/daily-rewards/claim', {
        userId: user?.id,
        day,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.telegramId] });
      queryClient.invalidateQueries({ queryKey: ['/api/daily-rewards', user?.id] });
      showToast('Daily reward claimed!', 'success');
      onClose();
    },
  });

  if (!isOpen || !user) return null;

  // Calculate current day (simplified logic)
  const today = new Date();
  const startDate = new Date(user.createdAt);
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(daysSinceStart % 12 + 1, 12);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-dubai-gold">Daily Reward</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-gray-300 text-sm mb-2">
            Day <span className="text-dubai-gold font-bold">{currentDay}</span> of 12
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-dubai-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / 12) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="reward-grid mb-4">
          {DAILY_REWARDS.map((reward) => (
            <div 
              key={reward.day} 
              className={`reward-item ${
                reward.day < currentDay ? 'claimed' : 
                reward.day === currentDay ? 'available' : 
                'unavailable'
              }`}
            >
              <div className="text-xs font-bold mb-1">Day {reward.day}</div>
              <div className="text-xs mb-1">{formatNumber(reward.reward)}</div>
              <Coins className="w-4 h-4 mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="text-center mb-4">
          <div className="bg-dubai-dark rounded-lg p-3">
            <Gift className="w-8 h-8 text-dubai-gold mx-auto mb-2" />
            <div className="text-dubai-gold font-bold text-lg">
              +{formatNumber(DAILY_REWARDS[currentDay - 1]?.reward || 0)}
            </div>
            <div className="text-gray-400 text-sm">Today's Reward</div>
          </div>
        </div>
        
        <button 
          onClick={() => claimRewardMutation.mutate(currentDay)}
          disabled={claimRewardMutation.isPending}
          className="w-full bg-dubai-gold text-dubai-dark font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {claimRewardMutation.isPending ? 'Claiming...' : 'Claim Reward'}
        </button>
      </div>
    </div>
  );
}
