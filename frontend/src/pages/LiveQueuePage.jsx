import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  RotateCw, 
  Zap, 
  Check, 
  ChevronRight, 
  Volume2, 
  Info,
  Building2,
  Calendar,
  Scale
} from 'lucide-react';
import mandiShed from '../assets/mandi_shed.png';
import cropWheat from '../assets/crop_wheat.png';
import cropMaize from '../assets/crop_maize.png';
import cropGram from '../assets/crop_gram.png';
import apmcBuilding from '../assets/apmc_building.png';

export default function LiveQueuePage() {
  const [refreshing, setRefreshing] = useState(false);

  const speakAnnouncement = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d8e5d3 0%, #e9f2e7 60%, #f4fbf7 100%)', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>

        {/* 3-Column Layout: Left Features | Center Main Monitor & Queue | Right Daily Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 240px', gap: '20px', alignItems: 'start' }}>
          
          {/* ================= LEFT SIDEBAR (Matching Screenshot) ================= */}
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '18px', lineHeight: 1.3 }}>
              “किसान की सुविधा हमारी प्राथमिकता”
            </h4>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#374151', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>रियल-टाइम कतार स्थिति</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>पारदर्शी प्रक्रिया</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>तेज और सरल सेवा</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>डिजिटल मंडी प्रबंधन</span>
              </div>
            </div>

            {/* Mandi/Tractor illustration at bottom */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <img src={apmcBuilding} alt="Mandi Management" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#017953', marginTop: '10px' }}>
                समृद्ध किसान <br /> समृद्ध भारत
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN: MAIN LIVE QUEUE MONITOR ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Top Monitor Header Bar */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '16px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={mandiShed} alt="Mandi Shed" style={{ width: '60px', height: '52px', objectFit: 'contain' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#017953', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                      LIVE MANDI FEED वास्तविक समय कतार स्थिति
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                    मंडी लाइव कतार मॉनिटर
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
                    चुनार कृषि उपज मंडी समिति, मिर्ज़ापुर (Mirzapur)
                  </div>
                </div>
              </div>

              {/* Centre Dropdown & Refresh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#017953" />
                  <span>चुनार कृषि उपज मंडी समिति (Mirzapur)</span>
                  <span style={{ fontSize: '0.7rem' }}>⌵</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  title="रिफ्रेश करें"
                >
                  <RotateCw size={16} color="#374151" className={refreshing ? 'spinning' : ''} />
                </button>
              </div>
            </div>

            {/* 4 Status Cards Row (Matching Screenshot 3) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              
              {/* Card 1: Aapka Token */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '14px 16px' }}>
                <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>आपका टोकन</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953', margin: '2px 0' }}>
                  A-107
                </div>
                <div style={{ fontSize: '0.74rem', color: '#374151', fontWeight: 600 }}>
                  Wheat (Gehun)
                </div>
                <span style={{ display: 'inline-block', fontSize: '0.68rem', background: '#017953', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginTop: '4px' }}>
                  ✓ Active
                </span>
              </div>

              {/* Card 2: Abhi Aap Se Pehle Hai */}
              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '14px 16px' }}>
                <span style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: 600 }}>अभी आप से पहले है</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', margin: '2px 0' }}>
                  A-103
                </div>
                <div style={{ fontSize: '0.74rem', background: '#dbeafe', color: '#1e40af', display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  काउंटर 2 पर
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                  2 टोकन बाकी
                </div>
              </div>

              {/* Card 3: Aapse Aage Kisan */}
              <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '16px', padding: '14px 16px' }}>
                <span style={{ fontSize: '0.74rem', color: '#854d0e', fontWeight: 600 }}>आपसे आगे किसान</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309', margin: '2px 0' }}>
                  4
                </div>
                <div style={{ fontSize: '0.74rem', color: '#713f12', fontWeight: 600 }}>
                  किसान कतार में
                </div>
              </div>

              {/* Card 4: Anumanit Pratiksha */}
              <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '16px', padding: '14px 16px' }}>
                <span style={{ fontSize: '0.74rem', color: '#9f1239', fontWeight: 600 }}>अनुमानित प्रतीक्षा</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48', margin: '2px 0' }}>
                  18 <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>min</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9f1239', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={13} /> <span>फास्ट प्रोसेसिंग</span>
                </div>
              </div>

            </div>

            {/* Active Weighbridges Section */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '18px 22px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} color="#017953" />
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    सक्रिय धर्मकांटा काउंटर (Active Weighbridges)
                  </h4>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#017953', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                  ((•)) 3 काउंटर कार्यरत
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {[
                  { name: 'काउंटर 1', status: 'Active', operator: 'Vikas Sharma', token: 'A-089' },
                  { name: 'काउंटर 2', status: 'Active', operator: 'Rajesh Verma', token: 'A-103', isCalling: true },
                  { name: 'काउंटर 3', status: 'Active', operator: 'Sanjay Kumar', token: 'A-095' }
                ].map((cnt) => (
                  <div key={cnt.name} style={{ border: cnt.isCalling ? '1.5px solid #017953' : '1px solid #e2e8f0', background: cnt.isCalling ? '#f0fdf4' : '#fafafa', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#111827' }}>{cnt.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#017953', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                        {cnt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 8px 0' }}>
                      👤 ऑपरेटर: {cnt.operator}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                      <span style={{ color: '#475569' }}>वर्तमान टोकन:</span>
                      <strong style={{ fontSize: '0.94rem', color: cnt.isCalling ? '#017953' : '#111827', background: cnt.isCalling ? '#dcfce7' : '#ffffff', border: '1px solid #cbd5e1', padding: '1px 8px', borderRadius: '6px' }}>
                        {cnt.token}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting Stream Table (8 Tokens List matching Screenshot 1 & 3) */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#017953" />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      कतार क्रम एवं टोकन सूची (Live Waiting Stream)
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>मंडी में क्रमानुसार चलने वाली कतार</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#017953', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                    ● Live अपडेट
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, background: '#f1f5f9', padding: '3px 10px', borderRadius: '12px' }}>
                    👥 कुल प्रतीक्षा: 8
                  </span>
                </div>
              </div>

              {/* Stream Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { pos: 1, token: 'A-103', name: 'सुरेश यादव', crop: 'गेहूं', icon: cropWheat, status: 'CALLED TO COUNTER 2', isCalling: true },
                  { pos: 2, token: 'A-104', name: 'मनोज तिवारी', crop: 'गेहूं', icon: cropWheat, status: 'Waiting (2 Ahead)' },
                  { pos: 3, token: 'A-105', name: 'देवेंद्र पाल', crop: 'गेहूं', icon: cropWheat, status: 'Waiting (3 Ahead)' },
                  { pos: 4, token: 'A-106', name: 'राजू शर्मा', crop: 'मक्का', icon: cropMaize, status: 'Waiting (4 Ahead)' },
                  { pos: 5, token: 'A-107', name: 'दिलीप बिन्द', isYou: true, crop: 'गेहूं', icon: cropWheat, status: 'Waiting (5 Ahead)' },
                  { pos: 6, token: 'A-104', name: 'रामेश्वर सिंह (Rameshwar Singh)', isYou: true, crop: 'गेहूं', icon: cropWheat, status: 'Waiting' },
                  { pos: 7, token: 'A-105', name: 'रामेश्वर सिंह (Rameshwar Singh)', isYou: true, crop: 'चना', icon: cropGram, status: 'Waiting' },
                  { pos: 8, token: 'A-107', name: 'रामेश्वर सिंह (Rameshwar Singh)', isYou: true, crop: 'चना', icon: cropGram, status: 'Waiting' }
                ].map((row) => (
                  <div 
                    key={row.pos + row.token + row.name}
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '40px 90px 1.4fr 100px 1.2fr', 
                      alignItems: 'center',
                      background: row.isCalling ? '#eff6ff' : (row.isYou ? '#f0fdf4' : '#ffffff'),
                      border: row.isCalling ? '1.5px solid #bfdbfe' : (row.isYou ? '1.5px solid #bbf7d0' : '1px solid #e5e7eb'),
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.86rem'
                    }}
                  >
                    {/* Pos */}
                    <div>
                      <span style={{ 
                        width: '26px', 
                        height: '26px', 
                        borderRadius: '50%', 
                        background: row.isCalling ? '#2563eb' : (row.isYou ? '#017953' : '#f1f5f9'), 
                        color: row.isCalling || row.isYou ? '#ffffff' : '#475569', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800, 
                        fontSize: '0.8rem' 
                      }}>
                        {row.pos}
                      </span>
                    </div>

                    {/* Token */}
                    <div>
                      <strong style={{ fontSize: '0.98rem', color: '#111827', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                        {row.token}
                      </strong>
                    </div>

                    {/* Farmer Name */}
                    <div>
                      {row.isYou && (
                        <span style={{ fontSize: '0.68rem', background: '#017953', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, marginRight: '6px' }}>
                          आप (You)
                        </span>
                      )}
                      <span style={{ fontWeight: row.isYou ? 800 : 600, color: row.isYou ? '#064e3b' : '#1e293b' }}>
                        {row.name}
                      </span>
                    </div>

                    {/* Crop */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={row.icon} alt={row.crop} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                      <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>{row.crop}</span>
                    </div>

                    {/* Status Button/Pill */}
                    <div style={{ textAlign: 'right' }}>
                      {row.isCalling ? (
                        <button 
                          onClick={() => speakAnnouncement("टोकन नंबर A-103, सुरेश यादव, कृपया काउंटर 2 पर जाएं")}
                          style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                        >
                          <span>📢 CALLED TO COUNTER 2</span>
                          <ChevronRight size={14} />
                        </button>
                      ) : (
                        <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={12} />
                          <span>{row.status}</span>
                          <ChevronRight size={13} color="#94a3b8" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Notice */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#065f46' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} color="#017953" />
                  <span><strong>सूचना:</strong> जैसे ही आपका टोकन नंबर बुलाया जाएगा, स्क्रीन पर प्रदर्शित किया जाएगा और आपको SMS/घोषणा के माध्यम से सूचित किया जाएगा !</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#017953' }}>
                  <Volume2 size={15} />
                  <span>स्वचालित घोषणाएं चालू हैं</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR: TODAY'S OVERVIEW ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Stats Box */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📊</span> <span>आज की झलक</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>कुल किसान:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>128</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>कुल खरीद:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>2,450 Q</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>औसत प्रतीक्षा:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>16 min</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>सक्रिय काउंटर:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>3/3</strong>
                </div>
              </div>
            </div>

            {/* Annadata Slogan Card */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '8px' }}>
                🌱
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', lineHeight: 1.3 }}>
                अन्नदाता <br /> देश की शान
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
