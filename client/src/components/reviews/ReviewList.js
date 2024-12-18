import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import ReviewItem from './ReviewItem';

const ReviewList = ({
  reviews,
  totalReviews,
  averageRating,
  ratingDistribution,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  isOwner,
  currentUserId,
  onEdit,
  onReport,
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRating(event.target.value);
  };

  const getTotalByRating = (rating) => {
    return ratingDistribution[rating] || 0;
  };

  const getRatingPercentage = (rating) => {
    return ((getTotalByRating(rating) / totalReviews) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Reviews Summary */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={averageRating}
            readOnly
            precision={0.1}
            sx={{ mr: 1 }}
          />
          <Typography variant="h5" sx={{ mr: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ({totalReviews} reviews)
          </Typography>
        </Box>

        {/* Rating Distribution */}
        <Box sx={{ mb: 3 }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Box
              key={rating}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography sx={{ minWidth: 60 }}>
                {rating} stars
              </Typography>
              <Box sx={{ flexGrow: 1, mx: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Number(getRatingPercentage(rating))}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Typography sx={{ minWidth: 60 }}>
                {getTotalByRating(rating)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Filters and Sort */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort by">
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="helpful">Most Helpful</MenuItem>
            <MenuItem value="highest">Highest Rated</MenuItem>
            <MenuItem value="lowest">Lowest Rated</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterRating}
            onChange={handleFilterChange}
            label="Rating"
          >
            <MenuItem value="all">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>

        <Stack
          direction="row"
          spacing={1}
          sx={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <Chip label="Verified Stays" color="primary" />
          <Chip label="With Photos" variant="outlined" />
        </Stack>
      </Stack>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
          No reviews found.
        </Typography>
      ) : (
        <Box>
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              isOwner={isOwner}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onReport={onReport}
            />
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ReviewList;
