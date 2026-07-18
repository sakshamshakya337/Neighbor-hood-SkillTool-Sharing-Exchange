const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    depositStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Forfeited"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Active", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentId: {
      type: String, // ID from payment gateway (if applicable)
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
