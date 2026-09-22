import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Calendar, Clock, MapPin, Scale, ArrowLeft, Download, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function QrPassPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!booking) {
      fetchActiveBooking();
    }
  }, []);

  const fetchActiveBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get('/farmer/dashboard-summary');
      if (res.data?.activeBooking) {
        setBooking(res.data.activeBooking);
      }
    } catch (err) {
      console.error('Failed to fetch active booking for QR Pass:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #d1fae5', borderTopColor: '#059669', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#065f46', fontWeight: 600 }}>{t('loadingData')}</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="portal-container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          {language === 'hi' ? 'कोई सक्रिय क्यूआर पास नहीं मिला' : 'No Active QR Pass Found'}
        </h2>
        <p style={{ color: '#6b7280', marginTop: '6px' }}>
          {language === 'hi' ? 'कृपया किसान डैशबोर्ड से अपना स्लॉट विवरण देखें।' : 'Please check your slot details from the Farmer Dashboard.'}
        </p>
        <button onClick={() => navigate('/farmer/dashboard')} className="btn-primary" style={{ marginTop: '20px' }}>
          {language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
        </button>
      </div>
    );
  }

  // Verification deadline countdown
  let deadlineDisplay = null;
  if (booking.verificationDeadline) {
    const deadlineMs = new Date(booking.verificationDeadline).getTime();
    const diffMs = deadlineMs - currentTime;
    if (diffMs <= 0) {
      deadlineDisplay = (
        <span style={{ color: '#dc2626', fontWeight: 800 }}>
          ⚠️ {language === 'hi' ? 'समय सीमा समाप्त (Expired)' : 'Deadline Expired'}
        </span>
      );
    } else {
      const totalSecs = Math.floor(diffMs / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      deadlineDisplay = (
        <span style={{ color: '#059669', fontWeight: 900 }}>
          ⏳ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} {language === 'hi' ? 'शेष' : 'remaining'}
        </span>
      );
    }
  }

  const allocStartTime = booking.allocatedStartTime
    ? new Date(booking.allocatedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : booking.slotStartTime;

  const qrPayload = `KK-REF:${booking.bookingReference}-BID:${booking.bookingId}-TOK:${booking.tokenNumber}-CID:${booking.centerId}`;

  return (
    <div className="portal-container" style={{ padding: '30px 0 60px 0', maxWidth: '640px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, marginBottom: '16px' }}
      >
        <ArrowLeft size={18} /> {language === 'hi' ? 'वापस जाएं (Back)' : 'Back to Dashboard'}
      </button>

      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '2px solid #059669',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(5, 150, 105, 0.15)'
      }}>
        {/* Pass Header */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: '#ffffff', padding: '24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            <ShieldCheck size={14} color="#fef08a" /> {language === 'hi' ? 'डिजिटल ई-प्रवेश पास (Official Gate Pass)' : 'Digital Gate Pass (Official)'}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef08a', margin: 0 }}>
            {language === 'hi' ? 'टोकन क्रमांक:' : 'Token No:'} {booking.tokenNumber || '—'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#d1fae5', margin: '4px 0 0 0' }}>
            {language === 'hi' ? 'बुकिंग संदर्भ:' : 'Booking Ref:'} <strong>{booking.bookingReference || '—'}</strong>
          </p>
        </div>

        {/* QR Display Area */}
        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1.5px dashed #cbd5e1', background: '#f8fafc' }}>
          <div style={{
            display: 'inline-block',
            background: '#ffffff',
            padding: '16px',
            borderRadius: '16px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 6px 16px rgba(0,0,0,0.06)'
          }}>
            <QRCodeSVG
              value={qrPayload}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          <div style={{ marginTop: '16px', color: '#065f46', fontSize: '0.88rem', fontWeight: 700 }}>
            {language === 'hi' ? 'उपार्जन केंद्र गेट स्कैनर पर इस क्यूआर कोड को दिखाएं' : 'Show this QR code at the Procurement Centre Gate Scanner'}
          </div>

          {/* Verification Deadline Live Countdown */}
          {deadlineDisplay && (
            <div style={{ marginTop: '8px', fontSize: '0.95rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 14px', display: 'inline-block' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>{language === 'hi' ? 'सत्यापन समय सीमा: ' : 'Verification Deadline: '}</span>
              {deadlineDisplay}
            </div>
          )}

          <div style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600, marginTop: '8px' }}>
            ⚠️ {language === 'hi' ? 'आवंटित समय से पूर्व गेट पर सत्यापन अनिवार्य है।' : 'Gate verification is mandatory before the allocated deadline.'}
          </div>
        </div>

        {/* Booking Details Grid */}
        <div style={{ padding: '24px 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'किसान का नाम:' : 'Farmer Name:'}</span>
            <strong style={{ color: '#111827', fontSize: '1rem' }}>{booking.farmerName || '—'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'फसल एवं मात्रा:' : 'Crop & Quantity:'}</span>
            <strong style={{ color: '#111827', fontSize: '1rem' }}>{booking.produceName || '—'}{booking.estimatedQuantity ? ` (${booking.estimatedQuantity} ${t('quintal')})` : ''}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'खरीद केंद्र:' : 'Procurement Center:'}</span>
            <strong style={{ color: '#064e3b' }}>{booking.centerName || '—'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'आवंटित काउंटर:' : 'Assigned Counter:'}</span>
            <strong style={{ color: '#047857' }}>{booking.counterName || (booking.counterNumber ? `Counter #${booking.counterNumber}` : '—')}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'तारीख:' : 'Slot Date:'}</span>
            <strong style={{ color: '#111827' }}>{booking.slotDate}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{language === 'hi' ? 'सत्यापन समय (Gate Entry):' : 'Gate Entry Time:'}</span>
            <strong style={{ color: '#b45309' }}>{allocStartTime}</strong>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ padding: '16px 30px 24px 30px', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.print()}
            className="btn-primary"
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}
          >
            <Download size={18} /> {language === 'hi' ? 'पास डाउनलोड / प्रिंट करें' : 'Download / Print Pass'}
          </button>
        </div>
      </div>
    </div>
  );
}
