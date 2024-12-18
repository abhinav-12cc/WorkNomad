import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Event as EventIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <Paper sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          color: 'primary.main',
          mr: 2,
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h6">{value}</Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

const PropertyStats = ({ stats, loading }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={AccountBalanceIcon}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={EventIcon}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={TrendingUpIcon}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Rating"
          value={stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
          icon={StarIcon}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default PropertyStats;
