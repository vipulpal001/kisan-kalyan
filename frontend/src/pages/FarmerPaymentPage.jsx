import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  Check, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Wallet,
  Coins,
  Wheat,
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWebSocketSubscription } from '../hooks/useWebSocket';
import dbtCoin from '../assets/dbt_coin.png';
import khetiSketch from '../assets/kheti_sketch.png';
import annadataSketch from '../assets/annadata_sketch.png';

export default function FarmerPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [farmer, setFarmer] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchPaymentData = async () => {
    try {
      const [payRes, profRes, sumRes] = await Promise.allSettled([
        api.get('/farmer/payments'),
        api.get('/farmer/profile'),
        api.get('/farmer/dashboard-summary')
      ]);

      if (payRes.status === 'fulfilled' && Array.isArray(payRes.value.data)) {
        setPayments(payRes.value.data);
      }
      if (profRes.status === 'fulfilled') {
        setFarmer(profRes.value.data);
      }
      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value.data);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  // Real-time WebSocket subscriptions
  useWebSocketSubscription('/topic/notifications', () => {
    fetchPaymentData();
  });

  useWebSocketSubscription('/topic/bookings', () => {
    fetchPaymentData();
  });

  if (loading) {
    return (
      <div className="portal-container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 700 }}>
          🔄 भुगतान विवरण लोड हो रहा है... (Loading DBT Records...)
        </div>
      </div>
    );
  }

  // Calculate totals
  const completedPayments = payments.filter(p => p.paymentStatus === 'COMPLETED');
  const pendingPayments = payments.filter(p => p.paymentStatus === 'PROCESSING' || p.paymentStatus === 'INITIATED');

  let totalCredited = completedPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  let totalPending = pendingPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  // If DB has no completed payments yet, but active booking has earned amount
  if (totalCredited === 0 && summary?.payment) {
    if (summary.payment.paymentStatus === 'COMPLETED') {
      totalCredited = Number(summary.payment.amount) || 0;
    } else {
      totalPending = Number(summary.payment.amount) || 0;
    }
  }

  // Active bank info from authentic backend data
  const bankName = farmer?.bankName || summary?.farmer?.bankName || '—';
  const rawAcct = farmer?.bankAccountNumber || summary?.farmer?.bankAccountNumber || '';
  const maskedAcct = rawAcct ? (rawAcct.length > 4 ? `•••• •••• •••• ${rawAcct.slice(-4)}` : rawAcct) : '—';
  const ifsc = farmer?.ifscCode || summary?.farmer?.ifscCode || '—';

  const totalQuintals = summary?.activeBooking?.estimatedQuantity != null
    ? Number(summary.activeBooking.estimatedQuantity) 
    : null;
  const cropName = summary?.activeBooking?.produceName || null;

  return (
    <div style={{ 
      background: 'transparent', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>

        {/* ================= 1. TOP DBT BANNER ================= */}
        <div style={{ 
          background: 'linear-gradient(90deg, #dcfce7 0%, #ecfdf5 45%, #fefce8 85%, #fef3c7 100%)', 
          border: '1px solid #bbf7d0', 
          borderRadius: '24px', 
          padding: '16px 28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          boxShadow: '0 4px 14px rgba(1, 121, 83, 0.05)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={dbtCoin} alt="DBT Coin" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#017953', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                प्रत्यक्ष लाभ हस्तांतरण (DBT)
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#064e3b', margin: '4px 0 2px 0' }}>
                सीधे बैंक खाते में भुगतान (Direct Benefit Transfer)
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#374151', margin: 0 }}>
                पीएफएमएस (PFMS) प्रणाली द्वारा आधार लिंक खाते में 48-72 घंटे के भीतर सुरक्षित भुगतान
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => alert('किसान सहायता केंद्र: भुगतान संबंधी किसी भी समस्या के लिए टोल-फ्री 1800-180-1551 पर कॉल करें।')}
              style={{ background: '#fefce8', border: '1.5px solid #fef08a', color: '#854d0e', borderRadius: '12px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AlertTriangle size={15} color="#d97706" />
              <span>भुगतान सहायता / शिकायत</span>
            </button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b' }}>
                किसान समृद्ध <br /> भारत समृद्ध
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CONTENT (Left Main | Right Sidebar) ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
          
          {/* Left Column: 3 KPI Cards + Bank Details + Disbursement Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* 3 KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              
              {/* Card 1: Green DBT Credited */}
              <div style={{ background: '#017953', color: '#ffffff', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 8px 24px rgba(1, 121, 83, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                  <Wallet size={16} color="#a7f3d0" />
                  <span>अब तक खाते में जमा (CREDITED VIA DBT)</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff', margin: '8px 0 4px 0' }}>
                  ₹{Math.round(totalCredited).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} color="#34d399" />
                  <span>आधार लिंक बैंक खाते में सफलतापूर्वक हस्तांतरण</span>
                </div>
              </div>

              {/* Card 2: Cream Pending Treasury */}
              <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#854d0e', fontWeight: 600 }}>
                  <Clock size={16} color="#d97706" />
                  <span>प्रक्रियाधीन भुगतान (TREASURY CLEARANCE)</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#b45309', margin: '8px 0 4px 0' }}>
                  ₹{Math.round(totalPending).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>⏱️</span>
                  <span>24 से 48 घंटे में बैंक खाते में क्रेडिट अनुमानित</span>
                </div>
              </div>

              {/* Card 3: Total Procured This Season */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#065f46', fontWeight: 600 }}>
                  <FileText size={16} color="#059669" />
                  <span>कुल खरीद मात्रा (इस सीजन)</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953', margin: '8px 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌾</span> <span>{totalQuintals != null ? `${totalQuintals} ` : '— '}<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{totalQuintals != null ? 'क्विंटल' : ''}</span></span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 600 }}>
                  {cropName || 'फसल विवरण'}
                </div>
              </div>

            </div>

            {/* Registered Aadhaar Seeded Bank Account Box */}
            <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} color="#017953" />
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>पंजीकृत बैंक खाता (Aadhaar Seeded Bank)</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    {bankName} • {maskedAcct}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '2px', display: 'flex', gap: '14px' }}>
                    <span>IFSC: <strong>{ifsc}</strong></span>
                    <span>DBT Status: <strong style={{ color: rawAcct ? '#017953' : '#64748b' }}>{rawAcct ? '● Active (सक्रिय)' : 'अद्यतन नहीं'}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#017953', borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} />
                <span>PFMS प्रमाणित</span>
              </div>
            </div>

            {/* Disbursement Records Table */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="#017953" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    भुगतान इतिहास एवं लेन-देन संदर्भ (Disbursement Records)
                  </h3>
                </div>
                <button 
                  onClick={fetchPaymentData}
                  style={{ background: 'none', border: 'none', color: '#017953', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={14} /> <span>रिफ्रेश</span>
                </button>
              </div>

              {/* Records List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {payments.length === 0 && !summary?.payment && (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                    <Info size={28} color="#64748b" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#374151' }}>
                      अभी तक कोई भुगतान लेन-देन दर्ज नहीं हुआ है
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      उपार्जन केंद्र पर इलेक्ट्रॉनिक तौल पूर्ण होने के तुरंत बाद पीएफएमएस प्रणाली द्वारा DBT भुगतान जारी किया जाएगा।
                    </div>
                    <Link 
                      to="/farmer/procurement-status" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#017953', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, marginTop: '14px' }}
                    >
                      <span>खरीद प्रक्रिया स्थिति देखें</span> <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Display payments from API */}
                {payments.map((p, idx) => {
                  const isCompleted = p.paymentStatus === 'COMPLETED';
                  const dateObj = p.paymentDate ? new Date(p.paymentDate) : new Date();
                  const day = dateObj.getDate().toString().padStart(2, '0');
                  const monthName = dateObj.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });

                  return (
                    <div key={p.paymentId || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', display: 'grid', gridTemplateColumns: '100px 1fr 180px', gap: '16px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{day}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{monthName}</div>
                      </div>

                      <div>
                        <span style={{ 
                          fontSize: '0.74rem', 
                          background: isCompleted ? '#ecfdf5' : '#fefce8', 
                          color: isCompleted ? '#017953' : '#854d0e', 
                          padding: '2px 8px', 
                          borderRadius: '6px', 
                          fontWeight: 700 
                        }}>
                          {isCompleted ? '✓ भुगतान खाते में जमा' : '⏱️ ट्रेजरी में भुगतान प्रक्रिया में'}
                        </span>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0' }}>
                          {cropName ? `${cropName} • ` : ''}{totalQuintals != null ? `${totalQuintals} क्विंटल` : (p.quantityQuintals ? `${p.quantityQuintals} क्विंटल` : 'उपज भुगतान')}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          UTR / संदर्भ संख्या: <strong>{p.transactionReference || 'अभी उपलब्ध नहीं'}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: isCompleted ? '#065f46' : '#854d0e', marginTop: '2px' }}>
                          {isCompleted 
                            ? 'राशि आपके आधार लिंक बैंक खाते में सफलतापूर्वक जमा हो चुकी है।' 
                            : '24-48 घंटे में राशि खाते में भुगतान हेतु पीएफएमएस को प्रेषित।'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{isCompleted ? 'हस्तांतरित राशि' : 'अनुमानित राशि'}</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isCompleted ? '#017953' : '#b45309' }}>
                          ₹{Number(p.amount).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          मोड: {p.paymentMode || 'DBT'}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* If no payments in array, but summary has an active payment */}
                {payments.length === 0 && summary?.payment && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', display: 'grid', gridTemplateColumns: '100px 1fr 180px', gap: '16px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                        {new Date().getDate().toString().padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {new Date().toLocaleDateString('hi-IN', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.74rem', background: '#fefce8', color: '#854d0e', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        ⏱️ ट्रेजरी में भुगतान प्रक्रिया में
                      </span>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0' }}>
                        {cropName ? `${cropName} • ` : ''}{totalQuintals != null ? `${totalQuintals} क्विंटल` : 'उपज भुगतान'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        UTR / संदर्भ संख्या: <strong>{summary.payment.transactionReference || 'अभी उपलब्ध नहीं'}</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#854d0e', marginTop: '2px' }}>
                        पीएफएमएस प्रणाली द्वारा भुगतान प्रक्रियाधीन है।
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>अनुमानित राशि</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309' }}>
                        ₹{Number(summary.payment.amount).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        मोड: DBT
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Actions Card */}
            <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                ⚡ त्वरित सेवाएं
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link 
                  to="/farmer/procurement-status"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', borderRadius: '10px', textDecoration: 'none', color: '#017953', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <span>फसल खरीद स्थिति ट्रैक करें</span>
                  <ChevronRight size={16} />
                </Link>

                <Link 
                  to="/live-queue"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontSize: '0.84rem', fontWeight: 600 }}
                >
                  <span>लाइव टोकन व उपार्जन कतार</span>
                  <ChevronRight size={16} />
                </Link>

                <Link 
                  to="/farmer/book-slot"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontSize: '0.84rem', fontWeight: 600 }}
                >
                  <span>नया स्लॉट आरक्षित करें</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Helpline Card */}
            <div style={{ background: '#064e3b', color: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px rgba(6, 78, 59, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 700 }}>
                <Phone size={16} />
                <span>किसान कॉल सेंटर</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, margin: '8px 0 4px 0' }}>
                1800-180-1551
              </div>
              <div style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
                टोल-फ्री हेल्पलाइन (सुबह 6:00 से रात 10:00 बजे तक)
              </div>
            </div>

            {/* Annadata Card */}
            <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '18px', textAlign: 'center' }}>
              <img src={annadataSketch} alt="Annadata" style={{ width: '90px', height: 'auto', margin: '0 auto 6px auto', display: 'block' }} />
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#017953' }}>
                अन्नदाता सुखी भव:
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                प्रत्येक दाने का सही दाम, सीधे आपके खाते में
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
