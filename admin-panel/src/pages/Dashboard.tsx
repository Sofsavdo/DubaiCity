
import React, { useEffect, useState } from 'react';
import { Users, Coins, Trophy, Activity, TrendingUp, DollarSign, UserCheck, Calendar } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCoins: number;
  activeUsers: number;
  completedTasks: number;
  dailyRevenue: number;
  weeklyGrowth: number;
  monthlyActiveUsers: number;
  totalBusinesses: number;
  avgSessionTime: string;
  topCountries: Array<{name: string, users: number}>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCoins: 0,
    activeUsers: 0,
    completedTasks: 0,
    dailyRevenue: 0,
    weeklyGrowth: 0,
    monthlyActiveUsers: 0,
    totalBusinesses: 0,
    avgSessionTime: '0m',
    topCountries: []
  });

  useEffect(() => {
    // Fetch stats from API
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const statCards = [
    {
      title: 'Jami Foydalanuvchilar',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue',
      change: '+12% dan o\'tgan oy'
    },
    {
      title: 'Kunlik Daromad',
      value: `$${stats.dailyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      change: `+${stats.weeklyGrowth}% haftalik`
    },
    {
      title: 'Faol Foydalanuvchilar',
      value: stats.monthlyActiveUsers.toLocaleString(),
      icon: UserCheck,
      color: 'purple',
      change: '+5% bugun'
    },
    {
      title: 'Jami Bizneslar',
      value: stats.totalBusinesses.toLocaleString(),
      icon: TrendingUp,
      color: 'orange',
      change: '+3 yangi biznes'
    },
    {
      title: 'Jami Tangalar',
      value: stats.totalCoins.toLocaleString(),
      icon: Coins,
      color: 'yellow',
      change: '+8% dan o\'tgan hafta'
    },
    {
      title: 'O\'rtacha Sessiya',
      value: stats.avgSessionTime,
      icon: Activity,
      color: 'indigo',
      change: '+2m ko\'proq'
    },
    {
      title: 'Bajarilgan Vazifalar',
      value: stats.completedTasks.toLocaleString(),
      icon: Trophy,
      color: 'pink',
      change: '+15% dan o\'tgan hafta'
    },
    {
      title: 'Bugungi Ro\'yxat',
      value: '124',
      icon: Calendar,
      color: 'cyan',
      change: '+18% bugun'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Oxirgi yangilanish: {new Date().toLocaleString('uz-UZ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="glass-effect rounded-xl p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium">{card.title}</p>
                  <p className="text-xl font-bold text-white mt-1">{card.value}</p>
                  <p className="text-green-400 text-xs mt-1">{card.change}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${card.color}-500/20`}>
                  <Icon className={`h-5 w-5 text-${card.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Activity Feed */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Real-time Faoliyat</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {[
              { type: 'user', message: 'Yangi foydalanuvchi ro\'yxatdan o\'tdi', time: '1 daqiqa oldin', color: 'blue' },
              { type: 'payment', message: '$50 to\'lov amalga oshirildi', time: '3 daqiqa oldin', color: 'green' },
              { type: 'task', message: 'YouTube vazifa bajarildi', time: '5 daqiqa oldin', color: 'red' },
              { type: 'business', message: 'Yangi restoran sotib olindi', time: '8 daqiqa oldin', color: 'purple' },
              { type: 'level', message: 'Foydalanuvchi 10-darajaga o\'tdi', time: '12 daqiqa oldin', color: 'yellow' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                <div className={`w-8 h-8 bg-${activity.color}-500 rounded-full flex items-center justify-center`}>
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tezkor Amallar</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              📝 Yangi Vazifa
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              📢 Bildirishnoma
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              🎟️ Promo Kod
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              📊 Hisobot
            </button>
            <button className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              🏢 Biznes Qo'shish
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors text-sm">
              👥 Bulk Action
            </button>
          </div>
        </div>

        {/* Top Countries Analytics */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Mamlakatlar</h3>
          <div className="space-y-3">
            {[
              { country: '🇺🇿 O\'zbekiston', users: 1234, percentage: 45 },
              { country: '🇷🇺 Rossiya', users: 856, percentage: 31 },
              { country: '🇰🇿 Qozog\'iston', users: 456, percentage: 16 },
              { country: '🇹🇯 Tojikiston', users: 234, percentage: 8 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">{item.country}</span>
                  <span className="text-gray-400 text-sm">{item.users.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Daromad Tahlili</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">7 kun</button>
            <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg">30 kun</button>
            <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg">90 kun</button>
          </div>
        </div>
        <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Chart.js yoki Recharts kutubxonasi bu yerga qo'shiladi</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
