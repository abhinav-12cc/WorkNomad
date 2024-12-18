const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { isPropertyOwner } = require('../middleware/propertyOwner');

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      type,
      priceMin,
      priceMax,
      amenities,
      location,
      startDate,
      endDate,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (type) {
      query.type = { $in: type.split(',') };
    }

    if (priceMin || priceMax) {
      query['pricing.basePrice'] = {};
      if (priceMin) query['pricing.basePrice'].$gte = Number(priceMin);
      if (priceMax) query['pricing.basePrice'].$lte = Number(priceMax);
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    // Check availability if dates are provided
    if (startDate && endDate) {
      query['availability.blockedDates'] = {
        $not: {
          $elemMatch: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      };
    }

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'name avatar')
        .lean(),
      Property.countDocuments(query),
    ]);

    // Get review stats for each property
    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const stats = await Review.getPropertyStats(property._id);
        return {
          ...property,
          stats,
        };
      })
    );

    res.json({
      properties: propertiesWithStats,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property details
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name avatar email phone')
      .lean();

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property details' });
  }
});

// Get property stats
router.get('/:id/stats', async (req, res) => {
  try {
    const [reviewStats, bookingStats] = await Promise.all([
      Review.getPropertyStats(req.params.id),
      Booking.aggregate([
        {
          $match: {
            property: req.params.id,
            status: { $in: ['completed', 'confirmed'] },
          },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            occupiedDays: {
              $sum: {
                $divide: [
                  {
                    $subtract: ['$checkOut', '$checkIn'],
                  },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const stats = {
      ...reviewStats,
      totalBookings: bookingStats[0]?.totalBookings || 0,
      totalRevenue: bookingStats[0]?.totalRevenue || 0,
      occupancyRate:
        bookingStats[0]?.occupiedDays
          ? (bookingStats[0].occupiedDays / 365) * 100
          : 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property stats' });
  }
});

// Create property
router.post('/', auth, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user._id,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.patch('/:id', auth, isPropertyOwner, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name',
      'description',
      'type',
      'amenities',
      'pricing',
      'location',
      'images',
      'availability',
    ];

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const property = await Property.findById(req.params.id);
    updates.forEach((update) => (property[update] = req.body[update]));
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', auth, isPropertyOwner, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get user properties
router.get('/user/properties', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'name avatar')
      .lean();

    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const stats = await Review.getPropertyStats(property._id);
        return {
          ...property,
          stats,
        };
      })
    );

    res.json(propertiesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user properties' });
  }
});

module.exports = router;
