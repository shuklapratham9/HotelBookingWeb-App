const express = require('express');
const router = express.Router();
const { bookRoom } = require('../controllers/bookingController');
const islogin = require('../middlewares/isloginmiddleware');
const isloginmiddleware = require('../middlewares/isloginmiddleware');

//route to book a room
router.post('/book',bookRoom);


module.exports = router;
