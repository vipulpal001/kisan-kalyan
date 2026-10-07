import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { 
  Calendar, 
  Radio, 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  Clock, 
  QrCode, 
  MapPin, 
  Coins, 
  ChevronRight, 
  Search, 
  PackageCheck, 
  Zap, 
  Info,
  User
} from 'lucide-react';

import kisanHeroImg from '../assets/kisan_hero.jpg';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const { lang } = useLanguage();
  const { activeBooking } = useBooking();

  // Search & filter state for Find Nearest Centre section
  const [centreSearch, setCentreSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Real centres data with verified fields
  const allCentres = [
    {
      id: 'CEN-001',
      name: lang === 'hi' ? 'चुनार कृषि उपज मंडी समिति (Chunar APMC)' : 'Chunar APMC Procurement Mandi',
      district: 'Mirzapur',
      location: lang === 'hi' ? 'रेलवे स्टेशन रोड, चुनार, मीरजापुर, उ.प्र.' : 'Station Road, Chunar, Mirzapur, U.P.',
      distance: '3.2 km दूर',
      status: 'Open',
      statusLabel: lang === 'hi' ? 'खुला है (Open)' : 'Open Now',
      commodities: lang === 'hi' ? 'गेहूं, सरसों, चना' : 'Wheat, Mustard, Gram',
      workingHours: '09:00 AM – 05:00 PM',
      currentQueue: 7,
      availableSlots: 18,
      waitTime: '~35 min'
    },
    {
      id: 'CEN-002',
      name: lang === 'hi' ? 'गाज़ियाबाद गेहूं खरीद केंद्र' : 'Ghaziabad Wheat Procurement Centre',
      district: 'Ghaziabad',
      location: lang === 'hi' ? 'जीटी रोड, गाज़ियाबाद, उ.प्र.' : 'G.T. Road, Ghaziabad, U.P.',
      distance: '4.2 km दूर',
      status: 'Open',
      statusLabel: lang === 'hi' ? 'खुला है (Open)' : 'Open Now',
      commodities: lang === 'hi' ? 'गेहूं, मक्का' : 'Wheat, Maize',
      workingHours: '09:00 AM – 05:00 PM',
      currentQueue: 18,
      availableSlots: 26,
      waitTime: '~25 min'
    },
    {
      id: 'CEN-003',
      name: lang === 'hi' ? 'खन्ना एशिया अनाज मंडी खरीद केंद्र' : 'Khanna Asia Grain Market Centre',
      district: 'Ludhiana',
      location: lang === 'hi' ? 'जी.टी. रोड, खन्ना, लुधियाना, पंजाब' : 'G.T. Road, Khanna, Ludhiana, Punjab',
      distance: '5.8 km दूर',
      status: 'Open',
      statusLabel: lang === 'hi' ? 'खुला है (Open)' : 'Open Now',
      commodities: lang === 'hi' ? 'गेहूं, धान (चावल)' : 'Wheat, Paddy (Rice)',
      workingHours: '08:30 AM – 05:30 PM',
      currentQueue: 1,
      availableSlots: 45,
      waitTime: '~20 min'
    },
    {
      id: 'CEN-004',
      name: lang === 'hi' ? 'वाराणसी नवीन गल्ला मंडी केंद्र' : 'Varanasi Navin Galla Mandi Centre',
      district: 'Varanasi',
      location: lang === 'hi' ? 'शिवपुर मंडी रोड, शिवपुर, वाराणसी, उ.प्र.' : 'Shivpur Mandi Road, Varanasi, U.P.',
      distance: '14.5 km दूर',
      status: 'Busy',
      statusLabel: lang === 'hi' ? 'व्यस्त (High Crowd)' : 'High Crowd',
      commodities: lang === 'hi' ? 'गेहूं, धान, चना' : 'Wheat, Paddy, Gram',
      workingHours: '09:00 AM – 05:00 PM',
      currentQueue: 28,
      availableSlots: 4,
      waitTime: '~65 min'
    }
  ];

  // District options
  const districts = ['All', 'Mirzapur', 'Ghaziabad', 'Ludhiana', 'Varanasi'];

  // Filtered centres list
  const filteredCentres = allCentres.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(centreSearch.toLowerCase()) || 
                          c.location.toLowerCase().includes(centreSearch.toLowerCase()) ||
                          c.commodities.toLowerCase().includes(centreSearch.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  // Dynamic values from context
  const servingToken = activeBooking?.currentServingToken || 'WHT-037';
  const myToken = activeBooking?.tokenNumber || 'WHT-042';
  const myCounter = activeBooking?.counterName || (lang === 'hi' ? 'काउंटर 02' : 'Counter 02');
  const queueStatus = activeBooking?.queueStage || 'QUALITY_CHECK';
  const farmersAhead = activeBooking?.farmersAhead ?? 4;
  const estimatedWait = activeBooking?.estimatedWaitMinutes ?? 25;
  const centreName = activeBooking?.centerName || (lang === 'hi' ? 'गाज़ियाबाद गेहूं खरीद केंद्र' : 'Ghaziabad Procurement Centre');

  return (
    <div className="landing-page-root" id="main-content">
      
      {/* =========================================================================
          DESKTOP VIEW (100% Locked & Preserved for screens > 992px)
      ========================================================================= */}
      <div className="desktop-landing-content">
        
        {/* 1. HERO SECTION */}
        <section className="hero-section" aria-label="Hero Section">
          <div className="landing-container hero-container-rel">
            <div className="hero-grid">
              
              <div className="hero-left-col">
                <div className="hero-badge-pill">
                  <span className="hero-badge-flag-pip"></span>
                  <span className="hero-badge-icon">🌾</span>
                  <span className="hero-badge-text">
                    {lang === 'hi' 
                      ? 'डिजिटल कृषि खरीद पहल • भारत सरकार' 
                      : 'Digital Agriculture Procurement Initiative • Govt. of India'}
                  </span>
                  <span className="hero-badge-verified">✓ Verified</span>
                </div>

                <h1 className="hero-heading">
                  {lang === 'hi' ? (
                    <>
                      <span>स्मार्ट खरीद एवं कतार प्रबंधन </span>
                      <span className="hero-heading-highlight">किसानों के लिए</span>
                    </>
                  ) : (
                    <>
                      <span>Smart Procurement & Queue Management </span>
                      <span className="hero-heading-highlight">for Farmers</span>
                    </>
                  )}
                </h1>

                <p className="hero-lead-text">
                  {lang === 'hi' 
                    ? 'अपनी खरीद का स्लॉट बुक करें, लाइव कतार ट्रैक करें, पारदर्शी तौल कराएं और सीधे अपने बैंक खाते में एमएसपी भुगतान प्राप्त करें।' 
                    : 'Book your procurement slot, track your live queue, complete transparent weighing, and receive MSP payments directly into your bank account.'}
                </p>

                <div className="hero-cta-group">
                  <Link to="/farmer/book-slot" className="hero-btn-primary">
                    <span>{lang === 'hi' ? 'खरीद स्लॉट बुक करें' : 'Book a Procurement Slot'}</span>
                    <ArrowRight size={18} className="hero-btn-arrow" />
                  </Link>
                  <Link to="/centers" className="hero-btn-secondary">
                    <MapPin size={17} color="#a7f3d0" />
                    <span>{lang === 'hi' ? 'निकटतम केंद्र खोजें' : 'Find Nearest Centre'}</span>
                  </Link>
                </div>

                <div className="hero-trust-bar">
                  <div className="hero-trust-item">
                    <div className="hero-trust-icon-box">
                      <CheckCircle2 size={15} color="#34d399" />
                    </div>
                    <div>
                      <div className="hero-trust-title">{lang === 'hi' ? 'सरकारी पहल' : 'Government Initiative'}</div>
                      <div className="hero-trust-sub">{lang === 'hi' ? 'कृषि एवं किसान कल्याण मंत्रालय' : 'Ministry of Agriculture'}</div>
                    </div>
                  </div>

                  <div className="hero-trust-divider" aria-hidden="true" />

                  <div className="hero-trust-item">
                    <div className="hero-trust-icon-box">
                      <CheckCircle2 size={15} color="#34d399" />
                    </div>
                    <div>
                      <div className="hero-trust-title">{lang === 'hi' ? 'पारदर्शी प्रक्रिया' : 'Transparent Weighing'}</div>
                      <div className="hero-trust-sub">{lang === 'hi' ? 'कम्प्यूटरीकृत धर्मकांटा' : 'Electronic Scale Audit'}</div>
                    </div>
                  </div>

                  <div className="hero-trust-divider" aria-hidden="true" />

                  <div className="hero-trust-item">
                    <div className="hero-trust-icon-box">
                      <CheckCircle2 size={15} color="#34d399" />
                    </div>
                    <div>
                      <div className="hero-trust-title">{lang === 'hi' ? 'सीधा डीबीटी भुगतान' : 'Direct DBT'}</div>
                      <div className="hero-trust-sub">{lang === 'hi' ? 'सीधे बैंक खाते में' : 'Direct to Bank in 48h'}</div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="hero-right-col">
                <div className="hero-card-glow" aria-hidden="true" />
                
                <div className="hero-showcase-card">
                  <div className="hero-image-frame">
                    <img 
                      src={kisanHeroImg} 
                      alt={lang === 'hi' ? 'किसान कल्याण ई-उपार्जन केंद्र' : 'Kisan Kalyan Digital Procurement Centre'} 
                      className="hero-main-img" 
                    />
                    <div className="hero-floating-tag hero-tag-live">
                      <span className="pulse-dot"></span>
                      <span>{lang === 'hi' ? 'मंडी कतार सक्रिय' : 'Live Mandi Active'}</span>
                    </div>
                    <div className="hero-floating-tag hero-tag-apmc">
                      <span>🏛️ APMC Electronic Gate</span>
                    </div>
                  </div>

                  <div className="hero-dashboard-bar">
                    <div className="hero-dash-metric">
                      <div className="hero-dash-icon-disc disc-emerald">
                        <Radio size={18} />
                      </div>
                      <div className="hero-dash-meta">
                        <div className="hero-dash-label">
                          <span className="pulse-dot-sm"></span>
                          <span>{lang === 'hi' ? 'वर्तमान में सेवा प्राप्त' : 'NOW CALLING'}</span>
                        </div>
                        <div className="hero-dash-val">
                          {servingToken} <span className="hero-dash-counter">({myCounter})</span>
                        </div>
                        <div className="hero-dash-sub">
                          {lang === 'hi' ? 'धर्मकांटा तौल काउंटर 02' : 'Weighbridge Line 02'}
                        </div>
                      </div>
                    </div>

                    <div className="hero-dash-separator" aria-hidden="true" />

                    <div className="hero-dash-metric">
                      <div className="hero-dash-icon-disc disc-amber">
                        <Calendar size={18} />
                      </div>
                      <div className="hero-dash-meta">
                        <div className="hero-dash-label">
                          {lang === 'hi' ? 'निकटतम उपलब्ध स्लॉट' : 'NEXT OPEN SLOT'}
                        </div>
                        <div className="hero-dash-val">
                          02:00 PM – 03:00 PM
                        </div>
                        <div className="hero-dash-sub">
                          {lang === 'hi' ? 'गाज़ियाबाद केंद्र • 420Q शेष' : 'Ghaziabad Centre • 420Q Avail'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hero-card-footer-strip">
                    <div className="footer-strip-item">
                      <span>⚡ {lang === 'hi' ? '100% डीबीटी बैंक हस्तांतरण' : 'Direct Bank DBT'}</span>
                    </div>
                    <span className="footer-strip-dot">•</span>
                    <div className="footer-strip-item">
                      <span>📜 {lang === 'hi' ? 'डिजिटल हस्ताक्षरित जे-फॉर्म' : 'Digital Signed J-Form'}</span>
                    </div>
                    <span className="footer-strip-dot">•</span>
                    <div className="footer-strip-item">
                      <span>⚖️ {lang === 'hi' ? 'कम्प्यूटरीकृत तौल' : 'Tamper-Proof Scale'}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. QUICK ACTIONS / SERVICES */}
        <section className="quick-services-section" aria-label="Quick Services">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag">
                {lang === 'hi' ? 'त्वरित सेवाएं' : 'Quick Services'}
              </span>
              <h2 className="section-title">
                {lang === 'hi' ? 'पोर्टल की मुख्य किसान सेवाएं' : 'Core Farmer Services'}
              </h2>
              <p className="section-subtitle">
                {lang === 'hi' 
                  ? 'स्लॉट बुकिंग, लाइव टोकन, तौल रसीद और बैंक भुगतान स्थिति तक एक-क्लिक में सीधी पहुंच।' 
                  : 'Direct one-click access to slot bookings, live mandi queues, digital receipts, and DBT payments.'}
              </p>
            </div>

            <div className="quick-services-grid">
              <Link to="/farmer/book-slot" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Calendar size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Slot'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'उपज विक्रय हेतु समय व केंद्र आरक्षित करें।' : 'Reserve procurement date, time & mandi.'}
                </p>
                <span className="quick-service-action">
                  <span>{lang === 'hi' ? 'बुक करें' : 'Book Now'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>

              <Link to="/farmer/queue" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Radio size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'लाइव कतार' : 'Live Queue'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'मंडी जाने से पहले टोकन व काउंटर जांचें।' : 'Track token position & counter live.'}
                </p>
                <span className="quick-service-action" style={{ color: '#d97706' }}>
                  <span>{lang === 'hi' ? 'कतार देखें' : 'Track Queue'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>

              <Link to="/farmer/procurement-status" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <PackageCheck size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'खरीद स्थिति' : 'Procurement Status'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'तौल पर्ची, नमी व आवक स्थिति देखें।' : 'Check weighing, grade & acceptance.'}
                </p>
                <span className="quick-service-action" style={{ color: '#2563eb' }}>
                  <span>{lang === 'hi' ? 'स्थिति जांचें' : 'Check Status'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>

              <Link to="/farmer/payment" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#ecfdf5', color: '#047857' }}>
                  <Coins size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'डीबीटी भुगतान' : 'Payment Status'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'बैंक खाते में अंतरित एमएसपी राशि जांचें।' : 'Track direct MSP transfer to bank.'}
                </p>
                <span className="quick-service-action" style={{ color: '#047857' }}>
                  <span>{lang === 'hi' ? 'भुगतान देखें' : 'View Payment'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>

              <Link to="/centers" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#fff1f2', color: '#e11d48' }}>
                  <MapPin size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'खरीद केंद्र' : 'Find Centre'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'निकटतम सरकारी मंडी व साइलो खोजें।' : 'Locate nearest APMC centres & capacity.'}
                </p>
                <span className="quick-service-action" style={{ color: '#e11d48' }}>
                  <span>{lang === 'hi' ? 'केंद्र खोजें' : 'Find Centre'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>

              <Link to="/farmer/qr-pass" className="quick-service-card">
                <div className="quick-service-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <FileText size={22} />
                </div>
                <h3 className="quick-service-title">{lang === 'hi' ? 'डिजिटल जे-फॉर्म' : 'Download J-Form'}</h3>
                <p className="quick-service-desc">
                  {lang === 'hi' ? 'क्यूआर गेट पास व अधिकृत रसीद प्राप्त करें।' : 'Instant download of QR pass & receipt.'}
                </p>
                <span className="quick-service-action" style={{ color: '#7c3aed' }}>
                  <span>{lang === 'hi' ? 'रसीद पाएं' : 'Get J-Form'}</span>
                  <ChevronRight size={15} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. WHY KISAN KALYAN */}
        <section className="why-kisan-section" aria-label="Why Kisan Kalyan">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag">
                {lang === 'hi' ? 'पारदर्शी व्यवस्था' : 'Transparent Ecosystem'}
              </span>
              <h2 className="section-title">
                {lang === 'hi' ? 'किसान कल्याण ही क्यों?' : 'Why Kisan Kalyan?'}
              </h2>
              <p className="section-subtitle">
                {lang === 'hi' 
                  ? 'बुकिंग से लेकर बैंक भुगतान तक सरल, पारदर्शी और डिजिटल खरीद प्रक्रिया।' 
                  : 'Simple, transparent and digital procurement from booking to payment.'}
              </p>
            </div>

            <div className="why-kisan-grid">
              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon"><Clock size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'कम प्रतीक्षा' : 'Less Waiting'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'खरीद केंद्र जाने से पहले स्लॉट आरक्षित करें और अनावश्यक घंटों की प्रतीक्षा से बचें।' : 'Book a slot before visiting the procurement centre and avoid long queues.'}
                </p>
              </div>

              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon" style={{ background: '#fef3c7', color: '#b45309' }}><Radio size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'लाइव कतार ट्रैकिंग' : 'Live Queue Tracking'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'घर बैठे अपने मोबाइल पर टोकन नंबर और अनुमानित प्रतीक्षा समय रियल-टाइम देखें।' : 'Check your token, serving counter, and estimated waiting status on mobile.'}
                </p>
              </div>

              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><QrCode size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'त्वरित क्यूआर सत्यापन' : 'QR Verification'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'मंडी प्रवेश द्वार पर डिजिटल क्यूआर स्कैन द्वारा पेपरलेस व त्वरित आगमन सत्यापन।' : 'Fast digital verification and non-contact arrival check-in at the centre.'}
                </p>
              </div>

              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon" style={{ background: '#f5f3ff', color: '#6d28d9' }}><Scale size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'पारदर्शी तौल' : 'Transparent Weighing'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'कम्प्यूटरीकृत धर्मकांटे पर डिजिटल तौल सीधे सिस्टम में दर्ज, किसी भी मानवीय त्रुटि से मुक्त।' : 'Digitally recorded procurement and weighing details directly on electronic scales.'}
                </p>
              </div>

              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon" style={{ background: '#fff1f2', color: '#be123c' }}><FileText size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'डिजिटल जे-फॉर्म' : 'Digital J-Form'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'तौल पूरा होते ही अधिकृत जे-फॉर्म बिक्री रसीद ऑनलाइन प्राप्त करें और कभी भी डाउनलोड करें।' : 'Access and download your verified official digital procurement receipt online.'}
                </p>
              </div>

              <div className="why-kisan-card">
                <div className="why-kisan-icon-header">
                  <div className="why-kisan-icon" style={{ background: '#ecfdf5', color: '#047857' }}><Coins size={20} /></div>
                  <h3 className="why-kisan-title">{lang === 'hi' ? 'सीधा डीबीटी भुगतान' : 'Direct DBT'}</h3>
                </div>
                <p className="why-kisan-text">
                  {lang === 'hi' ? 'न्यूनतम समर्थन मूल्य (MSP) की संपूर्ण राशि सीधे आधार-लिंक्ड बैंक खाते में सुरक्षित अंतरित।' : 'Track MSP payment transferred directly to your registered bank account.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LIVE QUEUE SECTION */}
        <section className="live-queue-preview-section" aria-label="Live Queue Monitor">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag">
                {lang === 'hi' ? 'रियल-टाइम मंडी मॉनिटर' : 'Real-Time Mandi Monitor'}
              </span>
              <h2 className="section-title">
                {lang === 'hi' ? 'मंडी पहुंचने से पहले अपनी कतार जानें' : 'Know Your Queue Before You Reach the Mandi'}
              </h2>
              <p className="section-subtitle">
                {lang === 'hi' 
                  ? 'खरीद केंद्र जाने से पहले अपना टोकन, काउंटर और कतार स्थिति ऑनलाइन जांचें।' 
                  : 'Track your token, counter and queue status before visiting the procurement centre.'}
              </p>
            </div>

            <div className="live-queue-card">
              <div className="live-queue-card-header">
                <div className="live-queue-header-left">
                  <span className="live-queue-header-badge">
                    <span className="pulse-dot"></span>
                    <span>{lang === 'hi' ? 'लाइव स्थिति' : 'Live Sync'}</span>
                  </span>
                  <span className="live-queue-centre-name">
                    🏛️ {centreName}
                  </span>
                </div>
                <div className="live-queue-sync-pill">
                  <Zap size={14} />
                  <span>{lang === 'hi' ? 'धर्मकांटा कंसोल से सक्रिय सिंक' : 'Synced with Electronic Weighbridge'}</span>
                </div>
              </div>

              <div className="live-queue-body">
                <div className="live-queue-metrics-grid">
                  <div className="queue-metric-item highlight-metric">
                    <div className="queue-metric-label">
                      {lang === 'hi' ? 'वर्तमान में सेवा प्राप्त' : 'Currently Serving'}
                    </div>
                    <div className="queue-metric-val highlight-text">
                      {servingToken}
                    </div>
                    <div className="queue-metric-sub">
                      {lang === 'hi' ? `स्थान: ${myCounter}` : `Location: ${myCounter}`}
                    </div>
                  </div>

                  <div className="queue-metric-item">
                    <div className="queue-metric-label">
                      {lang === 'hi' ? 'आपका टोकन नंबर' : 'Your Token'}
                    </div>
                    <div className="queue-metric-val" style={{ color: '#0369a1' }}>
                      {myToken}
                    </div>
                    <div className="queue-metric-sub">
                      {lang === 'hi' ? 'गेहूं स्लॉट 02:00 PM' : 'Wheat Slot • Verified'}
                    </div>
                  </div>

                  <div className="queue-metric-item">
                    <div className="queue-metric-label">
                      {lang === 'hi' ? 'आगे किसान / प्रतीक्षा' : 'Farmers Ahead / Wait'}
                    </div>
                    <div className="queue-metric-val" style={{ color: '#b45309' }}>
                      {farmersAhead} {lang === 'hi' ? 'किसान' : 'Ahead'}
                    </div>
                    <div className="queue-metric-sub">
                      {lang === 'hi' ? `अनुमानित समय: ~${estimatedWait} मिनट` : `Est. Wait: ~${estimatedWait} mins`}
                    </div>
                  </div>

                  <div className="queue-metric-item">
                    <div className="queue-metric-label">
                      {lang === 'hi' ? 'प्रक्रिया चरण' : 'Queue Stage'}
                    </div>
                    <div className="queue-metric-val" style={{ fontSize: '1.15rem', color: '#15803d' }}>
                      {queueStatus === 'QUALITY_CHECK' ? (lang === 'hi' ? 'गुणवत्ता जांच जारी' : 'Quality Check') : queueStatus}
                    </div>
                    <div className="queue-metric-sub">
                      {lang === 'hi' ? 'नमी व शुद्धता परीक्षण' : 'Moisture & Grade check'}
                    </div>
                  </div>
                </div>

                <div className="live-queue-action-bar">
                  <div className="live-queue-note">
                    <Info size={15} color="#059669" />
                    <span>
                      {lang === 'hi' 
                        ? 'टोकन कॉल होने पर ऑडियो घोषणा और मोबाइल संदेश स्वतः भेजा जाता है।' 
                        : 'Audio loudspeaker announcements and SMS are dispatched upon token call.'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to="/farmer/queue" className="live-queue-cta-btn">
                      <Radio size={16} />
                      <span>{lang === 'hi' ? 'लाइव कतार मॉनिटर खोलें' : 'View Live Queue'}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 5. PROCUREMENT PROCESS */}
        <section className="procurement-process-section" aria-label="Procurement Process">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag">
                {lang === 'hi' ? 'सरल एवं पारदर्शी प्रक्रिया' : 'Step-by-Step Workflow'}
              </span>
              <h2 className="section-title">
                {lang === 'hi' ? 'खरीद प्रक्रिया कैसे कार्य करती है?' : 'How Does the Procurement Process Work?'}
              </h2>
              <p className="section-subtitle">
                {lang === 'hi' 
                  ? 'स्लॉट बुकिंग से लेकर बैंक भुगतान तक — एक सरल, पारदर्शी और व्यवस्थित डिजिटल यात्रा।' 
                  : 'From slot booking to payment — a simple and transparent digital process.'}
              </p>
            </div>

            <div className="process-steps-grid">
              <div className="process-step-card">
                <div className="step-card-number">01</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Your Slot'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'फसल, मात्रा, खरीद केंद्र, तारीख व समय चुनें।' : 'Select crop, quantity, centre, date and time.'}
                </p>
              </div>

              <div className="process-step-card">
                <div className="step-card-number" style={{ background: '#fef9c3', color: '#854d0e' }}>02</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'डिजिटल टोकन' : 'Get Digital Token'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'मोबाइल पर क्यूआर गेट पास व टोकन पर्ची प्राप्त करें।' : 'Receive your QR gate pass and verified token.'}
                </p>
              </div>

              <div className="process-step-card">
                <div className="step-card-number" style={{ background: '#eff6ff', color: '#1d4ed8' }}>03</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'केंद्र पर पहुंचें' : 'Arrive at Centre'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'प्रवेश द्वार पर क्यूआर स्कैन कराकर आगमन दर्ज करें।' : 'Scan QR at gate and seamlessly register arrival.'}
                </p>
              </div>

              <div className="process-step-card">
                <div className="step-card-number" style={{ background: '#f5f3ff', color: '#6d28d9' }}>04</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'गुणवत्ता व तौल' : 'Quality & Weighing'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'नमी जांच और कम्प्यूटरीकृत धर्मकांटे पर शुद्ध तौल।' : 'Complete quality assessment and digital weighing.'}
                </p>
              </div>

              <div className="process-step-card">
                <div className="step-card-number" style={{ background: '#fff1f2', color: '#be123c' }}>05</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'जे-फॉर्म प्राप्त करें' : 'Get J-Form'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'तौल पूर्ण होते ही अधिकृत खरीद रसीद ऑनलाइन पाएं।' : 'Receive your digital procurement receipt instantly.'}
                </p>
              </div>

              <div className="process-step-card">
                <div className="step-card-number" style={{ background: '#ecfdf5', color: '#047857' }}>06</div>
                <h3 className="step-card-title">{lang === 'hi' ? 'डीबीटी भुगतान' : 'Receive DBT'}</h3>
                <p className="step-card-desc">
                  {lang === 'hi' ? 'एमएसपी राशि सीधे आधार-लिंक्ड बैंक खाते में अंतरित।' : 'Track MSP payment directly into your bank account.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TRANSPARENCY SECTION */}
        <section className="transparency-section" aria-label="Transparency and Audit">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag dark-tag">
                {lang === 'hi' ? 'पूर्ण डिजिटल जवाबदेही' : 'Total Traceability'}
              </span>
              <h2 className="section-title white-title">
                {lang === 'hi' ? 'हर चरण पर पूर्ण पारदर्शिता' : 'Transparent at Every Step'}
              </h2>
              <p className="section-subtitle white-subtitle">
                {lang === 'hi' 
                  ? 'खरीद का प्रत्येक चरण डिजिटल रूप से दर्ज होता है जिससे पूर्ण पारदर्शिता और जवाबदेही सुनिश्चित होती है।' 
                  : 'Every stage of procurement is digitally recorded for better transparency and traceability.'}
              </p>
            </div>

            <div className="journey-pipeline">
              <div className="journey-node">
                <div className="journey-node-icon"><Calendar size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'स्लॉट आरक्षण' : 'Slot Booking'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'समयबद्ध डिजिटल स्लॉट' : 'Time-stamped audit'}</div>
              </div>
              <div className="journey-node">
                <div className="journey-node-icon"><QrCode size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'क्यूआर सत्यापन' : 'QR Verification'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'गेट प्रवेश सत्यापन' : 'Geo-verified entry'}</div>
              </div>
              <div className="journey-node">
                <div className="journey-node-icon"><ShieldCheck size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'गुणवत्ता जांच' : 'Quality Check'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'मानकीकृत नमी रिपोर्ट' : 'Moisture calibrated'}</div>
              </div>
              <div className="journey-node">
                <div className="journey-node-icon"><Scale size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'डिजिटल तौल' : 'Digital Weighing'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'इलेक्ट्रॉनिक धर्मकांटा' : 'Tamper-proof scale'}</div>
              </div>
              <div className="journey-node">
                <div className="journey-node-icon"><FileText size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'डिजिटल जे-फॉर्म' : 'J-Form Issued'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'अधिकृत रसीद' : 'Signed receipt'}</div>
              </div>
              <div className="journey-node">
                <div className="journey-node-icon"><Coins size={18} /></div>
                <div className="journey-node-title">{lang === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payment'}</div>
                <div className="journey-node-caption">{lang === 'hi' ? 'सीधा बैंक अंतरण' : 'Direct bank transfer'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FIND NEAREST CENTRE */}
        <section className="find-centre-section" aria-label="Find Procurement Centres">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-tag">
                {lang === 'hi' ? 'उपार्जन केंद्र' : 'Centre Discovery'}
              </span>
              <h2 className="section-title">
                {lang === 'hi' ? 'अपना नजदीकी खरीद केंद्र खोजें' : 'Find Your Nearest Procurement Centre'}
              </h2>
              <p className="section-subtitle">
                {lang === 'hi' 
                  ? 'सक्रिय खरीद केंद्र खोजें, उपलब्ध फसलें देखें और वास्तविक समय में कतार स्थिति जांचें।' 
                  : 'Search operational procurement centres, verify active commodities, and view live queues.'}
              </p>
            </div>

            <div className="centre-filter-bar">
              <div className="centre-search-box">
                <Search size={18} color="#64748b" />
                <input 
                  type="text"
                  value={centreSearch}
                  onChange={(e) => setCentreSearch(e.target.value)}
                  placeholder={lang === 'hi' ? 'मंडी, केंद्र अथवा फसल खोजें...' : 'Search centre by name, district or crop...'}
                  className="centre-search-input"
                  aria-label="Search centre by name, district or crop"
                />
              </div>

              <div className="district-filter-pills" role="radiogroup" aria-label="Filter by district">
                {districts.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDistrict(d)}
                    className={`district-pill ${selectedDistrict === d ? 'active' : ''}`}
                  >
                    {d === 'All' ? (lang === 'hi' ? 'सभी जिले (All)' : 'All Districts') : d}
                  </button>
                ))}
              </div>
            </div>

            <div className="centre-cards-grid">
              {filteredCentres.length > 0 ? (
                filteredCentres.map((centre) => (
                  <div key={centre.id} className="centre-item-card">
                    <div>
                      <div className="centre-header-row">
                        <h3 className="centre-name-text">{centre.name}</h3>
                        <span className={`centre-status-badge ${centre.status.toLowerCase()}`}>
                          {centre.statusLabel}
                        </span>
                      </div>

                      <div className="centre-location-text">
                        <MapPin size={14} color="#059669" />
                        <span>{centre.location}</span>
                      </div>

                      <div className="centre-meta-tags">
                        <div>
                          <strong>{lang === 'hi' ? 'दूरी:' : 'Distance:'}</strong> {centre.distance}
                        </div>
                        <div>
                          <strong>{lang === 'hi' ? 'फसलें:' : 'Crops:'}</strong> {centre.commodities}
                        </div>
                        <div>
                          <strong>{lang === 'hi' ? 'कतार:' : 'Queue:'}</strong> {centre.currentQueue} {lang === 'hi' ? 'किसान' : 'Farmers'} ({centre.waitTime})
                        </div>
                      </div>
                    </div>

                    <div className="centre-actions-row">
                      <Link to="/farmer/book-slot" className="centre-btn-book">
                        {lang === 'hi' ? 'यहां स्लॉट बुक करें' : 'Book at this Centre'}
                      </Link>
                      <Link to={`/centers?q=${encodeURIComponent(centre.district)}`} className="centre-btn-details">
                        {lang === 'hi' ? 'विवरण' : 'Details'}
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '36px', textAlign: 'center', gridColumn: '1 / -1', color: '#64748b' }}>
                  {lang === 'hi' ? 'कोई केंद्र नहीं मिला। कृपया खोज शब्द बदलें।' : 'No centres match your filter. Try adjusting search.'}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 8. FINAL BOOKING CTA */}
        <section className="final-cta-section" aria-label="Call to Action">
          <div className="landing-container">
            <div className="final-cta-box">
              <h2 className="final-cta-title">
                {lang === 'hi' ? 'अपनी उपज बेचने के लिए तैयार हैं?' : 'Ready to Sell Your Produce?'}
              </h2>
              <p className="final-cta-desc">
                {lang === 'hi' 
                  ? 'आज ही सरकारी खरीद केंद्र पर अपना स्लॉट बुक करें और मंडी में अनावश्यक प्रतीक्षा से बचें।' 
                  : 'Book your procurement slot and avoid unnecessary waiting at the centre.'}
              </p>
              <div className="final-cta-btns">
                <Link to="/farmer/book-slot" className="hero-btn-primary">
                  <span>{lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Your Slot'}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/centers" className="hero-btn-secondary">
                  <MapPin size={17} />
                  <span>{lang === 'hi' ? 'निकटतम केंद्र खोजें' : 'Find Nearest Centre'}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. HELP & SUPPORT */}
        <section className="help-support-section" aria-label="Help and Support">
          <div className="landing-container">
            <div className="help-support-card">
              <div className="help-support-left">
                <h2 className="help-support-title">
                  {lang === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
                </h2>
                <p className="help-support-desc">
                  {lang === 'hi' 
                    ? 'स्लॉट बुकिंग, खरीद स्थिति, भुगतान अथवा केंद्र संबंधी किसी भी प्रश्न के लिए निशुल्क सहायता प्राप्त करें।' 
                    : 'Get assistance with slot booking, procurement status, payments or centre-related queries.'}
                </p>
              </div>

              <div className="help-support-right">
                <a href="tel:18001801551" className="help-tollfree-btn" title="Call Kisan Toll-Free Helpline">
                  <PhoneCall size={20} />
                  <span>1800-180-1551</span>
                </a>
                <Link to="/help" className="help-faq-btn">
                  <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ & Support'}</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div> {/* End .desktop-landing-content */}

      {/* =========================================================================
          MOBILE & TABLET VIEW (Dedicated Farmer App UX for screens <= 992px)
      ========================================================================= */}
      <div className="mobile-landing-content">
        
        {/* ==========================================
            1. MOBILE HERO SECTION
            Clear hierarchy: Govt Badge -> Title -> Desc -> CTAs -> Live Queue Pill -> Compact Visual
        ========================================== */}
        <section className="m-hero-section" aria-label="Farmer Portal Mobile Hero">
          <div className="m-container">
            
            {/* Govt Initiative Badge */}
            <div className="m-badge-pill">
              <span className="m-flag-pip"></span>
              <span className="m-badge-icon">🌾</span>
              <span className="m-badge-text">
                {lang === 'hi' ? 'डिजिटल कृषि खरीद पहल • भारत सरकार' : 'Digital Agriculture Initiative • Govt. of India'}
              </span>
              <span className="m-badge-verified">✓ {lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
            </div>

            {/* Mobile Title (28–32px readable, bold) */}
            <h1 className="m-hero-title">
              {lang === 'hi' ? (
                <>
                  <span>स्मार्ट खरीद एवं कतार प्रबंधन </span>
                  <span className="m-title-highlight">किसानों के लिए</span>
                </>
              ) : (
                <>
                  <span>Smart Procurement & Queue </span>
                  <span className="m-title-highlight">Management for Farmers</span>
                </>
              )}
            </h1>

            {/* Short Subtitle */}
            <p className="m-hero-desc">
              {lang === 'hi'
                ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) पर पारदर्शी खरीद, लाइव कतार ट्रैकिंग और सीधे बैंक खाते में भुगतान।'
                : 'Direct government MSP procurement with live token tracking, electronic weighing, and direct DBT.'}
            </p>

            {/* Primary Action Buttons (Touch Friendly 48px Height) */}
            <div className="m-hero-cta-stack">
              <Link to="/farmer/book-slot" className="m-btn-primary">
                <Calendar size={18} />
                <span>{lang === 'hi' ? 'खरीद स्लॉट बुक करें' : 'BOOK PROCUREMENT SLOT'}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/centers" className="m-btn-secondary">
                <MapPin size={17} />
                <span>{lang === 'hi' ? 'निकटतम केंद्र खोजें' : 'FIND NEAREST CENTRE'}</span>
              </Link>
            </div>

            {/* Hero Live Status Pill: CURRENT TOKEN / LIVE QUEUE */}
            <div className="m-live-token-banner">
              <div className="m-live-token-header">
                <div className="m-live-indicator">
                  <span className="m-pulse-dot"></span>
                  <span className="m-live-tag">{lang === 'hi' ? 'लाइव कतार सक्रिय' : 'CURRENT TOKEN / LIVE QUEUE'}</span>
                </div>
                <Link to="/farmer/queue" className="m-live-link">
                  <span>{lang === 'hi' ? 'पूरी कतार' : 'Track'}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
              <div className="m-live-token-body">
                <div className="m-token-box">
                  <span className="m-token-lbl">{lang === 'hi' ? 'वर्तमान टोकन' : 'Now Calling'}</span>
                  <span className="m-token-val">{servingToken}</span>
                </div>
                <div className="m-token-divider"></div>
                <div className="m-token-box">
                  <span className="m-token-lbl">{lang === 'hi' ? 'स्थान' : 'Counter'}</span>
                  <span className="m-token-sub">{myCounter}</span>
                </div>
                <div className="m-token-divider"></div>
                <div className="m-token-box">
                  <span className="m-token-lbl">{lang === 'hi' ? 'प्रतीक्षा' : 'Est. Wait'}</span>
                  <span className="m-token-sub">~{estimatedWait} min</span>
                </div>
              </div>
            </div>

            {/* Compact Showcase Banner (Height-controlled, sleek) */}
            <div className="m-hero-banner-card">
              <img 
                src={kisanHeroImg} 
                alt="Kisan Kalyan Centre" 
                className="m-hero-img" 
              />
              <div className="m-hero-banner-overlay">
                <div className="m-banner-chip">
                  <span>🏛️ {centreName}</span>
                </div>
                <div className="m-banner-badges-row">
                  <span>⚡ {lang === 'hi' ? 'सीधा बैंक अंतरण' : 'Direct DBT'}</span>
                  <span>⚖️ {lang === 'hi' ? 'डिजिटल धर्मकांटा' : 'Electronic Scale'}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            2. QUICK ACTIONS (Immediately after Hero)
            [ Book Slot ]     [ Live Queue ]
            [ Payment/DBT ]   [ Find Centre ]
        ========================================== */}
        <section className="m-section m-quick-actions-section" aria-label="Farmer Quick Actions">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'त्वरित कार्य' : 'QUICK ACTIONS'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'किसान मुख्य सेवाएं' : 'Quick Actions'}</h2>
            </div>

            <div className="m-quick-actions-grid">
              {/* 1. Book Slot */}
              <Link to="/farmer/book-slot" className="m-quick-card q-card-emerald">
                <div className="m-quick-icon-wrap icon-emerald">
                  <Calendar size={22} />
                </div>
                <div className="m-quick-content">
                  <div className="m-quick-title">{lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Slot'}</div>
                  <div className="m-quick-sub">{lang === 'hi' ? 'तारीख व मंडी चुनें' : 'Reserve slot & date'}</div>
                </div>
                <ChevronRight size={16} className="m-quick-arrow" />
              </Link>

              {/* 2. Live Queue */}
              <Link to="/farmer/queue" className="m-quick-card q-card-amber">
                <div className="m-quick-icon-wrap icon-amber">
                  <Radio size={22} />
                  <span className="m-quick-live-pip"></span>
                </div>
                <div className="m-quick-content">
                  <div className="m-quick-title">{lang === 'hi' ? 'लाइव कतार' : 'Live Queue'}</div>
                  <div className="m-quick-sub">{lang === 'hi' ? 'टोकन व काउंटर जांचें' : 'Check token & wait'}</div>
                </div>
                <ChevronRight size={16} className="m-quick-arrow" />
              </Link>

              {/* 3. Payment / DBT */}
              <Link to="/farmer/payment" className="m-quick-card q-card-blue">
                <div className="m-quick-icon-wrap icon-blue">
                  <Coins size={22} />
                </div>
                <div className="m-quick-content">
                  <div className="m-quick-title">{lang === 'hi' ? 'डीबीटी भुगतान' : 'Payment / DBT'}</div>
                  <div className="m-quick-sub">{lang === 'hi' ? 'बैंक खाता ट्रांसफर देखें' : 'Track MSP payment'}</div>
                </div>
                <ChevronRight size={16} className="m-quick-arrow" />
              </Link>

              {/* 4. Find Centre */}
              <Link to="/centers" className="m-quick-card q-card-rose">
                <div className="m-quick-icon-wrap icon-rose">
                  <MapPin size={22} />
                </div>
                <div className="m-quick-content">
                  <div className="m-quick-title">{lang === 'hi' ? 'निकटतम केंद्र' : 'Find Centre'}</div>
                  <div className="m-quick-sub">{lang === 'hi' ? 'मंडी दूरी व क्षमता' : 'APMC mandi distance'}</div>
                </div>
                <ChevronRight size={16} className="m-quick-arrow" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            3. CURRENT STATUS CARD
            Prominently display active booking OR prompt to book
        ========================================== */}
        <section className="m-section m-status-section" aria-label="Current Booking Status">
          <div className="m-container">
            <div className="m-booking-status-card">
              
              <div className="m-status-card-header">
                <div className="m-status-tag-row">
                  <span className="m-status-pulse-dot"></span>
                  <span className="m-status-card-heading">
                    {activeBooking 
                      ? (lang === 'hi' ? 'आपकी वर्तमान बुकिंग' : 'YOUR CURRENT BOOKING')
                      : (lang === 'hi' ? 'वर्तमान खरीद स्थिति' : 'ACTIVE STATUS / BOOKING')}
                  </span>
                </div>
                <span className="m-status-pill-active">
                  {lang === 'hi' ? 'सक्रिय (Calling)' : 'Now Calling'}
                </span>
              </div>

              <div className="m-status-card-body">
                <div className="m-status-row-main">
                  <div>
                    <span className="m-status-meta-lbl">{lang === 'hi' ? 'टोकन नंबर' : 'Token'}</span>
                    <div className="m-status-token-num">{myToken}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="m-status-meta-lbl">{lang === 'hi' ? 'कतार स्थिति' : 'Status'}</span>
                    <div className="m-status-stage-text">{lang === 'hi' ? 'तौल कतार में' : 'Now Calling'}</div>
                  </div>
                </div>

                <div className="m-status-detail-strip">
                  <div className="m-status-detail-item">
                    <span className="m-status-detail-lbl">{lang === 'hi' ? 'केंद्र' : 'Centre'}:</span>
                    <strong className="m-status-detail-val">{centreName}</strong>
                  </div>
                  <div className="m-status-detail-item">
                    <span className="m-status-detail-lbl">{lang === 'hi' ? 'समय' : 'Slot'}:</span>
                    <strong className="m-status-detail-val">02:00 PM – 03:00 PM</strong>
                  </div>
                  <div className="m-status-detail-item">
                    <span className="m-status-detail-lbl">{lang === 'hi' ? 'आगे किसान' : 'Ahead'}:</span>
                    <strong className="m-status-detail-val">{farmersAhead} {lang === 'hi' ? 'किसान' : 'ahead'} (~{estimatedWait}m)</strong>
                  </div>
                </div>

                <div className="m-status-action-row">
                  <Link to="/farmer/queue" className="m-status-btn-view">
                    <Radio size={16} />
                    <span>{lang === 'hi' ? 'लाइव कतार देखें' : 'View Live Queue'}</span>
                  </Link>
                  <Link to="/farmer/qr-pass" className="m-status-btn-pass">
                    <QrCode size={16} />
                    <span>{lang === 'hi' ? 'क्यूआर पास' : 'Gate Pass'}</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
            4. CORE SERVICES (Compact 2-Column Grid)
            Book Slot | Live Queue
            Payment   | Find Centre
            J-Form    | Profile
        ========================================== */}
        <section className="m-section m-services-section" aria-label="Core Portal Services">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'सभी सुविधाएं' : 'SERVICES'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'मुख्य किसान पोर्टल सेवाएं' : 'Core Services'}</h2>
            </div>

            <div className="m-core-services-grid">
              
              {/* 1. Book Slot */}
              <Link to="/farmer/book-slot" className="m-service-box">
                <div className="m-service-icon s-emerald"><Calendar size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'स्लॉट बुक' : 'Book Slot'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'मंडी स्लॉट आरक्षण' : 'Procurement slot'}</div>
              </Link>

              {/* 2. Live Queue */}
              <Link to="/farmer/queue" className="m-service-box">
                <div className="m-service-icon s-amber"><Radio size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'लाइव कतार' : 'Live Queue'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'टोकन व काउंटर' : 'Real-time token'}</div>
              </Link>

              {/* 3. Payment Status */}
              <Link to="/farmer/payment" className="m-service-box">
                <div className="m-service-icon s-green"><Coins size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'डीबीटी स्थिति' : 'Payment (DBT)'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'बैंक खाता ट्रांसफर' : 'MSP bank transfer'}</div>
              </Link>

              {/* 4. Find Centre */}
              <Link to="/centers" className="m-service-box">
                <div className="m-service-icon s-rose"><MapPin size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'खरीद केंद्र' : 'Find Centre'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'मंडी व साइलो' : 'APMC & Silo'}</div>
              </Link>

              {/* 5. J-Form Download */}
              <Link to="/farmer/qr-pass" className="m-service-box">
                <div className="m-service-icon s-purple"><FileText size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'डिजिटल जे-फॉर्म' : 'J-Form Pass'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'रसीद व गेट पास' : 'Receipt & Pass'}</div>
              </Link>

              {/* 6. Farmer Profile */}
              <Link to="/farmer/dashboard" className="m-service-box">
                <div className="m-service-icon s-blue"><User size={20} /></div>
                <div className="m-service-name">{lang === 'hi' ? 'डैशबोर्ड' : 'My Profile'}</div>
                <div className="m-service-desc">{lang === 'hi' ? 'खाता व इतिहास' : 'Records & History'}</div>
              </Link>

            </div>
          </div>
        </section>

        {/* ==========================================
            5. LIVE QUEUE MONITOR (Dedicated Mobile Dashboard)
        ========================================== */}
        <section className="m-section m-queue-section" aria-label="Real-time Mandi Queue">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'रियल-टाइम' : 'REAL-TIME QUEUE'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'मंडी जाने से पहले कतार जानें' : 'Live Queue Monitor'}</h2>
            </div>

            <div className="m-queue-card">
              <div className="m-queue-card-top">
                <div className="m-queue-loc">
                  <MapPin size={15} color="#059669" />
                  <span>{centreName}</span>
                </div>
                <span className="m-queue-sync-badge">
                  <Zap size={12} />
                  <span>धर्मकांटा सिंक</span>
                </span>
              </div>

              <div className="m-queue-metrics-row">
                <div className="m-queue-metric-box highlight">
                  <span className="m-q-lbl">{lang === 'hi' ? 'वर्तमान सेवा' : 'Now Serving'}</span>
                  <span className="m-q-val">{servingToken}</span>
                  <span className="m-q-sub">{myCounter}</span>
                </div>

                <div className="m-queue-metric-box">
                  <span className="m-q-lbl">{lang === 'hi' ? 'आपका टोकन' : 'Your Token'}</span>
                  <span className="m-q-val q-blue">{myToken}</span>
                  <span className="m-q-sub">{lang === 'hi' ? 'सत्यापित' : 'Confirmed'}</span>
                </div>
              </div>

              <div className="m-queue-submetrics">
                <div className="m-submetric">
                  <Clock size={14} color="#d97706" />
                  <span>{lang === 'hi' ? `आगे किसान: ${farmersAhead}` : `Ahead: ${farmersAhead} farmers`}</span>
                </div>
                <div className="m-submetric">
                  <Clock size={14} color="#059669" />
                  <span>{lang === 'hi' ? `अनुमानित: ~${estimatedWait} min` : `Wait: ~${estimatedWait} min`}</span>
                </div>
                <div className="m-submetric">
                  <ShieldCheck size={14} color="#2563eb" />
                  <span>{lang === 'hi' ? 'गुणवत्ता जांच जारी' : 'Quality Check'}</span>
                </div>
              </div>

              <Link to="/farmer/queue" className="m-queue-full-btn">
                <Radio size={16} />
                <span>{lang === 'hi' ? 'पूर्ण लाइव कतार देखें' : 'View Full Queue Details'}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            6. WHY KISAN KALYAN (Compact 2-Column Cards)
            Transparent Weighing, Live Queue, Digital J-Form, Direct DBT
        ========================================== */}
        <section className="m-section m-why-section" aria-label="Why Choose Kisan Kalyan">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'पारदर्शिता' : 'BENEFITS'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'किसान कल्याण क्यों चुनें?' : 'Why Kisan Kalyan?'}</h2>
            </div>

            <div className="m-why-grid">
              
              {/* 1. Transparent Weighing */}
              <div className="m-why-card">
                <div className="m-why-icon icon-purple"><Scale size={18} /></div>
                <div className="m-why-title">{lang === 'hi' ? 'पारदर्शी तौल' : 'Transparent Weighing'}</div>
                <div className="m-why-text">
                  {lang === 'hi' ? 'कम्प्यूटरीकृत धर्मकांटे पर डिजिटल तौल बिना किसी हेरफेर के।' : 'Electronic weighbridge audit with tamper-proof records.'}
                </div>
              </div>

              {/* 2. Live Queue */}
              <div className="m-why-card">
                <div className="m-why-icon icon-amber"><Radio size={18} /></div>
                <div className="m-why-title">{lang === 'hi' ? 'लाइव कतार' : 'Live Queue Tracking'}</div>
                <div className="m-why-text">
                  {lang === 'hi' ? 'घर बैठे मोबाइल पर टोकन व अनुमानित प्रतीक्षा समय ट्रैक करें।' : 'Check token and serving status before leaving home.'}
                </div>
              </div>

              {/* 3. Digital J-Form */}
              <div className="m-why-card">
                <div className="m-why-icon icon-rose"><FileText size={18} /></div>
                <div className="m-why-title">{lang === 'hi' ? 'डिजिटल जे-फॉर्म' : 'Digital J-Form'}</div>
                <div className="m-why-text">
                  {lang === 'hi' ? 'तौल पूर्ण होते ही अधिकृत रसीद ऑनलाइन डाउनलोड करें।' : 'Instant verified digital receipt with electronic signature.'}
                </div>
              </div>

              {/* 4. Direct DBT */}
              <div className="m-why-card">
                <div className="m-why-icon icon-emerald"><Coins size={18} /></div>
                <div className="m-why-title">{lang === 'hi' ? 'सीधा डीबीटी' : 'Direct DBT Transfer'}</div>
                <div className="m-why-text">
                  {lang === 'hi' ? 'एमएसपी राशि सीधे आधार-लिंक्ड बैंक खाते में सुरक्षित अंतरण।' : 'MSP payment directly to your bank account in 48 hours.'}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
            7. HOW PROCUREMENT WORKS (Compact Connected Timeline)
            01 Book Slot -> 02 Reach Centre -> 03 Weighing -> 04 J-Form -> 05 DBT
        ========================================== */}
        <section className="m-section m-how-section" aria-label="Step-by-Step Process">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'प्रक्रिया' : 'WORKFLOW'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'खरीद प्रक्रिया कैसे काम करती है?' : 'How It Works'}</h2>
            </div>

            <div className="m-timeline-list">
              
              {/* Step 1 */}
              <div className="m-timeline-item">
                <div className="m-timeline-badge">01</div>
                <div className="m-timeline-body">
                  <h3 className="m-timeline-title">{lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Slot'}</h3>
                  <p className="m-timeline-desc">
                    {lang === 'hi' ? 'फसल, मात्रा व नजदीकी मंडी चुनकर तारीख आरक्षित करें।' : 'Select crop, mandi centre and convenient time.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="m-timeline-item">
                <div className="m-timeline-badge b-amber">02</div>
                <div className="m-timeline-body">
                  <h3 className="m-timeline-title">{lang === 'hi' ? 'केंद्र पर पहुंचें' : 'Reach Centre'}</h3>
                  <p className="m-timeline-desc">
                    {lang === 'hi' ? 'प्रवेश द्वार पर मोबाइल क्यूआर स्कैन कराकर आगमन दर्ज कराएं।' : 'Scan digital QR gate pass upon arriving at mandi.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="m-timeline-item">
                <div className="m-timeline-badge b-blue">03</div>
                <div className="m-timeline-body">
                  <h3 className="m-timeline-title">{lang === 'hi' ? 'गुणवत्ता व तौल' : 'Weighing & Verification'}</h3>
                  <p className="m-timeline-desc">
                    {lang === 'hi' ? 'नमी परीक्षण और कम्प्यूटरीकृत कांटे पर पारदर्शी तौल कराएं।' : 'Quality assessment and electronic scale audit.'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="m-timeline-item">
                <div className="m-timeline-badge b-purple">04</div>
                <div className="m-timeline-body">
                  <h3 className="m-timeline-title">{lang === 'hi' ? 'जे-फॉर्म प्राप्त करें' : 'Digital J-Form'}</h3>
                  <p className="m-timeline-desc">
                    {lang === 'hi' ? 'तौल रसीद व अधिकृत जे-फॉर्म तुरंत ऑनलाइन प्राप्त करें।' : 'Official procurement receipt issued immediately.'}
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="m-timeline-item">
                <div className="m-timeline-badge b-green">05</div>
                <div className="m-timeline-body">
                  <h3 className="m-timeline-title">{lang === 'hi' ? 'सीधा डीबीटी भुगतान' : 'Direct DBT'}</h3>
                  <p className="m-timeline-desc">
                    {lang === 'hi' ? 'एमएसपी राशि सीधे अपने बैंक खाते में प्राप्त करें।' : 'Direct MSP payment transferred to bank account.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
            8. NEAREST CENTRES (Mobile Scan-Friendly Cards)
        ========================================== */}
        <section className="m-section m-centres-section" aria-label="Nearest Procurement Centres">
          <div className="m-container">
            <div className="m-section-header">
              <span className="m-section-kicker">{lang === 'hi' ? 'उपार्जन केंद्र' : 'CENTRES'}</span>
              <h2 className="m-section-title">{lang === 'hi' ? 'नजदीकी खरीद केंद्र' : 'Nearest Centres'}</h2>
            </div>

            {/* Quick District Filter Chips */}
            <div className="m-district-scroll-row">
              {districts.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDistrict(d)}
                  className={`m-district-chip ${selectedDistrict === d ? 'active' : ''}`}
                >
                  {d === 'All' ? (lang === 'hi' ? 'सभी जिले' : 'All') : d}
                </button>
              ))}
            </div>

            {/* Centres List */}
            <div className="m-centres-list">
              {filteredCentres.map((centre) => (
                <div key={centre.id} className="m-centre-item">
                  <div className="m-centre-header">
                    <div>
                      <h3 className="m-centre-name">{centre.name}</h3>
                      <div className="m-centre-dist">
                        <MapPin size={13} color="#059669" />
                        <span>{centre.distance} • {centre.location}</span>
                      </div>
                    </div>
                    <span className={`m-centre-badge ${centre.status.toLowerCase()}`}>
                      {centre.statusLabel}
                    </span>
                  </div>

                  <div className="m-centre-tags-bar">
                    <span className="m-ctag">🌾 {centre.commodities}</span>
                    <span className="m-ctag">⏳ कतार: {centre.currentQueue} ({centre.waitTime})</span>
                  </div>

                  <div className="m-centre-actions">
                    <Link to="/farmer/book-slot" className="m-centre-btn-book">
                      {lang === 'hi' ? 'स्लॉट बुक करें' : 'Book Slot'}
                    </Link>
                    <Link to="/farmer/queue" className="m-centre-btn-queue">
                      {lang === 'hi' ? 'कतार देखें' : 'View Queue'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/centers" className="m-all-centres-link">
                <span>{lang === 'hi' ? 'सभी सरकारी केंद्र देखें' : 'View All Procurement Centres'}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            9. HELP & DIRECT HELPLINE CTA STRIP
        ========================================== */}
        <section className="m-section m-help-cta-section" aria-label="Help and Helpline">
          <div className="m-container">
            <div className="m-help-banner">
              <div className="m-help-info">
                <div className="m-help-badge">{lang === 'hi' ? 'निशुल्क सहायता' : 'TOLL FREE HELPLINE'}</div>
                <div className="m-help-title">{lang === 'hi' ? 'किसान सहायता केंद्र' : 'Kisan Farmer Helpline'}</div>
                <div className="m-help-hours">{lang === 'hi' ? 'प्रातः 06:00 से रात्रि 10:00 तक' : '06:00 AM – 10:00 PM (Daily)'}</div>
              </div>

              <a href="tel:18001801551" className="m-help-call-btn">
                <PhoneCall size={20} />
                <span>1800-180-1551</span>
              </a>

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <Link to="/help" className="m-help-faq-link">
                  {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'FAQ & Knowledge Base'} →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div> {/* End .mobile-landing-content */}

    </div>
  );
}
