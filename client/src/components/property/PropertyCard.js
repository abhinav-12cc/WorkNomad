import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const PropertyTypeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  // Default image URLs based on property type
  const defaultImages = {
    'coworking': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    'coliving': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'meeting-room': 'https://images.unsplash.com/photo-1517502884422-41eaead166d4',
    'private-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    'virtual-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
  };

  const handleClick = () => {
    navigate(`/properties/${property._id}`);
  };

  // Format the location string
  const locationString = property.location ? 
    `${property.location.address}, ${property.location.city}, ${property.location.state}` : 
    'Location not available';

  return (
    <StyledCard
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={property.images?.[0] || defaultImages[property.type] || defaultImages.coworking}
          alt={property.name}
        />
        <PropertyTypeChip
          label={property.type?.replace('-', ' ').toUpperCase()}
          color="primary"
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <FavoriteIcon color="error" />
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom component="h2" noWrap>
          {property.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {locationString}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={property.rating || 4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({property.reviews?.length || '12'} reviews)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary">
            ₹{property.price}/month
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {property.amenities?.includes('wifi') && <WifiIcon color="action" />}
            {property.amenities?.includes('ac') && <AcUnitIcon color="action" />}
            {property.amenities?.includes('parking') && <LocalParkingIcon color="action" />}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PropertyCard;
