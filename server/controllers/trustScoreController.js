const User = require("../models/User");
const mongoose = require("mongoose");

// GET /trust-score
// Gets the trust score for the current user
const getTrustScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("trustScore totalReviews name");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /rating
// Global rating statistics or specific tool/user rating
const getRating = async (req, res) => {
  try {
    // If a userId is provided in query, get their rating, else current user
    const userId = req.query.userId || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(userId).select("trustScore totalReviews name");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTrustScore, getRating };
