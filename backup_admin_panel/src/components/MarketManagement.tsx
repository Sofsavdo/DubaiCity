import React, { useState } from 'react';
import { ShoppingCart, Upload, Download, Plus, Edit, Trash2, Package, DollarSign, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const MarketManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const marketCategories = {
    personal: [
      {
        id: 1,
        name: 'Kafe',
        image: null,
        price: 1000,
        hourlyProfit: 50,
        category: 'personal',
        isActive: true,
        sales: 234
      },
      {
        id: 2,
        name: 'Restoran',
        image: null,
        price: 5000,
        hourlyProfit: 250,
        category: 'personal',
        isActive: true,
        sales: 156
      }
    ],
    business: [
      {
        id: 3,
        name: 'Ofis Binosi',
        image: null,
        price: 50000,
        hourlyProfit: 2500,
        category: 'business',
        isActive: true,
        sales: 89
      },
      {
        id: 4,
        name: 'Zavod',
        image: null,
        price: 100000,
        hourlyProfit: 5000,
        category: 'business',
        isActive: false,
        sales: 45
      }
    ],
    premium: [
      {
        id: 5,
        name: 'Burj Khalifa',
        image: null,
        price: 1000000,
        hourlyProfit: 50000,
        category: 'premium',
        isActive: true,
        sales: 12
      }
    ]
  };

  const handleExportExcel = () => {
    console.log('Exporting market data to Excel...');
  };

  const handleImportExcel = () => {
    console.log('Importing market data from Excel...');
  };

  const toggleItemStatus = (id: number) => {
    console.log(`Toggling status for item ${id}`);
  };

  const renderItemsTable = (items: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Predmet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Narx
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Soatlik Foyda
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sotuvlar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Savdoda
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 border-2 border-dashed border-gray-300">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category === 'personal' ? 'Shaxsiy' :
                       item.category === 'business' ? 'Biznes' : 'Premium'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {item.price.toLocaleString()} tanga
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.hourlyProfit.toLocaleString()} tanga/soat
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.sales.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`flex items-center space-x-2 ${
                    item.isActive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.isActive ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                  <span className="text-sm font-medium">
                    {item.isActive ? 'Savdoda' : 'Olib tashlangan'}
                  </span>
                </button>
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
        <h1 className="text-3xl font-bold text-gray-800">Bozor Boshqaruvi</h1>
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
            <span>Yangi Predmet</span>
          </button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shaxsiy Predmetlar</p>
              <p className="text-2xl font-bold text-gray-800">{marketCategories.personal.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Biznes Predmetlar</p>
              <p className="text-2xl font-bold text-gray-800">{marketCategories.business.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium Predmetlar</p>
              <p className="text-2xl font-bold text-gray-800">{marketCategories.premium.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Sotuvlar</p>
              <p className="text-2xl font-bold text-gray-800">536</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
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

      {/* Market Categories Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'personal', label: 'Shaxsiy', icon: Package },
              { id: 'business', label: 'Biznes', icon: ShoppingCart },
              { id: 'premium', label: 'Premium', icon: DollarSign }
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
          {activeTab === 'personal' && renderItemsTable(marketCategories.personal)}
          {activeTab === 'business' && renderItemsTable(marketCategories.business)}
          {activeTab === 'premium' && renderItemsTable(marketCategories.premium)}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Predmet Qo'shish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Predmet Nomi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Predmet nomini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="personal">Shaxsiy</option>
                  <option value="business">Biznes</option>
                  <option value="premium">Premium</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Soatlik Foyda (tanga)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rasm Yuklash</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Predmet rasmini yuklang</p>
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

export default MarketManagement;