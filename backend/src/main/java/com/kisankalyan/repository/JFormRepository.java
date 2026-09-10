package com.kisankalyan.repository;

import com.kisankalyan.entity.JForm;
import com.kisankalyan.entity.ProcurementEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JFormRepository extends JpaRepository<JForm, Long> {
    Optional<JForm> findByEntry(ProcurementEntry entry);

    @Query("SELECT jf FROM JForm jf WHERE jf.jFormNumber = :jFormNumber")
    Optional<JForm> findByJFormNumber(@Param("jFormNumber") String jFormNumber);
}
