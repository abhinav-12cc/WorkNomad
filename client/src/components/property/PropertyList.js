import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteProperty, setSelectedProperty } from '../../store/slices/ownerPropertySlice';

const PropertyList = ({ properties, onEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedProperty, setSelectedPropertyLocal] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleMenuClick = (event, property) => {
    setAnchorEl(event.currentTarget);
    setSelectedPropertyLocal(property);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPropertyLocal(null);
  };

  const handleEditClick = () => {
    if (selectedProperty) {
      dispatch(setSelectedProperty(selectedProperty));
      onEdit(selectedProperty);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedProperty) {
      await dispatch(deleteProperty(selectedProperty._id));
    }
    setDeleteDialogOpen(false);
  };

  const getPropertyTypeLabel = (type) => {
    const types = {
      'coworking': 'Coworking Space',
      'coliving': 'Coliving Space',
      'meeting-room': 'Meeting Room',
      'private-office': 'Private Office',
      'virtual-office': 'Virtual Office',
    };
    return types[type] || type;
  };

  return (
    <>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} md={6} lg={4} key={property._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={property.images?.[0] || '/default-property.jpg'}
                alt={property.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                    {property.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, property)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Chip
                  label={getPropertyTypeLabel(property.type)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {property.address.city}, {property.address.state}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {property.capacity} people
                  </Typography>
                </Box>

                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Pricing
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Hourly
                    </Typography>
                    <Typography variant="body1">₹{property.pricing.hourly}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Daily
                    </Typography>
                    <Typography variant="body1">₹{property.pricing.daily}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly
                    </Typography>
                    <Typography variant="body1">₹{property.pricing.monthly}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this property? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PropertyList;
