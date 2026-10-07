import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Download, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MSP_DATA = [
  {
    id: 'wheat',
    nameHi: 'गेहूं (Wheat)',
    nameEn: 'Wheat',
    season: 'Rabi 2025-26',
    seasonType: 'Rabi',
    msp2025: 2275,
    msp2024: 2125,
    increase: 150,
    costOfProduction: 1105,
    returnOverCost: '105.8%',
    moistureLimit: '12.0%',
    foreignMatter: '0.75%',
    recommended: true
  },
  {
    id: 'mustard',
    nameHi: 'सरसों एवं तोरिया (Mustard & Rapeseed)',
    nameEn: 'Mustard & Rapeseed',
    season: 'Rabi 2025-26',
    seasonType: 'Rabi',
    msp2025: 5650,
    msp2024: 5450,
    increase: 200,
    costOfProduction: 2855,
    returnOverCost: '97.9%',
    moistureLimit: '8.0%',
    foreignMatter: '1.0%',
    recommended: true
  },
  {
    id: 'gram',
    nameHi: 'चना (Gram / Chana)',
    nameEn: 'Gram (Chana)',
    season: 'Rabi 2025-26',
    seasonType: 'Rabi',
    msp2025: 5440,
    msp2024: 5335,
    increase: 105,
    costOfProduction: 3206,
    returnOverCost: '69.7%',
    moistureLimit: '10.0%',
    foreignMatter: '1.0%',
    recommended: true
  },
  {
    id: 'barley',
    nameHi: 'जौ (Barley)',
    nameEn: 'Barley',
    season: 'Rabi 2025-26',
    seasonType: 'Rabi',
    msp2025: 1850,
    msp2024: 1735,
    increase: 115,
    costOfProduction: 1158,
    returnOverCost: '59.8%',
    moistureLimit: '12.0%',
    foreignMatter: '1.0%',
    recommended: false
  },
  {
    id: 'lentil',
    nameHi: 'मसूर (Lentil / Masur)',
    nameEn: 'Lentil (Masur)',
    season: 'Rabi 2025-26',
    seasonType: 'Rabi',
    msp2025: 6425,
    msp2024: 6000,
    increase: 425,
    costOfProduction: 3405,
    returnOverCost: '88.7%',
    moistureLimit: '10.0%',
    foreignMatter: '0.75%',
    recommended: false
  },
  {
    id: 'rice',
    nameHi: 'धान (Paddy / Rice - Common)',
    nameEn: 'Paddy (Common)',
    season: 'Kharif 2025-26',
    seasonType: 'Kharif',
    msp2025: 2300,
    msp2024: 2183,
    increase: 117,
    costOfProduction: 1533,
    returnOverCost: '50.0%',
    moistureLimit: '17.0%',
    foreignMatter: '1.0%',
    recommended: true
  },
  {
    id: 'rice_grade_a',
    nameHi: 'धान ग्रेड-ए (Paddy - Grade A)',
    nameEn: 'Paddy (Grade A)',
    season: 'Kharif 2025-26',
    seasonType: 'Kharif',
    msp2025: 2320,
    msp2024: 2203,
    increase: 117,
    costOfProduction: 1533,
    returnOverCost: '51.3%',
    moistureLimit: '17.0%',
    foreignMatter: '0.75%',
    recommended: false
  },
  {
    id: 'maize',
    nameHi: 'मक्का (Maize)',
    nameEn: 'Maize',
    season: 'Kharif 2025-26',
    seasonType: 'Kharif',
    msp2025: 2090,
    msp2024: 1962,
    increase: 128,
    costOfProduction: 1394,
    returnOverCost: '50.0%',
    moistureLimit: '14.0%',
    foreignMatter: '1.2%',
    recommended: false
  },
  {
    id: 'cotton',
    nameHi: 'कपास (Cotton - Medium Staple)',
    nameEn: 'Cotton (Medium Staple)',
    season: 'Kharif 2025-26',
    seasonType: 'Kharif',
    msp2025: 7121,
    msp2024: 6620,
    increase: 501,
    costOfProduction: 4747,
    returnOverCost: '50.0%',
    moistureLimit: '8.0%',
    foreignMatter: '2.0%',
    recommended: false
  },
  {
    id: 'soyabean',
    nameHi: 'सोयाबीन पीला (Soyabean Yellow)',
    nameEn: 'Soyabean Yellow',
    season: 'Kharif 2025-26',
    seasonType: 'Kharif',
    msp2025: 4892,
    msp2024: 4600,
    increase: 292,
    costOfProduction: 3261,
    returnOverCost: '50.0%',
    moistureLimit: '12.0%',
    foreignMatter: '1.0%',
    recommended: false
  }
];

export default function MspRatesModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [seasonFilter, setSeasonFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('modal-open');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredData = MSP_DATA.filter(item => {
    const matchesSeason = seasonFilter === 'ALL' || item.seasonType === seasonFilter;
    const matchesSearch = item.nameHi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeason && matchesSearch;
  });

  const handleDownloadCsv = () => {
    const headers = ['Commodity', 'Season', 'MSP 2025-26 (Rs/Qtl)', 'MSP 2024-25 (Rs/Qtl)', 'Increase (Rs)', 'Cost of Production (Rs)', 'Return over Cost', 'Max Moisture Limit'];
    const rows = MSP_DATA.map(d => [
      `"${d.nameEn}"`,
      `"${d.season}"`,
      d.msp2025,
      d.msp2024,
      d.increase,
      d.costOfProduction,
      `"${d.returnOverCost}"`,
      `"${d.moistureLimit}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MSP_Rates_Government_Notified_2025-26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBookSlotForCrop = (cropId) => {
    onClose();
    navigate('/farmer/book-slot', { state: { selectedCrop: cropId } });
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="msp-modal-title"
      className="kisan-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="kisan-modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s ease-out'
        }}
      >
        {/* Header Strip */}
        <div className="kisan-modal-header" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              🌾
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 id="msp-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {t('serviceMspRates', 'Minimum Support Price (MSP) Rates 2025-26')}
                </h2>
                <span style={{
                  background: '#fef08a',
                  color: '#854d0e',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  CCEA Approved
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#d1fae5', opacity: 0.95 }}>
                भारत सरकार कृषि एवं किसान कल्याण मंत्रालय द्वारा अधिसूचित न्यूनतम समर्थन मूल्य
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close MSP modal"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="kisan-modal-toolbar" style={{
          padding: '16px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Season Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
              सीजन (Season):
            </span>
            {[
              { id: 'ALL', label: 'All Crops' },
              { id: 'Rabi', label: 'Rabi 2025-26' },
              { id: 'Kharif', label: 'Kharif 2025-26' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSeasonFilter(pill.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: seasonFilter === pill.id ? '#047857' : '#cbd5e1',
                  background: seasonFilter === pill.id ? '#047857' : '#ffffff',
                  color: seasonFilter === pill.id ? '#ffffff' : '#334155',
                  fontSize: '0.78rem',
                  fontWeight: seasonFilter === pill.id ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Search Input & Download Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '6px 12px',
              width: '200px'
            }}>
              <Search size={14} color="#64748b" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="फसल खोजें (Search)..."
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8rem',
                  width: '100%',
                  color: '#1e293b'
                }}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              title="Download MSP Rates Notification (CSV)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>CSV एक्सपोर्ट</span>
            </button>
          </div>
        </div>

        {/* Content Table / Body */}
        <div className="kisan-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <div className="msp-table-wrapper" style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <table className="msp-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>फसल / Commodity</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>सीजन / Season</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>MSP 2025-26</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#64748b' }}>MSP 2024-25</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#047857' }}>वृद्धि (Increase)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>लागत पर लाभ</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>मानक नमी (FAQ)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((crop, idx) => (
                    <tr 
                      key={crop.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem' }}>
                            {crop.id === 'wheat' ? '🌾' :
                             crop.id.includes('rice') ? '🍚' :
                             crop.id === 'mustard' ? '🌼' :
                             crop.id === 'gram' ? '🫘' :
                             crop.id === 'maize' ? '🌽' :
                             crop.id === 'cotton' ? '☁️' : '🌱'}
                          </span>
                          <div>
                            <div>{crop.nameHi}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{crop.nameEn}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>
                        <span style={{
                          background: crop.seasonType === 'Rabi' ? '#ecfdf5' : '#eff6ff',
                          color: crop.seasonType === 'Rabi' ? '#065f46' : '#1d4ed8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.74rem'
                        }}>
                          {crop.season}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#064e3b', fontSize: '0.98rem' }}>
                        ₹{crop.msp2025.toLocaleString('en-IN')}<span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b' }}>/Q</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.84rem' }}>
                        ₹{crop.msp2024.toLocaleString('en-IN')}/Q
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.76rem'
                        }}>
                          +₹{crop.increase}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#1e293b', fontWeight: 700, fontSize: '0.82rem' }}>
                        <span style={{ color: '#047857' }}>{crop.returnOverCost}</span>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>लागत: ₹{crop.costOfProduction}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>
                        <div>नमी ≤ {crop.moistureLimit}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>विदेशी पदार्थ ≤ {crop.foreignMatter}</div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleBookSlotForCrop(crop.id)}
                          style={{
                            background: '#047857',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 1px 3px rgba(4,120,87,0.3)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>स्लॉट बुक करें</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                      कोई मिलान वाली फसल नहीं मिली। कृपया अन्य शब्द से खोजें।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Official Guarantee Highlights Banner */}
          <div style={{
            marginTop: '20px',
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#064e3b' }}>
                  100% सरकारी खरीद गारंटी
                </div>
                <div style={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.35 }}>
                  अधिसूचित खरीद केंद्रों पर सभी पंजीकृत किसानों से मानक अनुसार पूर्ण MSP पर क्रय।
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <TrendingUp size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#064e3b' }}>
                  48 घंटे में सीधा बैंक भुगतान (DBT)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.35 }}>
                  धर्मकांटा तौल व जे-फॉर्म जारी होने के उपरांत राशि सीधे आधार लिंक बैंक खाते में।
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#064e3b' }}>
                  शून्य कमीशन व बिचौलिया मुक्त
                </div>
                <div style={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.35 }}>
                  पारदर्शी इलेक्ट्रॉनिक तौल, ई-पर्ची व डिजिटल ट्रैकिंग।
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            स्रोत: कृषि लागत एवं मूल्य आयोग (CACP), कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/help#quality');
              }}
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              गुणवत्ता एवं FAQ देखें
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/farmer/book-slot');
              }}
              style={{
                background: '#047857',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(4,120,87,0.3)'
              }}
            >
              स्लॉट बुकिंग पर जाएं →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
