import React from 'react';
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
  FileCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import wheatBadge from '../assets/wheat_badge.png';
import mandiSignature from '../assets/mandi_signature.png';
import annadataSketch from '../assets/annadata_sketch.png';
import tractorField from '../assets/tractor_field.png';

export default function ProcurementStatusPage() {
  const { activeBooking } = useBooking();
  const tokenNum = activeBooking?.tokenNumber || 'T-114-30';
  const cropName = activeBooking?.cropName || activeBooking?.produceName || 'गेहूं (Wheat / Gehun)';
  const centerName = activeBooking?.centerName || 'चुनार कृषि उपज मंडी समिति (Chunar APMC)';
  const displayDate = '24 सितम्बर 2026';

  return (
    <div style={{ 
      background: 'transparent', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>

        {/* ================= 1. TOP 8-STEP PROCUREMENT TRACKING CARD ================= */}
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 30px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src={wheatBadge} alt="Wheat Badge" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div>
                <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  ✓ खरीद प्रक्रिया ट्रैकिंग
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  फसल खरीद प्रक्रिया ट्रैकिंग (8 चरण)
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  टोकन: <strong>{tokenNum}</strong> | {cropName} @ {centerName}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.76rem', background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                ● प्रगति पर
              </span>
              <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                📅 दिनांक: <strong>{displayDate}</strong>
              </span>
              <button style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} /> <span>रसीद देखें / डाउनलोड</span>
              </button>
            </div>
          </div>

          {/* 8-Step Progress Stepper Timeline */}
          <div style={{ position: 'relative', margin: '20px 0 10px 0' }}>
            {/* Connecting Bar */}
            <div style={{ position: 'absolute', top: '15px', left: '30px', right: '30px', height: '3px', background: '#e2e8f0', zIndex: 1 }}></div>
            {/* Active green progress up to step 5 */}
            <div style={{ position: 'absolute', top: '15px', left: '30px', width: '56%', height: '3px', background: '#017953', zIndex: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {[
                { num: 1, title: 'स्लॉट कन्फर्म', sub: 'स्लॉट और टोकन सुरक्षित', done: true },
                { num: 2, title: 'केंद्र आगमन', sub: 'मंडी गेट पर वाहन प्रवेश', done: true },
                { num: 3, title: 'टोकन पुकारा गया', sub: 'काउंटर 2 पर टोकन पुकारा गया', done: true },
                { num: 4, title: 'प्रक्रिया प्रारंभ', sub: 'कागजात सत्यापन एवं ग्रेड पास', done: true },
                { num: 5, title: 'गुणवत्ता व नमी जांच', sub: 'नमी माप (10.8%) व ग्रेडिंग', active: true },
                { num: 6, title: 'इलेक्ट्रॉनिक वेज्रिज तौल', sub: 'वजन का मापन व पुष्टि' },
                { num: 7, title: 'खरीद पूर्ण (J-Form जारी)', sub: 'डिजिटल रसीद और J-Form' },
                { num: 8, title: 'भुगतान की प्रक्रिया', sub: 'DBT के माध्यम से' }
              ].map((s) => (
                <div key={s.num} style={{ textAlign: 'center', flex: 1, padding: '0 4px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: s.done ? '#017953' : (s.active ? '#017953' : '#ffffff'), 
                    border: s.done || s.active ? 'none' : '1.5px solid #cbd5e1', 
                    color: s.done || s.active ? '#ffffff' : '#64748b', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.88rem', 
                    margin: '0 auto 6px auto',
                    boxShadow: s.active ? '0 0 0 4px #bbf7d0' : 'none'
                  }}>
                    {s.done ? <Check size={16} strokeWidth={3} /> : s.num}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: s.active ? 800 : 600, color: s.active ? '#017953' : (s.done ? '#064e3b' : '#64748b'), lineHeight: 1.2 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.15 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
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
                  42,350 kg
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>कुल तौला गया वजन</span>
              </div>

              {/* Tare */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>खाली वाहन वजन (Tare)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  12,200 kg
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>वाहन का खाली वजन</span>
              </div>

              {/* Net */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#017953', fontWeight: 700 }}>शुद्ध वजन (Net)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#017953', margin: '4px 0 2px 0' }}>
                  50 Quintals
                </div>
                <span style={{ fontSize: '0.68rem', color: '#065f46' }}>विक्रय योग्य वजन</span>
              </div>

              {/* MSP Rate */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>एमएसपी दर (MSP)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: '4px 0 2px 0' }}>
                  ₹2,275
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>प्रति क्विंटल</span>
              </div>

            </div>

            {/* Big Green Earned Amount Box */}
            <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', borderRadius: '18px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>
                    अनुमानित खरीद मूल्य (Estimated Procurement Value)
                  </span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#017953', margin: '4px 0' }}>
                    ₹1,13,750
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                    (50 क्विंटल × ₹2,275 MSP)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#017953', fontWeight: 700, marginTop: '4px' }}>
                    ✓ DBT द्वारा सीधे बैंक खाते में भुगतान
                  </div>
                </div>

                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Wallet size={30} />
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#047857', borderTop: '1px dashed #a7f3d0', paddingTop: '8px', marginTop: '4px', lineHeight: 1.35 }}>
                ℹ️ <strong>नोट:</strong> अंतिम भुगतान वास्तविक स्वीकृत मात्रा और लागू गुणवत्ता मूल्यांकन (Moisture & Grade) के आधार पर निर्धारित किया जाएगा।
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#065f46' }}>QCI Verified</strong>
                <div style={{ fontSize: '0.76rem', color: '#047857' }}>यह फसल गुणवत्ता मानकों पर खरी उतरी है</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#1e40af' }}>💧 नमी (Moisture)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', margin: '2px 0' }}>10.8%</div>
                <span style={{ fontSize: '0.68rem', color: '#3b82f6' }}>अनुमत सीमा के अंदर</span>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#166534' }}>🌱 FAQ ग्रेड</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#017953', margin: '2px 0' }}>Grade A</div>
                <span style={{ fontSize: '0.68rem', color: '#059669' }}>उत्तम गुणवत्ता</span>
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
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BK-2026-0915-0012`}
                  alt="Receipt QR" 
                  style={{ width: '85px', height: '85px', display: 'block' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>वेब्रिज आईडी</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#111827' }}>BK-2026-0924-0012</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  तौल दिनांक एवं समय: <strong>24 सितम्बर 2026, 12:45 PM</strong>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginTop: '6px' }}>
                  <Check size={12} strokeWidth={3} /> Verified
                </div>
              </div>

              {/* Mandi Signature */}
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', paddingLeft: '12px' }}>
                <img src={mandiSignature} alt="Signature" style={{ width: '85px', height: '42px', objectFit: 'contain' }} />
                <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                  डिजिटल हस्ताक्षरित <br /> मंडी अधिकारी
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
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <strong style={{ fontSize: '0.78rem', color: '#017953' }}>DBT लंबित</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>(भुगतान प्रक्रिया में)</div>
              </div>

              <div style={{ height: '2px', background: '#cbd5e1', flex: 1, margin: '0 8px' }}></div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', fontSize: '0.74rem' }}>
                  2
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>प्रसंस्करण में</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>(बैंक को भेजा गया)</div>
              </div>

              <div style={{ height: '2px', background: '#cbd5e1', flex: 1, margin: '0 8px' }}></div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', fontSize: '0.74rem' }}>
                  3
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>भुगतान पूर्ण</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>(आपके खाते में)</div>
              </div>
            </div>
          </div>

          {/* Documents Box */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📁</span> <span>दस्तावेज़ (Documents)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => window.print()}
                style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '12px', fontSize: '0.84rem', fontWeight: 700, color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Download size={16} /> <span>J-Form डाउनलोड करें</span>
              </button>

              <button 
                onClick={() => window.print()}
                style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '12px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <FileText size={16} /> <span>डिजिटल रसीद डाउनलोड करें</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
