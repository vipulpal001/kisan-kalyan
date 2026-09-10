package com.kisankalyan.repository;

import com.kisankalyan.entity.AppUser;
import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByUser(AppUser user);
    Optional<Staff> findByEmployeeCode(String employeeCode);
    Optional<Staff> findByPhoneNumber(String phoneNumber);
    List<Staff> findByCenter(ProcurementCentre center);
}
