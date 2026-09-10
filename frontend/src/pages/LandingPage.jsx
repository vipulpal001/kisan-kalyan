import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ListOrdered, 
  Scale, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  Warehouse, 
  FileText 
} from 'lucide-react';

import kisanHeroImg from '../assets/kisan_hero.jpg';

export default function LandingPage() {
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Banner with Agricultural Design */}
      <section style={{ 
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)', 
        color: '#ffffff', 
        padding: '50px 0 70px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="portal-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              <span>🌾</span> डिजिटल कृषि खरीद पहल • भारत सरकार
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
              स्मार्ट खरीद एवं कतार प्रबंधन प्रणाली
            </h1>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 500, color: '#a7f3d0', marginBottom: '20px' }}>
              Smart Procurement & Storage Management Portal
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#ecfdf5', marginBottom: '28px' }}>
              अन्नदाता किसानों के लिए पारदर्शी डिजिटल स्लॉट बुकिंग, लाइव कतार ट्रैकिंग, कम्प्यूटरीकृत तौल, क्यूआर आधारित सत्यापन और 48 घंटे में सीधे बैंक खाते में एमएसपी (MSP) भुगतान।
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ background: '#fef08a', color: '#713f12', padding: '14px 28px', fontSize: '1.05rem', fontWeight: 800 }}>
                किसान के रूप में शुरू करें <ArrowRight size={18} />
              </Link>
              <Link to="/centers" className="btn-secondary" style={{ background: 'transparent', color: '#ffffff', borderColor: '#ffffff', padding: '14px 24px', fontSize: '1.05rem' }}>
                निकटतम केंद्र खोजें
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <img 
                src={kisanHeroImg} 
                alt="Kisan Kalyan Digital Procurement" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: '#fef08a' }}>
                पोर्टल की मुख्य डिजिटल सुविधाएं
              </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>डायनामिक स्लॉट आवंटन:</strong> प्रति क्विंटल प्रसंस्करण समय के आधार पर सटीक समय।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>लाइव टोकन कतार:</strong> मंडी पहुंचने से पहले अपने मोबाइल पर कतार स्थिति देखें।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>क्यूआर कोड आगमन सत्यापन:</strong> मंडी प्रवेश पर त्वरित गैर-संपर्क सत्यापन।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>डिजिटल जे-फॉर्म (J-Form):</strong> तौल संपन्न होते ही डिजिटल बिक्री रसीद तुरंत डाउनलोड करें।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>प्रत्यक्ष लाभ अंतरण (DBT):</strong> सुरक्षित सीधे बैंक खाते में भुगतान।</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

      {/* How it Works / 6 Steps Process */}
      <section className="portal-container" style={{ marginTop: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            सरल एवं सुगम प्रक्रिया
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '6px' }}>
            खरीद प्रक्रिया कैसे कार्य करती है?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            मंडी में अनावश्यक कतारों और लंबी प्रतीक्षा से मुक्ति — पारदर्शी डिजिटल चरणों में अपनी उपज बेचें।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="kisan-card" style={{ borderTop: '4px solid #059669' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Calendar size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>1. फसल व स्लॉट चयन</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              उपज, मात्रा (क्विंटल) और निकटतम सरकारी खरीद केंद्र चुनकर अपनी सुविधानुसार समय आरक्षित करें।
            </p>
          </div>

          <div className="kisan-card" style={{ borderTop: '4px solid #eab308' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef9c3', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Smartphone size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>2. क्यूआर व टोकन पर्ची</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              बुकिंग होते ही डिजिटल टोकन और क्यूआर कोड मिलता है। निर्धारित समय से 10 मिनट पहले केंद्र पर पहुंचें।
            </p>
          </div>

          <div className="kisan-card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ListOrdered size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>3. लाइव कतार एवं काउंटर</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              मंडी ऑपरेटर द्वारा क्यूआर स्कैन होते ही आगमन दर्ज हो जाता है और स्क्रीन पर आपका काउंटर नंबर प्रदर्शित होता है।
            </p>
          </div>

          <div className="kisan-card" style={{ borderTop: '4px solid #8b5cf6' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Scale size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>4. गुणवत्ता परीक्षण व तौल</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              नमी (Moisture) की जांच और स्वचालित धर्मकांटा (Weighbridge) पर वास्तविक शुद्ध वजन तुरंत दर्ज किया जाता है।
            </p>
          </div>

          <div className="kisan-card" style={{ borderTop: '4px solid #ec4899' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileText size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>5. डिजिटल जे-फॉर्म</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              तौल पूरा होते ही अधिकृत जे-फॉर्म (J-Form) जनरेट होता है जिसे पोर्टल से कभी भी देखा और डाउनलोड किया जा सकता है।
            </p>
          </div>

          <div className="kisan-card" style={{ borderTop: '4px solid #10b981' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>6. प्रत्यक्ष बैंक भुगतान (DBT)</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.5 }}>
              न्यूनतम समर्थन मूल्य (MSP) की राशि सीधे किसान के आधार-लिंक बैंक खाते में डिजिटल रूप से अंतरित कर दी जाती है।
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="portal-container" style={{ marginTop: '50px' }}>
        <div style={{ 
          background: '#064e3b', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '30px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
              किसान हेल्पलाइन एवं सहायता केंद्र
            </h3>
            <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>
              स्लॉट बुकिंग अथवा मंडी भुगतान संबंधी किसी भी जानकारी के लिए निशुल्क कॉल करें।
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              background: '#fef08a', 
              color: '#713f12', 
              padding: '12px 24px', 
              borderRadius: '10px', 
              fontWeight: 800, 
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <PhoneCall size={22} /> 1800-180-1551
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
