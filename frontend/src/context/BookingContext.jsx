import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

const STORAGE_KEY = 'kisan_active_booking';
const SLOTS_STORAGE_KEY = 'kisan_slot_capacities';
const NOTIF_STORAGE_KEY = 'kisan_notifications';

// Default initial slot capacity data matching SIH requirements
export const INITIAL_SLOTS = [
  {
    slotId: 1,
    timeRangeLabel: '09:00 AM – 10:00 AM',
    totalCapacityQ: 100,
    bookedCapacityQ: 85,
    remainingCapacityQ: 15,
    status: 'LIMITED' // 85% full
  },
  {
    slotId: 2,
    timeRangeLabel: '10:00 AM – 11:00 AM',
    totalCapacityQ: 100,
    bookedCapacityQ: 70,
    remainingCapacityQ: 30,
    status: 'LIMITED'
  },
  {
    slotId: 3,
    timeRangeLabel: '11:00 AM – 12:00 PM',
    totalCapacityQ: 100,
    bookedCapacityQ: 100,
    remainingCapacityQ: 0,
    status: 'FULL'
  },
  {
    slotId: 4,
    timeRangeLabel: '12:00 PM – 01:00 PM',
    totalCapacityQ: 100,
    bookedCapacityQ: 40,
    remainingCapacityQ: 60,
    status: 'AVAILABLE'
  },
  {
    slotId: 5,
    timeRangeLabel: '02:00 PM – 03:00 PM',
    totalCapacityQ: 100,
    bookedCapacityQ: 25,
    remainingCapacityQ: 75,
    status: 'AVAILABLE'
  },
  {
    slotId: 6,
    timeRangeLabel: '03:00 PM – 04:00 PM',
    totalCapacityQ: 100,
    bookedCapacityQ: 0,
    remainingCapacityQ: 100,
    status: 'AVAILABLE'
  }
];

// Initial Centre list with realistic capacities & live queues
export const INITIAL_CENTRES = [
  {
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
    activeCounters: 3,
    isRecommended: true
  },
  {
    centerId: 2,
    centerCode: 'PC-UP-04',
    centerName: 'चुनार कृषि उपज मंडी समिति (Chunar APMC)',
    centerShortName: 'Chunar APMC',
    centerLocation: 'मीरजापुर, उत्तर प्रदेश (Mirzapur, Uttar Pradesh)',
    distanceKm: 7.5,
    status: 'Open',
    statusBadge: 'खुला है (Open)',
    totalDailyCapacityQ: 800,
    bookedDailyCapacityQ: 520,
    remainingDailyCapacityQ: 280,
    currentQueueLength: 14,
    activeCounters: 2,
    isRecommended: false
  },
  {
    centerId: 3,
    centerCode: 'MRT-APMC-02',
    centerName: 'मेरठ मुख्य अनाज मंडी खरीद केंद्र (Meerut APMC)',
    centerShortName: 'Meerut APMC',
    centerLocation: 'मेरठ, उत्तर प्रदेश (Meerut, Uttar Pradesh)',
    distanceKm: 12.8,
    status: 'Busy',
    statusBadge: 'व्यस्त (Busy)',
    totalDailyCapacityQ: 1200,
    bookedDailyCapacityQ: 1080,
    remainingDailyCapacityQ: 120,
    currentQueueLength: 26,
    activeCounters: 4,
    isRecommended: false
  }
];

// Canonical Baseline Demo Booking
export const DEFAULT_BOOKING = {
  bookingId: 'KK-260922-1045',
  numericId: 86,
  tokenNumber: 'WHT-042',
  secondaryToken: 'T-114-30',
  bookingReference: 'BK-2026-89421',
  farmerId: 1,
  farmerName: 'रामेश्वर सिंह (Ramesh Singh)',
  cropKey: 'wheat',
  cropName: 'गेहूं (Wheat)',
  cropCode: 'WHT-2026',
  qualityGrade: 'FAQ Grade A (उत्तम गुणवत्ता)',
  moisturePercent: '11.2%',
  centerId: 1,
  centerName: 'गाज़ियाबाद गेहूं खरीद केंद्र (Ghaziabad Procurement Centre)',
  centerShortName: 'Ghaziabad Centre',
  centerLocation: 'गाज़ियाबाद, उत्तर प्रदेश',
  slotDate: '2026-09-24',
  slotDateDisplay: '24 सितम्बर 2026 (24 Sep 2026)',
  timeSlotLabel: '02:00 PM – 03:00 PM',
  slotId: 5,
  quantity: 65,
  mspRate: 2275,
  estimatedAmount: 147875, // 65 * 2275
  bookingStatus: 'CONFIRMED', // CONFIRMED, ARRIVED, VERIFICATION, QUALITY_CHECK, WEIGHING, PROCUREMENT, COMPLETED, CANCELLED, MISSED
  queueStage: 'QUALITY_CHECK',
  counterId: 2,
  counterNumber: 2,
  counterName: 'काउंटर 02 (Counter 02)',
  currentServingToken: 'WHT-037',
  queuePosition: 6,
  farmersAhead: 5,
  estimatedWaitMinutes: 25,
  verificationDeadline: '01:50 PM, 24 Sep 2026',
  bookedAt: '2026-09-22T10:00:00Z',
  qrCodeToken: 'KK-GZB-WHT-042-20260924-F1',
  isDemoData: true
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'बुकिंग की पुष्टि (Booking Confirmed)',
    message: 'आपका स्लॉट गाज़ियाबाद केंद्र पर 24 सितम्बर 2026, 02:00 PM – 03:00 PM हेतु टोकन WHT-042 के साथ आरक्षित कर दिया गया है।',
    time: '10 मिनट पहले',
    type: 'success',
    read: false
  },
  {
    id: 2,
    title: 'कतार अद्यतन (Queue Position)',
    message: 'वर्तमान में टोकन WHT-037 काउंटर 02 पर सेवा प्राप्त कर रहा है। आपसे आगे 5 किसान हैं।',
    time: '2 मिनट पहले',
    type: 'info',
    read: false
  }
];

export function BookingProvider({ children }) {
  const [activeBooking, setActiveBooking] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_BOOKING, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse saved booking from localStorage', e);
    }
    return DEFAULT_BOOKING;
  });

  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(SLOTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SLOTS;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [bookingHistory, setBookingHistory] = useState([DEFAULT_BOOKING]);

  // Persist slots
  useEffect(() => {
    try {
      localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slots));
    } catch (e) {}
  }, [slots]);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Update active booking
  const updateActiveBooking = (newBookingData) => {
    const qty = Number(newBookingData.quantity !== undefined ? newBookingData.quantity : (activeBooking?.quantity || 65));
    const rate = Number(newBookingData.mspRate || activeBooking?.mspRate || 2275);
    const merged = {
      ...DEFAULT_BOOKING,
      ...activeBooking,
      ...newBookingData,
      quantity: qty,
      mspRate: rate,
      estimatedAmount: qty * rate
    };
    setActiveBooking(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to save booking to localStorage', e);
    }
    setBookingHistory(prev => [merged, ...prev.filter(b => b.bookingId !== merged.bookingId)]);
    return merged;
  };

  // Add notification
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: 'अभी-अभी (Just now)',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Confirm booking & deduct capacity
  const confirmBookingWithCapacity = (bookingData) => {
    const slotId = bookingData.slotId;
    const requestedQty = Number(bookingData.quantity || 65);

    // Update slot capacity
    setSlots(prevSlots => prevSlots.map(s => {
      if (s.slotId === slotId) {
        const newBooked = s.bookedCapacityQ + requestedQty;
        const newRemaining = Math.max(0, s.totalCapacityQ - newBooked);
        let newStatus = 'AVAILABLE';
        if (newRemaining <= 0) newStatus = 'FULL';
        else if (newRemaining < 40) newStatus = 'LIMITED';
        return {
          ...s,
          bookedCapacityQ: newBooked,
          remainingCapacityQ: newRemaining,
          status: newStatus
        };
      }
      return s;
    }));

    const unified = updateActiveBooking({
      ...bookingData,
      bookingStatus: 'CONFIRMED',
      queueStage: 'BOOKED'
    });

    addNotification(
      'बुकिंग सफल (Booking Confirmed)',
      `टोकन ${unified.tokenNumber} के साथ ${requestedQty} क्विंटल का स्लॉट आरक्षित किया गया।`,
      'success'
    );

    return unified;
  };

  // Cancel booking & release capacity immediately
  const cancelBooking = (bookingId) => {
    if (!activeBooking || activeBooking.bookingStatus === 'CANCELLED') return;
    const qtyToRelease = Number(activeBooking.quantity || 0);
    const slotId = activeBooking.slotId;

    // Release capacity back to slot
    setSlots(prevSlots => prevSlots.map(s => {
      if (s.slotId === slotId) {
        const newBooked = Math.max(0, s.bookedCapacityQ - qtyToRelease);
        const newRemaining = Math.min(s.totalCapacityQ, s.totalCapacityQ - newBooked);
        let newStatus = 'AVAILABLE';
        if (newRemaining <= 0) newStatus = 'FULL';
        else if (newRemaining < 40) newStatus = 'LIMITED';
        return {
          ...s,
          bookedCapacityQ: newBooked,
          remainingCapacityQ: newRemaining,
          status: newStatus
        };
      }
      return s;
    }));

    const cancelledBooking = {
      ...activeBooking,
      bookingStatus: 'CANCELLED'
    };
    setActiveBooking(cancelledBooking);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cancelledBooking));
    } catch (e) {}

    addNotification(
      'बुकिंग निरस्त (Booking Cancelled)',
      `स्लॉट बुकिंग रद्द कर दी गई है। ${qtyToRelease} क्विंटल क्षमता पुनः स्लॉट में उपलब्ध करा दी गई है।`,
      'warning'
    );

    return cancelledBooking;
  };

  // Reschedule missed slot to next available slot
  const rescheduleMissedSlot = () => {
    // Find next available slot that has capacity for activeBooking.quantity
    const farmerQty = Number(activeBooking?.quantity || 65);
    const availableSlot = slots.find(s => s.remainingCapacityQ >= farmerQty && s.slotId !== activeBooking?.slotId);

    if (!availableSlot) {
      alert("वर्तमान केंद्र पर पर्याप्त क्षमता वाला कोई अगला स्लॉट उपलब्ध नहीं है। कृपया नजदीकी खरीद केंद्र चुनें।");
      return null;
    }

    // Reallocate
    const updated = updateActiveBooking({
      slotId: availableSlot.slotId,
      timeSlotLabel: availableSlot.timeRangeLabel,
      bookingStatus: 'CONFIRMED',
      tokenNumber: `WHT-${Math.floor(40 + Math.random() * 50)}`,
      currentServingToken: 'WHT-037',
      farmersAhead: 6,
      estimatedWaitMinutes: 30
    });

    addNotification(
      'स्लॉट पुनर्नियुक्ति (Slot Rescheduled)',
      `विलंब के कारण नया स्लॉट ${availableSlot.timeRangeLabel} आवंटित किया गया है।`,
      'info'
    );

    return updated;
  };

  // Advance queue stage (for testing/staff interaction)
  const advanceQueueStage = (nextStage) => {
    if (!activeBooking) return;
    const stages = ['BOOKED', 'ARRIVED', 'VERIFICATION', 'QUALITY_CHECK', 'WEIGHING', 'PROCUREMENT', 'COMPLETED', 'PAYMENT'];
    const currentIdx = stages.indexOf(activeBooking.queueStage || 'BOOKED');
    const stageToSet = nextStage || (currentIdx < stages.length - 1 ? stages[currentIdx + 1] : stages[stages.length - 1]);
    
    let farmersAhead = Math.max(0, (activeBooking.farmersAhead || 5) - 1);
    let waitMins = Math.max(5, (activeBooking.estimatedWaitMinutes || 25) - 5);

    const updated = updateActiveBooking({
      queueStage: stageToSet,
      farmersAhead,
      estimatedWaitMinutes: waitMins
    });

    addNotification(
      `कतार चरण: ${stageToSet}`,
      `आपकी टोकन प्रक्रिया का अगला चरण (${stageToSet}) प्रारंभ हो गया है।`,
      'info'
    );

    return updated;
  };

  const resetToDefaultBooking = () => {
    setActiveBooking(DEFAULT_BOOKING);
    setSlots(INITIAL_SLOTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKING));
      localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(INITIAL_SLOTS));
    } catch (e) {}
  };

  return (
    <BookingContext.Provider value={{
      activeBooking,
      bookingHistory,
      slots,
      centres: INITIAL_CENTRES,
      notifications,
      updateActiveBooking,
      confirmBookingWithCapacity,
      cancelBooking,
      rescheduleMissedSlot,
      advanceQueueStage,
      addNotification,
      resetToDefaultBooking,
      DEFAULT_BOOKING,
      INITIAL_SLOTS,
      INITIAL_CENTRES
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    return {
      activeBooking: DEFAULT_BOOKING,
      bookingHistory: [DEFAULT_BOOKING],
      slots: INITIAL_SLOTS,
      centres: INITIAL_CENTRES,
      notifications: INITIAL_NOTIFICATIONS,
      updateActiveBooking: () => DEFAULT_BOOKING,
      confirmBookingWithCapacity: () => DEFAULT_BOOKING,
      cancelBooking: () => DEFAULT_BOOKING,
      rescheduleMissedSlot: () => DEFAULT_BOOKING,
      advanceQueueStage: () => {},
      addNotification: () => {},
      resetToDefaultBooking: () => {},
      DEFAULT_BOOKING,
      INITIAL_SLOTS,
      INITIAL_CENTRES
    };
  }
  return context;
}

