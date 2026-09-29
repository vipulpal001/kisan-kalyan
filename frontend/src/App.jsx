import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
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
import Footer from './components/Footer';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>लोड हो रहा है...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BookingProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/centers" element={<CenterDiscoveryPage />} />
                <Route path="/help" element={<HelpPage />} />

                {/* Farmer Routes */}
                <Route path="/farmer/dashboard" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/book-slot" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <BookSlotFlow />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/queue" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <LiveQueuePage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/procurement-status" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <ProcurementStatusPage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/qr-pass" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <QrPassPage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/payment" element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <FarmerPaymentPage />
                  </ProtectedRoute>
                } />

                {/* Operator Routes */}
                <Route path="/operator/dashboard" element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/operator/queue" element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <LiveQueuePage />
                  </ProtectedRoute>
                } />
                <Route path="/operator/weighbridge" element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
