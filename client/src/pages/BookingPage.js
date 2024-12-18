import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById } from '../store/slices/propertySlice';
import { createBooking, clearBookingState } from '../store/slices/bookingSlice';
import BookingForm from '../components/booking/BookingForm';

const BookingPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProperty: property, loading: propertyLoading } = useSelector(
    (state) => state.properties
  );
  const { loading: bookingLoading, error, success } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(fetchPropertyById(propertyId));
    return () => {
      dispatch(clearBookingState());
    };
  }, [dispatch, propertyId]);

  useEffect(() => {
    if (success) {
      // Redirect to user profile or booking confirmation page
      navigate('/profile');
    }
  }, [success, navigate]);

  const handleBookingSubmit = (bookingData) => {
    dispatch(createBooking(bookingData));
  };

  if (propertyLoading) {
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

  if (!property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Property not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Your Space
      </Typography>

      <Grid container spacing={3}>
        {/* Property Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {property.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {property.address.city}, {property.address.state}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              Pricing
            </Typography>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Hourly Rate:</Typography>
                <Typography>₹{property.pricing.hourly}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Daily Rate:</Typography>
                <Typography>₹{property.pricing.daily}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Monthly Rate:</Typography>
                <Typography>₹{property.pricing.monthly}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <BookingForm
            property={property}
            onSubmit={handleBookingSubmit}
            loading={bookingLoading}
            error={error}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingPage;
