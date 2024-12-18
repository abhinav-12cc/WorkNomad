import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BusinessIcon from '@mui/icons-material/Business';

const FeatureCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const features = [
  {
    icon: <WorkIcon fontSize="large" />,
    title: 'Coworking Spaces',
    description: 'Modern workspaces designed for productivity and networking.',
  },
  {
    icon: <HomeIcon fontSize="large" />,
    title: 'Coliving Spaces',
    description: 'Comfortable living spaces perfect for digital nomads and remote workers.',
  },
  {
    icon: <MeetingRoomIcon fontSize="large" />,
    title: 'Meeting Rooms',
    description: 'Professional meeting spaces equipped with modern amenities.',
  },
  {
    icon: <BusinessIcon fontSize="large" />,
    title: 'Private Offices',
    description: 'Dedicated office spaces for teams and businesses.',
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          What We Offer
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardContent>
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;