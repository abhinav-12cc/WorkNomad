import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import { fetchOwnerProperties } from '../store/slices/ownerPropertySlice';

const MyProperties = () => {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.ownerProperty);

  useEffect(() => {
    dispatch(fetchOwnerProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Properties
        </Typography>
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

      {properties.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't listed any properties yet
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
    </Container>
  );
};

export default MyProperties;
