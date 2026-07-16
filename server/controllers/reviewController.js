const Review = require("../models/Review");
const Tool = require("../models/Tool");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const mongoose = require("mongoose");

const parseRating = (rating) => {
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return null;
  }
  return numericRating;
};

const updateTrustScore = async (userId) => {
  const userReviews = await Review.find({ reviewedUser: userId });
  const totalReviews = userReviews.length;
  const trustScore =
    totalReviews > 0
      ? userReviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews
      : 0;

  await User.findByIdAndUpdate(userId, {
    trustScore,
    totalReviews,
  });
};

// POST /review
const addReview = async (req, res) => {
  const { toolId, rating, comment } = req.body;

  try {
    if (!toolId || !mongoose.Types.ObjectId.isValid(toolId)) {
      return res.status(400).json({ message: "Valid toolId is required" });
    }

    const numericRating = parseRating(rating);
    if (!numericRating) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const trimmedComment = typeof comment === "string" ? comment.trim() : "";
    if (!trimmedComment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    if (tool.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot review your own tool" });
    }

    // Check if user already reviewed this tool
    const alreadyReviewed = await Review.findOne({
      tool: toolId,
      reviewer: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Tool already reviewed" });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: tool.owner,
      tool: toolId,
      rating: numericRating,
      comment: trimmedComment,
    });

    await updateTrustScore(tool.owner);
    
    // Create notification for the tool owner
    await createNotification(
      tool.owner,
      req.user._id,
      "review",
      `Someone left a ${numericRating}-star review on your tool "${tool.name}".`,
      review._id
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /review/:toolId
const getToolReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.toolId)) {
      return res.status(400).json({ message: "Invalid tool id" });
    }

    const reviews = await Review.find({ tool: req.params.toolId }).populate(
      "reviewer",
      "name"
    );
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /review/:id
const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (rating !== undefined) {
      const numericRating = parseRating(rating);
      if (!numericRating) {
        return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
      }
      review.rating = numericRating;
    }

    if (comment !== undefined) {
      const trimmedComment = typeof comment === "string" ? comment.trim() : "";
      if (!trimmedComment) {
        return res.status(400).json({ message: "Comment is required" });
      }
      review.comment = trimmedComment;
    }

    await review.save();

    await updateTrustScore(review.reviewedUser);

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /review/:id
const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const reviewedUserId = review.reviewedUser;
    
    await Review.findByIdAndDelete(req.params.id);

    await updateTrustScore(reviewedUserId);

    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addReview, getToolReviews, updateReview, deleteReview };
