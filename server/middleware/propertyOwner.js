const Property = require('../models/Property');

const isPropertyOwner = async (req, res, next) => {
  try {
    let propertyId;

    // Get property ID from params or body
    if (req.params.propertyId) {
      propertyId = req.params.propertyId;
    } else if (req.params.id) {
      propertyId = req.params.id;
    } else if (req.body.propertyId) {
      propertyId = req.body.propertyId;
    }

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. Not the property owner' });
    }

    // Add property to request object for future use
    req.property = property;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking property ownership' });
  }
};

module.exports = { isPropertyOwner };
