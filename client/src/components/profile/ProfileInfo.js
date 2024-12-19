import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import { updateProfile, uploadProfilePicture } from '../../store/slices/profileSlice';

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || '',
    gstin: user?.gstin || '',
    aadharNumber: user?.aadharNumber || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      await dispatch(uploadProfilePicture(formData)).unwrap();
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={user?.profilePicture}
            alt={user?.name}
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            type="file"
            id="profile-picture-input"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-picture-input">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <Box sx={{ ml: 3, flexGrow: 1 }}>
          <Typography variant="h5">{user?.name}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
          <Typography color="text.secondary">{user?.role}</Typography>
        </Box>

        <IconButton onClick={() => setIsEditing(!isEditing)}>
          <EditIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </Grid>

        {user?.role === 'property_owner' && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Company Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                disabled={!isEditing}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
          </>
        )}

        {isEditing && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default ProfileInfo;