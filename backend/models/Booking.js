const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  devoteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvailableSlot',
    required: true,
  },
  selectedGranth: {
    type: String,
    required: [true, 'Please select a granth'],
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.fromDate;
      },
      message: 'To date must be after from date',
    },
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false, // Keep for backward compatibility
  },
  fullAddress: { type: String, trim: true },
  city: { type: String, trim: true },
  mapsLink: { type: String, trim: true },
  purposeOfKatha: { type: String, trim: true },
  specialRequests: { type: String, trim: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  message: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

