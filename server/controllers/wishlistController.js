const User = require("../models/User");
const Tool = require("../models/Tool");

// POST /wishlist
// Toggles a tool in the user's wishlist
const toggleWishlist = async (req, res) => {
  const { toolId } = req.body;

  try {
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
      res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(toolId);
      await user.save();
      res.json({ message: "Added to wishlist", wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { toggleWishlist };
