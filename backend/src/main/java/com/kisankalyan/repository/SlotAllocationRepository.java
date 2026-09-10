package com.kisankalyan.repository;

import com.kisankalyan.entity.Counter;
import com.kisankalyan.entity.SlotAllocation;
import com.kisankalyan.entity.SlotBooking;
import com.kisankalyan.entity.TimeSlot;
import com.kisankalyan.entity.enums.AllocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotAllocationRepository extends JpaRepository<SlotAllocation, Long> {

    Optional<SlotAllocation> findByBooking(SlotBooking booking);

    List<SlotAllocation> findBySlotAndAllocationStatus(TimeSlot slot, AllocationStatus status);

    List<SlotAllocation> findByCounterAndAllocationStatus(Counter counter, AllocationStatus status);

    @Query("SELECT sa FROM SlotAllocation sa WHERE sa.counter = :counter " +
           "AND sa.allocationStatus = 'ALLOCATED' " +
           "AND ((sa.allocatedStartTime < :endTime AND sa.allocatedEndTime > :startTime))")
    List<SlotAllocation> findConflictingAllocations(
            @Param("counter") Counter counter,
            @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime
    );

    @Query("SELECT sa FROM SlotAllocation sa WHERE sa.counter = :counter " +
           "AND sa.allocationStatus = 'ALLOCATED' " +
           "AND sa.allocatedStartTime >= :dayStart AND sa.allocatedEndTime <= :dayEnd " +
           "ORDER BY sa.allocatedStartTime ASC")
    List<SlotAllocation> findActiveByCounterAndDay(
            @Param("counter") Counter counter,
            @Param("dayStart") OffsetDateTime dayStart,
            @Param("dayEnd") OffsetDateTime dayEnd
    );
}
