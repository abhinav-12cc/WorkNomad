import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import FeaturedProperties from '../components/home/FeaturedProperties';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Easy Search',
      description: 'Find your perfect workspace with our advanced search filters.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60',
    },
    {
      icon: <WorkIcon fontSize="large" color="primary" />,
      title: 'Professional Spaces',
      description: 'Access high-quality workspaces verified by our team.',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500&q=60',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Booking',
      description: 'Book with confidence using our secure payment system.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=60',
    },
    {
      icon: <StarIcon fontSize="large" color="primary" />,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from real users.',
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=500&q=60',
    },
  ];

  const workspaceImages = [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=60',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=60',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=60',
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 6, sm: 8, md: 10 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: { xs: '100%', md: '90%' } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    fontSize: {
                      xs: '2rem',
                      sm: '2.5rem',
                      md: '3rem',
                    },
                    lineHeight: 1.2,
                  }}
                >
                  Find Your Perfect Workspace
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 3, md: 4 },
                    fontSize: {
                      xs: '1.1rem',
                      sm: '1.25rem',
                      md: '1.5rem',
                    },
                    lineHeight: 1.5,
                  }}
                >
                  Connect with property owners and discover ideal workspaces for your needs.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 3 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/search')}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { sm: '200px' },
                    }}
                  >
                    Find Workspace
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/about')}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {workspaceImages.slice(0, 2).map((image, index) => (
                      <Paper
                        key={index}
                        elevation={3}
                        sx={{
                          height: index === 0 ? '300px' : '200px',
                          overflow: 'hidden',
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`Workspace ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        height: '400px',
                        overflow: 'hidden',
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={workspaceImages[2]}
                        alt="Workspace 3"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Paper>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: { xs: 3, sm: 4, md: 6 },
            fontSize: {
              xs: '1.75rem',
              sm: '2rem',
              md: '2.5rem',
            },
            fontWeight: 'bold',
          }}
        >
          Why Choose WorkNomad
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                  height="140"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2, transform: 'scale(1.2)' }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: {
                        xs: '1.1rem',
                        sm: '1.25rem',
                      },
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: '0.875rem',
                        sm: '1rem',
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Box
        sx={{
          bgcolor: 'background.default',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 3, sm: 4, md: 6 },
              fontSize: {
                xs: '1.75rem',
                sm: '2rem',
                md: '2.5rem',
              },
              fontWeight: 'bold',
            }}
          >
            Featured Workspaces
          </Typography>
          <FeaturedProperties />
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            zIndex: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backgroundBlendMode: 'multiply',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem',
              },
              fontWeight: 'bold',
            }}
          >
            Ready to Find Your Workspace?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 3, sm: 4 },
              opacity: 0.9,
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.25rem',
              },
              px: { xs: 2, sm: 4, md: 8 },
            }}
          >
            Join thousands of professionals who have found their perfect workspace through WorkNomad.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 4, sm: 6 },
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
              },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '200px' },
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;