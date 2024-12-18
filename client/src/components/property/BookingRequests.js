import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPropertyBookings,
  updateBookingStatus,
} from '../../store/slices/bookingSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

const BookingRequests = ({ propertyId }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialog, setRejectDialog] = useState(false);
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchPropertyBookings(propertyId));
  }, [dispatch, propertyId]);

  const handleApprove = async (bookingId) => {
    await dispatch(updateBookingStatus({
      bookingId,
      status: 'approved',
    }));
  };

  const handleReject = async () => {
    if (selectedBooking && rejectReason) {
      await dispatch(updateBookingStatus({
        bookingId: selectedBooking._id,
        status: 'rejected',
        reason: rejectReason,
      }));
      setRejectDialog(false);
      setSelectedBooking(null);
      setRejectReason('');
    }
  };

  const openRejectDialog = (booking) => {
    setSelectedBooking(booking);
    setRejectDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">
                      {booking.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.user.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(booking.startDate), 'PPP')}
                    </Typography>
                    <Typography variant="body2">
                      to {format(new Date(booking.endDate), 'PPP')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {booking.bookingType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    ₹{booking.totalAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status.toUpperCase()}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(booking._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => openRejectDialog(booking)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No booking requests found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog}
        onClose={() => setRejectDialog(false)}
      >
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason for Rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={!rejectReason}
          >
            Reject Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingRequests;
