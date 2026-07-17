const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPaymentHistory,
  webhook,
} = require("../controllers/paymentController");

// Create Payment Order
router.post("/payment", createPayment);

// Payment History
router.get("/payment-history", getPaymentHistory);

// Razorpay Webhook
router.post("/webhook", webhook);

module.exports = router;