import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { User, Phone, Lock, CreditCard, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    aadhaarNumber: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    village: '',
    district: '',
    state: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    const phoneTrim = formData.phoneNumber.trim();
    if (!/^[6-9]\d{9}$/.test(phoneTrim)) {
      setError(lang === 'hi' ? 'कृपया एक वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू)' : 'Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (formData.password.length < 8) {
      setError(lang === 'hi' ? 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए' : 'Password must be at least 8 characters long');
      return;
    }

    if (formData.aadhaarNumber.trim() && !/^\d{12}$/.test(formData.aadhaarNumber.trim())) {
      setError(lang === 'hi' ? 'आधार नंबर सटीक 12 अंकों का होना चाहिए' : 'Aadhaar number must be exactly 12 digits');
      return;
    }

    if (formData.ifscCode.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode.trim())) {
      setError(lang === 'hi' ? 'कृपया एक वैध 11-अंकीय IFSC कोड दर्ज करें (उदा. SBIN0001234)' : 'Please enter a valid 11-character IFSC code');
      return;
    }

    if (formData.bankAccountNumber.trim() && !/^\d{9,18}$/.test(formData.bankAccountNumber.trim())) {
      setError(lang === 'hi' ? 'कृपया एक वैध बैंक खाता संख्या दर्ज करें' : 'Please enter a valid bank account number');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        phoneNumber: phoneTrim,
        ifscCode: formData.ifscCode.toUpperCase().trim()
      };
      const res = await api.post('/auth/register-farmer', payload);
      login(res.data);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'hi' ? 'पंजीकरण विफल रहा' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ padding: '32px 16px' }}>
      <div className="kisan-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '12px' }}>
            🚜
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b' }}>
            {lang === 'hi' ? 'नया किसान पंजीकरण' : 'New Farmer Registration'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>
            {lang === 'hi' 
              ? 'सरकारी उपार्जन एवं समर्थन मूल्य (MSP) का लाभ लेने हेतु विवरण दर्ज करें' 
              : 'Register to access government procurement and Minimum Support Price (MSP) benefits'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#065f46', borderBottom: '2px solid #ecfdf5', paddingBottom: '6px', marginBottom: '8px' }}>
              १. {lang === 'hi' ? 'व्यक्तिगत जानकारी (Personal Information)' : 'Personal Information'}
            </h4>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'किसान का पूरा नाम *' : 'Full Name *'}
            </label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name} 
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
            </label>
            <input 
              type="tel" 
              name="phoneNumber"
              required 
              maxLength={10}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder={lang === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'उपयोगकर्ता नाम (Username) *' : 'Username *'}
            </label>
            <input 
              type="text" 
              name="username"
              required 
              value={formData.username} 
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'यूज़रनेम चुनें' : 'Choose username'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'पासवर्ड (Password) *' : 'Password *'}
            </label>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password} 
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'कम से कम 8 अक्षर' : 'Min 8 characters'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'आधार नंबर (12 अंक)' : 'Aadhaar Number (12 digits)'}
            </label>
            <input 
              type="text" 
              name="aadhaarNumber"
              maxLength={12}
              value={formData.aadhaarNumber} 
              onChange={handleChange}
              placeholder="123456789012"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'गांव / ग्राम पंचायत' : 'Village / Gram Panchayat'}
            </label>
            <input 
              type="text" 
              name="village"
              value={formData.village} 
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'गांव का नाम' : 'Village name'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'जिला (District)' : 'District'}
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'जिला दर्ज करें' : 'Enter district'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'राज्य (State)' : 'State'}
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'राज्य दर्ज करें' : 'Enter state'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#065f46', borderBottom: '2px solid #ecfdf5', paddingBottom: '6px', marginBottom: '8px' }}>
              २. {lang === 'hi' ? 'बैंक खाता विवरण (DBT Payment Details)' : 'Bank Account Details for DBT'}
            </h4>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'बैंक का नाम' : 'Bank Name'}
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder={lang === 'hi' ? 'उदा. पंजाब नेशनल बैंक' : 'e.g. Punjab National Bank'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'बैंक खाता संख्या (Account No)' : 'Bank Account Number'}
            </label>
            <input 
              type="text" 
              name="bankAccountNumber"
              value={formData.bankAccountNumber} 
              onChange={handleChange}
              placeholder="XXXXXXXXXXXX"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              {lang === 'hi' ? 'IFSC कोड' : 'IFSC Code'}
            </label>
            <input 
              type="text" 
              name="ifscCode"
              maxLength={11}
              value={formData.ifscCode} 
              onChange={handleChange}
              placeholder="PUNB0123456"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: '0.96rem', fontWeight: 700 }}>
              {loading 
                ? (lang === 'hi' ? 'खाता बन रहा है...' : 'Creating Account...') 
                : (lang === 'hi' ? 'पंजीकरण पूर्ण करें (Complete Registration)' : 'Complete Registration')} <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.86rem', color: '#6b7280' }}>
            {lang === 'hi' ? 'पहले से पंजीकृत हैं? ' : 'Already registered? '}
            <Link to="/login" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              {lang === 'hi' ? 'यहाँ लॉगिन करें' : 'Login Here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
