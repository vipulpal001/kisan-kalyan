import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Wallet, 
  Clock, 
  Check, 
  AlertTriangle, 
  ExternalLink 
} from 'lucide-react';
import dbtCoin from '../assets/dbt_coin.png';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerPaymentPage() {
  const { t } = useLanguage();

  return (
    <div style={{ 
      background: 'transparent', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>

        {/* ================= 1. TOP DBT BANNER ================= */}
        <div className="payment-top-banner" style={{ 
          background: 'linear-gradient(90deg, #dcfce7 0%, #ecfdf5 45%, #fefce8 85%, #fef3c7 100%)', 
          border: '1px solid #bbf7d0', 
          borderRadius: '24px', 
          padding: '16px 28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          boxShadow: '0 4px 14px rgba(1, 121, 83, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={dbtCoin} alt="DBT Coin" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#017953', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                {t('dbtBadge', 'प्रत्यक्ष लाभ हस्तांतरण (DBT)')}
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#064e3b', margin: '4px 0 2px 0' }}>
                {t('dbtBannerTitle', 'सीधे बैंक खाते में भुगतान (DBT)')}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#374151', margin: 0 }}>
                {t('dbtBannerSub', 'पीएफएमएस (PFMS) प्रणाली द्वारा आधार लिंक खाते में सुरक्षित भुगतान')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button style={{ background: '#fefce8', border: '1.5px solid #fef08a', color: '#854d0e', borderRadius: '12px', padding: '8px 16px', minHeight: '44px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="#d97706" />
              <span>{t('reportPaymentIssue', 'भुगतान में समस्या की शिकायत करें')}</span>
            </button>
            <div className="hero-banner-quote" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b' }}>
                {t('sloganTop', 'समृद्ध किसान')} <br /> {t('sloganBottom', 'समृद्ध भारत')}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CONTENT (Left Main | Right Sidebar) ================= */}
        <div className="payment-main-grid">
          
          {/* Left Column: 3 KPI Cards + Bank Details + Disbursement Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
            
            {/* 3 KPI Cards Grid */}
            <div className="payment-kpi-grid">
              
              {/* Card 1: Green DBT Credited */}
              <div style={{ background: '#017953', color: '#ffffff', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 8px 24px rgba(1, 121, 83, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                  <Wallet size={16} color="#a7f3d0" />
                  <span>{t('totalCreditedDbt', 'अब तक आपके खाते में भुगतान (CREDITED VIA DBT)')}</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff', margin: '8px 0 4px 0', whiteSpace: 'nowrap' }}>
                  ₹1,19,437.50
                </div>
                <div style={{ fontSize: '0.72rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} color="#34d399" />
                  <span>{t('transferredSuccessAadhaar', 'आधार लिंक बैंक खाते में सफलतापूर्वक हस्तांतरण')}</span>
                </div>
              </div>

              {/* Card 2: Cream Pending Treasury */}
              <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#854d0e', fontWeight: 600 }}>
                  <Clock size={16} color="#d97706" />
                  <span>{t('treasuryInProgress', 'प्रक्रियाधीन भुगतान (TREASURY CLEARANCE IN PROGRESS)')}</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#b45309', margin: '8px 0 4px 0', whiteSpace: 'nowrap' }}>
                  ₹14,78,750
                </div>
                <div style={{ fontSize: '0.72rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>⏱️</span>
                  <span>{t('creditEstimatedHours', '24 से 48 घंटे में बैंक खाते में क्रेडिट अनुमानित')}</span>
                </div>
              </div>

              {/* Card 3: Total Procured This Season */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#065f46', fontWeight: 600 }}>
                  <FileText size={16} color="#059669" />
                  <span>{t('totalProcuredSeason', 'कुल खरीद (इस सीजन)')}</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953', margin: '8px 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌾</span> <span>52.5 <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t('quintal', 'Quintals')}</span></span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 600 }}>
                  {t('cropWheat', 'गेहूं (Wheat)')}
                </div>
              </div>

            </div>

            {/* Registered Aadhaar Seeded Bank Account Box */}
            <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} color="#017953" />
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{t('registeredBankAccount', 'पंजीकृत बैंक खाता (Aadhaar Seeded Bank)')}</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    State Bank of India •••• •••• •••• 4821
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '2px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                    <span>IFSC: <strong>SBIN0001234</strong></span>
                    <span>DBT Status: <strong style={{ color: '#017953' }}>● {t('statusActive', 'Active')}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#017953', borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} />
                <span>{t('pfmsCertified', 'PFMS प्रमाणित')}</span>
              </div>
            </div>

            {/* Disbursement Records Table */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="#017953" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {t('disbursementRecordsTitle', 'भुगतान इतिहास एवं लेन-देन संदर्भ (Disbursement Records)')}
                  </h3>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#017953', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{t('viewAll', 'सभी देखें')}</span> <ArrowRight size={14} />
                </button>
              </div>

              {/* Records List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Record 1: Completed */}
                <div className="payment-disbursement-row" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', alignItems: 'center' }}>
                  <div className="disbursement-date-cell" style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>05</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Sep 2026</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      ✓ {t('paymentCreditedSuccess', 'भुगतान खाते में जमा हो गया')}
                    </span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0' }}>
                      {t('cropWheat', 'Wheat (गेहूं)')} • 52.5 {t('quintal', 'Quintals')}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      UTR: <strong>PFMS-2026-981244819</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#065f46', marginTop: '2px' }}>
                      {t('transferredSuccessAadhaar', 'राशि आपके आधार लिंक बैंक खाते में सफलतापूर्वक जमा हो चुकी है।')}
                    </div>
                  </div>

                  <div className="disbursement-amount-cell" style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('transferredAmount', 'हस्तांतरित राशि')}</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#017953', whiteSpace: 'nowrap' }}>
                      ₹1,19,437.50
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      @ ₹2275/{t('quintal', 'क्विंटल')}
                    </div>
                  </div>
                </div>

                {/* Record 2: In Treasury Process */}
                <div className="payment-disbursement-row" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', alignItems: 'center' }}>
                  <div className="disbursement-date-cell" style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>06</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Sep 2026</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.74rem', background: '#fefce8', color: '#854d0e', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      ⏱️ {t('inTreasuryProcessing', 'ट्रेजरी में भुगतान प्रक्रिया में')}
                    </span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0' }}>
                      {t('cropWheat', 'Wheat (गेहूं)')} • 325 {t('quintal', 'Quintals')}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      UTR: <strong>PFMS-2026-68682770</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#854d0e', marginTop: '2px' }}>
                      {t('disbursementSentPfms', '24-48 घंटे में राशि खाते में भुगतान हेतु पीएफएमएस को प्रेषित।')}
                    </div>
                  </div>

                  <div className="disbursement-amount-cell" style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('estimatedAmount', 'अनुमानित राशि')}</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309', whiteSpace: 'nowrap' }}>
                      ₹7,39,375.00
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      @ ₹2275/{t('quintal', 'क्विंटल')}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Sidebar: Quick Actions + Helpline + Annadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Actions Card */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🏛️</span> <span>{t('quickActions', 'त्वरित कार्य')}</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}>
                  <FileText size={16} color="#017953" />
                  <span>{t('checkPaymentStatus', 'भुगतान स्थिति जांचें')}</span>
                </button>
                <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}>
                  <AlertTriangle size={16} color="#d97706" />
                  <span>{t('registerGrievance', 'शिकायत दर्ज करें')}</span>
                </button>
                <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}>
                  <Building2 size={16} color="#2563eb" />
                  <span>{t('updateBankDetails', 'बैंक विवरण अपडेट करें')}</span>
                </button>
                <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}>
                  <ExternalLink size={16} color="#059669" />
                  <span>{t('viewPfmsStatus', 'PFMS स्थिति देखें')}</span>
                </button>
              </div>
            </div>

            {/* Helpline Card */}
            <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '20px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#064e3b' }}>
                {t('needHelp', 'सहायता चाहिए?')}
              </div>
              <p style={{ fontSize: '0.74rem', color: '#065f46', margin: '4px 0 12px 0' }}>
                {t('helpContactSub', 'भुगतान या DBT से जुड़ी किसी भी समस्या के लिए संपर्क करें')}
              </p>
              <div style={{ background: '#017953', color: '#ffffff', borderRadius: '12px', padding: '10px 14px', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span>{t('tollFreeNumber', '1800-180-1551')}</span>
              </div>
            </div>

            {/* Annadata Slogan Card */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '18px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '6px' }}>
                🌱
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b' }}>
                {t('bottomSlogan', 'अन्नदाता देश की शान')}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
