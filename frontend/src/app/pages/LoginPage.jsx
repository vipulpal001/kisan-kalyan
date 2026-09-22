import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { Lock, User, AlertCircle, ArrowRight, CheckCircle2, Phone, KeyRound, X } from 'lucide-react';

export default function LoginPage() {
  const { lang, t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'OPERATOR') {
        navigate('/operator/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data);
      if (res.data.role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (res.data.role === 'OPERATOR') {
        navigate('/operator/dashboard');
      } else if (res.data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setError(lang === 'hi' ? 'अमान्य भूमिका / Unknown user role' : 'Unknown user role');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'लॉगिन विफल रहा / Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotIdentifier.trim()) {
      setForgotError('कृपया उपयोगकर्ता नाम अथवा मोबाइल नंबर दर्ज करें');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { usernameOrPhone: forgotIdentifier.trim() });
      if (res.data && res.data.success) {
        setMaskedPhone(res.data.maskedPhone || '******');
        setForgotStep(2);
      } else {
        setForgotError(res.data?.message || 'उपयोगकर्ता नहीं मिला');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'उपयोगकर्ता खोजने में त्रुटि हुई। कृपया विवरण जांचें।');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!verifyPhone.trim()) {
      setForgotError('कृपया पंजीकृत मोबाइल नंबर दर्ज करें');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('दोनों पासवर्ड मेल नहीं खाते हैं');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        usernameOrPhone: forgotIdentifier.trim(),
        phoneNumber: verifyPhone.trim(),
        newPassword: newPassword
      });
      if (res.data && res.data.success) {
        setForgotSuccess(res.data.message || 'पासवर्ड सफलतापूर्वक बदल दिया गया!');
        setPassword(newPassword);
        setUsername(forgotIdentifier.trim());
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotIdentifier('');
          setVerifyPhone('');
          setNewPassword('');
          setConfirmPassword('');
          setForgotSuccess('');
        }, 1500);
      } else {
        setForgotError(res.data?.message || 'पासवर्ड रीसेट विफल रहा');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'पासवर्ड रीसेट करने में त्रुटि हुई। मोबाइल नंबर जांचें।');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '32px 16px' }}>
      <div className="kisan-card" style={{ width: '100%', maxWidth: '440px', padding: '32px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '12px' }}>
            🌾
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b' }}>
            {lang === 'hi' ? 'पोर्टल लॉगिन' : 'Portal Login'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>
            {lang === 'hi' ? 'किसान, ऑपरेटर एवं प्रशासक लॉगिन' : 'Farmer, Operator & District Admin Login'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              {lang === 'hi' ? 'उपयोगकर्ता नाम (Username)' : 'Username'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-label={lang === 'hi' ? 'उपयोगकर्ता नाम' : 'Username'}
                placeholder={lang === 'hi' ? 'यूज़रनेम दर्ज करें' : 'Enter username'}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374151' }}>
                {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
              </label>
              <button 
                type="button" 
                onClick={() => {
                  setForgotIdentifier(username || '');
                  setForgotStep(1);
                  setForgotError('');
                  setForgotSuccess('');
                  setShowForgotModal(true);
                }}
                style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                {lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label={lang === 'hi' ? 'पासवर्ड' : 'Password'}
                placeholder={lang === 'hi' ? 'पासवर्ड दर्ज करें' : 'Enter password'}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: '0.96rem', fontWeight: 700, marginTop: '6px' }}>
            {loading 
              ? (lang === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...') 
              : (lang === 'hi' ? 'लॉगिन करें (Login)' : 'Sign In')} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#6b7280' }}>
            {lang === 'hi' ? 'नया किसान खाता? ' : 'New farmer account? '}
            <Link to="/register" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              {lang === 'hi' ? 'नया पंजीकरण करें' : 'Register Here'}
            </Link>
          </p>
        </div>

        {/* Quick Credentials Helper for Testing - DEV mode only */}
        {import.meta.env.DEV && (
          <div style={{ marginTop: '18px', background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#475569', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: '#0f172a' }}>
              {lang === 'hi' ? 'त्वरित डेमो लॉगिन (1-Click Demo Login):' : 'Quick Demo Login:'}
            </strong>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setUsername('ramesh.singh');
                  setPassword('farmer123');
                }}
                style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                🌾 {lang === 'hi' ? 'किसान (Ramesh)' : 'Farmer (Ramesh)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('rajesh.verma');
                  setPassword('operator123');
                }}
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ⚖️ {lang === 'hi' ? 'ऑपरेटर (Rajesh)' : 'Operator (Rajesh)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                style={{ background: '#fdf4ff', color: '#86198f', border: '1px solid #f0abfc', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                🏛️ {lang === 'hi' ? 'प्रशासक (Admin)' : 'Admin'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowForgotModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  पासवर्ड रीसेट (Forgot Password)
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  चरण {forgotStep} / 2: {forgotStep === 1 ? 'खाता सत्यापन' : 'मोबाइल सत्यापन व नया पासवर्ड'}
                </span>
              </div>
            </div>

            {forgotError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <AlertCircle size={16} /> {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '10px 12px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <CheckCircle2 size={16} /> {forgotSuccess}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1}>
                <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
                  अपना पंजीकृत उपयोगकर्ता नाम (Username) अथवा 10-अंकीय मोबाइल नंबर दर्ज करें:
                </p>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    यूज़रनेम अथवा मोबाइल नंबर
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    required
                    placeholder="उदा. 9876543210 अथवा यूज़रनेम"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{ background: '#017953', color: '#ffffff', border: 'none', padding: '9px 22px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 700, cursor: forgotLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {forgotLoading ? 'सत्यापित हो रहा है...' : 'आगे बढ़ें →'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2}>
                <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '14px' }}>
                  खाते से जुड़ा मोबाइल: <strong>{maskedPhone}</strong>। सुरक्षा पुष्टि हेतु कृपया पूरा 10-अंकीय मोबाइल नंबर दर्ज करें और नया पासवर्ड चुनें।
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    पंजीकृत मोबाइल नंबर (Confirm Phone)
                  </label>
                  <input
                    type="text"
                    value={verifyPhone}
                    onChange={(e) => setVerifyPhone(e.target.value)}
                    required
                    maxLength={10}
                    placeholder="10-अंकीय मोबाइल नंबर"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    नया पासवर्ड (New Password)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="कम से कम 6 अक्षर"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    नया पासवर्ड पुनः दर्ज करें (Confirm Password)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '9px 16px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                  >
                    ← पिछला
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{ background: '#017953', color: '#ffffff', border: 'none', padding: '9px 22px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 700, cursor: forgotLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {forgotLoading ? 'अपडेट हो रहा है...' : 'पासवर्ड रीसेट करें'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

