import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ bgcolor: 'background.default' }}>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </Box>
    </motion.div>
  );
};

export default Home;