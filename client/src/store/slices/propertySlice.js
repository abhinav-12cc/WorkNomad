import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Action Creators
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/properties', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch properties' });
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/properties/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch property' });
    }
  }
);

export const fetchOwnerProperties = createAsyncThunk(
  'properties/fetchOwnerProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/properties/owner');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch owner properties' });
    }
  }
);

export const addProperty = createAsyncThunk(
  'properties/addProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/properties', propertyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to add property' });
    }
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  ownerProperties: [],
  loading: false,
  error: null,
  success: false
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties || [];
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch properties';
      })

      // Fetch Property By ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProperty = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch property';
      })

      // Fetch Owner Properties
      .addCase(fetchOwnerProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProperties = action.payload;
      })
      .addCase(fetchOwnerProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch owner properties';
      })

      // Add Property
      .addCase(addProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.properties.unshift(action.payload);
        state.ownerProperties.unshift(action.payload);
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to add property';
        state.success = false;
      });
  }
});

export const { clearError, setSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
