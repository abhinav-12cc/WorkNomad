import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createProperty, updateProperty } from '../../store/slices/ownerPropertySlice';

const propertyTypes = [
  { value: 'coworking', label: 'Coworking Space' },
  { value: 'coliving', label: 'Coliving Space' },
  { value: 'meeting-room', label: 'Meeting Room' },
  { value: 'private-office', label: 'Private Office' },
  { value: 'virtual-office', label: 'Virtual Office' },
];

const defaultAmenities = [
  'Wi-Fi',
  'Air Conditioning',
  'Parking',
  'Meeting Rooms',
  'Coffee/Tea',
  'Printer/Scanner',
  'Security',
  '24/7 Access',
  'Kitchen',
  'Lounge Area',
];

const PropertyForm = ({ property, onSuccess, loading, error }) => {
  const [formData, setFormData] = useState(property || {
    name: '',
    type: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    amenities: [],
    pricing: {
      hourly: '',
      daily: '',
      monthly: '',
    },
    capacity: '',
  });

  const [newAmenity, setNewAmenity] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = property
      ? updateProperty({ id: property._id, propertyData: formData })
      : createProperty(formData);

    const result = await dispatch(action);
    if (!result.error) {
      onSuccess();
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {property ? 'Edit Property' : 'Add New Property'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Property Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Property Type"
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Address Fields */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="State"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="ZIP Code"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Pricing Fields */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Pricing
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Hourly Rate"
            name="pricing.hourly"
            type="number"
            value={formData.pricing.hourly}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Daily Rate"
            name="pricing.daily"
            type="number"
            value={formData.pricing.daily}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Monthly Rate"
            name="pricing.monthly"
            type="number"
            value={formData.pricing.monthly}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Amenities */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Amenities
          </Typography>
          <Box sx={{ mb: 2 }}>
            {defaultAmenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                onClick={() => {
                  if (!formData.amenities.includes(amenity)) {
                    setFormData((prev) => ({
                      ...prev,
                      amenities: [...prev.amenities, amenity],
                    }));
                  }
                }}
                sx={{ m: 0.5 }}
                color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              label="Add Custom Amenity"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
            />
            <IconButton
              onClick={handleAddAmenity}
              disabled={!newAmenity}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.amenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                onDelete={() => handleRemoveAmenity(amenity)}
                color="primary"
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : property ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
};

export default PropertyForm;
