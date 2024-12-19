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
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { properties } from '../../services/api';

const PROPERTY_TYPES = [
  'Coworking Space',
  'Coliving Space',
  'Private Office',
  'Virtual Office',
  'Meeting Room'
];

const AMENITIES = [
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
];

const MAX_IMAGES = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    address: '',
    city: '',
    state: '',
    country: '',
    price: '',
    amenities: [],
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (event) => {
    const { value } = event.target;
    // Ensure value is always an array
    const amenitiesArray = typeof value === 'string' ? value.split(',') : value;
    setFormData(prev => ({
      ...prev,
      amenities: amenitiesArray || []
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (formData.images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('Only JPG, JPEG & PNG files are allowed');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File size should not exceed 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      setError(null);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else if (key === 'amenities') {
          // Make sure amenities is an array before stringifying
          const amenitiesArray = Array.isArray(formData.amenities) ? formData.amenities : [];
          formDataToSend.append('amenities', JSON.stringify(amenitiesArray));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await properties.create(formDataToSend);
      
      setSuccess(true);
      setLoading(false);
      
      // Navigate to the property details page using the correct ID
      if (response.data && response.data.data && response.data.data._id) {
        navigate(`/properties/${response.data.data._id}`);
      } else {
        console.error('Invalid response format:', response);
        setError('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.error || 'Failed to add property');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Property
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Property added successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Property Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Property Type"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price per day"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>₹</span>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {AMENITIES.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox checked={formData.amenities.indexOf(amenity) > -1} />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Max {MAX_IMAGES} images. JPG, JPEG or PNG. Max size 5MB each.
              </Typography>
            </Grid>

            {formData.images.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {formData.images.map((image, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: 'background.paper'
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddPropertyForm;
