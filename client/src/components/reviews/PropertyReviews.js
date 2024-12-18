import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPropertyReviews,
  clearReviewState,
  setCurrentPage,
} from '../../store/slices/reviewSlice';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import ReportReviewDialog from './ReportReviewDialog';

const PropertyReviews = ({
  propertyId,
  isOwner,
  currentUserId,
  userBookings,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const {
    reviews,
    totalReviews,
    averageRating,
    ratingDistribution,
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.reviews);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchPropertyReviews({ propertyId, page: currentPage }));
    return () => {
      dispatch(clearReviewState());
    };
  }, [dispatch, propertyId, currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setReviewDialogOpen(true);
  };

  const handleReportReview = (review) => {
    setSelectedReview(review);
    setReportDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false);
    setSelectedReview(null);
    dispatch(fetchPropertyReviews({ propertyId, page: 1 }));
  };

  const handleReportSuccess = () => {
    setReportDialogOpen(false);
    setSelectedReview(null);
  };

  // Check if user has a completed booking that hasn't been reviewed
  const canWriteReview = userBookings?.some(
    (booking) =>
      booking.status === 'completed' &&
      !reviews.some((review) => review.bookingId === booking._id)
  );

  return (
    <Box>
      <ReviewList
        reviews={reviews}
        totalReviews={totalReviews}
        averageRating={averageRating}
        ratingDistribution={ratingDistribution}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isOwner={isOwner}
        currentUserId={currentUserId}
        onEdit={handleEditReview}
        onReport={handleReportReview}
      />

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedReview ? 'Edit Review' : 'Write a Review'}
          <IconButton
            onClick={() => setReviewDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReviewForm
            propertyId={propertyId}
            bookingId={selectedReview?.bookingId}
            existingReview={selectedReview}
            onSuccess={handleReviewSuccess}
            loading={loading}
            error={error}
          />
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <ReportReviewDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        review={selectedReview}
        onSuccess={handleReportSuccess}
      />
    </Box>
  );
};

export default PropertyReviews;
