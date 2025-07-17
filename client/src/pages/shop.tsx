import { useGame } from "@/hooks/use-game";
import { StatusBar } from "@/components/game/status-bar";
import { BottomNavigation } from "@/components/game/bottom-navigation";
import { formatNumber } from "@/lib/game-utils";
import { Crown, Coins, Zap, Star, ShoppingBag } from "lucide-react";

export default function ShopPage() {
  const { user } = useGame();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please open in Telegram</div>
      </div>
    );
  }

  const shopItems = [
    {
      id: 1,
      type: 'premium',
      title: 'Premium Status',
      description: 'Unlock premium features and exclusive content',
      price: 2.00,
      currency: 'TON',
      icon: Crown,
      benefits: ['2x coin multiplier', 'Exclusive skins', 'Priority support'],
    },
    {
      id: 2,
      type: 'coins',
      title: '1M Coins',
      description: 'Get 1 million coins instantly',
      price: 1.00,
      currency: 'TON',
      icon: Coins,
      benefits: ['1,000,000 coins', 'Instant delivery'],
    },
    {
      id: 3,
      type: 'energy',
      title: 'Energy Booster',
      description: 'Increase max energy by 500',
      price: 0.50,
      currency: 'TON',
      icon: Zap,
      benefits: ['+500 max energy', 'Permanent upgrade'],
    },
    {
      id: 4,
      type: 'activation',
      title: 'Bot Activation',
      description: 'Activate premium bot features',
      price: 0.50,
      currency: 'TON',
      icon: Star,
      benefits: ['Unlock all features', 'Remove limitations'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dubai-gold mb-2">
            Premium Shop
          </h1>
          <div className="bg-dubai-card rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <ShoppingBag className="w-5 h-5 text-dubai-gold mr-2" />
              <span className="text-dubai-gold font-bold text-lg">
                TON Payments
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Secure cryptocurrency payments via Telegram
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {shopItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="bg-dubai-card rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-dubai-gold rounded-full flex items-center justify-center mr-3">
                      <Icon className="w-6 h-6 text-dubai-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-dubai-gold font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{item.currency}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-semibold text-white mb-2">Benefits:</div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {item.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="w-3 h-3 text-dubai-gold mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full bg-dubai-gold text-dubai-dark font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-dubai-card rounded-lg p-4">
          <h3 className="font-bold text-white mb-2">Payment Information</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Payments processed via TON cryptocurrency</li>
            <li>• Secure transactions through Telegram</li>
            <li>• Instant delivery after payment confirmation</li>
            <li>• 24/7 customer support available</li>
          </ul>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
