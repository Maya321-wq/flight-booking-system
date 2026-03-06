const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: [true, 'Flight ID is required'],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    numberOfSeats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Must book at least 1 seat'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'canceled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);