const Review = require("../models/Review");
const Tool = require("../models/Tool");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// POST /review
const addReview = async (req, res) => {
  const { toolId, rating, comment } = req.body;

  try {
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
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
      rating: Number(rating),
      comment,
    });

    // Update user's trust score
    const userReviews = await Review.find({ reviewedUser: tool.owner });
    const totalReviews = userReviews.length;
    const avgRating =
      userReviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    await User.findByIdAndUpdate(tool.owner, {
      trustScore: avgRating,
      totalReviews,
    });
    
    // Create notification for the tool owner
    if (tool.owner.toString() !== req.user._id.toString()) {
      await createNotification(
        tool.owner,
        req.user._id,
        "review",
        `Someone left a ${rating}-star review on your tool "${tool.name}".`,
        review._id
      );
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /review/:toolId
const getToolReviews = async (req, res) => {
  try {
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
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update user's trust score
    const userReviews = await Review.find({ reviewedUser: review.reviewedUser });
    const totalReviews = userReviews.length;
    const avgRating =
      userReviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    await User.findByIdAndUpdate(review.reviewedUser, {
      trustScore: avgRating,
      totalReviews,
    });

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /review/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const reviewedUserId = review.reviewedUser;
    
    await Review.findByIdAndDelete(req.params.id);

    // Update user's trust score
    const userReviews = await Review.find({ reviewedUser: reviewedUserId });
    const totalReviews = userReviews.length;
    const avgRating = totalReviews > 0 ?
      userReviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews : 0;

    await User.findByIdAndUpdate(reviewedUserId, {
      trustScore: avgRating,
      totalReviews,
    });

    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addReview, getToolReviews, updateReview, deleteReview };
