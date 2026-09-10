package com.kisankalyan.repository;

import com.kisankalyan.entity.ProcurementEntry;
import com.kisankalyan.entity.StorageLocation;
import com.kisankalyan.entity.StorageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorageRecordRepository extends JpaRepository<StorageRecord, Long> {
    List<StorageRecord> findByStorageLocation(StorageLocation storageLocation);
    List<StorageRecord> findByProcurementEntry(ProcurementEntry procurementEntry);
}
