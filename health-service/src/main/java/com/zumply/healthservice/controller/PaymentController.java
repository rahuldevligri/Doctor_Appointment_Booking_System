package com.zumply.healthservice.controller;

import com.zumply.healthservice.entity.Payment;
import com.zumply.healthservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("api/v1")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/payment/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.getPayment(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error fetching payment with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/payment")
    public ResponseEntity<Payment> processPayment(@RequestParam Map<String, Object> data) {
        try {
            logger.info("Processing payment with data: {}", data);
            Payment payment = paymentService.processPayment(data);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/payment/success/{id}")
    public ResponseEntity<Payment> paymentSuccess(@PathVariable Long id) {
        try {
            logger.info("Payment success for id: {}", id);
            Payment payment = paymentService.updatePaymentStatus(id, "paid");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error updating payment status to success for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/payment/fail/{id}")
    public ResponseEntity<Payment> paymentFail(@PathVariable Long id) {
        try {
            logger.info("Payment failed for id: {}", id);
            Payment payment = paymentService.updatePaymentStatus(id, "failed");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error updating payment status to fail for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}