const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { toggleWishlist } = require("../controllers/wishlistController");

const router = express.Router();

router.route("/").post(protect, toggleWishlist);

module.exports = router;
