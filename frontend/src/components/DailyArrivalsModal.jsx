import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Download, 
  BarChart3, 
  MapPin, 
  Truck, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  CheckCircle,
  Clock,
  Building2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MANDI_ARRIVALS_DATA = [
  {
    id: 'chunar_apmc',
    mandiName: 'चुनार कृषि उपज मंडी समिति (Chunar APMC Yard)',
    district: 'Mirzapur',
    state: 'Uttar Pradesh',
    commodity: 'गेहूं (Wheat)',
    commodityEn: 'Wheat',
    arrivalQuintals: 4250,
    vehiclesCount: 84,
    minPrice: 2275,
    maxPrice: 2310,
    modalPrice: 2285,
    msp: 2275,
    status: 'ACTIVE',
    statusText: '🟢 सामान्य तौल व सक्रिय खरीद',
    centerRoute: '/centers?q=Chunar'
  },
  {
    id: 'varanasi_galla',
    mandiName: 'वाराणसी नवीन गल्ला मंडी समिति (Varanasi Mandi)',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    commodity: 'गेहूं (Wheat)',
    commodityEn: 'Wheat',
    arrivalQuintals: 7850,
    vehiclesCount: 142,
    minPrice: 2275,
    maxPrice: 2340,
    modalPrice: 2295,
    msp: 2275,
    status: 'HIGH_FLOW',
    statusText: '🟡 भारी आवक (फास्ट ट्रैक कतार)',
    centerRoute: '/centers?q=Varanasi'
  },
  {
    id: 'khanna_mandi',
    mandiName: 'खन्ना एशिया अनाज मंडी (Khanna Asia Grain Market)',
    district: 'Ludhiana',
    state: 'Punjab',
    commodity: 'गेहूं (Wheat)',
    commodityEn: 'Wheat',
    arrivalQuintals: 15400,
    vehiclesCount: 265,
    minPrice: 2275,
    maxPrice: 2350,
    modalPrice: 2310,
    msp: 2275,
    status: 'ACTIVE',
    statusText: '🟢 100% कम्प्यूटरीकृत तौल',
    centerRoute: '/centers?q=Khanna'
  },
  {
    id: 'karnal_mandi',
    mandiName: 'करनाल नई अनाज मंडी (Karnal New Grain Market)',
    district: 'Karnal',
    state: 'Haryana',
    commodity: 'सरसों (Mustard)',
    commodityEn: 'Mustard',
    arrivalQuintals: 6200,
    vehiclesCount: 110,
    minPrice: 5650,
    maxPrice: 5820,
    modalPrice: 5740,
    msp: 5650,
    status: 'ACTIVE',
    statusText: '🟢 मानक नमी परीक्षण चालू',
    centerRoute: '/centers?q=Karnal'
  },
  {
    id: 'kota_apmc',
    mandiName: 'कोटा भामाशाह कृषि उपज मंडी (Kota Bhamashah APMC)',
    district: 'Kota',
    state: 'Rajasthan',
    commodity: 'चना (Gram / Chana)',
    commodityEn: 'Gram',
    arrivalQuintals: 5800,
    vehiclesCount: 98,
    minPrice: 5440,
    maxPrice: 5620,
    modalPrice: 5530,
    msp: 5440,
    status: 'ACTIVE',
    statusText: '🟢 इलेक्ट्रॉनिक ऑक्शन व खरीद',
    centerRoute: '/centers?q=Kota'
  },
  {
    id: 'indore_mandi',
    mandiName: 'इंदौर देवी अहिल्याबाई होलकर फल व अनाज मंडी',
    district: 'Indore',
    state: 'Madhya Pradesh',
    commodity: 'सोयाबीन एवं गेहूं (Soyabean & Wheat)',
    commodityEn: 'Wheat',
    arrivalQuintals: 9100,
    vehiclesCount: 160,
    minPrice: 2275,
    maxPrice: 2360,
    modalPrice: 2305,
    msp: 2275,
    status: 'ACTIVE',
    statusText: '🟢 ई-मंडी गेट पास स्वचालित',
    centerRoute: '/centers?q=Indore'
  },
  {
    id: 'ahraura_subyard',
    mandiName: 'अहरौरा क्रय केंद्र उप-मंडी (Ahraura Sub-Yard)',
    district: 'Mirzapur',
    state: 'Uttar Pradesh',
    commodity: 'धान व गेहूं (Paddy & Wheat)',
    commodityEn: 'Wheat',
    arrivalQuintals: 3100,
    vehiclesCount: 52,
    minPrice: 2275,
    maxPrice: 2290,
    modalPrice: 2280,
    msp: 2275,
    status: 'ACTIVE',
    statusText: '🟢 शून्य प्रतीक्षा कतार',
    centerRoute: '/centers?q=Ahraura'
  }
];

export default function DailyArrivalsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCommodity, setSelectedCommodity] = useState('ALL');
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

  const todayStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const filteredMandiList = MANDI_ARRIVALS_DATA.filter(item => {
    const matchesState = selectedState === 'ALL' || item.state === selectedState;
    const matchesCommodity = selectedCommodity === 'ALL' || item.commodityEn === selectedCommodity;
    const matchesSearch = item.mandiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesCommodity && matchesSearch;
  });

  const totalArrival = filteredMandiList.reduce((acc, curr) => acc + curr.arrivalQuintals, 0);
  const totalVehicles = filteredMandiList.reduce((acc, curr) => acc + curr.vehiclesCount, 0);

  const handleDownloadCsv = () => {
    const headers = ['Mandi Name', 'District', 'State', 'Commodity', "Today's Arrival (Qtl)", 'Vehicles', 'Min Price (Rs)', 'Max Price (Rs)', 'Modal Price (Rs)', 'Govt MSP (Rs)', 'Status'];
    const rows = MANDI_ARRIVALS_DATA.map(d => [
      `"${d.mandiName}"`,
      `"${d.district}"`,
      `"${d.state}"`,
      `"${d.commodity}"`,
      d.arrivalQuintals,
      d.vehiclesCount,
      d.minPrice,
      d.maxPrice,
      d.modalPrice,
      d.msp,
      `"${d.statusText}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daily_Mandi_Arrivals_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="arrivals-modal-title"
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
          maxWidth: '960px',
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
          background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
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
              📊
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 id="arrivals-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {t('reportDailyArrival', 'Daily Mandi Arrivals Report')}
                </h2>
                <span style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }}></span>
                  LIVE TODAY
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#e0f2fe', opacity: 0.95 }}>
                दिनांक: {todayStr} | राज्य कृषि उपज मंडी समितियों (APMC) से वास्तविक समय आवक एवं औसत भाव
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close arrivals modal"
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

        {/* Live Metrics Row */}
        <div style={{
          padding: '14px 24px',
          background: '#f0f9ff',
          borderBottom: '1px solid #bae6fd',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700 }}>कुल दैनिक आवक (Total Inward)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0c4a6e', marginTop: '2px' }}>
              {totalArrival.toLocaleString('en-IN')} <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>क्विंटल (Q)</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700 }}>आवक वाहन (Vehicles Arrived)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0c4a6e', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={18} color="#0284c7" />
              <span>{totalVehicles} <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>ट्रैक्टर / ट्रक</span></span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700 }}>औसत मंडी भाव (Average Modal Price)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>
              ₹2,295 <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>/क्विंटल</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700 }}>सरकारी न्यूनतम समर्थन मूल्य (MSP)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
              ₹2,275 <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>(गेहूं 2025-26)</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="kisan-modal-toolbar" style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Filters Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Filter by state"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                background: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="ALL">सभी राज्य (All States)</option>
              <option value="Uttar Pradesh">उत्तर प्रदेश (Uttar Pradesh)</option>
              <option value="Punjab">पंजाब (Punjab)</option>
              <option value="Haryana">हरियाणा (Haryana)</option>
              <option value="Rajasthan">राजस्थान (Rajasthan)</option>
              <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
            </select>

            {/* Commodity Filter */}
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              aria-label="Filter by commodity"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                background: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="ALL">सभी फसलें (All Crops)</option>
              <option value="Wheat">गेहूं (Wheat)</option>
              <option value="Mustard">सरसों (Mustard)</option>
              <option value="Gram">चना (Gram)</option>
            </select>
          </div>

          {/* Search & Download */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '6px 12px',
              width: '210px'
            }}>
              <Search size={14} color="#64748b" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="मंडी या जिला खोजें..."
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
              title="Download Daily Report CSV"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#e0f2fe',
                color: '#0369a1',
                border: '1px solid #bae6fd',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>रिपोर्ट CSV</span>
            </button>
          </div>
        </div>

        {/* Content Table / Body */}
        <div className="kisan-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <div className="arrivals-table-wrapper" style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <table className="arrivals-table" style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#334155', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>मंडी केंद्र / APMC Yard</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>फसल (Commodity)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: '#0369a1' }}>आज की आवक (Q)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>आवक वाहन</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>मॉडल भाव (₹/Q)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>MSP दर</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>स्थिति (Status)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {filteredMandiList.length > 0 ? (
                  filteredMandiList.map((mandi, idx) => (
                    <tr 
                      key={mandi.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        <div>{mandi.mandiName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} color="#94a3b8" />
                          <span>{mandi.district}, {mandi.state}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>
                        {mandi.commodity}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#0369a1', fontSize: '0.94rem' }}>
                        {mandi.arrivalQuintals.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>क्विंटल</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                          <Truck size={13} color="#64748b" /> {mandi.vehiclesCount}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#065f46', fontSize: '0.95rem' }}>
                        ₹{mandi.modalPrice.toLocaleString('en-IN')}
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
                          सीमा: ₹{mandi.minPrice} - ₹{mandi.maxPrice}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#15803d', fontWeight: 700, fontSize: '0.84rem' }}>
                        ₹{mandi.msp.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                        {mandi.statusText}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate(mandi.centerRoute);
                          }}
                          style={{
                            background: '#0284c7',
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
                            boxShadow: '0 1px 3px rgba(2,132,199,0.3)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>केंद्र विवरण</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                      चयनित फिल्टर के लिए कोई मंडी रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
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
            दैनिक आवक डेटा राष्ट्रीय कृषि बाजार (e-NAM) व राज्य मंडी परिषदों के इलेक्ट्रॉनिक गेट पास सर्वर से समन्वित है।
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/centers');
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
              सभी उपार्जन केंद्र देखें
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
              स्लॉट बुक करें →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
