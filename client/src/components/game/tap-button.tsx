import { useGame } from "@/hooks/use-game";
import { useTelegram } from "@/hooks/use-telegram";
import { createCoinAnimation, vibrate } from "@/lib/game-utils";
import { Building } from "lucide-react";
import { useRef, useState } from "react";

export function TapButton() {
  const { user, tap } = useGame();
  const { tg } = useTelegram();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = (event: React.MouseEvent) => {
    if (!user || user.energy < 1) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Create coin animation
      createCoinAnimation(event.clientX, event.clientY, user.coinsPerTap);
    }

    // Vibrate on tap
    vibrate(50);
    
    // Haptic feedback for Telegram
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }

    // Animate button
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    // Perform tap
    tap(1);
  };

  if (!user) return null;

  return (
    <div className="relative flex flex-col items-center">
      <div
        ref={buttonRef}
        className={`tap-button ${isAnimating ? 'scale-95' : ''}`}
        onClick={handleTap}
        style={{
          cursor: user.energy > 0 ? 'pointer' : 'not-allowed',
          opacity: user.energy > 0 ? 1 : 0.5,
        }}
      >
        <Building className="w-16 h-16 text-dubai-dark" />
      </div>
      
      <div className="mt-4 text-center">
        <div className="bg-dubai-card rounded-lg px-6 py-3 inline-block">
          <div className="text-dubai-gold font-bold text-xl">
            +{user.coinsPerTap}
          </div>
          <div className="text-gray-400 text-sm">per tap</div>
        </div>
      </div>
    </div>
  );
}
