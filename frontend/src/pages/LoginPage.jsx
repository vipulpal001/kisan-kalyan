import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('ramesh.singh');
  const [password, setPassword] = useState('farmer123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'लॉगिन विफल रहा / Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '40px 0' }}>
      <div className="kisan-card" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '12px' }}>
            🌾
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b' }}>पोर्टल लॉगिन</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
            किसान, ऑपरेटर एवं प्रशासक लॉगिन
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              उपयोगकर्ता नाम (Username)
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              पासवर्ड (Password)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}>
            {loading ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Login)'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '18px' }}>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            नया किसान खाता?{' '}
            <Link to="/register" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              नया पंजीकरण करें
            </Link>
          </p>
        </div>

        {/* Quick Credentials Helper for Testing */}
        <div style={{ marginTop: '20px', background: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', color: '#475569', border: '1px solid #e2e8f0' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#0f172a' }}>त्वरित डेमो लॉगिन (Quick 1-Click Login):</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => { setUsername('ramesh.singh'); setPassword('farmer123'); }}
              style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              🌾 किसान (Ramesh)
            </button>
            <button 
              type="button"
              onClick={() => { setUsername('rajesh.verma'); setPassword('farmer123'); }}
              style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ⚖️ ऑपरेटर (Rajesh)
            </button>
            <button 
              type="button"
              onClick={() => { setUsername('admin'); setPassword('admin123'); }}
              style={{ background: '#fdf4ff', color: '#86198f', border: '1px solid #f0abfc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              🏛️ प्रशासक (Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
