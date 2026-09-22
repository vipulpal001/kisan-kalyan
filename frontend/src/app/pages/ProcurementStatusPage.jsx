import React, { useState, useEffect } from 'react';
import {
  Check,
  Clock,
  FileText,
  Download,
  Scale,
  Truck,
  Award,
  Droplets,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Wallet,
  Coins,
  FileCheck,
  RefreshCw,
  Printer,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from "../../services/api";
import { useWebSocketSubscription } from "../../hooks/useWebSocket";
import wheatBadge from "../../assets/wheat_badge.png";
import mandiSignature from "../../assets/mandi_signature.png";
import annadataSketch from "../../assets/annadata_sketch.png";
import tractorField from "../../assets/tractor_field.png";

export default function ProcurementStatusPage() {
  const [data, setData] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJFormModal, setShowJFormModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      const res = await api.get('/farmer/dashboard-summary');
      setData(res.data);
      if (res.data?.activeBooking && !selectedBookingId) {
        setSelectedBookingId(res.data.activeBooking.bookingId);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching procurement status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Subscribe to real-time queue and booking events
  useWebSocketSubscription('/topic/queue', () => {
    fetchData();
  });

  useWebSocketSubscription('/topic/bookings', () => {
    fetchData();
  });

  useWebSocketSubscription('/topic/notifications', () => {
    fetchData();
  });

  // If user selects another booking from dropdown
  useEffect(() => {
    if (selectedBookingId && data?.activeBooking?.bookingId !== selectedBookingId) {
      api.get(`/farmer/bookings/${selectedBookingId}/details`)
        .then(res => setDetailData(res.data))
        .catch(err => console.error(err));
    } else {
      setDetailData(null);
    }
  }, [selectedBookingId, data]);

  if (loading) {
    return (
      <div className="portal-container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 700 }}>
          🔄 डेटा लोड हो रहा है... (Loading Procurement Tracking...)
        </div>
      </div>
    );
  }

  const booking = detailData ? detailData.booking : (data?.activeBooking || (data?.allBookings && data.allBookings[0]));
  const entry = detailData ? detailData.procurementEntry : data?.procurementEntry;
  const jForm = detailData ? detailData.jForm : data?.jForm;
  const payment = detailData ? detailData.payment : data?.payment;
  const allBookings = data?.allBookings || [];

  if (!booking) {
    return (
      <div className="portal-container" style={{ padding: '80px 16px', textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
          <img src={wheatBadge} alt="Wheat" style={{ width: '70px', height: '70px', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#064e3b', marginBottom: '8px' }}>
            कोई सक्रिय स्लॉट बुकिंग नहीं मिली
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            फसल खरीद प्रक्रिया ट्रैक करने के लिए कृपया पहले अपने नजदीकी उपार्जन केंद्र पर स्लॉट आरक्षित करें।
          </p>
          <Link
            to="/farmer/book-slot"
            style={{
              background: '#017953',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-block'
            }}
          >
            🌾 नया स्लॉट आरक्षित करें
          </Link>
        </div>
      </div>
    );
  }

  // Determine the 8 steps progress
  // Step 1: BOOKED (Confirmed)
  // Step 2: ARRIVED (Gate entry)
  // Step 3: CALLED (Token called)
  // Step 4: PROCESSING (QC in progress)
  // Step 5: Moisture & QC passed
  // Step 6: Weighbridge gross/tare weighed
  // Step 7: Completed / J-Form issued
  // Step 8: Payment DBT

  const isStep1Done = true;
  const isStep2Done = booking.bookingStatus !== 'BOOKED' || booking.tokenNumber !== null;
  const isStep3Done = isStep2Done && (booking.bookingStatus === 'PROCESSING' || booking.bookingStatus === 'COMPLETED' || entry !== null);
  const isStep4Done = isStep3Done;
  const isStep5Done = entry !== null && (entry.qciStatus === 'PASSED' || entry.moisturePercentage != null);
  const isStep6Done = entry !== null && entry.netWeightKg != null && Number(entry.netWeightKg) > 0;
  const isStep7Done = jForm !== null || booking.bookingStatus === 'COMPLETED';
  const isStep8Done = payment !== null && (payment.paymentStatus === 'COMPLETED' || payment.paymentStatus === 'PROCESSING');

  // Compute active step (1 to 8)
  let currentStep = 1;
  if (isStep8Done) currentStep = 8;
  else if (isStep7Done) currentStep = 7;
  else if (isStep6Done) currentStep = 6;
  else if (isStep5Done) currentStep = 5;
  else if (isStep4Done) currentStep = 4;
  else if (isStep3Done) currentStep = 3;
  else if (isStep2Done) currentStep = 2;

  // Weights and calculations
  const grossKg = entry?.grossWeightKg ? Number(entry.grossWeightKg).toLocaleString() : '—';
  const tareKg = entry?.tareWeightKg ? Number(entry.tareWeightKg).toLocaleString() : '—';
  const netKg = entry?.netWeightKg ? Number(entry.netWeightKg).toLocaleString() : '—';
  const actualQuintals = entry?.actualQuantityQuintals ? Number(entry.actualQuantityQuintals) : (Number(booking.estimatedQuantity) || 0);
  const mspRate = booking.mspRate ? Number(booking.mspRate) : (entry?.mspRate ? Number(entry.mspRate) : 0);
  const earnedAmount = entry?.totalAmount ? Number(entry.totalAmount) : (actualQuintals * mspRate);
  const moistureVal = entry?.moisturePercentage ? Number(entry.moisturePercentage) : '—';
  const qualityGradeVal = entry?.qualityGrade || '—';

  const steps = [
    { num: 1, title: 'स्लॉट कन्फर्म', sub: 'स्लॉट और टोकन सुरक्षित', done: isStep1Done, active: currentStep === 1 },
    { num: 2, title: 'केंद्र आगमन', sub: 'उपार्जन केंद्र गेट पर प्रवेश', done: isStep2Done, active: currentStep === 2 },
    { num: 3, title: 'टोकन पुकारा गया', sub: 'काउंटर पर टोकन कॉल', done: isStep3Done, active: currentStep === 3 },
    { num: 4, title: 'प्रक्रिया प्रारंभ', sub: 'कागजात व ग्रेड जांच', done: isStep4Done, active: currentStep === 4 },
    { num: 5, title: 'गुणवत्ता व नमी जांच', sub: `नमी (${moistureVal}%) व ग्रेडिंग`, done: isStep5Done, active: currentStep === 5 },
    { num: 6, title: 'वेज्रिज तौल', sub: 'सकल एवं खाली वजन मापन', done: isStep6Done, active: currentStep === 6 },
    { num: 7, title: 'J-Form जारी', sub: 'डिजिटल रसीद व स्वीकृति', done: isStep7Done, active: currentStep === 7 },
    { num: 8, title: 'DBT भुगतान', sub: 'खाते में हस्तांतरण', done: isStep8Done, active: currentStep === 8 }
  ];

  return (
    <div style={{
      background: 'transparent',
      minHeight: 'calc(100vh - 110px)',
      padding: '24px 0 50px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>

        {/* Multi-booking switcher if farmer has > 1 booking */}
        {allBookings.length > 1 && (
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '10px 18px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.84rem', color: '#374151', fontWeight: 700 }}>
              🌾 आपकी बुकिंग्स ({allBookings.length}):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allBookings.map(b => (
                <button
                  key={b.bookingId}
                  onClick={() => setSelectedBookingId(b.bookingId)}
                  style={{
                    background: (selectedBookingId === b.bookingId) ? '#017953' : '#f1f5f9',
                    color: (selectedBookingId === b.bookingId) ? '#ffffff' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {b.tokenNumber || b.bookingReference} ({b.produceName})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= 1. TOP 8-STEP PROCUREMENT TRACKING CARD ================= */}
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 30px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: '20px' }}>

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src={wheatBadge} alt="Wheat Badge" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    ✓ वास्तविक समय खरीद ट्रैकिंग
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#f8fafc', color: '#64748b', padding: '2px 6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    संदर्भ: {booking.bookingReference}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  फसल खरीद प्रक्रिया स्थिति ({currentStep}/8 चरण)
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  टोकन: <strong>{booking.tokenNumber || 'जारी होने वाला है'}</strong> | {booking.produceName} @ {booking.centerName || 'उपार्जन केंद्र'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.76rem',
                background: isStep7Done ? '#ecfdf5' : '#fefce8',
                border: isStep7Done ? '1px solid #a7f3d0' : '1px solid #fef08a',
                color: isStep7Done ? '#047857' : '#854d0e',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: 700
              }}>
                ● {isStep7Done ? 'खरीद पूर्ण' : (isStep3Done ? 'प्रक्रिया प्रारंभ' : 'आगमन का इंतजार')}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                📅 स्लॉट: <strong>{booking.slotDate || new Date().toISOString().slice(0, 10)}</strong>
              </span>
              <button
                onClick={() => setShowJFormModal(true)}
                style={{
                  background: '#017953',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={15} /> <span>रसीद / J-Form देखें</span>
              </button>
            </div>
          </div>

          {/* 8-Step Progress Stepper Timeline */}
          <div style={{ position: 'relative', margin: '26px 0 14px 0' }}>
            {/* Background Connecting Bar */}
            <div style={{ position: 'absolute', top: '15px', left: '30px', right: '30px', height: '4px', background: '#e2e8f0', zIndex: 1, borderRadius: '2px' }}></div>
            {/* Active green progress */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '30px',
              width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 7) * 100))}%`,
              height: '4px',
              background: '#017953',
              zIndex: 1,
              borderRadius: '2px',
              transition: 'width 0.4s ease'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {steps.map((s) => (
                <div key={s.num} style={{ textAlign: 'center', flex: 1, padding: '0 4px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: s.done ? '#017953' : (s.active ? '#017953' : '#ffffff'),
                    border: s.done || s.active ? 'none' : '2px solid #cbd5e1',
                    color: s.done || s.active ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    margin: '0 auto 6px auto',
                    boxShadow: s.active ? '0 0 0 4px #bbf7d0' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {s.done ? <Check size={16} strokeWidth={3} /> : s.num}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: s.active ? 800 : (s.done ? 700 : 600), color: s.active ? '#017953' : (s.done ? '#064e3b' : '#64748b'), lineHeight: 1.2 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.15 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              लाइव सिंक सक्रिय (WebSocket Connected) • अंतिम अपडेट: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchData}
              style={{ background: 'none', border: 'none', color: '#017953', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> रिफ्रेश करें
            </button>
          </div>

        </div>

        {/* ================= 2. MIDDLE BOX: WEIGHING & AMOUNT SUMMARY ================= */}
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> <span>अंतिम तौल एवं भुगतान विवरण</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'center' }}>

            {/* 4 Metric Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>

              {/* Gross */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>कुल वजन (Gross)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  {grossKg} {grossKg !== '—' ? 'kg' : ''}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>सकल वजन</span>
              </div>

              {/* Tare */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>खाली वाहन (Tare)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  {tareKg} {tareKg !== '—' ? 'kg' : ''}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>वाहन का वजन</span>
              </div>

              {/* Net */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#017953', fontWeight: 700 }}>शुद्ध वजन (Net)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#017953', margin: '4px 0 2px 0' }}>
                  {actualQuintals} Q
                </div>
                <span style={{ fontSize: '0.68rem', color: '#065f46' }}>{netKg !== '—' ? `${netKg} kg` : 'अनुमानित मात्रा'}</span>
              </div>

              {/* MSP Rate */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>एमएसपी दर (MSP)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  ₹{mspRate.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>प्रति क्विंटल</span>
              </div>

            </div>

            {/* Big Green Earned Amount Box */}
            <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>
                  आपकी अर्जित राशि
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#017953', margin: '4px 0' }}>
                  ₹{Math.round(earnedAmount).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                  ({actualQuintals} क्विंटल × ₹{mspRate})
                </div>
                <div style={{ fontSize: '0.74rem', color: '#017953', fontWeight: 700, marginTop: '4px' }}>
                  ✓ DBT द्वारा आधार-लिंक्ड बैंक खाते में
                </div>
              </div>

              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={30} />
              </div>
            </div>

          </div>

        </div>

        {/* ================= 3. LOWER GRID: QUALITY + WEIGHBRIDGE RECEIPT + PAYMENT + DOCS ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>

          {/* Quality Verification */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔬</span> <span>गुणवत्ता परीक्षण (Quality Verification)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isStep5Done ? '#ecfdf5' : '#f8fafc', border: isStep5Done ? '1px solid #a7f3d0' : '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isStep5Done ? '#017953' : '#94a3b8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: isStep5Done ? '#065f46' : '#475569' }}>
                  {isStep5Done ? 'QCI Verified (प्रमाणित)' : 'गुणवत्ता परीक्षण प्रक्रियाधीन'}
                </strong>
                <div style={{ fontSize: '0.76rem', color: isStep5Done ? '#047857' : '#64748b' }}>
                  {isStep5Done ? 'यह फसल गुणवत्ता मानकों पर खरी उतरी है' : 'धर्मकांटे पर आगमन उपरांत जांच की जाएगी'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#1e40af' }}>💧 नमी (Moisture)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', margin: '2px 0' }}>
                  {moistureVal}{moistureVal !== '—' ? '%' : ''}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#3b82f6' }}>अनुमत मानक सीमा: ≤ 12.0%</span>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#166534' }}>🌱 FAQ ग्रेड</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#017953', margin: '2px 0' }}>
                  {qualityGradeVal}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#059669' }}>उत्तम गुणवत्ता स्वीकृत</span>
              </div>
            </div>
          </div>

          {/* Digital Weighbridge Receipt */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📄</span> <span>डिजिटल तौल रसीद (Weighbridge Receipt)</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '6px' }}>
                <QRCodeSVG
                  value={booking.qrCodeToken || `KK-REF:${booking.bookingReference || 'KK-2026'}-BID:${booking.bookingId || 1}`}
                  size={85}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>तौल संदर्भ आईडी</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#111827' }}>
                  {booking.bookingReference}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  केंद्र: <strong>{booking.centerName}</strong>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: isStep6Done ? '#ecfdf5' : '#f1f5f9', color: isStep6Done ? '#017953' : '#64748b', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginTop: '6px' }}>
                  <Check size={12} strokeWidth={3} /> {isStep6Done ? 'तौल सत्यापित (Weighed)' : 'तौल प्रतीक्षित'}
                </div>
              </div>

              {/* Mandi Signature */}
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', paddingLeft: '12px' }}>
                <img src={mandiSignature} alt="Signature" style={{ width: '85px', height: '42px', objectFit: 'contain' }} />
                <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                  डिजिटल हस्ताक्षरित <br /> उपार्जन अधिकारी
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Bar */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>₹</span> <span>भुगतान स्थिति (Payment Status)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '10px' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isStep6Done ? '#017953' : '#94a3b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <strong style={{ fontSize: '0.78rem', color: isStep6Done ? '#017953' : '#64748b' }}>DBT तैयार</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>PFMS अधिकृत</div>
              </div>

              <div style={{ height: '2px', background: isStep7Done ? '#017953' : '#cbd5e1', flex: 1, margin: '0 8px' }}></div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isStep7Done ? '#017953' : '#f1f5f9', border: '1.5px solid #cbd5e1', color: isStep7Done ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', fontSize: '0.74rem' }}>
                  {isStep7Done ? <Check size={14} strokeWidth={3} /> : '2'}
                </div>
                <div style={{ fontSize: '0.78rem', color: isStep7Done ? '#017953' : '#64748b', fontWeight: isStep7Done ? 700 : 500 }}>बैंक को प्रेषित</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{payment?.transactionReference || 'प्रक्रियाधीन'}</div>
              </div>

              <div style={{ height: '2px', background: isStep8Done ? '#017953' : '#cbd5e1', flex: 1, margin: '0 8px' }}></div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isStep8Done ? '#017953' : '#f1f5f9', border: '1.5px solid #cbd5e1', color: isStep8Done ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', fontSize: '0.74rem' }}>
                  {isStep8Done ? <Check size={14} strokeWidth={3} /> : '3'}
                </div>
                <div style={{ fontSize: '0.78rem', color: isStep8Done ? '#017953' : '#64748b', fontWeight: isStep8Done ? 700 : 500 }}>खाते में क्रेडिट</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>सीधे बैंक खाते में</div>
              </div>
            </div>
          </div>

          {/* Documents Box */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📁</span> <span>दस्तावेज़ एवं रसीद (Documents)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setShowJFormModal(true)}
                style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '12px', fontSize: '0.84rem', fontWeight: 700, color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Download size={16} /> <span>J-Form देखें / डाउनलोड</span>
              </button>

              <button
                onClick={() => window.print()}
                style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '12px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <FileText size={16} /> <span>डिजिटल रसीद प्रिंट करें</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* J-Form Modal */}
      {showJFormModal && (
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
            maxWidth: '680px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowJFormModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            {/* Official Mandi Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #059669', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#017953', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                प्रारूप ‘जे’ (नियम 24(1) देखें) / FORM 'J'
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', margin: '8px 0 2px 0' }}>
                कृषि उपज ई-उपार्जन समिति
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                {booking.centerName || 'उपार्जन केंद्र'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div><strong>जे-फॉर्म क्रमांक:</strong> {jForm?.jFormNumber || '—'}</div>
              <div><strong>जारी दिनांक:</strong> {jForm?.issueDate || '—'}</div>
              <div><strong>किसान का नाम:</strong> {booking.farmerName || data?.farmer?.name || '—'}</div>
              <div><strong>ग्राम व जिला:</strong> {data?.farmer?.village || '—'}, {data?.farmer?.district || '—'}</div>
              <div><strong>फसल:</strong> {booking.produceName || '—'}</div>
              <div><strong>टोकन सं.:</strong> {booking.tokenNumber || '—'}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>विवरण</th>
                  <th style={{ padding: '8px' }}>मात्रा (क्विंटल)</th>
                  <th style={{ padding: '8px' }}>एमएसपी दर (₹)</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>कुल देय राशि (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 8px' }}>{booking.produceName} (FAQ Grade A)</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700 }}>{actualQuintals} Q</td>
                  <td style={{ padding: '10px 8px' }}>₹{mspRate}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#017953' }}>
                    ₹{Math.round(earnedAmount).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div>
                {jForm?.signatureData ? (
                  jForm.signatureData.startsWith('<svg') ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: jForm.signatureData }}
                      style={{ width: '120px', height: '42px', display: 'flex', alignItems: 'center' }}
                    />
                  ) : (
                    <img src={jForm.signatureData} alt="Authorized Sign" style={{ width: '120px', height: '42px', objectFit: 'contain' }} />
                  )
                ) : (
                  <img src={mandiSignature} alt="Officer Sign" style={{ width: '100px', height: '40px', objectFit: 'contain' }} />
                )}
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {jForm?.authorizedSignatoryName || `${booking.centerName || 'APMC Mandi'} Secretary`}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>डिजिटल प्राधिकृत हस्ताक्षरकर्ता (Authorized Signatory)</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={16} /> <span>प्रिंट / डाउनलोड</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
