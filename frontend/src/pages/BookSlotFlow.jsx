import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import api from '../services/api';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sun,
  ShieldCheck,
  Users,
  Timer,
  Info,
  Calculator,
  RotateCcw,
  QrCode,
  CheckCircle2,
  Sparkles,
  Printer,
  XCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Authentic Visual Assets
import cropWheat from '../assets/crop_wheat.png';
import cropRice from '../assets/crop_rice.png';
import cropMaize from '../assets/crop_maize.png';
import cropMustard from '../assets/crop_mustard.png';
import cropGram from '../assets/crop_gram.png';
import farmerSketch from '../assets/farmer_sketch.png';
import khetiSketch from '../assets/kheti_sketch.png';
import farmerBundle from '../assets/farmer_bundle.png';
import tractorField from '../assets/tractor_field.png';
import apmcBuilding from '../assets/apmc_building.png';
import juteSack from '../assets/jute_sack.png';
import wheatBanner from '../assets/wheat_banner.png';
import docCard from '../assets/doc_card.png';
import leftFarmSketch from '../assets/left_farm_sketch.png';
import annadataSketch from '../assets/annadata_sketch.png';

export default function BookSlotFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    slots: contextSlots, 
    centres: contextCentres, 
    confirmBookingWithCapacity, 
    cancelBooking,
    activeBooking: contextActiveBooking,
    addNotification
  } = useBooking();

  // Wizard 7-Step Sequence exactly matching user request & screenshot:
  // 1: फसल चुनें (अपनी फसल का चयन करें / Select Crop)
  // 2: मात्रा चुनें (अनुमानित उपज दर्ज करें / Enter Quantity in Quintals)
  // 3: गुणवत्ता चुनें (फसल की गुणवत्ता चुनें / Select Quality FAQ Grade)
  // 4: केंद्र चुनें (निकटतम खरीद केंद्र चुनें / Select Procurement Centre)
  // 5: तारीख चुनें (मंडी जाने की तारीख चुनें / Select Date)
  // 6: समय स्लॉट (सुविधाजनक समय चुनें / Capacity-Aware Slot Allocation & Smart Recommendation)
  // 7: पुष्टि करें (टोकन प्राप्त करें / Confirmation, Token & Real-Time Queue)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelledSuccess, setCancelledSuccess] = useState(false);

  // Selections
  const [selectedCropKey, setSelectedCropKey] = useState('wheat');
  const [quantity, setQuantity] = useState(65); // Default 65 Quintals matching SIH demo
  const [qualityGrade, setQualityGrade] = useState({
    id: 'faq_a',
    title: 'FAQ ग्रेड A (उत्तम गुणवत्ता - पूर्ण MSP)',
    moisture: '10% – 12% (आदर्श)',
    foreignMatter: '< 0.75%',
    mspMultiplier: 1.0,
    badge: '100% MSP गारंटी'
  });

  const [selectedCentre, setSelectedCentre] = useState(() => {
    return contextCentres && contextCentres.length > 0 ? contextCentres[0] : {
      centerId: 1,
      centerCode: 'GZB-WHT-01',
      centerName: 'गाज़ियाबाद गेहूं खरीद केंद्र (Ghaziabad Procurement Centre)',
      centerShortName: 'Ghaziabad Centre',
      centerLocation: 'गाज़ियाबाद, उत्तर प्रदेश (Ghaziabad, Uttar Pradesh)',
      distanceKm: 4.2,
      status: 'Open',
      statusBadge: 'खुला है (Open)',
      totalDailyCapacityQ: 1000,
      bookedDailyCapacityQ: 580,
      remainingDailyCapacityQ: 420,
      currentQueueLength: 18,
      activeCounters: 3
    };
  });

  const [selectedDate, setSelectedDate] = useState('2026-09-24');

  // Slot capacities dynamically tracked from context
  const currentSlots = useMemo(() => {
    return contextSlots || [];
  }, [contextSlots]);

  // Selected time slot
  const [selectedSlotId, setSelectedSlotId] = useState(5); // Default to 02:00 PM - 03:00 PM (has 75 Q remaining)

  // Booking confirmed state
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Backend crop list
  const [produceList, setProduceList] = useState([]);

  // Voice narration helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 5 Crops data
  const CROPS = [
    {
      id: 'wheat',
      code: 'WHT-2026',
      name: 'गेहूं',
      subtext: 'Rabi 2026',
      mspText: 'MSP : ₹2,275/क्विंटल',
      mspValue: 2275,
      image: cropWheat,
      season: 'Rabi 2026'
    },
    {
      id: 'rice',
      code: 'RIC-2026',
      name: 'धान (चावल)',
      subtext: 'Kharif 2026',
      mspText: 'MSP : ₹2,300/क्विंटल',
      mspValue: 2300,
      image: cropRice,
      season: 'Kharif 2026'
    },
    {
      id: 'maize',
      code: 'MAI-2026',
      name: 'मक्का',
      subtext: 'Kharif 2026',
      mspText: 'MSP : ₹2,090/क्विंटल',
      mspValue: 2090,
      image: cropMaize,
      season: 'Kharif 2026'
    },
    {
      id: 'mustard',
      code: 'MUS-2026',
      name: 'सरसों',
      subtext: 'Rabi 2026',
      mspText: 'MSP : ₹5,650/क्विंटल',
      mspValue: 5650,
      image: cropMustard,
      season: 'Rabi 2026'
    },
    {
      id: 'gram',
      code: 'GRA-2026',
      name: 'चना',
      subtext: 'Rabi 2026',
      mspText: 'MSP : ₹5,440/क्विंटल',
      mspValue: 5440,
      image: cropGram,
      season: 'Rabi 2026'
    }
  ];

  // Quality grading options
  const QUALITY_OPTIONS = [
    {
      id: 'faq_a',
      title: 'FAQ ग्रेड A (उत्तम गुणवत्ता - पूर्ण MSP)',
      desc: 'नमी 10%-12% और विजातीय तत्व 0.75% से कम। सरकारी मानकों के पूर्णतः अनुरूप।',
      moisture: '10% – 12% (आदर्श)',
      foreignMatter: '< 0.75%',
      mspMultiplier: 1.0,
      badge: '✓ 100% पूर्ण MSP दर',
      badgeColor: '#017953',
      badgeBg: '#ecfdf5'
    },
    {
      id: 'faq_b',
      title: 'FAQ ग्रेड B (मानक गुणवत्ता - मानक MSP)',
      desc: 'नमी 12%-14% और विजातीय तत्व 0.75%-1.5%। मानक कटौती के साथ स्वीकार्य।',
      moisture: '12% – 14% (स्वीकार्य)',
      foreignMatter: '0.75% – 1.5%',
      mspMultiplier: 0.98,
      badge: 'मानक स्वीकार्य',
      badgeColor: '#d97706',
      badgeBg: '#fef3c7'
    },
    {
      id: 'non_faq',
      title: 'Non-FAQ ग्रेड (जांच एवं सफाई उपरांत)',
      desc: 'नमी 14% से अधिक अथवा विजातीय तत्व अधिक। मंडी में सफाई व सुखाने की आवश्यकता होगी।',
      moisture: '> 14% (सुखाना आवश्यक)',
      foreignMatter: '> 1.5%',
      mspMultiplier: 0.95,
      badge: 'जांच उपरांत निर्णय',
      badgeColor: '#dc2626',
      badgeBg: '#fee2e2'
    }
  ];

  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.get('/produce').catch(() => ({ data: [] })),
        api.get('/centers').catch(() => ({ data: [] }))
      ]);
      if (pRes.data && pRes.data.length > 0) setProduceList(pRes.data);
    } catch (err) {
      console.warn('Backend data loaded with mock fallbacks', err);
    } finally {
      setLoading(false);
    }
  };

  const currentCrop = CROPS.find(c => c.id === selectedCropKey) || CROPS[0];
  const effectiveMspRate = Math.round(currentCrop.mspValue * (qualityGrade.mspMultiplier || 1.0));
  const estimatedAmount = (quantity * effectiveMspRate).toLocaleString('en-IN');

  // Selected time slot object
  const selectedTimeSlot = useMemo(() => {
    return currentSlots.find(s => s.slotId === selectedSlotId) || currentSlots[0];
  }, [currentSlots, selectedSlotId]);

  // SMART SLOT RECOMMENDATION LOGIC (Section 4)
  // Finds the best slots where remainingCapacityQ >= quantity
  const smartRecommendations = useMemo(() => {
    const suitableSlots = currentSlots.filter(s => s.remainingCapacityQ >= quantity && s.status !== 'FULL');
    if (suitableSlots.length === 0) return { recommended: null, alternative: null };

    // Primary recommendation: slot with best capacity fit
    const recommended = suitableSlots[0];
    const alternative = suitableSlots.length > 1 ? suitableSlots[1] : null;
    return { recommended, alternative };
  }, [currentSlots, quantity]);

  // 7 Stepper definitions matching exact sequence
  const STEPPER_STEPS = [
    { id: 1, main: '1. फसल चुनें', sub: 'अपनी फसल का चयन करें' },
    { id: 2, main: '2. मात्रा चुनें', sub: 'अनुमानित उपज दर्ज करें' },
    { id: 3, main: '3. गुणवत्ता चुनें', sub: 'फसल की गुणवत्ता चुनें' },
    { id: 4, center: true, id: 4, main: '4. केंद्र चुनें', sub: 'निकटतम खरीद केंद्र चुनें' },
    { id: 5, main: '5. तारीख चुनें', sub: 'मंडी जाने की तारीख चुनें' },
    { id: 6, main: '6. समय स्लॉट', sub: 'सुविधाजनक समय चुनें' },
    { id: 7, main: '7. पुष्टि करें', sub: 'टोकन प्राप्त करें' }
  ];

  // Step Navigation handlers
  const handleNext = () => {
    setErrorMsg('');
    if (step === 2) {
      if (!quantity || quantity <= 0) {
        setErrorMsg('कृपया वैध उपज मात्रा दर्ज करें (Please enter a valid quantity).');
        return;
      }
    }
    if (step === 6) {
      // Validate capacity-aware selection
      if (selectedTimeSlot && quantity > selectedTimeSlot.remainingCapacityQ) {
        setErrorMsg(`इस स्लॉट में केवल ${selectedTimeSlot.remainingCapacityQ} क्विंटल क्षमता शेष है। कृपया कम मात्रा दर्ज करें या अन्य स्लॉट चुनें।`);
        return;
      }
    }
    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/farmer/dashboard');
    }
  };

  // Final confirmation & Capacity-Aware Booking
  const handleFinalBooking = async () => {
    setSubmitting(true);
    setErrorMsg('');

    // Backend validation check
    if (quantity > (selectedTimeSlot?.remainingCapacityQ || 0)) {
      setErrorMsg(`अति-आरक्षण (Overbooking) रोका गया: स्लॉट में केवल ${selectedTimeSlot?.remainingCapacityQ} क्विंटल शेष है, जबकि आपकी मात्रा ${quantity} क्विंटल है।`);
      setSubmitting(false);
      return;
    }

    try {
      const dbCrop = produceList.find(p => p.produceCode === currentCrop.code) || produceList[0];
      const payload = {
        centerId: selectedCentre?.centerId || 1,
        produceId: dbCrop?.produceId || 1,
        slotId: selectedSlotId || 5,
        estimatedQuantity: quantity
      };
      
      // Try backend call
      let backendRes = null;
      try {
        backendRes = await api.post('/farmer/book-slot', payload);
      } catch (apiErr) {
        console.info('Backend call fallback to resilient mock simulation', apiErr);
      }

      const generatedToken = backendRes?.data?.tokenNumber || `WHT-042`;
      const generatedBookingId = backendRes?.data?.bookingReference || `KK-260922-1045`;

      const unifiedBooking = {
        bookingId: generatedBookingId,
        numericId: backendRes?.data?.bookingId || 86,
        tokenNumber: generatedToken,
        secondaryToken: 'T-114-30',
        bookingReference: generatedBookingId,
        farmerId: user?.farmerId || 1,
        farmerName: user?.name || user?.username || 'किसान भाई (Farmer)',
        cropKey: selectedCropKey,
        cropName: `${currentCrop.name} (Wheat)`,
        cropCode: currentCrop.code,
        qualityGrade: qualityGrade.title,
        moisturePercent: qualityGrade.moisture,
        centerId: selectedCentre?.centerId || 1,
        centerName: selectedCentre?.centerName || 'गाज़ियाबाद गेहूं खरीद केंद्र (Ghaziabad Procurement Centre)',
        centerShortName: selectedCentre?.centerShortName || 'Ghaziabad Centre',
        centerLocation: selectedCentre?.centerLocation || 'गाज़ियाबाद, उत्तर प्रदेश',
        slotDate: selectedDate,
        slotDateDisplay: '24 सितम्बर 2026 (24 Sep 2026)',
        timeSlotLabel: selectedTimeSlot?.timeRangeLabel || '02:00 PM – 03:00 PM',
        slotId: selectedSlotId,
        quantity: Number(quantity),
        mspRate: effectiveMspRate,
        estimatedAmount: Number(quantity) * effectiveMspRate,
        bookingStatus: 'CONFIRMED',
        queueStage: 'BOOKED',
        counterId: 2,
        counterNumber: 2,
        counterName: 'काउंटर 02 (Counter 02)',
        currentServingToken: 'WHT-037',
        queuePosition: 6,
        farmersAhead: 5,
        estimatedWaitMinutes: 25,
        verificationDeadline: '01:50 PM, 24 Sep 2026',
        bookedAt: new Date().toISOString(),
        qrCodeToken: `KK-GZB-${generatedToken}-20260924-F1`,
        isDemoData: true
      };

      // Confirm booking and update slot capacities in context
      confirmBookingWithCapacity(unifiedBooking);
      setBookingConfirmed(unifiedBooking);
      setStep(7);
    } catch (err) {
      console.error('Booking failed', err);
      setErrorMsg('स्लॉट बुकिंग के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  // Immediate Cancellation & Capacity Release (Section 9)
  const handleCancelBooking = () => {
    if (!window.confirm('क्या आप निश्चित रूप से यह स्लॉट बुकिंग रद्द करना चाहते हैं? आपकी दर्ज मात्रा तुरंत स्लॉट क्षमता में पुनः जुड़ जाएगी।')) {
      return;
    }
    const cancelled = cancelBooking(bookingConfirmed?.bookingId || contextActiveBooking?.bookingId);
    setCancelledSuccess(true);
    setBookingConfirmed(cancelled);
  };

  return (
    <div style={{ 
      background: 'transparent', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '24px 0 40px 0',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <div className="portal-container" style={{ maxWidth: step === 6 ? '1180px' : '1080px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>

        {/* ================= HERO TOP BANNER ================= */}
        {step === 1 && (
          <div style={{ 
            background: 'linear-gradient(90deg, #dcfce7 0%, #ecfdf5 40%, #fefce8 80%, #fef3c7 100%)', 
            border: '1px solid #bbf7d0', 
            borderRadius: '24px', 
            padding: '16px 28px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            boxShadow: '0 4px 14px rgba(1, 121, 83, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#bbf7d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🌱
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                  सही दाम, सुरक्षित भविष्य • क्षमता-आधारित खरीद स्लॉट
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#374151', margin: '2px 0 0 0' }}>
                  फसल की मात्रा के अनुसार वास्तविक-समय स्लॉट आरक्षण एवं पारदर्शी कतार प्रबंधन।
                </p>
              </div>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
              “किसान की समृद्धि देश की प्रगति”
            </div>
          </div>
        )}

        {/* ================= EXACT 7-STEP STEPPER CONTAINER ================= */}
        <div style={{ 
          background: 'rgb(255, 255, 255)', 
          borderRadius: '20px', 
          border: '1px solid rgb(226, 232, 240)', 
          padding: '16px 28px', 
          marginBottom: '20px', 
          boxShadow: 'rgba(0, 0, 0, 0.03) 0px 4px 16px' 
        }}>
          <div style={{ position: 'relative' }}>
            {/* Connecting Horizontal Line */}
            <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '2.5px', background: 'rgb(226, 232, 240)', zIndex: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {STEPPER_STEPS.map((st) => {
                const isCompleted = step > st.id;
                const isActive = step === st.id;
                return (
                  <div 
                    key={st.id} 
                    onClick={() => {
                      if (st.id < step) setStep(st.id);
                    }}
                    style={{ textAlign: 'center', cursor: st.id < step ? 'pointer' : 'default', flex: '1 1 0%' }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: isCompleted || isActive ? 'rgb(1, 121, 83)' : 'rgb(255, 255, 255)', 
                      border: isCompleted || isActive ? 'medium none currentcolor' : '1.5px solid rgb(203, 213, 225)', 
                      color: isCompleted || isActive ? 'rgb(255, 255, 255)' : 'rgb(100, 116, 139)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800, 
                      fontSize: '0.92rem', 
                      margin: '0px auto 5px', 
                      boxShadow: isActive ? 'rgb(187, 247, 208) 0px 0px 0px 4px' : 'none'
                    }}>
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        st.id
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '0.88rem', 
                      fontWeight: isActive ? 800 : 600, 
                      color: isActive ? 'rgb(1, 121, 83)' : (isCompleted ? 'rgb(6, 78, 59)' : 'rgb(100, 116, 139)') 
                    }}>
                      {st.main}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgb(156, 163, 175)', marginTop: '1px' }}>
                      {st.sub}
                    </div>
                    {isActive && (
                      <div style={{ width: '42px', height: '3px', background: 'rgb(1, 121, 83)', margin: '3px auto 0px', borderRadius: '2px' }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Error Notice */}
        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1.5px solid #f87171', borderRadius: '12px', padding: '12px 18px', color: '#991b1b', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={20} color="#dc2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: फसल चुनें (Select Crop) ================= */}
        {step === 1 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => navigate('/farmer/dashboard')} style={{ background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', padding: '6px 18px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> <span>डैशबोर्ड पर वापस जाएं</span>
              </button>
              <button onClick={() => speakText("कृपया अपनी बेचने योग्य फसल का चयन करें।")} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px 18px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Volume2 size={16} color="#d97706" /> <span>सुनें (आवाज)</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>🌱</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>अपनी बेचने योग्य फसल का चयन करें</h3>
                <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '3px 0 0 0' }}>वह फसल चुनें जिसे आप आज सरकारी खरीद केंद्र पर बेचना चाहते हैं</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '32px' }}>
              {CROPS.map((crop) => {
                const isSelected = selectedCropKey === crop.id;
                return (
                  <div 
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropKey(crop.id);
                      speakText(`${crop.name}, ${crop.mspText}`);
                    }}
                    style={{ 
                      border: isSelected ? '2px solid #017953' : '1.5px solid #e5e7eb', 
                      background: isSelected ? '#fbfdfc' : '#ffffff', 
                      borderRadius: '16px', 
                      padding: '16px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 14px rgba(1, 121, 83, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={crop.image} alt={crop.name} style={{ width: '60px', height: '46px', objectFit: 'contain' }} />
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>{crop.name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '1px' }}>{crop.subtext}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#017953', marginTop: '3px' }}>{crop.mspText}</div>
                      </div>
                    </div>
                    <div>
                      {isSelected ? (
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                          <Check size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #cbd5e1', background: '#ffffff' }}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', border: '1.5px solid #a7f3d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} color="#017953" />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#017953' }}>न्यूनतम समर्थन मूल्य (MSP) की गारंटी</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '1px' }}>पारदर्शी तौल और डीबीटी के माध्यम से सीधा बैंक खाता हस्तांतरण।</div>
                </div>
              </div>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (मात्रा दर्ज करें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: मात्रा चुनें (Enter Quantity in Quintals) ================= */}
        {step === 2 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={juteSack} alt="Sack" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700 }}>2. मात्रा चुनें (Enter Produce Details)</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '2px 0 0 0' }}>
                    अनुमानित उपज की मात्रा (क्विंटल में) दर्ज करें
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '2px 0 0 0' }}>
                    प्रणाली इसी मात्रा के आधार पर खरीद केंद्र के स्लॉट की वास्तविक क्षमता की गणना करेगी।
                  </p>
                </div>
              </div>

              <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '14px', padding: '12px 16px', fontSize: '0.84rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '340px' }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <span><strong>क्षमता जांच:</strong> आपकी दर्ज मात्रा से अधिक क्षमता वाले समय स्लॉट ही चयन हेतु उपलब्ध होंगे।</span>
              </div>
            </div>

            {/* Quantity Input Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 280px', gap: '24px', alignItems: 'center', marginBottom: '28px', background: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '18px', padding: '24px' }}>
              
              <div style={{ textAlign: 'center' }}>
                <img src={wheatBanner} alt="Mehnat Aapki" style={{ width: '90px', height: 'auto', display: 'block', margin: '0 auto' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
                  अनुमानित फसल उपज (Quintals / क्विंटल) <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#9ca3af' }} />
                </label>

                {/* - [ 65 ] + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', maxWidth: '360px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(5, quantity - 5))}
                    style={{ width: '44px', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <div style={{ flex: 1, textAlign: 'center', background: '#ffffff', padding: '8px', borderRadius: '10px', border: '2px solid #017953' }}>
                    <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#111827' }}>{quantity}</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginLeft: '6px' }}>Q</span>
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 5)}
                    style={{ width: '44px', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                {/* Range Slider */}
                <div style={{ maxWidth: '380px' }}>
                  <input 
                    type="range" 
                    min="5" 
                    max="150" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#017953', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                    <span>5 Q</span><span>25 Q</span><span>50 Q</span><span>65 Q</span><span>100 Q</span><span>150 Q</span>
                  </div>
                </div>
              </div>

              {/* Crop badge & presets */}
              <div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>चयनित फसल</span>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🌱</span> <span>{currentCrop.name} ({currentCrop.season})</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '4px 10px', fontSize: '0.76rem', fontWeight: 700, color: '#017953', cursor: 'pointer' }}>
                    बदलें
                  </button>
                </div>

                {/* SIH quick presets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[25, 40, 50, 65, 80, 100].map((q) => {
                    const isSel = quantity === q;
                    return (
                      <button 
                        key={q}
                        onClick={() => setQuantity(q)}
                        style={{ 
                          padding: '8px 0', 
                          borderRadius: '8px', 
                          border: isSel ? '2px solid #017953' : '1px solid #cbd5e1', 
                          background: isSel ? '#017953' : '#ffffff', 
                          color: isSel ? '#ffffff' : '#374151', 
                          fontWeight: 800, 
                          fontSize: '0.86rem', 
                          cursor: 'pointer' 
                        }}
                      >
                        {q} Q
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Live MSP Calculation Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={22} color="#017953" />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>अनुमानित मूल्य (MSP Calculation)</span>
                  <div style={{ fontSize: '0.86rem', color: '#374151', fontWeight: 700 }}>
                    MSP ₹{currentCrop.mspValue.toLocaleString('en-IN')}/क्विंटल के आधार पर
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#017953' }}>
                  ₹{estimatedAmount}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  ({quantity} क्विंटल × ₹{currentCrop.mspValue})
                </div>
              </div>

              <div style={{ maxWidth: '340px', fontSize: '0.76rem', color: '#4b5563', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#017953' }} />
                वास्तविक भुगतान मंडी में धर्मकांटा तौल एवं गुणवत्ता परीक्षण (FAQ Grade) के बाद DBT द्वारा किया जाएगा।
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> <span>पिछला चरण</span>
              </button>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (गुणवत्ता चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 3: गुणवत्ता चुनें (Quality FAQ Grade) ================= */}
        {step === 3 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण</span>
              </button>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                🌾 फसल गुणवत्ता एवं मानक (FAQ Grade Selection)
              </h3>
              <div style={{ width: '80px' }}></div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#4b5563', marginBottom: '24px' }}>
              अपनी उपज की अनुमानित नमी और गुणवत्ता का चयन करें ताकि खरीद केंद्र पर त्वरित सत्यापन और सही मूल्य मिल सके।
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
              {QUALITY_OPTIONS.map((q) => {
                const isSel = qualityGrade.id === q.id;
                return (
                  <div 
                    key={q.id}
                    onClick={() => setQualityGrade(q)}
                    style={{ 
                      border: isSel ? '2px solid #017953' : '1px solid #e2e8f0', 
                      background: isSel ? '#f0fdf4' : '#ffffff', 
                      borderRadius: '16px', 
                      padding: '20px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSel ? '0 6px 18px rgba(1, 121, 83, 0.12)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, background: q.badgeBg, color: q.badgeColor, padding: '3px 10px', borderRadius: '12px' }}>
                          {q.badge}
                        </span>
                        {isSel && (
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                        {q.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                        {q.desc}
                      </p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px', fontSize: '0.78rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>नमी सीमा (Moisture):</span>
                        <strong style={{ color: '#111827' }}>{q.moisture}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>विजातीय तत्व:</span>
                        <strong style={{ color: '#111827' }}>{q.foreignMatter}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '10px 18px', fontSize: '0.84rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#017953" />
                <span><strong>पारदर्शी गुणवत्ता जांच:</strong> मंडी में ऑपरेटर डिजिटल नमी मीटर से गुणवत्ता जांच करेगा।</span>
              </div>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (खरीद केंद्र चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: केंद्र चुनें (Select Procurement Centre) ================= */}
        {step === 4 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण</span>
              </button>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0, textAlign: 'center' }}>
                  🏢 खरीद केंद्र का चयन करें (Select Procurement Centre)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0', textAlign: 'center' }}>
                  दूरी, आज की शेष क्षमता एवं वर्तमान कतार की स्थिति देखकर केंद्र चुनें
                </p>
              </div>
              <div style={{ width: '80px' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {contextCentres.map((c) => {
                const isSel = selectedCentre?.centerId === c.centerId;
                const capacityPercent = Math.round((c.bookedDailyCapacityQ / c.totalDailyCapacityQ) * 100);
                return (
                  <div 
                    key={c.centerId}
                    onClick={() => setSelectedCentre(c)}
                    style={{ 
                      border: isSel ? '2px solid #017953' : '1px solid #e2e8f0', 
                      background: isSel ? '#f0fdf4' : '#ffffff', 
                      borderRadius: '16px', 
                      padding: '18px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSel ? '0 6px 18px rgba(1, 121, 83, 0.12)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {c.isRecommended && (
                      <span style={{ position: 'absolute', top: '-10px', right: '14px', background: '#017953', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                        ⭐ अनुशंसित (Recommended)
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {c.centerCode}
                      </span>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 800, 
                        color: c.status === 'Open' ? '#047857' : '#b45309',
                        background: c.status === 'Open' ? '#dcfce7' : '#fef3c7',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        ● {c.statusBadge}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
                      {c.centerName}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="#017953" /> {c.centerLocation} • <strong>{c.distanceKm} किमी दूर</strong>
                    </p>

                    {/* Capacity and Queue metrics */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', border: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#475569' }}>आज की कुल क्षमता:</span>
                        <strong style={{ color: '#111827' }}>{c.totalDailyCapacityQ} Q</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#047857' }}>शेष क्षमता (Remaining):</span>
                        <strong style={{ color: '#017953', fontSize: '0.9rem' }}>{c.remainingDailyCapacityQ} Q</strong>
                      </div>

                      {/* Capacity bar */}
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${capacityPercent}%`, height: '100%', background: capacityPercent > 80 ? '#f59e0b' : '#017953', borderRadius: '3px' }}></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#475569' }}>वर्तमान कतार (Queue):</span>
                        <strong style={{ color: '#1d4ed8' }}>{c.currentQueueLength} किसान</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        सक्रिय काउंटर: {c.activeCounters}
                      </span>
                      {isSel ? (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #cbd5e1' }}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                चयनित: <strong>{selectedCentre?.centerName}</strong> ({selectedCentre?.remainingDailyCapacityQ} Q क्षमता शेष)
              </div>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (तारीख चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: तारीख चुनें (Select Date) ================= */}
        {step === 5 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 32px 28px 32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} color="#017953" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>5. तारीख चुनें (Select Booking Date)</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '2px 0 0 0' }}>उपलब्ध दैनिक खरीद क्षमता वाले दिन को चुनें</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                  <span>📅 सितम्बर 2026</span>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.84rem', fontWeight: 700, color: '#017953' }}>
                  केंद्र: {selectedCentre?.centerShortName}
                </div>
              </div>
            </div>

            {/* Horizontal Date Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { day: 'बुध', num: '23', month: 'सितम्बर', val: '2026-09-23', capacity: '120 Q शेष', status: 'सीमित', dotColor: '#f59e0b' },
                { day: 'गुरु', num: '24', month: 'सितम्बर', val: '2026-09-24', capacity: '420 Q शेष', status: 'उपलब्ध', dotColor: '#017953', isDefault: true },
                { day: 'शुक्र', num: '25', month: 'सितम्बर', val: '2026-09-25', capacity: '550 Q शेष', status: 'उपलब्ध', dotColor: '#017953' },
                { day: 'शनि', num: '26', month: 'सितम्बर', val: '2026-09-26', capacity: '200 Q शेष', status: 'उपलब्ध', dotColor: '#017953' },
                { day: 'रवि', num: '27', month: 'सितम्बर', val: '2026-09-27', capacity: '0 Q शेष', status: 'अवकाश (Closed)', dotColor: '#ef4444', disabled: true },
                { day: 'सोम', num: '28', month: 'सितम्बर', val: '2026-09-28', capacity: '650 Q शेष', status: 'उपलब्ध', dotColor: '#017953' },
                { day: 'मंगल', num: '29', month: 'सितम्बर', val: '2026-09-29', capacity: '700 Q शेष', status: 'उपलब्ध', dotColor: '#017953' }
              ].map((d) => {
                const isSel = selectedDate === d.val;
                return (
                  <div 
                    key={d.val}
                    onClick={() => !d.disabled && setSelectedDate(d.val)}
                    style={{ 
                      border: isSel ? '2px solid #017953' : '1px solid #e2e8f0', 
                      background: isSel ? '#f0fdf4' : (d.disabled ? '#f9fafb' : '#ffffff'), 
                      borderRadius: '14px', 
                      padding: '16px 10px', 
                      textAlign: 'center', 
                      cursor: d.disabled ? 'not-allowed' : 'pointer',
                      opacity: d.disabled ? 0.6 : 1,
                      position: 'relative'
                    }}
                  >
                    {isSel && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '18px', height: '18px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{d.day}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0', lineHeight: 1.1 }}>{d.num}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{d.month}</div>
                    
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.dotColor, display: 'inline-block' }}></span>
                        <span>{d.capacity}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: d.disabled ? '#dc2626' : (d.status.includes('सीमित') ? '#d97706' : '#017953'), marginTop: '2px' }}>
                        {d.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 18px', fontSize: '0.84rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <span><strong>सलाह:</strong> 24 सितम्बर 2026 को पर्याप्त क्षमता (420 Q) उपलब्ध है। आप अगले चरण में अपनी सुविधानुसार समय स्लॉट चुन सकते हैं।</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> <span>पिछला चरण</span>
                </button>
                <button 
                  onClick={handleNext} 
                  style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 32px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
                >
                  <span>आगे बढ़ें (समय स्लॉट चुनें)</span> <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 6: समय स्लॉट (CAPACITY-AWARE SLOT ALLOCATION & SMART RECOMMENDATIONS) ================= */}
        {step === 6 && (
          <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Left Feature & Summary Sidebar */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '8px' }}>
                  ⚖️
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                  क्षमता-जागरूक आवंटन
                </h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '3px' }}>
                  Capacity-Aware Slot System
                </p>
              </div>

              {/* Farmer produce summary box */}
              <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>आपकी दर्ज उपज:</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                  <strong style={{ fontSize: '1.4rem', color: '#017953', fontWeight: 900 }}>{quantity} Q</strong>
                  <span style={{ fontSize: '0.82rem', color: '#111827', fontWeight: 700 }}>{currentCrop.name}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px' }}>
                  {qualityGrade.title.split(' ')[0]} {qualityGrade.title.split(' ')[1]}
                </div>
              </div>

              {/* Rules Explanations */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#374151' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#017953" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>प्रत्येक स्लॉट की क्षमता 100 क्विंटल है।</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#017953" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>आपकी मात्रा से कम क्षमता वाले स्लॉट स्वतः निष्क्रिय रहेंगे।</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#017953" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>अति-आरक्षण (Overbooking) पूरी तरह से वर्जित है।</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                <img src={apmcBuilding} alt="APMC" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#017953', marginTop: '8px' }}>
                  समृद्ध किसान • सशक्त मंडी
                </div>
              </div>
            </div>

            {/* Right Main Time-Slots with Smart Recommendations */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 30px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              
              {/* Back Button & Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      6. समय स्लॉट चुनें (Capacity-Aware Slot Allocation)
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#017953', fontWeight: 700, marginTop: '2px' }}>
                      {selectedCentre?.centerName} • 24 सितम्बर 2026
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(2)} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, color: '#017953', cursor: 'pointer' }}>
                  मात्रा बदलें ({quantity} Q)
                </button>
              </div>

              {/* ================= SMART SLOT RECOMMENDATION CARDS (Section 4) ================= */}
              {smartRecommendations.recommended && (
                <div style={{ 
                  background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)', 
                  border: '1.5px solid #a7f3d0', 
                  borderRadius: '16px', 
                  padding: '16px 20px', 
                  marginBottom: '22px',
                  boxShadow: '0 4px 14px rgba(1, 121, 83, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={18} color="#017953" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#064e3b' }}>
                      स्मार्ट स्लॉट अनुशंसा (Smart Slot Recommendation for {quantity} Quintals)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: smartRecommendations.alternative ? '1fr 1fr' : '1fr', gap: '14px' }}>
                    {/* Primary Recommended Slot */}
                    <div style={{ background: '#ffffff', border: '1.5px solid #017953', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ background: '#017953', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                          ★ अनुशंसित (Recommended)
                        </span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#111827', marginTop: '4px' }}>
                          {smartRecommendations.recommended.timeRangeLabel}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 700, marginTop: '2px' }}>
                          शेष क्षमता: {smartRecommendations.recommended.remainingCapacityQ} Q (आपकी उपज: {quantity} Q)
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedSlotId(smartRecommendations.recommended.slotId)}
                        style={{ 
                          background: selectedSlotId === smartRecommendations.recommended.slotId ? '#017953' : '#ecfdf5', 
                          color: selectedSlotId === smartRecommendations.recommended.slotId ? '#ffffff' : '#017953', 
                          border: '1px solid #017953', 
                          borderRadius: '8px', 
                          padding: '6px 14px', 
                          fontSize: '0.82rem', 
                          fontWeight: 700, 
                          cursor: 'pointer' 
                        }}
                      >
                        {selectedSlotId === smartRecommendations.recommended.slotId ? '✓ चयनित' : 'चुनें'}
                      </button>
                    </div>

                    {/* Alternative Slot */}
                    {smartRecommendations.alternative && (
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ background: '#e2e8f0', color: '#334155', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                            वैकल्पिक स्लॉट (Alternative)
                          </span>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                            {smartRecommendations.alternative.timeRangeLabel}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                            शेष क्षमता: {smartRecommendations.alternative.remainingCapacityQ} Q
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedSlotId(smartRecommendations.alternative.slotId)}
                          style={{ 
                            background: selectedSlotId === smartRecommendations.alternative.slotId ? '#017953' : '#ffffff', 
                            color: selectedSlotId === smartRecommendations.alternative.slotId ? '#ffffff' : '#334155', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '8px', 
                            padding: '6px 14px', 
                            fontSize: '0.82rem', 
                            fontWeight: 700, 
                            cursor: 'pointer' 
                          }}
                        >
                          {selectedSlotId === smartRecommendations.alternative.slotId ? '✓ चयनित' : 'चुनें'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= ALL CAPACITY-AWARE TIME SLOTS (Section 2 & 3) ================= */}
              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  सभी समय स्लॉट एवं वास्तविक क्षमता (Live Slot Capacities)
                </h4>
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> 🟢 Available</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> 🟡 Limited</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> 🔴 Full / Overcapacity</span>
                </div>
              </div>

              {/* 6 Modern Capacity-Aware Cards Grid (Section 3) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {currentSlots.map((s) => {
                  const isSelected = selectedSlotId === s.slotId;
                  const isFull = s.status === 'FULL' || s.remainingCapacityQ <= 0;
                  const isOvercapacity = quantity > s.remainingCapacityQ;
                  const isBlocked = isFull || isOvercapacity;

                  const bookedPercent = Math.min(100, Math.round((s.bookedCapacityQ / s.totalCapacityQ) * 100));

                  return (
                    <div 
                      key={s.slotId}
                      onClick={() => {
                        if (isBlocked) {
                          alert(`यह स्लॉट उपलब्ध नहीं है! स्लॉट में केवल ${s.remainingCapacityQ} क्विंटल क्षमता शेष है, जबकि आपकी उपज ${quantity} क्विंटल है। कृपया अपनी मात्रा घटाएं या अन्य स्लॉट चुनें।`);
                          return;
                        }
                        setSelectedSlotId(s.slotId);
                      }}
                      style={{ 
                        border: isSelected ? '2.5px solid #017953' : (isBlocked ? '1px dashed #cbd5e1' : '1px solid #e2e8f0'), 
                        background: isSelected ? '#f0fdf4' : (isBlocked ? '#f9fafb' : '#ffffff'), 
                        borderRadius: '14px', 
                        padding: '16px 18px', 
                        cursor: isBlocked ? 'not-allowed' : 'pointer',
                        opacity: isBlocked ? 0.65 : 1,
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 16px rgba(1, 121, 83, 0.15)' : 'none',
                        position: 'relative'
                      }}
                    >
                      {/* Top Row: Time Range + Status Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontSize: '1.02rem', fontWeight: 800, color: isBlocked ? '#64748b' : '#111827' }}>
                          {s.timeRangeLabel}
                        </div>

                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          color: isFull ? '#dc2626' : (s.status === 'LIMITED' ? '#b45309' : '#047857'),
                          background: isFull ? '#fee2e2' : (s.status === 'LIMITED' ? '#fef3c7' : '#dcfce7'),
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}>
                          {isFull ? '🔴 FULL' : (s.status === 'LIMITED' ? '🟡 LIMITED' : '🟢 AVAILABLE')}
                        </span>
                      </div>

                      {/* 3 Capacity Metrics: Total, Booked, Remaining */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#f8fafc', borderRadius: '8px', padding: '8px 10px', fontSize: '0.74rem', marginBottom: '10px' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>कुल क्षमता:</span>
                          <div style={{ fontWeight: 800, color: '#111827' }}>{s.totalCapacityQ} Q</div>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>आरक्षित (Booked):</span>
                          <div style={{ fontWeight: 800, color: '#4b5563' }}>{s.bookedCapacityQ} Q</div>
                        </div>
                        <div>
                          <span style={{ color: isBlocked ? '#dc2626' : '#047857' }}>शेष (Remaining):</span>
                          <div style={{ fontWeight: 900, color: isBlocked ? '#dc2626' : '#017953', fontSize: '0.86rem' }}>
                            {s.remainingCapacityQ} Q
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar of Capacity */}
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${bookedPercent}%`, height: '100%', background: isFull ? '#ef4444' : (bookedPercent > 75 ? '#f59e0b' : '#10b981') }}></div>
                      </div>

                      {/* Overcapacity warning or selection status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isOvercapacity && !isFull ? (
                          <span style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={13} />
                            केवल {s.remainingCapacityQ} क्विंटल क्षमता शेष है ({quantity} Q आवश्यक)
                          </span>
                        ) : isFull ? (
                          <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 800 }}>
                            ✕ क्षमता पूर्णतः समाप्त
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700 }}>
                            ✓ आपकी {quantity} क्विंटल उपज हेतु उपलब्ध
                          </span>
                        )}

                        <div>
                          {isSelected ? (
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #cbd5e1' }}></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> <span>पिछला चरण</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748b' }}>चयनित स्लॉट:</span>
                    <strong style={{ display: 'block', color: '#017953', fontSize: '0.92rem' }}>
                      {selectedTimeSlot?.timeRangeLabel} ({selectedTimeSlot?.remainingCapacityQ} Q शेष)
                    </strong>
                  </div>

                  <button 
                    onClick={handleNext} 
                    disabled={!selectedTimeSlot || quantity > selectedTimeSlot.remainingCapacityQ}
                    style={{ 
                      background: (!selectedTimeSlot || quantity > selectedTimeSlot.remainingCapacityQ) ? '#94a3b8' : '#017953', 
                      color: '#ffffff', 
                      border: 'none', 
                      borderRadius: '10px', 
                      padding: '12px 34px', 
                      fontSize: '1.02rem', 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: (!selectedTimeSlot || quantity > selectedTimeSlot.remainingCapacityQ) ? 'not-allowed' : 'pointer', 
                      boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' 
                    }}
                  >
                    <span>आगे बढ़ें (पुष्टि करें)</span> <ArrowRight size={18} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= STEP 7: पुष्टि करें (REVIEW, CONFIRM, TOKEN & REAL-TIME QUEUE) ================= */}
        {step === 7 && (
          <div>
            {!bookingConfirmed ? (
              /* Pre-Confirm Summary Card */
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Document Card */}
                <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                  <img src={docCard} alt="Checklist" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

                {/* Confirmation Details */}
                <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 800, background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px' }}>
                      7. पुष्टि करें (Final Verification)
                    </span>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: '8px 0 2px 0' }}>
                      स्लॉट बुकिंग एवं क्षमता आरक्षण की पुष्टि करें
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: 0 }}>
                      कृपया विवरण जांचें। पुष्टि करने पर टोकन जनरेट होगा एवं स्लॉट क्षमता लॉक हो जाएगी।
                    </p>
                  </div>

                  {/* 4 Summary Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                    
                    {/* 1. Crop & Quality */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        🌱
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>फसल एवं गुणवत्ता (Crop & Quality)</span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                          {currentCrop.name} (Wheat)
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#017953', fontWeight: 700, marginTop: '2px' }}>
                          {qualityGrade.title} • नमी: {qualityGrade.moisture}
                        </div>
                      </div>
                    </div>

                    {/* 2. Centre */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        🏢
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>खरीद केंद्र (Procurement Centre)</span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                          {selectedCentre?.centerName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          {selectedCentre?.centerLocation} • दूरी {selectedCentre?.distanceKm} किमी
                        </div>
                      </div>
                    </div>

                    {/* 3. Date & Time */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        📅
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>तारीख एवं समय (Date & Time Slot)</span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                          24 सितम्बर 2026 (24 Sep 2026)
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> <span>{selectedTimeSlot?.timeRangeLabel}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Quantity & Payout */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        💰
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>उपज मात्रा एवं अनुमानित मूल्य</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#017953' }}>
                          {quantity} क्विंटल = ₹{estimatedAmount}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                          दर: ₹{effectiveMspRate}/क्विंटल
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Capacity impact preview */}
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px', fontSize: '0.82rem', color: '#065f46', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 800, marginBottom: '2px' }}>
                      ⚡ क्षमता आरक्षण विवरण (Capacity Reservation Impact):
                    </div>
                    <div>
                      स्लॉट क्षमता: <strong>{selectedTimeSlot?.totalCapacityQ} Q</strong> | वर्तमान शेष: <strong>{selectedTimeSlot?.remainingCapacityQ} Q</strong> ➔ आपकी बुकिंग ({quantity} Q) के बाद शेष रहेगी: <strong>{Math.max(0, (selectedTimeSlot?.remainingCapacityQ || 0) - quantity)} Q</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ArrowLeft size={16} /> <span>पिछला चरण</span>
                    </button>

                    <button 
                      onClick={handleFinalBooking} 
                      disabled={submitting}
                      style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
                    >
                      <Check size={18} strokeWidth={3} />
                      <span>{submitting ? 'बुकिंग एवं क्षमता आरक्षित हो रही है...' : 'स्लॉट बुकिंग की पुष्टि करें (Confirm Booking) →'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* ================= POST-CONFIRMATION TOKEN & REAL-TIME QUEUE MANAGEMENT (Section 5 & 6) ================= */
              <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '820px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                
                {/* Success Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <Check size={36} strokeWidth={3} />
                  </div>

                  <div style={{ display: 'inline-block', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 800, color: '#047857', marginBottom: '6px' }}>
                    ✓ BOOKING CONFIRMED • क्षमता सफलतापूर्वक आरक्षित
                  </div>

                  <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#064e3b', margin: '4px 0' }}>
                    स्लॉट सफलतापूर्वक बुक हो गया!
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: 0 }}>
                    गेट पर सत्यापन एवं कतार प्रबंधन के लिए यह डिजिटल टोकन मान्य है।
                  </p>
                </div>

                {/* Official Ticket Card */}
                <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  
                  {/* Top Bar: Token & Booking ID */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>टोकन संख्या (Token Number)</span>
                      <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#017953', lineHeight: 1 }}>
                        {bookingConfirmed.tokenNumber}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>बुकिंग आईडी (Booking ID)</span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                        {bookingConfirmed.bookingId}
                      </div>
                      <span style={{ display: 'inline-block', background: bookingConfirmed.bookingStatus === 'CANCELLED' ? '#fee2e2' : '#dcfce7', color: bookingConfirmed.bookingStatus === 'CANCELLED' ? '#dc2626' : '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '2px 10px', borderRadius: '10px', marginTop: '4px' }}>
                        ● {bookingConfirmed.bookingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Booking Fields Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.86rem', marginBottom: '16px' }}>
                    <div><span style={{ color: '#64748b' }}>किसान का नाम:</span> <strong>{bookingConfirmed.farmerName}</strong></div>
                    <div><span style={{ color: '#64748b' }}>फसल:</span> <strong>{bookingConfirmed.cropName}</strong></div>
                    <div><span style={{ color: '#64748b' }}>अनुमानित मात्रा:</span> <strong>{bookingConfirmed.quantity} क्विंटल (Quintals)</strong></div>
                    <div><span style={{ color: '#64748b' }}>खरीद केंद्र:</span> <strong>{bookingConfirmed.centerName}</strong></div>
                    <div><span style={{ color: '#64748b' }}>तारीख (Date):</span> <strong>{bookingConfirmed.slotDateDisplay}</strong></div>
                    <div><span style={{ color: '#64748b' }}>समय स्लॉट:</span> <strong>{bookingConfirmed.timeSlotLabel}</strong></div>
                    <div style={{ gridColumn: 'span 2', background: '#ecfdf5', padding: '10px 14px', borderRadius: '10px', border: '1px solid #a7f3d0', color: '#065f46' }}>
                      <strong>अनुमानित खरीद मूल्य:</strong> ₹{bookingConfirmed.estimatedAmount?.toLocaleString('en-IN')} (@ ₹{bookingConfirmed.mspRate}/Qtl)
                    </div>
                  </div>

                  {/* ================= REAL-TIME QUEUE MANAGEMENT (Section 6) ================= */}
                  <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="#017953" />
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                          रियल-टाइम कतार स्थिति (Real-Time Queue Status)
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#017953', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                        ● LIVE UPDATE
                      </span>
                    </div>

                    {/* Queue Monitor Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px', textAlign: 'center' }}>
                      <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>वर्तमान टोकन</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#017953' }}>{bookingConfirmed.tokenNumber}</div>
                      </div>
                      <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontSize: '0.7rem', color: '#1e40af' }}>अब सेवा में (Serving)</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2563eb' }}>{bookingConfirmed.currentServingToken}</div>
                      </div>
                      <div style={{ background: '#fefce8', padding: '10px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                        <span style={{ fontSize: '0.7rem', color: '#854d0e' }}>आपसे आगे (Ahead)</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#b45309' }}>{bookingConfirmed.farmersAhead} किसान</div>
                      </div>
                      <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                        <span style={{ fontSize: '0.7rem', color: '#9d174d' }}>अनुमानित प्रतीक्षा</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#db2777' }}>~{bookingConfirmed.estimatedWaitMinutes} min</div>
                      </div>
                    </div>

                    {/* 8 Queue Stages Progress Indicator */}
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                      कतार चरण प्रगति (Queue Stages Progress):
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ color: '#017953', fontWeight: 800 }}>✓ Booking Confirmed</span>
                      <span>→</span>
                      <span style={{ color: '#017953', fontWeight: 800 }}>✓ Farmer Arrived</span>
                      <span>→</span>
                      <span style={{ color: '#017953', fontWeight: 800 }}>✓ Verification</span>
                      <span>→</span>
                      <span style={{ color: '#2563eb', fontWeight: 900, background: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>→ Quality Check</span>
                      <span>→</span>
                      <span style={{ color: '#64748b' }}>○ Weighing</span>
                      <span>→</span>
                      <span style={{ color: '#64748b' }}>○ Procurement</span>
                      <span>→</span>
                      <span style={{ color: '#64748b' }}>○ Payment</span>
                    </div>

                  </div>

                  {/* QR Code Container */}
                  <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'inline-block', background: '#ffffff', padding: '8px', borderRadius: '10px', border: '1.5px solid #017953' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(`KK-TOKEN-${bookingConfirmed.tokenNumber}-${bookingConfirmed.bookingId}`)}`}
                        alt="QR Code" 
                        style={{ width: '120px', height: '120px', display: 'block' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#017953', fontWeight: 800, marginTop: '4px' }}>
                      Mandi Gate Verification QR (गेट सत्यापन कोड)
                    </div>
                  </div>

                </div>

                {/* Cancelled Notice if farmer cancelled */}
                {cancelledSuccess && (
                  <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '12px', padding: '12px 18px', color: '#991b1b', fontSize: '0.88rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                    ✓ स्लॉट सफलतापूर्वक रद्द कर दिया गया है। आपकी {bookingConfirmed.quantity} क्विंटल क्षमता तत्काल खरीद केंद्र के स्लॉट में पुनः उपलब्ध करा दी गई है।
                  </div>
                )}

                {/* Action Buttons (Section 5) */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => navigate('/farmer/qr-pass')} 
                    style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '11px 20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(1, 121, 83, 0.2)' }}
                  >
                    <QrCode size={16} />
                    <span>क्यूआर पास देखें (View QR Pass)</span>
                  </button>

                  <button 
                    onClick={() => navigate('/farmer/queue')} 
                    style={{ background: '#ffffff', border: '1.5px solid #017953', color: '#017953', borderRadius: '10px', padding: '11px 20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Users size={16} />
                    <span>लाइव कतार देखें (View Live Queue) →</span>
                  </button>

                  <button 
                    onClick={() => window.print()} 
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '10px', padding: '11px 18px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={16} />
                    <span>टोकन प्रिंट करें (Print Token)</span>
                  </button>

                  {!cancelledSuccess && (
                    <button 
                      onClick={handleCancelBooking} 
                      style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', borderRadius: '10px', padding: '11px 18px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <XCircle size={16} />
                      <span>बुकिंग रद्द करें (Cancel Booking)</span>
                    </button>
                  )}

                  <button 
                    onClick={() => navigate('/farmer/dashboard')} 
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '10px', padding: '11px 18px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    डैशबोर्ड (Dashboard)
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ================= BOTTOM GLOBAL FOOTER ================= */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 8px 0 8px', 
          marginTop: '20px', 
          fontSize: '0.84rem', 
          color: '#475569', 
          borderTop: '1px solid rgba(0,0,0,0.06)' 
        }}>
          <div>
            <strong>किसान का सम्मान</strong> | हमारी प्राथमिकता • स्मार्ट खरीद एवं कतार प्रबंधन
          </div>
          <div>
            डिजिटल कृषि • समृद्ध किसान • विकसित भारत
          </div>
        </div>

      </div>
    </div>
  );
}
