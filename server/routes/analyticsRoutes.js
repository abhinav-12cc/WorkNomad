const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get analytics for all properties owned by user
router.get('/owner', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(property => property._id);

    const [bookings, reviews] = await Promise.all([
      Booking.find({ 
        property: { $in: propertyIds },
        status: { $in: ['confirmed', 'completed'] }
      }),
      Review.find({ property: { $in: propertyIds } })
    ]);

    // Calculate revenue metrics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const monthlyRevenue = {};
    bookings.forEach(booking => {
      const month = booking.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.totalAmount;
    });

    // Calculate booking metrics
    const totalBookings = bookings.length;
    const bookingsByStatus = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate review metrics
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    // Calculate occupancy rate
    const occupancyByProperty = {};
    for (const property of properties) {
      const propertyBookings = bookings.filter(b => b.property.toString() === property._id.toString());
      const totalDays = propertyBookings.reduce((sum, booking) => {
        const days = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      occupancyByProperty[property._id] = (totalDays / 365) * 100;
    }

    res.json({
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue
      },
      bookings: {
        total: totalBookings,
        byStatus: bookingsByStatus
      },
      reviews: {
        total: totalReviews,
        averageRating
      },
      occupancy: occupancyByProperty
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics for a specific property
router.get('/property/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is authorized to view analytics
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view property analytics' });
    }

    const [bookings, reviews] = await Promise.all([
      Booking.find({ 
        property: property._id,
        status: { $in: ['confirmed', 'completed'] }
      }),
      Review.find({ property: property._id })
    ]);

    // Revenue analytics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const monthlyRevenue = {};
    bookings.forEach(booking => {
      const month = booking.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.totalAmount;
    });

    // Booking analytics
    const totalBookings = bookings.length;
    const bookingTrends = {};
    bookings.forEach(booking => {
      const month = booking.createdAt.toISOString().slice(0, 7);
      bookingTrends[month] = (bookingTrends[month] || 0) + 1;
    });

    // Review analytics
    const reviewStats = {
      total: reviews.length,
      averageRating: reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      }
    };

    // Occupancy analytics
    const totalDays = bookings.reduce((sum, booking) => {
      const days = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const occupancyRate = (totalDays / 365) * 100;

    res.json({
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue
      },
      bookings: {
        total: totalBookings,
        trends: bookingTrends
      },
      reviews: reviewStats,
      occupancy: occupancyRate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property analytics' });
  }
});

module.exports = router;
