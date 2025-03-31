/**
 * Application Constants
 * Centralized location for all constants used throughout the application
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Exam types
export const EXAM_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  PRACTICE: 'practice'
};

// Question types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer'
};

// Pagination defaults
export const PAGINATION = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '25', '50', '100']
};

// API response status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SETTINGS: 'settings'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  EXAMS: '/admin/exams',
  USER_EXAMS: '/available-exams',
  REPORTS_ADMIN: '/admin/reports',
  REPORTS_USER: '/user/reports',
  WRITE_EXAM: '/user/write-exam'
};

// Form validation rules
export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: 'This field is required!' },
  EMAIL: { type: 'email', message: 'Please enter a valid email address!' },
  PASSWORD: { min: 6, message: 'Password must be at least 6 characters!' },
  PHONE: { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
};