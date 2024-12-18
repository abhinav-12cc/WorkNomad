import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

const BookingTrendsChart = ({ data, timeRange, onTimeRangeChange }) => {
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
    grid: {
      line: {
        stroke: '#ddd',
        strokeWidth: 1,
      },
    },
    crosshair: {
      line: {
        stroke: '#666',
        strokeWidth: 1,
        strokeOpacity: 0.5,
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
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Booking Trends</Typography>
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
        <ResponsiveLine
          data={[
            {
              id: 'bookings',
              data: data.map((d) => ({
                x: d.date,
                y: d.count,
              })),
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 0,
            max: 'auto',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Bookings',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          axisBottom={{
            format: '%b %d',
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 40,
            legendPosition: 'middle',
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableGridX={false}
          theme={theme}
          curve="monotoneX"
          enableArea={true}
          areaOpacity={0.1}
          crosshairType="cross"
          tooltip={({ point }) => (
            <Box
              sx={{
                background: 'white',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <Typography variant="body2">
                {point.data.xFormatted}: {point.data.y} bookings
              </Typography>
            </Box>
          )}
        />
      </Box>
    </Paper>
  );
};

export default BookingTrendsChart;
