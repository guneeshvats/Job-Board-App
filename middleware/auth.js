const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Standardize req.user to have a consistent structure
    if (decoded.user) {
      // Traditional login (JWT payload has `user` property)
      req.user = decoded.user;
    } else {
      // Google OAuth (JWT payload is the user directly)
      req.user = decoded;
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
