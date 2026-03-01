const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getPendingBookings,
  getBookingById,
  getGuruStats,
  approveBooking,
  rejectBooking,
} = require('../controllers/bookingController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes are protected
router.use(protect);

// Devotee routes
router.post('/', roleCheck('devotee'), createBooking);
router.get('/', getMyBookings);

// Guru routes (stats before :id)
router.get('/stats', roleCheck('guru'), getGuruStats);
router.get('/pending', roleCheck('guru'), getPendingBookings);
router.get('/:id', getBookingById);
router.put('/:id/approve', roleCheck('guru'), approveBooking);
router.put('/:id/reject', roleCheck('guru'), rejectBooking);

module.exports = router;

