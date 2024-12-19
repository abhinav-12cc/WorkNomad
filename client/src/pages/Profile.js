import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import { updateProfile, clearError, updateProfilePicture, changePassword } from '../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    occupation: '',
    linkedinUrl: '',
    skills: '',
  });
  const [message, setMessage] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        occupation: user.occupation || '',
        linkedinUrl: user.linkedinUrl || '',
        skills: user.skills ? user.skills.join(', ') : '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      setMessage('Profile updated successfully!');
      setEditMode(false);
      const timer = setTimeout(() => {
        setMessage('');
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
    };
    dispatch(updateProfile(updatedData));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    try {
      // Dispatch password change action here
      dispatch(changePassword(passwordData));
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordError('');
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      occupation: user.occupation || '',
      linkedinUrl: user.linkedinUrl || '',
      skills: user.skills ? user.skills.join(', ') : '',
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      // Dispatch profile picture update action here
      dispatch(updateProfilePicture(formData));
      // After successful upload, the user object should be updated with the new image URL
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Please login to view your profile</Alert>
      </Container>
    );
  }

  const renderField = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value || 'Not provided'}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Picture Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={user.profilePicture}
            alt={user.name}
            sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer' }}
            onClick={handleProfilePictureClick}
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 0,
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
            onClick={handleProfilePictureClick}
          >
            <PhotoCameraIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.role === 'developer' ? 'Developer Profile' : 'Property Owner Profile'}
        </Typography>
      </Paper>

      {/* Account Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Account Information</Typography>
            <IconButton color="primary" onClick={() => setOpenPasswordDialog(true)}>
              <LockIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {renderField('Email', user.email)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderField('Phone Number', user.phone)}
            </Grid>
            {user.role === 'owner' && (
              <>
                <Grid item xs={12} sm={6}>
                  {renderField('Business Name', user.businessName)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField('Business Address', user.businessAddress)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField('Aadhar Number', user.aadharNumber)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField('GSTIN', user.gstin)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField('Properties Listed', user.propertyCount)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField('Total Reviews Received', user.likesCount)}
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Editable Information */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Profile Information
          </Typography>
          {!editMode ? (
            <IconButton color="primary" onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton color="primary" onClick={handleSubmit} disabled={loading}>
                <SaveIcon />
              </IconButton>
              <IconButton color="error" onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {editMode ? (
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            ) : (
              renderField('Occupation', formData.occupation)
            )}
          </Grid>
          {user.role === 'developer' && (
            <Grid item xs={12}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="Skills (comma-separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  helperText="Enter skills separated by commas"
                />
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {user.skills?.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    )) || <Typography>No skills added</Typography>}
                  </Box>
                </Box>
              )}
            </Grid>
          )}
          <Grid item xs={12}>
            {editMode ? (
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
              />
            ) : (
              renderField('LinkedIn URL', formData.linkedinUrl)
            )}
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
