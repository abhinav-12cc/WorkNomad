import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { properties } from '../../services/api';

export const fetchOwnerProperties = createAsyncThunk(
  'ownerProperties/fetchOwnerProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await properties.getOwnerProperties();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProperty = createAsyncThunk(
  'ownerProperties/createProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await properties.create(propertyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'ownerProperties/updateProperty',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      const response = await properties.update(id, propertyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  success: false,
  message: ''
};

const ownerPropertySlice = createSlice({
  name: 'ownerProperties',
  initialState,
  reducers: {
    clearPropertyState: (state) => {
      state.properties = [];
      state.selectedProperty = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch owner properties
      .addCase(fetchOwnerProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchOwnerProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch properties';
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Property created successfully';
        state.properties.unshift(action.payload.data);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create property';
      })
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Property updated successfully';
        const index = state.properties.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.properties[index] = action.payload.data;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update property';
      });
  },
});

export const { clearPropertyState, setSelectedProperty } = ownerPropertySlice.actions;
export default ownerPropertySlice.reducer;
