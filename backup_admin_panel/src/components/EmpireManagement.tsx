import React, { useState } from 'react';
import { Crown, Upload, Download, Plus, Edit, Trash2, Image, Star } from 'lucide-react';

const EmpireManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('levels');

  const empireLevels = [
    { id: 1, level: 1, name: 'Yangi Boshlovchi', avatar: null, minPoints: 0, maxPoints: 100 },
    { id: 2, level: 2, name: 'Kichik Tadbirkor', avatar: null, minPoints: 101, maxPoints: 250 },
    { id: 3, level: 3, name: 'Biznes Boshlang\'ich', avatar: null, minPoints: 251, maxPoints: 500 },
    { id: 4, level: 4, name: 'Savdo Mutaxassisi', avatar: null, minPoints: 501, maxPoints: 1000 },
    { id: 5, level: 5, name: 'Bozor Ustasi', avatar: null, minPoints: 1001, maxPoints: 2000 },
    { id: 6, level: 6, name: 'Investitsiya Menejeri', avatar: null, minPoints: 2001, maxPoints: 4000 },
    { id: 7, level: 7, name: 'Moliya Direktori', avatar: null, minPoints: 4001, maxPoints: 8000 },
    { id: 8, level: 8, name: 'Biznes Magnati', avatar: null, minPoints: 8001, maxPoints: 15000 },
    { id: 9, level: 9, name: 'Imperiya Quruvchisi', avatar: null, minPoints: 15001, maxPoints: 30000 },
    { id: 10, level: 10, name: 'Millioner', avatar: null, minPoints: 30001, maxPoints: 60000 },
    { id: 11, level: 11, name: 'Multi-Millioner', avatar: null, minPoints: 60001, maxPoints: 120000 },
    { id: 12, level: 12, name: 'Billioner', avatar: null, minPoints: 120001, maxPoints: 250000 },
    { id: 13, level: 13, name: 'Imperiya Imperatori', avatar: null, minPoints: 250001, maxPoints: 500000 },
    { id: 14, level: 14, name: 'Dubai Shohi', avatar: null, minPoints: 500001, maxPoints: 1000000 }
  ];

  const handleExportExcel = () => {
    console.log('Exporting empire data to Excel...');
  };

  const handleImportExcel = () => {
    console.log('Importing empire data from Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Imperiya Boshqaruvi</h1>
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
            <span>Yangi Daraja</span>
          </button>
        </div>
      </div>

      {/* Empire Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Darajalar</p>
              <p className="text-2xl font-bold text-gray-800">14</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eng Yuqori Daraja</p>
              <p className="text-2xl font-bold text-gray-800">Dubai Shohi</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maksimal Ball</p>
              <p className="text-2xl font-bold text-gray-800">1,000,000</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avatar Mavjud</p>
              <p className="text-2xl font-bold text-gray-800">0/14</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
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

      {/* Empire Levels Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Reyting Tizimi Darajalari</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daraja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ball Oralig'i
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {empireLevels.map((level) => (
                <tr key={level.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Crown className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Daraja {level.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{level.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {level.avatar ? (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {level.minPoints.toLocaleString()} - {level.maxPoints.toLocaleString()}
                    </div>
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
      </div>

      {/* Add Level Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Daraja Qo'shish</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daraja Raqami</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daraja Nomi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Yangi daraja nomi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Ball</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Ball</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Yuklash</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Avatar rasmini yuklang</p>
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

export default EmpireManagement;