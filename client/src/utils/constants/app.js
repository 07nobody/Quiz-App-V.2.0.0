/**
 * Application Constants
 * General application constants and configuration values
 */

// Application metadata
export const APP_NAME = 'Quiz Application';
export const APP_DESCRIPTION = 'An interactive platform for creating and taking quizzes';
export const APP_VERSION = '1.0.0';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

// Time constants (in milliseconds)
export const DEBOUNCE_DELAY = 500;
export const NOTIFICATION_DURATION = 4500;
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// API endpoints base
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Question types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SINGLE_CHOICE: 'single_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  MATCHING: 'matching',
};

// Exam status types
export const EXAM_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
  DRAFT: 'draft',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};