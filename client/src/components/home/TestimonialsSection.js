import React from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Slider from 'react-slick';

const TestimonialCard = styled(motion(Card))(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    text: 'WorkNomad helped me find the perfect coworking space in Bangalore. The community here is amazing!',
  },
  {
    name: 'Priya Patel',
    role: 'Digital Marketer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    text: 'The coliving spaces are fantastic. .',
  },
  {
    name: 'Amit Kumar',
    role: 'Startup Founder',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    text: 'The meeting rooms are professional and well-equipped. Perfect for client meetings.',
  },
  {
    name: 'Neha Singh',
    role: 'Freelance Designer',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    text: 'Working from different cities is so much easier with WorkNomad. Highly recommended!',
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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
          What Our Users Say
        </Typography>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <Box key={index} sx={{ px: 2 }}>
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
                  <Typography variant="h6" component="p" gutterBottom>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </CardContent>
              </TestimonialCard>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
