const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, address, company } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      phone,
      address,
      company
    });
    await user.save();
    res.json({ msg: 'User registered' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Server error');
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Server error');
  }
});

// Google OAuth route to initiate authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Redirect to frontend with the JWT token and role
      res.redirect(`https://job-board-app-mu.vercel.app/oauth-redirect?token=${token}&role=${req.user.role}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
