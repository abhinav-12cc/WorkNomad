import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';

const AboutUs = () => {
  const features = [
    {
      icon: <WorkIcon fontSize="large" color="primary" />,
      title: 'Find Your Perfect Workspace',
      description: 'Discover and book professional workspaces that match your needs, from private offices to coworking spaces.',
    },
    {
      icon: <GroupIcon fontSize="large" color="primary" />,
      title: 'Connect with Property Owners',
      description: 'Direct communication with verified property owners ensures you find the right space for your work style.',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Booking Process',
      description: 'Our platform ensures secure transactions and verified listings for a worry-free booking experience.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About WorkNomad
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connecting Digital Nomads with Perfect Workspaces
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper elevation={3} sx={{ p: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          At WorkNomad, we're revolutionizing the way digital professionals find and book workspaces. 
          Our platform connects remote workers, freelancers, and digital nomads with property owners 
          offering unique and professional work environments.
        </Typography>
        <Typography variant="body1">
          We believe that the right workspace can inspire creativity, boost productivity, and foster 
          professional growth. Our mission is to make finding that perfect workspace as simple and 
          secure as possible.
        </Typography>
      </Paper>

      {/* Key Features */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          What We Offer
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Digital Nomads
                </Typography>
                <Typography variant="body2" paragraph>
                  1. Create your profile and specify your workspace preferences
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Browse through our curated list of workspaces
                </Typography>
                <Typography variant="body2" paragraph>
                  3. Connect with property owners and book your ideal workspace
                </Typography>
                <Typography variant="body2">
                  4. Enjoy your productive work environment
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Property Owners
                </Typography>
                <Typography variant="body2" paragraph>
                  1. List your workspace with detailed information and photos
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Receive booking requests from verified professionals
                </Typography>
                <Typography variant="body2" paragraph>
                  3. Manage your listings and communicate with potential clients
                </Typography>
                <Typography variant="body2">
                  4. Grow your business with our platform
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Information */}
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" paragraph>
          Have questions or suggestions? We'd love to hear from you!
        </Typography>
        <Typography variant="body1" paragraph>
          Email: support@worknomad.com
        </Typography>
        <Typography variant="body1">
          Follow us on social media for updates and workspace inspiration.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUs;
