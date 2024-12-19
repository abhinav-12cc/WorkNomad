import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';

const BASE_URL = 'http://localhost:5003/api';

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  }
};

// Helper function to clear all auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  delete api.defaults.headers.common['Authorization'];
};

// Load token on app start
const loadToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Initial state
const initialState = {
  token: loadToken(),
  isAuthenticated: !!loadToken(),
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  success: false
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, userData);
      if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      clearAuthData();
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, credentials);
      if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      clearAuthData();
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/users/profile`);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to get user profile');
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await api.put('/api/users/profile', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

// Update profile picture
export const updateProfilePicture = createAsyncThunk(
  'auth/updateProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Profile picture update error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile picture');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Password change error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to change password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      clearAuthData();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Profile Picture
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
