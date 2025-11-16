
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStateProvider, useGlobalState } from './context/GlobalStateContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import BuyCreditsPage from './pages/BuyCreditsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import PaymentRequestsPage from './pages/PaymentRequestsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </GlobalStateProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, currentUser } = useGlobalState();

  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
      
      <Route path="/" element={isAuthenticated ? <Layout><DashboardPage /></Layout> : <Navigate to="/auth" /> } />
      <Route path="/buy-credits" element={isAuthenticated ? <Layout><BuyCreditsPage /></Layout> : <Navigate to="/auth" /> } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={isAdmin ? <Layout><AdminDashboardPage /></Layout> : <Navigate to="/" />} />
      <Route path="/admin/users" element={isAdmin ? <Layout><UserManagementPage /></Layout> : <Navigate to="/" />} />
      <Route path="/admin/payments" element={isAdmin ? <Layout><PaymentRequestsPage /></Layout> : <Navigate to="/" />} />
      <Route path="/admin/settings" element={isAdmin ? <Layout><AdminSettingsPage /></Layout> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
    </Routes>
  );
};

export default App;
