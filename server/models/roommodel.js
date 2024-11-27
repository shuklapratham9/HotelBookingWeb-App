const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  currentlyOccupied: {
    type: mongoose.Schema.Types.ObjectId,
    default: null, // Default is none (null)p
    ref: 'Customer' // Reference to the Customer collection
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // This field is required
    ref: 'Hotel' // Reference to the Hotel collection
  },
  numberofBed: {
    type: Number,
    required: true, // Number of beds is mandatory
    min: 1 // At least one bed should exist
  },
  bookingDates: {
    from: {
      type: Date, 
      required: true, 
    },
    to: {
      type: Date, 
      required: true,
    }
  }
});

module.exports = mongoose.model('Room', roomSchema);
