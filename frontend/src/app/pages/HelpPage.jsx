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
                प्र. स्लॉट समय और प्रसंस्करण अवधि कैसे तय होती है?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: प्रसंस्करण समय उपार्जन केंद्र की क्षमता और वर्तमान कतार स्थिति पर निर्भर करता है। प्रणाली स्वचालित रूप से उपलब्धता के आधार पर स्लॉट आवंटित करती है।
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. यदि मैं निर्धारित समय पर नहीं पहुंच पाया तो क्या होगा?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: उपार्जन केंद्र पहुंचने पर गेट ऑपरेटर द्वारा क्यूआर कोड स्कैन कराना होता है। यदि किसान आवंटित समय में उपस्थित नहीं होता, तो केंद्र नीति अनुसार स्लॉट नो-शो में दर्ज हो सकता है और कतार में अगले किसान को अवसर दिया जाता है।
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. जे-फॉर्म (J-Form) कब और कैसे प्राप्त होगा?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: धर्मकांटे पर तौल और गुणवत्ता परीक्षण पूर्ण होने के उपरांत सर्वर द्वारा जे-फॉर्म (J-Form) डिजिटल रूप से जनरेट किया जाता है, जिसे आप अपने खाते से कभी भी देख या डाउनलोड कर सकते हैं।
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                प्र. डीबीटी बैंक भुगतान कब तक खाते में आता है?
              </strong>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
                उत्तर: बैकएंड स्वीकृति एवं पीएफएमएस (PFMS) सत्यापन उपरांत राशि सीधे किसान के आधार-लिंक्ड बैंक खाते में अंतरित की जाती है। भुगतान स्थिति 'भुगतान' पेज पर लाइव देखी जा सकती है।
              </p>
            </div>
          </div>
        </div>

        <div className="kisan-card" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={22} /> संपर्क एवं सहायता
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#166534' }}>
            <div>
              <strong>किसान हेल्पलाइन:</strong>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064e3b', marginTop: '2px' }}>
                1800-180-1551
              </div>
            </div>

            <div>
              <strong>पोर्टल सहायता केंद्र:</strong>
              <div>उपार्जन एवं कतार संबंधी सहायता हेतु अपने निकटतम केंद्र ऑपरेटर या किसान सहायता डेस्क से संपर्क करें।</div>
            </div>

            <div>
              <strong>कार्य दिवस:</strong>
              <div>उपार्जन केंद्र कार्यदिवसों पर आधिकारिक समय अनुसार संचालित होते हैं।</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
