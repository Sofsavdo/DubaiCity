import React, { useState, useEffect, Suspense, lazy } from 'react';
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
    return <Suspense fallback={<div>Loading...</div>}><GameInterface /></Suspense>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>;
      case 'users':
        return <Suspense fallback={<div>Loading...</div>}><UsersManagement /></Suspense>;
      case 'empire':
        return <Suspense fallback={<div>Loading...</div>}><EmpireManagement /></Suspense>;
      case 'skins':
        return <Suspense fallback={<div>Loading...</div>}><SkinsManagement /></Suspense>;
      case 'tasks':
        return <Suspense fallback={<div>Loading...</div>}><TasksManagement /></Suspense>;
      case 'prices':
        return <Suspense fallback={<div>Loading...</div>}><PricesManagement /></Suspense>;
      case 'notifications':
        return <Suspense fallback={<div>Loading...</div>}><NotificationsManagement /></Suspense>;
      case 'market':
        return <Suspense fallback={<div>Loading...</div>}><MarketManagement /></Suspense>;
      case 'assets':
        return <Suspense fallback={<div>Loading...</div>}><AssetsManagement /></Suspense>;
      case 'promocodes':
        return <Suspense fallback={<div>Loading...</div>}><PromoCodesManagement /></Suspense>;
      case 'projects':
        return <Suspense fallback={<div>Loading...</div>}><ProjectsManagement /></Suspense>;
      case 'team':
        return <Suspense fallback={<div>Loading...</div>}><TeamManagement /></Suspense>;
      case 'profile':
        return <Suspense fallback={<div>Loading...</div>}><ProfileManagement /></Suspense>;
      case 'reports':
        return <Suspense fallback={<div>Loading...</div>}><ReportsManagement /></Suspense>;
      case 'statistics':
        return <Suspense fallback={<div>Loading...</div>}><StatisticsManagement /></Suspense>;
      case 'settings':
        return <Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>;
      default:
        return <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /></Suspense>
      <div className="ml-64">
        <Suspense fallback={<div>Loading...</div>}><Header /></Suspense>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;