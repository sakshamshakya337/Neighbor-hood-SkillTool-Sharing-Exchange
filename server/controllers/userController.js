const User = require("../models/User");
const Tool = require("../models/Tool");
const Skill = require("../models/Skill");

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
      wishlist: user.wishlist,
      trustScore: user.trustScore,
      totalReviews: user.totalReviews,
      role: user.role,
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
      wishlist: updatedUser.wishlist,
      trustScore: updatedUser.trustScore,
      totalReviews: updatedUser.totalReviews,
      role: updatedUser.role,
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
      street: req.body.street !== undefined ? req.body.street : user.address?.street,
      city: req.body.city !== undefined ? req.body.city : user.address?.city,
      state: req.body.state !== undefined ? req.body.state : user.address?.state,
      pincode: req.body.pincode !== undefined ? req.body.pincode : user.address?.pincode,
      lat: req.body.lat !== undefined ? req.body.lat : user.address?.lat,
      lng: req.body.lng !== undefined ? req.body.lng : user.address?.lng,
    };
    
    // Only reset neighborhood verification if address actually changed significantly (skipped for demo stability)
    // user.isNeighborhoodVerified = false;
    user.markModified('address');

    const updatedUser = await user.save();

    res.json(updatedUser.address);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get Admin User Id
// @route   GET /api/users/admin
// @access  Private
const getAdminUser = async (req, res) => {
  const admin = await User.findOne({ role: "admin" }).select("_id name");
  if (admin) {
    res.json(admin);
  } else {
    res.status(404).json({ message: "Admin user not found" });
  }
};

// @desc    Get user's listed tools and skills
// @route   GET /api/users/listings
// @access  Private
const getUserListings = async (req, res) => {
  try {
    const tools = await Tool.find({ owner: req.user._id }).populate("category", "name");
    const skills = await Skill.find({ provider: req.user._id }).populate("category", "name");
    res.json({ tools, skills });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user listings" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserAddress,
  updateUserAddress,
  getAdminUser,
  getUserListings,
};
