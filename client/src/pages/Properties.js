import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import PropertyCard from '../components/property/PropertyCard';
import { fetchProperties } from '../store/slices/propertySlice';

const Properties = () => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
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
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'transparent' }}>
        <Typography variant="h4" gutterBottom>
          Available Properties
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover your perfect workspace or living space from our curated collection of properties.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property._id} xs={12} sm={6} md={4}>
            <PropertyCard property={property} />
          </Grid>
        ))}
        {properties.length === 0 && !loading && !error && (
          <Grid item xs={12}>
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No properties available at the moment.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Properties;
