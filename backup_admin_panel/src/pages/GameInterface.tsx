import React, { useState, useEffect } from 'react';
import { Coins, Trophy, Users, Store, Gift, Settings } from 'lucide-react';

// Simple game interface for testing
const GameInterface: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [telegramData, setTelegramData] = useState<any>(null);

  useEffect(() => {
    initializeTelegramWebApp();
  }, []);

  const initializeTelegramWebApp = async () => {
    try {
      // Check if Telegram Web App is available
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        
        // Set theme
        webApp.setHeaderColor('#1f2937');
        webApp.setBackgroundColor('#f3f4f6');
        
        // Get init data
        const initData = webApp.initData;
        
        if (initData) {
          // Authenticate with backend
          await authenticateUser(initData);
          
          // Expand Web App to full height
          webApp.expand();
          webApp.enableClosingConfirmation();
          
          // Set Telegram data
          setTelegramData({
            user: webApp.initDataUnsafe?.user,
            query_id: webApp.initDataUnsafe?.query_id,
            platform: webApp.platform,
            version: webApp.version,
          });
        } else {
          // For testing without Telegram
          setUser({
            id: 1,
            username: 'test_user',
            firstName: 'Test',
            lastName: 'User',
            coins: 1000,
            empireLevel: 2,
            isActive: true,
          });
        }
      } else {
        // For testing without Telegram
        setUser({
          id: 1,
          username: 'test_user',
          firstName: 'Test',
          lastName: 'User',
          coins: 1000,
          empireLevel: 2,
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Error initializing Telegram Web App:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticateUser = async (initData: string) => {
    try {
      const response = await fetch('/api/telegram/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      const result = await response.json();
      
      if (result.success) {
        setUser(result.data.user);
        console.log('User authenticated:', result.data.user);
      } else {
        console.error('Authentication failed:', result.message);
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
  };

  const GameCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">O'yin yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {user?.firstName || 'Foydalanuvchi'}
                </h1>
                <p className="text-sm text-gray-500">
                  Daraja {user?.empireLevel || 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Coinlar</p>
              <p className="text-lg font-bold text-yellow-600">
                {user?.coins?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Game Stats */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <GameCard
            title="Coinlar"
            value={user?.coins?.toLocaleString() || '0'}
            icon={<Coins className="w-5 h-5 text-white" />}
            color="bg-yellow-500"
          />
          <GameCard
            title="Daraja"
            value={user?.empireLevel?.toString() || '1'}
            icon={<Trophy className="w-5 h-5 text-white" />}
            color="bg-purple-500"
          />
        </div>

        {/* Game Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">O'yin harakatlari</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:bg-blue-700 transition-colors">
                <Store className="w-5 h-5" />
                <span className="text-sm">Biznes</span>
              </button>
              
              <button className="bg-green-600 text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:bg-green-700 transition-colors">
                <Gift className="w-5 h-5" />
                <span className="text-sm">Topshiriq</span>
              </button>
              
              <button className="bg-purple-600 text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:bg-purple-700 transition-colors">
                <Users className="w-5 h-5" />
                <span className="text-sm">Jamoalar</span>
              </button>
              
              <button className="bg-gray-600 text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:bg-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Sozlamalar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Info (for debugging) */}
        {telegramData && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Telegram Ma'lumotlari</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Platform: {telegramData.platform}</p>
              <p>Version: {telegramData.version}</p>
              <p>User ID: {telegramData.user?.id}</p>
              <p>Username: @{telegramData.user?.username}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;