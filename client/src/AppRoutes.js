import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './store/slices/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PropertyDetails from './pages/PropertyDetails';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import Properties from './pages/Properties';
import AboutUs from './pages/AboutUs';
import QueryForm from './pages/QueryForm';

// Components
import PrivateRoute from './components/routing/PrivateRoute';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token && !initialized) {
        try {
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            navigate('/login');
          }
        }
      }
      setInitialized(true);
    };
    init();
  }, [dispatch, navigate, initialized]);

  if (loading && !initialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/query" element={<QueryForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-property"
        element={
          <PrivateRoute>
            <AddProperty />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-properties"
        element={
          <PrivateRoute>
            <MyProperties />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
