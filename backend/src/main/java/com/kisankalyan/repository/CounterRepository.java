package com.kisankalyan.repository;

import com.kisankalyan.entity.Counter;
import com.kisankalyan.entity.ProcurementCentre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CounterRepository extends JpaRepository<Counter, Long> {
    List<Counter> findByCenter(ProcurementCentre center);
    Optional<Counter> findByCenterAndCounterNumber(ProcurementCentre center, Integer counterNumber);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Counter c WHERE c.counterId = :counterId")
    Optional<Counter> findWithLockingById(@org.springframework.data.repository.query.Param("counterId") Long counterId);
}
