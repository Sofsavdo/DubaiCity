import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { useTheme } from './context/ThemeContext';
import { useSidebar } from './context/SidebarContext';
import { useHeader } from './context/HeaderContext';
import { useDashboard } from './context/DashboardContext';
import { useUsersManagement } from './context/UsersManagementContext';
import { useSkinsManagement } from './context/SkinsManagementContext';
import { useTasksManagement } from './context/TasksManagementContext';
import { usePricesManagement } from './context/PricesManagementContext';
import { useNotificationsManagement } from './context/NotificationsManagementContext';
import { useMarketManagement } from './context/MarketManagementContext';
import { useAssetsManagement } from './context/AssetsManagementContext';
import { usePromoCodesManagement } from './context/PromoCodesManagementContext';
import { useReportsManagement } from './context/ReportsManagementContext';
import { useSettings } from './context/SettingsContext';
import { useEmpireManagement } from './context/EmpireManagementContext';
import { useProjectsManagement } from './context/ProjectsManagementContext';
import { useTeamManagement } from './context/TeamManagementContext';
import { useProfileManagement } from './context/ProfileManagementContext';
import { useStatisticsManagement } from './context/StatisticsManagementContext';
import { useGameInterface } from './context/GameInterfaceContext';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Header = lazy(() => import('./components/Header'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const UsersManagement = lazy(() => import('./components/UsersManagement'));
const SkinsManagement = lazy(() => import('./components/SkinsManagement'));
const TasksManagement = lazy(() => import('./components/TasksManagement'));
const PricesManagement = lazy(() => import('./components/PricesManagement'));
const NotificationsManagement = lazy(() => import('./components/NotificationsManagement'));
const MarketManagement = lazy(() => import('./components/MarketManagement'));
const AssetsManagement = lazy(() => import('./components/AssetsManagement'));
const PromoCodesManagement = lazy(() => import('./components/PromoCodesManagement'));
const ReportsManagement = lazy(() => import('./components/ReportsManagement'));
const Settings = lazy(() => import('./components/Settings'));
const EmpireManagement = lazy(() => import('./components/EmpireManagement'));
const ProjectsManagement = lazy(() => import('./components/ProjectsManagement'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));
const ProfileManagement = lazy(() => import('./components/ProfileManagement'));
const StatisticsManagement = lazy(() => import('./components/StatisticsManagement'));
const GameInterface = lazy(() => import('./pages/GameInterface'));

function App() {
  const { isAuthenticated, loading } = useAuth();
  const { showNotification } = useNotification();
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { setHeaderTitle, setHeaderSubtitle } = useHeader();
  const { setDashboardContent } = useDashboard();
  const { setUsersManagementContent } = useUsersManagement();
  const { setSkinsManagementContent } = useSkinsManagement();
  const { setTasksManagementContent } = useTasksManagement();
  const { setPricesManagementContent } = usePricesManagement();
  const { setNotificationsManagementContent } = useNotificationsManagement();
  const { setMarketManagementContent } = useMarketManagement();
  const { setAssetsManagementContent } = useAssetsManagement();
  const { setPromoCodesManagementContent } = usePromoCodesManagement();
  const { setReportsManagementContent } = useReportsManagement();
  const { setSettingsContent } = useSettings();
  const { setEmpireManagementContent } = useEmpireManagement();
  const { setProjectsManagementContent } = useProjectsManagement();
  const { setTeamManagementContent } = useTeamManagement();
  const { setProfileManagementContent } = useProfileManagement();
  const { setStatisticsManagementContent } = useStatisticsManagement();
  const { setGameInterfaceContent } = useGameInterface();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      showNotification('error', 'Authentication failed. Please log in again.');
      return;
    }

    // Set default content for the dashboard
    setDashboardContent(<Dashboard />);
    setHeaderTitle('Dashboard');
    setHeaderSubtitle('Welcome to your admin panel');

    // Set default content for the sidebar
    setUsersManagementContent(<UsersManagement />);
    setSkinsManagementContent(<SkinsManagement />);
    setTasksManagementContent(<TasksManagement />);
    setPricesManagementContent(<PricesManagement />);
    setNotificationsManagementContent(<NotificationsManagement />);
    setMarketManagementContent(<MarketManagement />);
    setAssetsManagementContent(<AssetsManagement />);
    setPromoCodesManagementContent(<PromoCodesManagement />);
    setReportsManagementContent(<ReportsManagement />);
    setSettingsContent(<Settings />);
    setEmpireManagementContent(<EmpireManagement />);
    setProjectsManagementContent(<ProjectsManagement />);
    setTeamManagementContent(<TeamManagement />);
    setProfileManagementContent(<ProfileManagement />);
    setStatisticsManagementContent(<StatisticsManagement />);
    setGameInterfaceContent(<GameInterface />);

  }, [loading, isAuthenticated, showNotification, setDashboardContent, setHeaderTitle, setHeaderSubtitle, setUsersManagementContent, setSkinsManagementContent, setTasksManagementContent, setPricesManagementContent, setNotificationsManagementContent, setMarketManagementContent, setAssetsManagementContent, setPromoCodesManagementContent, setReportsManagementContent, setSettingsContent, setEmpireManagementContent, setProjectsManagementContent, setTeamManagementContent, setProfileManagementContent, setStatisticsManagementContent, setGameInterfaceContent]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the admin panel.</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/skins" element={<SkinsManagement />} />
              <Route path="/tasks" element={<TasksManagement />} />
              <Route path="/prices" element={<PricesManagement />} />
              <Route path="/notifications" element={<NotificationsManagement />} />
              <Route path="/market" element={<MarketManagement />} />
              <Route path="/assets" element={<AssetsManagement />} />
              <Route path="/promo-codes" element={<PromoCodesManagement />} />
              <Route path="/reports" element={<ReportsManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/empire" element={<EmpireManagement />} />
              <Route path="/projects" element={<ProjectsManagement />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/profile" element={<ProfileManagement />} />
              <Route path="/statistics" element={<StatisticsManagement />} />
              <Route path="/game" element={<GameInterface />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;