/**
 * Form Validation Utilities
 * Provides consistent form validation rules and helpers across the application
 */

// Common validation rules
export const validationRules = {
  // User authentication
  username: [
    { required: true, message: 'Username is required' },
    { min: 3, message: 'Username must be at least 3 characters' },
    { max: 50, message: 'Username cannot exceed 50 characters' }
  ],
  
  name: [
    { required: true, message: 'Name is required' },
    { min: 2, message: 'Name must be at least 2 characters' },
    { max: 50, message: 'Name cannot exceed 50 characters' },
    { 
      pattern: /^[a-zA-Z\s'-]+$/, 
      message: 'Name can only contain letters, spaces, hyphens and apostrophes' 
    }
  ],
  
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' },
    { max: 100, message: 'Email cannot exceed 100 characters' }
  ],
  
  password: [
    { required: true, message: 'Password is required' },
    { min: 8, message: 'Password must be at least 8 characters' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  ],
  
  confirmPassword: (getFieldValue) => [
    { required: true, message: 'Please confirm your password' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match'));
      },
    })
  ],
  
  // Exams and questions
  examName: [
    { required: true, message: 'Exam name is required' },
    { min: 3, message: 'Exam name must be at least 3 characters' },
    { max: 100, message: 'Exam name cannot exceed 100 characters' }
  ],
  
  category: [
    { required: true, message: 'Category is required' }
  ],
  
  duration: [
    { required: true, message: 'Duration is required' },
    { type: 'number', message: 'Duration must be a number' },
    { min: 5, message: 'Duration must be at least 5 minutes' }
  ],
  
  totalMarks: [
    { required: true, message: 'Total marks are required' },
    { type: 'number', message: 'Total marks must be a number' },
    { min: 1, message: 'Total marks must be at least 1' }
  ],
  
  passingMarks: [
    { required: true, message: 'Passing marks are required' },
    { type: 'number', message: 'Passing marks must be a number' },
    { min: 1, message: 'Passing marks must be at least 1' }
  ],
  
  price: [
    { type: 'number', message: 'Price must be a number' },
    { min: 0, message: 'Price cannot be negative' }
  ],
  
  questionText: [
    { required: true, message: 'Question text is required' },
    { min: 3, message: 'Question text must be at least 3 characters' }
  ],
  
  options: [
    { required: true, message: 'Options are required' }
  ],
  
  correctOption: [
    { required: true, message: 'Correct option must be selected' }
  ],
  
  // Payment information
  cardNumber: [
    { required: true, message: 'Card number is required' },
    { 
      pattern: /^\d{16}$/, 
      message: 'Please enter a valid 16-digit card number' 
    }
  ],
  
  expiryDate: [
    { required: true, message: 'Expiry date is required' },
    { 
      pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, 
      message: 'Please enter a valid expiry date (MM/YY)' 
    }
  ],
  
  cvv: [
    { required: true, message: 'CVV is required' },
    { 
      pattern: /^\d{3,4}$/, 
      message: 'Please enter a valid CVV (3 or 4 digits)' 
    }
  ]
};

/**
 * Validates if a value is a valid email
 * @param {string} email Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a value is a strong password
 * @param {string} password Password to validate
 * @returns {object} Validation result with isValid flag and reason
 */
export const isStrongPassword = (password) => {
  const result = { isValid: true, reason: [] };
  
  if (!password || password.length < 8) {
    result.isValid = false;
    result.reason.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.reason.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.reason.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    result.isValid = false;
    result.reason.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&#]/.test(password)) {
    result.isValid = false;
    result.reason.push('Password must contain at least one special character (@, $, !, %, *, ?, &, #)');
  }
  
  return result;
};

/**
 * Generate dynamic form rules based on conditions
 * @param {Object} formData Current form values
 * @param {Object} conditions Conditions to check
 * @returns {Object} Dynamic validation rules
 */
export const generateDynamicRules = (formData, conditions) => {
  const rules = {};
  
  Object.keys(conditions).forEach(field => {
    const condition = conditions[field];
    const { when, value, then } = condition;
    
    if (formData[when] === value) {
      rules[field] = then;
    } else if (condition.otherwise) {
      rules[field] = condition.otherwise;
    }
  });
  
  return rules;
};

export default {
  rules: validationRules,
  isValidEmail,
  isStrongPassword,
  generateDynamicRules
};