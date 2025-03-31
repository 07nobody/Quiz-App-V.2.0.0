/**
 * API Test Script
 * 
 * Run this script to test your API configuration and endpoints.
 * You can run it with: node api-test.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const API_PREFIX = '/api';
const ENDPOINTS = [
  '/users/get-user-info',
  '/settings/category/theme',
  '/settings/public',
  '/decks/user/123',
  '/flashcards/deck/456'
];

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000
});

// Test each endpoint
async function testEndpoints() {
  console.log('=== API ENDPOINT TEST ===');
  console.log(`Base URL: ${BASE_URL}${API_PREFIX}`);
  console.log('------------------------');
  
  for (const endpoint of ENDPOINTS) {
    const fullUrl = `${BASE_URL}${API_PREFIX}${endpoint}`;
    console.log(`Testing: ${endpoint}`);
    console.log(`Full URL: ${fullUrl}`);
    
    try {
      await axiosInstance.get(endpoint);
      console.log('✅ Success (or at least received a response)');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`❌ Error: ${error.response.status} - ${error.response.statusText}`);
        console.log(`Response data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('❌ Error: No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log(`❌ Error: ${error.message}`);
      }
    }
    console.log('------------------------');
  }
}

// Run the tests
testEndpoints().catch(error => {
  console.error('Test script error:', error);
});