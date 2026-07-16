const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addReview,
  getToolReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.route("/").post(protect, addReview);
router.route("/:toolId").get(getToolReviews);
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
