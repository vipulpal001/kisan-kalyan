import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Radio, 
  Coins, 
  User, 
  X, 
  ShieldCheck, 
  QrCode, 
  LogOut, 
  MapPin, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import '../styles/MobileBottomNav.css';

export default function MobileBottomNav({ onOpenMenu: _onOpenMenu }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  // Close profile sheet on route change
  useEffect(() => {
    setShowProfileSheet(false);
  }, [location.pathname]);

  // Listen for global open-mobile-profile events (e.g. from mobile header profile icon)
  useEffect(() => {
    const handleOpen = () => setShowProfileSheet(true);
    window.addEventListener('open-mobile-profile', handleOpen);
    return () => window.removeEventListener('open-mobile-profile', handleOpen);
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      setShowProfileSheet(prev => !prev);
    }
  };

  const handleLogout = () => {
    setShowProfileSheet(false);
    logout();
    navigate('/login');
  };

  const isProfileActive = showProfileSheet || 
                          location.pathname.startsWith('/farmer/dashboard') || 
                          location.pathname.startsWith('/operator') || 
                          location.pathname.startsWith('/admin');

  return (
    <>
      {/* Slide-Up Profile Bottom Sheet Modal */}
      {showProfileSheet && (
        <div className="mobile-profile-sheet-backdrop" onClick={() => setShowProfileSheet(false)}>
          <div 
            className="mobile-profile-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Farmer Profile Sheet"
          >
            {/* Grab Handle */}
            <div className="profile-sheet-handle" />

            {/* Profile Header */}
            <div className="profile-sheet-header">
              <div className="profile-sheet-user-info">
                <div className="profile-sheet-avatar">
                  {(user?.name ? user.name[0] : 'U').toUpperCase()}
                </div>
                <div>
                  <h3 className="profile-sheet-name">
                    {user?.name || user?.username || 'Ramesh Singh'}
                  </h3>
                  <div className="profile-sheet-sub">
                    {user?.phone || user?.phoneNumber || '+91 98765 43210'} • {user?.role === 'OPERATOR' ? t('userRoleOperator', 'Operator') : t('userRoleFarmer', 'Farmer')}
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                className="profile-sheet-close-btn"
                onClick={() => setShowProfileSheet(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Verification Status Pill */}
            <div className="profile-sheet-status-pill">
              <ShieldCheck size={16} color="#059669" />
              <span>{t('pfmsCertified', 'Aadhaar Seeded DBT Bank Account Active')}</span>
            </div>

            {/* Quick Links Menu */}
            <div className="profile-sheet-links">
              <button 
                type="button"
                className="profile-sheet-link-item"
                onClick={() => {
                  setShowProfileSheet(false);
                  navigate('/farmer/dashboard');
                }}
              >
                <div className="profile-sheet-link-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
                  <Home size={18} />
                </div>
                <div className="profile-sheet-link-text">
                  <strong>{t('navHome', 'Farmer Dashboard')}</strong>
                  <span>{t('overview', 'Main Dashboard & Status')}</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button 
                type="button"
                className="profile-sheet-link-item"
                onClick={() => {
                  setShowProfileSheet(false);
                  navigate('/farmer/qr-pass');
                }}
              >
                <div className="profile-sheet-link-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <QrCode size={18} />
                </div>
                <div className="profile-sheet-link-text">
                  <strong>{t('showQrPass', 'My QR Verification Pass')}</strong>
                  <span>{t('entryVerification', 'Entry pass for procurement centre')}</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button 
                type="button"
                className="profile-sheet-link-item"
                onClick={() => {
                  setShowProfileSheet(false);
                  navigate('/farmer/payments');
                }}
              >
                <div className="profile-sheet-link-icon" style={{ background: '#fefce8', color: '#b45309' }}>
                  <Coins size={18} />
                </div>
                <div className="profile-sheet-link-text">
                  <strong>{t('navPayments', 'DBT Payment History')}</strong>
                  <span>{t('transferredSuccessAadhaar', 'Bank account disbursement status')}</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button 
                type="button"
                className="profile-sheet-link-item"
                onClick={() => {
                  setShowProfileSheet(false);
                  navigate('/centers');
                }}
              >
                <div className="profile-sheet-link-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <MapPin size={18} />
                </div>
                <div className="profile-sheet-link-text">
                  <strong>{t('navFindCentres', 'Procurement Centres')}</strong>
                  <span>{t('centreNearYou', 'Find nearby centres & check crowd')}</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button 
                type="button"
                className="profile-sheet-link-item"
                onClick={() => {
                  setShowProfileSheet(false);
                  navigate('/help');
                }}
              >
                <div className="profile-sheet-link-icon" style={{ background: '#fdf4ff', color: '#9333ea' }}>
                  <HelpCircle size={18} />
                </div>
                <div className="profile-sheet-link-text">
                  <strong>{t('helpFaq', 'Help & Kisan Helpline')}</strong>
                  <span>1800-180-1551 (Toll-Free)</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>
            </div>

            {/* Logout Action */}
            <div className="profile-sheet-footer">
              <button 
                type="button" 
                className="profile-sheet-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>{t('logout', 'लॉगआउट (Logout)')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <div className="mobile-nav-inner">
          {/* 1. Home */}
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
            aria-label={t('navHome', 'Home')}
          >
            <div className="mobile-nav-icon-box">
              <Home size={20} />
            </div>
            <span className="mobile-nav-label">{t('navHome', 'Home')}</span>
          </NavLink>

          {/* 2. Book Slot */}
          <NavLink 
            to="/farmer/book-slot" 
            className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
            aria-label={t('navBookSlot', 'Book Slot')}
          >
            <div className="mobile-nav-icon-box">
              <Calendar size={20} />
            </div>
            <span className="mobile-nav-label">{t('navBookSlot', 'Book Slot')}</span>
          </NavLink>

          {/* 3. Live Queue (With glowing active badge) */}
          <NavLink 
            to="/farmer/queue" 
            className={({ isActive }) => `mobile-nav-tab queue-tab ${isActive ? 'active' : ''}`}
            aria-label={t('navLiveQueue', 'Queue')}
          >
            <div className="mobile-nav-icon-box queue-icon-box">
              <Radio size={20} />
              <span className="queue-live-pip" aria-hidden="true" />
            </div>
            <span className="mobile-nav-label">{t('navLiveQueue', 'Queue')}</span>
          </NavLink>

          {/* 4. Payments (DBT) */}
          <NavLink 
            to="/farmer/payments" 
            className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
            aria-label={t('navPayments', 'Payments')}
          >
            <div className="mobile-nav-icon-box">
              <Coins size={20} />
            </div>
            <span className="mobile-nav-label">{t('navPayments', 'Payments')}</span>
          </NavLink>

          {/* 5. Profile */}
          <button 
            type="button"
            onClick={handleProfileClick}
            className={`mobile-nav-tab ${isProfileActive ? 'active' : ''}`}
            aria-label={user ? t('myProfile', 'Profile') : t('loginBtn', 'Login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="mobile-nav-icon-box">
              <User size={20} />
            </div>
            <span className="mobile-nav-label">
              {user ? t('myProfile', 'Profile') : t('loginBtn', 'Login')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
