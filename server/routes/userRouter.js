const router = require('express').Router();
const controller = require('../controllers/userController')

router.get('/cancel',controller.cancelbooking)
router.get('/lastbooking',controller.lastbooking)

module.exports = router;   