import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';
import reviewReducer from './slices/reviewSlice';
import analyticsReducer from './slices/analyticsSlice';
import profileReducer from './slices/profileSlice';
import ownerPropertyReducer from './slices/ownerPropertySlice';
import availabilityReducer from './slices/availabilitySlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    booking: bookingReducer,
    review: reviewReducer,
    analytics: analyticsReducer,
    profile: profileReducer,
    ownerProperty: ownerPropertyReducer,
    availability: availabilityReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
