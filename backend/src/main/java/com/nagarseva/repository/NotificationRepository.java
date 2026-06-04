package com.nagarseva.repository;

import com.nagarseva.entity.Citizen;
import com.nagarseva.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
