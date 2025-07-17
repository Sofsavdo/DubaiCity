import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

interface FloatingCoin {
  id: string;
  x: number;
  y: number;
  amount: number;
}

interface FloatingCoinsProps {
  onCoinGenerated?: (x: number, y: number, amount: number) => void;
}

export function FloatingCoins({ onCoinGenerated }: FloatingCoinsProps) {
  const [coins, setCoins] = useState<FloatingCoin[]>([]);

  const addCoin = (x: number, y: number, amount: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newCoin = { id, x, y, amount };
    
    setCoins(prev => [...prev, newCoin]);
    
    // Remove coin after animation
    setTimeout(() => {
      setCoins(prev => prev.filter(coin => coin.id !== id));
    }, 1000);
  };

  useEffect(() => {
    if (onCoinGenerated) {
      // This would be called from the parent component when coins are generated
      // For now, we'll expose this function through a global reference
      (window as any).addFloatingCoin = addCoin;
    }
  }, [onCoinGenerated]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {coins.map(coin => (
        <div
          key={coin.id}
          className="absolute flex items-center coin-animation"
          style={{
            left: coin.x - 25,
            top: coin.y - 25,
          }}
        >
          <div className="flex items-center text-dubai-gold font-bold bg-dubai-dark/80 rounded-full px-2 py-1">
            <Coins className="w-4 h-4 mr-1" />
            +{coin.amount}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to trigger floating coin animation
export function triggerFloatingCoin(x: number, y: number, amount: number) {
  if ((window as any).addFloatingCoin) {
    (window as any).addFloatingCoin(x, y, amount);
  }
}
