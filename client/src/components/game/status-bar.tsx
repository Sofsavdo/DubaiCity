import { useGame } from "@/hooks/use-game";
import { formatNumber } from "@/lib/game-utils";
import { Coins, Zap, Crown } from "lucide-react";

export function StatusBar() {
  const { user } = useGame();

  if (!user) return null;

  return (
    <div className="px-4 py-3 bg-dubai-overlay backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-dubai-card rounded-full px-3 py-1">
            <Coins className="w-4 h-4 text-dubai-gold mr-2" />
            <span className="text-dubai-gold font-bold text-lg">
              {formatNumber(user.coins)}
            </span>
          </div>
          <div className="flex items-center bg-dubai-card rounded-full px-3 py-1">
            <Zap className="w-4 h-4 text-dubai-red mr-2" />
            <span className="text-dubai-red font-bold">
              {user.energy}
            </span>
            <span className="text-gray-300">/{user.maxEnergy}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select className="bg-dubai-card border-0 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-dubai-gold">
            <option value="uz">🇺🇿 O'zbek</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="en">🇬🇧 English</option>
          </select>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-dubai-gold text-dubai-dark px-2 py-1 rounded text-xs font-bold">
              PREVIEW
            </div>
          )}
          <div className="w-8 h-8 bg-dubai-gold rounded-full flex items-center justify-center">
            <span className="text-dubai-dark font-bold text-sm">
              {user.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
