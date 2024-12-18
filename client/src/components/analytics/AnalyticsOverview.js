import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Event as EventIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, loading, color }) => (
  <Paper sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          mr: 2,
        }}
      >
        <Icon />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h5">{value}</Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

const AnalyticsOverview = ({ overview, loading }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Revenue"
          value={`₹${overview.totalRevenue.toLocaleString()}`}
          icon={AccountBalanceIcon}
          loading={loading}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Bookings"
          value={overview.totalBookings}
          icon={EventIcon}
          loading={loading}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Occupancy"
          value={`${overview.averageOccupancy}%`}
          icon={TrendingUpIcon}
          loading={loading}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Rating"
          value={overview.averageRating.toFixed(1)}
          icon={StarIcon}
          loading={loading}
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default AnalyticsOverview;
