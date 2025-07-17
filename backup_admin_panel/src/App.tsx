import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import SkinsManagement from './components/SkinsManagement';
import TasksManagement from './components/TasksManagement';
import PricesManagement from './components/PricesManagement';
import NotificationsManagement from './components/NotificationsManagement';
import MarketManagement from './components/MarketManagement';
import AssetsManagement from './components/AssetsManagement';
import PromoCodesManagement from './components/PromoCodesManagement';
import ReportsManagement from './components/ReportsManagement';
import Settings from './components/Settings';
import EmpireManagement from './components/EmpireManagement';
import ProjectsManagement from './components/ProjectsManagement';
import TeamManagement from './components/TeamManagement';
import ProfileManagement from './components/ProfileManagement';
import StatisticsManagement from './components/StatisticsManagement';
import GameInterface from './pages/GameInterface';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGameMode, setIsGameMode] = useState(false);

  useEffect(() => {
    // Check if running in Telegram Web App
    const urlParams = new URLSearchParams(window.location.search);
    const isWebApp = urlParams.get('tgWebAppPlatform') || window.Telegram?.WebApp;
    
    if (isWebApp) {
      setIsGameMode(true);
    }
  }, []);

  // If in game mode, show game interface
  if (isGameMode) {
    return <GameInterface />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersManagement />;
      case 'empire':
        return <EmpireManagement />;
      case 'skins':
        return <SkinsManagement />;
      case 'tasks':
        return <TasksManagement />;
      case 'prices':
        return <PricesManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      case 'market':
        return <MarketManagement />;
      case 'assets':
        return <AssetsManagement />;
      case 'promocodes':
        return <PromoCodesManagement />;
      case 'projects':
        return <ProjectsManagement />;
      case 'team':
        return <TeamManagement />;
      case 'profile':
        return <ProfileManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'statistics':
        return <StatisticsManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;