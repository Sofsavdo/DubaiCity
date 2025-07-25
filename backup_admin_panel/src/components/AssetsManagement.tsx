import React, { useState } from 'react';
import { Package, Upload, Download, Plus, Edit, Trash2, Image, FileText, Youtube, Gift, Crown, DollarSign } from 'lucide-react';

const AssetsManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('promo_codes');

  const assets = {
    promo_codes: [
      {
        id: 1,
        code: 'WELCOME2024',
        type: 'coins',
        value: 500,
        description: 'Yangi yil uchun maxsus kod',
        usageLimit: 1000,
        usedCount: 234,
        expiryDate: '2024-12-31',
        status: 'active'
      },
      {
        id: 2,
        code: 'PREMIUM50',
        type: 'discount',
        value: 50,
        description: 'Premium paketga 50% chegirma',
        usageLimit: 500,
        usedCount: 89,
        expiryDate: '2024-06-30',
        status: 'active'
      }
    ],
    youtube_tasks: [
      {
        id: 1,
        title: 'Dubai City Bot Tanishtiruv',
        videoUrl: 'https://youtube.com/watch?v=example1',
        code: 'YOUTUBE100',
        reward: 100,
        description: 'Bizning yangi videoni ko\'ring',
        status: 'active',
        views: 1234
      },
      {
        id: 2,
        title: 'Qanday Pul Ishlash Mumkin',
        videoUrl: 'https://youtube.com/watch?v=example2',
        code: 'EARN200',
        reward: 200,
        description: 'Pul ishlash yo\'llarini o\'rganing',
        status: 'active',
        views: 2456
      }
    ],
    premium_avatars: [
      {
        id: 1,
        name: 'Oltin Toj',
        image: null,
        price: 5000,
        rarity: 'legendary',
        status: 'active',
        sales: 45
      },
      {
        id: 2,
        name: 'Kumush Niqob',
        image: null,
        price: 2500,
        rarity: 'epic',
        status: 'active',
        sales: 123
      }
    ],
    valuables: [
      {
        id: 1,
        name: 'Olmos Uzuk',
        image: null,
        price: 10000,
        rarity: 'mythic',
        description: 'Eng qimmatbaho buyum',
        status: 'active',
        sales: 12
      },
      {
        id: 2,
        name: 'Zumrad Marjon',
        image: null,
        price: 7500,
        rarity: 'legendary',
        description: 'Noyob qimmatlik',
        status: 'active',
        sales: 34
      }
    ]
  };

  const handleExportExcel = () => {
    console.log('Exporting assets to Excel...');
  };

  const handleImportExcel = () => {
    console.log('Importing assets from Excel...');
  };

  const renderPromoCodesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Promo Kod
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qiymat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Foydalanish
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Muddat
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
          {assets.promo_codes.map((promo) => (
            <tr key={promo.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-mono font-medium text-gray-900">{promo.code}</div>
                    <div className="text-sm text-gray-500">{promo.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  promo.type === 'coins' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {promo.type === 'coins' ? 'Tanga' : 'Chegirma'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {promo.value} {promo.type === 'coins' ? 'tanga' : '%'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{promo.usedCount} / {promo.usageLimit}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(promo.usedCount / promo.usageLimit) * 100}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(promo.expiryDate).toLocaleDateString('uz-UZ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {promo.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderYouTubeTasksTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Video
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kod
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mukofot
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ko'rishlar
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
          {assets.youtube_tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{task.code}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.reward} tanga
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.views.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  task.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {task.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPremiumAvatarsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avatar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Narx
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nadir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sotuvlar
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
          {assets.premium_avatars.map((avatar) => (
            <tr key={avatar.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 border-2 border-dashed border-gray-300">
                    {avatar.image ? (
                      <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Crown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{avatar.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {avatar.price.toLocaleString()} tanga
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  avatar.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  avatar.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {avatar.rarity === 'legendary' ? 'Legendary' :
                   avatar.rarity === 'epic' ? 'Epic' : 'Rare'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {avatar.sales}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  avatar.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {avatar.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Upload className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderValuablesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qimmatlik
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Narx
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nadir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sotuvlar
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
          {assets.valuables.map((valuable) => (
            <tr key={valuable.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 border-2 border-dashed border-gray-300">
                    {valuable.image ? (
                      <img src={valuable.image} alt={valuable.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{valuable.name}</div>
                    <div className="text-sm text-gray-500">{valuable.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {valuable.price.toLocaleString()} tanga
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  valuable.rarity === 'mythic' ? 'bg-red-100 text-red-800' :
                  valuable.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {valuable.rarity === 'mythic' ? 'Mythic' :
                   valuable.rarity === 'legendary' ? 'Legendary' : 'Epic'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {valuable.sales}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  valuable.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {valuable.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Upload className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Aktivlar Boshqaruvi</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleImportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Excel Yuklash</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Element</span>
          </button>
        </div>
      </div>

      {/* Assets Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promo Kodlar</p>
              <p className="text-2xl font-bold text-gray-800">{assets.promo_codes.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">YouTube Vazifalar</p>
              <p className="text-2xl font-bold text-gray-800">{assets.youtube_tasks.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Youtube className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium Avatarlar</p>
              <p className="text-2xl font-bold text-gray-800">{assets.premium_avatars.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qimmatliklar</p>
              <p className="text-2xl font-bold text-gray-800">{assets.valuables.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
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

      {/* Asset Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'promo_codes', label: 'Promo Kodlar', icon: Gift },
              { id: 'youtube_tasks', label: 'YouTube Vazifalar', icon: Youtube },
              { id: 'premium_avatars', label: 'Premium Avatarlar', icon: Crown },
              { id: 'valuables', label: 'Qimmatliklar', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'promo_codes' && renderPromoCodesTable()}
          {activeTab === 'youtube_tasks' && renderYouTubeTasksTable()}
          {activeTab === 'premium_avatars' && renderPremiumAvatarsTable()}
          {activeTab === 'valuables' && renderValuablesTable()}
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Element Qo'shish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Element Turi</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="promo_code">Promo Kod</option>
                  <option value="youtube_task">YouTube Vazifa</option>
                  <option value="premium_avatar">Premium Avatar</option>
                  <option value="valuable">Qimmatlik</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom/Kod</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Element nomini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Element tavsifini kiriting"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rasm Yuklash</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Rasm yuklash uchun bosing</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsManagement;