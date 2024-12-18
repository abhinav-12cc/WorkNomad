import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailability } from '../../store/slices/availabilitySlice';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingRequests from './BookingRequests';

const AvailabilityManager = ({ propertyId }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const dispatch = useDispatch();
  const {
    availability,
    blockedDates,
    operatingHours,
    loading,
    error,
  } = useSelector((state) => state.availability);

  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Fetch 3 months of availability
    dispatch(fetchAvailability({ propertyId, startDate, endDate }));
  }, [dispatch, propertyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Availability Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Calendar" />
          <Tab label="Booking Requests" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <AvailabilityCalendar
          propertyId={propertyId}
          availability={availability}
          blockedDates={blockedDates}
          operatingHours={operatingHours}
          loading={loading}
          error={error}
        />
      )}

      {tabValue === 1 && (
        <BookingRequests
          propertyId={propertyId}
        />
      )}
    </Paper>
  );
};

export default AvailabilityManager;
