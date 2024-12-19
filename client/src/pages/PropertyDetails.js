import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchPropertyById } from '../store/slices/propertySlice';

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProperty: property, loading, error } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Property not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Property Images */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
              {property.images && property.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`Property ${index + 1}`}
                  sx={{
                    width: 300,
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* Property Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {property.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {property.location?.address}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Description
            </Typography>
            <Typography paragraph color="text.secondary">
              {property.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {property.amenities?.map((amenity) => (
                <Chip key={amenity} label={amenity} variant="outlined" />
              ))}
            </Box>
          </Grid>

          {/* Property Info */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Property Info
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  Type
                </Typography>
                <Typography variant="h6">
                  {property.type}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  Price
                </Typography>
                <Typography variant="h6">
                  ${property.price} / month
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  Owner
                </Typography>
                <Typography>
                  {property.owner?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.owner?.email}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PropertyDetails;
