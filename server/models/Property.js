const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['coworking', 'coliving', 'meeting-room', 'private-office', 'virtual-office'],
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 50
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    landmarks: [String]
  },
  amenities: {
    basic: [{
      type: String,
      enum: [
        'wifi',
        'ac',
        'parking',
        'security',
        'cleaning',
        'reception',
        'pantry',
        'power_backup'
      ]
    }],
    workspace: [{
      type: String,
      enum: [
        'desk',
        'chair',
        'locker',
        'printer',
        'scanner',
        'whiteboard',
        'projector',
        'tv'
      ]
    }],
    comfort: [{
      type: String,
      enum: [
        'cafeteria',
        'lounge',
        'gaming_zone',
        'gym',
        'meditation_room',
        'sleeping_pods'
      ]
    }]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    hourlyRate: Number,
    dailyRate: Number,
    weeklyRate: Number,
    monthlyRate: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    discounts: [{
      type: {
        type: String,
        enum: ['weekly', 'monthly', 'early_bird', 'last_minute']
      },
      percentage: Number,
      validFrom: Date,
      validUntil: Date
    }],
    additionalCharges: [{
      name: String,
      amount: Number,
      type: {
        type: String,
        enum: ['one_time', 'per_day', 'per_person']
      }
    }]
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'unavailable', 'maintenance'],
      default: 'available'
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    blockedDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }],
    minimumBookingDuration: {
      type: Number,
      default: 1
    },
    maximumBookingDuration: Number,
    instantBooking: {
      type: Boolean,
      default: true
    }
  },
  capacity: {
    total: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  },
  rules: [{
    type: String
  }],
  cancellationPolicy: {
    type: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    description: String,
    refundPercentage: Number
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  verificationStatus: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ 'pricing.basePrice': 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ status: 1 });

// Methods
propertySchema.methods.isAvailable = function(startDate, endDate) {
  if (this.availability.status !== 'available') return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if dates are blocked
  const isBlocked = this.availability.blockedDates.some(block => {
    return (
      (start >= block.startDate && start <= block.endDate) ||
      (end >= block.startDate && end <= block.endDate) ||
      (start <= block.startDate && end >= block.endDate)
    );
  });

  return !isBlocked;
};

propertySchema.methods.calculatePrice = function(startDate, endDate) {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  let totalPrice = this.pricing.basePrice * days;

  // Apply discounts
  if (days >= 7 && days < 30) {
    const weeklyDiscount = this.pricing.discounts.find(d => d.type === 'weekly');
    if (weeklyDiscount) {
      totalPrice *= (1 - weeklyDiscount.percentage / 100);
    }
  } else if (days >= 30) {
    const monthlyDiscount = this.pricing.discounts.find(d => d.type === 'monthly');
    if (monthlyDiscount) {
      totalPrice *= (1 - monthlyDiscount.percentage / 100);
    }
  }

  return totalPrice;
};

module.exports = mongoose.model('Property', propertySchema);
