const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Flight number is required'],
      unique: true,
      trim: true,
    },
    from: {
      type: String,
      required: [true, 'Departure city is required'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Arrival city is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Flight date is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);