import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { changePassword } from '../../store/slices/authSlice';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })).unwrap();
      
      setSuccess('Password changed successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} maxWidth="sm">
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        type="password"
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        type="password"
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        margin="normal"
        required
        helperText="Password must be at least 6 characters long"
      />

      <TextField
        fullWidth
        type="password"
        label="Confirm New Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
