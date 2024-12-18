import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Rating,
  Divider,
  ImageList,
  ImageListItem,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById } from '../store/slices/propertySlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SecurityIcon from '@mui/icons-material/Security';

const amenityIcons = {
  'Wi-Fi': <WifiIcon />,
  'Parking': <LocalParkingIcon />,
  'Air Conditioning': <AcUnitIcon />,
  'Security': <SecurityIcon />,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProperty: property, loading, error } = useSelector(
    (state) => state.properties
  );
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchPropertyById(id));
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Image Gallery */}
          <Paper sx={{ mb: 3, p: 2 }}>
            <ImageList variant="quilted" cols={4} rowHeight={200}>
              {property.images.map((image, index) => (
                <ImageListItem
                  key={index}
                  cols={index === 0 ? 2 : 1}
                  rows={index === 0 ? 2 : 1}
                >
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover', height: '100%' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>

          {/* Property Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {property.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  {property.address.street}, {property.address.city},{' '}
                  {property.address.state}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={property.rating} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({property.reviews?.length} reviews)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Tabs */}
            <Box sx={{ width: '100%' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Amenities" />
                <Tab label="Reviews" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      About this space
                    </Typography>
                    <Typography paragraph>{property.description}</Typography>
                    <Typography variant="h6" gutterBottom>
                      Capacity
                    </Typography>
                    <Typography paragraph>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Up to {property.capacity} people
                    </Typography>
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box>
                    <Grid container spacing={2}>
                      {property.amenities.map((amenity) => (
                        <Grid item xs={12} sm={6} md={4} key={amenity}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {amenityIcons[amenity] || null}
                            <Typography>{amenity}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                {tabValue === 2 && (
                  <Box>
                    {property.reviews?.map((review, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography>{review.comment}</Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Booking Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: 24 },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Pricing
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                ₹{property.pricing.daily}
              </Typography>
              <Typography color="text.secondary">per day</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph>
                Monthly: ₹{property.pricing.monthly}
              </Typography>
              <Typography variant="body2">
                Hourly: ₹{property.pricing.hourly}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate(`/booking/${property._id}`)}
            >
              Book Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetail;
