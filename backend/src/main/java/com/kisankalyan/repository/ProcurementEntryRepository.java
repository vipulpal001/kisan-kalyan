package com.kisankalyan.repository;

import com.kisankalyan.entity.Counter;
import com.kisankalyan.entity.ProcurementEntry;
import com.kisankalyan.entity.SlotBooking;
import com.kisankalyan.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcurementEntryRepository extends JpaRepository<ProcurementEntry, Long> {
    Optional<ProcurementEntry> findByBooking(SlotBooking booking);
    List<ProcurementEntry> findByStaff(Staff staff);
    List<ProcurementEntry> findByCounter(Counter counter);
}
