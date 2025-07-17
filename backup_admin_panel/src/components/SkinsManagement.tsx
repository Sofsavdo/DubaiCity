import React, { useState } from 'react';
import { Plus, Search, Upload, Download, Edit, Trash2, Image } from 'lucide-react';

const SkinsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const skins = [
    {
      id: 1,
      name: 'Golden Warrior',
      category: 'Premium',
      price: 500,
      rarity: 'Legendary',
      image: '/api/placeholder/100/100',
      status: 'active',
      sales: 234
    },
    {
      id: 2,
      name: 'Desert Eagle',
      category: 'Weapon',
      price: 250,
      rarity: 'Epic',
      image: '/api/placeholder/100/100',
      status: 'active',
      sales: 156
    },
    {
      id: 3,
      name: 'Cyber Ninja',
      category: 'Character',
      price: 750,
      rarity: 'Mythic',
      image: '/api/placeholder/100/100',
      status: 'inactive',
      sales: 89
    }
  ];

  const handleExportExcel = () => {
    console.log('Exporting skins to Excel...');
  };

  const handleImportExcel = () => {
    console.log('Importing skins from Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Skinlar Boshqaruvi</h1>
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
            <span>Yangi Skin</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Skin qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Barcha kategoriya</option>
              <option value="premium">Premium</option>
              <option value="weapon">Qurol</option>
              <option value="character">Belgi</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Barcha nadir</option>
              <option value="common">Oddiy</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythic">Mythic</option>
            </select>
          </div>

          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel Yuklab Olish</span>
          </button>
        </div>
      </div>

      {/* Skins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skins.map((skin) => (
          <div key={skin.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <Image className="w-16 h-16 text-gray-400" />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{skin.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  skin.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {skin.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>Kategoriya: {skin.category}</p>
                <p>Narx: {skin.price} tanga</p>
                <p>Nadir: {skin.rarity}</p>
                <p>Sotilgan: {skin.sales}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Skin Qo'shish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skin Nomi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Skin nomini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="premium">Premium</option>
                  <option value="weapon">Qurol</option>
                  <option value="character">Belgi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Narx (tanga)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rasm Yuklash</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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

export default SkinsManagement;