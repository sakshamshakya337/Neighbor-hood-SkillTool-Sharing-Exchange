const User = require("../models/User");
const Tool = require("../models/Tool");
const mongoose = require("mongoose");

// POST /wishlist
// Toggles a tool in the user's wishlist
const toggleWishlist = async (req, res) => {
  const { toolId } = req.body;

  try {
    if (!toolId || !mongoose.Types.ObjectId.isValid(toolId)) {
      return res.status(400).json({ message: "Valid toolId is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    const isWishlisted = user.wishlist.some(id => id.toString() === toolId.toString());

    if (isWishlisted) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== toolId);
      await user.save();
      res.json({ message: "Removed from wishlist", action: "removed", wishlist: user.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(toolId);
      await user.save();
      res.json({ message: "Added to wishlist", action: "added", wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { toggleWishlist };
