package com.kisankalyan.repository;

import com.kisankalyan.entity.Payment;
import com.kisankalyan.entity.ProcurementEntry;
import com.kisankalyan.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByEntry(ProcurementEntry entry);
    Optional<Payment> findByTransactionReference(String transactionReference);
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}
