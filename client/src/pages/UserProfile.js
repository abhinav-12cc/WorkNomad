import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../components/profile/ProfileInfo';
import PasswordChange from '../components/profile/PasswordChange';
import BookingList from '../components/booking/BookingList';
import { fetchUserBookings } from '../store/slices/bookingSlice';
import { clearProfileState } from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { bookings = [], loading: bookingsLoading, error: bookingsError } = useSelector((state) => state.bookings || {});
  const { loading: profileLoading, error: profileError, success: profileSuccess } = useSelector((state) => state.profile || { loading: false, error: null, success: false });

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(logout());
      navigate('/login');
      return;
    }

    dispatch(fetchUserBookings());
    return () => {
      dispatch(clearProfileState());
    };
  }, [dispatch, isAuthenticated, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    dispatch(clearProfileState());
  };

  if (profileLoading || bookingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          {(profileError || bookingsError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {profileError || bookingsError}
            </Alert>
          )}
          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profile updated successfully!
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Profile Info" />
              <Tab label="Change Password" />
              <Tab label="My Bookings" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ProfileInfo user={user} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PasswordChange />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <BookingList bookings={bookings} loading={bookingsLoading} error={bookingsError} />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
