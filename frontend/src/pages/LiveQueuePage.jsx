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
Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import mandiShed from '../assets/mandi_shed.png';
import cropWheat from '../assets/crop_wheat.png';
import cropMaize from '../assets/crop_maize.png';
import cropGram from '../assets/crop_gram.png';
import apmcBuilding from '../assets/apmc_building.png';

export default function LiveQueuePage() {
  const { user } = useAuth();
  const { activeBooking, advanceQueueStage } = useBooking();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const tokenNum = activeBooking?.tokenNumber || 'WHT-042';
  const nowServingToken = activeBooking?.currentServingToken || 'WHT-037';
  const farmerName = activeBooking?.farmerName || user?.name || user?.username || t('farmerAccount', 'किसान भाई (Farmer)');
  const cropDisplay = activeBooking?.cropName || t('cropWheat', 'गेहूं (Wheat)');
  const queuePos = activeBooking?.queuePosition || 6;
  const farmersAhead = activeBooking?.farmersAhead !== undefined ? activeBooking.farmersAhead : 5;
  const waitMinutes = activeBooking?.estimatedWaitMinutes !== undefined ? activeBooking.estimatedWaitMinutes : 25;
  const counterName = activeBooking?.counterName || `${t('assignedCounter', 'काउंटर')} 02`;
  const centerName = activeBooking?.centerName || 'गाज़ियाबाद गेहूं खरीद केंद्र (Ghaziabad Procurement Centre)';
  const _currentStage = activeBooking?.queueStage || 'QUALITY_CHECK';

  // Auto-refresh polling every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
    setLastUpdated(new Date().toLocaleTimeString());
    setTimeout(() => setRefreshing(false), 600);
  };


  return (
    <div style={{ 
      background: 'transparent', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative'
    }}>
      <div className="portal-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>

        {/* 3-Column Layout: Left Features | Center Main Monitor & Queue | Right Daily Overview */}
        <div className="live-queue-3col-grid">
          
          {/* ================= LEFT SIDEBAR (Matching Screenshot) ================= */}
          <div className="live-queue-left-sidebar" style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '18px', lineHeight: 1.3, wordBreak: 'break-word' }}>
              {t('queueTagline', '“किसान की सुविधा हमारी प्राथमिकता”')}
            </h4>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#374151', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{t('realtimeQueue', 'रियल-टाइम कतार स्थिति')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{t('transparentProcess', 'पारदर्शी प्रक्रिया')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{t('fastDbt', 'त्वरित डीबीटी भुगतान')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{t('weighbridgeTracking', 'धर्मकांटा तौल ट्रैकिंग')}</span>
              </div>
            </div>

            {/* Mandi/Tractor illustration at bottom */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <img src={apmcBuilding} alt="Mandi Management" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#017953', marginTop: '10px' }}>
                {t('sloganTop', 'समृद्ध किसान')} <br /> {t('sloganBottom', 'समृद्ध भारत')}
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN: MAIN LIVE QUEUE MONITOR ================= */}
          <div className="live-queue-main-col" style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
            
            {/* Top Monitor Header Bar */}
            <div className="live-queue-header-bar" style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '16px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={mandiShed} alt="Mandi Shed" style={{ width: '60px', height: '52px', objectFit: 'contain' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#017953', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                      DEMO APMC FEED • {t('realtimeQueue', 'वास्तविक समय कतार स्थिति')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                    {t('liveQueueToken', 'मंडी लाइव कतार मॉनिटर')}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
                    {centerName}
                  </div>
                </div>
              </div>

              {/* Centre Dropdown & Refresh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#017953" />
                  <span>{centerName}</span>
                  <span style={{ fontSize: '0.7rem' }}>⌵</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  title={t('searchClear', 'रिफ्रेश करें')}
                >
                  <RotateCw size={16} color="#374151" className={refreshing ? 'spinning' : ''} />
                </button>
              </div>
            </div>

            {/* 5 Status Cards Row (Section 7 Exact Requirements) */}
            <div className="live-queue-status-cards">
              
              {/* Card 1: YOUR TOKEN */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>{t('yourTokenNumber', 'YOUR TOKEN')}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953', margin: '2px 0' }}>
                  {tokenNum}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#374151', fontWeight: 600 }}>
                  {cropDisplay}
                </div>
                <span style={{ display: 'inline-block', fontSize: '0.66rem', background: '#017953', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginTop: '4px' }}>
                  ● {t('statusActive', 'Active')} (Pos {queuePos})
                </span>
              </div>

              {/* Card 2: NOW SERVING */}
              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>{t('nowCallingToken', 'NOW SERVING')}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', margin: '2px 0' }}>
                  {nowServingToken}
                </div>
                <div style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  {counterName.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                  {t('stageGross', 'धर्मकांटा तौल जारी')}
                </div>
              </div>

              {/* Card 3: AHEAD OF YOU */}
              <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#854d0e', fontWeight: 700, textTransform: 'uppercase' }}>{t('farmersAheadCount', 'AHEAD OF YOU')}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309', margin: '2px 0' }}>
                  {farmersAhead}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#713f12', fontWeight: 700 }}>
                  Farmers
                </div>
                <div style={{ fontSize: '0.68rem', color: '#854d0e', marginTop: '4px' }}>
                  In Queue
                </div>
              </div>

              {/* Card 4: ESTIMATED WAIT */}
              <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase' }}>{t('estWaitTime', 'ESTIMATED WAIT')}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48', margin: '2px 0' }}>
                  ~{waitMinutes} <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>min</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9f1239', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Zap size={12} /> <span>{t('fastDbt', 'फास्ट लेन')}</span>
                </div>
              </div>

              {/* Card 5: COUNTER NUMBER */}
              <div style={{ background: '#f3e8ff', border: '1.5px solid #d8b4fe', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>{t('assignedCounter', 'COUNTER')}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7e22ce', margin: '4px 0' }}>
                  Counter 02
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b21a8', fontWeight: 700 }}>
                  धर्मकांटा 2
                </div>
                <div style={{ fontSize: '0.66rem', color: '#7e22ce', marginTop: '4px' }}>
                  Rajesh Verma
                </div>
              </div>

            </div>

            {/* Real-Time Queue Stages Progress Tracker (Section 6) */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #a7f3d0', padding: '18px 22px', boxShadow: '0 4px 16px rgba(1, 121, 83, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                      {t('queueLifecycleStages', 'कतार प्रगति चक्र (Real-Time Queue Lifecycle Stages)')}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {lastUpdated} • {t('myToken', 'टोकन')} {tokenNum}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => advanceQueueStage()}
                    style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('advanceStageSimulate', 'अगला चरण सिम्युलेट करें (Advance Stage) →')}
                  </button>
                </div>
              </div>

              {/* Progress Flow Banner */}
              <div className="queue-stages-flow">
                <span style={{ color: '#017953', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} strokeWidth={3} /> {t('stepSlotBooked', 'Booking Confirmed')}
                </span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#017953', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} strokeWidth={3} /> {t('stepArrived', 'Farmer Arrived')}
                </span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#017953', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} strokeWidth={3} /> {t('verificationDeadline', 'Verification')}
                </span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#2563eb', fontWeight: 900, background: '#dbeafe', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>●</span> {t('stepQualityCheck', 'Quality Check')} ({t('statusActive', 'सक्रिय')})
                </span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>○ {t('stepWeighment', 'Weighing')}</span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>○ {t('navProcurementStatus', 'Procurement')}</span>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>○ {t('stepPayment', 'Payment')}</span>
              </div>
            </div>

            {/* Active Weighbridges Section */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '18px 22px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} color="#017953" />
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {t('activeWeighbridges', 'सक्रिय धर्मकांटा काउंटर (Active Weighbridges)')}
                  </h4>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#017953', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                  ((•)) {t('activeOperationalCounters', '3 काउंटर कार्यरत')}
                </span>
              </div>

              <div className="live-queue-counters-grid">
                {[
                  { name: `${t('assignedCounter', 'काउंटर')} 1`, status: t('statusActive', 'Active'), operator: 'Vikas Sharma', token: 'T-114-28' },
                  { name: `${t('assignedCounter', 'काउंटर')} 2`, status: t('statusActive', 'Active'), operator: 'Rajesh Verma', token: 'T-114-29', isCalling: true },
                  { name: `${t('assignedCounter', 'काउंटर')} 3`, status: t('statusActive', 'Active'), operator: 'Sanjay Kumar', token: 'T-114-27' }
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
                      👤 {t('operatorLabel', 'ऑपरेटर')}: {cnt.operator}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                      <span style={{ color: '#475569' }}>{t('currentTokenLabel', 'वर्तमान टोकन')}:</span>
                      <strong style={{ fontSize: '0.94rem', color: cnt.isCalling ? '#017953' : '#111827', background: cnt.isCalling ? '#dcfce7' : '#ffffff', border: '1px solid #cbd5e1', padding: '1px 8px', borderRadius: '6px' }}>
                        {cnt.token}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting Stream Table (Unified Booking with No Duplicates) */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#017953" />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      {t('liveWaitingStream', 'कतार क्रम एवं टोकन सूची (Live Waiting Stream)')}
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{t('sequentialQueueNotice', 'मंडी में क्रमानुसार चलने वाली कतार')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#017953', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                    ● {t('liveUpdateTag', 'Live अपडेट')}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, background: '#f1f5f9', padding: '3px 10px', borderRadius: '12px' }}>
                    👥 {t('totalWaitingCount', 'कुल प्रतीक्षा')}: 6
                  </span>
                </div>
              </div>

              {/* Stream Rows */}
              <div className="live-queue-table-scroll">
                <div className="live-queue-stream-list">
                {[
                  { pos: 1, token: 'T-114-29', name: 'सुरेश यादव', crop: t('cropWheat', 'गेहूं'), icon: cropWheat, status: t('calledToCounter2', 'CALLED TO COUNTER 2'), isCalling: true },
                  { pos: 2, token: tokenNum, name: farmerName, isYou: true, crop: t('cropWheat', 'गेहूं'), icon: cropWheat, status: `${t('statusInQueue', 'In Queue')} (1 ${t('farmersAhead', 'आगे')})` },
                  { pos: 3, token: 'T-114-31', name: 'मनोज तिवारी', crop: t('cropWheat', 'गेहूं'), icon: cropWheat, status: `${t('statusInQueue', 'In Queue')} (2 ${t('farmersAhead', 'आगे')})` },
                  { pos: 4, token: 'T-114-32', name: 'देवेंद्र पाल', crop: t('cropWheat', 'गेहूं'), icon: cropWheat, status: `${t('statusInQueue', 'In Queue')} (3 ${t('farmersAhead', 'आगे')})` },
                  { pos: 5, token: 'T-114-33', name: 'राजू शर्मा', crop: t('cropMaize', 'मक्का'), icon: cropMaize, status: `${t('statusInQueue', 'In Queue')} (4 ${t('farmersAhead', 'आगे')})` },
                  { pos: 6, token: 'T-114-34', name: 'सुशील मौर्य', crop: t('cropGram', 'चना'), icon: cropGram, status: `${t('statusInQueue', 'In Queue')} (5 ${t('farmersAhead', 'आगे')})` }
                ].map((row) => (
                  <div 
                    key={row.pos + row.token + row.name}
                    className={`waiting-stream-row ${row.isCalling ? 'is-calling' : ''} ${row.isYou ? 'is-you' : ''}`}
                  >
                    <div className="stream-row-main">
                      {/* Pos Badge */}
                      <span className={`stream-pos-badge ${row.isCalling ? 'is-calling' : (row.isYou ? 'is-you' : '')}`}>
                        {row.pos}
                      </span>

                      {/* Token Badge */}
                      <strong className="stream-token-badge">
                        {row.token}
                      </strong>

                      {/* Farmer Name */}
                      <div className="stream-farmer-cell">
                        {row.isYou ? (
                          <div className="stream-you-wrapper">
                            <span className="stream-you-badge">
                              {t('youBadge', 'आप (You)')}
                            </span>
                            <span className="stream-farmer-name is-you">
                              {row.name}
                            </span>
                          </div>
                        ) : (
                          <span className="stream-farmer-name">
                            {row.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="stream-row-meta">
                      {/* Crop */}
                      <div className="stream-crop-cell">
                        <img src={row.icon} alt={row.crop} className="stream-crop-icon" />
                        <span className="stream-crop-name">{row.crop}</span>
                      </div>

                      {/* Status Button / Pill */}
                      <div className="stream-status-cell">
                        {row.isCalling ? (
                          <button 
                            className="stream-call-btn"
                            onClick={() => speakAnnouncement(`टोकन नंबर ${row.token}, ${row.name}, कृपया काउंटर 2 पर जाएं`)}
                            title={t('listenShort', 'अनाउंसमेंट सुनें')}
                          >
                            <span>📢 {t('calledToCounter2', 'CALLED TO COUNTER 2')}</span>
                            <ChevronRight size={14} />
                          </button>
                        ) : (
                          <span className="stream-waiting-pill">
                            <Clock size={12} />
                            <span>{row.status}</span>
                            <ChevronRight size={13} color="#94a3b8" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Bottom Notice */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#065f46' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 280px' }}>
                  <Info size={16} color="#017953" style={{ flexShrink: 0 }} />
                  <span><strong>{t('noticePrefix', 'सूचना:')}</strong> {t('queueCallNotice', 'जैसे ही आपका टोकन नंबर बुलाया जाएगा, स्क्रीन पर प्रदर्शित किया जाएगा और आपको SMS/घोषणा के माध्यम से सूचित किया जाएगा !')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#017953' }}>
                  <Volume2 size={15} />
                  <span>{t('announcementsActive', 'स्वचालित घोषणाएं चालू हैं')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR: TODAY'S OVERVIEW ================= */}
          <div className="live-queue-right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
            
            {/* Quick Stats Box */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📊</span> <span>{t('todayGlance', 'आज की झलक')}</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{t('totalFarmersLabel', 'कुल किसान:')}</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>128</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{t('totalProcuredLabel', 'कुल खरीद:')}</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>2,450 Q</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{t('avgWaitLabel', 'औसत प्रतीक्षा:')}</span>
                  <strong style={{ fontSize: '1.1rem', color: '#017953' }}>16 min</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{t('activeCountersLabel', 'सक्रिय काउंटर:')}</span>
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
                {t('bottomSlogan', 'अन्नदाता देश की शान')}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
