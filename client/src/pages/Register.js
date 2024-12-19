import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'developer';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    workEmail: '',
    aadharNumber: '',
    businessAddress: '',
    businessName: '',
    gstin: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation based on user type
    if (userType === 'developer') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.workEmail) {
        errors.workEmail = 'Work email is required';
      } else if (!validateEmail(formData.workEmail)) {
        errors.workEmail = 'Please enter a valid work email address';
      }
    }

    // Phone validation
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Developer specific validation
    if (userType === 'developer' && !formData.occupation) {
      errors.occupation = 'Occupation/Role is required';
    }

    // Property owner specific validation
    if (userType === 'owner') {
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business company name is required';
      }
      if (!formData.aadharNumber) {
        errors.aadharNumber = 'Aadhar number is required';
      } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
        errors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
      }
      if (!formData.businessAddress) {
        errors.businessAddress = 'Business address is required';
      }
      if (!formData.gstin) {
        errors.gstin = 'GSTIN is required';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
        errors.gstin = 'Please enter a valid GSTIN';
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      const { confirmPassword, agreeToTerms, firstName, lastName, ...registerData } = formData;
      
      // Combine first and last name
      const userData = {
        ...registerData,
        name: `${firstName} ${lastName}`,
        role: userType, // Add role field
        email: userType === 'developer' ? registerData.email : registerData.workEmail, // Use appropriate email field
      };

      try {
        await dispatch(register(userData)).unwrap();
        navigate('/');
      } catch (err) {
        console.error('Registration failed:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {userType === 'developer' ? 'Join as Developer' : 'Register as Property Owner'}
        </Typography>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            p: 3,
            width: '100%',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id={userType === 'developer' ? 'email' : 'workEmail'}
                label={userType === 'developer' ? 'Email Address' : 'Work Email'}
                name={userType === 'developer' ? 'email' : 'workEmail'}
                autoComplete="email"
                value={userType === 'developer' ? formData.email : formData.workEmail}
                onChange={handleChange}
                error={!!formErrors[userType === 'developer' ? 'email' : 'workEmail']}
                helperText={formErrors[userType === 'developer' ? 'email' : 'workEmail']}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            {userType === 'developer' && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="occupation"
                  label="Occupation/Role"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  error={!!formErrors.occupation}
                  helperText={formErrors.occupation}
                  disabled={loading}
                />
              </Grid>
            )}
            {userType === 'owner' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="businessName"
                    label="Business Company Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={!!formErrors.businessName}
                    helperText={formErrors.businessName}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="aadharNumber"
                    label="Aadhar Number"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    error={!!formErrors.aadharNumber}
                    helperText={formErrors.aadharNumber}
                    disabled={loading}
                    inputProps={{ maxLength: 12 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="businessAddress"
                    label="Business Address"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    error={!!formErrors.businessAddress}
                    helperText={formErrors.businessAddress}
                    disabled={loading}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="gstin"
                    label="GSTIN"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    error={!!formErrors.gstin}
                    helperText={formErrors.gstin}
                    disabled={loading}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    color="primary"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                }
                label="I agree to the terms and conditions"
              />
              {formErrors.agreeToTerms && (
                <Typography color="error" variant="caption" display="block">
                  {formErrors.agreeToTerms}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: 'primary.main' }}>
                Sign in
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
