import { useGame } from "@/hooks/use-game";
import { StatusBar } from "@/components/game/status-bar";
import { TapButton } from "@/components/game/tap-button";
import { EnergyBar } from "@/components/game/energy-bar";
import { BottomNavigation } from "@/components/game/bottom-navigation";
import { DailyRewardModal } from "@/components/modals/daily-reward-modal";
import { ReferralModal } from "@/components/modals/referral-modal";
import { getCurrentLevel, getNextLevel, getProgressPercentage } from "@/lib/game-utils";
import { Gift, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, isLoading } = useGame();
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dubai-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dubai-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">🏙️ Loading Dubai City...</div>
          <div className="text-gray-400 text-sm mt-2">Initializing your empire</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dubai-dark">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🏙️</div>
          <h1 className="text-2xl font-bold text-dubai-gold mb-4">Dubai City</h1>
          <div className="text-white text-lg mb-4">
            {process.env.NODE_ENV === 'development' ? 
              'Preview Mode - Testing Dubai City!' : 
              'Welcome to Dubai City!'}
          </div>
          <div className="text-gray-400 text-sm mb-6">
            {process.env.NODE_ENV === 'development' && (
              <span className="block text-dubai-gold">
                🔧 Development Preview Mode Active<br/>
                <span className="text-xs">You can test all features here before deploying to Telegram</span>
              </span>
            )}
            {process.env.NODE_ENV !== 'development' && (
              <span>This game is designed for Telegram Web App.</span>
            )}
          </div>
          {process.env.NODE_ENV !== 'development' && (
            <a 
              href="https://t.me/DubaiCITY_robot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-dubai-gold text-dubai-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              🚀 Open in Telegram
            </a>
          )}
          {process.env.NODE_ENV === 'development' && (
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="block w-full bg-dubai-gold text-dubai-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                🔄 Reload Preview
              </button>
              <div className="text-xs text-gray-500">
                Preview mode simulates Telegram Web App environment
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentLevel = getCurrentLevel(user.experience);
  const nextLevel = getNextLevel(user.level);
  const progressPercent = getProgressPercentage(user.experience, user.level);

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col">
        {/* Main Game Area */}
        <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
          {/* Empire Level Display */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-dubai-gold mb-2">
              {user.empireTitle}
            </h2>
            <div className="bg-dubai-card rounded-full px-4 py-2 inline-block">
              <span className="text-sm text-gray-300">Level </span>
              <span className="text-dubai-gold font-bold">{user.level}</span>
              <span className="text-sm text-gray-300"> / 14</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mb-8">
            <div className="bg-dubai-card rounded-full h-2 mb-2">
              <div 
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              {user.experience.toLocaleString()} / {nextLevel?.requiredXP.toLocaleString() || "MAX"} XP
            </div>
          </div>

          {/* Tap Button */}
          <TapButton />
        </div>

        {/* Energy Bar */}
        <EnergyBar />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Buttons */}
      <div className="fixed top-20 right-4 z-20 space-y-3">
        <button
          onClick={() => setShowDailyReward(true)}
          className="floating-button bg-dubai-gold"
        >
          <Gift className="w-5 h-5 text-dubai-dark" />
        </button>
        
        <button
          onClick={() => setShowReferral(true)}
          className="floating-button bg-dubai-blue"
        >
          <Users className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Modals */}
      <DailyRewardModal 
        isOpen={showDailyReward} 
        onClose={() => setShowDailyReward(false)}
      />
      <ReferralModal 
        isOpen={showReferral} 
        onClose={() => setShowReferral(false)}
      />
    </div>
  );
}
