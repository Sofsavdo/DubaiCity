
import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Eye } from 'lucide-react';

interface User {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  coins: number;
  empireLevel: number;
  referralCode: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=20`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegramId.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Foydalanuvchilar</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yangi Foydalanuvchi</span>
        </button>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Foydalanuvchi qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Foydalanuvchi</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Tangalar</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Daraja</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Ro'yxatdan o'tgan</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-white">{user.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-white font-medium">{user.firstName}</div>
                      <div className="text-gray-400 text-sm">@{user.username}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-yellow-400 font-medium">
                    {user.coins.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-blue-400">{user.empireLevel}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-400 hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-400 hover:text-green-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Foydalanuvchilar topilmadi
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
