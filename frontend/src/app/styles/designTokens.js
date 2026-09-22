/**
 * Kisan Kalyan Portal - Centralized Design Tokens & Official Terminology
 * Standardized for Indian Government e-Procurement Portal Experience
 */

export const TERMINOLOGY = {
  // Official Terminology Standards
  procurementCentre: {
    hi: 'उपार्जन केंद्र',
    en: 'Procurement Centre'
  },
  slotBooking: {
    hi: 'स्लॉट आरक्षण',
    en: 'Slot Booking'
  },
  liveQueue: {
    hi: 'लाइव कतार',
    en: 'Live Queue'
  },
  procurementStatus: {
    hi: 'उपार्जन स्थिति',
    en: 'Procurement Status'
  },
  storage: {
    hi: 'भंडारण',
    en: 'Storage & Godowns'
  },
  payments: {
    hi: 'भुगतान (DBT)',
    en: 'Payments (DBT)'
  },
  farmer: {
    hi: 'किसान',
    en: 'Farmer'
  },
  operator: {
    hi: 'उपार्जन केंद्र ऑपरेटर',
    en: 'Centre Operator'
  },
  admin: {
    hi: 'व्यवस्थापक',
    en: 'Administrator'
  },

  // 7-Step Slot Booking Flow Sequence
  bookingSteps: [
    { step: 1, hi: 'फसल चुनें', en: 'Select Crop', subHi: 'फसल का चयन करें', subEn: 'Choose your produce' },
    { step: 2, hi: 'मात्रा चुनें', en: 'Select Quantity', subHi: 'अनुमानित क्विंटल दर्ज करें', subEn: 'Enter estimated quintals' },
    { step: 3, hi: 'गुणवत्ता चुनें', en: 'Select Quality', subHi: 'फसल ग्रेड / क्वालिटी', subEn: 'Choose quality grade' },
    { step: 4, hi: 'उपार्जन केंद्र चुनें', en: 'Select Centre', subHi: 'निकटतम उपार्जन केंद्र', subEn: 'Choose procurement centre' },
    { step: 5, hi: 'तारीख चुनें', en: 'Select Date', subHi: 'आगमन की तारीख', subEn: 'Choose arrival date' },
    { step: 6, hi: 'समय स्लॉट', en: 'Time Slot', subHi: 'सुविधाजनक समय', subEn: 'Select suitable time' },
    { step: 7, hi: 'पुष्टि करें', en: 'Confirm Booking', subHi: 'समीक्षा एवं टोकन', subEn: 'Review & get token' }
  ]
};

export const STATUS_COLORS = {
  AVAILABLE: {
    text: '#065f46',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    dot: '#059669',
    labelHi: 'उपलब्ध',
    labelEn: 'Available'
  },
  LIMITED: {
    text: '#92400e',
    bg: '#fef3c7',
    border: '#fde68a',
    dot: '#d97706',
    labelHi: 'सीमित उपलब्ध',
    labelEn: 'Limited'
  },
  BOOKED: {
    text: '#991b1b',
    bg: '#fef2f2',
    border: '#fecaca',
    dot: '#dc2626',
    labelHi: 'पूर्ण / अनुपलब्ध',
    labelEn: 'Full / Booked'
  },
  EXPIRED: {
    text: '#475569',
    bg: '#f1f5f9',
    border: '#cbd5e1',
    dot: '#64748b',
    labelHi: 'समय समाप्त',
    labelEn: 'Expired'
  },
  ARRIVED: {
    text: '#1e40af',
    bg: '#eff6ff',
    border: '#bfdbfe',
    dot: '#2563eb',
    labelHi: 'उपस्थित',
    labelEn: 'Arrived'
  },
  IN_QUEUE: {
    text: '#7c2d12',
    bg: '#ffedd5',
    border: '#fed7aa',
    dot: '#ea580c',
    labelHi: 'कतार में',
    labelEn: 'In Queue'
  },
  PROCESSING: {
    text: '#6b21a8',
    bg: '#f3e8ff',
    border: '#e9d5ff',
    dot: '#9333ea',
    labelHi: 'जांच / तौल जारी',
    labelEn: 'Processing'
  },
  COMPLETED: {
    text: '#065f46',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    dot: '#059669',
    labelHi: 'खरीद पूर्ण',
    labelEn: 'Completed'
  },
  CANCELLED: {
    text: '#991b1b',
    bg: '#fef2f2',
    border: '#fecaca',
    dot: '#dc2626',
    labelHi: 'रद्द',
    labelEn: 'Cancelled'
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px'
};

export const TYPOGRAPHY = {
  display: '1.75rem',
  h1: '1.45rem',
  h2: '1.25rem',
  h3: '1.05rem',
  body: '0.92rem',
  small: '0.82rem',
  tiny: '0.72rem'
};
