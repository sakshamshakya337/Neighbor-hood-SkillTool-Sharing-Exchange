const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      isNeighborhoodVerified: user.isNeighborhoodVerified,
      address: user.address,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    // Note: Do not allow email updates here directly without re-verification logic

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
      isNeighborhoodVerified: updatedUser.isNeighborhoodVerified,
      address: updatedUser.address,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get user address
// @route   GET /api/users/address
// @access  Private
const getUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user.address || {});
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user address
// @route   PUT /api/users/address
// @access  Private
const updateUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.address = {
      street: req.body.street || user.address?.street,
      city: req.body.city || user.address?.city,
      state: req.body.state || user.address?.state,
      pincode: req.body.pincode || user.address?.pincode,
      lat: req.body.lat || user.address?.lat,
      lng: req.body.lng || user.address?.lng,
    };
    
    // Reset neighborhood verification if address changes
    user.isNeighborhoodVerified = false;

    const updatedUser = await user.save();

    res.json(updatedUser.address);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserAddress,
  updateUserAddress,
};
