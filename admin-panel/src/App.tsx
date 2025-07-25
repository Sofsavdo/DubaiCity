
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Tasks from './pages/Tasks'
import Skins from './pages/Skins'
import Businesses from './pages/Businesses'
import PromoCodes from './pages/PromoCodes'
import Notifications from './pages/Notifications'
import Teams from './pages/Teams'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="skins" element={<Skins />} />
          <Route path="businesses" element={<Businesses />} />
          <Route path="promocodes" element={<PromoCodes />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="teams" element={<Teams />} />
          <Route path="projects" element={<Projects />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
