import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  IconButton,
  Card,
  CardMedia,
  ImageList,
  ImageListItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { properties } from '../../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await properties.getById(id);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch property details');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Property not found</Typography>
      </Box>
    );
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'Wi-Fi':
        return <WifiIcon />;
      case 'Parking':
        return <LocalParkingIcon />;
      case 'Air Conditioning':
        return <AcUnitIcon />;
      case 'Meeting Rooms':
        return <MeetingRoomIcon />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {property.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" color="text.secondary">
            {property.location.address}, {property.location.city}, {property.location.state}
          </Typography>
        </Box>
      </Paper>

      {/* Image Gallery */}
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <ImageList
          sx={{ width: '100%', height: 450 }}
          variant="quilted"
          cols={isMobile ? 1 : 4}
          rowHeight={isMobile ? 450 : 200}
        >
          {property.images.map((image, index) => (
            <ImageListItem
              key={index}
              cols={index === 0 ? 2 : 1}
              rows={index === 0 ? 2 : 1}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${image}`}
                alt={`Property ${index + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              About this space
            </Typography>
            <Typography variant="body1" paragraph>
              {property.description}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {property.amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  icon={getAmenityIcon(amenity)}
                  label={amenity}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              ₹{property.price}
              <Typography component="span" variant="subtitle1" color="text.secondary">
                {' '}/ day
              </Typography>
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Property Type
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {property.type}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {property.location.city}, {property.location.state}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetails;
