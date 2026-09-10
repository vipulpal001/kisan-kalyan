package com.kisankalyan.repository;

import com.kisankalyan.entity.AgriculturalProduce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgriculturalProduceRepository extends JpaRepository<AgriculturalProduce, Long> {
    Optional<AgriculturalProduce> findByProduceCode(String produceCode);
    List<AgriculturalProduce> findByIsActiveTrue();
}
