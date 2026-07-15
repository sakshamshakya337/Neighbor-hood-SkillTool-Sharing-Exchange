const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
  getAvailability,
  processDeposit,
  getRentalHistory,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/booking", protect, createBooking);
router.get("/booking", protect, getBookings);
router.get("/booking/:id", protect, getBookingById);
router.put("/booking/:id", protect, updateBooking);
router.delete("/booking/:id", protect, deleteBooking);

router.post("/cancel-booking", protect, cancelBooking);
router.get("/availability", getAvailability); // Public (or protect if required)
router.post("/deposit", protect, processDeposit);
router.get("/rental-history", protect, getRentalHistory);

module.exports = router;
