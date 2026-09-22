package com.kisankalyan.service;

import com.kisankalyan.dto.AdminAnalyticsDto;
import com.kisankalyan.dto.MandiProcessDto;
import com.kisankalyan.dto.SlotBookingDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WebSocketBroadcastService {

    private static final Logger log = LoggerFactory.getLogger(WebSocketBroadcastService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast live mandi queue update to all subscribed clients
     */
    public void broadcastQueueUpdate(Long centerId, List<MandiProcessDto.QueueStatusResponse> queue) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "QUEUE_UPDATE");
            payload.put("centerId", centerId);
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("queue", queue);

            // Broadcast globally for general listeners
            messagingTemplate.convertAndSend("/topic/queue", payload);

            // Also broadcast to center-specific topic if centerId provided
            if (centerId != null) {
                messagingTemplate.convertAndSend("/topic/queue/" + centerId, payload);
            }
            log.info("Broadcasted QUEUE_UPDATE for centerId {} with {} queue items", centerId, queue != null ? queue.size() : 0);
        } catch (Exception e) {
            log.error("Failed to broadcast queue update: {}", e.getMessage(), e);
        }
    }

    /**
     * Broadcast token calling event specifically for speech and real-time alerts
     */
    public void broadcastTokenCalled(MandiProcessDto.QueueStatusResponse tokenStatus) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "TOKEN_CALLED");
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("tokenStatus", tokenStatus);

            messagingTemplate.convertAndSend("/topic/queue", payload);
            messagingTemplate.convertAndSend("/topic/token-called", payload);
            log.info("Broadcasted TOKEN_CALLED: Token {}", tokenStatus != null ? tokenStatus.getTokenNumber() : "unknown");
        } catch (Exception e) {
            log.error("Failed to broadcast token called event: {}", e.getMessage(), e);
        }
    }

    /**
     * Broadcast live administrative analytics upon any procurement or payment activity
     */
    public void broadcastAdminAnalytics(AdminAnalyticsDto analytics) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "ADMIN_ANALYTICS_UPDATE");
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("analytics", analytics);

            messagingTemplate.convertAndSend("/topic/admin/analytics", payload);
            log.info("Broadcasted ADMIN_ANALYTICS_UPDATE");
        } catch (Exception e) {
            log.error("Failed to broadcast admin analytics: {}", e.getMessage(), e);
        }
    }

    /**
     * Broadcast real-time notifications to a farmer
     */
    public void broadcastFarmerNotification(String username, Object notification) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NOTIFICATION");
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("notification", notification);

            messagingTemplate.convertAndSend("/topic/notifications", payload);
            if (username != null && !username.isBlank()) {
                messagingTemplate.convertAndSend("/topic/notifications/" + username, payload);
            }
            log.info("Broadcasted NOTIFICATION to user {}", username);
        } catch (Exception e) {
            log.error("Failed to broadcast farmer notification: {}", e.getMessage(), e);
        }
    }

    /**
     * Broadcast booking status updates (created, arrived, verified, completed)
     */
    public void broadcastBookingUpdate(Object booking) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "BOOKING_UPDATE");
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("booking", booking);

            messagingTemplate.convertAndSend("/topic/bookings", payload);
            log.info("Broadcasted BOOKING_UPDATE");
        } catch (Exception e) {
            log.error("Failed to broadcast booking update: {}", e.getMessage(), e);
        }
    }
}
