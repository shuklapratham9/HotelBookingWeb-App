const User = require('../models/usermodel');
const Room = require('../models/roommodel');
const mailer = require('../middlewares/emailservice')

exports.bookRoom = async (req, res) => {
  const { hotelId, roomId, from, to, email } = req.body;

  try {
    
    if (!hotelId || !roomId || !from || !to || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //find room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    //update user booking details
    user.bookingDates = { from: new Date(from), to: new Date(to) };
    user.currentHotel = hotelId;
    user.currentlyBookedRoom = roomId;
    await user.save();

    //update room booking details
    room.bookingDates = { from: new Date(from), to: new Date(to) };
    room.currentlyOccupied = user._id;
    await room.save();
    await mailer(email,createBookingConfirmationMessage({ message:"Room successfully booked", user, room }))
    res.status(200).json({ message:"Room successfully booked", user, room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const createBookingConfirmationMessage = (data) => {
    const { message, user, room } = data;

    const { name, email, bookingDates } = user;
    const { from, to } = bookingDates;
    const { numberofBed } = room;

    //text message
    let textMessage = `${message}\n\n`;
    textMessage += `Hello ${name},\n\n`;
    textMessage += `Your room has been successfully booked at the hotel. Below are the details:\n\n`;
    textMessage += `Booking Dates: From ${new Date(from).toLocaleDateString()} To ${new Date(to).toLocaleDateString()}\n`;
    textMessage += `Room Details:\n`;
    textMessage += `- Number of Beds: ${numberofBed}\n\n`;
    textMessage += `We hope you have a pleasant stay!\n\n`;
    textMessage += `Best regards,\nHotel Team`;

    return textMessage;
};

