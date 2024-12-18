import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Collapse,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { deleteReview, respondToReview } from '../../store/slices/reviewSlice';

const ReviewItem = ({
  review,
  isOwner,
  onEdit,
  onReport,
  canRespond,
  currentUserId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [helpful, setHelpful] = useState(
    review.helpfulVotes.includes(currentUserId)
  );
  const dispatch = useDispatch();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteReview(review._id));
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(review);
    handleMenuClose();
  };

  const handleReport = () => {
    onReport(review);
    handleMenuClose();
  };

  const handleResponseSubmit = async () => {
    if (response.trim()) {
      await dispatch(respondToReview({ reviewId: review._id, response }));
      setResponse('');
      setShowResponse(false);
    }
  };

  const handleHelpfulToggle = () => {
    // This would typically make an API call to toggle the helpful vote
    setHelpful(!helpful);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={review.user.avatar}
            alt={review.user.name}
            sx={{ mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1">{review.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>
        {(isOwner || currentUserId === review.user._id) && (
          <>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {currentUserId === review.user._id && (
                <MenuItem onClick={handleEdit}>Edit Review</MenuItem>
              )}
              {currentUserId === review.user._id && (
                <MenuItem onClick={handleDelete}>Delete Review</MenuItem>
              )}
              {isOwner && !review.ownerResponse && (
                <MenuItem onClick={() => setShowResponse(true)}>Respond</MenuItem>
              )}
              {!isOwner && currentUserId !== review.user._id && (
                <MenuItem onClick={handleReport}>Report Review</MenuItem>
              )}
            </Menu>
          </>
        )}
      </Box>

      <Typography variant="h6" gutterBottom>
        {review.title}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Rating value={review.rating} readOnly precision={0.5} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Stayed in {format(new Date(review.bookingDate), 'MMMM yyyy')}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {review.comment}
      </Typography>

      {/* Detailed Ratings */}
      <Stack
        direction="row"
        spacing={3}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        <Box>
          <Typography variant="caption">Cleanliness</Typography>
          <Rating
            value={review.aspects.cleanliness}
            readOnly
            size="small"
            precision={0.5}
          />
        </Box>
        <Box>
          <Typography variant="caption">Location</Typography>
          <Rating
            value={review.aspects.location}
            readOnly
            size="small"
            precision={0.5}
          />
        </Box>
        <Box>
          <Typography variant="caption">Amenities</Typography>
          <Rating
            value={review.aspects.amenities}
            readOnly
            size="small"
            precision={0.5}
          />
        </Box>
        <Box>
          <Typography variant="caption">Value</Typography>
          <Rating
            value={review.aspects.value}
            readOnly
            size="small"
            precision={0.5}
          />
        </Box>
      </Stack>

      {/* Owner Response */}
      {review.ownerResponse && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Response from the owner
          </Typography>
          <Typography variant="body2">{review.ownerResponse}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Responded on{' '}
            {format(new Date(review.ownerResponseDate), 'MMM d, yyyy')}
          </Typography>
        </Box>
      )}

      {/* Response Form */}
      <Collapse in={showResponse}>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response..."
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setShowResponse(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleResponseSubmit}
              disabled={!response.trim()}
            >
              Submit Response
            </Button>
          </Box>
        </Box>
      </Collapse>

      <Divider sx={{ my: 2 }} />

      {/* Review Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          size="small"
          startIcon={
            helpful ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />
          }
          onClick={handleHelpfulToggle}
        >
          Helpful ({review.helpfulVotes.length})
        </Button>
        <Button
          size="small"
          startIcon={<FlagIcon />}
          onClick={handleReport}
          sx={{ ml: 'auto' }}
        >
          Report
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewItem;
