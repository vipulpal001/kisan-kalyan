package com.kisankalyan.repository;

import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.entity.StorageLocation;
import com.kisankalyan.entity.enums.StorageLocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long> {
    Optional<StorageLocation> findByStorageCode(String storageCode);
    List<StorageLocation> findByCenter(ProcurementCentre center);
    List<StorageLocation> findByCenterAndStorageStatus(ProcurementCentre center, StorageLocationStatus storageStatus);
}
