import { useState } from 'react';
import { Form, notification } from 'antd';

/**
 * Custom hook for managing form state and submission
 * Provides standardized form handling with loading states, error handling,
 * and success/error notifications
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.onSubmit - Async function to handle form submission
 * @param {String} options.successMessage - Message to show on success notification
 * @param {String} options.errorMessage - Default message to show on error notification
 * @param {Function} options.onSuccess - Optional callback after successful submission
 * @param {Function} options.onError - Optional callback after submission error
 * @param {Boolean} options.resetOnSubmit - Whether to reset form after successful submission
 * @param {Boolean} options.showNotifications - Whether to show success/error notifications
 * @returns {Object} Form state and handlers
 */
const useFormState = ({
  initialValues = {},
  onSubmit,
  successMessage = 'Operation completed successfully!',
  errorMessage = 'An error occurred. Please try again.',
  onSuccess,
  onError,
  resetOnSubmit = false,
  showNotifications = true,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset form to initial values
  const resetForm = () => {
    form.resetFields();
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Call the provided submit handler
      const response = await onSubmit(values);
      
      setSuccess(true);
      
      // Show success notification if enabled
      if (showNotifications) {
        notification.success({
          message: 'Success',
          description: successMessage,
          placement: 'topRight',
        });
      }
      
      // Reset form if configured
      if (resetOnSubmit) {
        resetForm();
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response, values);
      }
      
      return response;
    } catch (err) {
      // Handle error
      const errorMsg = err.response?.data?.message || err.message || errorMessage;
      
      setError({
        message: errorMsg,
        details: err.response?.data?.errors || {},
        original: err,
      });
      
      // Show error notification if enabled
      if (showNotifications) {
        notification.error({
          message: 'Error',
          description: errorMsg,
          placement: 'topRight',
        });
      }
      
      // Call error callback if provided
      if (onError) {
        onError(err, values);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    success,
    resetForm,
    handleSubmit,
    setError,
  };
};

export default useFormState;