import { useGame } from "@/hooks/use-game";
import { getEnergyRefillTime } from "@/lib/game-utils";
import { Zap, Clock } from "lucide-react";

export function EnergyBar() {
  const { user } = useGame();

  if (!user) return null;

  const energyPercent = (user.energy / user.maxEnergy) * 100;
  const refillTime = getEnergyRefillTime(
    user.lastEnergyRefill,
    user.energy,
    user.maxEnergy
  );

  return (
    <div className="px-4 mb-6">
      <div className="bg-dubai-card rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-dubai-red mr-2" />
            <span className="text-sm font-medium text-white">Energy</span>
          </div>
          <span className="text-sm text-gray-400">
            {user.energy} / {user.maxEnergy}
          </span>
        </div>
        <div className="bg-gray-700 rounded-full h-3">
          <div 
            className="energy-bar"
            style={{ width: `${energyPercent}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {refillTime === "Full" ? "Energy full" : `Refills in ${refillTime}`}
        </div>
      </div>
    </div>
  );
}
