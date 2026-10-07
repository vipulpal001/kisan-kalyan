import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/Footer.css';

export default function Footer() {
  const { t, lang } = useLanguage();
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <footer style={{ background: '#042f1f', color: '#ecfdf5', borderTop: '4px solid #059669', marginTop: 'auto' }}>
      
      {/* =========================================================================
          DESKTOP FOOTER (100% Preserved & Locked for screens > 992px)
      ========================================================================= */}
      <div className="desktop-footer-content" style={{ paddingTop: '48px' }}>
        <div className="portal-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Main 4-Column Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '36px', 
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            
            {/* Column 1: Kisan Kalyan Brand & Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <img 
                  src="/emblem_of_india_gold.svg" 
                  alt="Government of India Emblem" 
                  style={{ height: '38px', width: 'auto' }} 
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.2px' }}>
                    {t('footerTitle', 'किसान कल्याण')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                    {t('govIndia', 'भारत सरकार')} • {t('ministryAgri', 'कृषि एवं किसान कल्याण मंत्रालय')}
                  </div>
                </div>
              </div>
              
              <p style={{ color: '#d1fae5', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {t('footerDesc', lang === 'hi' 
                  ? 'अन्नदाता किसानों के लिए पारदर्शी डिजिटल खरीद, स्लॉट बुकिंग, लाइव कतार प्रबंधन और त्वरित डीबीटी बैंक हस्तांतरण का राष्ट्रीय मंच।' 
                  : 'Smart digital procurement, queue tracking, transparent electronic weighing, and direct DBT bank transfer initiative for Indian farmers.')}
              </p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', color: '#fef08a' }}>
                <span>🌾</span> {t('sloganSub', 'समृद्ध किसान, समृद्ध भारत')}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <li>
                  <Link to="/" style={{ color: '#ecfdf5', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {t('navHome', 'होम (Home)')}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/book-slot" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {t('navBookSlot', 'स्लॉट बुक करें (Book Slot)')}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/queue" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {t('navLiveQueue', 'लाइव कतार (Live Queue)')}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/procurement-status" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {t('navProcurementStatus', 'खरीद स्थिति (Procurement Status)')}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/payment" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {t('navPayments', 'डीबीटी भुगतान (DBT Payments)')}
                  </Link>
                </li>
                <li>
                  <Link to="/centers" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {t('navFindCentres', 'खरीद केंद्र (Find Centres)')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Farmer Services */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                {lang === 'hi' ? 'किसान सेवाएं' : 'Farmer Services'}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <li>
                  <Link to="/farmer/dashboard" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'मेरी प्रोफाइल व डैशबोर्ड' : 'My Profile & Dashboard'}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/book-slot" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'मेरी स्लॉट बुकिंग' : 'My Slot Bookings'}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/qr-pass" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'डिजिटल टोकन व क्यूआर पास' : 'Digital Token & QR Pass'}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/procurement-status" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'जे-फॉर्म व तौल पर्ची' : 'J-Forms & Weighment Receipts'}
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/payment" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'बैंक भुगतान इतिहास' : 'Bank Payment History'}
                  </Link>
                </li>
                <li>
                  <Link to="/login" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                    {lang === 'hi' ? 'मंडी ऑपरेटर / अधिकारी लॉगिन' : 'Mandi Operator / Staff Login'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Help & Support */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                {lang === 'hi' ? 'सहायता एवं संपर्क' : 'Support & Contact'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
                <div>
                  <div style={{ color: '#a7f3d0', fontSize: '0.74rem' }}>
                    {t('kisanHelplineTitle', 'टोल-फ्री किसान हेल्पलाइन')}
                  </div>
                  <a 
                    href="tel:18001801551" 
                    style={{ color: '#fef08a', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}
                  >
                    <PhoneCall size={16} /> 1800-180-1551
                  </a>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>
                    {lang === 'hi' ? 'प्रातः 06:00 से रात्रि 10:00 बजे तक' : '06:00 AM – 10:00 PM (Daily)'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#a7f3d0', fontSize: '0.74rem' }}>
                    {lang === 'hi' ? 'आधिकारिक ईमेल' : 'Support Email'}
                  </div>
                  <a 
                    href="mailto:support@kisankalyan.gov.in" 
                    style={{ color: '#ecfdf5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}
                  >
                    <Mail size={14} color="#a7f3d0" /> support@kisankalyan.gov.in
                  </a>
                </div>

                <div style={{ marginTop: '4px' }}>
                  <Link 
                    to="/help" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'rgba(255,255,255,0.12)', 
                      color: '#ffffff', 
                      padding: '6px 14px', 
                      borderRadius: '8px', 
                      textDecoration: 'none', 
                      fontSize: '0.8rem',
                      fontWeight: 700 
                    }}
                  >
                    {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Help & FAQ Guide'} →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Government Attribution */}
          <div style={{ 
            padding: '20px 0 28px 0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '14px', 
            fontSize: '0.76rem', 
            color: '#a7f3d0' 
          }}>
            <div>
              {t('footerSub', 'किसान कल्याण - स्मार्ट खरीद एवं भंडारण प्रबंधन पोर्टल © 2026. सर्वाधिकार सुरक्षित।')}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/help#terms" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                {lang === 'hi' ? 'नियम व शर्तें' : 'Terms & Conditions'}
              </Link>
              <span>•</span>
              <Link to="/help#privacy" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                {lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
              </Link>
              <span>•</span>
              <Link to="/help#accessibility" style={{ color: '#ecfdf5', textDecoration: 'none' }}>
                {lang === 'hi' ? 'सुलभता वक्तव्य' : 'Accessibility Statement'}
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MOBILE COMPACT FOOTER (Shown only on phone / screens <= 992px)
      ========================================================================= */}
      <div className="mobile-footer-content">
        {/* Government Identity */}
        <div className="mobile-footer-brand">
          <img 
            src="/emblem_of_india_gold.svg" 
            alt="Emblem of India" 
            className="mobile-footer-emblem" 
          />
          <div>
            <div className="mobile-footer-title">{t('footerTitle', 'किसान कल्याण')}</div>
            <div className="mobile-footer-subtitle">{t('govIndia', 'भारत सरकार')} • {t('ministryAgri', 'कृषि मंत्रालय')}</div>
          </div>
        </div>

        <div className="mobile-footer-motto-pill">
          <span>🌾</span>
          <span>{t('sloganSub', 'समृद्ध किसान, समृद्ध भारत')}</span>
        </div>

        {/* Farmer Support Direct Box */}
        <div className="mobile-footer-support-box">
          <a href="tel:18001801551" className="mobile-footer-helpline-btn">
            <PhoneCall size={18} />
            <span>1800-180-1551 ({lang === 'hi' ? 'निशुल्क हेल्पलाइन' : 'Toll-Free Helpline'})</span>
          </a>
          <a href="mailto:support@kisankalyan.gov.in" className="mobile-footer-email-link">
            <Mail size={14} />
            <span>support@kisankalyan.gov.in</span>
          </a>
        </div>

        {/* Expandable Accordion: Quick Links */}
        <div className="mobile-footer-accordion">
          <button 
            type="button"
            className="mobile-footer-accordion-header"
            onClick={() => setQuickLinksOpen(prev => !prev)}
            aria-expanded={quickLinksOpen}
          >
            <span>{lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}</span>
            {quickLinksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {quickLinksOpen && (
            <ul className="mobile-footer-accordion-list">
              <li><Link to="/" className="mobile-footer-link">{t('navHome', 'होम')}</Link></li>
              <li><Link to="/farmer/book-slot" className="mobile-footer-link">{t('navBookSlot', 'स्लॉट बुक करें')}</Link></li>
              <li><Link to="/farmer/queue" className="mobile-footer-link">{t('navLiveQueue', 'लाइव कतार देखें')}</Link></li>
              <li><Link to="/farmer/payment" className="mobile-footer-link">{t('navPayments', 'डीबीटी भुगतान जांचें')}</Link></li>
              <li><Link to="/centers" className="mobile-footer-link">{t('navFindCentres', 'निकटतम केंद्र खोजें')}</Link></li>
            </ul>
          )}
        </div>

        {/* Expandable Accordion: Farmer Services */}
        <div className="mobile-footer-accordion">
          <button 
            type="button"
            className="mobile-footer-accordion-header"
            onClick={() => setServicesOpen(prev => !prev)}
            aria-expanded={servicesOpen}
          >
            <span>{lang === 'hi' ? 'किसान सेवाएं' : 'Farmer Services'}</span>
            {servicesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {servicesOpen && (
            <ul className="mobile-footer-accordion-list">
              <li><Link to="/farmer/dashboard" className="mobile-footer-link">{lang === 'hi' ? 'डैशबोर्ड व प्रोफाइल' : 'Dashboard & Profile'}</Link></li>
              <li><Link to="/farmer/qr-pass" className="mobile-footer-link">{lang === 'hi' ? 'डिजिटल क्यूआर पास' : 'Digital QR Pass'}</Link></li>
              <li><Link to="/farmer/procurement-status" className="mobile-footer-link">{lang === 'hi' ? 'तौल पर्ची व जे-फॉर्म' : 'Weighment Slip & J-Form'}</Link></li>
              <li><Link to="/help" className="mobile-footer-link">{lang === 'hi' ? 'सहायता एवं सामान्य प्रश्न' : 'Help & FAQ Guide'}</Link></li>
              <li><Link to="/login" className="mobile-footer-link">{lang === 'hi' ? 'मंडी स्टाफ लॉगिन' : 'Staff Login'}</Link></li>
            </ul>
          )}
        </div>

        {/* Legal & Copyright */}
        <div className="mobile-footer-legal">
          <div className="mobile-footer-legal-links">
            <Link to="/help#terms" className="mobile-footer-legal-link">{lang === 'hi' ? 'नियम व शर्तें' : 'Terms'}</Link>
            <span>•</span>
            <Link to="/help#privacy" className="mobile-footer-legal-link">{lang === 'hi' ? 'गोपनीयता' : 'Privacy'}</Link>
            <span>•</span>
            <Link to="/help#accessibility" className="mobile-footer-legal-link">{lang === 'hi' ? 'सुलभता' : 'Accessibility'}</Link>
          </div>
          <div className="mobile-footer-copy">
            किसान कल्याण पोर्टल © 2026. भारत सरकार।
          </div>
        </div>

      </div>

    </footer>
  );
}
