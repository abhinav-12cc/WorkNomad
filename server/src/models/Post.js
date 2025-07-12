import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  facilities: [{
    type: String,
    enum: [
      'wifi',
      'canteen',
      'restrooms',
      'lounge_area',
      'smoking_area',
      'printing_scanning',
      'parking'
    ],
    required: true
  }],
  price: {
    type: Number,
    required: true,
  },
  nearbyArea: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'coworking',
      'coliving',
      'meeting_rooms',
      'business_hall'
    ],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  images: {
    type: [String],
    required: true,
    validate: [arrayLimit, "You must provide exactly 3 images"],
  }
});

function arrayLimit(val) {
  return val.length <= 3;
}

// Pre-save middleware to generate slug
postSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { 
      lower: true,      // Convert to lowercase
      strict: true,     // Remove special characters
      trim: true        // Trim whitespace
    });
  }
  next();
});

export default mongoose.model("Post", postSchema);
