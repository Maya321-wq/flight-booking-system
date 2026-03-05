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

module.exports = {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
};