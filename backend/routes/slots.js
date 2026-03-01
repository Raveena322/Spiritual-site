const express = require('express');
const router = express.Router();
const {
  createSlot,
  getAllSlots,
  getMySlots,
  getBookedDates,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', getAllSlots);
router.get('/:id/booked-dates', getBookedDates);

// Add logging middleware
router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('\n🟢 === SLOT ROUTE MIDDLEWARE (POST) === 🟢');
    console.log('URL:', req.url);
    console.log('req.body:', req.body);
    console.log('req.body.state:', req.body?.state);
    console.log('req.body.district:', req.body?.district);
  }
  next();
});

// Protected routes (Guru only)
router.use(protect, roleCheck('guru'));
router.post('/', createSlot);
router.get('/my-slots', getMySlots);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

module.exports = router;

