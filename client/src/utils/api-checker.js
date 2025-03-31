/**
 * API Endpoint Checker Utility
 * 
 * This utility helps debug API endpoint issues by logging the full URL
 * that will be used for API requests.
 */

import { axiosInstance } from "../apicalls";

/**
 * Logs the full URL that would be used for an API request
 * @param {string} endpoint - The API endpoint path
 * @param {Object} params - Optional query parameters
 */
export const checkEndpoint = (endpoint, params = {}) => {
  // Get the base URL from axios instance
  const baseURL = axiosInstance.defaults.baseURL;
  
  // Build the full URL
  let fullUrl = `${baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }
  
  console.log('Full API URL:', fullUrl);
  return fullUrl;
};

/**
 * Checks if an endpoint has a redundant API prefix
 * @param {string} endpoint - The API endpoint path
 * @returns {boolean} - True if the endpoint has a redundant prefix
 */
export const hasRedundantPrefix = (endpoint) => {
  const apiPrefix = '/api';
  return endpoint.startsWith(apiPrefix);
};

/**
 * Scans an object for methods that make API calls and checks for redundant prefixes
 * @param {Object} apiModule - The API module to scan
 */
export const scanApiModule = (apiModule) => {
  console.group('API Module Scan');
  
  Object.entries(apiModule).forEach(([methodName, method]) => {
    // Extract the first string parameter that looks like an endpoint
    const methodStr = method.toString();
    
    // Use a safer regex approach
    let endpoint = null;
    const getMatch = methodStr.match(/axiosInstance\.get\(['"]([^'"]+)['"]/);
    const postMatch = methodStr.match(/axiosInstance\.post\(['"]([^'"]+)['"]/);
    const putMatch = methodStr.match(/axiosInstance\.put\(['"]([^'"]+)['"]/);
    const deleteMatch = methodStr.match(/axiosInstance\.delete\(['"]([^'"]+)['"]/);
    const patchMatch = methodStr.match(/axiosInstance\.patch\(['"]([^'"]+)['"]/);
    
    if (getMatch) endpoint = getMatch[1];
    else if (postMatch) endpoint = postMatch[1];
    else if (putMatch) endpoint = putMatch[1];
    else if (deleteMatch) endpoint = deleteMatch[1];
    else if (patchMatch) endpoint = patchMatch[1];
    
    if (endpoint) {
      const hasPrefix = hasRedundantPrefix(endpoint);
      
      console.log(
        `${methodName}: ${endpoint} ${hasPrefix ? '⚠️ HAS REDUNDANT PREFIX' : '✅ OK'}`
      );
    }
  });
  
  console.groupEnd();
};
