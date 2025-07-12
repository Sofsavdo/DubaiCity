import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

const ReportsManagement: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('users');

  const reportTypes = [
    { id: 'users', label: 'O\'yinchilar Hisoboti', icon: Users },
    { id: 'financial', label: 'Moliyaviy Hisobot', icon: DollarSign },
    { id: 'activity', label: 'Faoliyat Hisoboti', icon: TrendingUp },
    { id: 'sales', label: 'Sotuvlar Hisoboti', icon: BarChart3 }
  ];

  const reports = [
    {
      id: 1,
      name: 'Yanvar Oyi O\'yinchilar Hisoboti',
      type: 'users',
      generatedDate: '2024-01-31',
      size: '2.4 MB',
      status: 'ready'
    },
    {
      id: 2,
      name: 'Moliyaviy Hisobot - Q4 2023',
      type: 'financial',
      generatedDate: '2024-01-15',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: 3,
      name: 'Haftalik Faoliyat Hisoboti',
      type: 'activity',
      generatedDate: '2024-01-20',
      size: '956 KB',
      status: 'generating'
    }
  ];

  const handleGenerateReport = () => {
    console.log(`Generating ${reportType} report for ${dateRange}`);
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
  };

  const getReportIcon = (type: string) => {
    const reportTypeObj = reportTypes.find(rt => rt.id === type);
    return reportTypeObj ? reportTypeObj.icon : FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Hisobotlar</h1>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Yangi Hisobot Yaratish</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hisobot Turi</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vaqt Oralig'i</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last_7_days">So'nggi 7 kun</option>
              <option value="last_30_days">So'nggi 30 kun</option>
              <option value="last_3_months">So'nggi 3 oy</option>
              <option value="last_6_months">So'nggi 6 oy</option>
              <option value="last_year">So'nggi yil</option>
              <option value="custom">Maxsus oraliq</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Hisobot Yaratish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami O'yinchilar</p>
              <p className="text-2xl font-bold text-gray-800">12,543</p>
              <p className="text-sm text-green-600">+12% o'tgan oyga nisbatan</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Daromad</p>
              <p className="text-2xl font-bold text-gray-800">$45,678</p>
              <p className="text-sm text-green-600">+15% o'tgan oyga nisbatan</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faol O'yinchilar</p>
              <p className="text-2xl font-bold text-gray-800">8,234</p>
              <p className="text-sm text-green-600">+8% o'tgan oyga nisbatan</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sotuvlar</p>
              <p className="text-2xl font-bold text-gray-800">2,456</p>
              <p className="text-sm text-green-600">+5% o'tgan oyga nisbatan</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Yaratilgan Hisobotlar</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hisobot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yaratilgan Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hajm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => {
                const Icon = getReportIcon(report.type);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.type === 'users' ? 'bg-blue-100 text-blue-800' :
                        report.type === 'financial' ? 'bg-green-100 text-green-800' :
                        report.type === 'activity' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {reportTypes.find(rt => rt.id === report.type)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(report.generatedDate).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'ready' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status === 'ready' ? 'Tayyor' :
                         report.status === 'generating' ? 'Yaratilmoqda' : 'Xato'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {report.status === 'ready' && (
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Yuklab Olish</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tezkor Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">O'yinchilar Ma'lumotlari</p>
              <p className="text-sm opacity-75">Excel formatida</p>
            </div>
          </button>
          
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Moliyaviy Ma'lumotlar</p>
              <p className="text-sm opacity-75">Excel formatida</p>
            </div>
          </button>
          
          <button className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Sotuvlar Ma'lumotlari</p>
              <p className="text-sm opacity-75">Excel formatida</p>
            </div>
          </button>
          
          <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Faoliyat Ma'lumotlari</p>
              <p className="text-sm opacity-75">Excel formatida</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;