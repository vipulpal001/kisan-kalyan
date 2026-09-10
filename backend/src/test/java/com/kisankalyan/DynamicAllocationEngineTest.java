package com.kisankalyan;

import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.Counter;
import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.entity.TimeSlot;
import com.kisankalyan.service.SlotAllocationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DynamicAllocationEngineTest {

    @Autowired
    private SlotAllocationService allocationService;

    @Test
    public void testProcessingDurationCalculation() {
        ProcurementCentre centre = new ProcurementCentre();
        centre.setProcessingMinutesPerQuintal(BigDecimal.valueOf(10));

        // 1 quintal = 10 minutes
        long d1 = allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(1));
        assertEquals(10, d1);

        // 5 quintals = 50 minutes
        long d5 = allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(5));
        assertEquals(50, d5);

        // 10 quintals = 100 minutes
        long d10 = allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(10));
        assertEquals(100, d10);
    }

    @Test
    public void testFreeIntervalsCalculation() {
        Counter counter = new Counter();
        counter.setCounterId(1L);
        counter.setCounterNumber(1);

        TimeSlot slot = new TimeSlot();
        slot.setStartTime(LocalTime.of(9, 0));
        slot.setEndTime(LocalTime.of(10, 0));
        slot.setSlotDate(LocalDate.of(2026, 9, 9));

        List<SlotBookingDto.FreeInterval> intervals = allocationService.findFreeIntervals(counter, slot, slot.getSlotDate());
        assertNotNull(intervals);
        assertFalse(intervals.isEmpty());
        // Default window should provide a continuous 60-minute free interval if unallocated
        long totalFree = intervals.stream().mapToLong(SlotBookingDto.FreeInterval::getDurationMinutes).sum();
        assertEquals(60, totalFree);
    }
}
