const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  currentlyOccupied: {
    type: mongoose.Schema.Types.ObjectId,
    default: null, 
    ref: 'Customer'
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Hotel' 
  },
  numberofBed: {
    type: Number,
    required: true, 
    min: 1 
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
