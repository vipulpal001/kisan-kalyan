import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Scale, 
  FlaskConical, 
  AlertTriangle, 
  Download, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HelpPage() {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  const handleDownloadFaqPdf = () => {
    alert('किसान कल्याण सहायता एवं अक्सर पूछे जाने वाले प्रश्न (FAQ Guide) PDF डाउनलोड प्रारंभ हो गया है।');
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', 'kisan_kalyan_faq_guide_2025-26.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="portal-container" style={{ padding: '30px 0 60px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>❓</span> {t('helpFaq', 'किसान सहायता, नियम एवं अक्सर पूछे जाने वाले प्रश्न (Help & FAQ)')}
        </h2>
        <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>
          न्यूनतम समर्थन मूल्य (MSP), स्लॉट बुकिंग, इलेक्ट्रॉनिक धर्मकांटा तौल, गुणवत्ता नमी मानक एवं डीबीटी बैंक भुगतान सहायता
        </p>
      </div>

      {/* Quick Jump Anchors Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '12px 18px',
        border: '1px solid #e2e8f0',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46', marginRight: '6px' }}>
          त्वरित विषय (Jump to):
        </span>
        <a href="#faq" style={{ padding: '5px 12px', background: '#ecfdf5', color: '#065f46', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          ❓ FAQ प्रश्न
        </a>
        <a href="#quality" style={{ padding: '5px 12px', background: '#f0fdf4', color: '#15803d', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          🧪 गुणवत्ता व नमी मानक
        </a>
        <a href="#weighment" style={{ padding: '5px 12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          ⚖️ धर्मकांटा तौल नियम
        </a>
        <a href="#grievance" style={{ padding: '5px 12px', background: '#fff7ed', color: '#c2410c', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          🛡️ शिकायत निवारण
        </a>
        <a href="#audit" style={{ padding: '5px 12px', background: '#f5f3ff', color: '#6d28d9', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          📑 ऑडिट व पारदर्शिता
        </a>
        <a href="#guide" style={{ padding: '5px 12px', background: '#fdf2f8', color: '#be185d', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
          📖 स्लॉट मार्गदर्शिका
        </a>
      </div>

      <div className="help-layout-grid">
        
        {/* Left Column: Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Section 1: FAQ */}
          <div id="faq" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="#059669" />
                अक्सर पूछे जाने वाले प्रश्न (FAQ)
              </h3>
              <button
                type="button"
                onClick={handleDownloadFaqPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={13} />
                <span>PDF गाइड डाउनलोड</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                  प्र. 1 क्विंटल उपज के लिए कितना समय स्लॉट मिलता है?
                </strong>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                  उत्तर: केंद्र की प्रसंस्करण दर के अनुसार 1 क्विंटल उपज के लिए लगभग 10 मिनट का समय निर्धारित किया जाता है। यदि आप 50 क्विंटल उपज लाते हैं तो उसी अनुपात में लगातार समय अंतराल आवंटित किया जाता है ताकि मंडी में प्रतीक्षा न करनी पड़े।
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                  प्र. यदि मैं निर्धारित समय पर नहीं पहुंच पाया तो क्या होगा?
                </strong>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                  उत्तर: स्लॉट समय से 15 मिनट पहले गेट पर सत्यापन खुलता है। यदि निर्धारित समय तक क्यूआर स्कैन नहीं होता है तो स्लॉट को ग्रेस अवधि (30 मिनट) दी जाती है, जिसके बाद वह स्वतः रीशेड्यूल कतार में चला जाता है।
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                  प्र. जे-फॉर्म (J-Form) कब और कैसे प्राप्त होगा?
                </strong>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                  उत्तर: धर्मकांटे पर सकल व खाली वजन का इलेक्ट्रॉनिक मापन और नमी परीक्षण पूरा होते ही आपके पोर्टल खाते व मोबाइल SMS पर आधिकारिक डिजिटल जे-फॉर्म (J-Form) जारी हो जाता है।
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Quality Standards FAQ */}
          <div id="quality" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={22} color="#059669" />
              🧪 गुणवत्ता एवं नमी मानक दिशानिर्देश (FAQ Quality Standards)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
              भारत सरकार द्वारा निर्धारित उचित औसत गुणवत्ता (Fair Average Quality - FAQ) के तहत खरीद की जाती है:
            </p>
            <div style={{ overflowX: 'auto', marginTop: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>फसल (Crop)</th>
                    <th style={{ padding: '8px 12px' }}>अधिकतम नमी (Max Moisture)</th>
                    <th style={{ padding: '8px 12px' }}>विदेशी पदार्थ (Foreign Matter)</th>
                    <th style={{ padding: '8px 12px' }}>सिकुड़े व टूटे दाने</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>गेहूं (Wheat)</td>
                    <td style={{ padding: '8px 12px', color: '#047857', fontWeight: 800 }}>≤ 12.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 0.75%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 4.0%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>सरसों (Mustard)</td>
                    <td style={{ padding: '8px 12px', color: '#047857', fontWeight: 800 }}>≤ 8.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 1.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 2.0%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>चना (Gram)</td>
                    <td style={{ padding: '8px 12px', color: '#047857', fontWeight: 800 }}>≤ 10.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 1.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 3.0%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>धान (Paddy)</td>
                    <td style={{ padding: '8px 12px', color: '#047857', fontWeight: 800 }}>≤ 17.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 1.0%</td>
                    <td style={{ padding: '8px 12px' }}>≤ 3.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Weighment Regulations */}
          <div id="weighment" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={22} color="#2563eb" />
              ⚖️ कम्प्यूटरीकृत धर्मकांटा तौल विनियम (Electronic Weigh Regulations)
            </h3>
            <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
              <li>प्रत्येक खरीद केंद्र पर विधिक माप विज्ञान विभाग (Legal Metrology) द्वारा कैलिब्रेटेड डिजिटल वेइब्रिज अनिवार्य है।</li>
              <li>सकल भार (Gross Weight) एवं खाली वाहन भार (Tare Weight) दोनों की स्वचालित कम्प्यूटर प्रविष्टि होती है।</li>
              <li>तौल पर्ची पर ऑपरेटर, धर्मकांटा क्रमांक, दिनांक, समय एवं किसान का नाम स्पष्ट मुद्रित रहता है।</li>
            </ul>
          </div>

          {/* Section 4: Grievance Redressal */}
          <div id="grievance" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="#dc2626" />
              🛡️ किसान शिकायत निवारण प्रोटोकॉल (Grievance Redressal)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
              यदि तौल, नमी परीक्षण, स्लॉट या डीबीटी भुगतान में कोई समस्या हो, तो किसान निम्न माध्यमों से शिकायत दर्ज करा सकते हैं:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#991b1b', fontSize: '0.86rem' }}>टोल-फ्री हेल्पलाइन:</strong>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7f1d1d', marginTop: '4px' }}>1800-180-1551</div>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#991b1b', fontSize: '0.86rem' }}>मंडी समिति शिकायत डेस्क:</strong>
                <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '4px' }}>प्रत्येक उपार्जन केंद्र पर प्रशासनिक कमरा</div>
              </div>
            </div>
          </div>

          {/* Section 5: Audit & Transparency */}
          <div id="audit" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="#7c3aed" />
              📑 लेखा परीक्षण एवं सार्वजनिक पारदर्शिता (Audit & Transparency)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5 }}>
              प्रत्येक खरीद, टोकन, तौल पर्ची एवं भुगतान का डिजिटल ऑडिट ट्रेल ब्लॉकचेन व पीएफएमएस (PFMS) के साथ सिंक रहता है। किसान अपने लेनदेन का पूर्ण विवरण किसान कल्याण पोर्टल से कभी भी सत्यापित कर सकते हैं।
            </p>
          </div>

          {/* Section 6: Step-by-Step Guide */}
          <div id="guide" className="kisan-card" style={{ scrollMarginTop: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={22} color="#059669" />
              📖 चरण-दर-चरण खरीद स्लॉट बुकिंग मार्गदर्शिका
            </h3>
            <ol style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
              <li><strong>फसल व मात्रा चुनें:</strong> अपनी उपज (गेहूं, सरसों, चना आदि) व अनुमानित क्विंटल का चयन करें।</li>
              <li><strong>उपार्जन केंद्र चुनें:</strong> अपने निकटतम मंडी या साइलो केंद्र का चयन करें।</li>
              <li><strong>दिनांक व समय स्लॉट चुनें:</strong> अपनी सुविधा अनुसार खाली समय अंतराल का चयन करें।</li>
              <li><strong>क्यूआर टोकन प्राप्त करें:</strong> बुकिंग पुष्टि के साथ डिजिटल टोकन व गेट पास डाउनलोड करें।</li>
              <li><strong>मंडी में तौल कराएं:</strong> समय पर पहुंचकर गेट पर क्यूआर दिखाएं, तौल कराएं और सीधे बैंक खाते में भुगतान प्राप्त करें।</li>
            </ol>
          </div>

        </div>

        {/* Right Column: Contact & Helpline */}
        <div>
          <div className="kisan-card" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={20} /> संपर्क एवं हेल्पलाइन
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#166534' }}>
              <div>
                <strong>राष्ट्रीय किसान कॉल सेंटर (Toll-Free):</strong>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', marginTop: '2px' }}>
                  1800-180-1551
                </div>
              </div>

              <div>
                <strong>मंडी तकनीकी सहायता ईमेल:</strong>
                <div style={{ fontWeight: 600 }}>support@kisankalyan.gov.in</div>
              </div>

              <div>
                <strong>कार्य समय:</strong>
                <div>प्रातः 08:00 से सायं 08:00 तक (सोमवार - शनिवार)</div>
              </div>

              <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '12px' }}>
                <strong>मंत्रालय पता:</strong>
                <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '4px' }}>
                  कृषि एवं किसान कल्याण मंत्रालय, कृषि भवन, नई दिल्ली - 110001
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
