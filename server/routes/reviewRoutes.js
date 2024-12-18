const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { isPropertyOwner } = require('../middleware/propertyOwner');

// Get reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (page - 1) * limit;

    const [reviews, stats] = await Promise.all([
      Review.find({ property: propertyId, status: 'active' })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name avatar')
        .lean(),
      Review.getPropertyStats(propertyId),
    ]);

    const totalPages = Math.ceil(stats.totalReviews / limit);

    res.json({
      reviews,
      total: stats.totalReviews,
      averageRating: stats.averageRating,
      ratingDistribution: stats.ratingDistribution,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by a user
router.get('/user', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user._id })
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('property', 'name images')
        .lean(),
      Review.countDocuments({ user: req.user._id }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      reviews,
      total,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Create a review
router.post('/property/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { bookingId, rating, title, comment, aspects } = req.body;

    // Verify booking
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
      property: propertyId,
      status: 'completed',
    });

    if (!booking) {
      return res.status(400).json({
        error: 'You can only review properties after completing a stay',
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        error: 'You have already reviewed this booking',
      });
    }

    const review = new Review({
      property: propertyId,
      booking: bookingId,
      user: req.user._id,
      rating,
      title,
      comment,
      aspects,
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .lean();

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update a review
router.patch('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updates = ['rating', 'title', 'comment', 'aspects'];
    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        review[update] = req.body[update];
      }
    });

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .lean();

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.status = 'deleted';
    await review.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Add owner response
router.post('/:reviewId/response', auth, isPropertyOwner, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('property');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.ownerResponse) {
      return res.status(400).json({
        error: 'You have already responded to this review',
      });
    }

    await review.addOwnerResponse(req.body.response);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .lean();

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add response' });
  }
});

// Toggle helpful vote
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.toggleHelpful(req.user._id);

    res.json({
      helpfulCount: review.helpfulVotes.length,
      isHelpful: review.helpfulVotes.includes(req.user._id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update helpful status' });
  }
});

// Report a review
router.post('/:reviewId/report', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user has already reported
    const existingReport = review.reports.find(
      (report) => report.user.toString() === req.user._id.toString()
    );

    if (existingReport) {
      return res.status(400).json({
        error: 'You have already reported this review',
      });
    }

    await review.reportReview(
      req.user._id,
      req.body.reason,
      req.body.details
    );

    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report review' });
  }
});

module.exports = router;
