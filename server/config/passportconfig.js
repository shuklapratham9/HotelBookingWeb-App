const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/usermodel'); // Import the User model


// Serialize the user (store user ID in the session)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user (attach user data to req.user)
passport.deserializeUser((user,done) => {
    done(null,user);
});

// Google Strategy configuration
passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback', 
      clientID: '362885523584-kouoknsbi8trtt4js69ukd6atqukb05c.apps.googleusercontent.com', 
      clientSecret: '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', 
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

        await newUser.save(); //saving the new user to the database
        console.log('New user created:', newUser);
        return done(null, newUser); //pass new user to passport
      } catch (err) {
        console.error('Error during Google authentication:', err);
        return done(err, null);
      }
    }
  )
);
