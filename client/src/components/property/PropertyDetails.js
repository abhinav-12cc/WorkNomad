import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Rating,
  Button,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPropertyDetails,
  clearPropertyState,
} from '../../store/slices/propertySlice';
import { fetchPropertyReviews } from '../../store/slices/reviewSlice';
import PropertyGallery from './PropertyGallery';
import PropertyAmenities from './PropertyAmenities';
import PropertyLocation from './PropertyLocation';
import PropertyPricing from './PropertyPricing';
import PropertyAvailability from './PropertyAvailability';
import PropertyReviews from '../reviews/PropertyReviews';
import PropertyAnalytics from '../analytics/PropertyAnalytics';
import BookingForm from '../booking/BookingForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`property-tabpanel-${index}`}
    aria-labelledby={`property-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tabValue, setTabValue] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const {
    property,
    loading: propertyLoading,
    error: propertyError,
  } = useSelector((state) => state.properties);

  const {
    reviews,
    totalReviews,
    averageRating,
    loading: reviewsLoading,
  } = useSelector((state) => state.reviews);

  const { user } = useSelector((state) => state.auth);
  const { userBookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchPropertyDetails(id));
    dispatch(fetchPropertyReviews({ propertyId: id }));

    return () => {
      dispatch(clearPropertyState());
    };
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    setShowBookingForm(true);
  };

  if (propertyLoading) {
    return <LoadingSpinner />;
  }

  if (propertyError) {
    return <ErrorAlert error={propertyError} />;
  }

  if (!property) {
    return <ErrorAlert error="Property not found" />;
  }

  const isOwner = user && property.owner === user._id;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Property Gallery */}
        <Grid item xs={12}>
          <PropertyGallery images={property.images} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {property.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={averageRating}
                readOnly
                precision={0.5}
                sx={{ mr: 1 }}
              />
              <Typography variant="body1" color="text.secondary">
                {averageRating.toFixed(1)} ({totalReviews} reviews)
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              {property.location.address}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              ₹{property.pricing.basePrice} per day
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Reviews" />
            <Tab label="Location" />
            <Tab label="Availability" />
            {isOwner && <Tab label="Analytics" />}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About this space
              </Typography>
              <Typography variant="body1" paragraph>
                {property.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <PropertyAmenities amenities={property.amenities} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PropertyReviews
              propertyId={id}
              isOwner={isOwner}
              currentUserId={user?._id}
              userBookings={userBookings}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <PropertyLocation
              address={property.location.address}
              coordinates={property.location.coordinates}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <PropertyAvailability
              propertyId={id}
              isOwner={isOwner}
              availability={property.availability}
            />
          </TabPanel>

          {isOwner && (
            <TabPanel value={tabValue} index={4}>
              <PropertyAnalytics propertyId={id} />
            </TabPanel>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box
            component="aside"
            sx={{
              position: { md: 'sticky' },
              top: { md: 24 },
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <PropertyPricing pricing={property.pricing} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleBookNow}
              sx={{ mt: 3 }}
            >
              Book Now
            </Button>

            {showBookingForm && (
              <BookingForm
                property={property}
                onClose={() => setShowBookingForm(false)}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetails;
