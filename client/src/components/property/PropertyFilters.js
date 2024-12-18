import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Autocomplete,
  Chip,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/propertySlice';

const propertyTypes = [
  { value: 'coworking', label: 'Coworking Space' },
  { value: 'coliving', label: 'Coliving Space' },
  { value: 'meeting-room', label: 'Meeting Room' },
  { value: 'private-office', label: 'Private Office' },
  { value: 'virtual-office', label: 'Virtual Office' },
];

const amenitiesList = [
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
  'Phone Booth',
  'Mail Handling',
];

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

const PropertyFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.properties?.filters) || {
    type: '',
    location: '',
    priceRange: [0, 10000],
    amenities: [],
  };

  const [localFilters, setLocalFilters] = useState(filters);

  const handleTypeChange = (event) => {
    const newFilters = { ...localFilters, type: event.target.value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handleLocationChange = (event, value) => {
    const newFilters = { ...localFilters, location: value || '' };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handlePriceChange = (event, newValue) => {
    const newFilters = { ...localFilters, priceRange: newValue };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handleAmenitiesChange = (event, value) => {
    const newFilters = { ...localFilters, amenities: value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      type: '',
      location: '',
      priceRange: [0, 10000],
      amenities: [],
    };
    setLocalFilters(defaultFilters);
    dispatch(clearFilters());
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleClearFilters}
          sx={{ mb: 2 }}
        >
          Clear Filters
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Property Type</InputLabel>
        <Select
          value={localFilters.type}
          label="Property Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="">All Types</MenuItem>
          {propertyTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Autocomplete
          value={localFilters.location}
          onChange={handleLocationChange}
          options={cities}
          renderInput={(params) => (
            <TextField {...params} label="Location" fullWidth />
          )}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Price Range (₹)</Typography>
        <Slider
          value={localFilters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={500}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">₹{localFilters.priceRange[0]}</Typography>
          <Typography variant="body2">₹{localFilters.priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Autocomplete
          multiple
          value={localFilters.amenities}
          onChange={handleAmenitiesChange}
          options={amenitiesList}
          renderInput={(params) => (
            <TextField {...params} label="Amenities" placeholder="Select amenities" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                size="small"
              />
            ))
          }
        />
      </Box>
    </Paper>
  );
};

export default PropertyFilters;
