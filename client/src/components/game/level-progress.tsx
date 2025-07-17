import { useGame } from "@/hooks/use-game";
import { getCurrentLevel, getNextLevel, getProgressPercentage } from "@/lib/game-utils";
import { Crown, TrendingUp } from "lucide-react";

export function LevelProgress() {
  const { user } = useGame();

  if (!user) return null;

  const currentLevel = getCurrentLevel(user.experience);
  const nextLevel = getNextLevel(user.level);
  const progressPercent = getProgressPercentage(user.experience, user.level);

  return (
    <div className="bg-dubai-card rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-dubai-gold mr-2" />
          <span className="text-white font-semibold">Empire Progress</span>
        </div>
        <div className="flex items-center text-dubai-gold">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm">Level {user.level}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>{user.empireTitle}</span>
          <span>{nextLevel ? nextLevel.title : "Max Level"}</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>{user.experience.toLocaleString()} XP</span>
        <span>{nextLevel ? nextLevel.requiredXP.toLocaleString() : "MAX"} XP</span>
      </div>
    </div>
  );
}
