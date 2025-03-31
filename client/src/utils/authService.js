/**
 * Authentication Service
 * Handles secure authentication token management
 */

import { axiosInstance } from '../services/api';
import Cookies from 'js-cookie';

// Constants for cookie names
const TOKEN_COOKIE = 'quiz_auth_token';
const USER_COOKIE = 'quiz_user_data';
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: 7 // 7 days
};

/**
 * Store auth data securely
 * Uses secure HTTP-only cookies in production
 */
export const setAuth = (token, userData) => {
  // Store token in a secure way
  if (token) {
    // For production, token should be stored as HTTP-only cookie via backend
    // This is a frontend fallback
    Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
    
    // Set auth header for all future requests
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  // Store user data (non-sensitive) for UI needs
  if (userData) {
    // Remove sensitive data before storing
    const { password, ...safeUserData } = userData;
    const userJson = JSON.stringify(safeUserData);
    Cookies.set(USER_COOKIE, userJson, COOKIE_OPTIONS);
  }
};

/**
 * Get stored authentication token
 */
export const getToken = () => {
  return Cookies.get(TOKEN_COOKIE);
};

/**
 * Get stored user data
 */
export const getUserData = () => {
  const userJson = Cookies.get(USER_COOKIE);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(USER_COOKIE);
  delete axiosInstance.defaults.headers.common['Authorization'];
};

/**
 * Update only user data (preserve token)
 */
export const updateUserData = (userData) => {
  const { password, ...safeUserData } = userData;
  const userJson = JSON.stringify(safeUserData);
  Cookies.set(USER_COOKIE, userJson, COOKIE_OPTIONS);
};

/**
 * Check if user has required role
 */
export const hasRole = (requiredRole) => {
  const userData = getUserData();
  
  // If no user data or no required role, default to false
  if (!userData) return false;
  
  // Check admin role
  if (requiredRole === 'admin') {
    return userData.isAdmin === true;
  }
  
  // Check user role
  if (requiredRole === 'user') {
    return userData.isAdmin === false;
  }
  
  // No matching role
  return false;
};

export default {
  setAuth,
  getToken,
  getUserData,
  isAuthenticated,
  clearAuth,
  updateUserData,
  hasRole
};