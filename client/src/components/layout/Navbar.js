import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const authLinks = (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About Us
        </Button>
        <Button color="inherit" component={Link} to="/query">
          Contact Us
        </Button>
        {user?.role === 'owner' && (
          <>
            <Button color="inherit" component={Link} to="/add-property">
              Add Property
            </Button>
            <Button color="inherit" component={Link} to="/my-properties">
              My Properties
            </Button>
          </>
        )}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {user?.profilePicture ? (
            <Avatar 
              src={`http://localhost:5003${user.profilePicture}`}
              alt={user?.name}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <AccountCircleIcon />
          )}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Mobile Menu */}
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls="menu-mobile"
          aria-haspopup="true"
          onClick={handleMobileMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-mobile"
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/" onClick={handleClose}>
            Home
          </MenuItem>
          <MenuItem component={Link} to="/about" onClick={handleClose}>
            About Us
          </MenuItem>
          <MenuItem component={Link} to="/query" onClick={handleClose}>
            Contact Us
          </MenuItem>
          {user?.role === 'owner' && (
            <>
              <MenuItem component={Link} to="/add-property" onClick={handleClose}>
                Add Property
              </MenuItem>
              <MenuItem component={Link} to="/my-properties" onClick={handleClose}>
                My Properties
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </>
  );

  const guestLinks = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/about">
        About Us
      </Button>
      <Button color="inherit" component={Link} to="/query">
        Contact Us
      </Button>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
      <Button color="inherit" component={Link} to="/register">
        Register
      </Button>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          WorkNomad
        </Typography>
        {isAuthenticated ? authLinks : guestLinks}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
