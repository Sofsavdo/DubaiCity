
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image } from 'lucide-react';

interface Skin {
  id: number;
  name: string;
  price: number;
  rarity: string;
  image: string;
  isAvailable: boolean;
  purchases: number;
}

const Skins: React.FC = () => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkins();
  }, []);

  const fetchSkins = async () => {
    try {
      const response = await fetch('/api/admin/skins');
      const data = await response.json();
      if (data.success) {
        setSkins(data.data);
      }
    } catch (error) {
      console.error('Error fetching skins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Skins Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Add Skin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skins.map((skin) => (
          <div key={skin.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-700 flex items-center justify-center">
              {skin.image ? (
                <img 
                  src={skin.image} 
                  alt={skin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image size={48} className="text-gray-500" />
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{skin.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(skin.rarity)}`}>
                  {skin.rarity}
                </span>
              </div>
              <div className="text-yellow-400 font-bold mb-2">{skin.price} coins</div>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                <span>{skin.purchases} purchases</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  skin.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {skin.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1">
                  <Edit size={14} />
                  Edit
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skins;
