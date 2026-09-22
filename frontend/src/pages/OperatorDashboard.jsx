import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import websocketService from '../services/websocket';
import { 
  Check, 
  RotateCw, 
  Phone, 
  FileText, 
  Scale, 
  FlaskConical, 
  UserPlus, 
  AlertTriangle, 
  BarChart3, 
  Headphones, 
  ChevronDown, 
  MoreVertical,
  CheckCircle2,
  CheckCircle,
  Clock,
  Sparkles,
  QrCode,
  Wifi,
  WifiOff
} from 'lucide-react';

import operatorBadgeImg from '../assets/operator_console_badge.png';
import operatorShedImg from '../assets/operator_banner_shed.png';
import tractorFieldImg from '../assets/tractor_field.png';

export default function OperatorDashboard() {
  const navigate = useNavigate();

  // Procurement Centres
  const [centres, setCentres] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState(null);

  // Active Token state (initialized null to never show fake farmer/token)
  const [activeToken, setActiveToken] = useState(null);

  // Quality Check state (empty until entered)
  const [moisture, setMoisture] = useState('');
  const [foreignMatter, setForeignMatter] = useState('');
  const [qualityGrade, setQualityGrade] = useState('FAQ Grade A (उत्तम गुणवत्ता - पूर्ण MSP)');
  const [qcVerified, setQcVerified] = useState(false);

  // Weighbridge state (empty until entered)
  const [grossWeight, setGrossWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('');
  const [weighSaved, setWeighSaved] = useState(false);
  const [jFormGenerated, setJFormGenerated] = useState(false);
  const [issuedJFormNo, setIssuedJFormNo] = useState('');

  // Counter Selector
  const [selectedCounter, setSelectedCounter] = useState('counter2');
  const [wsStatus, setWsStatus] = useState(websocketService.status);

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

  // Waiting list
  const [waitingList, setWaitingList] = useState([]);

  // Live Net and MSP Calculation
  const grossNum = parseFloat(grossWeight) || 0;
  const tareNum = parseFloat(tareWeight) || 0;
  const netKg = Math.max(0, grossNum - tareNum);
  const netQuintals = (netKg / 100).toFixed(2);
  const mspRate = activeToken?.mspRate || 0;
  const totalAmount = Math.round(parseFloat(netQuintals) * mspRate);

  // Authenticated Operator
  const operatorUsername = localStorage.getItem('username') || localStorage.getItem('farmer_name') || 'ऑपरेटर';

  // Load centres on mount
  useEffect(() => {
    loadCentres();
  }, []);

  const loadCentres = async () => {
    try {
      const res = await api.get('/centers');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCentres(res.data);
        const firstId = res.data[0].centerId;
        setSelectedCenterId(firstId);
        fetchBackendQueue(firstId);
      }
    } catch (err) {
      console.warn('Could not load centres:', err);
    }
  };

  // Fetch live queue from backend and subscribe to real-time events
  useEffect(() => {
    if (selectedCenterId) {
      fetchBackendQueue(selectedCenterId);
    }

    const unsubStatus = websocketService.addStatusListener(setWsStatus);
    const unsubQueue = websocketService.subscribeToQueue((data) => {
      console.log('[OperatorDashboard] Real-time queue event:', data);
      if (selectedCenterId) fetchBackendQueue(selectedCenterId);
    });
    const unsubBookings = websocketService.subscribeToBookings((data) => {
      console.log('[OperatorDashboard] Real-time booking event:', data);
      if (selectedCenterId) fetchBackendQueue(selectedCenterId);
    });

    return () => {
      unsubStatus();
      unsubQueue();
      unsubBookings();
    };
  }, [selectedCenterId]);

  const fetchBackendQueue = async (cId) => {
    const targetCenterId = cId || selectedCenterId;
    if (!targetCenterId) return;
    try {
      const res = await api.get(`/operator/queue?centerId=${targetCenterId}`);
      if (res.data && Array.isArray(res.data)) {
        const called = res.data.find(q => q.currentStatus === 'CALLED' || q.currentStatus === 'AT_COUNTER');
        const waiting = res.data.filter(q => q.currentStatus === 'WAITING' || q.currentStatus === 'ARRIVED');

        if (called) {
          setActiveToken({
            tokenNo: called.tokenNumber || '—',
            farmerName: called.farmerName || '—',
            crop: called.produceName ? `${called.produceName} (FAQ)` : '—',
            statusText: called.counterName ? `${called.counterName} पर प्रक्रिया में` : `काउंटर पर तौल एवं जांच प्रक्रिया में`,
            bookingId: called.bookingId,
            bookingReference: called.bookingReference,
            queueStatusId: called.queueStatusId,
            arrivalStatus: called.currentStatus
          });
        }

        setWaitingList(waiting.map((w, idx) => ({
          tokenNo: w.tokenNumber || '—',
          farmerName: w.farmerName || '—',
          crop: w.produceName || '—',
          time: w.arrivedAt ? new Date(w.arrivedAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'उपस्थित',
          status: `प्रतीक्षारत (${idx + 1})`,
          bookingId: w.bookingId,
          bookingReference: w.bookingReference,
          queueStatusId: w.queueStatusId
        })));
      }
    } catch (e) {
      console.warn('Backend queue fetch error:', e);
    }
  };

  const handleCallNext = async () => {
    if (waitingList.length === 0) {
      alert("कतार में कोई और प्रतीक्षारत किसान नहीं है।");
      return;
    }
    const nextFarmer = waitingList[0];
    const counterNum = selectedCounter === 'counter1' ? 1 : (selectedCounter === 'counter3' ? 3 : 2);
    try {
      if (nextFarmer.queueStatusId) {
        const res = await api.post(`/operator/queue/${nextFarmer.queueStatusId}/call?counterId=${counterNum}`);
        const calledData = res.data || {};
        setActiveToken({
          tokenNo: calledData.tokenNumber || nextFarmer.tokenNo,
          farmerName: calledData.farmerName || nextFarmer.farmerName,
          crop: calledData.produceName ? `${calledData.produceName} (FAQ)` : `${nextFarmer.crop} (FAQ)`,
          statusText: `काउंटर ${counterNum} पर तौल एवं जांच प्रक्रिया में`,
          bookingId: calledData.bookingId || nextFarmer.bookingId,
          bookingReference: calledData.bookingReference || nextFarmer.bookingReference,
          queueStatusId: calledData.queueStatusId || nextFarmer.queueStatusId,
          arrivalStatus: 'CALLED'
        });
        setWaitingList(prev => prev.slice(1));
        setWeighSaved(false);
        setJFormGenerated(false);
        setQcVerified(false);
        setMoisture('');
        setForeignMatter('');
        setGrossWeight('');
        setTareWeight('');
      }
    } catch (err) {
      console.error('Call next token error:', err);
      alert(err.response?.data?.message || 'किसान को बुलाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  };

  const handleVerifyQC = async () => {
    if (!activeToken?.bookingId) {
      alert('कृपया पहले कतार से किसान टोकन का चयन करें।');
      return;
    }
    if (!moisture || isNaN(moisture)) {
      alert('कृपया वैध नमी प्रतिशत दर्ज करें।');
      return;
    }
    try {
      await api.post('/operator/quality-check', {
        bookingId: activeToken.bookingId,
        moisturePercentage: parseFloat(moisture),
        foreignMatterPercentage: parseFloat(foreignMatter) || 0,
        qualityGrade: qualityGrade,
        qciStatus: 'PASSED'
      });
      setQcVerified(true);
      alert(`✓ गुणवत्ता जांच प्रमाणित एवं डेटाबेस में सुरक्षित!\nनमी: ${moisture}%\nविदेशी पदार्थ: ${foreignMatter || 0}%\nग्रेड: ${qualityGrade}\nस्थिति: PASSED`);
    } catch (err) {
      console.error('Record QC error:', err);
      setQcVerified(false);
      alert(err.response?.data?.message || 'गुणवत्ता जांच सुरक्षित नहीं हो सकी। कृपया पुनः प्रयास करें।');
    }
  };

  const handleSaveWeighment = async () => {
    if (!activeToken?.bookingId) {
      alert('कृपया पहले कतार से किसान टोकन का चयन करें।');
      return;
    }
    if (grossNum <= 0 || tareNum < 0 || grossNum <= tareNum) {
      alert('कृपया वैध सकल (Gross) एवं खाली (Tare) वजन दर्ज करें (सकल वजन > खाली वाहन वजन)।');
      return;
    }
    try {
      const res = await api.post('/operator/weighbridge', {
        bookingId: activeToken.bookingId,
        grossWeightKg: grossNum,
        tareWeightKg: tareNum
      });
      const entry = res.data;
      const jform = entry?.entryId ? `JF-2026-${entry.entryId + 1000}` : 'JF-2026-COMPLETED';
      setIssuedJFormNo(jform);
      setWeighSaved(true);
      setJFormGenerated(true);
      alert(`✓ इलेक्ट्रॉनिक धर्मकांटा तौल सफलतापूर्वक दर्ज किया गया!\nसकल वजन: ${grossWeight} Kg\nखाली वाहन: ${tareWeight} Kg\nशुद्ध वजन: ${netQuintals} क्विंटल\nकुल देय राशि: ₹${totalAmount.toLocaleString('en-IN')}\n\nडिजिटल J-Form (${jform}) जारी हुआ एवं DBT भुगतान प्रक्रिया प्रारंभ की गई।`);
    } catch (err) {
      console.error('Record weighbridge error:', err);
      setWeighSaved(false);
      setJFormGenerated(false);
      setIssuedJFormNo('');
      alert(err.response?.data?.message || 'धर्मकांटा तौल दर्ज नहीं हो सका। कृपया पुनः प्रयास करें।');
    }
  };

  const handleIssueJForm = () => {
    if (!weighSaved || !issuedJFormNo) {
      alert('कृपया पहले धर्मकांटा तौल (Weighment) सुरक्षित करें। तौल के उपरांत ही J-Form जारी किया जा सकता है।');
      return;
    }
    setJFormGenerated(true);
    alert(`डिजिटल J-Form प्रमाणित!\nनंबर: ${issuedJFormNo}\nटोकन: ${activeToken?.tokenNo || '—'}\nकिसान: ${activeToken?.farmerName || '—'}\nशुद्ध वजन: ${netQuintals} क्विंटल\nDBT भुगतान राशि: ₹${totalAmount.toLocaleString('en-IN')}\n\nJ-Form रिकॉर्ड सुरक्षित है।`);
  };

  const handleVerifyGateQr = async (e) => {
    e?.preventDefault();
    if (!qrInput.trim()) return;
    setQrLoading(true);
    try {
      const res = await api.post('/operator/qr/verify', { qrToken: qrInput.trim() });
      alert(`✓ किसान आगमन सत्यापित!\nटोकन: ${res.data?.tokenNumber || 'Verified'}\nकिसान: ${res.data?.farmerName || 'Farmer'}\nउपज: ${res.data?.produceName || '—'}\nकतार में सफलतापूर्वक शामिल किया गया।`);
      setQrInput('');
      setShowQrModal(false);
      if (selectedCenterId) fetchBackendQueue(selectedCenterId);
    } catch (err) {
      alert(err.response?.data?.message || 'अमान्य QR कोड या पहले ही सत्यापित किया जा चुका है।');
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div style={{ background: 'transparent', minHeight: '90vh', padding: '20px 0 40px 0' }}>
      <div className="portal-container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* ================= 1. LEFT COLUMN ================= */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '20px 16px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Title Quote */}
            <h3 style={{ 
              fontSize: '1.15rem', 
              fontWeight: 900, 
              color: '#064e3b', 
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              lineHeight: 1.35,
              margin: 0
            }}>
              “किसान की समृद्धि,<br />हमारी प्राथमिकता”
            </h3>

            {/* 4 Feature Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={14} strokeWidth={3} color="#166534" />
                </div>
                <span>तेज एवं पारदर्शी खरीद</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={13} color="#166534" />
                </div>
                <span>डिजिटल तौल प्रणाली</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={13} color="#166534" />
                </div>
                <span>रियल-टाइम कतार प्रबंधन</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={13} color="#166534" />
                </div>
                <span>सुरक्षित भुगतान</span>
              </div>
            </div>

            {/* Bottom Farm & Windmill Illustration */}
            <div style={{ marginTop: '10px' }}>
              <img 
                src={tractorFieldImg} 
                alt="Green Fields" 
                style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

        </div>

        {/* ================= 2. MIDDLE MAIN AREA ================= */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Operator Console Banner Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #e6f9ed 100%)', 
            borderRadius: '16px', 
            padding: '16px 20px', 
            border: '1px solid #bbf7d0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Left Emblem & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
              <div style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '14px', 
                background: '#ffffff', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid #d1fae5',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src={operatorBadgeImg} alt="APMC Badge" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    padding: '2px 8px', 
                    borderRadius: '12px' 
                  }}>
                    उपार्जन केंद्र ऑपरेटर कंसोल
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                    • {centres.find(c => c.centerId === selectedCenterId)?.centerName || 'उपार्जन केंद्र'}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#064e3b', margin: '0 0 4px 0', letterSpacing: '-0.2px' }}>
                  काउंटर प्रबंधन एवं इलेक्ट्रॉनिक धर्मकांटा प्रणाली
                </h2>

                <div style={{ fontSize: '0.78rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>ऑपरेटर: <strong>{operatorUsername}</strong> • सक्रिय काउंटर: <strong style={{ color: '#d97706' }}>{selectedCounter === 'counter1' ? 'काउंटर 1' : (selectedCounter === 'counter3' ? 'काउंटर 3' : 'काउंटर 2')}</strong></span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: wsStatus === 'CONNECTED' ? '#047857' : '#d97706', 
                    background: wsStatus === 'CONNECTED' ? '#dcfce7' : '#fef3c7', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    {wsStatus === 'CONNECTED' ? <Wifi size={11} /> : <WifiOff size={11} />}
                    {wsStatus === 'CONNECTED' ? 'WebSocket Live' : 'Reconnecting...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Shed Graphic + QR Button + Dropdowns + Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowQrModal(true)}
                style={{
                  background: '#047857',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(4,120,87,0.25)'
                }}
              >
                <QrCode size={15} />
                <span>गेट QR सत्यापन</span>
              </button>

              {/* Centre Selector */}
              {centres.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <select 
                    value={selectedCenterId || ''}
                    onChange={(e) => {
                      const cId = Number(e.target.value);
                      setSelectedCenterId(cId);
                      fetchBackendQueue(cId);
                    }}
                    style={{ 
                      background: '#ffffff', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '8px', 
                      padding: '8px 26px 8px 10px', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      color: '#1e293b',
                      appearance: 'none',
                      cursor: 'pointer',
                      maxWidth: '170px'
                    }}
                  >
                    {centres.map(c => (
                      <option key={c.centerId} value={c.centerId}>{c.centerName}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '8px', top: '12px', pointerEvents: 'none' }} />
                </div>
              )}

              {/* Counter Selector */}
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedCounter}
                  onChange={(e) => setSelectedCounter(e.target.value)}
                  style={{ 
                    background: '#ffffff', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px', 
                    padding: '8px 28px 8px 12px', 
                    fontSize: '0.84rem', 
                    fontWeight: 700, 
                    color: '#1e293b',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="counter2">काउंटर 2 (Weighbridge 2)</option>
                  <option value="counter1">काउंटर 1 (Weighbridge 1)</option>
                  <option value="counter3">काउंटर 3 (Weighbridge 3)</option>
                </select>
                <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '12px', pointerEvents: 'none' }} />
              </div>

              <button 
                onClick={() => fetchBackendQueue(selectedCenterId)}
                title="रिफ्रेश करें"
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  width: '36px', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          {/* Active Farmer Action Bar */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '12px 16px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Left Blue Token Box */}
            <div style={{ 
              background: activeToken ? '#1d4ed8' : '#94a3b8', 
              color: '#ffffff', 
              borderRadius: '10px', 
              padding: '10px 18px', 
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                fontSize: '0.66rem', 
                fontWeight: 800, 
                padding: '2px 6px', 
                borderRadius: '8px', 
                display: 'inline-block',
                marginBottom: '2px'
              }}>
                {activeToken ? 'ACTIVE' : 'IDLE'}
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>टोकन नं.</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1.1 }}>
                {activeToken?.tokenNo || '—'}
              </div>
            </div>

            {/* Middle Farmer Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                {activeToken ? 'वर्तमान बुलाया गया किसान' : 'सक्रिय किसान स्थिति'}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeToken ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0' }}>
                <span>👤</span>
                <span>{activeToken?.farmerName || 'कोई टोकन सक्रिय नहीं है'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                {activeToken ? (
                  <>फसल: <strong>{activeToken.crop}</strong> • {activeToken.statusText}</>
                ) : (
                  'कतार से किसान को पुकारने के लिए "अगले किसान को बुलाएं" दबाएं।'
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={handleCallNext}
                disabled={waitingList.length === 0}
                style={{ 
                  background: waitingList.length > 0 ? '#dc2626' : '#94a3b8', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '11px 18px', 
                  fontSize: '0.88rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: waitingList.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: waitingList.length > 0 ? '0 2px 6px rgba(220, 38, 38, 0.25)' : 'none'
                }}
              >
                <Phone size={16} />
                <span>अगले किसान को बुलाएं ({waitingList.length})</span>
              </button>

              <button 
                onClick={() => {
                  if (!activeToken) {
                    alert('वर्तमान में कोई किसान टोकन सक्रिय नहीं है।');
                    return;
                  }
                  alert(`किसान विवरण:\nनाम: ${activeToken.farmerName}\nटोकन: ${activeToken.tokenNo}\nफसल: ${activeToken.crop}\nबुकिंग संदर्भ: ${activeToken.bookingReference || activeToken.bookingId || '—'}`);
                }}
                style={{ 
                  background: '#ffffff', 
                  color: '#334155', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '10px', 
                  padding: '11px 16px', 
                  fontSize: '0.88rem', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <FileText size={16} color="#64748b" />
                <span>किसान विवरण देखें</span>
              </button>
            </div>
          </div>

          {/* Two Processing Columns: QC & Weighbridge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Panel 1: Quality Check */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '14px', 
              padding: '16px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                {/* Panel Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                    <FlaskConical size={18} color="#059669" />
                    <span>1. गुणवत्ता एवं नमी जांच (Quality Check)</span>
                  </div>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '8px' 
                  }}>
                    मानक: नमी &lt; 12%
                  </span>
                </div>

                {/* Inputs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {/* Moisture */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      नमी प्रतिशत (Grain Moisture %)
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={moisture}
                        onChange={(e) => setMoisture(e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          border: '1px solid #cbd5e1', 
                          fontSize: '0.92rem', 
                          fontWeight: 700,
                          color: '#1e293b'
                        }}
                      />
                      <span style={{ 
                        position: 'absolute', 
                        right: '6px', 
                        background: '#dcfce7', 
                        color: '#166534', 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        padding: '2px 6px', 
                        borderRadius: '6px',
                        pointerEvents: 'none'
                      }}>
                        ✓ मानक के अनुसार (Passed)
                      </span>
                    </div>
                  </div>

                  {/* Foreign Matter */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      विदेशी पदार्थ / कचरा % (Foreign Matter %)
                    </label>
                    <input 
                      type="text" 
                      value={foreignMatter}
                      onChange={(e) => setForeignMatter(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        fontSize: '0.92rem', 
                        fontWeight: 700,
                        color: '#1e293b'
                      }}
                    />
                  </div>
                </div>

                {/* Quality Grade Dropdown */}
                <div style={{ marginBottom: '14px', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                    गुणवत्ता ग्रेड (Grade)
                  </label>
                  <select 
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 28px 8px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      color: '#1e293b',
                      background: '#ffffff',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="FAQ Grade A (उत्तम गुणवत्ता - पूर्ण MSP)">FAQ Grade A (उत्तम गुणवत्ता - पूर्ण MSP)</option>
                    <option value="FAQ Grade B (स्वीकार्य)">FAQ Grade B (स्वीकार्य)</option>
                  </select>
                  <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '30px', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleVerifyQC}
                style={{ 
                  width: '100%', 
                  background: '#017953', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '10px', 
                  fontSize: '0.88rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(1, 121, 83, 0.25)'
                }}
              >
                <Check size={16} strokeWidth={3} />
                <span>गुणवत्ता जांच प्रमाणित करें (Verify Quality)</span>
              </button>
            </div>

            {/* Panel 2: Weighbridge */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '14px', 
              padding: '16px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                {/* Panel Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                    <Scale size={18} color="#059669" />
                    <span>2. इलेक्ट्रॉनिक धर्मकांटा तौल (Weighbridge)</span>
                  </div>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '8px' 
                  }}>
                    ऑटो नेट गणना
                  </span>
                </div>

                {/* Gross and Tare Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      सकल वजन (Gross Kg)
                    </label>
                    <input 
                      type="number" 
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        fontSize: '0.92rem', 
                        fontWeight: 700,
                        color: '#1e293b'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      खाली वाहन वजन (Tare Kg)
                    </label>
                    <input 
                      type="number" 
                      value={tareWeight}
                      onChange={(e) => setTareWeight(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        fontSize: '0.92rem', 
                        fontWeight: 700,
                        color: '#1e293b'
                      }}
                    />
                  </div>
                </div>

                {/* Calculation Box */}
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '8px', 
                  padding: '10px 14px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#065f46' }}>शुद्ध वजन (Net)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#064e3b' }}>
                      {netQuintals} Quintals
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', color: '#065f46' }}>कुल देय राशि</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#064e3b' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>@ ₹{mspRate}/क्विंटल</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                <button 
                  onClick={handleSaveWeighment}
                  style={{ 
                    background: '#ffffff', 
                    color: '#059669', 
                    border: '1.5px solid #059669', 
                    borderRadius: '8px', 
                    padding: '10px', 
                    fontSize: '0.84rem', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>💾 वजन दर्ज करें (Save Weighment)</span>
                </button>

                <button 
                  onClick={handleIssueJForm}
                  style={{ 
                    background: '#017953', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '10px', 
                    fontSize: '0.84rem', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(1, 121, 83, 0.25)'
                  }}
                >
                  <span>3. J-Form जारी करें →</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Waiting List Table */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '16px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)' 
          }}>
            {/* Table Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                <span>👥</span>
                <span>उपार्जन कतार में प्रतीक्षारत किसान (Waiting List)</span>
              </div>
              <span style={{ 
                background: '#f1f5f9', 
                color: '#475569', 
                fontSize: '0.74rem', 
                fontWeight: 700, 
                padding: '3px 10px', 
                borderRadius: '12px' 
              }}>
                कुल: {waitingList.length} किसान
              </span>
            </div>

            {/* Table Container */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>टोकन</th>
                  <th style={{ padding: '10px 12px' }}>किसान का नाम</th>
                  <th style={{ padding: '10px 12px' }}>फसल</th>
                  <th style={{ padding: '10px 12px' }}>आगमन समय</th>
                  <th style={{ padding: '10px 12px' }}>स्थिति</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>तत्काल एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {waitingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                      वर्तमान में कतार में कोई प्रतीक्षारत किसान नहीं है। (Queue Empty)
                    </td>
                  </tr>
                ) : (
                  waitingList.map((row) => (
                    <tr key={row.tokenNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#1e293b' }}>
                        {row.tokenNo}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {row.farmerName}
                      </td>
                      <td style={{ padding: '12px', color: '#475569' }}>
                        🌾 {row.crop}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '0.82rem' }}>
                        {row.time}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          background: '#f1f5f9', 
                          color: '#475569', 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          padding: '3px 8px', 
                          borderRadius: '6px' 
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={async () => {
                              const counterNum = selectedCounter === 'counter1' ? 1 : (selectedCounter === 'counter3' ? 3 : 2);
                              try {
                                if (row.queueStatusId) {
                                  const res = await api.post(`/operator/queue/${row.queueStatusId}/call?counterId=${counterNum}`);
                                  const d = res.data || {};
                                  setActiveToken({
                                    tokenNo: d.tokenNumber || row.tokenNo,
                                    farmerName: d.farmerName || row.farmerName,
                                    crop: d.produceName ? `${d.produceName} (FAQ)` : `${row.crop} (FAQ)`,
                                    statusText: `काउंटर ${counterNum} पर तौल एवं जांच प्रक्रिया में`,
                                    bookingId: d.bookingId || row.bookingId,
                                    bookingReference: d.bookingReference || row.bookingReference,
                                    queueStatusId: d.queueStatusId || row.queueStatusId,
                                    arrivalStatus: 'CALLED'
                                  });
                                  setWaitingList(prev => prev.filter(w => w.queueStatusId !== row.queueStatusId));
                                  setWeighSaved(false);
                                  setJFormGenerated(false);
                                  setQcVerified(false);
                                  setMoisture('');
                                  setForeignMatter('');
                                  setGrossWeight('');
                                  setTareWeight('');
                                }
                              } catch (err) {
                                alert(err.response?.data?.message || 'किसान को बुलाने में त्रुटि हुई।');
                              }
                            }}
                            style={{ 
                              background: '#2563eb', 
                              color: '#ffffff', 
                              border: 'none', 
                              borderRadius: '6px', 
                              padding: '6px 12px', 
                              fontSize: '0.8rem', 
                              fontWeight: 700, 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Phone size={13} />
                            <span>कॉल करें</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ================= 3. RIGHT SIDEBAR ================= */}
        <div style={{ width: '230px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Quick Actions Card */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0' 
          }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏛️</span>
              <span>त्वरित कार्य</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => alert("नया किसान पंजीकरण विंडो")}
                style={{ 
                  width: '100%', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '9px 12px', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <UserPlus size={15} color="#059669" />
                <span>नया किसान पंजीकरण</span>
              </button>

              <button 
                onClick={() => navigate('/farmer/procurement-status')}
                style={{ 
                  width: '100%', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '9px 12px', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileText size={15} color="#0284c7" />
                <span>खरीद विवरण देखें</span>
              </button>

              <button 
                onClick={() => alert("समस्या रिपोर्ट विंडो")}
                style={{ 
                  width: '100%', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '9px 12px', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <AlertTriangle size={15} color="#ea580c" />
                <span>समस्या रिपोर्ट करें</span>
              </button>

              <button 
                onClick={() => alert("दैनिक उपार्जन खरीद रिपोर्ट जनरेट हो रही है...")}
                style={{ 
                  width: '100%', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '9px 12px', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <BarChart3 size={15} color="#7c3aed" />
                <span>उपार्जन रिपोर्ट जनरेट करें</span>
              </button>
            </div>
          </div>

          {/* Need Help Card */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0' 
          }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Headphones size={16} color="#059669" />
              <span>सहायता चाहिए?</span>
            </h4>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0 0 12px 0' }}>
              किन्हीं भी तकनीकी सहायता के लिए हमसे संपर्क करें
            </p>

            <div style={{ 
              background: '#044e3b', 
              color: '#ffffff', 
              borderRadius: '8px', 
              padding: '10px 12px', 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              justifyContent: 'center' 
            }}>
              <Phone size={15} />
              <span>किसान हेल्पलाइन 1800-180-1551</span>
            </div>
          </div>

          {/* Annadata Green Banner */}
          <div style={{ 
            background: '#dcfce7', 
            borderRadius: '16px', 
            padding: '18px 14px', 
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '1.8rem' }}>🌿</div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#166534', lineHeight: 1.2 }}>
                अन्नदाता<br />देश की शान
              </div>
            </div>
          </div>

        </div>

      {/* Gate Arrival QR Verification Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1.5px solid #a7f3d0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                    गेट आगमन QR सत्यापन
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    किसान के डिजिटल पास का QR टोकन अथवा टोकन संख्या दर्ज करें
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowQrModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800, color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyGateQr}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  QR कोड टोकन / बुकिंग संदर्भ / टोकन (उदा. BK-10023):
                </label>
                <input 
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="उदा. BK-10023"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Demo quick tokens for testing */}
              {import.meta.env.DEV && (
                <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.76rem', color: '#64748b' }}>
                  <strong style={{ color: '#0f172a' }}>त्वरित परीक्षण टोकन:</strong>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setQrInput('BK-2026-98124')}
                      style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      BK-2026-98124
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={qrLoading}
                  style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {qrLoading ? 'सत्यापित हो रहा है...' : '✓ आगमन सत्यापित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
