const Booking = require("../models/Booking");
const Tool = require("../models/Tool");

// POST /api/booking
exports.createBooking = async (req, res) => {
  try {
    const { toolId, startDate, endDate, totalPrice } = req.body;
    const tool = await Tool.findById(toolId);
    
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    // Assuming basic logic here, a robust system would check for date overlaps
    const booking = new Booking({
      tool: toolId,
      renter: req.user._id,
      owner: tool.owner,
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
    }).populate("tool", "name");
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
    const { toolId } = req.query;
    // Find upcoming confirmed/active bookings to mark dates as unavailable
    const bookings = await Booking.find({ 
        tool: toolId,
        status: { $in: ["Confirmed", "Active", "Pending"] },
        endDate: { $gte: new Date() }
    }).select("startDate endDate");
    
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
    
    res.json({ message: "Deposit processed successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/rental-history
exports.getRentalHistory = async (req, res) => {
  try {
    const rentals = await Booking.find({ renter: req.user._id }).populate("tool");
    const givenOut = await Booking.find({ owner: req.user._id }).populate("tool");
    
    res.json({
        rentedByMe: rentals,
        rentedToOthers: givenOut
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
