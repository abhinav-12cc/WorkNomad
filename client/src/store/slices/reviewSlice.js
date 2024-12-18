import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

export const fetchPropertyReviews = createAsyncThunk(
  'reviews/fetchPropertyReviews',
  async ({ propertyId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/property/${propertyId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ propertyId, bookingId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/property/${propertyId}`,
        { ...reviewData, bookingId },
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

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/${reviewId}`,
        reviewData,
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

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const respondToReview = createAsyncThunk(
  'reviews/respondToReview',
  async ({ reviewId, response }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.post(
        `${API_URL}/${reviewId}/response`,
        { response },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reviews: [],
  userReviews: [],
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
  loading: false,
  error: null,
  success: false,
  message: '',
  currentPage: 1,
  totalPages: 1,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Property Reviews
      .addCase(fetchPropertyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalReviews = action.payload.total;
        state.averageRating = action.payload.averageRating;
        state.ratingDistribution = action.payload.ratingDistribution;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPropertyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch reviews';
      })
      // Fetch User Reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch user reviews';
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Review submitted successfully';
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to submit review';
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Review updated successfully';
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update review';
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Review deleted successfully';
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete review';
      })
      // Respond to Review
      .addCase(respondToReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(respondToReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Response added successfully';
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(respondToReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to add response';
      });
  },
});

export const { clearReviewState, setCurrentPage } = reviewSlice.actions;
export default reviewSlice.reducer;
