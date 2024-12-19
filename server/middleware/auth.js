const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.userId) {
        return res.status(401).json({ error: 'Invalid token structure' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Attach the full user object to the request
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = auth;
