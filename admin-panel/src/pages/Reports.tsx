
import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [generating, setGenerating] = useState(false);

  const reportTypes: ReportConfig[] = [
    {
      type: 'user_analytics',
      title: 'Foydalanuvchi Tahlili',
      description: 'Foydalanuvchilar statistikasi, faollik va demografik ma\'lumotlar',
      icon: Users,
      color: 'blue'
    },
    {
      type: 'revenue_report',
      title: 'Daromad Hisoboti',
      description: 'To\'lovlar, daromad va moliyaviy ko\'rsatkichlar',
      icon: DollarSign,
      color: 'green'
    },
    {
      type: 'game_analytics',
      title: 'O\'yin Tahlili',
      description: 'Vazifalar, bizneslar va o\'yin faolligi statistikasi',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      type: 'performance_report',
      title: 'Performance Hisoboti',
      description: 'Tizim ishlashi, API so\'rovlari va xatolar tahlili',
      icon: FileText,
      color: 'orange'
    }
  ];

  const generateReport = async () => {
    if (!selectedReport || !dateRange.start || !dateRange.end) {
      alert('Iltimos, hisobot turini va sanani tanlang');
      return;
    }

    setGenerating(true);
    
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedReport,
          startDate: dateRange.start,
          endDate: dateRange.end
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}_${dateRange.start}_${dateRange.end}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Hisobot yaratishda xatolik yuz berdi');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Hisobotlar</h1>
        <div className="text-sm text-gray-400">
          Avtomatik hisobotlar va ma'lumotlar eksporti
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Hisobot Turini Tanlang</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.type}
                onClick={() => setSelectedReport(report.type)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedReport === report.type
                    ? `border-${report.color}-500 bg-${report.color}-500/10`
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${report.color}-500/20`}>
                    <Icon className={`h-5 w-5 text-${report.color}-400`} />
                  </div>
                  <h4 className="text-white font-medium">{report.title}</h4>
                </div>
                <p className="text-gray-400 text-sm">{report.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range and Filters */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Hisobot Parametrlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Boshlanish Sanasi</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Tugash Sanasi</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              {generating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{generating ? 'Yaratilmoqda...' : 'Hisobot Yaratish'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tezkor Hisobotlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Bugungi Hisobot</h4>
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-sm opacity-90">Bugungi kun uchun tezkor hisobot</p>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Haftalik Xulosa</h4>
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm opacity-90">Oxirgi 7 kunlik statistika</p>
          </button>
          
          <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Oylik Tahlil</h4>
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm opacity-90">Oylik ko'rsatkichlar va tahlil</p>
          </button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Rejalashtirilgan Hisobotlar</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Yangi Rejalashtirish
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Kunlik Daromad', schedule: 'Har kuni 09:00', status: 'Faol', lastRun: '2025-01-15 09:00' },
            { name: 'Haftalik Foydalanuvchi', schedule: 'Dushanba 10:00', status: 'Faol', lastRun: '2025-01-13 10:00' },
            { name: 'Oylik Umumiy', schedule: 'Har oy 1-sana', status: 'Kutilmoqda', lastRun: '2025-01-01 08:00' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="text-white font-medium">{report.name}</h4>
                <p className="text-gray-400 text-sm">{report.schedule}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'Faol' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {report.status}
                </span>
                <p className="text-gray-400 text-xs mt-1">Oxirgi: {report.lastRun}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
