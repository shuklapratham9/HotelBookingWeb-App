const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rooms: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [] 
  },
  costPerRoom: {
    type: Number,
    required: true,
    min: 0 
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
