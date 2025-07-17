import { useGame } from "@/hooks/use-game";
import { StatusBar } from "@/components/game/status-bar";
import { BottomNavigation } from "@/components/game/bottom-navigation";
import { BusinessModal } from "@/components/modals/business-modal";
import { useQuery } from "@tanstack/react-query";
import { Business, BUSINESS_TYPES } from "@shared/schema";
import { formatNumber } from "@/lib/game-utils";
import { Building, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function BusinessPage() {
  const { user } = useGame();
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses', user?.id],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please open in Telegram</div>
      </div>
    );
  }

  const totalIncome = businesses.reduce((sum, business) => sum + business.income, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dubai-gold mb-2">
            Business Empire
          </h1>
          <div className="bg-dubai-card rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-dubai-gold mr-2" />
              <span className="text-dubai-gold font-bold text-lg">
                +{formatNumber(totalIncome)}/min
              </span>
            </div>
            <div className="text-sm text-gray-400">Total Income</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Available Businesses */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Available Businesses
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {BUSINESS_TYPES.map((businessType) => {
                const ownedBusiness = businesses.find(b => b.type === businessType.type);
                
                return (
                  <div key={businessType.type} className="business-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Building className="w-8 h-8 text-dubai-gold mr-3" />
                        <div>
                          <div className="font-bold text-white">
                            {businessType.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {ownedBusiness ? `Level ${ownedBusiness.level}` : 'Not owned'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-dubai-gold font-bold">
                          +{formatNumber(ownedBusiness?.income || businessType.baseIncome)}/min
                        </div>
                        <div className="text-xs text-gray-400">
                          {ownedBusiness ? `Upgrade: ${formatNumber(ownedBusiness.upgradeCost)}` : `Buy: ${formatNumber(businessType.baseCost)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Owned Businesses */}
          {businesses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Your Businesses
              </h2>
              <div className="space-y-3">
                {businesses.map((business) => (
                  <div key={business.id} className="business-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Building className="w-8 h-8 text-dubai-gold mr-3" />
                        <div>
                          <div className="font-bold text-white">
                            {business.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            Level {business.level}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-dubai-gold font-bold">
                          +{formatNumber(business.income)}/min
                        </div>
                        <div className="text-xs text-gray-400">
                          Upgrade: {formatNumber(business.upgradeCost)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Business Button */}
          <button
            onClick={() => setShowBusinessModal(true)}
            className="w-full bg-dubai-gold text-dubai-dark font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Business
          </button>
        </div>
      </div>

      <BottomNavigation />
      
      <BusinessModal 
        isOpen={showBusinessModal} 
        onClose={() => setShowBusinessModal(false)}
        businesses={businesses}
      />
    </div>
  );
}
