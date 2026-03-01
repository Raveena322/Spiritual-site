const AvailableSlot = require('../models/AvailableSlot');
const Booking = require('../models/Booking');

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private (Guru only)
exports.createSlot = async (req, res) => {
  try {
    console.log('\n\n🔴🔴🔴 === STARTING SLOT CREATION === 🔴🔴🔴\n');
    console.log('=== IMMEDIATE req.body CHECK ===');
    console.log('req.body:', req.body);
    console.log('req.body keys:', Object.keys(req.body));
    console.log('req.body.state:', req.body.state);
    console.log('req.body.district:', req.body.district);
    
    console.log('=== SLOT CREATION REQUEST ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request body keys:', Object.keys(req.body));
    console.log('State value:', req.body.state, 'Type:', typeof req.body.state);
    console.log('District value:', req.body.district, 'Type:', typeof req.body.district);
    
    // Extract directly from req.body to avoid destructuring issues
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const state = req.body.state;
    const district = req.body.district;
    const city = req.body.city;
    const fullAddress = req.body.fullAddress;
    const mapsLink = req.body.mapsLink;
    const location = req.body.location;
    const availableGranths = req.body.availableGranths;
    
    console.log('Extracted values:', {
      fromDate,
      toDate,
      state,
      district,
      location,
      availableGranths,
    });

    // Validate user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Validate required fields with better error messages
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both from date and to date',
      });
    }

    // Check if state and district are actually present (not empty strings)
    // Handle both string and non-string types
    const stateStr = (state && typeof state === 'string') ? state.trim() : String(state || '').trim();
    const districtStr = (district && typeof district === 'string') ? district.trim() : String(district || '').trim();
    
    console.log('=== VALIDATION CHECK ===');
    console.log('State string:', stateStr, 'Length:', stateStr.length);
    console.log('District string:', districtStr, 'Length:', districtStr.length);
    
    if (!stateStr || stateStr === '' || stateStr.length === 0) {
      console.error('VALIDATION FAILED: State is missing or empty');
      return res.status(400).json({
        success: false,
        message: 'Please provide a state. Received: ' + JSON.stringify(state),
      });
    }

    if (!districtStr || districtStr === '' || districtStr.length === 0) {
      console.error('VALIDATION FAILED: District is missing or empty');
      return res.status(400).json({
        success: false,
        message: 'Please provide a district. Received: ' + JSON.stringify(district),
      });
    }

    if (!availableGranths || availableGranths.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one available granth',
      });
    }

    // Use the validated strings
    const processedState = stateStr;
    const processedDistrict = districtStr;
    
    console.log('=== CREATING SLOT ===');
    console.log('Processed state:', processedState);
    console.log('Processed district:', processedDistrict);
    console.log('Guru ID:', req.user._id);
    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);
    console.log('Available Granths:', availableGranths);

    // Prepare slot data - ensure all fields are properly formatted
    const slotData = {
      guruId: req.user._id,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      state: processedState,
      district: processedDistrict,
      city: city ? String(city).trim() : undefined,
      fullAddress: fullAddress ? String(fullAddress).trim() : undefined,
      mapsLink: mapsLink ? String(mapsLink).trim() : undefined,
      location: location || fullAddress || `${processedDistrict}, ${processedState}`,
      availableGranths: Array.isArray(availableGranths) ? availableGranths : [availableGranths],
    };

    console.log('=== FINAL SLOT DATA ===');
    console.log(JSON.stringify(slotData, null, 2));
    console.log('State in slotData:', slotData.state);
    console.log('District in slotData:', slotData.district);

    // STEP 6: AGGRESSIVE safety check - ensure state and district are valid strings
    console.log('=== PRE-CREATE SAFETY CHECK ===');
    console.log('slotData.state:', slotData.state, 'Type:', typeof slotData.state, 'Truthy:', !!slotData.state);
    console.log('slotData.district:', slotData.district, 'Type:', typeof slotData.district, 'Truthy:', !!slotData.district);
    console.log('slotData.state length:', slotData.state ? slotData.state.length : 'N/A');
    console.log('slotData.district length:', slotData.district ? slotData.district.length : 'N/A');
    
    if (!slotData.state || typeof slotData.state !== 'string' || slotData.state.length === 0) {
      console.error('STOPPING: State is not valid', slotData.state);
      return res.status(400).json({
        success: false,
        message: `State must be a non-empty string. Received: ${JSON.stringify(slotData.state)}`,
      });
    }

    if (!slotData.district || typeof slotData.district !== 'string' || slotData.district.length === 0) {
      console.error('STOPPING: District is not valid', slotData.district);
      return res.status(400).json({
        success: false,
        message: `District must be a non-empty string. Received: ${JSON.stringify(slotData.district)}`,
      });
    }

    console.log('=== CREATING MONGOOSE DOCUMENT ===');
    console.log('About to call AvailableSlot.create() with:', slotData);
    
    const slot = await AvailableSlot.create(slotData);
    
    console.log('=== SLOT CREATED SUCCESSFULLY ===');
    console.log('Created slot ID:', slot._id);

    res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    console.error('Slot creation error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating slot',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get all active slots
// @route   GET /api/slots
// @access  Public
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await AvailableSlot.find({ isActive: true })
      .populate('guruId', 'name email')
      .sort({ fromDate: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get guru's slots
// @route   GET /api/slots/my-slots
// @access  Private (Guru only)
exports.getMySlots = async (req, res) => {
  try {
    const slots = await AvailableSlot.find({ guruId: req.user._id }).sort({
      fromDate: 1,
    });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update slot
// @route   PUT /api/slots/:id
// @access  Private (Guru only)
exports.updateSlot = async (req, res) => {
  try {
    let slot = await AvailableSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    // Make sure user is slot owner
    if (slot.guruId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this slot',
      });
    }

    slot = await AvailableSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get booked date ranges for a slot (for calendar - public)
// @route   GET /api/slots/:id/booked-dates
// @access  Public
exports.getBookedDates = async (req, res) => {
  try {
    const slot = await AvailableSlot.findById(req.params.id);
    if (!slot || !slot.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found or not available',
      });
    }
    const bookings = await Booking.find({
      slotId: slot._id,
      status: 'Approved',
    }).select('fromDate toDate');
    const bookedRanges = bookings.map((b) => ({
      fromDate: b.fromDate,
      toDate: b.toDate,
    }));
    res.status(200).json({
      success: true,
      data: bookedRanges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private (Guru only)
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await AvailableSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    // Make sure user is slot owner
    if (slot.guruId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this slot',
      });
    }

    await slot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

