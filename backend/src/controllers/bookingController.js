const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require('../services/bookingService');

const bookFlight = async (req, res, next) => {
  try {
    const { flightId, numberOfSeats } = req.body;
    const booking = await createBooking(req.user._id, {
      flightId,
      numberOfSeats,
    });

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user._id);
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await cancelBooking(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Booking canceled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookFlight, getMyBookings, cancelMyBooking };