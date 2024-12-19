import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddPropertyForm from '../components/property/AddPropertyForm';

const AddProperty = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Property
        </Typography>
        <Typography variant="body1" color="text.secondary">
          List your workspace or coliving space on WorkNomad
        </Typography>
      </Box>
      <AddPropertyForm />
    </Container>
  );
};

export default AddProperty;
