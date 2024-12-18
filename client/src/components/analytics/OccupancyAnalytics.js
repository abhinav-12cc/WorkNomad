import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveBar } from '@nivo/bar';
import {
  Paper,
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

const OccupancyAnalytics = ({ daily, monthly, byWeekday, timeRange, onTimeRangeChange }) => {
  const theme = {
    tooltip: {
      container: {
        background: '#fff',
        fontSize: 12,
        borderRadius: 4,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  };

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Occupancy Calendar</Typography>
            <FormControl size="small">
              <Select
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
              >
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ height: 200 }}>
            <ResponsiveCalendar
              data={daily.map(d => ({
                day: d.date,
                value: d.occupancyRate,
              }))}
              from={daily[0]?.date}
              to={daily[daily.length - 1]?.date}
              emptyColor="#eeeeee"
              colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              theme={theme}
              tooltip={({ day, value }) => (
                <Box
                  sx={{
                    background: 'white',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="body2">
                    {day}: {value}% occupancy
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
            Monthly Occupancy Rates
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveBar
              data={monthly}
              keys={['occupancyRate']}
              indexBy="month"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear', min: 0, max: 100 }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Occupancy Rate (%)',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelFormat={value => `${value}%`}
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
                    {indexValue}: {value}% occupancy
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
            Occupancy by Day of Week
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveBar
              data={weekdays.map(day => ({
                day,
                occupancyRate: byWeekday[day] || 0,
              }))}
              keys={['occupancyRate']}
              indexBy="day"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear', min: 0, max: 100 }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Day of Week',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Average Occupancy Rate (%)',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelFormat={value => `${value}%`}
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
                    {indexValue}: {value}% average occupancy
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OccupancyAnalytics;
