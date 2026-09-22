import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppHeader from './components/AppHeader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BookSlotFlow from './pages/BookSlotFlow';
import LiveQueuePage from './pages/LiveQueuePage';
import ProcurementStatusPage from './pages/ProcurementStatusPage';
import OperatorDashboard from './pages/OperatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CenterDiscoveryPage from './pages/CenterDiscoveryPage';
import HelpPage from './pages/HelpPage';
import QrPassPage from './pages/QrPassPage';
import FarmerPaymentPage from './pages/FarmerPaymentPage';
import './styles/app.css';

const AppProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>लोड हो रहा है...</div>;
  if (!user) return <Navigate to="/app/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/app" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <div className="kisan-app-root">
      <AppHeader />
      <main style={{ flex: 1, paddingBottom: '70px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/centers" element={<CenterDiscoveryPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Farmer App Routes */}
          <Route path="/farmer/dashboard" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <FarmerDashboard />
            </AppProtectedRoute>
          } />
          <Route path="/farmer/book-slot" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <BookSlotFlow />
            </AppProtectedRoute>
          } />
          <Route path="/farmer/queue" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <LiveQueuePage />
            </AppProtectedRoute>
          } />
          <Route path="/farmer/procurement-status" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <ProcurementStatusPage />
            </AppProtectedRoute>
          } />
          <Route path="/farmer/qr-pass" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <QrPassPage />
            </AppProtectedRoute>
          } />
          <Route path="/farmer/payment" element={
            <AppProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <FarmerPaymentPage />
            </AppProtectedRoute>
          } />

          {/* Operator App Routes */}
          <Route path="/operator/dashboard" element={
            <AppProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
              <OperatorDashboard />
            </AppProtectedRoute>
          } />
          <Route path="/operator/queue" element={
            <AppProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
              <LiveQueuePage />
            </AppProtectedRoute>
          } />

          {/* Admin App Routes */}
          <Route path="/admin/dashboard" element={
            <AppProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </AppProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>
    </div>
  );
}
