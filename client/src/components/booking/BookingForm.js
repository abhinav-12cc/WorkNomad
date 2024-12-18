import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, differenceInDays, differenceInHours } from 'date-fns';

const BookingForm = ({ property, onSubmit, loading, error }) => {
  const [bookingData, setBookingData] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    bookingType: 'daily',
    specialRequirements: '',
  });
  const [totalAmount, setTotalAmount] = useState(property.pricing.daily);

  const calculateTotal = (start, end, type) => {
    const diff = type === 'hourly' 
      ? differenceInHours(end, start)
      : differenceInDays(end, start);
    
    let rate;
    switch (type) {
      case 'hourly':
        rate = property.pricing.hourly;
        break;
      case 'monthly':
        rate = property.pricing.monthly;
        break;
      default:
        rate = property.pricing.daily;
    }

    return Math.max(diff * rate, rate);
  };

  const handleDateChange = (field, value) => {
    setBookingData(prev => {
      const newData = { ...prev, [field]: value };
      const total = calculateTotal(
        newData.startDate,
        newData.endDate,
        newData.bookingType
      );
      setTotalAmount(total);
      return newData;
    });
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setBookingData(prev => {
      let endDate = prev.endDate;
      if (type === 'hourly') {
        endDate = addDays(prev.startDate, 0);
      } else if (type === 'monthly') {
        endDate = addDays(prev.startDate, 30);
      }

      const newData = { ...prev, bookingType: type, endDate };
      const total = calculateTotal(newData.startDate, endDate, type);
      setTotalAmount(total);
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...bookingData,
      propertyId: property._id,
      totalAmount,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Book Your Space
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Booking Type</InputLabel>
            <Select
              value={bookingData.bookingType}
              label="Booking Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="Start Date"
            value={bookingData.startDate}
            onChange={(value) => handleDateChange('startDate', value)}
            minDate={new Date()}
            sx={{ mb: 2, width: '100%' }}
          />

          <DatePicker
            label="End Date"
            value={bookingData.endDate}
            onChange={(value) => handleDateChange('endDate', value)}
            minDate={bookingData.startDate}
            sx={{ width: '100%' }}
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Special Requirements"
          value={bookingData.specialRequirements}
          onChange={(e) => setBookingData(prev => ({
            ...prev,
            specialRequirements: e.target.value
          }))}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Pricing Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Total Amount:</Typography>
            <Typography variant="h6" color="primary">
              ₹{totalAmount}
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
        </Button>
      </Paper>
    </LocalizationProvider>
  );
};

export default BookingForm;
