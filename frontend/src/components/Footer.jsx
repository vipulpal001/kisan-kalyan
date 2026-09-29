import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: '#064022', color: '#ecfdf5', padding: '24px 0', marginTop: 'auto', borderTop: '3px solid #059669' }}>
      <div className="portal-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem' }}>
        <div>
          <strong>{t('footerTitle', 'किसान कल्याण पोर्टल')}</strong> • {t('footerGov', 'भारत सरकार')}
          <div style={{ color: '#a7f3d0', fontSize: '0.78rem', marginTop: '2px' }}>
            {t('footerSub', 'Smart Procurement & Storage Management Portal © 2026. All Rights Reserved.')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/help" style={{ color: '#fef08a', textDecoration: 'none' }}>{t('footerHelp', 'मदद व संपर्क')}</Link>
          <Link to="/centers" style={{ color: '#fef08a', textDecoration: 'none' }}>{t('footerCentres', 'खरीद केंद्र')}</Link>
          <Link to="/login" style={{ color: '#fef08a', textDecoration: 'none' }}>{t('footerStaffLogin', 'अधिकारी लॉगिन')}</Link>
        </div>
      </div>
    </footer>
  );
}
