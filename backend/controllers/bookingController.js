const Booking = require('../models/Booking');
const AvailableSlot = require('../models/AvailableSlot');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Devotee)
exports.createBooking = async (req, res) => {
  try {
    const { slotId, selectedGranth, fromDate, toDate, state, district, location, message } =
      req.body;

    // Verify slot exists and is active
    const slot = await AvailableSlot.findById(slotId);
    if (!slot || !slot.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found or not available',
      });
    }

    // Verify selected granth is available
    if (!slot.availableGranths.includes(selectedGranth)) {
      return res.status(400).json({
        success: false,
        message: 'Selected granth is not available for this slot',
      });
    }

    // Verify dates are within slot range
    if (
      new Date(fromDate) < new Date(slot.fromDate) ||
      new Date(toDate) > new Date(slot.toDate)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Selected dates must be within slot date range',
      });
    }

    // Verify location matches slot location (if state/district provided)
    if (slot.state && slot.district) {
      if (state !== slot.state || district !== slot.district) {
        return res.status(400).json({
          success: false,
          message: 'Selected location must match slot location',
        });
      }
    }

    const booking = await Booking.create({
      devoteeId: req.user._id,
      slotId,
      selectedGranth,
      fromDate,
      toDate,
      state: state || slot.state,
      district: district || slot.district,
      location: location || (slot.state && slot.district ? `${slot.district}, ${slot.state}` : location),
      message,
    });

    // Populate slot and devotee info
    await booking.populate('slotId', 'fromDate toDate location availableGranths');
    await booking.populate('devoteeId', 'name email');

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === 'guru') {
      // Guru sees bookings for their slots
      const slots = await AvailableSlot.find({ guruId: req.user._id });
      const slotIds = slots.map((slot) => slot._id);
      bookings = await Booking.find({ slotId: { $in: slotIds } })
        .populate('devoteeId', 'name email')
        .populate('slotId', 'fromDate toDate state district location')
        .sort({ createdAt: -1 });
    } else {
      // Devotee sees their own bookings
      bookings = await Booking.find({ devoteeId: req.user._id })
        .populate('slotId', 'fromDate toDate state district location availableGranths')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending bookings (Guru only)
// @route   GET /api/bookings/pending
// @access  Private (Guru only)
exports.getPendingBookings = async (req, res) => {
  try {
    const slots = await AvailableSlot.find({ guruId: req.user._id });
    const slotIds = slots.map((slot) => slot._id);

    const bookings = await Booking.find({
      slotId: { $in: slotIds },
      status: 'Pending',
    })
      .populate('devoteeId', 'name email')
      .populate('slotId', 'fromDate toDate state district location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Guru only)
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify slot belongs to guru
    const slot = await AvailableSlot.findById(booking.slotId);
    if (slot.guruId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this booking',
      });
    }

    booking.status = 'Approved';
    await booking.save();

    await booking.populate('devoteeId', 'name email');
    await booking.populate('slotId', 'fromDate toDate location');

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Guru only)
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify slot belongs to guru
    const slot = await AvailableSlot.findById(booking.slotId);
    if (slot.guruId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this booking',
      });
    }

    booking.status = 'Rejected';
    await booking.save();

    await booking.populate('devoteeId', 'name email');
    await booking.populate('slotId', 'fromDate toDate location');

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

