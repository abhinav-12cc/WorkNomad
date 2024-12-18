import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties';

export const fetchAvailability = createAsyncThunk(
  'availability/fetchAvailability',
  async ({ propertyId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/${propertyId}/availability`,
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

export const updateAvailability = createAsyncThunk(
  'availability/updateAvailability',
  async ({ propertyId, availabilityData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${propertyId}/availability`,
        availabilityData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const setBlockedDates = createAsyncThunk(
  'availability/setBlockedDates',
  async ({ propertyId, dates, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${propertyId}/blocked-dates`,
        { dates, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOperatingHours = createAsyncThunk(
  'availability/updateOperatingHours',
  async ({ propertyId, operatingHours }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${propertyId}/operating-hours`,
        { operatingHours },
        {
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
  availability: [],
  blockedDates: [],
  operatingHours: {},
  loading: false,
  error: null,
  success: false,
};

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    clearAvailabilityState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload.availability;
        state.blockedDates = action.payload.blockedDates;
        state.operatingHours = action.payload.operatingHours;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch availability';
      })
      // Update Availability
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.availability = action.payload.availability;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update availability';
      })
      // Set Blocked Dates
      .addCase(setBlockedDates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(setBlockedDates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blockedDates = action.payload.blockedDates;
      })
      .addCase(setBlockedDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to set blocked dates';
      })
      // Update Operating Hours
      .addCase(updateOperatingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOperatingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operatingHours = action.payload.operatingHours;
      })
      .addCase(updateOperatingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update operating hours';
      });
  },
});

export const { clearAvailabilityState } = availabilitySlice.actions;
export default availabilitySlice.reducer;
