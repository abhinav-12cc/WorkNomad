import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { fetchProperties } from '../store/slices/propertySlice';
import PropertyCard from '../components/property/PropertyCard';

const SearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { properties, loading } = useSelector(state => state.properties);
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const params = {
      type: searchParams.get('type'),
      location: searchParams.get('location'),
      amenities: searchParams.get('amenities'),
    };
    dispatch(fetchProperties(params));
  }, [dispatch, location.search]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      
      {properties.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No properties found matching your criteria
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item key={property._id} xs={12} sm={6} md={4}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
