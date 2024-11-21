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
    default: [] // An array of ObjectIds, default is empty
  },
  costPerRoom: {
    type: Number,
    required: true, // Ensure this field is required
    min: 0 // Cost should not be negative
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
