import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import ChangePassword from './ChangePassword';
import PropertyCard from '../property/PropertyCard';
import { fetchOwnerProperties } from '../../store/slices/ownerPropertySlice';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PropertyOwnerProfile = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { properties, loading, error, success, message } = useSelector((state) => state.ownerProperty);

  useEffect(() => {
    dispatch(fetchOwnerProperties());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Profile Information" />
            <Tab label="My Properties" />
            <Tab label="Change Password" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProfileInfo user={user} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">My Properties ({properties.length})</Typography>
            <Button
              component={Link}
              to="/add-property"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Property
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : properties.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                You haven't listed any properties yet.
              </Typography>
              <Button
                component={Link}
                to="/add-property"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Add Your First Property
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item key={property._id} xs={12} sm={6} md={4}>
                  <PropertyCard property={property} isOwner={true} />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ChangePassword />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default PropertyOwnerProfile;
