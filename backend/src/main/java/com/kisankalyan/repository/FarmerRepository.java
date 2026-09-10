package com.kisankalyan.repository;

import com.kisankalyan.entity.AppUser;
import com.kisankalyan.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByUser(AppUser user);
    Optional<Farmer> findByPhoneNumber(String phoneNumber);
    Optional<Farmer> findByAadhaarNumber(String aadhaarNumber);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByAadhaarNumber(String aadhaarNumber);
}
