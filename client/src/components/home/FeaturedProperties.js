import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Chip,
  Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const featuredProperties = [
  {
    id: 1,
    title: 'Modern Co-working Space',
    location: 'Mumbai, Maharashtra',
    price: '₹5,000/month',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=60',
    amenities: ['WiFi', 'Parking', 'AC'],
    description: 'Stylish and modern co-working space with all amenities.',
  },
  {
    id: 2,
    title: 'Creative Studio Office',
    location: 'Bangalore, Karnataka',
    price: '₹6,500/month',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=60',
    amenities: ['WiFi', 'AC', '24/7 Access'],
    description: 'Perfect for creative professionals and small teams.',
  },
  {
    id: 3,
    title: 'Premium Business Center',
    location: 'Delhi, NCR',
    price: '₹8,000/month',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=60',
    amenities: ['WiFi', 'Parking', 'Conference Room'],
    description: 'High-end business center with premium facilities.',
  },
];

const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case 'WiFi':
      return <WifiIcon fontSize="small" />;
    case 'Parking':
      return <LocalParkingIcon fontSize="small" />;
    case 'AC':
      return <AcUnitIcon fontSize="small" />;
    default:
      return null;
  }
};

const FeaturedProperties = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Featured Properties
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Discover our handpicked selection of premium properties
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {featuredProperties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              elevation={2}
            >
              <CardMedia
                component="img"
                height="200"
                image={property.image}
                alt={property.title}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  {property.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon
                    sx={{ color: 'text.secondary', fontSize: '1.1rem', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={property.rating}
                    precision={0.1}
                    size="small"
                    readOnly
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({property.rating})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {property.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {property.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      icon={getAmenityIcon(amenity)}
                      label={amenity}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {property.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          component="a"
          href="/properties"
          variant="contained"
          color="primary"
          size="large"
        >
          View All Properties
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedProperties;
