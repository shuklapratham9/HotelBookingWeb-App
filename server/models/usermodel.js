const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"], // Validation: Required
    trim: true, // Trim whitespace
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"], 
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"], 
    default: "Other", 
  },
  email: {
    type: String,
    required: [true, "Email is required"], // Validation: Required
    unique: true, // Ensure email uniqueness
    trim: true, // Trim whitespace
    match: [/\S+@\S+\.\S+/, "Email format is invalid"], // Validation: Email format
  },
  currentlyBookedRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room", // Reference to the Room model
    default: null, // Default to null when no room is booked
  },
  currentHotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", // Reference to the Hotel model
    default: null, // Default to null when no hotel is associated
  },
  bookingDates: {
    from: {
      type: Date, // Date when the booking starts
      required: true, // Ensure this field is required
    },
    to: {
      type: Date, // Date when the booking ends
      required: true, // Ensure this field is required
    }
  }
});

// Create the user model
const user = mongoose.model('user', userSchema);

module.exports = user;
