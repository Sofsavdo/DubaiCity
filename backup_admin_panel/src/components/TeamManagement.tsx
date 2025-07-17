import React, { useState } from 'react';
import { UserCheck, Upload, Download, Plus, Edit, Trash2, MessageSquare, Ban, Clock, Megaphone } from 'lucide-react';

const TeamManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const companies = [
    {
      id: 1,
      name: 'Tech Innovators',
      owner: 'Ali Valiyev',
      members: 25,
      status: 'active',
      createdDate: '2024-01-15',
      totalEarnings: 15000,
      chatMessages: 156
    },
    {
      id: 2,
      name: 'Digital Masters',
      owner: 'Malika Karimova',
      members: 18,
      status: 'blocked',
      createdDate: '2024-01-10',
      totalEarnings: 8500,
      chatMessages: 89
    },
    {
      id: 3,
      name: 'Future Builders',
      owner: 'Bobur Toshmatov',
      members: 32,
      status: 'active',
      createdDate: '2024-01-05',
      totalEarnings: 22000,
      chatMessages: 234
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Yangi Turnir E\'loni',
      message: 'Keyingi hafta katta turnir bo\'lib o\'tadi. Ishtirok eting!',
      targetCompany: 'all',
      createdDate: '2024-01-20',
      status: 'active'
    },
    {
      id: 2,
      title: 'Tizim Yangilanishi',
      message: 'Bot yangi funksiyalar bilan yangilandi.',
      targetCompany: 'Tech Innovators',
      createdDate: '2024-01-18',
      status: 'active'
    }
  ];

  const handleExportExcel = () => {
    console.log('Exporting team data to Excel...');
  };

  const handleImportExcel = () => {
    console.log('Importing team data from Excel...');
  };

  const handleBlockCompany = (id: number) => {
    console.log(`Blocking company ${id}`);
  };

  const handleDeleteCompany = (id: number) => {
    console.log(`Deleting company ${id}`);
  };

  const handleClearChat = (id: number) => {
    console.log(`Clearing chat for company ${id}`);
  };

  const handleSendMessage = (id: number) => {
    console.log(`Sending message to company ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Jamoa Boshqaruvi</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Megaphone className="w-4 h-4" />
            <span>E'lon Joylashtirish</span>
          </button>
          <button
            onClick={handleImportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Excel Yuklash</span>
          </button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Kompaniyalar</p>
              <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faol Kompaniyalar</p>
              <p className="text-2xl font-bold text-gray-800">
                {companies.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami A'zolar</p>
              <p className="text-2xl font-bold text-gray-800">
                {companies.reduce((sum, c) => sum + c.members, 0)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Daromad</p>
              <p className="text-2xl font-bold text-gray-800">
                {companies.reduce((sum, c) => sum + c.totalEarnings, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Excel Yuklab Olish</span>
        </button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Kompaniyalar</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kompaniya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  A'zolar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daromad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat Xabarlar
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
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">Rahbar: {company.owner}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.totalEarnings.toLocaleString()} tanga
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.chatMessages}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      company.status === 'active' ? 'bg-green-100 text-green-800' :
                      company.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.status === 'active' ? 'Faol' :
                       company.status === 'blocked' ? 'Bloklangan' : 'Vaqtinchalik'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSendMessage(company.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xabar yuborish"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleClearChat(company.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Chatni tozalash"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBlockCompany(company.id)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Vaqtinchalik bloklash"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBlockCompany(company.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Bloklash"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="text-red-600 hover:text-red-900"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">E'lonlar</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.createdDate).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Maqsad: {announcement.targetCompany === 'all' ? 'Barcha kompaniyalar' : announcement.targetCompany}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi E'lon Joylashtirish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E'lon Sarlavhasi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E'lon sarlavhasini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="E'lon matnini kiriting"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maqsadli Kompaniya</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Barcha kompaniyalar</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.name}>{company.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  E'lon Joylashtirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;