const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Tool = require("../models/Tool");
const Skill = require("../models/Skill");
const sendEmail = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

// Get Razorpay Key
const getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  });
};

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
      .populate("user", "name email phone")
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



// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummy_secret")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is authentic
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "Success",
        },
        { new: true }
      );

      if (payment) {
        const booking = await Booking.findByIdAndUpdate(payment.booking, {
          status: "Confirmed",
          paymentId: razorpay_payment_id,
          depositStatus: "Paid"
        }, { new: true });

        // Send Emails
        if (booking) {
           const renter = await User.findById(booking.renter);
           const owner = await User.findById(booking.owner);
           let item = null;
           let itemName = "Item";
           if (booking.tool) {
             item = await Tool.findByIdAndUpdate(booking.tool, { isAvailable: false }, { new: true });
             itemName = item ? item.name : "Tool";
           } else if (booking.skill) {
             item = await Skill.findById(booking.skill);
             itemName = item ? item.name : "Skill";
           }

           if (renter && owner) {
             const startDateStr = new Date(booking.startDate).toDateString();
             const endDateStr = new Date(booking.endDate).toDateString();

             // To Renter
             await sendEmail({
               email: renter.email,
               subject: `Booking Confirmed: ${itemName}`,
               message: `Hi ${renter.name},\n\nYour payment of ₹${payment.amount} was successful. Your booking for ${itemName} is now Confirmed.\n\nBooking Dates: ${startDateStr} to ${endDateStr}\n\nThanks,\nNeighbor-hood SkillTool Exchange`
             }).catch(err => console.error("Email to renter failed", err));

             // To Owner
             await sendEmail({
               email: owner.email,
               subject: `New Booking: ${itemName}`,
               message: `Hi ${owner.name},\n\nYou have a new confirmed booking from ${renter.name} for your ${itemName}. They have successfully paid ₹${payment.amount}.\n\nBooking Dates: ${startDateStr} to ${endDateStr}\n\nThanks,\nNeighbor-hood SkillTool Exchange`
             }).catch(err => console.error("Email to owner failed", err));
           }
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature sent!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPaymentHistory,
  verifyPayment,
  getRazorpayKey,
};