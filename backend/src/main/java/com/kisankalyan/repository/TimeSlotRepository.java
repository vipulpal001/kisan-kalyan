package com.kisankalyan.repository;

import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.entity.TimeSlot;
import com.kisankalyan.entity.enums.TimeSlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByCenterAndSlotDate(ProcurementCentre center, LocalDate slotDate);
    List<TimeSlot> findByCenterAndSlotDateAndStatus(ProcurementCentre center, LocalDate slotDate, TimeSlotStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM TimeSlot s WHERE s.slotId = :slotId")
    Optional<TimeSlot> findByIdWithLock(@Param("slotId") Long slotId);
}

