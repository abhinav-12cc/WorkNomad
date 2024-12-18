import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, setPage } from '../store/slices/propertySlice';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';

const PropertyListing = () => {
  const dispatch = useDispatch();
  const propertiesState = useSelector((state) => state.properties) || {
    properties: [],
    loading: false,
    error: null,
    filters: {},
    pagination: { page: 1, limit: 10, total: 0 }
  };

  const { properties, loading, error, filters, pagination } = propertiesState;

  useEffect(() => {
    const searchParams = {
      ...filters,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
    };
    dispatch(fetchProperties(searchParams));
  }, [dispatch, filters, pagination?.page, pagination?.limit]);

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Properties
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <PropertyFilters />
        </Grid>

        <Grid item xs={12} md={9}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && (!properties || properties.length === 0) ? (
            <Alert severity="info">No properties found matching your criteria.</Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {properties?.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property._id}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>

              {pagination?.total > pagination?.limit && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={Math.ceil((pagination?.total || 0) / (pagination?.limit || 10))}
                    page={pagination?.page || 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyListing;
