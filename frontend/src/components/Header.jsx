import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Volume2, 
  Mic, 
  Eye, 
  Check,
  LogOut,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import kisanLogoIcon from '../assets/kisan_logo_icon.png';

export default function Header() {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, fontSize, setFontSize, highContrast, toggleHighContrast, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real unread notifications if logged in
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
    } catch (e) {
      // Graceful fallback
    }
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

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isActive = (path) => {
    if (path === '/farmer/dashboard' && (location.pathname === '/' || location.pathname === '/farmer/dashboard')) return true;
    return location.pathname === path;
  };

  const getTabStyle = (path) => {
    const active = isActive(path);
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      fontSize: '0.88rem',
      fontWeight: active ? 700 : 600,
      color: active ? '#ffffff' : '#374151',
      textDecoration: 'none',
      borderRadius: '6px',
      background: active ? '#017953' : 'transparent',
      boxShadow: active ? '0 2px 6px rgba(1, 121, 83, 0.3)' : 'none',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap'
    };
  };

  const isOperatorRoute = location.pathname.startsWith('/operator');

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {/* 1. National Top Gov Strip */}
      <div style={{ 
        background: '#055c45', 
        color: '#ffffff', 
        padding: '5px 24px', 
        fontSize: '0.78rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 800, letterSpacing: '0.3px' }}>{t('satyameva')}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontWeight: 600 }}>{t('ministry')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ 
            background: '#044634', 
            border: '1px solid #10b981', 
            padding: '2px 10px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '0.72rem' 
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
            <span>[•] SIH26032 • {t('liveFeed')}</span>
          </div>
          <div style={{ fontSize: '0.78rem' }}>
            {t('helplineTop')}
          </div>
        </div>
      </div>

      {/* 2. Brand & Accessibility Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', background: '#ffffff', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Left: Emblem/Logo + Title + e-Procurement Badge */}
        <Link to={isOperatorRoute ? "/operator/dashboard" : "/farmer/dashboard"} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img 
            src={kisanLogoIcon} 
            alt="Kisan Logo" 
            style={{ width: '42px', height: '42px', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b', letterSpacing: '-0.3px' }}>
                {t('portalName')}
              </span>
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '12px',
                border: '1px solid #fde68a'
              }}>
                {t('eProcurement')}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
              {t('portalTagline')}
            </div>
          </div>
        </Link>

        {/* Right: Audio, Mic, Eye, A- A A+, Lang, Bell, Role Pill, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Audio Speaker Pill */}
          <button 
            onClick={() => speakText(lang === 'hi' ? "स्मार्ट खरीद एवं कतार प्रबंधन प्रणाली में आपका स्वागत है। अपने सभी स्लॉट, कतार और भुगतान विवरण आसानी से देखें।" : "Welcome to the Smart Procurement & Queue Management Portal. Easily track your slots, live queue, and direct benefit transfer payments.")}
            title={t('listenVoice')}
            aria-label={t('listenVoice')}
            style={{ 
              background: '#fef3c7', 
              border: '1px solid #fde68a', 
              color: '#d97706', 
              width: '34px', 
              height: '34px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer' 
            }}
          >
            <Volume2 size={18} />
          </button>

          {/* Microphone Pill */}
          <button 
            onClick={() => speakText(lang === 'hi' ? "बोलकर खोजें सुविधा सक्रिय है।" : "Voice search activated.")}
            title={t('voiceSearch')}
            aria-label={t('voiceSearch')}
            style={{ 
              background: '#ecfdf5', 
              border: '1px solid #a7f3d0', 
              color: '#059669', 
              width: '34px', 
              height: '34px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer' 
            }}
          >
            <Mic size={18} />
          </button>

          {/* High Contrast / Eye Pill */}
          <button 
            onClick={toggleHighContrast}
            title={t('contrastToggle')}
            aria-label={t('contrastToggle')}
            style={{ 
              background: highContrast ? '#0f172a' : '#f1f5f9', 
              border: highContrast ? '2px solid #000000' : '1px solid #cbd5e1', 
              color: highContrast ? '#ffffff' : '#475569', 
              width: '34px', 
              height: '34px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer' 
            }}
          >
            <Eye size={18} />
          </button>

          {/* Font Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#4b5563', padding: '0 4px' }}>
            <button 
              onClick={() => setFontSize('small')}
              title="Small Text"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: fontSize === 'small' ? '#017953' : '#6b7280', fontWeight: fontSize === 'small' ? 900 : 500 }}
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize('normal')}
              title="Default Text"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: fontSize === 'normal' ? '#017953' : '#111827', fontWeight: fontSize === 'normal' ? 900 : 600 }}
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')}
              title="Large Text"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: fontSize === 'large' ? '#017953' : '#6b7280', fontWeight: fontSize === 'large' ? 900 : 500 }}
            >
              A+
            </button>
          </div>

          {/* Language Selector */}
          <button 
            onClick={toggleLanguage} 
            title="Switch Language (भाषा बदलें)"
            style={{ 
              background: '#ffffff', 
              border: '1px solid #d1d5db', 
              borderRadius: '20px', 
              padding: '4px 12px', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#1e293b', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>🌐</span>
            <span>{lang === 'hi' ? 'हिन्दी' : 'English'}</span>
            <ChevronDown size={14} color="#6b7280" />
          </button>

          {/* Bell with Unread Notification Popover */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(prev => !prev)}
              title={t('notifications')}
              aria-label={t('notifications')}
              style={{ 
                width: '34px', 
                height: '34px', 
                borderRadius: '50%', 
                background: '#f3f4f6', 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <Bell size={17} color="#4b5563" />
              {unreadCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-2px', 
                  right: '-2px', 
                  background: '#ef4444', 
                  color: '#fff', 
                  fontSize: '0.62rem', 
                  fontWeight: 800, 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifications && (
              <div style={{ 
                position: 'absolute', 
                top: '42px', 
                right: '0', 
                width: '320px', 
                background: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)', 
                border: '1px solid #e2e8f0', 
                zIndex: 200, 
                overflow: 'hidden' 
              }}>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    {t('notifications')} ({unreadCount})
                  </span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <CheckCheck size={13} /> {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.notificationId} 
                        onClick={() => markSingleRead(n.notificationId)}
                        style={{ 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f1f5f9', 
                          background: n.isRead ? '#ffffff' : '#f0fdf4', 
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{ fontSize: '1rem', marginTop: '1px' }}>
                            {n.notificationType === 'SLOT_CONFIRMATION' ? '📅' :
                             n.notificationType === 'TOKEN_CALLED' ? '📢' :
                             n.notificationType === 'QUALITY_UPDATE' ? '🧪' :
                             n.notificationType === 'PAYMENT' ? '💰' : '🔔'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.35, fontWeight: n.isRead ? 500 : 700 }}>
                              {n.message}
                            </p>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                              {n.sentAt ? new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>
                          {!n.isRead && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', marginTop: '5px' }}></span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Pill */}
          {isOperatorRoute ? (
            <div 
              onClick={() => navigate('/farmer/dashboard')}
              title="किसान डैशबोर्ड पर जाएं"
              style={{ 
                background: '#1d4ed8', 
                color: '#ffffff', 
                borderRadius: '20px', 
                padding: '5px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                cursor: 'pointer' 
              }}
            >
              <Check size={14} strokeWidth={3} />
              <span>{t('operatorRole')}</span>
              <ChevronDown size={14} />
            </div>
          ) : (
            <div 
              onClick={() => navigate('/operator/dashboard')}
              title="ऑपरेटर कंसोल पर जाएं"
              style={{ 
                background: '#017953', 
                color: '#ffffff', 
                borderRadius: '20px', 
                padding: '5px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                cursor: 'pointer' 
              }}
            >
              <Check size={14} strokeWidth={3} />
              <span>{t('farmerRole')}</span>
              <ChevronDown size={14} />
            </div>
          )}

          {/* Profile Popover / Dropdown */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProfileMenu(prev => !prev)}
              style={{ 
                background: '#f8fafc', 
                border: '1px solid #cbd5e1', 
                borderRadius: '20px', 
                padding: '5px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: '#1e293b', 
                cursor: 'pointer' 
              }}
            >
              <User size={15} color="#475569" />
              <span>{user?.name?.includes('Ramesh') ? (lang === 'hi' ? 'रामेश्वर सिंह' : 'Ramesh Singh') : (user?.name || (lang === 'hi' ? 'रामेश्वर सिंह' : 'Ramesh Singh'))}</span>
              <ChevronDown size={13} color="#64748b" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div style={{ 
                position: 'absolute', 
                top: '40px', 
                right: '0', 
                width: '230px', 
                background: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)', 
                border: '1px solid #e2e8f0', 
                zIndex: 200, 
                overflow: 'hidden' 
              }}>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    {user?.name || (lang === 'hi' ? 'रामेश्वर सिंह' : 'Ramesh Singh')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {user?.phone || '9876543210'} • {user?.role || 'FARMER'}
                  </div>
                </div>

                <div style={{ padding: '6px 0' }}>
                  <Link 
                    to="/farmer/dashboard" 
                    onClick={() => setShowProfileMenu(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', fontSize: '0.82rem', color: '#334155', textDecoration: 'none' }}
                  >
                    <User size={15} color="#059669" />
                    <span>{t('myProfile')}</span>
                  </Link>

                  <Link 
                    to="/farmer/procurement-status" 
                    onClick={() => setShowProfileMenu(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', fontSize: '0.82rem', color: '#334155', textDecoration: 'none' }}
                  >
                    <FileText size={15} color="#0284c7" />
                    <span>{t('myBookings')}</span>
                  </Link>

                  <Link 
                    to="/help" 
                    onClick={() => setShowProfileMenu(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', fontSize: '0.82rem', color: '#334155', textDecoration: 'none' }}
                  >
                    <HelpCircle size={15} color="#d97706" />
                    <span>{t('helpFaq')}</span>
                  </Link>

                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }}></div>

                  <button 
                    onClick={handleLogout}
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '9px 16px', 
                      fontSize: '0.82rem', 
                      color: '#dc2626', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      textAlign: 'left',
                      fontWeight: 600
                    }}
                  >
                    <LogOut size={15} color="#dc2626" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. Sub Navigation Bar */}
      <nav style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '4px 24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/farmer/dashboard" style={getTabStyle('/farmer/dashboard')}>
            <span>🏠</span>
            <span>{t('navHome')}</span>
          </Link>
          <Link to="/farmer/book-slot" style={getTabStyle('/farmer/book-slot')}>
            <span>📅</span>
            <span>{t('navBookSlot')}</span>
          </Link>
          <Link to="/farmer/queue" style={getTabStyle('/farmer/queue')}>
            <span>📍</span>
            <span>{t('navLiveQueue')}</span>
          </Link>
          <Link to="/farmer/procurement-status" style={getTabStyle('/farmer/procurement-status')}>
            <span>📦</span>
            <span>{t('navProcurementStatus')}</span>
          </Link>
          <Link to="/farmer/payment" style={getTabStyle('/farmer/payment')}>
            <span>💰</span>
            <span>{t('navPayment')}</span>
          </Link>
          <Link to="/centers" style={getTabStyle('/centers')}>
            <span>📖</span>
            <span>{t('navCenters')}</span>
          </Link>
          <Link to="/help" style={getTabStyle('/help')}>
            <span>❓</span>
            <span>{t('navHelp')}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
