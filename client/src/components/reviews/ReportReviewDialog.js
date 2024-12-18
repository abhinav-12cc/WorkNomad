import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const reportReasons = [
  'Inappropriate content',
  'Fake review',
  'Spam',
  'Harassment',
  'Personal information',
  'Other',
];

const ReportReviewDialog = ({ open, onClose, review, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason for reporting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/reviews/${review._id}/report`,
        {
          reason,
          details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setDetails('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Review</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Review by {review?.user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {review?.comment?.substring(0, 100)}
            {review?.comment?.length > 100 ? '...' : ''}
          </Typography>
        </Box>

        <Typography gutterBottom>
          Please select a reason for reporting this review:
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
          <RadioGroup
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {reportReasons.map((r) => (
              <FormControlLabel
                key={r}
                value={r}
                control={<Radio />}
                label={r}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Please provide any additional information about your report..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !reason}
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportReviewDialog;
