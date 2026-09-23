import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  Volume2, 
  Headphones, 
  Droplets, 
  Wind,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
  AlertCircle,
  Sprout,
  Landmark
} from 'lucide-react';
import farmerBannerPortrait from '../assets/farmer_banner_portrait.png';

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // 1-second interval for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/farmer/dashboard-summary');
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load farmer dashboard summary:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('UNAUTHORIZED');
      } else {
        setError(err.response?.data?.message || 'SERVER_ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = dashboardData?.activeBooking;
  const farmer = dashboardData?.farmer;
  const queuePosition = dashboardData?.queuePosition ?? 1;
  const estimatedWaitTimeMinutes = dashboardData?.estimatedWaitTimeMinutes ?? 10;
  const centres = dashboardData?.centres || [];

  // Countdown calculations
  const deadlineInfo = useMemo(() => {
    if (!activeBooking?.verificationDeadline) return null;
    const deadlineMs = new Date(activeBooking.verificationDeadline).getTime();
    const diffMs = deadlineMs - currentTime;
    if (diffMs <= 0) {
      return { expired: true, text: language === 'hi' ? 'समय समाप्त (Expired)' : 'Deadline Expired' };
    }
    const totalSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return { expired: false, formatted, totalSecs };
  }, [activeBooking?.verificationDeadline, currentTime, language]);

  // Voice guidance based on real current data
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const farmerName = farmer?.name || user?.name || (language === 'hi' ? 'किसान भाई' : 'Farmer');
    const token = activeBooking?.tokenNumber || (language === 'hi' ? 'उपलब्ध नहीं' : 'None');
    const counter = activeBooking?.counterName || (activeBooking?.counterNumber ? `Counter ${activeBooking.counterNumber}` : '1');
    const center = activeBooking?.centerName || centres[0]?.centerName || (language === 'hi' ? 'क्रय केंद्र' : 'Procurement Center');
    const wait = estimatedWaitTimeMinutes;
    const qPos = queuePosition;

    let speechText = '';
    if (language === 'hi') {
      if (activeBooking) {
        speechText = `नमस्ते, ${farmerName} जी। आपका सक्रिय टोकन क्रमांक ${token} है। आपकी कतार स्थिति ${qPos} है। आपका निर्धारित काउंटर ${counter} है, केंद्र ${center} पर। अनुमानित प्रतीक्षा समय लगभग ${wait} मिनट है। कृपया समय से केंद्र पर पहुँचें।`;
      } else {
        speechText = `नमस्ते, ${farmerName} जी। किसान कल्याण पोर्टल में आपका स्वागत है। आपकी कोई सक्रिय स्लॉट बुकिंग नहीं है। कृपया नया स्लॉट बुक करें।`;
      }
    } else {
      if (activeBooking) {
        speechText = `Hello, ${farmerName}. Your active token number is ${token}. Your queue position is ${qPos}. Your assigned counter is ${counter} at ${center}. Estimated wait time is approximately ${wait} minutes. Please reach the center on time.`;
      } else {
        speechText = `Hello, ${farmerName}. Welcome to Kisan Kalyan portal. You currently have no active slot booking. Please book a new slot.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Stepper Stage calculations based on real booking status
  const currentStageIndex = useMemo(() => {
    if (!activeBooking) return 0;
    switch (activeBooking.bookingStatus) {
      case 'BOOKED': return 0;
      case 'ARRIVED': return 1;
      case 'IN_QUEUE': return 2;
      case 'PROCESSING': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED':
      case 'NO_SHOW': return -1;
      default: return 0;
    }
  }, [activeBooking?.bookingStatus]);

  // Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #d1fae5', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#065f46', fontWeight: 700, fontSize: '1.05rem' }}>
          {t('loadingData')}
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Unauthorized / 401 / 403 State
  if (error === 'UNAUTHORIZED' || !user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '2px solid #fed7aa', padding: '36px', maxWidth: '520px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#ea580c' }}>
            <AlertCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#9a3412', margin: '0 0 8px 0' }}>
            {t('unauthorizedTitle')}
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            {t('unauthorizedSub')}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ width: '100%', padding: '12px 24px', fontSize: '1rem', fontWeight: 800 }}
          >
            {t('loginAction')}
          </button>
        </div>
      </div>
    );
  }

  // Server Error State
  if (error) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '2px solid #fecaca', padding: '36px', maxWidth: '520px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#dc2626' }}>
            <AlertTriangle size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991b1b', margin: '0 0 8px 0' }}>
            {t('errorTitle')}
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            {error}
          </p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
            style={{ width: '100%', padding: '12px 24px', fontSize: '1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <RefreshCw size={18} /> {t('retryAction')}
          </button>
        </div>
      </div>
    );
  }

  // Format Allocated Time
  const formattedAllocTime = activeBooking?.allocatedStartTime
    ? `${new Date(activeBooking.allocatedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(activeBooking.allocatedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : (activeBooking?.slotStartTime ? `${activeBooking.slotStartTime} – ${activeBooking.slotEndTime}` : '09:00 – 10:00');

  // Status Badge Label & Color
  const getStatusDisplay = (st) => {
    switch (st) {
      case 'BOOKED':
        return { label: t('statusBooked'), bg: '#fef08a', color: '#854d0e', dot: '#ca8a04' };
      case 'ARRIVED':
        return { label: t('statusArrived'), bg: '#bbf7d0', color: '#14532d', dot: '#16a34a' };
      case 'IN_QUEUE':
        return { label: t('statusInQueue'), bg: '#bfdbfe', color: '#1e3a8a', dot: '#2563eb' };
      case 'PROCESSING':
        return { label: t('statusProcessing'), bg: '#fed7aa', color: '#7c2d12', dot: '#ea580c' };
      case 'COMPLETED':
        return { label: t('statusCompleted'), bg: '#dcfce7', color: '#15803d', dot: '#22c55e' };
      case 'CANCELLED':
        return { label: t('statusCancelled'), bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' };
      case 'NO_SHOW':
        return { label: t('statusNoShow'), bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };
      default:
        return { label: t('statusActive'), bg: '#dcfce7', color: '#15803d', dot: '#22c55e' };
    }
  };

  const statusStyle = getStatusDisplay(activeBooking?.bookingStatus);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px 0 60px 0' }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>

        {/* =========================================================================
            1. TOP HERO GREETING BANNER (Matches Reference UI)
        ========================================================================= */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          position: 'relative', 
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 28px',
          gap: '24px'
        }}>
          {/* Column 1: Greeting & Slogan & Value Pillars */}
          <div style={{ flex: '1 1 320px', minWidth: '270px', zIndex: 1 }}>
            {/* Welcome Back Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700, fontSize: '0.84rem', marginBottom: '8px' }}>
              <Sprout size={18} color="#059669" />
              <span>{language === 'hi' ? 'स्वागत है —' : 'Welcome Back —'}</span>
            </div>

            {/* Greeting Title */}
            <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#111827', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              {language === 'hi' ? 'नमस्ते' : 'Namaste'}, {farmer?.name || user?.name || user?.username || (language === 'hi' ? 'किसान भाई' : 'Kisan')}{' '}
              {farmer?.englishName ? (
                <span style={{ fontWeight: 800 }}>({farmer.englishName}) {language === 'hi' ? 'जी' : 'ji'}</span>
              ) : (
                <span style={{ fontWeight: 800 }}>{language === 'hi' ? 'जी' : 'ji'}</span>
              )}{' '}
              <span style={{ fontSize: '1.4rem' }}>👋</span>
            </h1>

            {/* Subtitle */}
            <p style={{ color: '#4b5563', fontSize: '0.92rem', fontWeight: 500, margin: '0 0 6px 0' }}>
              {language === 'hi' ? 'अन्नदाता किसान भाई का स्वागत है' : "Welcome to the farmer's digital portal"}
            </p>

            {/* Italic Motto */}
            <p style={{ color: '#047857', fontWeight: 700, fontSize: '0.96rem', fontStyle: 'italic', margin: '0 0 12px 0' }}>
              “ {language === 'hi' ? 'आपकी मेहनत, देश की ताकत' : 'Your hard work, strengthens the nation'} ”
            </p>

            {/* Location Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', color: '#1f2937', fontWeight: 600, marginBottom: '16px' }}>
              <MapPin size={15} color="#059669" />
              <span>
                {farmer?.village ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : (language === 'hi' ? 'चुनार देहात, मीरजापुर, उत्तर प्रदेश' : 'Chunar Dehat, Mirzapur, Uttar Pradesh')}
              </span>
            </div>

            {/* 3 Core Value Pillars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <Sprout size={16} color="#059669" />
                <span>{language === 'hi' ? 'बेहतर मूल्य' : 'Better Prices'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>{language === 'hi' ? 'पारदर्शी प्रक्रिया' : 'Transparent Process'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <Users size={16} color="#059669" />
                <span>{language === 'hi' ? 'सशक्त किसान' : 'Empowered Farmers'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Dark Forest Green Status Card with Farmer Portrait inside */}
          <div style={{ 
            background: '#044324', 
            borderRadius: '20px', 
            padding: '16px 20px', 
            color: '#ffffff', 
            boxShadow: '0 8px 24px rgba(4, 67, 36, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            flex: '1 1 540px',
            maxWidth: '620px',
            zIndex: 1
          }}>
            {/* Status Panel (2 Rows) */}
            <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '300px' }}>
              {/* Row 1: 3 Column Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                {/* Centre Info */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.15)', paddingRight: '12px', flex: '1 1 140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Landmark size={13} color="#a7f3d0" />
                    <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                      {language === 'hi' ? 'वर्तमान क्रय केंद्र' : 'Current Procurement Center'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={14} color="#fef08a" style={{ flexShrink: 0 }} />
                    <strong style={{ fontSize: '0.86rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {activeBooking?.centerName || (language === 'hi' ? 'गाज़ियाबाद गेहूं खरीद केंद्र' : 'गाज़ियाबाद गेहूं खरीद केंद्र')}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                    {activeBooking?.centerLocation || (language === 'hi' ? 'गाज़ियाबाद, उत्तर प्रदेश (Ghaziabad, UP)' : 'गाज़ियाबाद, उत्तर प्रदेश (Ghaziabad, UP)')}
                  </div>
                  <Link 
                    to="/centers" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      background: '#ffffff', 
                      color: '#044324', 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      padding: '2px 10px', 
                      borderRadius: '12px', 
                      textDecoration: 'none', 
                      marginTop: '8px' 
                    }}
                  >
                    {language === 'hi' ? 'केंद्र बदलें ⇄' : 'Change Center ⇄'}
                  </Link>
                </div>

                {/* Mera Token */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.15)', paddingRight: '12px', textAlign: 'center', flex: '0 0 auto' }}>
                  <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                    {language === 'hi' ? 'मेरा टोकन' : 'My Token'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0' }}>
                    <span style={{ background: '#fef08a', color: '#713f12', padding: '1px 5px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>🎫</span>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a' }}>
                      {activeBooking?.tokenNumber || 'T-117-39'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    ● {language === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                </div>

                {/* Katar Mein Sthan */}
                <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                  <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                    {language === 'hi' ? 'कतार स्थिति' : 'My Queue Position'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0' }}>
                    <Users size={16} color="#93c5fd" />
                    <strong style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                      {activeBooking ? queuePosition : 6}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                    {language === 'hi' ? 'किसान बाकी' : 'Farmers Ahead'}
                  </span>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }} />

              {/* Row 2: Estimated Time & View Turn */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#fef08a" />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600, display: 'block', lineHeight: 1.1 }}>
                      {language === 'hi' ? 'अनुमानित समय' : 'Estimated Time'}
                    </span>
                    <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fef08a', whiteSpace: 'nowrap' }}>
                      ~ {activeBooking ? estimatedWaitTimeMinutes : 20} {language === 'hi' ? 'मिनट' : 'min'}
                    </strong>
                  </div>
                </div>

                <Link 
                  to="/farmer/queue" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#ffffff', 
                    color: '#044324', 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    padding: '4px 14px', 
                    borderRadius: '16px', 
                    textDecoration: 'none', 
                    whiteSpace: 'nowrap', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)' 
                  }}
                >
                  <span>((•))</span> {language === 'hi' ? 'देखें मेरी बारी →' : 'View My Turn →'}
                </Link>
              </div>
            </div>

            {/* Farmer Portrait Card (Far Right inside Green Box) */}
            <div style={{ 
              flex: '0 0 112px', 
              height: '187px', 
              borderRadius: '14px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto' 
            }}>
              <img 
                src={farmerBannerPortrait} 
                alt="किसान की समृद्धि, देश की प्रगति" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. ACTIVE TOKEN DETAILS CARD + QR PASS & LIVE COUNTDOWN (P0 Requirement)
        ========================================================================= */}
        {activeBooking && (
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '24px', 
            border: '2px solid #a7f3d0', 
            padding: '20px 24px', 
            marginBottom: '22px',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            {/* Left: Token & Allocation Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', flex: '1 1 500px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', 
                color: '#ffffff', 
                borderRadius: '16px', 
                padding: '14px 20px', 
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(4, 67, 36, 0.25)',
                minWidth: '130px'
              }}>
                <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                  {t('myToken')}
                </span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef08a', letterSpacing: '0.5px' }}>
                  {activeBooking.tokenNumber || 'A-102'}
                </strong>
                <div style={{ fontSize: '0.72rem', color: '#ffffff', opacity: 0.9, marginTop: '2px' }}>
                  {activeBooking.bookingReference}
                </div>
              </div>

              {/* Key Values Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', flex: 1 }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                    {t('crop')} & {t('quantity')}:
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: '#111827' }}>
                    {activeBooking.produceName || 'गेहूं / Wheat'} • {activeBooking.estimatedQuantity} {t('quintal')}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                    {t('counter')}:
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: '#047857' }}>
                    Counter #{activeBooking.counterNumber || 2} ({activeBooking.counterName || 'Weighbridge 2'})
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                    {t('allocatedTime')}:
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: '#111827' }}>
                    {formattedAllocTime}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                    स्थिति (Status):
                  </span>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    background: statusStyle.bg, 
                    color: statusStyle.color, 
                    fontSize: '0.78rem', 
                    fontWeight: 800, 
                    padding: '2px 8px', 
                    borderRadius: '12px' 
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusStyle.dot }} />
                    {statusStyle.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Countdown & Show QR Pass Button */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', flex: '0 0 auto' }}>
              {/* Countdown Pill */}
              {deadlineInfo && (
                <div style={{ 
                  background: deadlineInfo.expired ? '#fef2f2' : '#f0fdf4', 
                  border: `1.5px solid ${deadlineInfo.expired ? '#fca5a5' : '#86efac'}`, 
                  borderRadius: '14px', 
                  padding: '8px 16px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '0.7rem', color: deadlineInfo.expired ? '#991b1b' : '#166534', fontWeight: 700 }}>
                    {t('verificationDeadline')}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: deadlineInfo.expired ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Clock size={16} />
                    {deadlineInfo.expired ? deadlineInfo.text : `${deadlineInfo.formatted}`}
                  </div>
                </div>
              )}

              {/* Show QR Pass Button */}
              <Link 
                to="/farmer/qr-pass" 
                state={{ booking: activeBooking }}
                style={{ 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
                  color: '#ffffff', 
                  textDecoration: 'none', 
                  borderRadius: '14px', 
                  padding: '12px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 800, 
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <QrCode size={20} />
                <span>{t('showQrPass')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. FOUR MAIN ACTION CARDS
        ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          
          {/* Card 1: Slot Book Karein */}
          <Link 
            to="/farmer/book-slot" 
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              textDecoration: 'none', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardBookSlotTitle')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardBookSlotSub')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 2: Live Katar Dekhein */}
          <Link 
            to="/farmer/queue" 
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              textDecoration: 'none', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardLiveQueueTitle')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardLiveQueueSub')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 3: Khareed Sthiti */}
          <Link 
            to="/farmer/procurement-status" 
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              textDecoration: 'none', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardProcurementTitle')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardProcurementSub')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 4: Bhugtan Dekhein */}
          <Link 
            to="/farmer/payment" 
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              textDecoration: 'none', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#7c3aed', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardPaymentTitle')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardPaymentSub')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={15} />
            </div>
          </Link>
        </div>

        {/* =========================================================================
            4. KHAREED PRAKRIYA KI STHITI (RESPONSIVE STEPPER - P2 Requirement)
        ========================================================================= */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          padding: '24px 28px', 
          marginBottom: '22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Left: 5-stage Stepper with responsive CSS */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
              <span>🌱</span> {t('stepperTitle')}
            </h3>

            {/* Desktop Horizontal Stepper */}
            <div className="stepper-desktop" style={{ position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '3px', background: '#e2e8f0', zIndex: 0 }}>
                <div style={{ 
                  width: `${Math.max(0, Math.min(100, currentStageIndex * 25))}%`, 
                  height: '100%', 
                  background: '#059669', 
                  transition: 'width 0.4s ease' 
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                {/* Step 1: Slot Booked */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: currentStageIndex >= 0 ? '#059669' : '#ffffff', 
                    border: `2px solid ${currentStageIndex >= 0 ? '#059669' : '#cbd5e1'}`, 
                    color: currentStageIndex >= 0 ? '#ffffff' : '#64748b', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                  }}>
                    {currentStageIndex >= 0 ? '✓' : '1'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                    {t('stepSlotBooked')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: currentStageIndex >= 0 ? '#059669' : '#64748b', fontWeight: 600, marginTop: '2px' }}>
                    {currentStageIndex >= 0 ? t('stepCompletedTag') : t('stepPendingTag')}
                  </div>
                </div>

                {/* Step 2: Mandi Arrived */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: currentStageIndex >= 1 ? '#059669' : (currentStageIndex === 0 ? '#ffffff' : '#ffffff'), 
                    border: `2px solid ${currentStageIndex >= 1 ? '#059669' : (currentStageIndex === 0 ? '#059669' : '#cbd5e1')}`, 
                    color: currentStageIndex >= 1 ? '#ffffff' : '#059669', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                  }}>
                    {currentStageIndex >= 1 ? '✓' : (currentStageIndex === 0 ? '●' : '2')}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                    {t('stepArrived')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: currentStageIndex >= 1 ? '#059669' : (currentStageIndex === 0 ? '#059669' : '#94a3b8'), fontWeight: 600, marginTop: '2px' }}>
                    {currentStageIndex >= 1 ? t('stepCompletedTag') : (currentStageIndex === 0 ? t('stepActiveTag') : t('stepPendingTag'))}
                  </div>
                </div>

                {/* Step 3: Quality Check */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: currentStageIndex >= 2 ? '#059669' : '#ffffff', 
                    border: `2px solid ${currentStageIndex >= 2 ? '#059669' : '#cbd5e1'}`, 
                    color: currentStageIndex >= 2 ? '#ffffff' : '#94a3b8', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                  }}>
                    {currentStageIndex >= 2 ? '✓' : '3'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                    {t('stepQualityCheck')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: currentStageIndex >= 2 ? '#059669' : '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                    {currentStageIndex >= 2 ? t('stepCompletedTag') : t('stepPendingTag')}
                  </div>
                </div>

                {/* Step 4: Weighment */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: currentStageIndex >= 3 ? '#059669' : '#ffffff', 
                    border: `2px solid ${currentStageIndex >= 3 ? '#059669' : '#cbd5e1'}`, 
                    color: currentStageIndex >= 3 ? '#ffffff' : '#94a3b8', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                  }}>
                    {currentStageIndex >= 3 ? '✓' : '4'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                    {t('stepWeighment')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: currentStageIndex >= 3 ? '#059669' : '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                    {currentStageIndex >= 3 ? t('stepCompletedTag') : t('stepPendingTag')}
                  </div>
                </div>

                {/* Step 5: Payment */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: currentStageIndex >= 4 ? '#059669' : '#ffffff', 
                    border: `2px solid ${currentStageIndex >= 4 ? '#059669' : '#cbd5e1'}`, 
                    color: currentStageIndex >= 4 ? '#ffffff' : '#94a3b8', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                  }}>
                    {currentStageIndex >= 4 ? '✓' : '5'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                    {t('stepPayment')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: currentStageIndex >= 4 ? '#059669' : '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                    {currentStageIndex >= 4 ? t('stepCompletedTag') : t('stepPendingTag')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Speaker Notice Box */}
          <div style={{ 
            background: '#ecfdf5', 
            borderRadius: '16px', 
            border: '1px solid #a7f3d0', 
            padding: '18px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px' 
          }}>
            <div style={{ fontSize: '2rem' }}>📢</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
                {t('reachOnTimeTitle')}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#047857', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                {t('reachOnTimeSub')}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. THREE BOTTOM COLUMNS (Weather/Advice + Recent Activity + Nearby Centres)
        ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '26px' }}>

          {/* Column A: Weather and Advisory */}
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
              <span>⛅</span> {t('weatherTitle')}
            </h4>

            {/* Temperature & Conditions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem' }}>🌤️</span>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                    32°C
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {t('partlyCloudy')}<br />{farmer?.district || 'मीरजापुर'}, {farmer?.state || 'उत्तर प्रदेश'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={15} color="#0284c7" /> {t('humidity')} 68%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={15} color="#0284c7" /> {t('wind')} 12 km/h
                </span>
              </div>
            </div>

            {/* Advisory Green Pill Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#166534', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
              <span>🌱</span>
              <div>
                <strong>{t('advisoryPrefix')}</strong> {t('advisoryText')}
              </div>
            </div>
          </div>

          {/* Column B: Recent Activity */}
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Clock size={18} color="#eab308" /> {t('recentActivityTitle')}
              </h4>
              <Link to="/farmer/procurement-status" style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textDecoration: 'none', background: '#f0fdf4', padding: '3px 8px', borderRadius: '10px' }}>
                {t('viewAll')} →
              </Link>
            </div>

            {/* Dynamic Activity List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {/* Item 1: Active Booking / Mandi Arrived */}
              {activeBooking && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '60px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.2 }}>
                    {activeBooking.slotDate ? new Date(activeBooking.slotDate).toLocaleDateString([], { day: 'numeric', month: 'short' }) : '10 सित'}<br />
                    {activeBooking.slotStartTime || '09:00'}
                  </div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #22c55e', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, paddingLeft: '12px' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>
                      {t('stepSlotBooked')}: {activeBooking.tokenNumber}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {activeBooking.centerName}
                    </span>
                  </div>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                    {statusStyle.label}
                  </span>
                </div>
              )}

              {/* Item 2: Registration Completed */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '60px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.2 }}>
                  4 सित<br />04:20 PM
                </div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #22c55e', flexShrink: 0 }}></div>
                <div style={{ flex: 1, paddingLeft: '12px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>
                    {t('activityRegCompleted')}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {t('activityRegDesc')}
                  </span>
                </div>
                <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                  {t('stepCompletedTag')}
                </span>
              </div>
            </div>
          </div>

          {/* Column C: Nearby Procurement Centres */}
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MapPin size={18} color="#059669" /> {t('nearbyCentersTitle')}
              </h4>
              <Link to="/centers" style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textDecoration: 'none', background: '#f0fdf4', padding: '3px 8px', borderRadius: '10px' }}>
                {t('viewAll')} →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {centres.slice(0, 3).map((c, idx) => {
                const isCurrent = activeBooking?.centerId === c.centerId || idx === 0;
                return (
                  <div key={c.centerId || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrent ? '#ecfdf5' : '#f8fafc', color: isCurrent ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isCurrent ? 'none' : '1px solid #e2e8f0' }}>
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontSize: '0.88rem', color: '#111827' }}>{c.centerName}</strong>
                          {isCurrent && (
                            <span style={{ background: '#044324', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '8px' }}>
                              {t('currentCenterBadge')}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {c.village ? `${c.village}, ${c.district}` : c.centerLocation}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: isCurrent ? '#059669' : '#64748b', fontWeight: isCurrent ? 700 : 600 }}>
                      <span>↗</span> {idx * 8} km
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            6. BOTTOM FOOTER BAR
        ========================================================================= */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
          {/* Left: Green Pill Audio Button */}
          <button 
            onClick={handleSpeak}
            style={{ 
              background: '#044324', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 22px', 
              borderRadius: '24px', 
              fontSize: '0.88rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(4, 67, 36, 0.25)' 
            }}
          >
            <Volume2 size={18} />
            <span style={{ lineHeight: 1.15, textAlign: 'left' }}>
              {t('listenShort')}<br />
              <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500 }}>(आवाज़ में / Audio)</span>
            </span>
          </button>

          {/* Center: Leaf Motivation Slogan */}
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌱</span> {t('bottomSlogan')}
          </div>

          {/* Right: Helpline Pill */}
          <div style={{ 
            background: '#ffffff', 
            border: '1.5px solid #059669', 
            borderRadius: '24px', 
            padding: '8px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={16} />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{t('helplineTitle')}</div>
              <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{t('tollFreeNumber')}</strong>
            </div>
            <ChevronRight size={18} color="#059669" />
          </div>
        </div>

      </div>
    </div>
  );
}
