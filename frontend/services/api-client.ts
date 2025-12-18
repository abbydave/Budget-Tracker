import axios from 'axios';

/**
 * FINANCEFLOW API CLIENT
 * ----------------------
 * This is the central "engine" for all backend communication.
 * * GUIDE FOR DEVELOPERS:
 * 1. DO NOT use raw 'fetch' or 'axios' in your components.
 * 2. IMPORT this 'apiClient' to make requests.
 * 3. AUTHENTICATION: You don't need to manually add Bearer tokens. 
 * The Interceptor below automatically grabs the token from storage 
 * and attaches it to the 'Authorization' header for you.
 * 4. BASE URL: Already set to the Render production server.
 * * EXAMPLE USAGE:
 * const response = await apiClient.get('/categories');
 */

const apiClient = axios.create({
  // Base URL from your FinanceFlow documentation
  baseURL: 'https://budget-tracker-nithub.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * This runs automatically before every outgoing request.
 */
apiClient.interceptors.request.use(
  (config) => {
    // 1. Try to get the token from localStorage (saved during login)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // 2. If token exists, inject it into the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * This runs automatically when a response comes back from the server.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // GLOBAL ERROR HANDLING: 
    // If the server returns 401 (Unauthorized), the token is likely expired.
    if (error.response?.status === 401) {
      console.warn('Session expired. Redirecting to login...');
      // Optional: Logic to clear storage and redirect to login could go here
    }
    return Promise.reject(error);
  }
);

export default apiClient;