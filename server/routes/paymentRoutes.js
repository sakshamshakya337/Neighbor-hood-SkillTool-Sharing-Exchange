const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPaymentHistory,
  verifyPayment,
  getRazorpayKey,
} = require("../controllers/paymentController");

// Create Payment Order
router.post("/payment", createPayment);

// Payment History
router.get("/payment-history", getPaymentHistory);



// Verify Payment
router.post("/verify", verifyPayment);

// Get Razorpay Key
router.get("/get-key", getRazorpayKey);

module.exports = router;