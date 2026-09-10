package com.kisankalyan.repository;

import com.kisankalyan.entity.Farmer;
import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.entity.SlotBooking;
import com.kisankalyan.entity.TimeSlot;
import com.kisankalyan.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlotBookingRepository extends JpaRepository<SlotBooking, Long> {
    Optional<SlotBooking> findByBookingReference(String bookingReference);
    Optional<SlotBooking> findByTokenNumber(String tokenNumber);
    List<SlotBooking> findByFarmer(Farmer farmer);
    List<SlotBooking> findByCenterAndBookingStatus(ProcurementCentre center, BookingStatus bookingStatus);
    List<SlotBooking> findBySlot(TimeSlot slot);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM SlotBooking b WHERE b.bookingStatus = :status AND b.qrVerifiedAt IS NULL AND b.verificationDeadline IS NOT NULL AND b.verificationDeadline < :now")
    List<SlotBooking> findExpiredUnverifiedBookings(
            @org.springframework.data.repository.query.Param("status") BookingStatus status,
            @org.springframework.data.repository.query.Param("now") java.time.OffsetDateTime now
    );
}
