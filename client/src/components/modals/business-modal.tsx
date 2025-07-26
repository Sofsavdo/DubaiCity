import { useGame } from "@/hooks/use-game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Business, BUSINESS_TYPES } from "@shared/schema";
import { formatNumber, showToast } from "@/lib/game-utils";
import { X, Building, TrendingUp, Coins } from "lucide-react";

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
}

export function BusinessModal({ isOpen, onClose, businesses }: BusinessModalProps) {
  const { user } = useGame();
  const queryClient = useQueryClient();

  const buyBusinessMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest('POST', '/api/businesses', {
        userId: user?.id,
        type,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/businesses', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.telegramId] });
      showToast('Business purchased!', 'success');
      onClose();
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to purchase business', 'error');
    },
  });

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-dubai-gold">Business Empire</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-gray-300 text-sm">
            Manage your Dubai businesses
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {BUSINESS_TYPES.map((businessType) => {
            const ownedBusiness = businesses.find(b => b.type === businessType.type);
            const canAfford = user.coins >= businessType.baseCost;
            const isOwned = !!ownedBusiness;
            
            return (
              <div key={businessType.type} className="bg-dubai-dark rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Building className="w-8 h-8 text-dubai-gold mr-3" />
                    <div>
                      <div className="font-bold text-white">{businessType.name}</div>
                      <div className="text-sm text-gray-400">
                        {isOwned ? `Level ${ownedBusiness.level}` : 'Not owned'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-dubai-gold font-bold flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{formatNumber(ownedBusiness?.income || businessType.baseIncome)}/min
                    </div>
                    <div className="text-xs text-gray-400">
                      {isOwned ? 'Owned' : `${formatNumber(businessType.baseCost)} coins`}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-3">
                  {isOwned ? (
                    <div className="flex items-center">
                      <Coins className="w-4 h-4 mr-1 text-dubai-gold" />
                      Earning {formatNumber(ownedBusiness.income)} coins per minute
                    </div>
                  ) : (
                    <div>
                      Base income: {formatNumber(businessType.baseIncome)} coins/min
                    </div>
                  )}
                </div>
                
                {!isOwned && (
                  <button
                    onClick={() => buyBusinessMutation.mutate(businessType.type)}
                    disabled={!canAfford || buyBusinessMutation.isPending}
                    className={`w-full py-2 px-4 rounded-lg font-bold text-sm ${
                      canAfford 
                        ? 'bg-dubai-gold text-dubai-dark hover:bg-yellow-400' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {buyBusinessMutation.isPending ? 'Buying...' : 
                     canAfford ? `Buy for ${formatNumber(businessType.baseCost)}` : 
                     'Not enough coins'}
                  </button>
                )}
                
                {isOwned && (
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-lg font-bold text-sm bg-green-600 text-white cursor-not-allowed"
                  >
                    Owned
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 bg-dubai-dark rounded-lg p-3">
          <div className="text-sm text-gray-400 text-center">
            Total Income: <span className="text-dubai-gold font-bold">
              +{formatNumber(businesses.reduce((sum, b) => sum + b.income, 0))}/min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
