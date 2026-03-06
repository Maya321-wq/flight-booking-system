const express = require('express');
const router = express.Router();
const {
  bookFlight,
  getMyBookings,
  cancelMyBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, bookFlight);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelMyBooking);

module.exports = router;