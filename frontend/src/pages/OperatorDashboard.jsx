import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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
  Sparkles
} from 'lucide-react';

import operatorBadgeImg from '../assets/operator_console_badge.png';
import operatorShedImg from '../assets/operator_banner_shed.png';
import tractorFieldImg from '../assets/tractor_field.png';

export default function OperatorDashboard() {
  const navigate = useNavigate();

  // Active Token state (Default matching screenshot: Suresh Yadav, A-103)
  const [activeToken, setActiveToken] = useState({
    tokenNo: 'A-103',
    farmerName: 'सुरेश यादव',
    crop: 'गेहूं (FAQ)',
    statusText: 'काउंटर 2 पर तौल एवं जांच प्रक्रिया में',
    bookingId: 103,
    arrivalStatus: 'CALLED'
  });

  // Quality Check state (Pre-filled as in screenshot)
  const [moisture, setMoisture] = useState('10.8');
  const [foreignMatter, setForeignMatter] = useState('0.4');
  const [qualityGrade, setQualityGrade] = useState('FAQ Grade A (उत्तम गुणवत्ता - पूर्ण MSP)');
  const [qcVerified, setQcVerified] = useState(true);

  // Weighbridge state (Pre-filled as in screenshot)
  const [grossWeight, setGrossWeight] = useState('42350');
  const [tareWeight, setTareWeight] = useState('12200');
  const [weighSaved, setWeighSaved] = useState(false);
  const [jFormGenerated, setJFormGenerated] = useState(false);

  // Counter Selector
  const [selectedCounter, setSelectedCounter] = useState('counter2');

  // Waiting list
  const [waitingList, setWaitingList] = useState([
    { tokenNo: 'A-104', farmerName: 'मनोज तिवारी', crop: 'गेहूं', time: '10:15 AM', status: 'Waiting (2 Ahead)' },
    { tokenNo: 'A-105', farmerName: 'सुरेंद्र कुमार', crop: 'गेहूं', time: '10:25 AM', status: 'Waiting (3 Ahead)' },
    { tokenNo: 'A-106', farmerName: 'दीपक वर्मा', crop: 'गेहूं', time: '10:40 AM', status: 'Waiting (4 Ahead)' },
    { tokenNo: 'A-107', farmerName: 'विकास मौर्य', crop: 'गेहूं', time: '10:55 AM', status: 'Waiting (5 Ahead)' }
  ]);

  // Live Net and MSP Calculation
  const grossNum = parseFloat(grossWeight) || 0;
  const tareNum = parseFloat(tareWeight) || 0;
  const netKg = Math.max(0, grossNum - tareNum);
  const netQuintals = (netKg / 100).toFixed(1);
  const mspRate = 2275;
  const totalAmount = Math.round(parseFloat(netQuintals) * mspRate);

  // Fetch live queue from backend if available
  useEffect(() => {
    fetchBackendQueue();
  }, []);

  const fetchBackendQueue = async () => {
    try {
      const res = await api.get('/operator/queue?centerId=1');
      if (res.data && res.data.length > 0) {
        const called = res.data.find(q => q.currentStatus === 'CALLED' || q.currentStatus === 'AT_COUNTER');
        if (called) {
          setActiveToken({
            tokenNo: called.tokenNumber || 'A-103',
            farmerName: called.farmerName || 'सुरेश यादव',
            crop: `${called.produceName || 'गेहूं'} (FAQ)`,
            statusText: `काउंटर 2 पर तौल एवं जांच प्रक्रिया में`,
            bookingId: called.bookingId,
            arrivalStatus: called.currentStatus
          });
        }
      }
    } catch (e) {
      // Graceful fallback to screenshot data
    }
  };

  const handleCallNext = () => {
    if (waitingList.length === 0) {
      alert("कतार में कोई और प्रतीक्षारत किसान नहीं है।");
      return;
    }
    const nextFarmer = waitingList[0];
    const newWaiting = waitingList.slice(1);
    setActiveToken({
      tokenNo: nextFarmer.tokenNo,
      farmerName: nextFarmer.farmerName,
      crop: `${nextFarmer.crop} (FAQ)`,
      statusText: 'काउंटर 2 पर तौल एवं जांच प्रक्रिया में',
      bookingId: 104,
      arrivalStatus: 'CALLED'
    });
    setWaitingList(newWaiting);
    setWeighSaved(false);
    setJFormGenerated(false);
  };

  const handleVerifyQC = () => {
    setQcVerified(true);
    alert(`गुणवत्ता जांच प्रमाणित!\nनमी: ${moisture}%\nविदेशी पदार्थ: ${foreignMatter}%\nग्रेड: ${qualityGrade}\nस्थिति: PASSED (मानक के अनुरूप)`);
  };

  const handleSaveWeighment = () => {
    setWeighSaved(true);
    alert(`इलेक्ट्रॉनिक धर्मकांटा तौल दर्ज किया गया:\nसकल वजन: ${grossWeight} Kg\nखाली वाहन: ${tareWeight} Kg\nशुद्ध वजन: ${netQuintals} क्विंटल\nकुल देय राशि: ₹${totalAmount.toLocaleString('en-IN')}`);
  };

  const handleIssueJForm = () => {
    setJFormGenerated(true);
    alert(`सफलतापूर्वक J-Form जनरेट हुआ!\nटोकन: ${activeToken.tokenNo}\nकिसान: ${activeToken.farmerName}\nशुद्ध वजन: ${netQuintals} क्विंटल\nDBT भुगतान राशि: ₹${totalAmount.toLocaleString('en-IN')}\n\nJ-Form डाउनलोड एवं DBT ट्रेजरी अनुमोदन के लिए प्रेषित।`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '20px 0 40px 0' }}>
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
                    APMC मंडी ऑपरेटर कंसोल
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                    • चुनार कृषि उपज मंडी (CEN-001)
                  </span>
                </div>

                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#064e3b', margin: '0 0 4px 0', letterSpacing: '-0.2px' }}>
                  काउंटर प्रबंधन एवं इलेक्ट्रॉनिक धर्मकांटा प्रणाली
                </h2>

                <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>
                  ऑपरेटर: <strong>Rajesh Verma</strong> • सक्रिय काउंटर: <strong style={{ color: '#d97706' }}>काउंटर 2</strong> • जिला: मिर्ज़ापुर, उ.प्र.
                </div>
              </div>
            </div>

            {/* Right: Shed Graphic + Dropdown + Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
              <img 
                src={operatorShedImg} 
                alt="Mandi Shed" 
                style={{ height: '52px', objectFit: 'contain', opacity: 0.85, marginRight: '6px' }}
              />

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
                onClick={fetchBackendQueue}
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
              background: '#1d4ed8', 
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
                ACTIVE
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>टोकन नं.</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1.1 }}>
                {activeToken.tokenNo}
              </div>
            </div>

            {/* Middle Farmer Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                वर्तमान बुलाया गया किसान
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0' }}>
                <span>👤</span>
                <span>{activeToken.farmerName}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                फसल: <strong>{activeToken.crop}</strong> • {activeToken.statusText}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={handleCallNext}
                style={{ 
                  background: '#dc2626', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '11px 18px', 
                  fontSize: '0.88rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                }}
              >
                <Phone size={16} />
                <span>अगले किसान को बुलाएं (Call Next)</span>
              </button>

              <button 
                onClick={() => alert(`किसान विवरण:\nनाम: ${activeToken.farmerName}\nटोकन: ${activeToken.tokenNo}\nआधार: **** **** 4821\nबैंक: State Bank of India\nपंजीकृत भूमि: 4.5 हेक्टेयर`)}
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
                <span>मंडी कतार में प्रतीक्षारत किसान (Waiting List)</span>
              </div>
              <span style={{ 
                background: '#f1f5f9', 
                color: '#475569', 
                fontSize: '0.74rem', 
                fontWeight: 700, 
                padding: '3px 10px', 
                borderRadius: '12px' 
              }}>
                कुल: {waitingList.length + 4} किसान
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
                {waitingList.map((row, idx) => (
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
                          onClick={() => {
                            setActiveToken({
                              tokenNo: row.tokenNo,
                              farmerName: row.farmerName,
                              crop: `${row.crop} (FAQ)`,
                              statusText: 'काउंटर 2 पर तौल एवं जांच प्रक्रिया में',
                              bookingId: 104 + idx,
                              arrivalStatus: 'CALLED'
                            });
                            setWaitingList(waitingList.filter(w => w.tokenNo !== row.tokenNo));
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
                        <button 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                          title="अन्य विकल्प"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                onClick={() => alert("दैनिक मंडी खरीद रिपोर्ट जनरेट हो रही है...")}
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
                <span>मंडी रिपोर्ट जनरेट करें</span>
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

      </div>
    </div>
  );
}
