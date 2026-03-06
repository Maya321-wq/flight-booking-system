const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const createBooking = async (userId, { flightId, numberOfSeats }) => {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }

  if (flight.availableSeats < numberOfSeats) {
    const error = new Error(
      `Not enough seats available. Only ${flight.availableSeats} seats left.`
    );
    error.statusCode = 400;
    throw error;
  }

  flight.availableSeats -= numberOfSeats;
  await flight.save();

  const totalPrice = flight.price * numberOfSeats;

  const booking = await Booking.create({
    userId,
    flightId,
    numberOfSeats,
    totalPrice,
    status: 'confirmed',
  });

  return booking;
};

const getUserBookings = async (userId) => {
  const bookings = await Booking.find({ userId })
    .populate('flightId', 'flightNumber from to date price')
    .sort({ createdAt: -1 });
  return bookings;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.userId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to cancel this booking');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === 'canceled') {
    const error = new Error('Booking is already canceled');
    error.statusCode = 400;
    throw error;
  }

  const flight = await Flight.findById(booking.flightId);
  if (flight) {
    flight.availableSeats += booking.numberOfSeats;
    await flight.save();
  }

  booking.status = 'canceled';
  await booking.save();

  return booking;
};

module.exports = { createBooking, getUserBookings, cancelBooking };