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
  AlertTriangle,
  QrCode,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Sprout,
  Landmark
} from 'lucide-react';
import farmerBannerPortrait from '../assets/farmer_banner_portrait.png';
import '../styles/FarmerDashboard.css';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // 1-second interval for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
  }, [activeBooking]);

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
            <RefreshCw size={18} /> {t('retryAction', language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again')}
          </button>
        </div>
      </div>
    );
  }

  // Format Allocated Time
  const formattedAllocTime = activeBooking?.allocatedStartTime
    ? `${new Date(activeBooking.allocatedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(activeBooking.allocatedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : (activeBooking?.slotStartTime ? `${activeBooking.slotStartTime} – ${activeBooking.slotEndTime}` : '09:00 – 10:00');

  // Status Badge Label & Color with localized fallbacks
  const getStatusDisplay = (st) => {
    switch (st) {
      case 'BOOKED':
        return { label: t('statusBooked', language === 'hi' ? 'आरक्षित' : 'Booked'), bg: '#fef08a', color: '#854d0e', dot: '#ca8a04' };
      case 'ARRIVED':
        return { label: t('statusArrived', language === 'hi' ? 'आगमन दर्ज' : 'Arrived'), bg: '#bbf7d0', color: '#14532d', dot: '#16a34a' };
      case 'IN_QUEUE':
        return { label: t('statusInQueue', language === 'hi' ? 'कतार में' : 'In Queue'), bg: '#bfdbfe', color: '#1e3a8a', dot: '#2563eb' };
      case 'PROCESSING':
        return { label: t('statusProcessing', language === 'hi' ? 'प्रक्रियाधीन' : 'Processing'), bg: '#fed7aa', color: '#7c2d12', dot: '#ea580c' };
      case 'COMPLETED':
        return { label: t('statusCompleted', language === 'hi' ? 'पूर्ण' : 'Completed'), bg: '#dcfce7', color: '#15803d', dot: '#22c55e' };
      case 'CANCELLED':
        return { label: t('statusCancelled', language === 'hi' ? 'रद्द' : 'Cancelled'), bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' };
      case 'NO_SHOW':
        return { label: t('statusNoShow', language === 'hi' ? 'अनुपस्थित' : 'No Show'), bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };
      default:
        return { label: t('statusActive', language === 'hi' ? 'सक्रिय' : 'Active'), bg: '#dcfce7', color: '#15803d', dot: '#22c55e' };
    }
  };

  const statusStyle = getStatusDisplay(activeBooking?.bookingStatus);

  // Steps definition for both desktop and mobile stepper
  const stepperStages = [
    { step: 1, title: t('stepSlotBooked', language === 'hi' ? 'स्लॉट बुक हुआ' : 'Slot Booked') },
    { step: 2, title: t('stepArrived', language === 'hi' ? 'मंडी में आगमन' : 'Mandi Arrival') },
    { step: 3, title: t('stepQualityCheck', language === 'hi' ? 'गुणवत्ता जांच' : 'Quality Check') },
    { step: 4, title: t('stepWeighment', language === 'hi' ? 'इलेक्ट्रॉनिक तौल' : 'Electronic Weighing') },
    { step: 5, title: t('stepPayment', language === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payment') },
  ];

  return (
    <div className="farmer-dashboard">
      <div className="farmer-portal-container">

        {/* =========================================================================
            1. TOP HERO GREETING BANNER & PROCUREMENT CARD
        ========================================================================= */}
        <div className="farmer-hero-card">
          {/* Column 1: Greeting & Slogan & Value Pillars */}
          <div className="farmer-hero-left">
            {/* Welcome Back Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700, fontSize: '0.84rem', marginBottom: '8px' }}>
              <Sprout size={18} color="#059669" />
              <span>{t('welcomeBack', 'Welcome Back —')}</span>
            </div>

            {/* Greeting Title */}
            <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#111827', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              {t('namaste', 'Namaste')}, {farmer?.name || user?.name || user?.username || t('kisanBrother', 'Kisan')}{' '}
              {farmer?.englishName ? (
                <span style={{ fontWeight: 800 }}>({farmer.englishName}) {language === 'hi' ? 'जी' : (language === 'bn' ? 'বাবু' : 'ji')}</span>
              ) : (
                <span style={{ fontWeight: 800 }}>{language === 'hi' ? 'जी' : (language === 'bn' ? '' : 'ji')}</span>
              )}{' '}
              <span style={{ fontSize: '1.4rem' }}>👋</span>
            </h1>

            {/* Subtitle */}
            <p style={{ color: '#4b5563', fontSize: '0.92rem', fontWeight: 500, margin: '0 0 6px 0' }}>
              {t('portalWelcomeSub', "Welcome to the farmer's digital portal")}
            </p>

            {/* Italic Motto */}
            <p style={{ color: '#047857', fontWeight: 700, fontSize: '0.96rem', fontStyle: 'italic', margin: '0 0 12px 0' }}>
              “ {t('hardWorkNationMotto', 'Your hard work, strengthens the nation')} ”
            </p>

            {/* Location Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', color: '#1f2937', fontWeight: 600, marginBottom: '16px' }}>
              <MapPin size={15} color="#059669" />
              <span>
                {farmer?.village ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : (language === 'hi' ? 'चुनार देहात, मीरजापुर, उत्तर प्रदेश' : (language === 'bn' ? 'চুনার দেহাত, মির্জাপুর, উত্তর প্রদেশ' : 'Chunar Dehat, Mirzapur, Uttar Pradesh'))}
              </span>
            </div>

            {/* 3 Core Value Pillars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <Sprout size={16} color="#059669" />
                <span>{t('betterPrices', 'Better Prices')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>{t('transparentProcess', 'Transparent Process')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
                <Users size={16} color="#059669" />
                <span>{t('empoweredFarmers', 'Empowered Farmers')}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Dark Forest Green Status Card with Farmer Portrait inside */}
          <div className="farmer-hero-green-card">
            {/* Status Panel */}
            <div className="procurement-panel-inner">
              {/* Row 1: Procurement Center + Token + Queue Position */}
              <div className="procurement-summary">
                {/* Centre Info */}
                <div className="procurement-center-col">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Landmark size={13} color="#a7f3d0" />
                    <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                      {t('currentProcurementCenter', language === 'hi' ? 'वर्तमान क्रय केंद्र' : 'Current Procurement Center')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={14} color="#fef08a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <strong className="procurement-center-name">
                      {activeBooking?.centerName || (language === 'hi' ? 'चुनार कृषि उपज मंडी' : 'Chunar Krishi Upaj Mandi')}
                    </strong>
                  </div>
                  <div className="procurement-center-location">
                    {activeBooking?.centerLocation || (language === 'hi' ? 'रेलवे स्टेशन रोड, चुनार' : 'Railway Station Road, Chunar')}
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
                      padding: '3px 12px', 
                      borderRadius: '12px', 
                      textDecoration: 'none', 
                      marginTop: '8px' 
                    }}
                  >
                    {t('changeCenter', language === 'hi' ? 'केंद्र बदलें ⇄' : 'Change Center ⇄')}
                  </Link>
                </div>

                {/* Mobile & Desktop Token and Queue stats */}
                <div className="procurement-stats-row">
                  {/* Mera Token */}
                  <div className="procurement-token-col">
                    <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                      {t('myToken', language === 'hi' ? 'मेरा टोकन' : 'My Token')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0' }}>
                      <span style={{ background: '#fef08a', color: '#713f12', padding: '1px 5px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>🎫</span>
                      <strong style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a' }}>
                        {activeBooking?.tokenNumber || 'T-123-42'}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 8px', borderRadius: '10px', fontWeight: 800 }}>
                      ● {t('statusActive', language === 'hi' ? 'सक्रिय' : 'Active')}
                    </span>
                  </div>

                  {/* Katar Mein Sthan */}
                  <div className="procurement-queue-col">
                    <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                      {t('myQueuePosition', language === 'hi' ? 'कतार स्थिति' : 'My Queue Position')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0' }}>
                      <Users size={16} color="#93c5fd" />
                      <strong style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                        {activeBooking ? queuePosition : 1}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                      {t('farmersAhead', language === 'hi' ? 'किसान आगे हैं' : 'Farmers Ahead')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="procurement-divider" />

              {/* Row 2: Estimated Time & View Turn */}
              <div className="procurement-bottom-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#fef08a" />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600, display: 'block', lineHeight: 1.1 }}>
                      {t('estimatedTime', language === 'hi' ? 'अनुमानित समय' : 'Estimated Time')}
                    </span>
                    <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fef08a', whiteSpace: 'nowrap' }}>
                      ~ {activeBooking ? estimatedWaitTimeMinutes : 10} {t('minutesShort', 'min')}
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
                    padding: '6px 14px', 
                    borderRadius: '16px', 
                    textDecoration: 'none', 
                    whiteSpace: 'nowrap', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)' 
                  }}
                >
                  <span>((•))</span> {t('viewMyTurn', language === 'hi' ? 'देखें मेरी बारी →' : 'View My Turn →')}
                </Link>
              </div>
            </div>

            {/* Farmer Portrait Card */}
            <div className="farmer-portrait-box">
              <img 
                src={farmerBannerPortrait} 
                alt={t('prosperityNationMotto', 'Kisan Kalyan')} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block' 
                }} 
              />
              <div className="farmer-portrait-mobile-quote">
                <strong>“{t('prosperityNationMotto', 'Prosperity of Farmers, Progress of Nation')}”</strong>
                <span>{t('ministryTitle', 'Ministry of Agriculture & Farmers Welfare')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. ACTIVE TOKEN DETAILS CARD + QR PASS & LIVE COUNTDOWN
        ========================================================================= */}
        {activeBooking && (
          <div className="booking-card">
            {/* Left: Token & Allocation Details */}
            <div className="booking-left-col">
              <div className="booking-token-pill">
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                    {t('myToken', language === 'hi' ? 'मेरा टोकन' : 'My Token')}
                  </span>
                  <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef08a', letterSpacing: '0.5px' }}>
                    {activeBooking.tokenNumber || 'T-123-42'}
                  </strong>
                  <div style={{ fontSize: '0.72rem', color: '#ffffff', opacity: 0.9, marginTop: '2px' }}>
                    {activeBooking.bookingReference}
                  </div>
                </div>
              </div>

              {/* Key Values Grid */}
              <div className="booking-info-grid">
                <div className="booking-info-item">
                  <span className="booking-info-label">
                    {t('cropAndQuantity', language === 'hi' ? 'फसल एवं मात्रा' : 'Crop & Quantity')}
                  </span>
                  <strong className="booking-info-val">
                    {activeBooking.produceName || (language === 'hi' ? 'चना / Gram' : (language === 'bn' ? 'ছোলা / Gram' : 'Gram'))} • {activeBooking.estimatedQuantity || 65} {t('quintal', 'quintal')}
                  </strong>
                </div>

                <div className="booking-info-item">
                  <span className="booking-info-label">
                    {t('counter', language === 'hi' ? 'काउंटर' : 'Counter')}
                  </span>
                  <strong className="booking-info-val" style={{ color: '#047857' }}>
                    Counter #{activeBooking.counterNumber || 1} ({activeBooking.counterName || t('weighbridge1', 'Weighbridge 1')})
                  </strong>
                </div>

                <div className="booking-info-item">
                  <span className="booking-info-label">
                    {t('allocatedTime', language === 'hi' ? 'आवंटित समय' : 'Allocated Time')}
                  </span>
                  <strong className="booking-info-val">
                    {formattedAllocTime}
                  </strong>
                </div>

                <div className="booking-info-item">
                  <span className="booking-info-label">
                    {t('statusLabel', 'Status')}
                  </span>
                  <span className="booking-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusStyle.dot, flexShrink: 0 }} />
                    {statusStyle.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Countdown & Show QR Pass Button */}
            <div className="booking-right-col">
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
                    {t('verificationDeadline', language === 'hi' ? 'सत्यापन समय सीमा' : 'QR Verification Deadline')}
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
                className="btn-show-qr"
              >
                <QrCode size={20} />
                <span>{t('showQrPass', language === 'hi' ? 'क्यूआर पास देखें' : 'Show QR Pass')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. FOUR MAIN ACTION CARDS
        ========================================================================= */}
        <div className="action-cards-grid">
          {/* Card 1: Slot Book Karein */}
          <Link 
            to="/farmer/book-slot" 
            className="action-card"
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardBookSlotTitle', language === 'hi' ? 'स्लॉट बुक करें' : 'Book a Slot')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardBookSlotSub', language === 'hi' ? 'निकटतम मंडी में अपनी सुविधा अनुसार समय चुनें' : 'Reserve your time at nearest mandi')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 2: Live Katar Dekhein */}
          <Link 
            to="/farmer/queue" 
            className="action-card"
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardLiveQueueTitle', language === 'hi' ? 'लाइव कतार' : 'Live Queue Tracking')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardLiveQueueSub', language === 'hi' ? 'घर बैठे वास्तविक समय पर टोकन स्थिति जानें' : 'Track token and wait time live')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 3: Khareed Sthiti */}
          <Link 
            to="/farmer/procurement-status" 
            className="action-card"
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardProcurementTitle', language === 'hi' ? 'खरीद स्थिति' : 'Procurement Status')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardProcurementSub', language === 'hi' ? 'वजन पर्ची, गुणवत्ता जांच और जे-फॉर्म विवरण' : 'Check weighment & J-Form slips')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Card 4: Bhugtan Dekhein */}
          <Link 
            to="/farmer/payment" 
            className="action-card"
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#7c3aed', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {t('cardPaymentTitle', language === 'hi' ? 'डीबीटी भुगतान' : 'DBT Bank Payments')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('cardPaymentSub', language === 'hi' ? 'सीधे बैंक खाते में राशि की स्थिति' : 'Check direct bank transfer status')}
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
              <ArrowRight size={15} />
            </div>
          </Link>
        </div>

        {/* =========================================================================
            4. KHAREED PRAKRIYA KI STHITI (RESPONSIVE STEPPER)
        ========================================================================= */}
        <div className="stepper-card">
          {/* Left: 5-stage Stepper with responsive CSS */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
              <span>🌱</span> {t('stepperTitle', language === 'hi' ? 'खरीद प्रक्रिया की वास्तविक स्थिति' : 'Procurement Process Live Status')}
            </h3>

            {/* Desktop Horizontal Stepper (Keeps exact desktop UI) */}
            <div className="stepper-desktop-view" style={{ position: 'relative' }}>
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
                {stepperStages.map((stg, idx) => {
                  const isDone = currentStageIndex > idx;
                  const isCurr = currentStageIndex === idx;
                  return (
                    <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: (isDone || isCurr) ? '#059669' : '#ffffff', 
                        border: `2px solid ${(isDone || isCurr) ? '#059669' : '#cbd5e1'}`, 
                        color: (isDone || isCurr) ? '#ffffff' : '#64748b', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 8px auto', fontSize: '0.85rem', fontWeight: 800 
                      }}>
                        {isDone ? '✓' : (isCurr ? '●' : idx + 1)}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                        {stg.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isDone ? '#059669' : (isCurr ? '#059669' : '#64748b'), fontWeight: 600, marginTop: '2px' }}>
                        {isDone ? t('stepCompletedTag', language === 'hi' ? 'पूर्ण' : 'Completed') : (isCurr ? t('stepActiveTag', language === 'hi' ? 'जारी है' : 'In Progress') : t('stepPendingTag', language === 'hi' ? 'प्रतीक्षारत' : 'Pending'))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Stepper (No collision, clear hierarchy) */}
            <div className="stepper-mobile-view">
              {stepperStages.map((stg, idx) => {
                const isDone = currentStageIndex > idx;
                const isCurr = currentStageIndex === idx;
                const isLast = idx === stepperStages.length - 1;
                return (
                  <div key={idx} className="stepper-mobile-step">
                    {!isLast && (
                      <div className={`stepper-mobile-line ${isDone ? 'completed' : ''}`} />
                    )}
                    <div 
                      className="stepper-mobile-indicator"
                      style={{
                        background: (isDone || isCurr) ? '#059669' : '#ffffff',
                        border: `2px solid ${(isDone || isCurr) ? '#059669' : '#cbd5e1'}`,
                        color: (isDone || isCurr) ? '#ffffff' : '#64748b'
                      }}
                    >
                      {isDone ? '✓' : (isCurr ? '●' : idx + 1)}
                    </div>
                    <div className="stepper-mobile-content">
                      <div className="stepper-mobile-title">{stg.title}</div>
                      <span 
                        className="stepper-mobile-status"
                        style={{
                          color: isDone ? '#059669' : (isCurr ? '#047857' : '#94a3b8'),
                          background: isDone ? '#ecfdf5' : (isCurr ? '#fef08a' : '#f8fafc'),
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}
                      >
                        {isDone 
                          ? t('stepCompletedTag', language === 'hi' ? 'पूर्ण' : 'Completed') 
                          : (isCurr ? t('stepActiveTag', language === 'hi' ? 'जारी है' : 'In Progress') : t('stepPendingTag', language === 'hi' ? 'प्रतीक्षारत' : 'Pending'))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Speaker Notice Box */}
          <div className="mandi-notice-box">
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>📢</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
                {t('reachOnTimeTitle', language === 'hi' ? 'समय पर मंडी पहुंचें' : 'Arrive at Mandi on Time')}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#047857', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                {t('reachOnTimeSub', language === 'hi' ? 'निर्धारित समय से 15 मिनट पहले गेट पर क्यूआर कोड स्कैन कराएं।' : 'Please scan your QR code at the gate 15 minutes before your slot time.')}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. THREE BOTTOM COLUMNS (Weather/Advice + Recent Activity + Nearby Centres)
        ========================================================================= */}
        <div className="bottom-columns-grid">

          {/* Column A: Weather and Advisory */}
          <div className="info-column-card">
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
              <span>⛅</span> {t('weatherTitle', language === 'hi' ? 'मौसम एवं कृषि सलाह' : 'Weather & Crop Advisory')}
            </h4>

            {/* Temperature & Conditions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem' }}>🌤️</span>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                    32°C
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {t('partlyCloudy', language === 'hi' ? 'आंशिक रूप से बादल' : 'Partly Cloudy')}<br />{farmer?.district || (language === 'hi' ? 'मीरजापुर' : 'Mirzapur')}, {farmer?.state || (language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={15} color="#0284c7" /> {t('humidity', language === 'hi' ? 'आर्द्रता' : 'Humidity')} 68%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={15} color="#0284c7" /> {t('wind', language === 'hi' ? 'हवा' : 'Wind')} 12 km/h
                </span>
              </div>
            </div>

            {/* Advisory Green Pill Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#166534', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>🌱</span>
              <div>
                <strong>{t('advisoryPrefix', language === 'hi' ? 'कृषि सलाह:' : 'Advisory:')}</strong>{' '}
                {t('advisoryText', language === 'hi' ? 'फसल की कटाई के बाद अनाज को अच्छी तरह सुखाएं। 12% से कम नमी पर एमएसपी का पूरा लाभ मिलता है।' : 'Dry the crop well before bringing to procurement centre. Moisture below 12% guarantees full MSP.')}
              </div>
            </div>
          </div>

          {/* Column B: Recent Activity */}
          <div className="info-column-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Clock size={18} color="#eab308" /> {t('recentActivityTitle', language === 'hi' ? 'हाल की गतिविधियां' : 'Recent Activity')}
              </h4>
              <Link to="/farmer/procurement-status" style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textDecoration: 'none', background: '#f0fdf4', padding: '3px 8px', borderRadius: '10px' }}>
                {t('viewAll', language === 'hi' ? 'सभी देखें' : 'View All')} →
              </Link>
            </div>

            {/* Dynamic Activity List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {/* Item 1: Active Booking / Mandi Arrived */}
              {activeBooking && (
                <div className="activity-item-row">
                  <div style={{ width: '62px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.25, flexShrink: 0 }}>
                    {activeBooking.slotDate ? new Date(activeBooking.slotDate).toLocaleDateString([], { day: 'numeric', month: 'short' }) : (language === 'hi' ? '8 अक्टू' : '8 Oct')}<br />
                    {activeBooking.slotStartTime || '14:00'}
                  </div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #22c55e', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, paddingLeft: '8px', minWidth: 0 }}>
                    <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block', overflowWrap: 'anywhere' }}>
                      {t('stepSlotBooked', language === 'hi' ? 'स्लॉट बुक हुआ' : 'Slot Booked')}: {activeBooking.tokenNumber || 'T-123-42'}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', overflowWrap: 'anywhere' }}>
                      {activeBooking.centerName || (language === 'hi' ? 'चुनार कृषि उपज मंडी' : 'Chunar Krishi Upaj Mandi')}
                    </span>
                  </div>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {statusStyle.label}
                  </span>
                </div>
              )}

              {/* Item 2: Registration Completed */}
              <div className="activity-item-row">
                <div style={{ width: '62px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.25, flexShrink: 0 }}>
                  {language === 'hi' ? '4 सित' : '4 Sep'}<br />04:20 PM
                </div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #22c55e', flexShrink: 0 }}></div>
                <div style={{ flex: 1, paddingLeft: '8px', minWidth: 0 }}>
                  <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block', overflowWrap: 'anywhere' }}>
                    {t('activityRegCompleted', language === 'hi' ? 'पंजीकरण गतिविधि पूर्ण' : 'Activity Registration Completed')}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', overflowWrap: 'anywhere' }}>
                    {t('activityRegDesc', language === 'hi' ? 'आपकी गतिविधि का पंजीकरण सफलतापूर्वक संपन्न हुआ।' : 'Your activity registration has been completed successfully.')}
                  </span>
                </div>
                <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {t('stepCompletedTag', language === 'hi' ? 'पूर्ण' : 'Completed')}
                </span>
              </div>
            </div>
          </div>

          {/* Column C: Nearby Procurement Centres */}
          <div className="info-column-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MapPin size={18} color="#059669" /> {t('nearbyCentersTitle', language === 'hi' ? 'निकटतम उपार्जन केंद्र' : 'Nearby Procurement Centers')}
              </h4>
              <Link to="/centers" style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textDecoration: 'none', background: '#f0fdf4', padding: '3px 8px', borderRadius: '10px' }}>
                {t('viewAll', language === 'hi' ? 'सभी देखें' : 'View All')} →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {centres.slice(0, 3).map((c, idx) => {
                const isCurrent = activeBooking?.centerId === c.centerId || idx === 0;
                return (
                  <div key={c.centerId || idx} className="nearby-center-row">
                    <div className="nearby-center-info">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrent ? '#ecfdf5' : '#f8fafc', color: isCurrent ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isCurrent ? 'none' : '1px solid #e2e8f0', flexShrink: 0 }}>
                        <MapPin size={16} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <strong style={{ fontSize: '0.88rem', color: '#111827', overflowWrap: 'anywhere' }}>{c.centerName}</strong>
                          {isCurrent && (
                            <span style={{ background: '#044324', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                              {t('currentCenterBadge', language === 'hi' ? 'वर्तमान केंद्र' : 'Current Center')}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', overflowWrap: 'anywhere' }}>
                          {c.village ? `${c.village}, ${c.district}` : c.centerLocation}
                        </span>
                      </div>
                    </div>
                    <div className="nearby-center-dist" style={{ color: isCurrent ? '#059669' : '#64748b' }}>
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
        <div className="footer-bar-row">
          {/* Left: Green Pill Audio Button */}
          <button 
            onClick={handleSpeak}
            className="btn-audio-listen"
            aria-label={t('listenShort', 'Listen audio')}
          >
            <Volume2 size={18} />
            <span style={{ lineHeight: 1.15, textAlign: 'left' }}>
              {t('listenShort', 'Listen')}<br />
              <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500 }}>
                {t('audioInVoice', '(Audio)')}
              </span>
            </span>
          </button>

          {/* Center: Leaf Motivation Slogan */}
          <div className="footer-slogan">
            <span>🌱</span> {t('bottomSlogan', language === 'hi' ? 'किसान की समृद्धि, देश की प्रगति' : 'Empowering Farmers, Strengthening India')}
          </div>

          {/* Right: Helpline Pill */}
          <div className="footer-helpline-card">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Headphones size={16} />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                {t('helplineTitle', language === 'hi' ? 'मदद एवं सहायता' : 'Help & Support')}
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#111827' }}>
                {t('tollFreeNumber', '1800-180-1551')}
              </strong>
            </div>
            <ChevronRight size={18} color="#059669" />
          </div>
        </div>

      </div>
    </div>
  );
}
