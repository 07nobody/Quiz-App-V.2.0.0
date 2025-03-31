/**
 * Application Routes
 * Centralized route definitions to avoid hard-coding throughout the app
 */

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Admin routes
  HOME: '/',
  EXAMS: '/admin/exams',
  ADD_EXAM: '/admin/exams/add',
  EDIT_EXAM: '/admin/exams/edit', // Append ID for specific exam
  REPORTS_ADMIN: '/admin/reports',
  
  // User routes
  USER_HOME: '/user',
  USER_EXAMS: '/available-exams',
  WRITE_EXAM: '/user/write-exam', // Append ID for specific exam
  USER_RESULTS: '/user/results', // Append ID for specific result
  REPORTS_USER: '/user/reports',
  PROFILE: '/profile',

  // Common routes
  NOT_FOUND: '/404'
};

export default ROUTES;