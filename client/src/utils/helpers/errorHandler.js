import { message } from 'antd';

/**
 * Standard API error handler to provide consistent error handling across the application
 * @param {Error} error - The error object from API call
 * @param {Object} options - Optional configuration
 * @param {string} options.defaultMessage - Default message to show if error has no message
 * @param {boolean} options.showNotification - Whether to show notification (defaults to true)
 * @param {Function} options.callback - Optional callback to execute after error handling
 * @returns {string} The error message
 */
export const handleApiError = (error, options = {}) => {
  const {
    defaultMessage = 'Something went wrong. Please try again later.',
    showNotification = true,
    callback
  } = options;

  // Extract the error message
  const errorResponse = error.response?.data;
  const errorMessage = errorResponse?.message || defaultMessage;
  
  // Log the error for debugging
  console.error('API Error:', error);
  
  // Show notification if needed
  if (showNotification) {
    message.error(errorMessage);
  }
  
  // Execute callback if provided
  if (callback && typeof callback === 'function') {
    callback(error);
  }
  
  return errorMessage;
};

/**
 * Function to handle session timeout/auth errors
 * @param {Error} error - The error object
 * @param {Function} logoutFn - The logout function to call
 * @returns {boolean} True if it was an auth error and handled
 */
export const handleAuthError = (error, logoutFn) => {
  const status = error.response?.status;
  
  if (status === 401) {
    message.error('Your session has expired. Please log in again.');
    if (logoutFn && typeof logoutFn === 'function') {
      logoutFn();
    } else {
      // Fallback if no logout function provided
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return true;
  }
  
  return false;
};