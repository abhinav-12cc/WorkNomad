import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              WorkNomad
            </Typography>
            <Typography variant="body2">
              Connecting freelancers and remote workers with the perfect workspace across India.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link
                component={RouterLink}
                to="/properties"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Find Spaces
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email: support@worknomad.in
            </Typography>
            <Typography variant="body2">
              Phone: +91 XXXXXXXXXX
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} WorkNomad. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
