const Razorpay = require("razorpay");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Create Payment Order
const createPayment = async (req, res) => {
  try {
    const { amount, bookingId, userId } = req.body;

    if (!amount || !bookingId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Amount, Booking ID and User ID are required.",
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: userId,
      booking: bookingId,
      amount,
      razorpayOrderId: order.id,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment order created successfully.",
      order,
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Payment History
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("booking");

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Razorpay Webhook
const webhook = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Webhook received.",
  });
};

module.exports = {
  createPayment,
  getPaymentHistory,
  webhook,
};