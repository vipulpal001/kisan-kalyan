import React, { useState, useEffect } from 'react';
import { 
  X, 
Search,} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WAREHOUSE_DATA = [
  {
    id: 'wh_varanasi_cwc',
    name: 'केंद्रीय भंडारण निगम (CWC) क्षेत्रीय वेयरहाउस, वाराणसी',
    type: 'Central Warehousing Corporation (CWC)',
    location: 'Varanasi, Uttar Pradesh',
    totalCapacityMT: 25000,
    occupiedMT: 18200,
    availableMT: 6800,
    ratePerQtlPerDay: '₹0.18',
    wdraAccredited: true,
    electronicNWR: true,
    commodities: 'Wheat, Rice, Gram'
  },
  {
    id: 'wh_mirzapur_swc',
    name: 'उत्तर प्रदेश राज्य भंडारण निगम (UPSWC) डिपो, चुनार',
    type: 'State Warehousing Corporation (UPSWC)',
    location: 'Chunar, Mirzapur, UP',
    totalCapacityMT: 12000,
    occupiedMT: 8400,
    availableMT: 3600,
    ratePerQtlPerDay: '₹0.16',
    wdraAccredited: true,
    electronicNWR: true,
    commodities: 'Wheat, Mustard, Pulses'
  },
  {
    id: 'wh_khanna_silo',
    name: 'आधुनिक स्टील साइलो कॉम्प्लेक्स (Steel Silo Hub), खन्ना',
    type: 'Modern Mechanized Silo Hub',
    location: 'Khanna, Ludhiana, Punjab',
    totalCapacityMT: 50000,
    occupiedMT: 31000,
    availableMT: 19000,
    ratePerQtlPerDay: '₹0.20',
    wdraAccredited: true,
    electronicNWR: true,
    commodities: 'Wheat Bulk'
  },
  {
    id: 'wh_karnal_swc',
    name: 'हरियाणा वेयरहाउसिंग कॉर्पोरेशन (HWC) साइलो डिपो, करनाल',
    type: 'Haryana Warehousing Corporation (HWC)',
    location: 'Karnal, Haryana',
    totalCapacityMT: 20000,
    occupiedMT: 14500,
    availableMT: 5500,
    ratePerQtlPerDay: '₹0.18',
    wdraAccredited: true,
    electronicNWR: true,
    commodities: 'Mustard, Wheat, Paddy'
  },
  {
    id: 'wh_kota_rswc',
    name: 'राजस्थान राज्य वेयरहाउसिंग कॉर्पोरेशन (RSWC), कोटा',
    type: 'Rajasthan State Warehousing Corporation',
    location: 'Kota, Rajasthan',
    totalCapacityMT: 18000,
    occupiedMT: 12200,
    availableMT: 5800,
    ratePerQtlPerDay: '₹0.17',
    wdraAccredited: true,
    electronicNWR: true,
    commodities: 'Gram, Soyabean, Mustard'
  }
];

export default function WarehouseCapacityModal({ isOpen, onClose }) {
  // navigate not needed
  const { t } = useLanguage();
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

  const filteredWarehouses = WAREHOUSE_DATA.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCap = WAREHOUSE_DATA.reduce((acc, c) => acc + c.totalCapacityMT, 0);
  const totalOccupied = WAREHOUSE_DATA.reduce((acc, c) => acc + c.occupiedMT, 0);
  const totalAvail = totalCap - totalOccupied;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="warehouse-modal-title"
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
        {/* Header */}
        <div className="kisan-modal-header" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
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
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 id="warehouse-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {t('reportWarehouseStatus', 'Warehouse Capacity & E-Godown Storage')}
                </h2>
                <span style={{
                  background: '#60a5fa',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  WDRA Certified
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#bfdbfe', opacity: 0.95 }}>
                वैज्ञानिक भंडारण, साइलो एवं नेगोशिएबल वेयरहाउस रसीद (e-NWR) क्षमता स्थिति
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close warehouse modal"
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
              color: '#ffffff'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Capacity Summary Stats */}
        <div style={{
          padding: '14px 24px',
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>कुल वैज्ञानिक क्षमता (Total Capacity)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e3a8a', marginTop: '2px' }}>
              {(totalCap / 1000).toFixed(1)}k <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>मीट्रिक टन (MT)</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>उपलब्ध खाली क्षमता (Available Space)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
              {(totalAvail / 1000).toFixed(1)}k <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>मीट्रिक टन (MT)</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>दैनिक भंडारण शुल्क (Rent)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#b45309', marginTop: '2px' }}>
              ₹0.18 <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>/क्विंटल/दिन</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>बैंक ऋण सुविधा (Pledge Loan)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857', marginTop: '2px' }}>
              75% तक <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>(e-NWR रसीद पर)</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="kisan-modal-toolbar" style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '6px 12px',
            width: '260px'
          }}>
            <Search size={14} color="#64748b" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="वेयरहाउस या स्थान खोजें..."
              style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '100%', color: '#1e293b' }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            WDRA मान्यता प्राप्त आधुनिक भंडार केंद्र
          </span>
        </div>

        {/* Warehouse List */}
        <div className="kisan-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredWarehouses.map(wh => {
              const pct = Math.round((wh.occupiedMT / wh.totalCapacityMT) * 100);
              return (
                <div key={wh.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                        {wh.name}
                      </h4>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {wh.type} • 📍 {wh.location} • फसलें: {wh.commodities}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                        शुल्क: {wh.ratePerQtlPerDay}/दिन
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px', fontWeight: 600 }}>
                      <span style={{ color: '#64748b' }}>भरी हुई क्षमता: {wh.occupiedMT.toLocaleString()} MT ({pct}%)</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>खाली स्थान: {wh.availableMT.toLocaleString()} MT</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? '#f59e0b' : '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            WDRA के अंतर्गत जमा उपज पर बिना बेचे तुरंत 75% तक बैंक ऋण प्राप्त किया जा सकता है।
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            समझ गया (OK)
          </button>
        </div>
      </div>
    </div>
  );
}
