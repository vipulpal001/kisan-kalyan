import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="portal-container" style={{ padding: '30px 0 60px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b' }}>
          ❓ किसान सहायता एवं अक्सर पूछे जाने वाले प्रश्न (Help & FAQ)
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
          स्लॉट बुकिंग, क्यूआर कोड, धर्मकांटा तौल एवं डीबीटी बैंक भुगतान सहायता
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        <div className="kisan-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '18px' }}>
            अक्सर पूछे जाने वाले प्रश्न (FAQ)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. 1 क्विंटल उपज के लिए कितना समय स्लॉट मिलता है?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: केंद्र की प्रसंस्करण दर के अनुसार 1 क्विंटल उपज के लिए लगभग 10 मिनट का समय निर्धारित किया जाता है। यदि आप 50 क्विंटल उपज लाते हैं तो उसी अनुपात में लगातार समय अंतराल आवंटित किया जाता है।
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. यदि मैं निर्धारित समय पर नहीं पहुंच पाया तो क्या होगा?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: स्लॉट समय से 10 मिनट पहले सत्यापन खुलता है। यदि निर्धारित समय तक क्यूआर स्कैन नहीं होता है तो स्लॉट स्वचालित रूप से No-Show में चला जाता है और प्रतीक्षारत किसान को समय आवंटित कर दिया जाता है।
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. जे-फॉर्म कब और कैसे प्राप्त होगा?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: धर्मकांटे पर तौल और नमी परीक्षण पूरा होते ही आपके पोर्टल खाते में जे-फॉर्म (J-Form) डिजिटल रूप से जारी हो जाता है, जिसे आप तुरंत डाउनलोड या प्रिंट कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

        <div className="kisan-card" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={22} /> संपर्क एवं हेल्पलाइन
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#166534' }}>
            <div>
              <strong>राष्ट्रीय किसान कॉल सेंटर (Toll-Free):</strong>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064e3b', marginTop: '2px' }}>
                1800-180-1551
              </div>
            </div>

            <div>
              <strong>मंडी तकनीकी सहायता ईमेल:</strong>
              <div>support-kisankalyan@gov.in</div>
            </div>

            <div>
              <strong>कार्य समय:</strong>
              <div>प्रातः 08:00 से सायं 08:00 तक (सोमवार - शनिवार)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
