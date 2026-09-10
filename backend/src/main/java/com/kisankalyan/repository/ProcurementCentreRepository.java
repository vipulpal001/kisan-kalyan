package com.kisankalyan.repository;

import com.kisankalyan.entity.ProcurementCentre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcurementCentreRepository extends JpaRepository<ProcurementCentre, Long> {
    Optional<ProcurementCentre> findByCenterCode(String centerCode);
    List<ProcurementCentre> findByDistrict(String district);
}
