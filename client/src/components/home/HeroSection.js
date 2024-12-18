import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroContainer = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1497366216548-37526070297c")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
}));

const ScrollDownIndicator = styled(motion.div)({
  position: 'absolute',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  cursor: 'pointer',
});

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <HeroContainer>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Find Your Perfect Workspace
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                Discover coworking spaces, coliving options, and more across India.
                Work from anywhere, live everywhere.
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/properties')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '30px',
                  }}
                >
                  Explore Spaces
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      <ScrollDownIndicator
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Typography variant="body2" align="center">
          Scroll Down
        </Typography>
        <Box
          sx={{
            width: '24px',
            height: '24px',
            margin: '0 auto',
            borderLeft: '2px solid white',
            borderBottom: '2px solid white',
            transform: 'rotate(-45deg)',
          }}
        />
      </ScrollDownIndicator>
    </HeroContainer>
  );
};

export default HeroSection;
