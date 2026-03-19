package com.marketplace.repository;

import com.marketplace.entity.Service;
import com.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByProvider(User provider);
    List<Service> findByCategoryId(Long categoryId);
    List<Service> findByStatus(Service.ServiceStatus status);
}
