import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, uploadProfilePicture, clearProfileState } from '../../store/slices/profileSlice';

const ProfileInfo = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, profilePicture } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(clearProfileState());
    };
  }, [dispatch]);

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

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={profilePicture || user.profilePicture}
            alt={user.name}
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
          <Typography variant="h5">{user.name}</Typography>
          <Typography color="textSecondary">{user.email}</Typography>
        </Box>

        <IconButton onClick={() => setIsEditing(!isEditing)} disabled={loading}>
          <EditIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={!isEditing || loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                    disabled={loading}
                  />
                ))}
              </Box>
            </Box>

            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Add Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  disabled={loading}
                />
                <Button
                  onClick={handleAddSkill}
                  variant="outlined"
                  disabled={loading}
                >
                  Add
                </Button>
              </Box>
            )}
          </Grid>

          {isEditing && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

export default ProfileInfo;
