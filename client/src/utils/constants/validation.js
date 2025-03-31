/**
 * Form Validation Rules
 * Standardized validation rules for form fields across the application
 */

export const VALIDATION_RULES = {
  REQUIRED: {
    required: true,
    message: 'This field is required',
  },
  EMAIL: {
    type: 'email',
    message: 'Please enter a valid email address',
  },
  PASSWORD: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
  },
  PASSWORD_MIN: {
    min: 8,
    message: 'Password must be at least 8 characters',
  },
  MIN_LENGTH: (min) => ({
    min,
    message: `Must be at least ${min} characters`,
  }),
  MAX_LENGTH: (max) => ({
    max,
    message: `Cannot exceed ${max} characters`,
  }),
  PHONE: {
    pattern: /^\+?[0-9]{10,14}$/,
    message: 'Please enter a valid phone number',
  },
  URL: {
    type: 'url',
    message: 'Please enter a valid URL',
  },
  NUMBER: {
    type: 'number',
    message: 'Please enter a valid number',
  },
  INTEGER: {
    pattern: /^[0-9]*$/,
    message: 'Please enter a valid integer',
  },
  MATCH: (field, fieldName = 'passwords') => ({
    validator: (_, value, callback) => {
      if (value && value !== field) {
        return Promise.reject(new Error(`The two ${fieldName} do not match`));
      }
      return Promise.resolve();
    },
  }),
};

export default VALIDATION_RULES;