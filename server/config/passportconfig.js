const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/usermodel'); 
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user,done) => {
    done(null,user);
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback', 
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        const email = profile.emails[0].value;
        const name = profile.displayName;

        //if the user already exists in the database
        let existingUser = await User.findOne({ email });

        if (existingUser) {
          //user exists
          console.log('User already exists:', existingUser);
          return done(null, existingUser);
        }

        //user does not exist
        const newUser = new User({
          name: name || 'Anonymous User', 
          email: email,
          gender: profile.gender || 'Other',
          age: 18, 
        });

        await newUser.save(); 
        console.log('New user created:', newUser);
        return done(null, newUser); //pass new user to passport
      } catch (err) {
        console.error('Error during Google authentication:', err);
        return done(err, null);
      }
    }
  )
);
