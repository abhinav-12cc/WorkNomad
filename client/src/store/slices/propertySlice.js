import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Fetch all properties
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/properties`, { params: searchParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch properties');
    }
  }
);

// Fetch single property
export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/properties/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch property');
    }
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  filters: {
    type: '',
    location: '',
    priceRange: [0, 10000],
    amenities: [],
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch properties cases
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.properties = [];
      })
      // Fetch single property cases
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProperty = null;
      });
  },
});

export const { setFilters, setPage, clearFilters } = propertySlice.actions;
export default propertySlice.reducer;
