const Booking = require("../models/Booking");
const Tool = require("../models/Tool");
const Skill = require("../models/Skill");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// POST /api/booking
exports.createBooking = async (req, res) => {
  try {
    const { toolId, skillId, startDate, endDate, totalPrice } = req.body;
    
    let item = null;
    let type = null;
    if (toolId) {
      item = await Tool.findById(toolId);
      type = "tool";
    } else if (skillId) {
      item = await Skill.findById(skillId);
      type = "skill";
    }
    
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Assuming basic logic here, a robust system would check for date overlaps
    const booking = new Booking({
      [type]: item._id,
      renter: req.user._id,
      owner: item.provider || item.owner, // Skills use provider, Tools use owner
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/booking (Get bookings where user is either renter or owner)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ renter: req.user._id }, { owner: req.user._id }]
    }).populate("tool", "name").populate("skill", "title");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/booking/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("tool")
      .populate("skill")
      .populate("renter", "name email")
      .populate("owner", "name email");
      
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    // Ensure only involved parties can view
    if (booking.renter._id.toString() !== req.user._id.toString() && booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/booking/:id
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner should approve/update status usually
    if (booking.owner.toString() !== req.user._id.toString() && booking.renter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/booking/:id
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renter.toString() !== req.user._id.toString() && booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cancel-booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    if (booking.renter.toString() !== req.user._id.toString() && booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "Cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/availability
exports.getAvailability = async (req, res) => {
  try {
    const { toolId, skillId } = req.query;
    let query = {
        status: { $in: ["Confirmed", "Active", "Pending"] },
        endDate: { $gte: new Date() }
    };
    if (toolId) query.tool = toolId;
    if (skillId) query.skill = skillId;
    
    // Find upcoming confirmed/active bookings to mark dates as unavailable
    const bookings = await Booking.find(query).select("startDate endDate");
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/deposit
exports.processDeposit = async (req, res) => {
  try {
    const { bookingId, paymentDetails } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    // Simulate payment processing
    booking.depositStatus = "Paid";
    booking.status = "Confirmed";
    // booking.paymentId = paymentDetails.id; 
    await booking.save();

    if (booking.tool) {
      await Tool.findByIdAndUpdate(booking.tool, { isAvailable: false });
    }
    
    res.json({ message: "Deposit processed successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/rental-history
exports.getRentalHistory = async (req, res) => {
  try {
    const rentals = await Booking.find({ renter: req.user._id })
      .populate("tool")
      .populate("skill")
      .populate("owner", "name email");
    const givenOut = await Booking.find({ owner: req.user._id })
      .populate("tool")
      .populate("skill")
      .populate("renter", "name email phone reportsCount isBlocked");
    
    res.json({
        rentedByMe: rentals,
        rentedToOthers: givenOut
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/booking/:id/remind
exports.sendReminderEmail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("renter")
      .populate("owner")
      .populate("tool");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner or admin can send reminder
    if (booking.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const itemName = booking.tool ? booking.tool.name : "Item";

    await sendEmail({
      email: booking.renter.email,
      subject: `Reminder: Please return ${itemName}`,
      message: `Hi ${booking.renter.name},\n\nThis is a gentle reminder from ${booking.owner.name} to return the ${itemName} you booked. The booking end date was ${new Date(booking.endDate).toDateString()}.\n\nThanks,\nNeighbor-hood SkillTool Exchange`
    });

    res.json({ message: "Reminder email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/booking/:id/not-returned
exports.markNotReturned = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("renter")
      .populate("owner")
      .populate("tool");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Calculate late fees (e.g., standard daily rate or a fixed amount per day)
    // For simplicity, we add 1 day of the total price (or a fixed penalty)
    // Let's add 1 day's worth of rental fee (assuming price is per day, or total / days)
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days < 1) days = 1;
    const dailyRate = booking.totalPrice / days;

    booking.returnStatus = "Not Returned";
    booking.lateFees += Math.round(dailyRate); 
    await booking.save();

    const itemName = booking.tool ? booking.tool.name : "Item";

    await sendEmail({
      email: booking.renter.email,
      subject: `Late Return Notice: ${itemName}`,
      message: `Hi ${booking.renter.name},\n\nThe item ${itemName} has been marked as Not Returned by ${booking.owner.name}. A late fee of ₹${Math.round(dailyRate)} has been added to your account.\n\nPlease return the item and clear your dues immediately.\n\nThanks,\nNeighbor-hood SkillTool Exchange`
    });

    res.json({ message: "Marked as not returned and late fee applied", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/booking/:id/report
exports.reportRenter = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const renter = await User.findById(booking.renter);
    if (!renter) return res.status(404).json({ message: "Renter not found" });

    renter.reportsCount += 1;
    
    // Block user if reported 3 or more times
    if (renter.reportsCount >= 3) {
      renter.isBlocked = true;
    }
    
    await renter.save();

    res.json({ message: `Renter reported. Total reports: ${renter.reportsCount}`, isBlocked: renter.isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/booking/:id/pay-late-fee
exports.payLateFees = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Since this requires Razorpay in real life, we assume the frontend handled payment 
    // and this endpoint acts as confirmation, similar to processDeposit.
    booking.lateFees = 0;
    booking.returnStatus = "Returned";
    
    await booking.save();
    res.json({ message: "Late fees paid and item marked returned", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
