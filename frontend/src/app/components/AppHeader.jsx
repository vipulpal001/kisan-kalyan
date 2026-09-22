import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { useWebSocketSubscription, useWebSocketStatus } from "../../hooks/useWebSocket";
import { 
  Bell, 
  ChevronDown, 
  User, 
  Eye, 
  Search, 
  Phone, 
  Home, 
  Calendar, 
  Users, 
  Package, 
  Coins, 
  MapPin, 
  Headphones, 
  Sun, 
  Moon,
  Menu,
  X
} from 'lucide-react';
import kisanKalyanLogo from "../../assets/kisan_kalyan_official_logo.png";
import ashokaEmblem from "../../assets/ashoka_emblem.png";

export default function Header() {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, fontSize, setFontSize, highContrast, toggleHighContrast, darkMode, toggleDarkMode, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const wsStatus = useWebSocketStatus();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live WebSocket notifications
  useWebSocketSubscription('/topic/notifications', () => {
    if (user) fetchNotifications();
  });

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/farmer/notifications');
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/farmer/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const markSingleRead = async (id) => {
    try {
      await api.put(`/farmer/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.notificationId === id ? ({ ...n, isRead: true }) : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('slot') || q.includes('book') || q.includes('स्लॉट') || q.includes('आरक्षण')) navigate('/farmer/book-slot');
    else if (q.includes('queue') || q.includes('token') || q.includes('कतार') || q.includes('टोकन')) navigate('/live-queue');
    else if (q.includes('status') || q.includes('jform') || q.includes('उपार्जन') || q.includes('स्थिति')) navigate('/farmer/procurement-status');
    else if (q.includes('pay') || q.includes('dbt') || q.includes('भुगतान') || q.includes('बैंक')) navigate('/farmer/payments');
    else if (q.includes('centre') || q.includes('center') || q.includes('केंद्र')) navigate('/find-centres');
    else navigate('/find-centres');
  };

  const navTabs = [
    { label: t('navHome', 'मुख्य पृष्ठ'), path: '/farmer/dashboard', icon: <Home size={15} /> },
    { label: t('navBookSlot', 'स्लॉट आरक्षण'), path: '/farmer/book-slot', icon: <Calendar size={15} color="#059669" /> },
    { label: t('navLiveQueue', 'लाइव कतार'), path: '/live-queue', icon: <Users size={15} color="#2563eb" /> },
    { label: t('navProcurementStatus', 'उपार्जन स्थिति'), path: '/farmer/procurement-status', icon: <Package size={15} color="#d97706" /> },
    { label: t('navPayment', 'भुगतान (DBT)'), path: '/farmer/payments', icon: <Coins size={15} color="#16a34a" /> },
    { label: t('navCenters', 'उपार्जन केंद्र खोजें'), path: '/find-centres', icon: <MapPin size={15} color="#0d9488" /> },
    { label: t('navHelp', 'सहायता एवं समर्थन'), path: '/support', icon: <Headphones size={15} color="#e11d48" /> }
  ];

  const isActiveTab = (tabPath) => {
    if (tabPath === '/farmer/dashboard') {
      return location.pathname === '/' || location.pathname === '/farmer/dashboard';
    }
    if (tabPath === '/live-queue') {
      return location.pathname === '/live-queue' || location.pathname === '/farmer/queue' || location.pathname === '/operator/queue';
    }
    if (tabPath === '/find-centres') {
      return location.pathname === '/find-centres' || location.pathname === '/centers';
    }
    if (tabPath === '/farmer/payments') {
      return location.pathname === '/farmer/payments' || location.pathname === '/farmer/payment';
    }
    if (tabPath === '/support') {
      return location.pathname === '/support' || location.pathname === '/help';
    }
    return location.pathname === tabPath;
  };

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      
      {/* Top Ministry Ribbon - Ultra Compact */}
      <div style={{ 
        background: '#043d30',
        color: '#ffffff', 
        padding: '3px 12px',
        fontSize: '0.72rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <strong style={{ color: '#fde047' }}>{t('satyameva', 'सत्यमेव जयते')}</strong>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>{lang === 'hi' ? 'भारत सरकार' : 'Govt of India'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <a href="tel:18001801551" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>
            📞 1800-180-1551
          </a>

          <button
            onClick={toggleLanguage}
            style={{ background: '#ffffff', color: '#043d30', border: 'none', borderRadius: '10px', padding: '1px 8px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
          >
            🌐 {lang === 'hi' ? 'EN' : 'हिन्दी'}
          </button>
        </div>
      </div>

      {/* Main Bar: Branding + Search + Profile */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px 12px',
        background: '#ffffff',
        gap: '8px'
      }}>
        {/* Brand */}
        <Link to="/farmer/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={kisanKalyanLogo} alt="Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#064e3b', lineHeight: 1.1 }}>
              किसान कल्याण
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
              ई-उपार्जन पोर्टल
            </div>
          </div>
        </Link>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(prev => !prev)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
            >
              <Bell size={15} color="#475569" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div style={{ position: 'absolute', top: '38px', right: 0, width: '280px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 200, padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.8rem' }}>सूचनाएं ({unreadCount})</strong>
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>सभी पढ़ें</button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.notificationId} onClick={() => markSingleRead(n.notificationId)} style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem', cursor: 'pointer' }}>
                      {n.message}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>कोई नई सूचना नहीं</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Button */}
          {user ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(prev => !prev)}
                style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '16px', padding: '4px 10px', fontSize: '0.76rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <User size={13} />
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.username}</span>
                <ChevronDown size={11} />
              </button>

              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '34px', right: 0, width: '180px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 200, padding: '6px' }}>
                  <div style={{ padding: '4px 8px', fontSize: '0.78rem', fontWeight: 800, borderBottom: '1px solid #f1f5f9' }}>{user.name || 'किसान'}</div>
                  <Link to={user.role === 'OPERATOR' ? '/operator/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard'} onClick={() => setShowProfileMenu(false)} style={{ display: 'block', padding: '6px 8px', textDecoration: 'none', color: '#334155', fontSize: '0.76rem', fontWeight: 600 }}>
                    डैशबोर्ड
                  </Link>
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', background: 'none', border: 'none', color: '#dc2626', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>
                    लॉगआउट
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ background: '#059669', color: '#ffffff', textDecoration: 'none', borderRadius: '14px', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 800 }}>
              लॉगइन
            </Link>
          )}

        </div>
      </div>

      {/* Navigation Tabs - Horizontally Scrollable on Mobile */}
      <div style={{ 
        background: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        padding: '3px 8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch'
      }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navTabs.map((tab) => {
            const active = isActiveTab(tab.path);
            return (
              <Link 
                key={tab.label}
                to={tab.path}
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center', 
                  gap: '5px', 
                  padding: active ? '6px 12px' : '6px 10px',
                  borderRadius: active ? '8px' : '6px', 
                  background: active ? '#044e3b' : 'transparent', 
                  color: active ? '#ffffff' : '#374151', 
                  fontSize: '0.8rem',
                  fontWeight: active ? 800 : 600, 
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </header>
  );
}
