import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../redux/loaderSlice';
import { useMessage } from '../components/MessageProvider';

/**
 * Custom hook to handle API calls with loading state and error handling
 * @returns {Object} API call utilities
 */
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const message = useMessage();
  
  /**
   * Execute an API call with loading state and error handling
   * @param {Function} apiFunction - The API function to call
   * @param {Object} params - Parameters to pass to the API function
   * @param {Object} options - Additional options
   * @param {boolean} options.showGlobalLoader - Whether to show the global loader
   * @param {boolean} options.showSuccessMessage - Whether to show a success message
   * @param {boolean} options.showErrorMessage - Whether to show an error message
   * @param {string} options.successMessage - Custom success message
   * @param {Function} options.onSuccess - Callback on success
   * @param {Function} options.onError - Callback on error
   */
  const callApi = useCallback(async (
    apiFunction, 
    params = {}, 
    {
      showGlobalLoader = true,
      showSuccessMessage = false,
      showErrorMessage = true,
      successMessage = 'Operation successful',
      onSuccess = null,
      onError = null
    } = {}
  ) => {
    try {
      // Show loading state
      setLoading(true);
      if (showGlobalLoader) {
        dispatch(ShowLoading());
      }
      
      // Call the API
      const response = await apiFunction(params);
      
      // Hide loading state
      setLoading(false);
      if (showGlobalLoader) {
        dispatch(HideLoading());
      }
      
      // Handle response
      if (response.success) {
        if (showSuccessMessage) {
          message.success(response.message || successMessage);
        }
        if (onSuccess) {
          onSuccess(response.data);
        }
        return { success: true, data: response.data };
      } else {
        if (showErrorMessage) {
          message.error(response.message || 'Something went wrong');
        }
        if (onError) {
          onError(response.message);
        }
        return { success: false, message: response.message };
      }
    } catch (error) {
      // Hide loading state
      setLoading(false);
      if (showGlobalLoader) {
        dispatch(HideLoading());
      }
      
      // Handle error
      const errorMessage = error.message || 'Something went wrong';
      if (showErrorMessage) {
        message.error(errorMessage);
      }
      if (onError) {
        onError(errorMessage);
      }
      return { success: false, message: errorMessage };
    }
  }, [dispatch, message]);
  
  return {
    loading,
    callApi
  };
};

export default useApiCall;