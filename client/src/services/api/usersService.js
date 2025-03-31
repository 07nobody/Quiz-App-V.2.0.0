import apiClient from './client';

/**
 * Users API Service
 * Contains all API calls related to user authentication and management
 */

/**
 * User login
 */
export const loginUser = async (email, password) => {
  return await apiClient.post('/users/login', { email, password });
};

/**
 * User registration
 */
export const registerUser = async (userData) => {
  return await apiClient.post('/users/register', userData);
};

/**
 * Get current user information
 */
export const getUserInfo = async () => {
  return await apiClient.post('/users/get-user-info');
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  return await apiClient.post('/users/get-all-users');
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData) => {
  return await apiClient.post('/users/update-user-profile', userData);
};

/**
 * Forgot password - request password reset
 */
export const forgotPassword = async (email) => {
  return await apiClient.post('/users/forgot-password', { email });
};

/**
 * Verify OTP for password reset
 */
export const verifyOtp = async (email, otp) => {
  return await apiClient.post('/users/verify-otp', { email, otp });
};

/**
 * Reset password with token
 */
export const resetPassword = async (email, newPassword) => {
  return await apiClient.post('/users/reset-password', { email, newPassword });
};