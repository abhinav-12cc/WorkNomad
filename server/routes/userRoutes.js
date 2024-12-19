const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/profile-pictures');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000 // 5MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file (jpg, jpeg, or png)'));
    }
    cb(undefined, true);
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['occupation', 'skills', 'linkedinUrl'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Update profile picture
router.put('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      try {
        const oldPicturePath = path.join(__dirname, '..', 'public', user.profilePicture);
        await fs.unlink(oldPicturePath);
      } catch (err) {
        console.error('Error deleting old profile picture:', err);
      }
    }

    // Update user's profile picture path
    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ error: 'Error updating profile picture' });
  }
});

// Change password
router.put('/change-password', [
  auth,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
});

// Upload profile picture
router.post('/profile/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please provide an image file' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile picture URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profilePictureUrl = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;
    
    // Delete old profile picture if it exists
    if (user.profilePicture) {
      const oldPicturePath = user.profilePicture.replace(baseUrl, '');
      const fullPath = path.join(__dirname, '../public', oldPicturePath);
      try {
        await fs.unlink(fullPath);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }

    user.profilePicture = profilePictureUrl;
    await user.save();

    res.json({ 
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture 
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(400).json({ error: error.message || 'Failed to upload profile picture' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User(req.body);
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      message: 'Registration successful',
      user: userResponse, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.code === 11000 
        ? 'Email already registered' 
        : error.message || 'Registration failed' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ 
      message: 'Login successful',
      user: userResponse, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
});

module.exports = router;
