import React, { useState, useEffect, useCallback } from 'react';
import api from "../../services/api";
import websocketService from "../../services/websocket";
import { useAuth } from "../../context/AuthContext";
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
  Scale,
  Wifi,
  WifiOff
} from 'lucide-react';
import mandiShed from "../../assets/mandi_shed.png";
import cropWheat from "../../assets/crop_wheat.png";
import cropMaize from "../../assets/crop_maize.png";
import cropGram from "../../assets/crop_gram.png";
import apmcBuilding from "../../assets/apmc_building.png";

export default function LiveQueuePage() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const [wsStatus, setWsStatus] = useState(websocketService.status);
  const [lastAnnouncement, setLastAnnouncement] = useState('');
  const [farmerActiveBooking, setFarmerActiveBooking] = useState(null);

  // Fetch initial centers and farmer booking
  useEffect(() => {
    fetchCenters();
    if (user && user.role === 'FARMER') {
      fetchFarmerBooking();
    }
  }, []);

  // Fetch queue whenever selectedCenterId changes
  useEffect(() => {
    if (selectedCenterId) {
      fetchLiveQueue(selectedCenterId);
    }
  }, [selectedCenterId]);

  // Subscribe to WebSocket live queue topic
  useEffect(() => {
    // Listen to connection status
    const unsubStatus = websocketService.addStatusListener(setWsStatus);

    // Subscribe to queue updates
    const unsubQueue = websocketService.subscribeToQueue((data) => {
      console.log('[LiveQueuePage] Received WebSocket event:', data);
      if (data.type === 'QUEUE_UPDATE' && Array.isArray(data.queue)) {
        setQueueData(data.queue);
      } else if (data.type === 'TOKEN_CALLED' && data.tokenStatus) {
        const token = data.tokenStatus.tokenNumber || '';
        const counter = data.tokenStatus.counterNumber || data.tokenStatus.counterName || '';
        const msg = token 
          ? `टोकन संख्या ${token}${counter ? `, कृपया काउंटर ${counter} पर पहुंचें` : '। कृपया काउंटर पर पहुंचें।'}` 
          : '';
        if (msg) {
          setLastAnnouncement(msg);
          speakAnnouncement(msg);
        }
        // Refresh full queue list
        fetchLiveQueue();
      } else {
        fetchLiveQueue();
      }
    });

    return () => {
      unsubStatus();
      unsubQueue();
    };
  }, [selectedCenterId]);

  const fetchCenters = async () => {
    try {
      const res = await api.get('/centers');
      if (res.data && res.data.length > 0) {
        setCenters(res.data);
        setSelectedCenterId(prev => prev || res.data[0].centerId);
      }
    } catch (e) {
      console.error('Failed to fetch centers:', e);
    }
  };

  const fetchLiveQueue = async (cId) => {
    const targetId = cId || selectedCenterId;
    if (!targetId) return;
    try {
      const res = await api.get(`/queue/public?centerId=${targetId}`);
      if (res.data) {
        setQueueData(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch public queue:', e);
    }
  };

  const fetchFarmerBooking = async () => {
    try {
      const res = await api.get('/farmer/dashboard-summary');
      if (res.data?.activeBooking) {
        setFarmerActiveBooking(res.data.activeBooking);
      }
    } catch (e) {}
  };

  const speakAnnouncement = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLiveQueue();
    setTimeout(() => setRefreshing(false), 400);
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
                <span>डिजिटल उपार्जन प्रबंधन</span>
              </div>
            </div>

            {/* Mandi/Tractor illustration at bottom */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <img src={apmcBuilding} alt="Procurement Centre" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#017953', marginTop: '10px' }}>
                समृद्ध किसान <br /> समृद्ध भारत
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN: MAIN LIVE QUEUE MONITOR ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Top Monitor Header Bar */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '16px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={mandiShed} alt="Centre Shed" style={{ width: '60px', height: '52px', objectFit: 'contain' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#017953', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                      LIVE FEED • वास्तविक समय उपार्जन कतार
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: wsStatus === 'CONNECTED' ? '#047857' : (wsStatus === 'CONNECTING' ? '#d97706' : '#dc2626'), background: wsStatus === 'CONNECTED' ? '#dcfce7' : (wsStatus === 'CONNECTING' ? '#fef3c7' : '#fee2e2'), padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {wsStatus === 'CONNECTED' ? <Wifi size={12} /> : <WifiOff size={12} />}
                      {wsStatus === 'CONNECTED' ? 'LIVE' : (wsStatus === 'CONNECTING' ? 'RECONNECTING' : 'OFFLINE')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                    उपार्जन केंद्र लाइव कतार मॉनिटर
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
                    {centers.find(c => c.centerId === Number(selectedCenterId))?.centerName || 'उपार्जन केंद्र'}
                  </div>
                </div>
              </div>

              {/* Centre Dropdown & Refresh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#017953" />
                  <select 
                    value={selectedCenterId} 
                    onChange={(e) => setSelectedCenterId(Number(e.target.value))}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, color: '#1e293b', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    {centers.map(c => (
                      <option key={c.centerId} value={c.centerId}>{c.centerName}</option>
                    ))}
                  </select>
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

            {/* Voice Announcement Banner if any */}
            {lastAnnouncement && (
              <div style={{ background: '#fef3c7', border: '1.5px solid #fde68a', color: '#92400e', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={18} color="#b45309" />
                  <span>लाउडस्पीकर उद्घोषणा: {lastAnnouncement}</span>
                </div>
                <button 
                  onClick={() => speakAnnouncement(lastAnnouncement)}
                  style={{ background: '#f59e0b', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  पुनः सुनें (Replay)
                </button>
              </div>
            )}

            {/* 4 Status Cards Row */}
            {(() => {
              const called = queueData.find(q => q.currentStatus === 'CALLED' || q.currentStatus === 'AT_COUNTER');
              const waiting = queueData.filter(q => q.currentStatus === 'WAITING' || q.currentStatus === 'ARRIVED');
              const myToken = farmerActiveBooking?.tokenNumber || '—';
              const myCrop = farmerActiveBooking?.produceName || (farmerActiveBooking ? 'सक्रिय स्लॉट' : 'कोई सक्रिय टोकन नहीं');

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  
                  {/* Card 1: Aapka Token */}
                  <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>आपका टोकन</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953', margin: '2px 0' }}>
                      {myToken}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#374151', fontWeight: 600 }}>
                      {myCrop}
                    </div>
                    <span style={{ display: 'inline-block', fontSize: '0.68rem', background: farmerActiveBooking ? '#017953' : '#94a3b8', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginTop: '4px' }}>
                      {farmerActiveBooking ? '✓ Active' : 'टोकन नहीं'}
                    </span>
                  </div>

                  {/* Card 2: Abhi Aap Se Pehle Hai */}
                  <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: 600 }}>वर्तमान में काउंटर पर</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', margin: '2px 0' }}>
                      {called ? called.tokenNumber : (waiting[0]?.tokenNumber || '—')}
                    </div>
                    <div style={{ fontSize: '0.74rem', background: '#dbeafe', color: '#1e40af', display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {called ? (called.counterName || (called.counterNumber ? `काउंटर ${called.counterNumber} पर` : 'काउंटर पर')) : (waiting.length > 0 ? 'कॉलिंग जारी' : 'कतार खाली')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                      {waiting.length} टोकन प्रतीक्षारत
                    </div>
                  </div>

                  {/* Card 3: Aapse Aage Kisan */}
                  <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '16px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#854d0e', fontWeight: 600 }}>कुल प्रतीक्षारत किसान</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309', margin: '2px 0' }}>
                      {waiting.length}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#713f12', fontWeight: 600 }}>
                      किसान कतार में
                    </div>
                  </div>

                  {/* Card 4: Anumanit Pratiksha */}
                  <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '16px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#9f1239', fontWeight: 600 }}>अनुमानित प्रतीक्षा</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48', margin: '2px 0' }}>
                      {called?.estimatedWaitTime != null ? `${called.estimatedWaitTime} min` : (waiting[0]?.estimatedWaitTime != null ? `${waiting[0].estimatedWaitTime} min` : (waiting.length === 0 ? '0 min' : '—'))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9f1239', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Zap size={13} /> <span>{waiting.length > 0 ? 'सक्रिय कतार स्थिति' : 'कोई प्रतीक्षा नहीं'}</span>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Active Weighbridges Section */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '18px 22px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              {(() => {
                const calledByCounter = {};
                queueData.forEach(q => {
                  const cNum = q.counterNumber || (q.counterName?.includes('1') ? 1 : (q.counterName?.includes('2') ? 2 : (q.counterName?.includes('3') ? 3 : null)));
                  if (cNum && (q.currentStatus === 'CALLED' || q.currentStatus === 'AT_COUNTER')) {
                    calledByCounter[cNum] = q;
                  }
                });

                const activeCount = Object.keys(calledByCounter).length;

                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Scale size={18} color="#017953" />
                        <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                          सक्रिय धर्मकांटा काउंटर (Active Weighbridges)
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: activeCount > 0 ? '#017953' : '#64748b', fontWeight: 700, background: activeCount > 0 ? '#ecfdf5' : '#f1f5f9', padding: '3px 10px', borderRadius: '12px' }}>
                        ((•)) {activeCount > 0 ? `${activeCount} काउंटर पर किसान उपस्थित` : 'काउंटर प्रतीक्षारत'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                      {[1, 2, 3].map((cNum) => {
                        const activeQ = calledByCounter[cNum];
                        return (
                          <div key={`counter-${cNum}`} style={{ border: activeQ ? '1.5px solid #017953' : '1px solid #e2e8f0', background: activeQ ? '#f0fdf4' : '#fafafa', borderRadius: '12px', padding: '12px 14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.92rem', color: '#111827' }}>काउंटर {cNum}</strong>
                              <span style={{ fontSize: '0.72rem', color: activeQ ? '#017953' : '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeQ ? '#10b981' : '#94a3b8' }}></span>
                                {activeQ ? 'Active' : 'Standby'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 8px 0' }}>
                              {activeQ?.farmerName ? `👤 किसान: ${activeQ.farmerName}` : 'प्रतीक्षारत'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                              <span style={{ color: '#475569' }}>वर्तमान टोकन:</span>
                              <strong style={{ fontSize: '0.94rem', color: activeQ ? '#017953' : '#64748b', background: activeQ ? '#dcfce7' : '#ffffff', border: '1px solid #cbd5e1', padding: '1px 8px', borderRadius: '6px' }}>
                                {activeQ ? activeQ.tokenNumber : '—'}
                              </strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
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
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>उपार्जन केंद्र में क्रमानुसार चलने वाली कतार</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#017953', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                    ● Live अपडेट
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, background: '#f1f5f9', padding: '3px 10px', borderRadius: '12px' }}>
                    👥 कुल कतार में: {queueData.length}
                  </span>
                </div>
              </div>

              {/* Stream Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {queueData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.9rem' }}>
                    वर्तमान में इस क्रय केंद्र पर कतार खाली है। (No active tokens in queue)
                  </div>
                ) : (
                  queueData.map((item, idx) => {
                    const isCalling = item.currentStatus === 'CALLED' || item.currentStatus === 'AT_COUNTER';
                    const isYou = user?.name && item.farmerName && item.farmerName.toLowerCase().includes(user.name.toLowerCase());
                    const isCompleted = item.currentStatus === 'COMPLETED';

                    return (
                      <div 
                        key={item.queueStatusId || idx}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '40px 90px 1.4fr 100px 1.2fr', 
                          alignItems: 'center',
                          background: isCalling ? '#eff6ff' : (isYou ? '#f0fdf4' : (isCompleted ? '#f8fafc' : '#ffffff')),
                          border: isCalling ? '1.5px solid #bfdbfe' : (isYou ? '1.5px solid #bbf7d0' : '1px solid #e5e7eb'),
                          borderRadius: '12px',
                          padding: '10px 14px',
                          fontSize: '0.86rem',
                          opacity: isCompleted ? 0.75 : 1
                        }}
                      >
                        {/* Pos */}
                        <div>
                          <span style={{ 
                            width: '26px', 
                            height: '26px', 
                            borderRadius: '50%', 
                            background: isCalling ? '#2563eb' : (isYou ? '#017953' : (isCompleted ? '#94a3b8' : '#f1f5f9')), 
                            color: isCalling || isYou || isCompleted ? '#ffffff' : '#475569', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 800, 
                            fontSize: '0.8rem' 
                          }}>
                            {idx + 1}
                          </span>
                        </div>

                        {/* Token */}
                        <div>
                          <strong style={{ fontSize: '0.98rem', color: isCalling ? '#1d4ed8' : '#111827', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                            {item.tokenNumber}
                          </strong>
                        </div>

                        {/* Farmer Name */}
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.farmerName}
                            {isYou && (
                              <span style={{ fontSize: '0.68rem', background: '#017953', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                आप (You)
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            बुक संदर्भ: {item.bookingReference || '—'}
                          </span>
                        </div>

                        {/* Crop */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={cropWheat} alt="Produce" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                          <span style={{ fontWeight: 600, color: '#374151' }}>{item.produceName || '—'}</span>
                        </div>

                        {/* Status */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            fontSize: '0.74rem', 
                            fontWeight: 700, 
                            padding: '3px 8px', 
                            borderRadius: '6px',
                            background: isCalling ? '#dbeafe' : (isCompleted ? '#f1f5f9' : '#ecfdf5'),
                            color: isCalling ? '#1d4ed8' : (isCompleted ? '#64748b' : '#047857'),
                            border: `1px solid ${isCalling ? '#bfdbfe' : (isCompleted ? '#e2e8f0' : '#a7f3d0')}`
                          }}>
                            {isCalling ? (item.counterNumber ? `● काउंटर ${item.counterNumber} पर पुकारा गया` : '● काउंटर पर पुकारा गया') : (isCompleted ? '✓ प्रक्रिया पूर्ण' : `प्रतीक्षारत (~${item.estimatedWaitTime != null ? item.estimatedWaitTime + ' min' : '—'})`)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                {(() => {
                  const selCenter = centers.find(c => c.centerId === Number(selectedCenterId));
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>कतार में टोकन:</span>
                        <strong style={{ fontSize: '1.1rem', color: '#017953' }}>{queueData.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>दैनिक क्षमता:</span>
                        <strong style={{ fontSize: '1.1rem', color: '#017953' }}>{selCenter?.capacityPerDay != null ? `${selCenter.capacityPerDay} Q` : '—'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>आज की आवक:</span>
                        <strong style={{ fontSize: '1.1rem', color: '#017953' }}>{selCenter?.currentDailyQuantity != null ? `${selCenter.currentDailyQuantity} Q` : '0 Q'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>केंद्र स्थिति:</span>
                        <strong style={{ fontSize: '1.0rem', color: selCenter?.status === 'ACTIVE' ? '#017953' : '#b45309' }}>{selCenter?.status || 'ACTIVE'}</strong>
                      </div>
                    </>
                  );
                })()}
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
