import React from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TestimonialCard = styled(motion(Card))(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  textAlign: 'center',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    text: 'WorkNomad helped me find the perfect coworking space in Bangalore. The community here is amazing and the facilities are top-notch!',
  },
  {
    name: 'Priya Patel',
    role: 'Digital Marketer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    text: 'The coliving spaces are fantastic. Great amenities, perfect locations, and wonderful community events. It feels like home!',
  },
  {
    name: 'Amit Kumar',
    role: 'Startup Founder',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    text: 'The meeting rooms are professional and well-equipped. Perfect for client meetings and team collaborations. Highly recommended!',
  },
  {
    name: 'Neha Singh',
    role: 'Freelance Designer',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    text: 'Working from different cities is so much easier with WorkNomad. The spaces are beautiful and inspire creativity!',
  },
];

const TestimonialsSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box 
      sx={{ 
        py: 8, 
        bgcolor: 'background.default',
        '.slick-slide': {
          px: 2,
          height: 'auto',
        },
        '.slick-track': {
          display: 'flex',
          alignItems: 'stretch',
        },
        '.slick-dots': {
          bottom: '-40px',
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          What Our Users Say
        </Typography>
        <Box sx={{ mx: -2 }}>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ height: 'auto' }}>
                <TestimonialCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CardContent>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto 1rem',
                        border: '3px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </CardContent>
                </TestimonialCard>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
