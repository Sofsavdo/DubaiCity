import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Activity, Calendar, Eye } from 'lucide-react';

const StatisticsManagement: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [selectedMetric, setSelectedMetric] = useState('users');

  const statistics = {
    overview: {
      totalUsers: 12543,
      activeUsers: 8234,
      totalRevenue: 45678,
      totalTransactions: 2456,
      averageSession: 15.5,
      retentionRate: 68.5
    },
    userStats: {
      newUsers: [
        { date: '2024-01-15', count: 234 },
        { date: '2024-01-16', count: 189 },
        { date: '2024-01-17', count: 267 },
        { date: '2024-01-18', count: 198 },
        { date: '2024-01-19', count: 245 },
        { date: '2024-01-20', count: 289 }
      ],
      activeUsers: [
        { date: '2024-01-15', count: 1234 },
        { date: '2024-01-16', count: 1189 },
        { date: '2024-01-17', count: 1267 },
        { date: '2024-01-18', count: 1198 },
        { date: '2024-01-19', count: 1245 },
        { date: '2024-01-20', count: 1289 }
      ]
    },
    revenueStats: {
      daily: [
        { date: '2024-01-15', amount: 1234 },
        { date: '2024-01-16', amount: 1456 },
        { date: '2024-01-17', amount: 1678 },
        { date: '2024-01-18', amount: 1345 },
        { date: '2024-01-19', amount: 1567 },
        { date: '2024-01-20', amount: 1789 }
      ]
    },
    topCountries: [
      { country: 'O\'zbekiston', users: 5678, percentage: 45.2 },
      { country: 'Rossiya', users: 2345, percentage: 18.7 },
      { country: 'Qozog\'iston', users: 1234, percentage: 9.8 },
      { country: 'Tojikiston', users: 987, percentage: 7.9 },
      { country: 'Qirg\'iziston', users: 654, percentage: 5.2 }
    ],
    topFeatures: [
      { feature: 'Kunlik Bonus', usage: 8234, percentage: 65.6 },
      { feature: 'Skin Sotib Olish', usage: 4567, percentage: 36.4 },
      { feature: 'Topshiriqlar', usage: 3456, percentage: 27.5 },
      { feature: 'Do\'stlarni Taklif', usage: 2345, percentage: 18.7 },
      { feature: 'Turnirlar', usage: 1234, percentage: 9.8 }
    ]
  };

  const handleExportExcel = () => {
    console.log('Exporting statistics to Excel...');
  };

  const handleExportPDF = () => {
    console.log('Exporting statistics to PDF...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Statistika</h1>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last_7_days">So'nggi 7 kun</option>
            <option value="last_30_days">So'nggi 30 kun</option>
            <option value="last_3_months">So'nggi 3 oy</option>
            <option value="last_year">So'nggi yil</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overview.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faol Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overview.activeUsers.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Daromad</p>
              <p className="text-2xl font-bold text-gray-800">${statistics.overview.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tranzaksiyalar</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overview.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">O'rtacha Sessiya</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overview.averageSession} daq</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qaytish Foizi</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overview.retentionRate}%</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Foydalanuvchilar O'sishi</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Foydalanuvchilar o'sish grafigi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Daromad Statistikasi</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Daromad grafigi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries and Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Eng Ko'p Foydalanuvchi Mamlakatlari</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {statistics.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{country.country}</p>
                      <p className="text-sm text-gray-500">{country.users.toLocaleString()} foydalanuvchi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{country.percentage}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Eng Ko'p Ishlatiladigan Funksiyalar</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {statistics.topFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{feature.feature}</p>
                      <p className="text-sm text-gray-500">{feature.usage.toLocaleString()} foydalanish</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{feature.percentage}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Batafsil Statistika</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yangi Foydalanuvchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faol Foydalanuvchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daromad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.userStats.newUsers.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(stat.date).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {statistics.userStats.activeUsers[index]?.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${statistics.revenueStats.daily[index]?.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsManagement;