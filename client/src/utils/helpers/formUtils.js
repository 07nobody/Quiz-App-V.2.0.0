import { message } from 'antd';

/**
 * Utility functions for working with forms across the application
 */

/**
 * Handle form submission with standardized loading state and error handling
 * @param {Function} submissionFn - The async function that performs the submission
 * @param {Object} options - Configuration options
 * @param {string} options.successMessage - Message to show on success
 * @param {string} options.errorMessage - Message to show on error
 * @param {Function} options.onSuccess - Callback on successful submission
 * @param {Function} options.onError - Callback on error
 * @param {Function} options.setLoading - Function to set loading state
 */
export const handleFormSubmission = async (submissionFn, options = {}) => {
  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'Something went wrong. Please try again.',
    onSuccess,
    onError,
    setLoading
  } = options;
  
  try {
    // Set loading state if provided
    if (setLoading) setLoading(true);
    
    // Execute the submission function
    const response = await submissionFn();
    
    // Handle successful response
    if (response?.data?.success) {
      message.success(response.data.message || successMessage);
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data);
      }
      return true;
    } else {
      // API returned success:false
      message.error(response?.data?.message || errorMessage);
      if (onError && typeof onError === 'function') {
        onError(response?.data);
      }
      return false;
    }
  } catch (error) {
    // Handle errors
    const errorMsg = error.response?.data?.message || errorMessage;
    message.error(errorMsg);
    
    if (onError && typeof onError === 'function') {
      onError(error);
    }
    console.error('Form submission error:', error);
    return false;
  } finally {
    // Clear loading state if provided
    if (setLoading) setLoading(false);
  }
};

/**
 * Validate file upload based on type, size, and other constraints
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in MB
 * @param {Array<string>} options.allowedTypes - Array of allowed MIME types
 * @param {number} options.maxDimension - Max image dimension in pixels (for images)
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5, // Default 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    maxDimension = 2000 // Default 2000px
  } = options;
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `File type not supported. Please upload ${allowedTypes.join(', ')}`;
  }
  
  // Check file size (convert MB to bytes)
  const maxSizeInBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `File size must be less than ${maxSize}MB`;
  }
  
  // For images, check dimensions
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (img.width > maxDimension || img.height > maxDimension) {
            resolve(`Image dimensions should be less than ${maxDimension}px`);
          }
          resolve(true);
        };
      };
    });
  }
  
  return true;
};