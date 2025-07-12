import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, TrendingUp, DollarSign, Activity, Award } from 'lucide-react';
import { api } from '../lib/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: { totalUsers: 0, activeUsers: 0, totalCoins: 0, averageLevel: 0 },
    game: { totalTasks: 0, activeTasks: 0, completedTasks: 0, totalSkins: 0, purchasedSkins: 0, totalBusinesses: 0, purchasedBusinesses: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAdminStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to fetch stats');
      }
    } catch (err) {
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Jami O\'yinchilar',
      value: stats.users.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Faol O\'yinchilar',
      value: stats.users.activeUsers.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      title: 'Jami Coinlar',
      value: stats.users.totalCoins.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'O\'rtacha Level',
      value: (stats.users.averageLevel || 0).toString(),
      change: '+5%',
      changeType: 'positive',
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { user: 'Ali Valiyev', action: 'Yangi skin sotib oldi', time: '5 daqiqa oldin', type: 'purchase' },
    { user: 'Malika Karimova', action: 'Topshiriqni bajardi', time: '10 daqiqa oldin', type: 'task' },
    { user: 'Bobur Toshmatov', action: 'Promo kod ishlatdi', time: '15 daqiqa oldin', type: 'promo' },
    { user: 'Nilufar Saidova', action: 'Yangi foydalanuvchi ro\'yxatdan o\'tdi', time: '20 daqiqa oldin', type: 'register' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 mb-2">{error}</p>
          <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Oxirgi yangilanish: {new Date().toLocaleString('uz-UZ')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} o'tgan oyga nisbatan
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Topshiriqlar</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.game.totalTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Faol: {stats.game.activeTasks}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bajarilgan Topshiriqlar</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.game.completedTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Umumiy topshiriqlardan</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Skinlar</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.game.totalSkins}</p>
              <p className="text-sm text-gray-500 mt-1">Sotilgan: {stats.game.purchasedSkins}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bizneslar</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.game.totalBusinesses}</p>
              <p className="text-sm text-gray-500 mt-1">Sotilgan: {stats.game.purchasedBusinesses}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">O'yinchilar Statistikasi</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Grafik bu yerda ko'rsatiladi</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">So'nggi Faoliyat</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'purchase' ? 'bg-green-500' :
                  activity.type === 'task' ? 'bg-blue-500' :
                  activity.type === 'promo' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;