const router = require('express').Router();
const passport = require('passport');
const passportconfig = require('../config/passportconfig')
const cookiesession = require('cookie-session')
require('dotenv').config()



router.use(passport.initialize());
router.use(passport.session());


//googlecall
router.get('/google',passport.authenticate('google',{
    scope:['email','profile'],
    prompt:"consent",
    acessType:'offline'
}))


router.get('/google/callback',passport.authenticate('google',{
    failureRedirect:'/',
    successRedirect:'/'
}),()=>{
    console.log('google called us back') 
})

router.get('/status', (req, res) => {

    if (req.isAuthenticated()) {
      console.log('User is authenticated:', req.user);
      return res.status(200).send({
        isLoggedIn: true,
        user: req.user, //send the authenticated user details
      });
    } else {
      console.log('User is not authenticated');
      return res.status(200).send({
        isLoggedIn: false,
        message: 'User is not logged in',
      });
    }
  });


router.get('/useremail',(req,res)=>{
    res.send({
        email:req.user.email,
    })
})
//logout
router.get('/logout',(req,res)=>{
    console.log('this is logut router working')
    req.logout();
    res.status(200).redirect('http://localhost:3000')
})
module.exports = router;