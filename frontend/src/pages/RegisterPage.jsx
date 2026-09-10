import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Phone, Lock, CreditCard, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    aadhaarNumber: '',
    bankAccountNumber: '',
    bankName: 'State Bank of India',
    ifscCode: '',
    village: '',
    district: 'Mirzapur',
    state: 'Uttar Pradesh'
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
    setLoading(true);

    try {
      const res = await api.post('/auth/register-farmer', formData);
      login(res.data);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'पंजीकरण विफल रहा / Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ padding: '40px 0' }}>
      <div className="kisan-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '12px' }}>
            🚜
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b' }}>नया किसान पंजीकरण</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
            सरकारी खरीद एवं समर्थन मूल्य (MSP) का लाभ लेने हेतु विवरण दर्ज करें
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46', borderBottom: '2px solid #ecfdf5', paddingBottom: '6px', marginBottom: '12px' }}>
              १. व्यक्तिगत जानकारी (Personal Information)
            </h4>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              किसान का पूरा नाम *
            </label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name} 
              onChange={handleChange}
              placeholder="उदा. रमेश सिंह"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              मोबाइल नंबर *
            </label>
            <input 
              type="tel" 
              name="phoneNumber"
              required 
              value={formData.phoneNumber} 
              onChange={handleChange}
              placeholder="10 अंकों का मोबाइल नंबर"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              उपयोगकर्ता नाम (Username) *
            </label>
            <input 
              type="text" 
              name="username"
              required 
              value={formData.username} 
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              पासवर्ड (Password) *
            </label>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password} 
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              आधार नंबर (12 अंक)
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
              गांव / ग्राम पंचायत
            </label>
            <input 
              type="text" 
              name="village"
              value={formData.village} 
              onChange={handleChange}
              placeholder="उदा. चुनार खेड़ा"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46', borderBottom: '2px solid #ecfdf5', paddingBottom: '6px', marginBottom: '12px' }}>
              २. बैंक खाता विवरण (DBT Payment Details)
            </h4>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              बैंक खाता संख्या (Account No)
            </label>
            <input 
              type="text" 
              name="bankAccountNumber"
              value={formData.bankAccountNumber} 
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              IFSC कोड
            </label>
            <input 
              type="text" 
              name="ifscCode"
              maxLength={11}
              value={formData.ifscCode} 
              onChange={handleChange}
              placeholder="SBIN0001234"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}>
              {loading ? 'खाता बन रहा है...' : 'पंजीकरण पूर्ण करें (Complete Registration)'} <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            पहले से पंजीकृत हैं?{' '}
            <Link to="/login" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              यहाँ लॉगिन करें
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
