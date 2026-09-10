package com.kisankalyan.repository;

import com.kisankalyan.entity.AppUser;
import com.kisankalyan.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderBySentAtDesc(AppUser user);
    List<Notification> findByUserAndIsReadFalse(AppUser user);
}
