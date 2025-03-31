/**
 * Centralized error handling utility for consistent error management across the application
 */

import { message } from 'antd';

// Define common error messages for better user experience
const ERROR_MESSAGES = {
  // Network errors
  NETWORK: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER_DOWN: 'Our servers are currently unavailable. Please try again later.',
  
  // Authentication errors
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  
  // Resource errors
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This operation conflicts with the current state.',
  
  // Form validation
  VALIDATION: 'Please check your inputs and try again.',
  
  // Generic fallbacks
  GENERIC: 'Something went wrong. Please try again.',
  UNKNOWN: 'An unexpected error occurred.',
};

// Map HTTP status codes to user-friendly messages
const getMessageByStatus = (status) => {
  switch (status) {
    case 400: return ERROR_MESSAGES.VALIDATION;
    case 401: return ERROR_MESSAGES.UNAUTHORIZED;
    case 403: return ERROR_MESSAGES.FORBIDDEN;
    case 404: return ERROR_MESSAGES.NOT_FOUND;
    case 409: return ERROR_MESSAGES.CONFLICT;
    case 500: return ERROR_MESSAGES.SERVER_DOWN;
    default: return ERROR_MESSAGES.GENERIC;
  }
};

/**
 * Process error object and extract meaningful information
 * @param {Error|Object} error - Error object to process
 * @returns {Object} Processed error with user-friendly message and details
 */
const processError = (error) => {
  // Default error shape
  const processedError = {
    message: ERROR_MESSAGES.UNKNOWN,
    details: null,
    originalError: error,
    status: null,
  };
  
  if (!error) {
    return processedError;
  }

  // Handle axios error response
  if (error.response) {
    const { status, data } = error.response;
    processedError.status = status;
    processedError.message = getMessageByStatus(status);
    
    // Extract more details if available
    if (data) {
      if (data.message) {
        processedError.message = data.message;
      }
      if (data.details || data.errors) {
        processedError.details = data.details || data.errors;
      }
    }
  } 
  // Handle network errors
  else if (error.request) {
    processedError.message = ERROR_MESSAGES.NETWORK;
  } 
  // Handle timeout
  else if (error.code === 'ECONNABORTED') {
    processedError.message = ERROR_MESSAGES.TIMEOUT;
  } 
  // Handle regular Error objects
  else if (error.message) {
    processedError.message = error.message;
  }
  
  return processedError;
};

/**
 * Show an error message to the user
 * @param {Error|Object} error - Error to display
 * @param {Object} options - Display options
 */
const showError = (error, options = {}) => {
  const processedError = processError(error);
  const displayMessage = options.message || processedError.message;
  
  if (options.console !== false) {
    console.error('Error:', processedError);
  }
  
  // Use Ant Design message for simple error display
  message.error({
    content: displayMessage,
    duration: options.duration || 5,
    key: options.key || 'error',
  });
  
  // Optional callbacks
  if (typeof options.onShow === 'function') {
    options.onShow(processedError);
  }
  
  // Handle session expiry
  if (processedError.status === 401 && options.handleUnauthorized !== false) {
    // Clear user data from storage
    localStorage.removeItem('token');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }
  
  return processedError;
};

/**
 * Wrapper for try-catch blocks to reduce boilerplate
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Error handling options
 */
const tryCatch = async (fn, options = {}) => {
  try {
    return await fn();
  } catch (error) {
    // Don't show UI error if silent option is enabled
    if (!options.silent) {
      showError(error, options);
    }
    
    // Optionally rethrow for further handling
    if (options.rethrow) {
      throw error;
    }
    
    return null;
  }
};

/**
 * Format form validation errors from backend into a format compatible with Ant Design forms
 * @param {Object} validationErrors - Backend validation errors
 * @returns {Object} Error object for Ant Design form setFields
 */
const formatFormErrors = (validationErrors) => {
  if (!validationErrors) return {};
  
  const formattedErrors = {};
  
  Object.keys(validationErrors).forEach(field => {
    formattedErrors[field] = {
      validateStatus: 'error',
      help: Array.isArray(validationErrors[field]) 
        ? validationErrors[field][0] 
        : validationErrors[field]
    };
  });
  
  return formattedErrors;
};

// Export the error handling API
const errorHandler = {
  getMessageByStatus,
  processError,
  showError,
  tryCatch,
  formatFormErrors,
  messages: ERROR_MESSAGES
};

export default errorHandler;