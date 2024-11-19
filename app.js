const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session'); // Import express-session
require('./config/passport');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-default-secret', // Replace with a secure secret in .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));
app.use('/profile', require('./routes/profile'));

// Export the app instance for use in server.js
module.exports = app;
