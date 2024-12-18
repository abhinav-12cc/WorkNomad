import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

export const fetchPropertyAnalytics = createAsyncThunk(
  'analytics/fetchPropertyAnalytics',
  async ({ propertyId, timeRange }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/property/${propertyId}`,
        {
          params: { timeRange },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBookingTrends = createAsyncThunk(
  'analytics/fetchBookingTrends',
  async ({ propertyId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/property/${propertyId}/trends`,
        {
          params: { startDate, endDate },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'analytics/fetchRevenueAnalytics',
  async ({ propertyId, timeRange }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/property/${propertyId}/revenue`,
        {
          params: { timeRange },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOccupancyRates = createAsyncThunk(
  'analytics/fetchOccupancyRates',
  async ({ propertyId, timeRange }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/property/${propertyId}/occupancy`,
        {
          params: { timeRange },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  overview: {
    totalBookings: 0,
    totalRevenue: 0,
    averageOccupancy: 0,
    averageRating: 0,
  },
  bookingTrends: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  revenue: {
    data: [],
    byBookingType: {},
  },
  occupancy: {
    daily: [],
    monthly: [],
    byWeekday: {},
  },
  popularTimeSlots: [],
  customerSegments: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Property Analytics
      .addCase(fetchPropertyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.popularTimeSlots = action.payload.popularTimeSlots;
        state.customerSegments = action.payload.customerSegments;
      })
      .addCase(fetchPropertyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch analytics';
      })
      // Fetch Booking Trends
      .addCase(fetchBookingTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingTrends = action.payload;
      })
      .addCase(fetchBookingTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch booking trends';
      })
      // Fetch Revenue Analytics
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch revenue analytics';
      })
      // Fetch Occupancy Rates
      .addCase(fetchOccupancyRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOccupancyRates.fulfilled, (state, action) => {
        state.loading = false;
        state.occupancy = action.payload;
      })
      .addCase(fetchOccupancyRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch occupancy rates';
      });
  },
});

export const { clearAnalyticsState } = analyticsSlice.actions;
export default analyticsSlice.reducer;
