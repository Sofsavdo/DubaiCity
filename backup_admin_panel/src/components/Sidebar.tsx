import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Crown,
  Palette, 
  CheckSquare, 
  DollarSign, 
  Bell, 
  ShoppingCart, 
  Package, 
  Gift, 
  FileText, 
  Settings,
  Building,
  FolderOpen,
  UserCheck,
  User,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'O\'yinchilar', icon: Users },
    { id: 'empire', label: 'Imperiya', icon: Crown },
    { id: 'skins', label: 'Ko\'rinish', icon: Palette },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'prices', label: 'Narxlar & Mukofotlar', icon: DollarSign },
    { id: 'notifications', label: 'Habarlar', icon: Bell },
    { id: 'market', label: 'Bozor', icon: ShoppingCart },
    { id: 'assets', label: 'Aktivlar', icon: Package },
    { id: 'promocodes', label: 'Promo Kodlar', icon: Gift },
    { id: 'projects', label: 'Loyihalar', icon: FolderOpen },
    { id: 'team', label: 'Jamoa', icon: UserCheck },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'reports', label: 'Hisobotlar', icon: FileText },
    { id: 'statistics', label: 'Statistika', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dubai City Bot</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default Sidebar;