import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { initializeAuth } from './store/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import theme from './theme';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/slick.css';

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeAuth()).unwrap();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          navigate('/login');
        }
      }
    };
    init();
  }, [dispatch, navigate]);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:propertyId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
