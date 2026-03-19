package com.marketplace.repository;

import com.marketplace.entity.RegistrationPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationPaymentRepository extends JpaRepository<RegistrationPayment, Long> {
    Optional<RegistrationPayment> findByPaymentReference(String paymentReference);
    Optional<RegistrationPayment> findByEmail(String email);
    Optional<RegistrationPayment> findByUsername(String username);
    boolean existsByEmailAndStatus(String email, RegistrationPayment.PaymentStatus status);
}
