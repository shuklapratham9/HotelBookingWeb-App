const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
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
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Email format is invalid"],
  },
  currentlyBookedRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room", 
    default: null, 
  },
  currentHotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    default: null, 
  },
  bookingDates: {
    from: {
      type: Date, 
      default:null,
    },
    to: {
      type: Date, 
      default:null
    }
  }
});


const user = mongoose.model('user', userSchema);

module.exports = user;
