import { useState } from "react";
import { useGame } from "@/hooks/use-game";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/game-utils";
import { 
  Trophy, 
  Medal, 
  Award,
  Coins,
  Users,
  Target,
  Building,
  Crown
} from "lucide-react";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  value: number;
  isPremium: boolean;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { user } = useGame();
  const [selectedType, setSelectedType] = useState('coins');

  const leaderboardTypes = [
    { key: 'coins', label: 'Coins', icon: Coins },
    { key: 'level', label: 'Level', icon: Crown },
    { key: 'referrals', label: 'Referrals', icon: Users },
    { key: 'taps', label: 'Taps', icon: Target },
    { key: 'businesses', label: 'Businesses', icon: Building },
  ];

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['/api/leaderboard', selectedType, user?.telegramId],
    enabled: isOpen && !!user,
    queryFn: async () => {
      const response = await fetch(
        `/api/leaderboard?type=${selectedType}&userId=${user?.telegramId}&limit=100`
      );
      return response.json();
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</div>;
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'coins':
        return formatNumber(value);
      case 'level':
        return `Level ${value}`;
      default:
        return formatNumber(value);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dubai-card text-white border-gray-700 max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-dubai-gold">
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Type Selector */}
          <div className="flex flex-wrap gap-2">
            {leaderboardTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.key}
                  variant={selectedType === type.key ? "dubai" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.key)}
                  className="flex items-center"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {type.label}
                </Button>
              );
            })}
          </div>

          {/* User's Rank */}
          {leaderboard?.userRank && (
            <div className="bg-dubai-dark rounded-lg p-3 border border-dubai-gold">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-dubai-gold rounded-full flex items-center justify-center mr-3">
                    <span className="text-dubai-dark font-bold text-sm">
                      #{leaderboard.userRank.rank}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-dubai-gold">Your Rank</div>
                    <div className="text-sm text-gray-400">
                      {formatValue(leaderboard.userRank.value, selectedType)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">
                Loading leaderboard...
              </div>
            ) : leaderboard?.entries?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div>No data available</div>
                <div className="text-sm">Be the first to climb the ranks!</div>
              </div>
            ) : (
              leaderboard?.entries?.map((entry: LeaderboardEntry) => (
                <div 
                  key={`${entry.rank}-${entry.userId}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.userId === user.telegramId 
                      ? 'bg-dubai-gold/20 border border-dubai-gold' 
                      : 'bg-dubai-dark'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold">
                          {entry.name || `Player ${entry.userId.slice(-6)}`}
                        </span>
                        {entry.isPremium && (
                          <Crown className="w-4 h-4 text-dubai-gold ml-1" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatValue(entry.value, selectedType)}
                      </div>
                    </div>
                  </div>
                  {entry.rank <= 3 && (
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {entry.rank === 1 ? 'Champion' : 
                         entry.rank === 2 ? 'Runner-up' : 
                         'Third Place'}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="dubai"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
