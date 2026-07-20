const express = require("express");
const {
  getDashboard,
  getUsers,
  blockUser,
  deleteUser,
  getTools,
  getAllBookings,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect, admin);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/tools", getTools);
router.put("/block-user", blockUser);
router.delete("/delete-user", deleteUser);
router.get("/bookings", getAllBookings);

module.exports = router;