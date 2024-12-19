const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Property = require('../models/Property');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { isPropertyOwner } = require('../middleware/propertyOwner');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/properties');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only .jpeg, .jpg and .png format allowed!');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  }
});

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      type,
      location,
      amenities,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    const skip = (page - 1) * limit;
    const properties = await Property.find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
});

// Get owner's properties
router.get('/owner', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    res.status(500).json({ error: 'Error fetching owner properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email')
      .lean();

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Add full URLs for images
    if (property.images) {
      property.images = property.images.map(image => 
        image.startsWith('http') ? image : `${process.env.API_URL || 'http://localhost:5003'}${image}`
      );
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching property details' 
    });
  }
});

// Create a new property
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user.userId,
      images: req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : []
    };

    const property = new Property(propertyData);
    await property.save();

    // Update owner's property count
    await User.findByIdAndUpdate(req.user.userId, { $inc: { propertyCount: 1 } });

    res.status(201).json(property);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a property
router.put('/:id', auth, isPropertyOwner, upload.array('images', 5), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Update fields
    const updates = { ...req.body };
    if (updates.amenities) {
      updates.amenities = JSON.parse(updates.amenities);
    }
    if (req.files && req.files.length > 0) {
      updates.images = [...property.images, ...req.files.map(file => `/uploads/properties/${file.filename}`)];
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate('owner', 'name email');

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Error updating property' });
  }
});

// Delete a property
router.delete('/:id', auth, isPropertyOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Delete property images
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        const imagePath = path.join(__dirname, '..', image);
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    await property.remove();

    // Update owner's property count
    await User.findByIdAndUpdate(property.owner, { $inc: { propertyCount: -1 } });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Error deleting property' });
  }
});

// Add a review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const review = new Review({
      property: property._id,
      user: req.user.userId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await review.save();

    // Update property owner's review count
    await User.findByIdAndUpdate(property.owner, { $inc: { likesCount: 1 } });

    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
