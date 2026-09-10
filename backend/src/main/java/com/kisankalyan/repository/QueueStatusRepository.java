package com.kisankalyan.repository;

import com.kisankalyan.entity.Counter;
import com.kisankalyan.entity.QueueStatus;
import com.kisankalyan.entity.SlotBooking;
import com.kisankalyan.entity.enums.QueueCurrentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueStatusRepository extends JpaRepository<QueueStatus, Long> {
    Optional<QueueStatus> findByBooking(SlotBooking booking);
    Optional<QueueStatus> findByTokenNumber(String tokenNumber);
    List<QueueStatus> findByCounterAndCurrentStatus(Counter counter, QueueCurrentStatus currentStatus);
    List<QueueStatus> findByCurrentStatusOrderByQueuePositionAsc(QueueCurrentStatus currentStatus);
}
