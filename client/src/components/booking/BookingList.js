import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '../../store/slices/bookingSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'completed':
      return 'info';
    default:
      return 'default';
  }
};

const BookingList = ({ bookings }) => {
  const dispatch = useDispatch();

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  if (!bookings.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          You haven't made any bookings yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {bookings.map((booking) => (
        <Paper key={booking._id} sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                {booking.property.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {booking.property.address.city}, {booking.property.address.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
              <Chip
                label={booking.status.toUpperCase()}
                color={getStatusColor(booking.status)}
                sx={{ mb: 1 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking Period
                </Typography>
                <Typography>
                  {format(new Date(booking.startDate), 'PPP')} -{' '}
                  {format(new Date(booking.endDate), 'PPP')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking Type
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {booking.bookingType}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{booking.totalAmount}
                </Typography>
              </Box>
              {booking.status === 'confirmed' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel Booking
                </Button>
              )}
            </Grid>
          </Grid>

          {booking.specialRequirements && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Special Requirements
              </Typography>
              <Typography>{booking.specialRequirements}</Typography>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default BookingList;
