import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPropertyAnalytics,
  fetchBookingTrends,
  fetchRevenueAnalytics,
  fetchOccupancyRates,
} from '../../store/slices/analyticsSlice';
import AnalyticsOverview from './AnalyticsOverview';
import BookingTrendsChart from './BookingTrendsChart';
import RevenueAnalytics from './RevenueAnalytics';
import OccupancyAnalytics from './OccupancyAnalytics';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`analytics-tabpanel-${index}`}
    aria-labelledby={`analytics-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PropertyAnalytics = ({ propertyId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('monthly');
  const dispatch = useDispatch();
  const {
    overview,
    bookingTrends,
    revenue,
    occupancy,
    loading,
    error,
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchPropertyAnalytics({ propertyId, timeRange }));
    dispatch(fetchBookingTrends({ propertyId, timeRange }));
    dispatch(fetchRevenueAnalytics({ propertyId, timeRange }));
    dispatch(fetchOccupancyRates({ propertyId, timeRange }));
  }, [dispatch, propertyId, timeRange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  if (loading && !overview.totalBookings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <AnalyticsOverview
        overview={overview}
        loading={loading}
      />

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Booking Trends" />
          <Tab label="Revenue" />
          <Tab label="Occupancy" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <BookingTrendsChart
            data={bookingTrends[timeRange] || []}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RevenueAnalytics
            data={revenue.data}
            byBookingType={revenue.byBookingType}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <OccupancyAnalytics
            daily={occupancy.daily}
            monthly={occupancy.monthly}
            byWeekday={occupancy.byWeekday}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PropertyAnalytics;
