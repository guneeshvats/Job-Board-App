const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get profile information for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ msg: 'Server error while retrieving profile' });
  }
});

// Update profile information for the logged-in user
router.put('/', auth, async (req, res) => {
  const { name, email, phone, address, company, bio } = req.body;
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address, company, bio },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedProfile) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ msg: 'Server error while updating profile' });
  }
});

// Change password for the logged-in user
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select('password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    // Hash and set new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ msg: 'Server error while changing password' });
  }
});

// Delete account for the logged-in user
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ msg: 'Server error while deleting account' });
  }
});

module.exports = router;
