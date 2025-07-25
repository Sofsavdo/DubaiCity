import { useGame } from "@/hooks/use-game";
import { useTelegram } from "@/hooks/use-telegram";
import { StatusBar } from "@/components/game/status-bar";
import { BottomNavigation } from "@/components/game/bottom-navigation";
import { useQuery } from "@tanstack/react-query";
import { GameStats } from "@shared/schema";
import { formatNumber } from "@/lib/game-utils";
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Coins, 
  Zap, 
  Users, 
  Crown,
  ExternalLink
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useGame();
  const { tg } = useTelegram();

  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats', user?.id],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please open in Telegram</div>
      </div>
    );
  }

  const stats = [
    {
      icon: Target,
      label: 'Total Taps',
      value: gameStats?.totalTaps || 0,
      color: 'text-dubai-gold',
    },
    {
      icon: Coins,
      label: 'Coins Earned',
      value: gameStats?.totalCoinsEarned || 0,
      color: 'text-dubai-gold',
    },
    {
      icon: Zap,
      label: 'Energy Used',
      value: gameStats?.totalEnergyUsed || 0,
      color: 'text-dubai-red',
    },
    {
      icon: Clock,
      label: 'Play Time',
      value: `${gameStats?.playTimeMinutes || 0}m`,
      color: 'text-dubai-blue',
    },
    {
      icon: Users,
      label: 'Referrals',
      value: user.referralCount,
      color: 'text-green-400',
    },
    {
      icon: Trophy,
      label: 'Level',
      value: user.level,
      color: 'text-dubai-gold',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 px-4 py-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-dubai-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-dubai-dark" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user.firstName} {user.lastName}
          </h1>
          <div className="text-gray-400 mb-2">@{user.username}</div>
          <div className="flex items-center justify-center">
            <div className="bg-dubai-card rounded-full px-4 py-2 flex items-center">
              <Crown className="w-4 h-4 text-dubai-gold mr-2" />
              <span className="text-dubai-gold font-bold">{user.empireTitle}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-dubai-card rounded-lg p-4 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className={`font-bold text-lg ${stat.color}`}>
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Account Info */}
        <div className="bg-dubai-card rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-white mb-3">Account Info</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Telegram ID:</span>
              <span className="text-white">{user.telegramId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Referral Code:</span>
              <span className="text-dubai-gold font-mono">{user.referralCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Member Since:</span>
              <span className="text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Premium Status:</span>
              <span className={user.isPremium ? 'text-dubai-gold' : 'text-gray-400'}>
                {user.isPremium ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-dubai-card rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-white mb-3">Referral Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-dubai-gold">
                {user.referralCount}
              </div>
              <div className="text-sm text-gray-400">Friends Invited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dubai-gold">
                {formatNumber(user.referralEarnings)}
              </div>
              <div className="text-sm text-gray-400">Coins Earned</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => tg?.openTelegramLink('https://t.me/DubaiCity_live')}
            className="w-full bg-dubai-blue text-white font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Join Our Channel
          </button>
          
          <button 
            onClick={() => {
              const referralLink = `https://t.me/DubaiCITY_robot?start=${user.telegramId}`;
              tg?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me in Dubai City! Build your empire and earn coins!')}`);
            }}
            className="w-full bg-dubai-gold text-dubai-dark font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Invite Friends
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
