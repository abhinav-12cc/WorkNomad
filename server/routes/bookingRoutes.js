const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// Get all bookings for a user
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'name type images location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get all bookings for a property owner
router.get('/owner', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(property => property._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'name type images location')
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get a specific booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'name type images location pricing')
      .populate('user', 'name email phone avatar');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString() && 
        !(await Property.exists({ _id: booking.property._id, owner: req.user._id }))) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, totalAmount } = req.body;

    // Check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check availability
    if (!property.isAvailable(checkIn, checkOut)) {
      return res.status(400).json({ error: 'Property is not available for selected dates' });
    }

    const booking = new Booking({
      property: propertyId,
      user: req.user._id,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    const property = await Property.findById(booking.property);
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Check cancellation policy
    const property = await Property.findById(booking.property);
    const cancellationDeadline = new Date(booking.checkIn);
    cancellationDeadline.setDate(cancellationDeadline.getDate() - 2); // 48 hours before check-in

    if (Date.now() > cancellationDeadline) {
      return res.status(400).json({ error: 'Cancellation deadline has passed' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
