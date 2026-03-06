const express = require('express');
const router = express.Router();
const {
  addFlight,
  getFlights,
  getFlight,
  editFlight,
  removeFlight,
  searchFlightsByFilter,
} = require('../controllers/flightController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/search', searchFlightsByFilter);
router.post('/', protect, addFlight);
router.get('/', getFlights);
router.get('/:id', getFlight);
router.put('/:id', protect, editFlight);
router.delete('/:id', protect, removeFlight);

module.exports = router;