import axios from "axios";

// Determine the API base URL with fallbacks
const getBaseUrl = () => {
  // Try to use environment variable if available
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'production') {
    // In production, use relative URL to avoid CORS issues
    return '';
  }
  
  // In development, default to localhost:5000 (matching your server port)
  return "http://localhost:5000";
};

// Define API prefix once to ensure consistency
const apiPrefix = '/api';

export const axiosInstance = axios.create({
  baseURL: `${getBaseUrl()}${apiPrefix}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout to prevent timeout issues during development
});

// Add a request interceptor to include the Authorization header and normalize paths
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Auto-fix double prefix issues (when path starts with /api/ but baseURL already has /api)
    if (config.url.startsWith('/api/') && config.baseURL.endsWith('/api')) {
      config.url = config.url.replace('/api/', '/');
    }
    
    // Add performance mark to track request timing
    if (typeof performance !== 'undefined') {
      const requestId = `${config.method}-${config.url}-${Date.now()}`;
      config.requestId = requestId;
      performance.mark(`request-start-${requestId}`);
    }
    
    // Debug log in development - using console.debug to avoid cluttering main console
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling and performance monitoring
axiosInstance.interceptors.response.use(
  (response) => {
    // Measure response time
    if (typeof performance !== 'undefined' && response.config.requestId) {
      const requestId = response.config.requestId;
      performance.mark(`request-end-${requestId}`);
      
      try {
        performance.measure(
          `Request ${response.config.url}`, 
          `request-start-${requestId}`,
          `request-end-${requestId}`
        );
        
        // Check for slow responses (> 500ms)
        const performanceEntries = performance.getEntriesByName(`Request ${response.config.url}`);
        if (performanceEntries.length > 0 && performanceEntries[0].duration > 500) {
          console.warn(`Slow API request (${Math.round(performanceEntries[0].duration)}ms): ${response.config.url}`);
        }
      } catch (e) {
        // Ignore errors in performance measurement
      }
    }
    
    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Network errors
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error - server might be down or unreachable");
    }
    
    // Authentication errors
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      localStorage.removeItem("token");
      
      // Don't redirect during API calls to avoid disrupting the user experience
      // Instead, set a flag that the main app can check
      window.sessionStorage.setItem('auth_error', 'true');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check server connectivity
export const checkServerConnectivity = async () => {
  try {
    // Use a simple health check endpoint with a short timeout
    await axios.get(`${getBaseUrl()}${apiPrefix}/health-check`, { 
      timeout: 3000,
      // Don't throw errors for non-200 responses
      validateStatus: () => true
    });
    return true;
  } catch (error) {
    console.error("Server connectivity check failed:", error.message);
    return false;
  }
};
