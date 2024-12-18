import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  Fab,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnerProperties,
  clearPropertyState,
} from '../../store/slices/ownerPropertySlice';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';
import PropertyStats from './PropertyStats';

const PropertyManagement = () => {
  const [formOpen, setFormOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    properties,
    selectedProperty,
    loading,
    error,
    success,
    stats,
  } = useSelector((state) => state.ownerProperties);

  useEffect(() => {
    dispatch(fetchOwnerProperties());
    return () => {
      dispatch(clearPropertyState());
    };
  }, [dispatch]);

  const handleFormClose = () => {
    setFormOpen(false);
    dispatch(clearPropertyState());
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    dispatch(fetchOwnerProperties());
  };

  const handleEdit = () => {
    setFormOpen(true);
  };

  return (
    <Box>
      {/* Stats Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <PropertyStats stats={stats} loading={loading} />
      </Box>

      {/* Properties Section */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          My Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Property
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Property updated successfully
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PropertyList
          properties={properties}
          onEdit={handleEdit}
        />
      )}

      {/* Property Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <PropertyForm
            property={selectedProperty}
            onSuccess={handleFormSuccess}
            loading={loading}
            error={error}
          />
        </DialogContent>
      </Dialog>

      {/* Mobile FAB for adding property */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Fab
          color="primary"
          onClick={() => setFormOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default PropertyManagement;
