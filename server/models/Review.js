const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      minlength: 50,
    },
    aspects: {
      cleanliness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      location: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      amenities: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    ownerResponse: {
      type: String,
      trim: true,
    },
    ownerResponseDate: {
      type: Date,
    },
    helpfulVotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
        required: true,
      },
      details: String,
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['active', 'hidden', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ property: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ booking: 1 }, { unique: true });

// Virtual for average aspect rating
reviewSchema.virtual('averageAspectRating').get(function() {
  const { cleanliness, location, amenities, value } = this.aspects;
  return (cleanliness + location + amenities + value) / 4;
});

// Methods
reviewSchema.methods.toggleHelpful = function(userId) {
  const userIdStr = userId.toString();
  const index = this.helpfulVotes.findIndex(id => id.toString() === userIdStr);
  
  if (index === -1) {
    this.helpfulVotes.push(userId);
  } else {
    this.helpfulVotes.splice(index, 1);
  }
  return this.save();
};

reviewSchema.methods.addOwnerResponse = function(response) {
  this.ownerResponse = response;
  this.ownerResponseDate = new Date();
  return this.save();
};

reviewSchema.methods.reportReview = function(userId, reason, details) {
  this.reports.push({
    user: userId,
    reason,
    details,
  });
  return this.save();
};

// Statics
reviewSchema.statics.getPropertyStats = async function(propertyId) {
  const stats = await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        status: 'active',
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: 1,
        totalReviews: 1,
        ratingDistribution: {
          1: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 1] },
              },
            },
          },
          2: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 2] },
              },
            },
          },
          3: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 3] },
              },
            },
          },
          4: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 4] },
              },
            },
          },
          5: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 5] },
              },
            },
          },
        },
      },
    },
  ]);

  return stats[0] || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
