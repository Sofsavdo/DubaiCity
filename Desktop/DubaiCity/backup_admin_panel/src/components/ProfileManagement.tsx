import React, { useState } from 'react';
import { User, Upload, Download, Edit, Save, MessageSquare, Bell, Info } from 'lucide-react';

const ProfileManagement: React.FC = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    mainInfo: {
      botName: 'Dubai City Bot',
      version: '2.0.1',
      description: 'Eng yaxshi daromad bot',
      supportContact: '@dubaicitybot_support'
    },
    airdropMessage: {
      title: 'Airdrop Tugadi!',
      message: 'Barcha airdrop tokenlar taqsimlandi. Keyingi airdrop haqida tez orada xabar beramiz.',
      isActive: true
    },
    announcement: {
      title: 'Muhim E\'lon',
      message: 'Yangi turnir boshlanmoqda! Ishtirok eting va katta mukofotlar yutib oling.',
      isActive: true,
      priority: 'high'
    },
    mainTask: {
      title: 'Asosiy Topshiriq',
      message: 'Har kuni botga kirib, kunlik bonusni oling va darajangizni oshiring.',
      isActive: true
    },
    warning: {
      title: 'Ogohlantirish',
      message: 'Tizimda texnik ishlar olib borilmoqda. Ba\'zi funksiyalar vaqtincha ishlamasligi mumkin.',
      isActive: false,
      type: 'maintenance'
    }
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} data...`);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleExportExcel = () => {
    console.log('Exporting profile data to Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Profil Boshqaruvi</h1>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Ma'lumotlarni Yuklab Olish</span>
        </button>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faol E'lonlar</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Asosiy Topshiriqlar</p>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ogohlantirishlar</p>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Info className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bot Versiyasi</p>
              <p className="text-2xl font-bold text-gray-800">{profileData.mainInfo.version}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Asosiy Ma'lumotlar</h2>
            <button
              onClick={() => setEditingSection('mainInfo')}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {editingSection === 'mainInfo' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bot Nomi</label>
                <input
                  type="text"
                  defaultValue={profileData.mainInfo.botName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versiya</label>
                <input
                  type="text"
                  defaultValue={profileData.mainInfo.version}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                <textarea
                  defaultValue={profileData.mainInfo.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qo'llab-quvvatlash</label>
                <input
                  type="text"
                  defaultValue={profileData.mainInfo.supportContact}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('mainInfo')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Bot Nomi</p>
                <p className="text-lg text-gray-800">{profileData.mainInfo.botName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Versiya</p>
                <p className="text-lg text-gray-800">{profileData.mainInfo.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tavsif</p>
                <p className="text-lg text-gray-800">{profileData.mainInfo.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Qo'llab-quvvatlash</p>
                <p className="text-lg text-gray-800">{profileData.mainInfo.supportContact}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Airdrop Message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Airdrop Xabari</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profileData.airdropMessage.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profileData.airdropMessage.isActive ? 'Faol' : 'Nofaol'}
              </span>
              <button
                onClick={() => setEditingSection('airdropMessage')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {editingSection === 'airdropMessage' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input
                  type="text"
                  defaultValue={profileData.airdropMessage.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  defaultValue={profileData.airdropMessage.message}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={profileData.airdropMessage.isActive}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Faol</label>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('airdropMessage')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">{profileData.airdropMessage.title}</h3>
              <p className="text-gray-600">{profileData.airdropMessage.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Announcement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">E'lon yoki Habar</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profileData.announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profileData.announcement.isActive ? 'Faol' : 'Nofaol'}
              </span>
              <button
                onClick={() => setEditingSection('announcement')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {editingSection === 'announcement' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input
                  type="text"
                  defaultValue={profileData.announcement.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  defaultValue={profileData.announcement.message}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Muhimlik Darajasi</label>
                <select
                  defaultValue={profileData.announcement.priority}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Past</option>
                  <option value="medium">O'rta</option>
                  <option value="high">Yuqori</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={profileData.announcement.isActive}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Faol</label>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('announcement')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-gray-800">{profileData.announcement.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  profileData.announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                  profileData.announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {profileData.announcement.priority === 'high' ? 'Yuqori' :
                   profileData.announcement.priority === 'medium' ? 'O\'rta' : 'Past'}
                </span>
              </div>
              <p className="text-gray-600">{profileData.announcement.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Task */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Asosiy Topshiriq</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profileData.mainTask.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profileData.mainTask.isActive ? 'Faol' : 'Nofaol'}
              </span>
              <button
                onClick={() => setEditingSection('mainTask')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {editingSection === 'mainTask' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input
                  type="text"
                  defaultValue={profileData.mainTask.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  defaultValue={profileData.mainTask.message}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={profileData.mainTask.isActive}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Faol</label>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('mainTask')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">{profileData.mainTask.title}</h3>
              <p className="text-gray-600">{profileData.mainTask.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Ogohlantirish</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profileData.warning.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profileData.warning.isActive ? 'Faol' : 'Nofaol'}
              </span>
              <button
                onClick={() => setEditingSection('warning')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {editingSection === 'warning' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input
                  type="text"
                  defaultValue={profileData.warning.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  defaultValue={profileData.warning.message}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tur</label>
                <select
                  defaultValue={profileData.warning.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="maintenance">Texnik ishlar</option>
                  <option value="security">Xavfsizlik</option>
                  <option value="update">Yangilanish</option>
                  <option value="general">Umumiy</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={profileData.warning.isActive}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Faol</label>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('warning')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-gray-800">{profileData.warning.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  profileData.warning.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  profileData.warning.type === 'security' ? 'bg-red-100 text-red-800' :
                  profileData.warning.type === 'update' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {profileData.warning.type === 'maintenance' ? 'Texnik ishlar' :
                   profileData.warning.type === 'security' ? 'Xavfsizlik' :
                   profileData.warning.type === 'update' ? 'Yangilanish' : 'Umumiy'}
                </span>
              </div>
              <p className="text-gray-600">{profileData.warning.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;