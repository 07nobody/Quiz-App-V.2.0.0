/**
 * Collection of helper functions used throughout the quiz application
 */

/**
 * Converts seconds to a formatted time string (HH:MM:SS)
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const secondsToTimeString = (seconds) => {
  if (!seconds && seconds !== 0) return '--:--';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hrs > 0) {
    parts.push(String(hrs).padStart(2, '0'));
  }
  
  parts.push(String(mins).padStart(2, '0'));
  parts.push(String(secs).padStart(2, '0'));
  
  return parts.join(':');
};

/**
 * Calculates letter grade and color based on percentage score
 * @param {number} percentage - Score as a percentage (0-100)
 * @returns {Object} Object with letter grade and corresponding color class
 */
export const calculateGradeLabel = (percentage) => {
  if (!percentage && percentage !== 0) return { letter: '--', color: '' };
  
  if (percentage >= 90) return { letter: 'A', color: 'excellent' };
  if (percentage >= 80) return { letter: 'B', color: 'good' };
  if (percentage >= 70) return { letter: 'C', color: 'good' };
  if (percentage >= 60) return { letter: 'D', color: 'average' };
  return { letter: 'F', color: 'poor' };
};

/**
 * Format a date with relative time (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative date string
 */
export const getRelativeTimeString = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const dateObj = new Date(date);
    const diffMs = now - dateObj;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return dateObj.toLocaleDateString();
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

/**
 * Truncate text with ellipsis if it exceeds the specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis or original text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate a random color based on text input (consistent for same input)
 * @param {string} text - Text to generate color from
 * @returns {string} Hex color code
 */
export const getConsistentColor = (text) => {
  if (!text) return '#1890ff';
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Calculate percentage from two numbers
 * @param {number} value - The partial value
 * @param {number} total - The total value
 * @returns {number} Percentage value (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format number with commas as thousands separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Shuffles array elements in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};