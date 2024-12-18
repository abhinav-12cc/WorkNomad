import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../../store/slices/reviewSlice';

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const ReviewForm = ({
  propertyId,
  bookingId,
  existingReview,
  onSuccess,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    cleanliness: existingReview?.aspects?.cleanliness || 0,
    location: existingReview?.aspects?.location || 0,
    amenities: existingReview?.aspects?.amenities || 0,
    value: existingReview?.aspects?.value || 0,
  });
  const [hover, setHover] = useState(-1);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      aspects: {
        cleanliness: formData.cleanliness,
        location: formData.location,
        amenities: formData.amenities,
        value: formData.value,
      },
    };

    const action = existingReview
      ? updateReview({ reviewId: existingReview._id, reviewData })
      : createReview({ propertyId, bookingId, reviewData });

    const result = await dispatch(action);
    if (!result.error) {
      onSuccess();
    }
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRatingChange = (field) => (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {existingReview ? 'Edit Review' : 'Write a Review'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={3}>
        {/* Overall Rating */}
        <Box>
          <Typography component="legend" gutterBottom>
            Overall Rating
          </Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange('rating')}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            size="large"
            required
          />
          {formData.rating !== null && (
            <Typography sx={{ ml: 2 }}>
              {ratingLabels[hover !== -1 ? hover : formData.rating]}
            </Typography>
          )}
        </Box>

        {/* Review Title */}
        <TextField
          fullWidth
          label="Review Title"
          value={formData.title}
          onChange={handleChange('title')}
          required
        />

        {/* Detailed Ratings */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Rate Different Aspects
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 100 }}>Cleanliness</Typography>
                <Rating
                  value={formData.cleanliness}
                  onChange={handleRatingChange('cleanliness')}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 100 }}>Location</Typography>
                <Rating
                  value={formData.location}
                  onChange={handleRatingChange('location')}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 100 }}>Amenities</Typography>
                <Rating
                  value={formData.amenities}
                  onChange={handleRatingChange('amenities')}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ minWidth: 100 }}>Value</Typography>
                <Rating
                  value={formData.value}
                  onChange={handleRatingChange('value')}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Review Comment */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Review"
          value={formData.comment}
          onChange={handleChange('comment')}
          required
          helperText="Describe your experience (minimum 50 characters)"
          error={formData.comment.length > 0 && formData.comment.length < 50}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || formData.comment.length < 50 || !formData.rating}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : existingReview ? (
              'Update Review'
            ) : (
              'Submit Review'
            )}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ReviewForm;
