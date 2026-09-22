import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
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
  Download,
  Printer
} from 'lucide-react';

// Extracted Authentic Visual Assets
import cropWheat from '../assets/crop_wheat.png';
import cropRice from '../assets/crop_rice.png';
import cropMaize from '../assets/crop_maize.png';
import cropMustard from '../assets/crop_mustard.png';
import cropGram from '../assets/crop_gram.png';
import cropIllWheat from '../assets/crop_ill_wheat.jpg';
import cropIllRice from '../assets/crop_ill_rice.jpg';
import cropIllMaize from '../assets/crop_ill_maize.jpg';
import cropIllMustard from '../assets/crop_ill_mustard.jpg';
import cropIllGram from '../assets/crop_ill_gram.jpg';
import apmcBuilding from '../assets/apmc_building.png';
import wheatBanner from '../assets/wheat_banner.png';
import docCard from '../assets/doc_card.png';

const HINDI_DAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
];

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatHindiDate = (dateStr) => {
  if (!dateStr) return 'उपलब्ध तिथि';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    const dayName = HINDI_DAYS[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const monthName = HINDI_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${dayName}, ${dateNum} ${monthName} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

// 5 Default Crops data
const DEFAULT_CROPS = [
  {
    id: 'wheat',
    code: 'WHT-2026',
    name: 'गेहूँ',
    subtext: 'Rabi 2026',
    mspText: 'MSP : ₹2,275/क्विंटल',
    mspValue: 2275,
    image: cropIllWheat,
    season: 'Rabi 2026'
  },
  {
    id: 'rice',
    code: 'RIC-2026',
    name: 'धान (चावल)',
    subtext: 'Kharif 2026',
    mspText: 'MSP : ₹2,300/क्विंटल',
    mspValue: 2300,
    image: cropIllRice,
    season: 'Kharif 2026'
  },
  {
    id: 'maize',
    code: 'MAI-2026',
    name: 'मक्का',
    subtext: 'Kharif 2026',
    mspText: 'MSP : ₹2,090/क्विंटल',
    mspValue: 2090,
    image: cropIllMaize,
    season: 'Kharif 2026'
  },
  {
    id: 'mustard',
    code: 'MUS-2026',
    name: 'सरसों',
    subtext: 'Rabi 2026',
    mspText: 'MSP : ₹5,650/क्विंटल',
    mspValue: 5650,
    image: cropIllMustard,
    season: 'Rabi 2026'
  },
  {
    id: 'gram',
    code: 'GRA-2026',
    name: 'चना',
    subtext: 'Rabi 2026',
    mspText: 'MSP : ₹5,440/क्विंटल',
    mspValue: 5440,
    image: cropIllGram,
    season: 'Rabi 2026'
  }
];

// Quality & Grade Standards (FAQ, Grade A Premium, Grade B)
const QUALITY_OPTIONS = [
  {
    id: 'faq',
    code: 'FAQ-01',
    badge: 'मानक खरीद ग्रेड (100% MSP गारंटी)',
    badgeBg: '#ecfdf5',
    badgeColor: '#017953',
    title: 'मानक FAQ ग्रेड (Fair Average Quality)',
    description: 'भारत सरकार के FCI/NAFED मानकों के अनुरूप परिपक्व, सूखे और साफ़ दाने।',
    moisture: 'नमी (Moisture) ≤ 12%',
    foreignMatter: 'अपद्रव्य ≤ 0.75%',
    damagedGrains: 'क्षतिग्रस्त दाने ≤ 2.0%',
    bonusText: 'पूर्ण MSP दर लागू',
    bonusRate: 0,
    icon: '🌾'
  },
  {
    id: 'grade_a',
    code: 'PREMIUM-A',
    badge: 'उत्कृष्ट गुणवत्ता (+₹50/क्विंटल बोनस)',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    title: 'प्रीमियम ग्रेड A (सुपर क्वालिटी)',
    description: 'उच्च चमक, मोटे एकसमान दाने, शून्य अपद्रव्य एवं जैविक/प्राकृतिक विधि से उत्पादित।',
    moisture: 'नमी (Moisture) ≤ 10%',
    foreignMatter: 'अपद्रव्य: शून्य (0%)',
    damagedGrains: 'क्षतिग्रस्त दाने: 0%',
    bonusText: '+₹50/क्विंटल सरकारी प्रोत्साहन बोनस',
    bonusRate: 50,
    icon: '⭐'
  },
  {
    id: 'grade_b',
    code: 'GRADE-B',
    badge: 'साधारण गुणवत्ता (मानक)',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    title: 'ग्रेड B (सामान्य वाणिज्यिक गुणवत्ता)',
    description: 'औसत दाने, आंशिक नमी व छिलका उपस्थित। खरीद केंद्र पर प्रारंभिक ग्रेडिंग के बाद स्वीकृति।',
    moisture: 'नमी (Moisture) 12% – 14%',
    foreignMatter: 'अपद्रव्य ≤ 1.5%',
    damagedGrains: 'क्षतिग्रस्त दाने ≤ 4.0%',
    bonusText: 'मानक खरीद दर',
    bonusRate: 0,
    icon: '🌱'
  }
];

const DEFAULT_CENTRES = [
  { 
    centerId: 1, 
    centerCode: 'PC-UP-04', 
    centerName: 'चुनार उपार्जन केंद्र (समिति)', 
    centerLocation: 'मीरजापुर, उत्तर प्रदेश (Mirzapur, Uttar Pradesh)', 
    capacityPerDay: 600, 
    processingMinutesPerQuintal: 10 
  },
  { 
    centerId: 2, 
    centerCode: 'PC-UP-05', 
    centerName: 'मीरजापुर मुख्य उपार्जन केंद्र', 
    centerLocation: 'शास्त्री ब्रिज के पास, मीरजापुर', 
    capacityPerDay: 500, 
    processingMinutesPerQuintal: 12 
  },
  { 
    centerId: 3, 
    centerCode: 'PC-UP-06', 
    centerName: 'अहरौरा उपार्जन केंद्र', 
    centerLocation: 'उपार्जन केंद्र परिसर, अहरौरा, मीरजापुर', 
    capacityPerDay: 350, 
    processingMinutesPerQuintal: 10 
  },
  { 
    centerId: 4, 
    centerCode: 'PC-UP-07', 
    centerName: 'लालगंज उपार्जन केंद्र', 
    centerLocation: 'रीवा रोड, लालगंज, मीरजापुर', 
    capacityPerDay: 400, 
    processingMinutesPerQuintal: 11 
  }
];

// Robust helper to match selected UI crop key to backend produce entity
const findMatchingProduce = (cropKey, produces) => {
  if (!produces || produces.length === 0) return null;
  const key = (cropKey || '').toLowerCase();
  
  const synonymMap = {
    wheat: ['wheat', 'wht', 'गेहूं', 'गेहूँ'],
    rice: ['rice', 'paddy', 'ric', 'धान', 'चावल'],
    maize: ['maize', 'mai', 'मक्का'],
    mustard: ['mustard', 'mus', 'सरसों'],
    gram: ['gram', 'gra', 'चना', 'chana']
  };

  const targets = synonymMap[key] || [key];

  return produces.find(p => {
    const code = (p.produceCode || '').toLowerCase();
    const name = (p.produceName || '').toLowerCase();
    return targets.some(t => code.includes(t) || name.includes(t));
  }) || null;
};

export default function BookSlotFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t } = useLanguage();

  // Wizard Steps:
  // 1: फसल चुनें
  // 2: मात्रा चुनें
  // 3: गुणवत्ता चुनें
  // 4: केंद्र चुनें
  // 5: तारीख चुनें
  // 6: समय स्लॉट
  // 7: पुष्टि करें
  // 8: Digital QR Pass & Token
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dynamic Crop list initialized with safe defaults and updated from backend
  const [cropsList, setCropsList] = useState(DEFAULT_CROPS);
  const [selectedCropKey, setSelectedCropKey] = useState('wheat');

  const [centres, setCentres] = useState(DEFAULT_CENTRES);
  const [selectedCentre, setSelectedCentre] = useState(DEFAULT_CENTRES[0]);

  // Valid current date initialization
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateStr());
  const [miniCalMonth, setMiniCalMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState({
    slotId: 1,
    timeRangeLabel: '09:00 AM – 10:00 AM',
    availableSlots: 20,
    isAvailable: true
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Minimum quantity enforced at 5 quintals
  const [quantity, setQuantity] = useState(50);
  const [selectedQuality, setSelectedQuality] = useState('faq');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Backend state
  const [produceList, setProduceList] = useState([]);

  useEffect(() => {
    loadBackendData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setMiniCalMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  }, [selectedDate]);

  const loadBackendData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.get('/produce').catch(() => ({ data: [] })),
        api.get('/centers').catch(() => ({ data: [] }))
      ]);

      if (pRes.data && pRes.data.length > 0) {
        setProduceList(pRes.data);
        // Synchronize MSP rates from backend without breaking existing UI
        setCropsList(prev => prev.map(cropItem => {
          const match = findMatchingProduce(cropItem.id, pRes.data);
          if (match && match.mspRate) {
            const numRate = Number(match.mspRate);
            return {
              ...cropItem,
              produceId: match.produceId,
              mspValue: numRate,
              mspText: `MSP : ₹${numRate.toLocaleString('en-IN')}/क्विंटल`
            };
          }
          return cropItem;
        }));
      }

      if (cRes.data && cRes.data.length > 0) {
        const mappedCentres = cRes.data.map(c => ({
          centerId: c.centerId,
          centerCode: c.centerCode || `PC-${c.centerId}`,
          centerName: c.centerName,
          centerLocation: c.centerLocation || `${c.district || ''}, ${c.state || ''}`,
          capacityPerDay: c.capacityPerDay || 500,
          processingMinutesPerQuintal: c.processingMinutesPerQuintal || 10
        }));
        setCentres(mappedCentres);
        const prefilled = location.state?.prefilledCenter;
        let matched = null;
        if (prefilled) {
          matched = mappedCentres.find(c => 
            c.centerCode === prefilled || 
            c.centerName?.toLowerCase().includes(prefilled.toLowerCase()) || 
            String(c.centerId) === String(prefilled)
          );
        }
        if (!matched) {
          matched = mappedCentres[0];
        }
        if (matched) setSelectedCentre(matched);
      }
    } catch (err) {
      console.warn('Backend data loaded with default fallbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Availability strictly depends on backend availability and remaining capacity from PostgreSQL
  const fetchAvailableSlots = async (cId, dt, qty) => {
    const centerId = cId || selectedCentre?.centerId;
    if (!centerId) return;
    const date = dt || selectedDate || getTodayDateStr();
    const qtyVal = qty || quantity || 50;
    setLoadingSlots(true);
    try {
      const res = await api.get(`/centers/${centerId}/availability?date=${date}&quantity=${qtyVal}`);
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(s => {
          const max = s.maxBookings != null ? s.maxBookings : 20;
          const booked = s.currentBookings != null ? s.currentBookings : 0;
          const remaining = Math.max(0, max - booked);
          // Genuine backend availability check (takes IST expiry and capacity into account)
          const isAvail = s.isAvailable === true && remaining > 0;
          return {
            ...s,
            maxBookings: max,
            currentBookings: booked,
            availableSlots: remaining,
            isAvailable: isAvail
          };
        });
        setAvailableSlots(mapped);
        const first = mapped.find(s => s.isAvailable);
        if (first) {
          setSelectedTimeSlot({
            slotId: first.slotId,
            timeRangeLabel: first.timeRangeLabel,
            availableSlots: first.availableSlots,
            isAvailable: true
          });
        } else {
          setSelectedTimeSlot(null);
        }
      } else {
        setAvailableSlots([]);
        setSelectedTimeSlot(null);
      }
    } catch (err) {
      console.warn('Could not load dynamic slots from backend:', err);
      setAvailableSlots([]);
      setSelectedTimeSlot(null);
      const msg = err.response?.data?.message || 'स्लॉट लोड करने में त्रुटि हुई। कृपया अन्य तिथि चुनें।';
      setErrorMsg(msg);
    } finally {
      setLoadingSlots(false);
    }
  };

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

  // Generate dynamic 7 upcoming days starting from current day
  const generateUpcomingDays = () => {
    const days = [];
    const today = new Date();
    const dayNamesHindi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const val = `${y}-${m}-${dayNum}`;
      const dayOfWeek = d.getDay();
      const isSunday = dayOfWeek === 0;
      const dayLabel = i === 0 ? 'आज' : (i === 1 ? 'कल' : dayNamesHindi[dayOfWeek]);
      const monthLabel = HINDI_MONTHS[d.getMonth()];
      days.push({
        day: dayLabel,
        num: dayNum,
        month: monthLabel,
        val: val,
        slots: isSunday ? (lang === 'en' ? 'Closed' : 'अवकाश') : (lang === 'en' ? 'Open' : 'खुला है'),
        status: isSunday ? (lang === 'en' ? 'Closed' : 'अवकाश (बंद)') : (lang === 'en' ? 'Open' : 'उपलब्ध'),
        dotColor: isSunday ? '#ef4444' : '#017953',
        disabled: isSunday
      });
    }
    return days;
  };

  const upcomingDays = generateUpcomingDays();

  // If initial selectedDate is a Sunday, move to next available day
  useEffect(() => {
    const currentDayObj = upcomingDays.find(d => d.val === selectedDate);
    if (currentDayObj && currentDayObj.disabled) {
      const firstAvailable = upcomingDays.find(d => !d.disabled);
      if (firstAvailable) setSelectedDate(firstAvailable.val);
    }
  }, []);

  const currentCrop = cropsList.find(c => c.id === selectedCropKey) || cropsList[0];
  const currentQuality = QUALITY_OPTIONS.find(q => q.id === selectedQuality) || QUALITY_OPTIONS[0];
  const qualityBonus = currentQuality?.bonusRate || 0;
  const effectiveMsp = currentCrop.mspValue + qualityBonus;
  const estimatedAmount = (quantity * effectiveMsp).toLocaleString('en-IN');

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!currentCrop) {
        setErrorMsg('कृपया एक मान्य फसल का चयन करें।');
        return;
      }
      setStep(2); // मात्रा चुनें
      return;
    }
    if (step === 2) {
      if (!quantity || isNaN(quantity) || quantity < 5) {
        setErrorMsg('कृपया न्यूनतम 5 क्विंटल या अधिक मात्रा दर्ज करें।');
        return;
      }
      setStep(3); // गुणवत्ता चुनें
      return;
    }
    if (step === 3) {
      if (!selectedQuality) {
        setErrorMsg('कृपया फसल की गुणवत्ता (Grade) का चयन करें।');
        return;
      }
      setStep(4); // केंद्र चुनें
      return;
    }
    if (step === 4) {
      if (!selectedCentre || !selectedCentre.centerId) {
        setErrorMsg('कृपया एक मान्य खरीद केंद्र का चयन करें।');
        return;
      }
      setStep(5); // तारीख चुनें
      return;
    }
    if (step === 5) {
      if (!selectedDate) {
        setErrorMsg(lang === 'en' ? 'Please select your arrival date.' : 'कृपया उपार्जन केंद्र जाने की तारीख का चयन करें।');
        return;
      }
      fetchAvailableSlots(selectedCentre?.centerId, selectedDate, quantity);
      setStep(6); // समय स्लॉट
      return;
    }
    if (step === 6) {
      if (!selectedTimeSlot || !selectedTimeSlot.slotId || !selectedTimeSlot.isAvailable) {
        setErrorMsg('कृपया एक उपलब्ध समय स्लॉट का चयन करें।');
        return;
      }
      setStep(7); // पुष्टि करें
      return;
    }
    if (step === 7) {
      handleFinalBooking(); // Submit booking -> Step 8
      return;
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1 && step <= 7) {
      setStep(step - 1);
    } else {
      navigate('/farmer/dashboard');
    }
  };

  // Final booking submission with comprehensive validation and safe error handling
  const handleFinalBooking = async () => {
    if (submitting) return;
    setErrorMsg('');

    // Field validations
    if (!currentCrop || !currentCrop.id) {
      setErrorMsg('कृपया मान्य फसल का चयन करें।');
      return;
    }
    if (!quantity || isNaN(quantity) || quantity < 5) {
      setErrorMsg('कृपया न्यूनतम 5 क्विंटल या अधिक मात्रा दर्ज करें।');
      return;
    }
    if (!selectedQuality) {
      setErrorMsg('कृपया फसल गुणवत्ता का चयन करें।');
      return;
    }
    if (!selectedCentre || !selectedCentre.centerId) {
      setErrorMsg('कृपया खरीद केंद्र का चयन करें।');
      return;
    }
    if (!selectedDate) {
      setErrorMsg('कृपया तारीख का चयन करें।');
      return;
    }
    if (!selectedTimeSlot || !selectedTimeSlot.slotId) {
      setErrorMsg('कृपया समय स्लॉट का चयन करें।');
      return;
    }

    setSubmitting(true);

    try {
      // Fix 8: Robust Crop database matching - never silently pick produceList[0]!
      let dbCrop = findMatchingProduce(currentCrop.id, produceList);
      if (!dbCrop && produceList.length === 0) {
        try {
          const pRes = await api.get('/produce');
          if (pRes.data && pRes.data.length > 0) {
            setProduceList(pRes.data);
            dbCrop = findMatchingProduce(currentCrop.id, pRes.data);
          }
        } catch (e) {
          console.warn('Produce reload attempt failed:', e);
        }
      }

      if (!dbCrop) {
        setErrorMsg(`चयनित फसल (${currentCrop.name}) डेटाबेस में उपलब्ध नहीं है। कृपया दूसरी फसल चुनें अथवा व्यवस्थापक से संपर्क करें।`);
        setSubmitting(false);
        return;
      }

      // Validate slot availability again immediately before final booking
      try {
        const verifyRes = await api.get(`/centers/${selectedCentre.centerId}/availability?date=${selectedDate}&quantity=${quantity}`);
        if (verifyRes.data && verifyRes.data.length > 0) {
          const freshSlot = verifyRes.data.find(s => s.slotId === selectedTimeSlot.slotId);
          if (freshSlot) {
            const max = freshSlot.maxBookings != null ? freshSlot.maxBookings : 20;
            const booked = freshSlot.currentBookings != null ? freshSlot.currentBookings : 0;
            const rem = Math.max(0, max - booked);
            const isAvail = freshSlot.isAvailable !== false && rem > 0;
            if (!isAvail) {
              setErrorMsg(`क्षमा करें, चयनित समय स्लॉट (${selectedTimeSlot.timeRangeLabel}) अब भर चुका है। कृपया दूसरा समय स्लॉट चुनें।`);
              setSubmitting(false);
              setStep(6);
              fetchAvailableSlots(selectedCentre.centerId, selectedDate, quantity);
              return;
            }
          }
        }
      } catch (chkErr) {
        console.error('Pre-booking slot verification failed:', chkErr);
        setErrorMsg('स्लॉट उपलब्धता सत्यापन विफल रहा। कृपया पुनः प्रयास करें।');
        setSubmitting(false);
        return;
      }

      const payload = {
        centerId: selectedCentre.centerId,
        produceId: dbCrop.produceId,
        slotId: selectedTimeSlot.slotId,
        estimatedQuantity: quantity
      };

      const res = await api.post('/farmer/book-slot', payload);
      if (res.data) {
        setBookingConfirmed(res.data);
        setStep(8);
      } else {
        throw new Error('सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई।');
      }
    } catch (err) {
      console.error('Final booking error:', err);
      const serverMsg = err.response?.data?.message || err.message;
      const errorText = typeof serverMsg === 'string' && serverMsg.trim()
        ? `बुकिंग असफल: ${serverMsg}`
        : 'बुकिंग प्रक्रिया में त्रुटि हुई। कृपया जांचें कि स्लॉट उपलब्ध है या पुनः प्रयास करें।';
      setErrorMsg(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  // Stepper titles matching requested order 100%:
  // 1. फसल चुनें → 2. मात्रा चुनें → 3. गुणवत्ता चुनें → 4. उपार्जन केंद्र चुनें → 5. तारीख चुनें → 6. समय स्लॉट → 7. पुष्टि करें
  const getStepperTitle = (stepIndex) => {
    if (lang === 'en') {
      switch (stepIndex) {
        case 1: return { main: '1. Select Crop', sub: 'Choose crop to sell' };
        case 2: return { main: '2. Select Quantity', sub: 'Estimated produce (Qtl)' };
        case 3: return { main: '3. Select Quality', sub: 'Crop quality grade' };
        case 4: return { main: '4. Select Centre', sub: 'Nearest procurement centre' };
        case 5: return { main: '5. Select Date', sub: 'Arrival date' };
        case 6: return { main: '6. Time Slot', sub: 'Convenient time slot' };
        case 7: return { main: '7. Confirm Booking', sub: 'Review & get token' };
        default: return { main: '', sub: '' };
      }
    }
    switch (stepIndex) {
      case 1: return { main: '1. फसल चुनें', sub: 'अपनी फसल का चयन करें' };
      case 2: return { main: '2. मात्रा चुनें', sub: 'अनुमानित उपज दर्ज करें' };
      case 3: return { main: '3. गुणवत्ता चुनें', sub: 'फसल गुणवत्ता ग्रेड' };
      case 4: return { main: '4. उपार्जन केंद्र चुनें', sub: 'निकटतम उपार्जन केंद्र चुनें' };
      case 5: return { main: '5. तारीख चुनें', sub: 'उपार्जन केंद्र जाने की तारीख' };
      case 6: return { main: '6. समय स्लॉट', sub: 'सुविधाजनक समय चुनें' };
      case 7: return { main: '7. पुष्टि करें', sub: 'समीक्षा एवं टोकन प्राप्त करें' };
      default: return { main: '', sub: '' };
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.4) 60%, rgba(244, 251, 247, 0.65) 100%)', 
      minHeight: 'calc(100vh - 110px)', 
      padding: '20px 0 36px 0',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>

        {/* Global Page Header for Step 1 - Step 4 */}
        {step <= 4 && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b', margin: 0, fontFamily: "'Mukta', sans-serif" }}>
                  {lang === 'en' ? 'E-Procurement Slot Booking' : 'ई-उपार्जन स्लॉट आरक्षण'}
                </h1>
                <span style={{ background: '#017953', color: '#ffffff', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                  {lang === 'en' ? `Step ${step} / 7` : `चरण ${step} / 7`}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#4b5563', margin: 0 }}>
                {lang === 'en' ? 'Transparent procurement at Minimum Support Price (MSP) • Digital Slot Allocation' : 'न्यूनतम समर्थन मूल्य (MSP) पर पारदर्शी खरीद • डिजिटल स्लॉट आरक्षण'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#017953' }}></span>
                <span>{lang === 'en' ? 'Session: 2026-27' : 'सत्र: 2026-27'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 Banner (Calendar Header) */}
        {step === 5 && (
          <div style={{ 
            background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)', 
            border: '1.5px solid #a7f3d0', 
            borderRadius: '16px', 
            padding: '12px 20px', 
            marginBottom: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} color="#017953" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                  {lang === 'en' ? 'Select Your Convenient Arrival Date' : 'अपनी सुविधा के अनुसार उपार्जन केंद्र जाने की तारीख चुनें'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: '2px 0 0 0' }}>
                  {lang === 'en' ? 'Choose date based on slot availability and proceed to select time slot.' : 'उपलब्ध स्लॉट के आधार पर अपनी पसंदीदा तारीख चुनें और अगले चरण में समय का चयन करें।'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#064e3b', fontFamily: "'Mukta', sans-serif" }}>
                {lang === 'en' ? '“Right Time, Better Value, Prosperous Farmer”' : '“सही समय, बेहतर मूल्य, समृद्ध किसान”'}
              </span>
              <span style={{ fontSize: '1.1rem' }}>🌱</span>
            </div>
          </div>
        )}

        {/* User-friendly Hindi Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '14px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#991b1b',
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
          }}>
            <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{errorMsg}</span>
            <button 
              onClick={() => setErrorMsg('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#991b1b',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0 4px'
              }}
              title="बंद करें"
            >
              ✕
            </button>
          </div>
        )}

        {/* ================= STEPPER CONTAINER (7 Steps Order: फसल → मात्रा → गुणवत्ता → उपार्जन केंद्र → तारीख → समय → पुष्टि) ================= */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          padding: '12px 18px', 
          marginBottom: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ position: 'relative' }}>
            {/* Horizontal Line connecting steps */}
            <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '2.5px', background: '#e2e8f0', zIndex: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((st) => {
                const info = getStepperTitle(st);
                const isCompleted = step > st;
                const isActive = step === st;
                // Fix 4: Prevent skipping ahead. Only completed steps are clickable.
                const isClickable = st < step && step <= 7;
                return (
                  <div 
                    key={st} 
                    onClick={() => {
                      if (isClickable) {
                        setErrorMsg('');
                        setStep(st);
                      }
                    }}
                    style={{ 
                      textAlign: 'center', 
                      cursor: isClickable ? 'pointer' : (isActive ? 'default' : 'not-allowed'), 
                      flex: 1,
                      opacity: (!isCompleted && !isActive) ? 0.65 : 1
                    }}
                  >
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      background: isCompleted || isActive ? '#017953' : '#ffffff', 
                      border: isCompleted || isActive ? 'none' : '1.5px solid #cbd5e1', 
                      color: isCompleted || isActive ? '#ffffff' : '#64748b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800, 
                      fontSize: '0.88rem', 
                      margin: '0 auto 4px auto',
                      boxShadow: isActive ? '0 0 0 3px #bbf7d0' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {isCompleted ? <Check size={15} strokeWidth={3} /> : st}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#017953' : (isCompleted ? '#064e3b' : '#64748b') }}>
                      {info.main}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#9ca3af', marginTop: '1px' }}>
                      {info.sub}
                    </div>
                    {isActive && (
                      <div style={{ width: '36px', height: '2.5px', background: '#017953', margin: '3px auto 0 auto', borderRadius: '2px' }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= STEP 1: CROP SELECTION ================= */}
        {step === 1 && (
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px 28px 24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button onClick={() => navigate('/farmer/dashboard')} style={{ background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <ArrowLeft size={15} /> <span>{lang === 'en' ? 'Back to Dashboard' : 'वापस जाएं'}</span>
              </button>
              <button onClick={() => speakText("कृपया फसल का चयन करें। गेहूं, धान, मक्का, सरसों, या चना।")} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Volume2 size={15} color="#d97706" /> <span>{lang === 'en' ? 'Listen (Audio)' : 'सुनें (आवाज़)'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>🌱</div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {lang === 'en' ? 'Select Crop' : 'फसल चुनें'}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: '3px 0 0 0' }}>
                  {lang === 'en' ? 'Choose the crop you wish to sell at the procurement centre' : 'वह फसल चुनें जिसे आप उपार्जन केंद्र पर बेचना चाहते हैं'}
                </p>
              </div>
            </div>

            {/* Top Row: 3 Crop Cards (Wheat, Rice, Maize) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', marginBottom: '22px' }}>
              {cropsList.slice(0, 3).map((crop) => {
                const isSelected = selectedCropKey === crop.id;
                return (
                  <div 
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropKey(crop.id);
                      speakText(`${crop.name}, ${crop.mspText}`);
                    }}
                    style={{ 
                      border: isSelected ? '2px solid #017953' : '1.5px solid #e2e8f0', 
                      background: '#ffffff', 
                      borderRadius: '22px', 
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? '0 8px 24px rgba(1, 121, 83, 0.16)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
                      transform: isSelected ? 'scale(1.01)' : 'none'
                    }}
                  >
                    {/* Top-Right Selection Indicator */}
                    <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2 }}>
                      {isSelected ? (
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: '#017953', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(1, 121, 83, 0.35)'
                        }}>
                          <Check size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '50%', 
                          border: '2px solid #cbd5e1', 
                          background: 'rgba(255, 255, 255, 0.9)' 
                        }}></div>
                      )}
                    </div>

                    {/* Top Crop Illustration */}
                    <div style={{ width: '100%', height: '175px', overflow: 'hidden', background: '#f8fafc' }}>
                      <img 
                        src={crop.image} 
                        alt={crop.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      />
                    </div>

                    {/* Crop Details */}
                    <div style={{ padding: '16px 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '1.42rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '2px' }}>
                        {crop.name}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#64748b', marginBottom: '14px' }}>
                        {crop.subtext}
                      </div>
                      <div style={{ 
                        background: '#ecfdf5', 
                        border: '1px solid #d1fae5',
                        borderRadius: '10px', 
                        padding: '9px 12px', 
                        fontSize: '1.02rem', 
                        fontWeight: 800, 
                        color: '#017953', 
                        textAlign: 'center',
                        letterSpacing: '0.2px'
                      }}>
                        {crop.mspText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: 2 Crop Cards (Mustard, Gram) Centered */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '22px', marginBottom: '32px' }}>
              {cropsList.slice(3, 5).map((crop) => {
                const isSelected = selectedCropKey === crop.id;
                return (
                  <div 
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropKey(crop.id);
                      speakText(`${crop.name}, ${crop.mspText}`);
                    }}
                    style={{ 
                      width: 'calc((100% - 44px) / 3)',
                      border: isSelected ? '2px solid #017953' : '1.5px solid #e2e8f0', 
                      background: '#ffffff', 
                      borderRadius: '22px', 
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? '0 8px 24px rgba(1, 121, 83, 0.16)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
                      transform: isSelected ? 'scale(1.01)' : 'none'
                    }}
                  >
                    {/* Top-Right Selection Indicator */}
                    <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2 }}>
                      {isSelected ? (
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: '#017953', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(1, 121, 83, 0.35)'
                        }}>
                          <Check size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '50%', 
                          border: '2px solid #cbd5e1', 
                          background: 'rgba(255, 255, 255, 0.9)' 
                        }}></div>
                      )}
                    </div>

                    <div style={{ width: '100%', height: '175px', overflow: 'hidden', background: '#f8fafc' }}>
                      <img 
                        src={crop.image} 
                        alt={crop.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      />
                    </div>

                    <div style={{ padding: '16px 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '1.42rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '2px' }}>
                        {crop.name}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#64748b', marginBottom: '14px' }}>
                        {crop.subtext}
                      </div>
                      <div style={{ 
                        background: '#ecfdf5', 
                        border: '1px solid #d1fae5',
                        borderRadius: '10px', 
                        padding: '9px 12px', 
                        fontSize: '1.02rem', 
                        fontWeight: 800, 
                        color: '#017953', 
                        textAlign: 'center',
                        letterSpacing: '0.2px'
                      }}>
                        {crop.mspText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Bar: Selection Summary + Next Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748b' }}>चयनित फसल:</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#017953' }}>
                  {currentCrop.name} ({currentCrop.mspText})
                </span>
              </div>

              <button 
                onClick={handleNext} 
                style={{ 
                  background: '#017953', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '12px 34px', 
                  fontSize: '1.02rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' 
                }}
              >
                <span>आगे बढ़ें (मात्रा चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: QUANTITY INPUT ================= */}
        {step === 2 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            {/* Top Bar: Back Button + Voice Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण (फसल चुनें)</span>
              </button>
              <button onClick={() => speakText(`अपनी अनुमानित फसल उपज क्विंटल में दर्ज करें। वर्तमान में ${quantity} क्विंटल चयनित है।`)} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px 18px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Volume2 size={16} color="#d97706" /> <span>सुनें (आवाज)</span>
              </button>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700 }}>2. {lang === 'en' ? 'Select Quantity' : 'मात्रा चुनें'}</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '2px 0 0 0' }}>{lang === 'en' ? 'Enter Estimated Produce Quantity' : 'अपनी फसल की अनुमानित मात्रा दर्ज करें'}</h3>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: '2px 0 0 0' }}>
                  {lang === 'en' ? 'Enter quantity between 5 to 150 quintals for weighment at the procurement centre.' : 'उपार्जन केंद्र पर तौल के लिए न्यूनतम 5 क्विंटल एवं अधिकतम 150 क्विंटल तक की मात्रा दर्ज करें।'}
                </p>
              </div>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '8px 16px', fontSize: '0.82rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <span>सही मात्रा दर्ज करने से भुगतान और टोकन प्रक्रिया तेज और सरल होती है।</span>
              </div>
            </div>

            {/* Middle Section: Wheat Banner on left, Stepper & Slider in center, Crop details on right */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 280px', gap: '24px', alignItems: 'center', marginBottom: '28px', background: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '18px', padding: '24px' }}>
              
              {/* Left Wheat Banner */}
              <div style={{ textAlign: 'center' }}>
                <img src={wheatBanner} alt="Mehnat Aapki" style={{ width: '90px', height: 'auto', display: 'block', margin: '0 auto' }} />
              </div>

              {/* Center Stepper & Slider */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
                  अनुमानित फसल उपज (Quintals) <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#9ca3af' }} />
                </label>

                {/* Fix 2: Consistent Quantity Buttons with minimum 5 quintals */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', maxWidth: '360px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(5, quantity - 5))}
                    style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                    title="5 क्विंटल घटाएं"
                  >
                    -
                  </button>
                  <div style={{ flex: 1, textAlign: 'center', background: '#ffffff', padding: '8px', borderRadius: '10px', border: '1.5px solid #017953' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>{quantity}</span>
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(150, quantity + 5))}
                    style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                    title="5 क्विंटल बढ़ाएं"
                  >
                    +
                  </button>
                </div>

                {/* Range Slider min 5 to max 150 */}
                <div style={{ maxWidth: '380px' }}>
                  <input 
                    type="range" 
                    min="5" 
                    max="150" 
                    value={quantity} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(Math.max(5, Math.min(150, val)));
                    }}
                    style={{ width: '100%', accentColor: '#017953', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                    <span>5</span><span>25</span><span>50</span><span>75</span><span>100</span><span>150</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Selected Crop Pill + Presets */}
              <div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>चयनित फसल</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🌱</span> <span>{currentCrop.name} ({currentCrop.season})</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '4px 10px', fontSize: '0.76rem', fontWeight: 700, color: '#017953', cursor: 'pointer' }}>
                    बदलें
                  </button>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[20, 35, 50, 75, 100, 150].map((q) => {
                    const isSel = quantity === q;
                    return (
                      <button 
                        key={q}
                        onClick={() => setQuantity(q)}
                        style={{ 
                          padding: '6px 0', 
                          borderRadius: '8px', 
                          border: isSel ? '2px solid #017953' : '1px solid #cbd5e1', 
                          background: isSel ? '#017953' : '#ffffff', 
                          color: isSel ? '#ffffff' : '#374151', 
                          fontWeight: 700, 
                          fontSize: '0.84rem', 
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

            {/* Fix 3: Consistent Estimated Amount Calculation including Quality Bonus */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={22} color="#017953" />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>अनुमानित मूल्य</span>
                  <div style={{ fontSize: '0.86rem', color: '#374151', fontWeight: 700 }}>
                    MSP ₹{effectiveMsp.toLocaleString('en-IN')}/क्विंटल {qualityBonus > 0 ? `(₹${qualityBonus} बोनस सहित)` : `के आधार पर`}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#017953' }}>
                  ₹{estimatedAmount}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  ({quantity} क्विंटल × ₹{effectiveMsp.toLocaleString('en-IN')}{qualityBonus > 0 ? ` [MSP ₹${currentCrop.mspValue.toLocaleString('en-IN')} + ₹${qualityBonus} बोनस]` : ''})
                </div>
              </div>

              <div style={{ maxWidth: '340px', fontSize: '0.76rem', color: '#4b5563', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#017953' }} />
                यह केवल अनुमानित राशि है। वास्तविक मात्रा व गुणवत्ता के आधार पर भुगतान भिन्न हो सकता है।
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> <span>पिछला चरण (फसल)</span>
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

        {/* ================= STEP 3: QUALITY / GRADE SELECTION ================= */}
        {step === 3 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            {/* Header: Back Button + Voice Listen Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण (मात्रा)</span>
              </button>
              <button onClick={() => speakText("अपनी फसल की गुणवत्ता अथवा ग्रेड का चयन करें। मानक एफएक्यू ग्रेड, प्रीमियम ग्रेड ए अथवा ग्रेड बी।")} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px 18px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Volume2 size={16} color="#d97706" /> <span>सुनें (आवाज)</span>
              </button>
            </div>

            {/* Section Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                ⭐
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700 }}>3. गुणवत्ता चुनें</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '2px 0 0 0' }}>
                  फसल गुणवत्ता एवं ग्रेड (Quality & Grade) का चयन करें
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: '2px 0 0 0' }}>
                  सरकारी खरीद मानकों (FAQ - Fair Average Quality) के आधार पर अपनी फसल का ग्रेड चुनें।
                </p>
              </div>
            </div>

            {/* Quality Cards Grid: 3 Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
              {QUALITY_OPTIONS.map((q) => {
                const isSelected = selectedQuality === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuality(q.id);
                      speakText(`${q.title}, ${q.bonusText}`);
                    }}
                    style={{
                      border: isSelected ? '2px solid #017953' : '1.5px solid #e2e8f0',
                      background: isSelected ? '#fbfdfc' : '#ffffff',
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 6px 20px rgba(1, 121, 83, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ background: q.badgeBg, color: q.badgeColor, padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                          {q.badge}
                        </span>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? '#017953' : '#ffffff',
                          border: isSelected ? 'none' : '2px solid #cbd5e1',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isSelected ? <Check size={16} strokeWidth={3} /> : null}
                        </div>
                      </div>

                      <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{q.icon}</div>
                      <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                        {q.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                        {q.description}
                      </p>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px', fontSize: '0.78rem', color: '#334155', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span>💧</span> <span><strong>नमी (Moisture):</strong> {q.moisture}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span>🌾</span> <span><strong>अपद्रव्य:</strong> {q.foreignMatter}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🔍</span> <span><strong>क्षतिग्रस्त:</strong> {q.damagedGrains}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: isSelected ? '#ecfdf5' : '#f1f5f9',
                      color: isSelected ? '#017953' : '#475569',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '0.92rem'
                    }}>
                      दर: ₹{(currentCrop.mspValue + q.bonusRate).toLocaleString('en-IN')}/क्विंटल
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quality Standard Info Pill + Next Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', border: '1.5px solid #a7f3d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="#017953" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#017953' }}>सरकारी डिजिटल गुणवत्ता जांच (NAFED / FCI Standard)</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '1px' }}>खरीद केंद्र पर डिजिटल नमी मीटर एवं ग्रेडिंग किट द्वारा पारदर्शी जांच होगी।</div>
                </div>
              </div>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (केंद्र चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PROCUREMENT CENTRE SELECTION ================= */}
        {step === 4 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 36px 30px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण (गुणवत्ता)</span>
              </button>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>4. खरीद केंद्र का चयन करें</h3>
              <div style={{ width: '80px' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {centres.map((c) => {
                const isSel = selectedCentre?.centerId === c.centerId;
                return (
                  <div 
                    key={c.centerId}
                    onClick={() => setSelectedCentre(c)}
                    style={{ 
                      border: isSel ? '2px solid #017953' : '1px solid #e2e8f0', 
                      background: isSel ? '#f0fdf4' : '#ffffff', 
                      borderRadius: '14px', 
                      padding: '18px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSel ? '0 4px 14px rgba(1, 121, 83, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ background: '#ecfdf5', color: '#017953', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {c.centerCode}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '6px 0 2px 0' }}>{c.centerName}</h4>
                        <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {c.centerLocation}
                        </p>
                      </div>
                      {isSel && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={15} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handleNext} style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span>आगे बढ़ें (तारीख चुनें)</span> <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: DATE SELECTION ================= */}
        {step === 5 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 32px 28px 32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            {/* Header: Calendar Icon + Title + Month Navigator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} color="#017953" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>तारीख चुनें</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '2px 0 0 0' }}>उपलब्ध स्लॉट वाले दिन को चुनें</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                  <Calendar size={15} color="#017953" />
                  <span>{HINDI_MONTHS[new Date(selectedDate || Date.now()).getMonth()]} {new Date(selectedDate || Date.now()).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Fix 6: Dynamic Upcoming 7 Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {upcomingDays.map((d) => {
                const isSel = selectedDate === d.val;
                return (
                  <div 
                    key={d.val}
                    onClick={() => {
                      if (!d.disabled) {
                        setErrorMsg('');
                        setSelectedDate(d.val);
                      }
                    }}
                    style={{ 
                      border: isSel ? '2px solid #017953' : '1px solid #e2e8f0', 
                      background: isSel ? '#f0fdf4' : (d.disabled ? '#f9fafb' : '#ffffff'), 
                      borderRadius: '14px', 
                      padding: '16px 10px', 
                      textAlign: 'center', 
                      cursor: d.disabled ? 'not-allowed' : 'pointer',
                      opacity: d.disabled ? 0.6 : 1,
                      position: 'relative',
                      boxShadow: isSel ? '0 4px 12px rgba(1, 121, 83, 0.14)' : 'none',
                      transition: 'all 0.15s ease'
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
                        <span>{d.slots}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: d.disabled ? '#dc2626' : (d.status.includes('सीमित') ? '#d97706' : '#017953'), marginTop: '2px' }}>
                        {d.status === 'उपलब्ध नहीं' ? '✕ उपलब्ध नहीं' : (d.status === 'उपलब्ध' ? '✓ उपलब्ध' : d.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} /> <span>पिछला चरण (केंद्र)</span>
              </button>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 18px', fontSize: '0.84rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <span><strong>सलाह:</strong> भीड़ से बचने के लिए सुबह के समय स्लॉट चुनें। इससे आपका समय भी बचेगा और जल्दी टोकन मिल जाएगा।</span>
              </div>

              <button 
                onClick={handleNext} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 32px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
              >
                <span>आगे बढ़ें (Next)</span> <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 6: TIME SLOT SELECTION ================= */}
        {step === 6 && (() => {
          // Dynamic Mini Calendar Calculations
          const calYear = miniCalMonth.getFullYear();
          const calMonth = miniCalMonth.getMonth();
          const monthHindiTitle = `${HINDI_MONTHS[calMonth]} ${calYear}`;
          
          const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
          const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
          const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

          const prevMonthPads = [];
          for (let i = firstDayIndex - 1; i >= 0; i--) {
            prevMonthPads.push(prevMonthDays - i);
          }

          const currentMonthDays = [];
          for (let d = 1; d <= daysInCurrentMonth; d++) {
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            currentMonthDays.push({ day: d, dateStr });
          }

          const totalCells = (prevMonthPads.length + currentMonthDays.length) > 35 ? 42 : 35;
          const nextMonthPadsCount = totalCells - (prevMonthPads.length + currentMonthDays.length);
          const nextMonthPads = [];
          for (let d = 1; d <= nextMonthPadsCount; d++) {
            nextMonthPads.push(d);
          }

          const displayedSlots = availableSlots;

          const todayStr = getTodayDateStr();

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Left Sidebar Feature Card */}
              <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '8px' }}>
                  🌱
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '18px', lineHeight: 1.3 }}>
                  “किसान की सुविधा, हमारी प्राथमिकता”
                </h4>

                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#374151', padding: '0 6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>भीड़ से बचें और समय बचाएं</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>पारदर्शी डिजिटल तौल प्रक्रिया</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>सीधे बैंक खाते में त्वरित भुगतान</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>डिजिटल QR पास से त्वरित प्रवेश</span>
                  </div>
                </div>

                {/* APMC Building illustration */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <img src={apmcBuilding} alt="APMC Mandi" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#017953', marginTop: '8px' }}>
                    समृद्ध किसान <br /> समृद्ध भारत
                  </div>
                </div>
              </div>

              {/* Right Main Time-Slots Card */}
              <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 30px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                
                {/* Back Button */}
                <div style={{ marginBottom: '14px' }}>
                  <button onClick={handleBack} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '5px 14px', fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowLeft size={14} /> <span>पिछला चरण (तारीख चुनें)</span>
                  </button>
                </div>

                {/* Header with Clock + Center Name + Dynamic Selected Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#017953', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(1, 121, 83, 0.25)' }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.28rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                          6. समय स्लॉट का चयन करें
                        </h3>
                        <span style={{ background: '#ecfdf5', color: '#017953', border: '1px solid #a7f3d0', fontSize: '0.74rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                          चरण 6 / 7
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '3px 0 0 0' }}>
                        {lang === 'en' ? 'Select your convenient arrival time slot' : 'अपनी सुविधा के अनुसार उपार्जन केंद्र जाने का समय चुनें'}
                      </p>
                      <div style={{ fontSize: '0.82rem', color: '#017953', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} />
                        <span>{lang === 'en' ? 'Selected Centre: ' : 'चयनित उपार्जन केंद्र: '}{selectedCentre?.centerName || (lang === 'en' ? 'Chunar Procurement Centre' : 'चुनार उपार्जन केंद्र (समिति)')}{selectedCentre?.centerLocation ? `, ${selectedCentre.centerLocation}` : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', color: '#374151' }}>
                      <span style={{ color: '#64748b' }}>चयनित तिथि:</span>{' '}
                      <strong style={{ color: '#0f172a' }}>{formatHindiDate(selectedDate)}</strong>
                    </div>
                    <button 
                      onClick={() => setStep(5)} 
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, color: '#374151', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      title="तारीख बदलने के लिए चरण 5 पर जाएं"
                    >
                      <Calendar size={13} />
                      <span>तिथि बदलें</span>
                    </button>
                  </div>
                </div>

                {/* Split Body: Dynamic Mini Calendar on left, Available Slots on right */}
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start', marginBottom: '24px' }}>
                  
                  {/* Left Dynamic Interactive Mini Calendar with Past Date Protection */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 12px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setMiniCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                        title="पिछला महीना"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span>{monthHindiTitle}</span>
                      <button 
                        type="button" 
                        onClick={() => setMiniCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                        title="अगला महीना"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Day Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>
                      <span>रवि</span><span>सोम</span><span>मंगल</span><span>बुध</span><span>गुरु</span><span>शुक्र</span><span>शनि</span>
                    </div>

                    {/* Day Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                      {prevMonthPads.map((dayNum, i) => (
                        <span key={`prev-${i}`} style={{ color: '#cbd5e1', padding: '4px 0' }}>
                          {dayNum}
                        </span>
                      ))}

                      {currentMonthDays.map(({ day, dateStr }) => {
                        const isDaySelected = selectedDate === dateStr;
                        const isPast = dateStr < todayStr;
                        const isSunday = new Date(dateStr + 'T00:00:00').getDay() === 0;
                        const isDisabled = isPast || isSunday;

                        return (
                          <div
                            key={dateStr}
                            onClick={() => {
                              if (!isDisabled) {
                                setErrorMsg('');
                                setSelectedDate(dateStr);
                                fetchAvailableSlots(selectedCentre?.centerId, dateStr, quantity);
                              }
                            }}
                            title={isDisabled ? (isSunday ? (lang === 'en' ? 'Centre is closed on Sundays' : 'रविवार को उपार्जन केंद्र बंद रहता है') : (lang === 'en' ? 'Past date cannot be selected' : 'पुरानी तारीख का चयन संभव नहीं है')) : (lang === 'en' ? `Select date: ${dateStr}` : `तारीख चुनें: ${formatHindiDate(dateStr)}`)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px 0',
                              cursor: isDisabled ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <span style={{ 
                              width: '26px', 
                              height: '26px', 
                              borderRadius: '50%', 
                              background: isDaySelected ? '#017953' : 'transparent', 
                              color: isDaySelected ? '#ffffff' : (isDisabled ? '#cbd5e1' : '#1e293b'), 
                              fontWeight: isDaySelected ? 800 : 500, 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              margin: '0 auto',
                              boxShadow: isDaySelected ? '0 2px 6px rgba(1, 121, 83, 0.35)' : 'none',
                              transition: 'all 0.15s ease'
                            }}>
                              {day}
                            </span>
                          </div>
                        );
                      })}

                      {nextMonthPads.map((dayNum, i) => (
                        <span key={`next-${i}`} style={{ color: '#cbd5e1', padding: '4px 0' }}>
                          {dayNum}
                        </span>
                      ))}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#4b5563', marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#017953' }}></span> उपलब्ध
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }}></span> सीमित
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span> पूर्ण / बंद
                      </span>
                    </div>
                  </div>

                  {/* Right Available Slots Grid */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⏰</span> <span>उपलब्ध समय स्लॉट</span>
                        </h4>
                        <span style={{ fontSize: '0.76rem', color: '#6b7280' }}>प्रत्येक स्लॉट की अवधि 1 घंटा है</span>
                      </div>
                      {loadingSlots && (
                        <span style={{ fontSize: '0.75rem', color: '#017953', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#017953', animation: 'pulse 1s infinite' }}></span>
                          स्लॉट लोड हो रहे हैं...
                        </span>
                      )}
                    </div>

                    {/* Sun Suggestion Card */}
                    <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '10px 14px', fontSize: '0.8rem', color: '#854d0e', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>☀️</span>
                      <div>
                        <strong>सुझाव:</strong> दोपहर 12 बजे तक के स्लॉट में आमतौर पर कम भीड़ होती है और आपकी प्रक्रिया तेजी से पूरी हो सकती है।
                      </div>
                    </div>

                    {displayedSlots.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #cbd5e1', marginTop: '10px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                          <Clock size={22} />
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
                          इस तिथि पर कोई सक्रिय स्लॉट उपलब्ध नहीं है
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                          कृपया ऊपर कैलेंडर से अन्य तिथि का चयन करें अथवा अन्य निकटतम खरीद केंद्र चुनें।
                        </p>
                      </div>
                    ) : (
                      /* Time Slot Cards (2 columns) */
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {displayedSlots.map((s) => {
                          const isSel = selectedTimeSlot?.slotId === s.slotId;
                          const max = s.maxBookings != null ? s.maxBookings : 20;
                          const booked = s.currentBookings != null ? s.currentBookings : 0;
                          const remainingCount = s.availableSlots != null ? s.availableSlots : Math.max(0, max - booked);
                          const isAvailable = s.isAvailable === true && remainingCount > 0;
                          const isExpired = s.isAvailable === false && remainingCount > 0;
                          const isFull = remainingCount <= 0;

                          // Color and background mapping based on authentic backend availability
                          let cardBg = '#ffffff';
                          let cardBorder = '1px solid #e2e8f0';
                          let dotColor = '#017953';
                          let statusTextColor = '#166534';
                          let statusText = `✓ ${remainingCount} स्लॉट उपलब्ध`;

                          if (isSel) {
                            cardBg = '#ecfdf5';
                            cardBorder = '2px solid #017953';
                            statusTextColor = '#017953';
                          } else if (!isAvailable) {
                            cardBg = '#f8fafc';
                            cardBorder = isFull ? '1px solid #fecaca' : '1px solid #e2e8f0';
                            if (isExpired) {
                              dotColor = '#94a3b8';
                              statusTextColor = '#64748b';
                              statusText = '✕ समय समाप्त (Expired)';
                            } else {
                              dotColor = '#ef4444';
                              statusTextColor = '#dc2626';
                              statusText = '✕ स्लॉट पूर्ण (Full)';
                            }
                          } else if (remainingCount <= 5) {
                            cardBg = '#fffbeb';
                            cardBorder = '1px solid #fde68a';
                            dotColor = '#f59e0b';
                            statusTextColor = '#d97706';
                            statusText = `⚡ केवल ${remainingCount} स्लॉट शेष (सीमित)`;
                          }

                          return (
                            <div 
                              key={s.slotId}
                              onClick={() => {
                                if (isAvailable) {
                                  setErrorMsg('');
                                  setSelectedTimeSlot({
                                    slotId: s.slotId,
                                    timeRangeLabel: s.timeRangeLabel,
                                    availableSlots: remainingCount,
                                    isAvailable: true
                                  });
                                }
                              }}
                              style={{ 
                                border: cardBorder, 
                                background: cardBg, 
                                borderRadius: '12px', 
                                padding: '12px 14px', 
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                opacity: isAvailable ? 1 : 0.6,
                                boxShadow: isSel ? '0 4px 12px rgba(1, 121, 83, 0.16)' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isAvailable ? '#111827' : '#64748b' }}>
                                  {s.timeRangeLabel}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: statusTextColor, fontWeight: 700, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dotColor }}></span>
                                  <span>{statusText}</span>
                                </div>
                              </div>

                              <div>
                                {isSel ? (
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#017953', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>
                                  </div>
                                ) : (
                                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isAvailable ? '1.5px solid #cbd5e1' : '1.5px solid #e2e8f0', background: isAvailable ? 'transparent' : '#f1f5f9' }}></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Bar: Selection summary + Next Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.84rem', color: '#4b5563' }}>
                    {selectedTimeSlot ? (
                      <span style={{ color: '#017953', fontWeight: 600 }}>
                        ✓ चयनित स्लॉट: <strong>{selectedTimeSlot.timeRangeLabel}</strong>
                      </span>
                    ) : (
                      <span>कृपया आगे बढ़ने के लिए एक समय स्लॉट चुनें</span>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      if (!selectedTimeSlot || !selectedTimeSlot.isAvailable) {
                        const firstAvail = displayedSlots.find(s => s.isAvailable !== false && s.availableSlots > 0);
                        if (firstAvail) {
                          setSelectedTimeSlot({
                            slotId: firstAvail.slotId,
                            timeRangeLabel: firstAvail.timeRangeLabel,
                            availableSlots: firstAvail.availableSlots || 15,
                            isAvailable: true
                          });
                        } else {
                          setErrorMsg('कृपया उपलब्ध समय स्लॉट का चयन करें।');
                          return;
                        }
                      }
                      handleNext();
                    }} 
                    style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 34px', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(1, 121, 83, 0.25)' }}
                  >
                    <span>आगे बढ़ें (पुष्टि करें)</span> <ArrowRight size={18} />
                  </button>
                </div>

              </div>

            </div>
          );
        })()}

        {/* ================= STEP 7: CONFIRMATION REVIEW ================= */}
        {step === 7 && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Left Column: doc_card.png (Checklist Document Card) */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <img src={docCard} alt="Review Checklist" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            {/* Right Column: 4 Summary Cards + Actions */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 800, background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px' }}>
                  7. पुष्टि करें
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: '8px 0 2px 0' }}>
                  स्लॉट बुक करने की पुष्टि करें
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: 0 }}>
                  कृपया सभी विवरण की जांच करें और टोकन बुक करने की पुष्टि करें
                </p>
              </div>

              {/* 4 Summary Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                
                {/* 1. Crop Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🌱
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>फसल (Crop)</span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                      {currentCrop.name} ({currentCrop.season})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700, marginTop: '2px' }}>
                      MSP दर: ₹{effectiveMsp.toLocaleString('en-IN')}/क्विंटल {qualityBonus > 0 ? `(मूल ₹${currentCrop.mspValue.toLocaleString('en-IN')} + ₹${qualityBonus} बोनस)` : ''} • {currentQuality.title}
                    </div>
                  </div>
                </div>

                {/* 2. Centre Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🏢
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{lang === 'en' ? 'Procurement Centre' : 'उपार्जन केंद्र'}</span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                      {selectedCentre?.centerName || '—'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {selectedCentre?.centerLocation || '—'}
                    </div>
                  </div>
                </div>

                {/* 3. Date & Time Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    📅
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>तारीख एवं समय (Date & Time)</span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                      {formatHindiDate(selectedDate)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> <span>{selectedTimeSlot?.timeRangeLabel || '09:00 AM – 10:00 AM'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Quantity Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    💰
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>अनुमानित मात्रा (Quantity)</span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                      {quantity} क्विंटल (Quintals)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#017953', fontWeight: 700, marginTop: '2px' }}>
                      अनुमानित DBT: ₹{estimatedAmount} ({quantity} क्विंटल × ₹{effectiveMsp.toLocaleString('en-IN')})
                    </div>
                  </div>
                </div>

              </div>

              {/* Note pill */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                <Info size={16} />
                <span><strong>{lang === 'en' ? 'Note: ' : 'नोट: '}</strong>{lang === 'en' ? 'Quantity entered is estimated. Final quantity and payment will be finalized after weighment at the procurement centre.' : 'यहाँ दर्ज मात्रा अनुमानित है। वास्तविक मात्रा व भुगतान का निर्धारण उपार्जन केंद्र पर तौल के बाद किया जाएगा।'}</span>
              </div>

              {/* Actions: Fix 11 - Prevent duplicate submission */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={handleBack} disabled={submitting} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '8px 20px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> <span>{lang === 'en' ? 'Previous (Time Slot)' : 'पिछला चरण (समय स्लॉट)'}</span>
                </button>

                <button 
                  onClick={handleNext} 
                  disabled={submitting}
                  style={{ 
                    background: submitting ? '#94a3b8' : '#017953', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '10px', 
                    padding: '12px 34px', 
                    fontSize: '1.02rem', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: submitting ? 'not-allowed' : 'pointer', 
                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(1, 121, 83, 0.25)',
                    opacity: submitting ? 0.75 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                  <span>{submitting ? (lang === 'en' ? 'Booking in progress...' : 'बुकिंग प्रक्रिया जारी है...') : (lang === 'en' ? 'Confirm Slot Booking →' : 'स्लॉट बुक करने की पुष्टि करें →')}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ================= STEP 8: DIGITAL QR PASS & TOKEN ================= */}
        {step === 8 && (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '36px', maxWidth: '640px', margin: '0 auto', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#017953', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Check size={36} strokeWidth={3} />
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#064e3b', marginBottom: '4px' }}>
              {lang === 'en' ? 'Slot Successfully Booked!' : 'स्लॉट सफलतापूर्वक बुक हो गया!'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '24px' }}>
              {lang === 'en' ? 'Your token and procurement centre entry pass have been generated.' : 'आपका टोकन और उपार्जन केंद्र प्रवेश पास जनरेट कर दिया गया है।'}
            </p>

            {/* Ticket Card */}
            <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{lang === 'en' ? 'Token Number' : 'टोकन संख्या'}</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#017953' }}>
                    {bookingConfirmed?.tokenNumber || '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{lang === 'en' ? 'Booking Reference' : 'बुकिंग संदर्भ'}</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
                    {bookingConfirmed?.bookingReference || '—'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
                <div><strong>{lang === 'en' ? 'Farmer:' : 'किसान:'}</strong> {bookingConfirmed?.farmerName || localStorage.getItem('farmer_name') || '—'}</div>
                <div><strong>{lang === 'en' ? 'Produce:' : 'फसल:'}</strong> {bookingConfirmed?.produceName || `${currentCrop?.name || '—'} (${currentQuality?.title || '—'})`}</div>
                <div><strong>{lang === 'en' ? 'Quantity:' : 'मात्रा:'}</strong> {bookingConfirmed?.estimatedQuantity || quantity} {lang === 'en' ? 'Quintals' : 'क्विंटल'}</div>
                <div><strong>{lang === 'en' ? 'Date:' : 'तारीख:'}</strong> {bookingConfirmed?.slotDate || selectedDate}</div>
                <div><strong>{lang === 'en' ? 'Allocated Centre:' : 'आवंटित उपार्जन केंद्र:'}</strong> {bookingConfirmed?.centerName || selectedCentre?.centerName || '—'}</div>
                <div><strong>{lang === 'en' ? 'Time:' : 'समय:'}</strong> {bookingConfirmed?.timeLabel || selectedTimeSlot?.timeRangeLabel || '—'}</div>
                {bookingConfirmed?.counterName && (
                  <div style={{ gridColumn: 'span 2', background: '#ecfdf5', padding: '6px 10px', borderRadius: '8px', color: '#065f46', fontWeight: 700 }}>
                    {lang === 'en' ? 'Allocated Counter:' : 'आवंटित काउंटर:'} {bookingConfirmed.counterName}
                  </div>
                )}
              </div>

              {/* QR Code SVG - Dynamic Token */}
              <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-block', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '2px solid #017953', boxShadow: '0 6px 18px rgba(1, 121, 83, 0.12)' }}>
                  <QRCodeSVG 
                    value={bookingConfirmed?.qrCodeToken || (bookingConfirmed?.bookingReference ? `KK-REF:${bookingConfirmed.bookingReference}` : 'KK-PENDING')}
                    size={155}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div style={{ fontSize: '0.88rem', color: '#017953', fontWeight: 800, marginTop: '8px' }}>
                  {lang === 'en' ? 'Procurement Centre Gate Verification Pass' : 'उपार्जन केंद्र गेट सत्यापन क्यूआर पास'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  {lang === 'en' ? 'Verification Code: ' : 'सत्यापन कोड: '}<strong style={{ color: '#111827' }}>{bookingConfirmed?.bookingReference || '—'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.print()} 
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={16} /> <span>पास प्रिंट करें</span>
              </button>
              <button 
                onClick={() => navigate('/farmer/dashboard')} 
                style={{ background: '#017953', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}
              >
                डैशबोर्ड पर वापस जाएं
              </button>
              <button 
                onClick={() => navigate('/farmer/queue')} 
                style={{ background: '#ffffff', border: '1px solid #017953', color: '#017953', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}
              >
                लाइव कतार देखें →
              </button>
            </div>
          </div>
        )}

        {/* ================= BOTTOM GLOBAL FOOTER LINE ================= */}
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
            <strong>किसान का सम्मान</strong> | हमारी प्राथमिकता
          </div>
          <div>
            डिजिटल कृषि • समृद्ध किसान • विकसित भारत
          </div>
        </div>

      </div>
    </div>
  );
}
