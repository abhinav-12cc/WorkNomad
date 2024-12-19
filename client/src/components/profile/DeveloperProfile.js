import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Avatar,
} from '@mui/material';
import { Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateProfile, uploadProfilePicture } from '../../store/slices/profileSlice';

const DeveloperProfile = ({ user, profilePicture, loading }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    occupation: user?.occupation || '',
    skills: user?.skills || '',
    linkedinUrl: user?.linkedinUrl || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleProfilePictureChange = async (event) => {
    if (!event.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('profilePicture', event.target.files[0]);

    try {
      await dispatch(uploadProfilePicture(formData)).unwrap();
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={profilePicture || user?.profilePicture}
            alt={user?.name}
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            type="file"
            id="profile-picture-input"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
            disabled={loading}
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
              disabled={loading}
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <Box sx={{ ml: 3, flexGrow: 1 }}>
          <Typography variant="h5">{user?.name}</Typography>
          <Typography color="textSecondary">{user?.email}</Typography>
          <Typography color="textSecondary">{user?.phone}</Typography>
        </Box>

        <IconButton onClick={() => setIsEditing(!isEditing)} disabled={loading}>
          <EditIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Skills/Expertise"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              disabled={!isEditing || loading}
              multiline
              rows={3}
              helperText="Enter your skills separated by commas"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              disabled={!isEditing || loading}
              helperText="Enter your LinkedIn profile URL"
            />
          </Grid>

          {isEditing && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

export default DeveloperProfile;
