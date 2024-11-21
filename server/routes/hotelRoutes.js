const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const isloginmiddleware = require('../middlewares/isloginmiddleware');

// Route to fetch hotels by location
router.post('/hotels/location',hotelController.getHotelsByLocation);

// Route to fetch rooms for a specific hotel with pricing for a given date range
router.post('/hotels/rooms', hotelController.getRoomsWithCost);

module.exports = router;
