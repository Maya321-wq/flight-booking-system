const {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
} = require('../services/flightService');

const addFlight = async (req, res, next) => {
  try {
    const flight = await createFlight(req.body);
    res.status(201).json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};

const getFlights = async (req, res, next) => {
  try {
    const flights = await getAllFlights();
    res.status(200).json({ success: true, count: flights.length, flights });
  } catch (error) {
    next(error);
  }
};

const getFlight = async (req, res, next) => {
  try {
    const flight = await getFlightById(req.params.id);
    res.status(200).json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};

const editFlight = async (req, res, next) => {
  try {
    const flight = await updateFlight(req.params.id, req.body);
    res.status(200).json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};

const removeFlight = async (req, res, next) => {
  try {
    await deleteFlight(req.params.id);
    res.status(200).json({ success: true, message: 'Flight deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const searchFlightsByFilter = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    const flights = await searchFlights({ from, to, date });
    res.status(200).json({ success: true, count: flights.length, flights });
  } catch (error) {
    next(error);
  }
};

module.exports = { addFlight, getFlights, getFlight, editFlight, removeFlight, searchFlightsByFilter };