const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Coworking Space', 'Coliving Space', 'Private Office', 'Virtual Office', 'Meeting Room']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Property address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
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
        default: [0, 0]
      }
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  amenities: [{
    type: String,
    enum: [
      'Wi-Fi',
      'Printer',
      'Scanner',
      'Cafeteria',
      'Meeting Rooms',
      'Air Conditioning',
      'Parking',
      '24/7 Access',
      'Security',
      'Reception',
      'Mail Handling',
      'Lounge Area'
    ]
  }],
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add index for location-based queries
propertySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
