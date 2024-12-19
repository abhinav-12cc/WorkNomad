import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/query' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
    ],
    'For Developers': [
      { name: 'Find Workspace', path: '/search' },
      { name: 'How it Works', path: '/how-it-works' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Support', path: '/support' },
    ],
    'For Property Owners': [
      { name: 'List Property', path: '/add-property' },
      { name: 'Partner with Us', path: '/partner' },
      { name: 'Success Stories', path: '/success-stories' },
      { name: 'Resources', path: '/resources' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 4, sm: 6 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Social Links */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                display: 'block',
                mb: 2,
              }}
            >
              WorkNomad
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Find your perfect workspace and connect with property owners worldwide.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                {category}
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
              >
                {links.map((link) => (
                  <Box
                    component="li"
                    key={link.name}
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      component={Link}
                      to={link.path}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: { xs: 4, sm: 6 },
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {new Date().getFullYear()} WorkNomad. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Typography
              component={Link}
              to="/privacy"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component={Link}
              to="/terms"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              component={Link}
              to="/cookies"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Cookie Policy
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
