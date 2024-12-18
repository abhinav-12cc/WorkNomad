import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import {
  Paper,
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

const RevenueAnalytics = ({ data, byBookingType, timeRange, onTimeRangeChange }) => {
  const theme = {
    axis: {
      ticks: {
        text: {
          fontSize: 12,
          fill: '#666',
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: '#666',
        },
      },
    },
    tooltip: {
      container: {
        background: '#fff',
        fontSize: 12,
        borderRadius: 4,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Revenue Over Time</Typography>
            <FormControl size="small">
              <Select
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ height: 400 }}>
            <ResponsiveBar
              data={data}
              keys={['revenue']}
              indexBy="date"
              margin={{ top: 20, right: 20, bottom: 50, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Revenue (₹)',
                legendPosition: 'middle',
                legendOffset: -60,
                format: (value) =>
                  `₹${value.toLocaleString()}`,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              theme={theme}
              tooltip={({ value, indexValue }) => (
                <Box
                  sx={{
                    background: 'white',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="body2">
                    {indexValue}: ₹{value.toLocaleString()}
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Revenue by Booking Type
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsivePie
              data={Object.entries(byBookingType).map(([type, value]) => ({
                id: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                value,
              }))}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              theme={theme}
              tooltip={({ datum }) => (
                <Box
                  sx={{
                    background: 'white',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="body2">
                    {datum.label}: ₹{datum.value.toLocaleString()} (
                    {((datum.value / Object.values(byBookingType).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Key Revenue Metrics
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Average Revenue per Booking:
              <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                ₹{(Object.values(byBookingType).reduce((a, b) => a + b, 0) / data.length).toFixed(2)}
              </Typography>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Most Popular Booking Type:
              <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                {Object.entries(byBookingType).reduce((a, b) => (b[1] > a[1] ? b : a))[0]}
              </Typography>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Revenue:
              <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                ₹{Object.values(byBookingType).reduce((a, b) => a + b, 0).toLocaleString()}
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RevenueAnalytics;
