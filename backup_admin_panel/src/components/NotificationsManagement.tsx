import React, { useState } from 'react';
import { Send, Bell, Users, MessageSquare, Calendar, Plus } from 'lucide-react';

const NotificationsManagement: React.FC = () => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [notificationType, setNotificationType] = useState('all');

  const notifications = [
    {
      id: 1,
      title: 'Yangi Skin Chiqdi!',
      message: 'Golden Warrior skini hozir mavjud. Tezroq oling!',
      type: 'promotion',
      recipients: 'all',
      sentAt: '2024-01-20 14:30',
      status: 'sent',
      delivered: 8234,
      opened: 6123
    },
    {
      id: 2,
      title: 'Haftalik Turnir',
      message: 'Haftalik turnirda ishtirok eting va mukofot yutib oling!',
      type: 'event',
      recipients: 'active',
      sentAt: '2024-01-19 10:00',
      status: 'sent',
      delivered: 5432,
      opened: 4321
    },
    {
      id: 3,
      title: 'Tizim Yangilanishi',
      message: 'Bot yangi funksiyalar bilan yangilandi.',
      type: 'system',
      recipients: 'all',
      sentAt: '2024-01-18 16:45',
      status: 'sent',
      delivered: 12543,
      opened: 9876
    }
  ];

  const handleSendNotification = () => {
    console.log('Sending notification...');
    setShowSendModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Habarlar Boshqaruvi</h1>
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Habar Yuborish</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Yuborilgan</p>
              <p className="text-2xl font-bold text-gray-800">156</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yetkazilgan</p>
              <p className="text-2xl font-bold text-gray-800">26,209</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ochilgan</p>
              <p className="text-2xl font-bold text-gray-800">20,320</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ochish Foizi</p>
              <p className="text-2xl font-bold text-gray-800">77.5%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Habarlar Tarixi</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Habar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qabul Qiluvchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yuborilgan Vaqt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yetkazilgan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ochilgan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500">{notification.message}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      notification.type === 'promotion' ? 'bg-green-100 text-green-800' :
                      notification.type === 'event' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.type === 'promotion' ? 'Reklama' :
                       notification.type === 'event' ? 'Tadbir' : 'Tizim'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.recipients === 'all' ? 'Barcha foydalanuvchilar' : 'Faol foydalanuvchilar'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.sentAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.delivered.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{notification.opened.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {((notification.opened / notification.delivered) * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Habar Yuborish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Habar sarlavhasini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Habar matnini kiriting"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habar Turi</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="promotion">Reklama</option>
                  <option value="event">Tadbir</option>
                  <option value="system">Tizim</option>
                  <option value="update">Yangilanish</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qabul Qiluvchilar</label>
                <select 
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Barcha foydalanuvchilar</option>
                  <option value="active">Faol foydalanuvchilar</option>
                  <option value="premium">Premium foydalanuvchilar</option>
                  <option value="new">Yangi foydalanuvchilar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yuborish Vaqti</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="now">Hozir yuborish</option>
                  <option value="schedule">Vaqt belgilash</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSendNotification}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Yuborish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;