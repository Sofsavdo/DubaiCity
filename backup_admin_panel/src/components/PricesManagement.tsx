import React, { useState } from 'react';
import { DollarSign, Edit, Save, X } from 'lucide-react';

const PricesManagement: React.FC = () => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [prices, setPrices] = useState({
    // Skinlar narxlari
    commonSkin: 100,
    epicSkin: 250,
    legendarySkin: 500,
    mythicSkin: 1000,
    
    // Topshiriq mukofotlari
    dailyLogin: 50,
    socialTask: 200,
    referralTask: 500,
    specialTask: 1000,
    
    // Bozor narxlari
    coinPack100: 1,
    coinPack500: 4,
    coinPack1000: 7,
    coinPack5000: 30,
    
    // Maxsus mukofotlar
    levelUpBonus: 100,
    achievementBonus: 300,
    tournamentWin: 2000,
    weeklyBonus: 500
  });

  const priceCategories = [
    {
      title: 'Skinlar Narxlari',
      items: [
        { key: 'commonSkin', label: 'Oddiy Skin', unit: 'tanga' },
        { key: 'epicSkin', label: 'Epic Skin', unit: 'tanga' },
        { key: 'legendarySkin', label: 'Legendary Skin', unit: 'tanga' },
        { key: 'mythicSkin', label: 'Mythic Skin', unit: 'tanga' }
      ]
    },
    {
      title: 'Topshiriq Mukofotlari',
      items: [
        { key: 'dailyLogin', label: 'Kunlik Login', unit: 'tanga' },
        { key: 'socialTask', label: 'Ijtimoiy Topshiriq', unit: 'tanga' },
        { key: 'referralTask', label: 'Taklif Topshiriqi', unit: 'tanga' },
        { key: 'specialTask', label: 'Maxsus Topshiriq', unit: 'tanga' }
      ]
    },
    {
      title: 'Tanga Paketlari (USD)',
      items: [
        { key: 'coinPack100', label: '100 Tanga', unit: '$' },
        { key: 'coinPack500', label: '500 Tanga', unit: '$' },
        { key: 'coinPack1000', label: '1000 Tanga', unit: '$' },
        { key: 'coinPack5000', label: '5000 Tanga', unit: '$' }
      ]
    },
    {
      title: 'Maxsus Mukofotlar',
      items: [
        { key: 'levelUpBonus', label: 'Daraja Ko\'tarilish', unit: 'tanga' },
        { key: 'achievementBonus', label: 'Yutuq Mukofoti', unit: 'tanga' },
        { key: 'tournamentWin', label: 'Turnir G\'alaba', unit: 'tanga' },
        { key: 'weeklyBonus', label: 'Haftalik Bonus', unit: 'tanga' }
      ]
    }
  ];

  const handleEdit = (key: string) => {
    setEditingItem(key);
  };

  const handleSave = (key: string, value: string) => {
    setPrices(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Narxlar va Mukofotlar</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>Barcha narxlar real vaqtda yangilanadi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {priceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.label}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {editingItem === item.key ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue={prices[item.key as keyof typeof prices]}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSave(item.key, (e.target as HTMLInputElement).value);
                              }
                            }}
                            autoFocus
                          />
                          <span className="text-sm text-gray-600">{item.unit}</span>
                          <button
                            onClick={() => {
                              const input = document.querySelector(`input[defaultValue="${prices[item.key as keyof typeof prices]}"]`) as HTMLInputElement;
                              handleSave(item.key, input.value);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">
                            {prices[item.key as keyof typeof prices]} {item.unit}
                          </span>
                          <button
                            onClick={() => handleEdit(item.key)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tezkor Amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Barcha Narxlarni 10% Oshirish</p>
            </div>
          </button>
          
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Mukofotlarni 20% Oshirish</p>
            </div>
          </button>
          
          <button className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Asl Narxlarni Tiklash</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricesManagement;