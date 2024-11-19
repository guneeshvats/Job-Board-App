const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://jobboardapp-25go.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'job_seeker',
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Serialize the user by storing the user ID in the session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize the user by retrieving the user data from the database using the ID in the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Updated to use async/await without a callback
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
