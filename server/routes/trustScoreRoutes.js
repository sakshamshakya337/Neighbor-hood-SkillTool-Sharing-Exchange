const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getTrustScore, getRating } = require("../controllers/trustScoreController");

const router = express.Router();

// The instructions mentioned GET /trust-score and GET /rating
router.route("/trust-score").get(protect, getTrustScore);
router.route("/rating").get(protect, getRating);

module.exports = router;
