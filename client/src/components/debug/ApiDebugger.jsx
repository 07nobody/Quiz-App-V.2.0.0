import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { axiosInstance } from '../../apicalls';

const ApiDebugger = () => {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [testEndpoint, setTestEndpoint] = useState('/users/get-user-info');
  const [testResponse, setTestResponse] = useState(null);
  const [testError, setTestError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [axiosConfig, setAxiosConfig] = useState({});
  const [requestMethod, setRequestMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [prefixWarning, setPrefixWarning] = useState(false);
  const [autoFixPrefix, setAutoFixPrefix] = useState(true);
  const [apiIssues, setApiIssues] = useState([]);

  // Memoize the health check URL to avoid recalculation
  const healthCheckUrl = useMemo(() => {
    const baseUrl = axiosInstance.defaults.baseURL || '';
    // Check if baseURL already includes /api
    const apiBase = baseUrl.includes('/api') 
      ? baseUrl.split('/api')[0] + '/api/health-check'
      : baseUrl + '/api/health-check';
    console.log('Health check URL:', apiBase);
    return apiBase;
  }, []);

  // Check server connectivity - optimized with useCallback
  const checkServer = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      console.log('Checking server at:', healthCheckUrl);  
      const response = await fetch(healthCheckUrl, { 
        method: 'GET',
        signal: controller.signal
      });
        
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('Connected');
      } else {
        setServerStatus(`Not Connected (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Server connectivity check failed:', error);
      setServerStatus(`Not Connected (Error: ${error.message})`);
    }
  }, [healthCheckUrl]);
    
  useEffect(() => {
    checkServer();
    
    // Get axios configuration
    setAxiosConfig({
      baseURL: axiosInstance.defaults.baseURL,
      timeout: axiosInstance.defaults.timeout,
      headers: axiosInstance.defaults.headers
    });

    // Check for common API configuration issues
    const issues = [];
    const baseUrl = axiosInstance.defaults.baseURL || '';
    
    if (baseUrl.includes('/api') && window.location.hostname === 'localhost') {
      issues.push('API prefix configured in baseURL with localhost: possible double prefixing');
    }
    
    setApiIssues(issues);
  }, [checkServer]);

  // Check for potential prefix issues - debounced to improve performance
  useEffect(() => {
    const checkPrefix = () => {
      if (testEndpoint.startsWith('/api/')) {
        setPrefixWarning(true);
      } else {
        setPrefixWarning(false);
      }
    };
    
    const timeoutId = setTimeout(checkPrefix, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [testEndpoint]);

  const normalizeEndpoint = useCallback((endpoint) => {
    if (autoFixPrefix && endpoint.startsWith('/api/')) {
      return endpoint.replace('/api/', '/');
    }
    return endpoint;
  }, [autoFixPrefix]);

  const handleTestEndpoint = async () => {
    setIsLoading(true);
    setTestResponse(null);
    setTestError(null);
    
    try {
      // Fix double prefix if enabled
      const endpoint = normalizeEndpoint(testEndpoint);
      
      // Log the full URL that will be used
      const fullUrl = `${axiosInstance.defaults.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      console.log('Testing API endpoint:', fullUrl);
      
      // Make the test request based on method
      let response;
      let parsedBody = null;
      
      if (requestBody && ['POST', 'PUT', 'PATCH'].includes(requestMethod)) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch (e) {
          console.warn('Invalid JSON in request body, sending as raw string');
          parsedBody = requestBody;
        }
      }
      
      switch (requestMethod) {
        case 'POST':
          response = await axiosInstance.post(endpoint, parsedBody);
          break;
        case 'PUT':
          response = await axiosInstance.put(endpoint, parsedBody);
          break;
        case 'PATCH':
          response = await axiosInstance.patch(endpoint, parsedBody);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(endpoint);
          break;
        default:
          response = await axiosInstance.get(endpoint);
      }
      
      setTestResponse(response.data);
    } catch (error) {
      console.error('Test request failed:', error);
      setTestError({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize common endpoints to avoid unnecessary re-renders
  const commonEndpoints = useMemo(() => [
    '/users/get-user-info',
    '/users/login',
    '/settings/category/theme',
    '/settings/public',
    '/decks/user/123',
    '/flashcards/deck/456'
  ], []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      margin: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>API Debugger</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Server Status</h3>
        <div style={{ 
          padding: '10px', 
          backgroundColor: serverStatus === 'Connected' ? '#d4edda' : '#f8d7da',
          borderRadius: '3px'
        }}>
          {serverStatus}
        </div>
      </div>
      
      {apiIssues.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
          <h3>Potential API Configuration Issues</h3>
          <ul>
            {apiIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test API Endpoint</h3>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <select 
              value={requestMethod}
              onChange={(e) => setRequestMethod(e.target.value)}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '8px', 
                marginRight: '10px',
                borderColor: prefixWarning ? 'orange' : undefined,
                backgroundColor: prefixWarning ? '#fff3cd' : undefined
              }}
              placeholder="Enter endpoint path (e.g., /users/profile)"
            />
            <button 
              onClick={handleTestEndpoint}
              disabled={isLoading}
              style={{ padding: '8px 16px' }}
            >
              {isLoading ? 'Testing...' : 'Test'}
            </button>
          </div>
          
          {prefixWarning && (
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '10px', 
              borderRadius: '3px',
              marginBottom: '10px'
            }}>
              ⚠️ Warning: Your endpoint starts with '/api/' which might cause a double prefix issue.
              <div style={{ marginTop: '5px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={autoFixPrefix} 
                    onChange={(e) => setAutoFixPrefix(e.target.checked)}
                  />
                  Auto-fix double prefix
                </label>
              </div>
              <div style={{ marginTop: '5px' }}>
                {autoFixPrefix && (
                  <small>
                    Will use: <code>{normalizeEndpoint(testEndpoint)}</code> instead of <code>{testEndpoint}</code>
                  </small>
                )}
              </div>
            </div>
          )}
          
          {['POST', 'PUT', 'PATCH'].includes(requestMethod) && (
            <div style={{ marginTop: '10px' }}>
              <h4>Request Body (JSON):</h4>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                style={{ 
                  width: '100%', 
                  height: '100px', 
                  padding: '8px',
                  fontFamily: 'monospace'
                }}
                placeholder='{"key": "value"}'
              />
            </div>
          )}
        </div>
        
        {testResponse && (
          <div style={{ marginTop: '10px' }}>
            <h4>Response:</h4>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          </div>
        )}
        
        {testError && (
          <div style={{ marginTop: '10px' }}>
            <h4>Error:</h4>
            <pre style={{ 
              backgroundColor: '#f8d7da', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(testError, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div>
        <h3>API Configuration</h3>
        <pre style={{ 
          backgroundColor: '#e9ecef', 
          padding: '10px', 
          borderRadius: '3px',
          overflow: 'auto'
        }}>
          {`Base URL: ${axiosConfig.baseURL || 'Loading...'}
Timeout: ${axiosConfig.timeout || 'Loading...'}ms
Headers: ${JSON.stringify(axiosConfig.headers || {}, null, 2)}`}
        </pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Common API Endpoints</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {commonEndpoints.map(endpoint => (
            <button
              key={endpoint}
              onClick={() => setTestEndpoint(endpoint)}
              style={{ 
                padding: '5px 10px',
                backgroundColor: testEndpoint === endpoint ? '#007bff' : '#e9ecef',
                color: testEndpoint === endpoint ? 'white' : 'black',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {endpoint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDebugger;
