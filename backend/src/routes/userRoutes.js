const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserAddress,
  updateUserAddress,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/address").get(protect, getUserAddress).put(protect, updateUserAddress);

module.exports = router;
