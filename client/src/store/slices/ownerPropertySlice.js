import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties';

export const fetchOwnerProperties = createAsyncThunk(
  'ownerProperties/fetchOwnerProperties',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProperty = createAsyncThunk(
  'ownerProperties/createProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, propertyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'ownerProperties/updateProperty',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/${id}`, propertyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadPropertyImages = createAsyncThunk(
  'ownerProperties/uploadImages',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/${id}/images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'ownerProperties/deleteProperty',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  stats: {
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  },
};

const ownerPropertySlice = createSlice({
  name: 'ownerProperties',
  initialState,
  reducers: {
    clearPropertyState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
      state.selectedProperty = null;
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Owner Properties
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
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Property created successfully';
        state.properties.unshift(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create property';
      })
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Property updated successfully';
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update property';
      })
      // Upload Images
      .addCase(uploadPropertyImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPropertyImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Images uploaded successfully';
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(uploadPropertyImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to upload images';
      })
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Property deleted successfully';
        state.properties = state.properties.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete property';
      });
  },
});

export const { clearPropertyState, setSelectedProperty } = ownerPropertySlice.actions;
export default ownerPropertySlice.reducer;
