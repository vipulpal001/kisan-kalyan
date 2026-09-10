package com.kisankalyan.service;

import com.kisankalyan.entity.SlotBooking;
import com.kisankalyan.entity.enums.BookingStatus;
import com.kisankalyan.repository.SlotBookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;

@Component
public class NoShowScheduler {

    private static final Logger log = LoggerFactory.getLogger(NoShowScheduler.class);

    @Autowired
    private SlotBookingRepository slotBookingRepository;

    @Autowired
    private SlotAllocationService slotAllocationService;

    // Runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void scanAndProcessNoShows() {
        OffsetDateTime now = OffsetDateTime.now();
        List<SlotBooking> expiredBookings = slotBookingRepository.findExpiredUnverifiedBookings(BookingStatus.BOOKED, now);

        if (!expiredBookings.isEmpty()) {
            log.info("NoShowScheduler: Found {} expired unverified bookings to process as NO_SHOW", expiredBookings.size());
            for (SlotBooking booking : expiredBookings) {
                try {
                    log.info("Processing NO_SHOW for booking ID: {}, Reference: {}", booking.getBookingId(), booking.getBookingReference());
                    slotAllocationService.handleNoShowAndReallocate(
                            booking.getBookingId(),
                            "सत्यापन समयसीमा (10 मिनट पूर्व) समाप्त हो गई। / QR Verification deadline elapsed."
                    );
                } catch (Exception e) {
                    log.error("Error processing no-show for booking ID: " + booking.getBookingId(), e);
                }
            }
        }
    }
}
