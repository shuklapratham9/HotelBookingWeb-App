const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();

const connectdb = require('./dbconfig'); 
const authrouter = require('./routes/auth');
const hotelrouter = require('./routes/hotelRoutes.js');
const bookingrouter = require('./routes/bookingRoutes');
const userrouter = require('./routes/userRouter.js');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

//session confi
app.use(
    cookieSession({
        name: 'Session',
        maxAge: 24*60*60*1000,
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
    })
);

//passport initili
app.use(passport.initialize());
app.use(passport.session());

//authentication middleware
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; 
    }
    next();
});


app.use('/auth', authrouter);
app.use('/', hotelrouter);
app.use('/', bookingrouter);
app.use('/user', userrouter);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});



app.listen(3000, async () => {
    await connectdb();
    console.log('Server is listening on http://localhost:3000');
});
