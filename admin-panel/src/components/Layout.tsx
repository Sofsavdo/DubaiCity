
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, Users, Tasks, Palette, Store, Gift, 
  Bell, Building, Settings, LogOut, BarChart3 
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Foydalanuvchilar' },
    { path: '/tasks', icon: Tasks, label: 'Vazifalar' },
    { path: '/skins', icon: Palette, label: 'Skinlar' },
    { path: '/businesses', icon: Building, label: 'Bizneslar' },
    { path: '/promocodes', icon: Gift, label: 'Promo kodlar' },
    { path: '/notifications', icon: Bell, label: 'Bildirishnomalar' },
    { path: '/teams', icon: Users, label: 'Jamoalar' },
    { path: '/projects', icon: BarChart3, label: 'Loyihalar' },
    { path: '/settings', icon: Settings, label: 'Sozlamalar' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gradient">Dubai City Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Salom, {user?.username}</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={logout}
            className="flex items-center w-full px-6 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors mt-4"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Chiqish
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h2>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
