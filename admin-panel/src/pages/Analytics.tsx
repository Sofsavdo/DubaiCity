
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Download, Filter, Calendar } from 'lucide-react';

interface AnalyticsData {
  revenue: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  userMetrics: {
    newUsers: number[];
    activeUsers: number[];
    retentionRate: number[];
  };
  gameMetrics: {
    tasksCompleted: number[];
    businessesPurchased: number[];
    coinsSpent: number[];
  };
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // CSV export functionality
    const csvData = "Date,Revenue,Users,Tasks\n" + 
      "2025-01-01,1000,150,45\n" + 
      "2025-01-02,1200,180,52";
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
          >
            <option value="7d">Son 7 kun</option>
            <option value="30d">Son 30 kun</option>
            <option value="90d">Son 90 kun</option>
          </select>
          <button 
            onClick={exportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Jami Daromad', value: '$12,345', change: '+23%', icon: DollarSign, color: 'green' },
          { title: 'Yangi Foydalanuvchilar', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
          { title: 'Faollik Darajasi', value: '89%', change: '+5%', icon: Activity, color: 'purple' },
          { title: 'O\'sish Sur\'ati', value: '15%', change: '+8%', icon: TrendingUp, color: 'orange' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-green-400 text-sm mt-1">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${metric.color}-500/20`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daromad Dinamikasi</h3>
          <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Revenue Line Chart</p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Foydalanuvchilar O'sishi</h3>
          <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">User Growth Bar Chart</p>
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vazifalar Bajarilishi</h3>
          <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Task Completion Pie Chart</p>
          </div>
        </div>

        {/* Business Analytics */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Biznes Statistikasi</h3>
          <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Business Purchase Chart</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Batafsil Hisobot</h3>
          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Sana</th>
                <th className="text-left py-3 px-4 text-gray-300">Daromad</th>
                <th className="text-left py-3 px-4 text-gray-300">Yangi Users</th>
                <th className="text-left py-3 px-4 text-gray-300">Faol Users</th>
                <th className="text-left py-3 px-4 text-gray-300">Vazifalar</th>
                <th className="text-left py-3 px-4 text-gray-300">Bizneslar</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2025-01-15', revenue: '$1,234', newUsers: 45, activeUsers: 234, tasks: 89, businesses: 12 },
                { date: '2025-01-14', revenue: '$1,156', newUsers: 38, activeUsers: 228, tasks: 76, businesses: 8 },
                { date: '2025-01-13', revenue: '$1,089', newUsers: 52, activeUsers: 241, tasks: 94, businesses: 15 }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-white">{row.date}</td>
                  <td className="py-3 px-4 text-green-400 font-medium">{row.revenue}</td>
                  <td className="py-3 px-4 text-blue-400">{row.newUsers}</td>
                  <td className="py-3 px-4 text-purple-400">{row.activeUsers}</td>
                  <td className="py-3 px-4 text-yellow-400">{row.tasks}</td>
                  <td className="py-3 px-4 text-orange-400">{row.businesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
