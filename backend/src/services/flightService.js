const Flight = require('../models/Flight');

const createFlight = async (data) => {
  const existing = await Flight.findOne({ flightNumber: data.flightNumber });
  if (existing) {
    const error = new Error('Flight number already exists');
    error.statusCode = 400;
    throw error;
  }
  const flight = await Flight.create(data);
  return flight;
};

const getAllFlights = async () => {
  return await Flight.find().sort({ date: 1 });
};

const getFlightById = async (id) => {
  const flight = await Flight.findById(id);
  if (!flight) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
  return flight;
};

const updateFlight = async (id, data) => {
  const flight = await Flight.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!flight) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
  return flight;
};

const deleteFlight = async (id) => {
  const flight = await Flight.findByIdAndDelete(id);
  if (!flight) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
  return flight;
};

const searchFlights = async ({ from, to, date }) => {
  const filter = {};

  if (from) {
    filter.from = { $regex: from, $options: 'i' };
  }

  if (to) {
    filter.to = { $regex: to, $options: 'i' };
  }

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const flights = await Flight.find(filter).sort({ date: 1 });

  if (flights.length === 0) {
    const error = new Error('No flights found matching your search');
    error.statusCode = 404;
    throw error;
  }

  return flights;
};

module.exports = {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
};