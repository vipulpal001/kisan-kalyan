import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { useWebSocketSubscription } from "../../hooks/useWebSocket";
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
  Check,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
  AlertCircle,
  Megaphone,
  Sun,
  Radio,
  ExternalLink,
  Ticket
} from 'lucide-react';
import farmerPanoramicHero from "../../assets/farmer_panoramic_hero.jpg";

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // WebSocket subscriptions for live state synchronization
  useWebSocketSubscription('/topic/queue', () => {
    fetchDashboardData();
  });
  useWebSocketSubscription('/topic/bookings', () => {
    fetchDashboardData();
  });
  useWebSocketSubscription('/topic/notifications', () => {
    fetchDashboardData();
  });

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/farmer/dashboard-summary');
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load farmer dashboard summary:', err);
      if (err.response?.status === 401) {
        setError('UNAUTHORIZED');
      }
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = dashboardData?.activeBooking;
  const farmer = dashboardData?.farmer;
  const queuePosition = dashboardData?.queuePosition ?? 1;
  const estimatedWaitTimeMinutes = dashboardData?.estimatedWaitTimeMinutes ?? 12;
  const centres = dashboardData?.centres || [];

  // Reschedule slot timing modal state
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [selectedNewSlotId, setSelectedNewSlotId] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');

  const openRescheduleModal = async () => {
    if (!activeBooking) return;
    setShowReschedule(true);
    setRescheduleLoading(true);
    setRescheduleError('');
    setRescheduleSuccess('');
    setSelectedNewSlotId(activeBooking.slotId || null);

    try {
      const centerId = activeBooking.centerId || 1;
      const date = activeBooking.slotDate || new Date().toISOString().slice(0, 10);
      const res = await api.get(`/centers/${centerId}/availability?date=${date}&quantity=${activeBooking.estimatedQuantity || 50}`);
      if (res.data) {
        setRescheduleSlots(res.data);
      }
    } catch (err) {
      setRescheduleError(err.response?.data?.message || 'स्लॉट लोड करने में असमर्थ');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedNewSlotId || !activeBooking) return;
    setRescheduleLoading(true);
    setRescheduleError('');
    try {
      await api.put(`/farmer/bookings/${activeBooking.bookingId}/reschedule`, {
        newSlotId: selectedNewSlotId
      });
      setRescheduleSuccess('स्लॉट समय सफलतापूर्वक अपडेट कर दिया गया है!');
      await fetchDashboardData();
      setTimeout(() => {
        setShowReschedule(false);
        setRescheduleSuccess('');
      }, 1200);
    } catch (err) {
      setRescheduleError(err.response?.data?.message || 'स्लॉट समय बदलने में त्रुटि हुई');
    } finally {
      setRescheduleLoading(false);
    }
  };

  // Voice guidance based on real current data
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const farmerName = farmer?.name || user?.name || 'किसान';
    const token = activeBooking?.tokenNumber;
    const center = activeBooking?.centerName;
    const wait = estimatedWaitTimeMinutes;

    let speechText = `Namaste ${farmerName} Ji. Welcome to the Kisan Kalyan platform.`;
    if (token && center) {
      speechText += ` Your token number is ${token} at ${center}. Estimated wait time is approximately ${wait} minutes.`;
    } else {
      speechText += ` You can book a procurement slot or check live queue status from your dashboard.`;
    }
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #d1fae5', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#065f46', fontWeight: 700, fontSize: '1.05rem' }}>
          Loading farmer digital platform...
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Dynamic step statuses based strictly on backend state
  const hasBooking = Boolean(activeBooking);
  const isBooked = hasBooking;
  const isArrived = hasBooking && (activeBooking.bookingStatus === 'ARRIVED' || activeBooking.bookingStatus === 'PROCESSING' || activeBooking.bookingStatus === 'COMPLETED');
  const isQCPassed = hasBooking && (dashboardData?.procurementEntry?.qciStatus === 'PASSED' || activeBooking.bookingStatus === 'COMPLETED');
  const isQC = hasBooking && (activeBooking.bookingStatus === 'PROCESSING' || isQCPassed || dashboardData?.procurementEntry != null);
  const isStored = hasBooking && (dashboardData?.storageRecord != null || (dashboardData?.procurementEntry?.entryStatus === 'COMPLETED'));
  const isStorageInProgress = isQCPassed && !isStored;
  const isPaymentDone = hasBooking && (dashboardData?.payment?.paymentStatus === 'COMPLETED');
  const isPaymentInProgress = isStored && !isPaymentDone;

  let progressWidth = '0%';
  if (isPaymentDone) progressWidth = '100%';
  else if (isStored) progressWidth = '75%';
  else if (isQCPassed) progressWidth = '50%';
  else if (isArrived) progressWidth = '25%';
  else if (isBooked) progressWidth = '12%';

  return (
    <div style={{ background: 'transparent', minHeight: 'calc(100vh - 110px)', padding: '20px 0 50px 0' }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>

        {/* =========================================================================
            1. TOP HERO GREETING BANNER WITH EXACT PANORAMIC IMAGE & FLOATING CARD
        ========================================================================= */}
        <div style={{ 
          position: 'relative',
          background: `#ffffff url(${farmerPanoramicHero}) no-repeat center right / cover`,
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          overflow: 'hidden',
          marginBottom: '22px',
          boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
          minHeight: '235px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          gap: '20px'
        }}>
          {/* Subtle gradient overlay to make left text ultra clear without losing the background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '58%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.0) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}></div>

          {/* Left Column: Greeting & Motto */}
          <div style={{ position: 'relative', zIndex: 2, flex: '1 1 320px', maxWidth: '360px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.3px' }}>
              {t('greetingNamaste', 'नमस्ते')}, {farmer?.name || user?.name || ''} {t('greetingHonorific', 'जी')} <span style={{ fontSize: '1.5rem' }}>👋</span>
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.94rem', fontWeight: 500, margin: '6px 0 10px 0' }}>
              {t('farmerWelcome', 'अन्नदाता किसान भाई का स्वागत है')}
            </p>
            <p style={{ color: '#064e3b', fontWeight: 800, fontSize: '0.98rem', margin: '0 0 16px 0' }}>
              {t('farmerMotto', '“ आपकी मेहनत, देश की ताकत ”')}
            </p>
            
            {/* White Pill Location Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#ffffff', 
              border: '1px solid #d1d5db', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.82rem', 
              color: '#1f2937', 
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <MapPin size={15} color="#059669" />
              <span>
                {farmer?.village ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : (lang === 'en' ? 'Chunar Dehat, Mirzapur, Uttar Pradesh' : 'चुनार देहात, मीरजापुर, उत्तर प्रदेश')}
              </span>
            </div>
          </div>

          {/* Center Column: Dark Green Rounded Status Card */}
          <div style={{ 
            position: 'relative',
            zIndex: 2,
            background: 'rgba(5, 78, 56, 0.94)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.22)',
            padding: '18px 22px', 
            color: '#ffffff', 
            boxShadow: '0 10px 30px rgba(4, 67, 36, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: '1 1 450px',
            maxWidth: '490px'
          }}>
            {/* Top Grid: Nearest Center & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              
              {/* Center Info */}
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.18)', paddingRight: '14px' }}>
                <span style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                  {t('nearestCenter', 'निकटतम उपार्जन केंद्र')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <MapPin size={16} color="#ffffff" />
                  <strong style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 800 }}>
                    {activeBooking?.centerName || (lang === 'en' ? 'Chunar Procurement Centre' : 'चुनार उपार्जन केंद्र (समिति)')}
                  </strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#d1fae5', marginTop: '2px' }}>
                  {lang === 'en' ? 'Chunar, Mirzapur, Uttar Pradesh' : 'चुनार, मीरजापुर, उत्तर प्रदेश'}
                </div>

                <Link 
                  to="/find-centres"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#ffffff', 
                    color: '#064e3b', 
                    padding: '5px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.78rem', 
                    fontWeight: 800, 
                    textDecoration: 'none',
                    marginTop: '10px'
                  }}
                >
                  <span>{t('viewCenterDetails', 'उपार्जन केंद्र विवरण देखें')}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Stats Columns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                {/* My Token */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 600 }}>{t('myToken', 'मेरा टोकन')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ background: '#f59e0b', color: '#78350f', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 900 }}>🎟️</span>
                    <strong style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 900 }}>
                      {activeBooking?.tokenNumber || 'TK-108'}
                    </strong>
                    <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                      ● {t('stepActiveTag', 'सक्रिय')}
                    </span>
                  </div>
                </div>

                {/* My Storage Locations */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 600 }}>{t('storageLocations', 'भंडारण गोदाम')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Users size={16} color="#ffffff" />
                    <strong style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 900 }}>
                      {dashboardData?.storageLocationsCount || (centres.length > 0 ? centres.length * 3 : 12)}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#d1fae5' }}>{lang === 'en' ? 'Registered' : 'पंजीकृत केंद्र'}</span>
                  </div>
                </div>

                {/* Estimated Time */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 600 }}>{t('estimatedWait', 'अनुमानित समय')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', color: '#fef08a', fontWeight: 800, fontSize: '0.88rem' }}>
                    <Clock size={15} color="#fef08a" />
                    <span>~ {estimatedWaitTimeMinutes} {lang === 'en' ? 'Minutes' : 'मिनट'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row inside card: View My Queue */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' }}>
              <Link 
                to="/live-queue"
                style={{ 
                  background: '#ffffff', 
                  color: '#064e3b', 
                  borderRadius: '20px', 
                  padding: '6px 16px', 
                  fontSize: '0.8rem', 
                  fontWeight: 800, 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                }}
              >
                <Radio size={14} color="#059669" />
                <span>{t('viewQueueAction', 'लाइव कतार देखें')}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Slogan Text overlay over farmer image */}
          <div style={{ position: 'relative', zIndex: 2, alignSelf: 'flex-start', textAlign: 'right', marginTop: '8px' }}>
            <div style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '1.2rem', 
              fontWeight: 800, 
              color: '#064e3b', 
              lineHeight: 1.2,
              textShadow: '0 1px 4px rgba(255,255,255,0.8)'
            }}>
              {lang === 'en' ? <>Strong Farmers<br />Stronger India</> : <>समृद्ध किसान<br />सशक्त भारत</>}
            </div>
            {/* Green curved flourish arc */}
            <svg width="110" height="14" viewBox="0 0 110 14" fill="none" style={{ marginTop: '2px', marginLeft: 'auto', display: 'block' }}>
              <path d="M2 10C35 1 75 1 108 10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

        </div>

        {/* =========================================================================
            2. 4 BIG ACTION CARDS (MATCHING SCREENSHOT 3)
        ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '22px' }}>
          
          {/* Card 1: Book a Slot */}
          <Link 
            to="/farmer/book-slot"
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Calendar size={24} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'block' }}>
                  {t('navBookSlot', 'स्लॉट आरक्षण')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {lang === 'en' ? 'Check availability and book date & time' : 'उपलब्धता जांचें एवं तारीख व समय आरक्षित करें'}
                </span>
              </div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: View Storage Locations */}
          <Link 
            to="/find-centres"
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Users size={24} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'block' }}>
                  {t('storageLocations', 'भंडारण गोदाम')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {lang === 'en' ? 'See nearby storage centres and find your own' : 'निकटतम भंडारण गोदाम एवं केंद्र सूची देखें'}
                </span>
              </div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: View Storage Status */}
          <Link 
            to="/farmer/procurement-status"
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Package size={24} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'block' }}>
                  {t('procurementStatus', 'उपार्जन स्थिति')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {lang === 'en' ? 'Check status of crops, quality and storage' : 'फसल, गुणवत्ता व भंडारण की स्थिति देखें'}
                </span>
              </div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: View Payment Details */}
          <Link 
            to="/farmer/payments"
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>₹</span>
              </div>
              <div>
                <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', display: 'block' }}>
                  {t('payments', 'भुगतान (DBT)')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {lang === 'en' ? 'Direct Benefit Transfer (DBT) payment status' : 'खाते में सीधे डीबीटी भुगतान स्थिति देखें'}
                </span>
              </div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <ArrowRight size={14} />
            </div>
          </Link>

        </div>

        {/* =========================================================================
            3. MY STORAGE PROCESS STATUS (5-STEP HORIZONTAL TRACKER + ALERT)
        ========================================================================= */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          padding: '24px 30px', 
          marginBottom: '22px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
        }}>
          {/* Header */}
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌱</span> <span>{t('stepperTitle', 'उपार्जन प्रक्रिया स्थिति')}</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            
            {/* Left 5-Step Tracker */}
            <div style={{ flex: 1, position: 'relative' }}>
              
              {/* Connecting background bar */}
              <div style={{ position: 'absolute', top: '16px', left: '35px', right: '35px', height: '3px', background: '#e2e8f0', zIndex: 1 }}></div>
              {/* Active green progress bar dynamically bound to real state */}
              <div style={{ position: 'absolute', top: '16px', left: '35px', width: progressWidth, height: '3px', background: '#059669', zIndex: 1, transition: 'width 0.4s ease' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                
                {/* Step 1: Slot Booked */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isBooked ? '#017953' : '#cbd5e1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: '#111827', display: 'block' }}>{t('stepSlotBooked', 'स्लॉट आरक्षित')}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {activeBooking?.slotDate || (lang === 'en' ? 'Today' : 'आज')}
                    <br />
                    <strong style={{ color: '#017953' }}>
                      {activeBooking?.timeRangeLabel || activeBooking?.slotStartTime || '10:00 AM'}
                    </strong>
                  </span>
                  {activeBooking?.bookingStatus === 'BOOKED' && (
                    <button
                      onClick={openRescheduleModal}
                      title={lang === 'en' ? 'Change Slot Timing' : 'स्लॉट समय बदलें'}
                      style={{
                        marginTop: '4px',
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#047857',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-block'
                      }}
                    >
                      {lang === 'en' ? 'Reschedule ⏱️' : 'समय बदलें ⏱️'}
                    </button>
                  )}
                </div>

                {/* Step 2: Arrived at Center */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isArrived ? '#017953' : '#f8fafc', 
                    border: isArrived ? 'none' : '2px solid #cbd5e1',
                    color: isArrived ? '#ffffff' : '#94a3b8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 8px auto' 
                  }}>
                    {isArrived ? <Check size={16} strokeWidth={3} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }}></div>}
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: isArrived ? '#111827' : '#64748b', display: 'block' }}>{t('stepArrived', 'उपार्जन केंद्र पहुंचे')}</strong>
                  <span style={{ fontSize: '0.7rem', color: isArrived ? '#059669' : '#94a3b8', fontWeight: isArrived ? 700 : 500 }}>
                    {isArrived ? (lang === 'en' ? 'Verified' : 'उपस्थित') : (lang === 'en' ? 'Pending' : 'लंबित')}
                  </span>
                </div>

                {/* Step 3: Quality Check */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isQCPassed ? '#017953' : (isQC ? '#ffffff' : '#f8fafc'), 
                    border: isQC && !isQCPassed ? '3px solid #017953' : (isQCPassed ? 'none' : '2px solid #cbd5e1'), 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 8px auto', 
                    color: isQCPassed ? '#ffffff' : '#94a3b8',
                    boxShadow: isQC && !isQCPassed ? '0 0 0 4px #bbf7d0' : 'none'
                  }}>
                    {isQCPassed ? <Check size={16} strokeWidth={3} /> : <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isQC ? '#017953' : '#cbd5e1' }}></div>}
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: isQC ? '#017953' : '#64748b', display: 'block' }}>{t('stepQualityCheck', 'गुणवत्ता परीक्षण')}</strong>
                  <span style={{ fontSize: '0.72rem', color: isQCPassed ? '#047857' : (isQC ? '#059669' : '#94a3b8'), fontWeight: 700, display: 'block' }}>
                    {isQCPassed ? (lang === 'en' ? 'Passed' : 'गुणवत्ता उत्तीर्ण') : (isQC ? (lang === 'en' ? 'In Progress...' : 'प्रक्रिया जारी...') : (lang === 'en' ? 'Pending' : 'लंबित'))}
                  </span>
                </div>

                {/* Step 4: Storage (Godown) */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isStored ? '#017953' : (isStorageInProgress ? '#ffffff' : '#f8fafc'), 
                    border: isStorageInProgress ? '3px solid #017953' : (isStored ? 'none' : '2px solid #cbd5e1'), 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 8px auto', 
                    color: isStored ? '#ffffff' : '#94a3b8',
                    boxShadow: isStorageInProgress ? '0 0 0 4px #bbf7d0' : 'none'
                  }}>
                    {isStored ? <Check size={16} strokeWidth={3} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isStorageInProgress ? '#017953' : '#cbd5e1' }}></div>}
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: isStored || isStorageInProgress ? '#017953' : '#64748b', display: 'block' }}>{t('stepStorage', 'वैज्ञानिक भंडारण')}</strong>
                  <span style={{ fontSize: '0.7rem', color: isStored ? '#059669' : (isStorageInProgress ? '#d97706' : '#94a3b8'), fontWeight: isStored || isStorageInProgress ? 700 : 500 }}>
                    {isStored 
                      ? (dashboardData?.storageRecord?.locationName || (lang === 'en' ? 'Safely Stored' : 'सुरक्षित भंडारित'))
                      : (isStorageInProgress ? (lang === 'en' ? 'Storing...' : 'भंडारण जारी...') : (lang === 'en' ? 'Pending' : 'लंबित'))}
                  </span>
                </div>

                {/* Step 5: Payment */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isPaymentDone ? '#017953' : (isPaymentInProgress ? '#ffffff' : '#f8fafc'), 
                    border: isPaymentInProgress ? '3px solid #017953' : (isPaymentDone ? 'none' : '2px solid #cbd5e1'), 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 8px auto', 
                    color: isPaymentDone ? '#ffffff' : '#94a3b8',
                    boxShadow: isPaymentInProgress ? '0 0 0 4px #bbf7d0' : 'none'
                  }}>
                    {isPaymentDone ? <Check size={16} strokeWidth={3} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPaymentInProgress ? '#017953' : '#cbd5e1' }}></div>}
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: isPaymentDone || isPaymentInProgress ? '#017953' : '#64748b', display: 'block' }}>{t('stepPayment', 'डीबीटी भुगतान')}</strong>
                  <span style={{ fontSize: '0.7rem', color: isPaymentDone ? '#059669' : (isPaymentInProgress ? '#d97706' : '#94a3b8'), fontWeight: isPaymentDone || isPaymentInProgress ? 700 : 500 }}>
                    {isPaymentDone ? (lang === 'en' ? 'Paid' : 'सफल') : (isPaymentInProgress ? (lang === 'en' ? 'In Process...' : 'प्रक्रियाधीन...') : (lang === 'en' ? 'Pending' : 'लंबित'))}
                  </span>
                </div>

              </div>
            </div>

            {/* Right Side Alert Callout Box */}
            <div style={{ 
              width: '320px', 
              background: '#ecfdf5', 
              border: '1.5px solid #a7f3d0', 
              borderRadius: '16px', 
              padding: '16px 18px', 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'flex-start' 
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Megaphone size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#065f46', display: 'block', marginBottom: '4px' }}>
                  {t('reachOnTimeTitle', 'कृपया उपार्जन केंद्र पर समय से पहुँचें')}
                </strong>
                <p style={{ fontSize: '0.76rem', color: '#047857', margin: 0, lineHeight: 1.4 }}>
                  {t('reachOnTimeSub', 'अपनी बारी आने पर पहचान पत्र, आधार एवं उपज तैयार रखें ताकि तौल प्रक्रिया त्वरित संपन्न हो सके।')}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            4. 3-COLUMN LOWER SECTION (WEATHER, RECENT ACTIVITY, NEARBY CENTERS)
        ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '22px' }}>
          
          {/* Column 1: Today's Weather and Advice */}
          <div style={{ background: '#ffffff', borderRadius: '22px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌤️</span> <span>{t('weatherTitle', 'आज का मौसम और कृषि सलाह')}</span>
            </h3>

            {/* Weather Metric Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2.5rem' }}>🌤️</div>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                    32°C
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563', marginTop: '3px' }}>
                    {t('partlyCloudy', 'आंशिक बादल')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                    {lang === 'en' ? 'Mirzapur, Uttar Pradesh' : 'मीरजापुर, उत्तर प्रदेश'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#374151' }}>
                  <Droplets size={15} color="#2563eb" />
                  <span>{t('humidity', 'आर्द्रता')} <strong>68%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#374151' }}>
                  <Wind size={15} color="#059669" />
                  <span>{t('wind', 'हवा')} <strong>12 km/h</strong></span>
                </div>
              </div>
            </div>

            {/* Leaf Advice Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🌱</span>
              <p style={{ fontSize: '0.78rem', color: '#166534', margin: 0, lineHeight: 1.45 }}>
                <strong>{t('advisoryPrefix', 'सलाह:')}</strong> {t('advisoryText', 'दोपहर में धूप तेज़ रह सकती है। समय से पूर्व उपार्जन केंद्र पहुँचकर विश्राम शेड का उपयोग करें।')}
              </p>
            </div>
          </div>

          {/* Column 2: My Recent Activity */}
          <div style={{ background: '#ffffff', borderRadius: '22px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#f59e0b" />
                <span>{t('recentActivityTitle', 'मेरी हाल की गतिविधियां')}</span>
              </h3>
              <Link to="/farmer/procurement-status" style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>{t('viewAll', 'सभी देखें')}</span> <ArrowRight size={13} />
              </Link>
            </div>

            {/* Vertical Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '8px' }}>
              {/* Vertical connecting line */}
              <div style={{ position: 'absolute', top: '10px', bottom: '15px', left: '115px', width: '2px', background: '#e2e8f0' }}></div>

              {dashboardData?.allBookings && dashboardData.allBookings.length > 0 ? (
                dashboardData.allBookings.slice(0, 3).map((b, idx) => (
                  <div key={b.bookingId || idx} style={{ display: 'grid', gridTemplateColumns: '95px 20px 1fr 75px', gap: '8px', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{b.slotDate ? b.slotDate.slice(5) : (lang === 'en' ? 'Today' : 'आज')}</div>
                      <div>{b.timeRangeLabel ? b.timeRangeLabel.split('–')[0].trim() : (b.slotStartTime || '10:00 AM')}</div>
                    </div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669', zIndex: 1 }}></div>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: '#111827', display: 'block' }}>
                        {b.produceName} ({b.estimatedQuantity} Q)
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.centerName}</span>
                    </div>
                    <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', textAlign: 'center' }}>
                      {b.bookingStatus}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#64748b', padding: '12px 0' }}>
                  {lang === 'en' ? 'No recent activity found' : 'कोई हालिया गतिविधि नहीं मिली'}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Nearby Centers */}
          <div style={{ background: '#ffffff', borderRadius: '22px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#059669" />
                <span>{t('nearbyCentersTitle', 'आसपास के उपार्जन केंद्र')}</span>
              </h3>
              <Link to="/find-centres" style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>{t('viewAll', 'सभी देखें')}</span> <ArrowRight size={13} />
              </Link>
            </div>

            {/* Centers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(centres.length > 0 ? centres.slice(0, 3) : [
                { centerId: 1, centerName: 'चुनार उपार्जन केंद्र (समिति)', village: 'चुनार', district: 'मीरजापुर' },
                { centerId: 2, centerName: 'मीरजापुर मुख्य उपार्जन केंद्र', village: 'शास्त्री ब्रिज', district: 'मीरजापुर' },
                { centerId: 3, centerName: 'अहरौरा उपार्जन केंद्र', village: 'अहरौरा', district: 'मीरजापुर' }
              ]).map((c, idx) => (
                <div key={c.centerId || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} color={idx === 0 ? '#059669' : '#64748b'} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.86rem', color: '#111827' }}>{c.centerName}</strong>
                        {idx === 0 && (
                          <span style={{ background: '#064e3b', color: '#ffffff', fontSize: '0.64rem', fontWeight: 700, padding: '1px 6px', borderRadius: '8px' }}>
                            {lang === 'en' ? 'Nearest' : 'निकटतम'}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {c.village ? `${c.village}, ${c.district || (lang === 'en' ? 'Mirzapur' : 'मीरजापुर')}` : (c.centerLocation || (lang === 'en' ? 'Mirzapur, Uttar Pradesh' : 'मीरजापुर, उत्तर प्रदेश'))}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: idx === 0 ? '#374151' : '#64748b' }}>
                    {c.distanceKm != null ? `${c.distanceKm} km` : (c.district || '—')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================================================
            5. BOTTOM FLOATING / STICKY ACTION BAR
        ========================================================================= */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '16px',
          padding: '12px 18px',
          background: 'transparent',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          {/* Left: Listen Audio Guide Pill Button */}
          <button 
            onClick={handleSpeak}
            style={{ 
              background: '#044e3b', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '24px', 
              padding: '10px 22px', 
              fontSize: '0.88rem', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(4, 78, 59, 0.25)',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#065f46'}
            onMouseLeave={e => e.currentTarget.style.background = '#044e3b'}
          >
            <Volume2 size={18} />
            <span>{t('listenVoice', 'सुनें (आवाज़ में)')}</span>
          </button>

          {/* Center Motto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.94rem', fontWeight: 700, color: '#064e3b', fontStyle: 'italic' }}>
            <span>🌱</span>
            <span>{t('bottomSlogan', '“ समृद्ध किसान, आत्मनिर्भर भारत ”')}</span>
          </div>

          {/* Right: Help / Helpline Pill Button */}
          <a 
            href="tel:18001801551"
            style={{ 
              background: '#ffffff', 
              color: '#111827', 
              border: '1.5px solid #cbd5e1', 
              borderRadius: '24px', 
              padding: '8px 20px', 
              fontSize: '0.88rem', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'border-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#059669'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', lineHeight: 1 }}>{t('helpFaq', 'किसान सहायता')}</span>
              <strong style={{ fontSize: '0.92rem', color: '#064e3b' }}>1800-180-1551</strong>
            </div>
            <ChevronRight size={16} color="#64748b" />
          </a>
        </div>

        {/* Reschedule Slot Timing Modal */}
        {showReschedule && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} color="#017953" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    स्लॉट का समय बदलें (Reschedule Slot)
                  </h3>
                </div>
                <button
                  onClick={() => setShowReschedule(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
                वर्तमान स्लॉट: <strong>{activeBooking?.slotDate} ({activeBooking?.timeRangeLabel || activeBooking?.slotStartTime})</strong>। नीचे उपलब्ध नए स्लॉट में से चयन करें:
              </p>

              {rescheduleError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '14px' }}>
                  ⚠️ {rescheduleError}
                </div>
              )}

              {rescheduleSuccess && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '10px 12px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, marginBottom: '14px' }}>
                  ✓ {rescheduleSuccess}
                </div>
              )}

              {rescheduleLoading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#017953', fontWeight: 700, fontSize: '0.9rem' }}>
                  लोड हो रहा है...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
                  {rescheduleSlots.map((s) => {
                    const max = s.maxBookings != null ? s.maxBookings : 20;
                    const booked = s.currentBookings != null ? s.currentBookings : 0;
                    const rem = Math.max(0, max - booked);
                    const isAvail = s.isAvailable === true && rem > 0;
                    const isSelected = selectedNewSlotId === s.slotId;

                    return (
                      <div
                        key={s.slotId}
                        onClick={() => {
                          if (isAvail) setSelectedNewSlotId(s.slotId);
                        }}
                        style={{
                          border: isSelected ? '2px solid #017953' : '1px solid #e2e8f0',
                          background: isSelected ? '#ecfdf5' : (isAvail ? '#ffffff' : '#f8fafc'),
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: isAvail ? 'pointer' : 'not-allowed',
                          opacity: isAvail ? 1 : 0.55
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: isAvail ? '#111827' : '#94a3b8' }}>
                            {s.timeRangeLabel}
                          </strong>
                          <div style={{ fontSize: '0.74rem', color: isAvail ? '#047857' : '#dc2626', fontWeight: 600, marginTop: '2px' }}>
                            {isAvail ? `✓ ${rem} स्लॉट उपलब्ध` : '✕ स्लॉट पूर्ण अथवा समय समाप्त'}
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowReschedule(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  disabled={rescheduleLoading || !selectedNewSlotId}
                  style={{
                    background: (!selectedNewSlotId || rescheduleLoading) ? '#94a3b8' : '#017953',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 22px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: (!selectedNewSlotId || rescheduleLoading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {rescheduleLoading ? 'अपडेट हो रहा है...' : 'नया समय सुरक्षित करें'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
