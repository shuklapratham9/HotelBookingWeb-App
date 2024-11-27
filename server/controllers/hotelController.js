const Hotel = require('../models/hotelmodel');
const Room = require('../models/roommodel');

//Controller to fetch hotels by location
exports.getHotelsByLocation = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }
    
    const hotels =await Hotel.find({location});
    
    if(hotels.length===0) {
      return res.status(404).json({ message: 'No hotels found for this location' });
    }

    return res.status(200).json(hotels);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//fetch rooms with cost for a specific hotel and date range
exports.getRoomsWithCost = async (req, res) => {
    try {
      const { _id, from, to } = req.body;
      const fromDate = new Date(from);  //converting to Date object
      const toDate = new Date(to);      
      const hotelId = _id;
      
      if (!hotelId || !fromDate || !toDate) {
        return res.status(400).json({ message:'Hotel ID, From Date, and To Date are required'});
      }
      
      const hotel = await Hotel.findById(hotelId);
      
      if (!hotel) {
        return res.status(404).json({ message:'Hotel not found'});
      }
      
      const roomsWithCost = [];
  
      for (const roomId of hotel.rooms) {
        const room = await Room.findById(roomId);
        
        if (room) {
          const roomBooking = room.bookingDates;
          
          const roomFromDate = new Date(roomBooking.from);
          const roomToDate = roomBooking.to ? new Date(roomBooking.to) : null;
  
          //check for overlapping dates 
         
          const isAvailable = 
            (roomToDate && roomToDate < fromDate) || 
            !roomToDate || 
            (roomFromDate >= toDate || roomToDate <= fromDate);
  
          if (isAvailable) {
            //calculating cost
            const numOfDays = Math.ceil((toDate-fromDate)/(1000*3600*24));
            const totalCost = Math.ceil(numOfDays*hotel.costPerRoom);
  
            roomsWithCost.push({
              roomId,
              cost: totalCost
            });
          }
        }
      }
  
      return res.status(200).json({ rooms: roomsWithCost });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message:'Server error'});
    }
  };
  
  
