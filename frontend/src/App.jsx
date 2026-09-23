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

            <footer style={{ background: '#064022', color: '#ecfdf5', padding: '24px 0', marginTop: 'auto', borderTop: '3px solid #059669' }}>
              <div className="portal-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <strong>किसान कल्याण पोर्टल (Kisan Kalyan Portal)</strong> • भारत सरकार
                  <div style={{ color: '#a7f3d0', fontSize: '0.78rem', marginTop: '2px' }}>
                    Smart Procurement & Storage Management Portal © 2026. All Rights Reserved.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="/help" style={{ color: '#fef08a', textDecoration: 'none' }}>मदद व संपर्क</a>
                  <a href="/centers" style={{ color: '#fef08a', textDecoration: 'none' }}>खरीद केंद्र</a>
                  <a href="/login" style={{ color: '#fef08a', textDecoration: 'none' }}>अधिकारी लॉगिन</a>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
