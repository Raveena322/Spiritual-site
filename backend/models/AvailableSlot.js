const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  guruId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fromDate: {
    type: Date,
    required: [true, 'Please provide a from date'],
  },
  toDate: {
    type: Date,
    required: [true, 'Please provide a to date'],
    validate: {
      validator: function (value) {
        return value > this.fromDate;
      },
      message: 'To date must be after from date',
    },
  },
  state: {
    type: String,
    required: [true, 'Please provide a state'],
    trim: true,
    minlength: [1, 'State cannot be empty'],
  },
  district: {
    type: String,
    required: [true, 'Please provide a district'],
    trim: true,
    minlength: [1, 'District cannot be empty'],
  },
  city: {
    type: String,
    trim: true,
  },
  fullAddress: {
    type: String,
    trim: true,
  },
  mapsLink: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    required: false, // Keep for backward compatibility
  },
  availableGranths: {
    type: [String],
    required: [true, 'Please provide at least one granth'],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: 'At least one granth must be selected',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AvailableSlot', availableSlotSchema);

