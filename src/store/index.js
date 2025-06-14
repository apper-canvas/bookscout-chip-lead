import { configureStore } from '@reduxjs/toolkit';
import authReducer, { checkAuth } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

// Check authentication on app start
store.dispatch(checkAuth());

export default store;